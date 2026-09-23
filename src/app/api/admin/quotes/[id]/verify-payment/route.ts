import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UnifiedQuoteStatus, SourcingStatus, ProjectStatus } from "@prisma/client";

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

    const body = await req.json().catch(() => ({}));
    const { adminNotes } = body;

    const quote = await prisma.quote.findFirst({
      where: { OR: [{ id }, { quoteNumber: id }] },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.status === UnifiedQuoteStatus.PAYMENT_VERIFIED) {
      return NextResponse.json({ message: "Payment has already been verified for this quote", quote });
    }

    const updatedQuote = await prisma.$transaction(async (tx) => {
      const updated = await tx.quote.update({
        where: { id: quote.id },
        data: {
          status: UnifiedQuoteStatus.PAYMENT_VERIFIED,
          paymentVerifiedAt: new Date(),
          paymentVerifiedBy: user.email || user.name || user.id,
          adminNotes: adminNotes ? String(adminNotes).trim() : quote.adminNotes,
        },
      });

      if (quote.sourcingRequestId) {
        await tx.componentSourcingRequest.update({
          where: { id: quote.sourcingRequestId },
          data: {
            status: SourcingStatus.PAYMENT_VERIFIED,
            paymentVerifiedAt: new Date(),
            paymentVerifiedBy: user.email || user.name || user.id,
          },
        });
      }

      if (quote.projectId) {
        await tx.project.update({
          where: { id: quote.projectId },
          data: {
            status: ProjectStatus.IN_PRODUCTION,
          },
        });
      }

      await tx.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "VERIFY_QUOTE_PAYMENT",
          target: `Quote ${quote.quoteNumber}`,
          previousValue: { status: quote.status, utr: quote.utrNumber },
          newValue: { status: UnifiedQuoteStatus.PAYMENT_VERIFIED },
          details: `Verified payment UTR ${quote.utrNumber || "N/A"} for Quote #${quote.quoteNumber}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: quote.userId,
          title: `Payment Verified: Quote #${quote.quoteNumber}`,
          message: `Your payment of ₹${Number(quote.totalAmount)} for Quote #${quote.quoteNumber} has been verified! Procurement & execution is now in progress.`,
          link: `/account/quotes/${quote.id}`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
      quote: updatedQuote,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/quotes/[id]/verify-payment error:", error);
    return NextResponse.json({ error: "Failed to verify quote payment" }, { status: 500 });
  }
}
