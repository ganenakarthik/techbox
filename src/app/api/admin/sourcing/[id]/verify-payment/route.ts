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
    const { action = "APPROVE", reason = "" } = body;

    const request = await prisma.componentSourcingRequest.findFirst({
      where: {
        OR: [{ id }, { requestNumber: id }],
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Sourcing request not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      const updated = await prisma.componentSourcingRequest.update({
        where: { id: request.id },
        data: {
          status: SourcingStatus.SOURCING,
          paymentVerifiedAt: new Date(),
          paymentVerifiedBy: user.id,
        },
      });

      await prisma.notification.create({
        data: {
          userId: request.userId,
          title: `Sourcing Payment Verified: ${request.requestNumber}`,
          message: `Your payment of ₹${request.quotedTotalAmount} has been verified. Procurement of ${request.componentName} is now active!`,
          link: `/account`,
        },
      });

      await prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "VERIFY_SOURCING_PAYMENT",
          target: `Sourcing Request ${request.requestNumber}`,
          previousValue: { status: request.status },
          newValue: { status: SourcingStatus.SOURCING, paymentVerifiedAt: new Date() },
          details: `Verified UTR ${request.utrNumber || "N/A"} for component sourcing. Procurement initiated.`,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Sourcing payment verified successfully. Procurement state set to SOURCING.",
        sourcingRequest: updated,
      });
    } else {
      const updated = await prisma.componentSourcingRequest.update({
        where: { id: request.id },
        data: {
          status: SourcingStatus.REJECTED,
          adminNotes: reason ? `Payment verification failed: ${reason}` : request.adminNotes,
        },
      });

      await prisma.notification.create({
        data: {
          userId: request.userId,
          title: `Sourcing Payment Rejected: ${request.requestNumber}`,
          message: `The UTR provided (${request.utrNumber || "None"}) could not be verified: ${reason || "Invalid details"}. Please contact support.`,
          link: `/account`,
        },
      });

      await prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "REJECT_SOURCING_PAYMENT",
          target: `Sourcing Request ${request.requestNumber}`,
          previousValue: { status: request.status },
          newValue: { status: SourcingStatus.REJECTED },
          details: `Rejected UTR. Reason: ${reason || "Invalid transaction details"}.`,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Sourcing payment rejected.",
        sourcingRequest: updated,
      });
    }
  } catch (error: any) {
    console.error("Admin sourcing verify payment error:", error);
    return NextResponse.json({ error: "Failed to verify sourcing payment" }, { status: 500 });
  }
}
