import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      isFeatured,
      isBestseller,
      price,
      mrp,
      specs,
      pinoutUrl,
      datasheetUrl,
    } = body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isBestseller !== undefined) updateData.isBestseller = Boolean(isBestseller);
    if (specs !== undefined) updateData.specs = specs;
    if (pinoutUrl !== undefined) updateData.pinoutUrl = pinoutUrl;
    if (datasheetUrl !== undefined) updateData.datasheetUrl = datasheetUrl;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // If price or mrp updated, update default variant
    if (price !== undefined || mrp !== undefined) {
      const firstVariant = existing.variants[0];
      if (firstVariant) {
        const newPrice = price !== undefined ? Number(price) : Number(firstVariant.price);
        const newMrp = mrp !== undefined ? Number(mrp) : Number(firstVariant.mrp);
        const discount = Math.max(0, Math.round(((newMrp - newPrice) / newMrp) * 100));

        await prisma.productVariant.update({
          where: { id: firstVariant.id },
          data: {
            price: newPrice,
            mrp: newMrp,
            discount,
          },
        });
      }
    }

    await logAdminAction({
      adminId: user.id,
      action: "UPDATE_PRODUCT",
      target: `Product:${id} (${existing.name})`,
      newValue: body,
      previousValue: { name: existing.name, isFeatured: existing.isFeatured },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Admin product PATCH error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can delete products" }, { status: 403 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    await logAdminAction({
      adminId: user.id,
      action: "DELETE_PRODUCT",
      target: `Product:${id} (${product.name})`,
    });

    return NextResponse.json({ success: true, message: `Product ${product.name} deleted` });
  } catch (error: any) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
