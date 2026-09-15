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
    const { available, minThreshold, adjustAmount } = body;

    // Find inventory by variantId or id
    let inventory = await prisma.inventory.findFirst({
      where: {
        OR: [{ id }, { variantId: id }, { variant: { productId: id } }],
      },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory record not found" }, { status: 404 });
    }

    const prevAvailable = inventory.available;
    const prevThreshold = inventory.minThreshold;

    let newAvailable = prevAvailable;
    if (available !== undefined) {
      newAvailable = Math.max(0, parseInt(available, 10));
    } else if (adjustAmount !== undefined) {
      newAvailable = Math.max(0, prevAvailable + parseInt(adjustAmount, 10));
    }

    const newThreshold = minThreshold !== undefined ? Math.max(0, parseInt(minThreshold, 10)) : prevThreshold;

    const updated = await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        available: newAvailable,
        minThreshold: newThreshold,
      },
    });

    // Record audit log
    await logAdminAction({
      adminId: user.id,
      action: "UPDATE_INVENTORY",
      target: `SKU:${inventory.variant.sku}`,
      previousValue: { available: prevAvailable, minThreshold: prevThreshold },
      newValue: { available: newAvailable, minThreshold: newThreshold },
      details: `Stock updated for ${inventory.variant.product.name} (${inventory.variant.name}) from ${prevAvailable} to ${newAvailable}`,
    });

    return NextResponse.json({
      success: true,
      inventory: updated,
      message: `Stock updated to ${newAvailable} units`,
    });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
