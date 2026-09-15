import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text content is required for analysis" }, { status: 400 });
    }

    // Split into raw lines and remove empty lines
    const rawLines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2 && !l.startsWith("#") && !l.toLowerCase().startsWith("extracted from"));

    // Fetch all products with variants & inventory from database
    const dbProducts = await prisma.product.findMany({
      include: {
        variants: {
          include: {
            inventory: true,
          },
        },
        category: true,
      },
    });

    const matchedComponents: any[] = [];

    for (let index = 0; index < rawLines.length; index++) {
      const line = rawLines[index];

      // Extract quantity if present (e.g. "Qty: 2", ",2", "x2")
      let qty = 1;
      const qtyMatch = line.match(/(?:qty[:\s]*|x|\b)(\d+)\b/i);
      if (qtyMatch && qtyMatch[1]) {
        const parsed = parseInt(qtyMatch[1], 10);
        if (parsed > 0 && parsed <= 500) qty = parsed;
      }

      // Clean search keyword
      const cleanKeyword = line
        .replace(/(?:qty[:\s]*|x|\b)\d+\b/gi, "")
        .replace(/[,;()]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      // Look for matches in dbProducts
      let bestMatch: any = null;
      let highestScore = 0;

      for (const p of dbProducts) {
        const pNameLower = p.name.toLowerCase();

        // Exact substring
        if (pNameLower.includes(cleanKeyword) || cleanKeyword.includes(pNameLower)) {
          bestMatch = p;
          highestScore = 0.95;
          break;
        }

        // Token intersection
        const pTokens = pNameLower.split(/\s+/);
        const lineTokens = cleanKeyword.split(/\s+/).filter((t) => t.length > 2);
        const overlap = lineTokens.filter((t) => pTokens.some((pt) => pt.includes(t) || t.includes(pt)));

        if (overlap.length > 0) {
          const score = (overlap.length / Math.max(pTokens.length, lineTokens.length)) * 0.9;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = p;
          }
        }
      }

      if (bestMatch && highestScore >= 0.3) {
        const variant = bestMatch.variants[0];
        const availableStock = variant?.inventory?.available ?? 0;
        const confidence = highestScore >= 0.7 ? 0.95 : 0.65;

        matchedComponents.push({
          id: `bom-${index}-${bestMatch.id}`,
          originalLine: line,
          productId: bestMatch.id,
          variantId: variant?.id,
          name: bestMatch.name,
          sku: variant?.sku || "SKU-AUTO",
          category: bestMatch.category.name,
          quantity: qty,
          unitPrice: variant ? Number(variant.price) : 100,
          totalPrice: (variant ? Number(variant.price) : 100) * qty,
          image: (bestMatch.images as string[])?.[0] || "/placeholder.png",
          available: availableStock >= qty,
          stock: availableStock,
          confidence,
          needsReview: confidence < 0.8,
          reviewPrompt: confidence < 0.8 ? "Please review this component." : null,
        });
      } else {
        // Unmatched fallback component
        matchedComponents.push({
          id: `bom-${index}-unmatched`,
          originalLine: line,
          productId: null,
          variantId: null,
          name: line,
          sku: "CUSTOM-PART",
          category: "General Hardware",
          quantity: qty,
          unitPrice: 50,
          totalPrice: 50 * qty,
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
          available: true,
          stock: 99,
          confidence: 0.4,
          needsReview: true,
          reviewPrompt: "Component not in primary catalog. Manual quote will be attached.",
        });
      }
    }

    const totalDetected = matchedComponents.length;
    const totalAvailable = matchedComponents.filter((c) => c.available).length;
    const estimatedKitPrice = matchedComponents.reduce((sum, c) => sum + c.totalPrice, 0);

    return NextResponse.json({
      success: true,
      matchedComponents,
      summary: {
        totalDetected,
        totalAvailable,
        estimatedKitPrice,
        catalogMatchRate: totalDetected > 0 ? Math.round((totalAvailable / totalDetected) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("BOM analyze error:", error);
    return NextResponse.json({ error: "Failed to analyze BOM requirements" }, { status: 500 });
  }
}
