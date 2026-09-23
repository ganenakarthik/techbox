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

    const body = await req.json();
    const { utrNumber } = body;

    const cleanUtr = String(utrNumber || "").trim();
    if (!cleanUtr || cleanUtr.length < 6 || cleanUtr.length > 20) {
      return NextResponse.json({ error: "Please enter a valid UTR / UPI Transaction Reference number" }, { status: 400 });
    }

    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // IDOR Protection: Must belong to authenticated user
    if (quote.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied to this quote" }, { status: 403 });
    }

    if (
      quote.status !== UnifiedQuoteStatus.PAYMENT_PENDING &&
      quote.status !== UnifiedQuoteStatus.ACCEPTED &&
      quote.status !== UnifiedQuoteStatus.PAYMENT_SUBMITTED
    ) {
      return NextResponse.json(
        { error: "Quote must be accepted and in PAYMENT_PENDING state to submit UTR" },
        { status: 400 }
      );
    }

    const updatedQuote = await prisma.$transaction(async (tx) => {
      const updated = await tx.quote.update({
        where: { id: quote.id },
        data: {
          utrNumber: cleanUtr,
          utrSubmittedAt: new Date(),
          status: UnifiedQuoteStatus.PAYMENT_SUBMITTED,
        },
      });

      if (quote.sourcingRequestId) {
        await tx.componentSourcingRequest.update({
          where: { id: quote.sourcingRequestId },
          data: {
            utrNumber: cleanUtr,
            utrSubmittedAt: new Date(),
            status: SourcingStatus.PAYMENT_SUBMITTED,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "SUBMIT_QUOTE_UTR",
          entityType: "Quote",
          entityId: quote.id,
          changes: {
            utrNumber: cleanUtr,
            previousStatus: quote.status,
            newStatus: UnifiedQuoteStatus.PAYMENT_SUBMITTED,
          },
        },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          title: `UTR Submitted for ${quote.quoteNumber}`,
          message: `UTR #${cleanUtr} submitted. Partsly operations team will verify your payment shortly.`,
          link: `/account/quotes/${quote.id}`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "UTR submitted successfully. Awaiting payment verification.",
      quote: updatedQuote,
    });
  } catch (error: any) {
    console.error("POST /api/quotes/[id]/utr error:", error);
    return NextResponse.json({ error: "Failed to submit UTR for quote" }, { status: 500 });
  }
}
