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
      adjustmentType = "MANUAL_ADJUSTMENT",
      quantity,
      reason,
      binLocation,
      reorderThreshold,
      minThreshold,
    } = body;

    // Find inventory by id, variantId, or productId
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

    const prevSnapshot = {
      available: inventory.available,
      reserved: inventory.reserved,
      allocated: inventory.allocated,
      sold: inventory.sold,
      damaged: inventory.damaged,
      incoming: inventory.incoming,
      binLocation: inventory.binLocation,
      reorderThreshold: inventory.reorderThreshold,
    };

    let updateData: any = {};
    const qty = parseInt(quantity ?? 0, 10);

    switch (adjustmentType) {
      case "RECEIVE_STOCK":
        // e.g. "Received 50 ESP32 boards from supplier"
        updateData.available = inventory.available + Math.max(0, qty);
        break;

      case "MARK_DAMAGED":
        // Moves from available to damaged
        const toDamage = Math.min(inventory.available, Math.max(0, qty));
        updateData.available = inventory.available - toDamage;
        updateData.damaged = inventory.damaged + toDamage;
        break;

      case "WRITE_OFF_DAMAGED":
        // Disposed of broken boards permanently
        updateData.damaged = Math.max(0, inventory.damaged - Math.max(0, qty));
        break;

      case "INCOMING_ORDER":
        // Purchase order created with vendor
        updateData.incoming = Math.max(0, inventory.incoming + qty);
        break;

      case "CYCLE_COUNT_ADJUSTMENT":
        // Physical audit on shelf
        if (body.newAvailable !== undefined) {
          updateData.available = Math.max(0, parseInt(body.newAvailable, 10));
        }
        break;

      case "SET_BIN_LOCATION":
        if (binLocation) {
          updateData.binLocation = binLocation;
        }
        break;

      default:
        if (body.available !== undefined) {
          updateData.available = Math.max(0, parseInt(body.available, 10));
        }
        if (body.adjustAmount !== undefined) {
          updateData.available = Math.max(0, inventory.available + parseInt(body.adjustAmount, 10));
        }
        break;
    }

    if (binLocation) updateData.binLocation = binLocation;
    if (reorderThreshold !== undefined) updateData.reorderThreshold = Math.max(0, parseInt(reorderThreshold, 10));
    if (minThreshold !== undefined) updateData.minThreshold = Math.max(0, parseInt(minThreshold, 10));

    const updated = await prisma.inventory.update({
      where: { id: inventory.id },
      data: updateData,
    });

    // Record immutable audit log
    await logAdminAction({
      adminId: user.id,
      action: `INVENTORY_${adjustmentType}`,
      target: `SKU:${inventory.variant.sku}`,
      previousValue: prevSnapshot,
      newValue: {
        available: updated.available,
        reserved: updated.reserved,
        allocated: updated.allocated,
        damaged: updated.damaged,
        incoming: updated.incoming,
        binLocation: updated.binLocation,
      },
      details: reason || `Inventory adjustment (${adjustmentType}) performed by ${user.name}`,
    });

    return NextResponse.json({
      success: true,
      message: `Inventory updated for ${inventory.variant.sku}`,
      inventory: updated,
    });
  } catch (error: any) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
