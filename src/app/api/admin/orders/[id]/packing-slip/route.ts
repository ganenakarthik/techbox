import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        items: {
          include: {
            variant: {
              include: {
                inventory: true,
                product: { select: { name: true, images: true } },
              },
            },
            projectKit: true,
          },
        },
        shipment: true,
        college: true,
        campus: true,
        pickupLocation: true,
        deliverySlot: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const packingItems = order.items.map((item) => ({
      itemId: item.id,
      sku: item.sku,
      productName: item.productName,
      variantName: item.variantName || "Standard",
      quantity: item.quantity,
      binLocation: item.variant?.inventory?.binLocation || "Bay 1-A",
      isKit: Boolean(item.projectKitId),
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    }));

    const packingSlip = {
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      utrNumber: order.utrNumber,
      status: order.status,
      recipient: {
        name: order.recipientName,
        phone: order.recipientPhone,
        college: order.college?.name || "College Campus",
        campus: order.campus?.name || "Main Campus",
        pickupLocation: order.pickupLocation?.name || "Designated Pickup Point",
        roomOrBlock: order.campusDetail,
        slot: order.deliverySlot?.slotName || "Standard Delivery Slot",
      },
      items: packingItems,
      totalQuantity: packingItems.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: Number(order.total),
      packedAt: order.packedAt,
      packedBy: order.packedBy,
      packingNotes: order.packingNotes,
      deliveryMethod: order.deliveryMethod,
      runnerName: order.runnerName,
      runnerPhone: order.runnerPhone,
    };

    return NextResponse.json({ success: true, packingSlip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
