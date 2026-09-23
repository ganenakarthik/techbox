import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UnifiedQuoteStatus, SourcingStatus, ProjectStatus } from "@prisma/client";

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

    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
      include: {
        sourcingRequest: true,
        project: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Security check: Customer must own the quote
    if (quote.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You cannot accept another customer's quote" }, { status: 403 });
    }

    // Check validity state
    if (quote.status === UnifiedQuoteStatus.ACCEPTED || quote.status === UnifiedQuoteStatus.PAYMENT_PENDING || quote.status === UnifiedQuoteStatus.PAYMENT_SUBMITTED || quote.status === UnifiedQuoteStatus.PAYMENT_VERIFIED) {
      return NextResponse.json({ error: "Quote has already been accepted" }, { status: 400 });
    }

    if (quote.status === UnifiedQuoteStatus.DECLINED || quote.status === UnifiedQuoteStatus.REJECTED || quote.status === UnifiedQuoteStatus.CANCELLED) {
      return NextResponse.json({ error: "Cannot accept a declined or cancelled quote" }, { status: 400 });
    }

    if (quote.validUntil && new Date(quote.validUntil) < new Date()) {
      // Mark expired
      await prisma.quote.update({
        where: { id: quote.id },
        data: { status: UnifiedQuoteStatus.EXPIRED },
      });
      return NextResponse.json({ error: "Quote validity period has expired" }, { status: 400 });
    }

    // Execute state transition to ACCEPTED -> PAYMENT_PENDING inside transaction
    const updatedQuote = await prisma.$transaction(async (tx) => {
      const updated = await tx.quote.update({
        where: { id: quote.id },
        data: {
          status: UnifiedQuoteStatus.PAYMENT_PENDING,
        },
      });

      // Synchronize associated Component Sourcing Request if present
      if (quote.sourcingRequestId) {
        await tx.componentSourcingRequest.update({
          where: { id: quote.sourcingRequestId },
          data: {
            status: SourcingStatus.PAYMENT_PENDING,
          },
        });
      }

      // Synchronize associated Project if present
      if (quote.projectId) {
        await tx.project.update({
          where: { id: quote.projectId },
          data: {
            status: ProjectStatus.APPROVED,
          },
        });
      }

      // Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "ACCEPT_QUOTE",
          entityType: "Quote",
          entityId: quote.id,
          changes: {
            previousStatus: quote.status,
            newStatus: UnifiedQuoteStatus.PAYMENT_PENDING,
            quoteNumber: quote.quoteNumber,
            totalAmount: Number(quote.totalAmount),
          },
        },
      });

      // Send Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: `Quote Accepted: ${quote.quoteNumber}`,
          message: `Your quote #${quote.quoteNumber} for ₹${Number(quote.totalAmount)} has been accepted. Please submit payment via Scan & Pay UPI to initiate dispatch.`,
          link: `/account/quotes/${quote.id}`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Quote accepted successfully. Status moved to PAYMENT_PENDING.",
      quote: updatedQuote,
    });
  } catch (error: any) {
    console.error("POST /api/quotes/[id]/accept error:", error);
    return NextResponse.json({ error: "Failed to accept quote" }, { status: 500 });
  }
}
