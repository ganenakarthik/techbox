import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SourcingStatus } from "@prisma/client";

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
      status,
      quotedUnitPrice,
      quotedShippingFee = 0,
      quoteValidUntilDays = 7,
      adminNotes,
    } = body;

    const request = await prisma.componentSourcingRequest.findFirst({
      where: {
        OR: [{ id }, { requestNumber: id }],
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Sourcing request not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (status && Object.values(SourcingStatus).includes(status)) {
      updateData.status = status;
    }

    if (quotedUnitPrice !== undefined && quotedUnitPrice !== null && quotedUnitPrice !== "") {
      const unitPrice = parseFloat(String(quotedUnitPrice));
      const shipping = parseFloat(String(quotedShippingFee || 0));
      if (!isNaN(unitPrice)) {
        updateData.quotedUnitPrice = unitPrice;
        updateData.quotedShippingFee = isNaN(shipping) ? 0 : shipping;
        updateData.quotedTotalAmount = unitPrice * request.quantity + (isNaN(shipping) ? 0 : shipping);
        updateData.quoteValidUntil = new Date(Date.now() + quoteValidUntilDays * 24 * 60 * 60 * 1000);
        updateData.status = SourcingStatus.QUOTE_READY;

        // Upsert unified Quote record
        const quoteNumber = `Q-SRC-${request.requestNumber}`;
        const totalAmount = updateData.quotedTotalAmount;
        const validUntil = updateData.quoteValidUntil;

        await prisma.quote.upsert({
          where: { sourcingRequestId: request.id },
          create: {
            quoteNumber,
            userId: request.userId,
            serviceType: "COMPONENT_SOURCING",
            title: `Component Sourcing: ${request.componentName}`,
            description: `Procurement for ${request.quantity} units of ${request.componentName}`,
            status: "SENT",
            subtotal: unitPrice * request.quantity,
            shippingFee: isNaN(shipping) ? 0 : shipping,
            totalAmount,
            validUntil,
            sourcingRequestId: request.id,
            createdById: user.id,
            items: {
              create: [
                {
                  description: `${request.componentName} (MPN: ${request.mpn || "Standard"})`,
                  unitPrice,
                  quantity: request.quantity,
                  totalPrice: unitPrice * request.quantity,
                },
              ],
            },
          },
          update: {
            status: "SENT",
            subtotal: unitPrice * request.quantity,
            shippingFee: isNaN(shipping) ? 0 : shipping,
            totalAmount,
            validUntil,
          },
        });
      }
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes ? String(adminNotes).trim() : null;
    }

    const updated = await prisma.componentSourcingRequest.update({
      where: { id: request.id },
      data: updateData,
    });

    // Create Notification if quote generated or status updated
    if (updateData.status === SourcingStatus.QUOTE_READY) {
      await prisma.notification.create({
        data: {
          userId: request.userId,
          title: `Quote Ready: ${request.requestNumber}`,
          message: `Partsly engineering team has generated a quote for ${request.componentName}: ₹${updated.quotedTotalAmount} total.`,
          link: `/account`,
        },
      });
    }

    // Log admin audit
    await prisma.adminAuditLog.create({
      data: {
        adminId: user.id,
        action: "UPDATE_SOURCING_REQUEST",
        target: `Sourcing Request ${request.requestNumber}`,
        previousValue: { status: request.status, quote: request.quotedTotalAmount },
        newValue: { status: updated.status, quote: updated.quotedTotalAmount },
        details: `Updated sourcing request status to ${updated.status}. Admin notes: ${adminNotes || "None"}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sourcing request updated successfully.",
      sourcingRequest: updated,
    });
  } catch (error: any) {
    console.error("Admin sourcing PATCH [id] error:", error);
    return NextResponse.json({ error: "Failed to update sourcing request" }, { status: 500 });
  }
}
