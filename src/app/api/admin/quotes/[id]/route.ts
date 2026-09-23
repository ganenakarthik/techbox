import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UnifiedQuoteStatus } from "@prisma/client";

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

    const quote = await prisma.quote.findFirst({
      where: { OR: [{ id }, { quoteNumber: id }] },
      include: {
        user: true,
        items: true,
        sourcingRequest: true,
        project: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ quote });
  } catch (error: any) {
    console.error("GET /api/admin/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch admin quote details" }, { status: 500 });
  }
}

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
      title,
      description,
      status,
      items,
      shippingFee,
      tax,
      discount,
      validUntilDays,
      notes,
      adminNotes,
    } = body;

    const existingQuote = await prisma.quote.findFirst({
      where: { OR: [{ id }, { quoteNumber: id }] },
      include: { items: true },
    });

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (title) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = description ? String(description).trim() : null;
    if (notes !== undefined) updateData.notes = notes ? String(notes).trim() : null;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes ? String(adminNotes).trim() : null;

    if (status && Object.values(UnifiedQuoteStatus).includes(status)) {
      updateData.status = status;
    }

    if (validUntilDays) {
      updateData.validUntil = new Date(Date.now() + parseInt(String(validUntilDays), 10) * 24 * 60 * 60 * 1000);
    }

    // Recalculate line items & totals if items or financial fields are passed
    if (items || shippingFee !== undefined || tax !== undefined || discount !== undefined) {
      let subtotal = 0;
      let newItems: any[] = [];

      if (items && Array.isArray(items)) {
        newItems = items.map((item: any) => {
          const unitPrice = parseFloat(String(item.unitPrice || 0));
          const qty = parseInt(String(item.quantity || 1), 10);
          const itemTotal = unitPrice * (isNaN(qty) || qty <= 0 ? 1 : qty);
          subtotal += itemTotal;
          return {
            description: String(item.description || "Quote Line Item").trim(),
            unitPrice,
            quantity: isNaN(qty) || qty <= 0 ? 1 : qty,
            totalPrice: itemTotal,
          };
        });
      } else {
        subtotal = Number(existingQuote.subtotal);
      }

      const parsedShipping = shippingFee !== undefined ? parseFloat(String(shippingFee)) : Number(existingQuote.shippingFee);
      const parsedTax = tax !== undefined ? parseFloat(String(tax)) : Number(existingQuote.tax);
      const parsedDiscount = discount !== undefined ? parseFloat(String(discount)) : Number(existingQuote.discount);

      const totalAmount = Math.max(0, subtotal + parsedShipping + parsedTax - parsedDiscount);

      updateData.subtotal = subtotal;
      updateData.shippingFee = parsedShipping;
      updateData.tax = parsedTax;
      updateData.discount = parsedDiscount;
      updateData.totalAmount = totalAmount;

      if (items && Array.isArray(items)) {
        // Replace items
        await prisma.quoteItem.deleteMany({ where: { quoteId: existingQuote.id } });
        updateData.items = { create: newItems };
      }
    }

    const updated = await prisma.quote.update({
      where: { id: existingQuote.id },
      data: updateData,
      include: { items: true, user: { select: { id: true, email: true, name: true } } },
    });

    // Notify customer if status set to SENT
    if (status === UnifiedQuoteStatus.SENT && existingQuote.status !== UnifiedQuoteStatus.SENT) {
      await prisma.notification.create({
        data: {
          userId: updated.userId,
          title: `Quote Ready: #${updated.quoteNumber}`,
          message: `Your quote #${updated.quoteNumber} for ₹${Number(updated.totalAmount)} is ready for review.`,
          link: `/account/quotes/${updated.id}`,
        },
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId: user.id,
        action: "UPDATE_QUOTE",
        target: `Quote ${updated.quoteNumber}`,
        previousValue: { status: existingQuote.status, total: Number(existingQuote.totalAmount) },
        newValue: { status: updated.status, total: Number(updated.totalAmount) },
        details: `Updated quote #${updated.quoteNumber}. Status: ${updated.status}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully",
      quote: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update admin quote" }, { status: 500 });
  }
}
