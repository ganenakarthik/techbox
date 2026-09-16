import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
        inventory: true,
      },
      orderBy: { sku: "asc" },
    });

    const items = variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      variantName: v.name,
      productName: v.product.name,
      category: v.product.category.name,
      brand: v.product.brand.name,
      price: Number(v.price),
      mrp: Number(v.mrp),
      inventoryId: v.inventory?.id,
      available: v.inventory?.available ?? 0,
      reserved: v.inventory?.reserved ?? 0,
      allocated: v.inventory?.allocated ?? 0,
      sold: v.inventory?.sold ?? 0,
      damaged: v.inventory?.damaged ?? 0,
      incoming: v.inventory?.incoming ?? 0,
      binLocation: v.inventory?.binLocation || "Warehouse Bay 1-A",
      minThreshold: v.inventory?.minThreshold ?? 5,
      reorderThreshold: v.inventory?.reorderThreshold ?? 10,
      isLowStock: (v.inventory?.available ?? 0) <= (v.inventory?.minThreshold ?? 5),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin inventory GET error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
