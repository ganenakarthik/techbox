import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { variants: { some: { sku: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      categoryId,
      categorySlug,
      brandId,
      brandSlug,
      price,
      mrp,
      sku,
      initialStock = 50,
      specs = {},
      images = [],
      isFeatured = false,
      pinoutUrl,
      datasheetUrl,
    } = body;

    if (!name || !price || !mrp) {
      return NextResponse.json(
        { error: "Name, price, and mrp are required" },
        { status: 400 }
      );
    }

    // Resolve or fallback category
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId) {
      let cat = await prisma.category.findFirst({
        where: categorySlug ? { slug: categorySlug } : {},
      });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: "Electronics & Microcontrollers",
            slug: "microcontrollers",
          },
        });
      }
      resolvedCategoryId = cat.id;
    }

    // Resolve or fallback brand
    let resolvedBrandId = brandId;
    if (!resolvedBrandId) {
      let br = await prisma.brand.findFirst({
        where: brandSlug ? { slug: brandSlug } : {},
      });
      if (!br) {
        br = await prisma.brand.create({
          data: {
            name: "TechBox Lab",
            slug: "techbox-lab",
          },
        });
      }
      resolvedBrandId = br.id;
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const generatedSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const generatedSku = sku || `SKU-${Date.now().toString().slice(-6)}`;

    // Create product, variant, and inventory atomically in transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: generatedSlug,
          brandId: resolvedBrandId,
          categoryId: resolvedCategoryId,
          description: description || `${name} engineered for college electronics labs.`,
          specs: specs || {},
          images: images.length > 0 ? images : ["/images/techbox-upi-qr.jpg"],
          isFeatured: Boolean(isFeatured),
          pinoutUrl,
          datasheetUrl,
        },
      });

      const variant = await tx.productVariant.create({
        data: {
          productId: product.id,
          name: "Standard",
          sku: generatedSku,
          price: Number(price),
          mrp: Number(mrp),
          discount: Math.max(0, Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)),
        },
      });

      await tx.inventory.create({
        data: {
          variantId: variant.id,
          available: Number(initialStock),
          reserved: 0,
          sold: 0,
          minThreshold: 5,
        },
      });

      return product;
    });

    // Record audit log
    await logAdminAction({
      adminId: user.id,
      action: "CREATE_PRODUCT",
      target: `Product:${newProduct.id} (${newProduct.name})`,
      newValue: { name, price, initialStock },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create product error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
