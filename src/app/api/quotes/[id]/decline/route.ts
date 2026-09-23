import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UnifiedQuoteStatus, SourcingStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { reason } = body;

    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // IDOR Protection: Must belong to user
    if (quote.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You cannot decline another user's quote" }, { status: 403 });
    }

    if (
      quote.status === UnifiedQuoteStatus.PAYMENT_SUBMITTED ||
      quote.status === UnifiedQuoteStatus.PAYMENT_VERIFIED
    ) {
      return NextResponse.json(
        { error: "Cannot decline a quote after payment submission or verification" },
        { status: 400 }
      );
    }

    const updatedQuote = await prisma.$transaction(async (tx) => {
      const updated = await tx.quote.update({
        where: { id: quote.id },
        data: {
          status: UnifiedQuoteStatus.DECLINED,
          notes: reason ? `Declined by customer: ${reason}` : quote.notes,
        },
      });

      if (quote.sourcingRequestId) {
        await tx.componentSourcingRequest.update({
          where: { id: quote.sourcingRequestId },
          data: {
            status: SourcingStatus.REJECTED,
            adminNotes: reason ? `Customer declined quote: ${reason}` : undefined,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "DECLINE_QUOTE",
          entityType: "Quote",
          entityId: quote.id,
          changes: {
            previousStatus: quote.status,
            newStatus: UnifiedQuoteStatus.DECLINED,
            reason: reason || "No reason specified",
          },
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Quote declined.",
      quote: updatedQuote,
    });
  } catch (error: any) {
    console.error("POST /api/quotes/[id]/decline error:", error);
    return NextResponse.json({ error: "Failed to decline quote" }, { status: 500 });
  }
}
