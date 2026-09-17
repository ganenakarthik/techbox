import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "An array of products is required for bulk import" }, { status: 400 });
    }

    const imported = [];
    const errors = [];

    for (const item of products) {
      try {
        const {
          name,
          sku,
          brandName = "Generic",
          categoryName = "Electronic Components",
          description = "",
          price,
          mrp,
          stock = 0,
          binLocation = "Warehouse Bay 1-A",
          reorderThreshold = 10,
          specs = {},
          images = [],
          pinoutUrl,
          datasheetUrl,
        } = item;

        if (!name || !sku || price === undefined) {
          errors.push({ sku: sku || "UNKNOWN", error: "Name, SKU, and price are required" });
          continue;
        }

        // Upsert Brand
        const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const brand = await prisma.brand.upsert({
          where: { slug: brandSlug },
          update: { name: brandName },
          create: { name: brandName, slug: brandSlug },
        });

        // Upsert Category
        const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const category = await prisma.category.upsert({
          where: { slug: catSlug },
          update: { name: categoryName },
          create: { name: categoryName, slug: catSlug },
        });

        const prodSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + sku.toLowerCase().replace(/[^a-z0-9]/g, "-");

        // Upsert Product
        const product = await prisma.product.upsert({
          where: { slug: prodSlug },
          update: {
            name,
            description,
            brandId: brand.id,
            categoryId: category.id,
            specs: typeof specs === "string" ? JSON.parse(specs) : specs,
            images: Array.isArray(images) && images.length > 0 ? images : ["/images/partsly-upi-qr.jpg"],
            pinoutUrl,
            datasheetUrl,
          },
          create: {
            name,
            slug: prodSlug,
            description,
            brandId: brand.id,
            categoryId: category.id,
            specs: typeof specs === "string" ? JSON.parse(specs) : specs,
            images: Array.isArray(images) && images.length > 0 ? images : ["/images/partsly-upi-qr.jpg"],
            pinoutUrl,
            datasheetUrl,
          },
        });

        // Upsert Variant
        const variant = await prisma.productVariant.upsert({
          where: { sku },
          update: {
            name: "Standard",
            price: Number(price),
            mrp: Number(mrp || price),
          },
          create: {
            productId: product.id,
            name: "Standard",
            sku,
            price: Number(price),
            mrp: Number(mrp || price),
          },
        });

        // Upsert Inventory
        const inventory = await prisma.inventory.upsert({
          where: { variantId: variant.id },
          update: {
            available: Number(stock),
            binLocation,
            reorderThreshold: Number(reorderThreshold),
          },
          create: {
            variantId: variant.id,
            available: Number(stock),
            binLocation,
            reorderThreshold: Number(reorderThreshold),
          },
        });

        imported.push({ sku, name, variantId: variant.id, available: inventory.available });
      } catch (err: any) {
        errors.push({ sku: item.sku || "UNKNOWN", error: err.message });
      }
    }

    await logAdminAction({
      adminId: user.id,
      action: "BULK_IMPORT_CATALOG",
      target: "ProductCatalog",
      previousValue: null,
      newValue: { count: imported.length, errors: errors.length },
      details: `Imported/Updated ${imported.length} products into Partsly catalog`,
    });

    return NextResponse.json({
      success: true,
      importedCount: imported.length,
      errorsCount: errors.length,
      imported,
      errors,
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
