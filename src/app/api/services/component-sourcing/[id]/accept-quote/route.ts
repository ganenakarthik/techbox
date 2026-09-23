import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sourcingReq = await prisma.componentSourcingRequest.findFirst({
      where: {
        OR: [{ id }, { requestNumber: id }],
      },
    });

    if (!sourcingReq) {
      return NextResponse.json({ error: "Sourcing request not found" }, { status: 404 });
    }

    if (sourcingReq.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (sourcingReq.status !== "QUOTE_READY") {
      return NextResponse.json(
        { error: `Cannot accept quote in current state (${sourcingReq.status}). Quote must be in QUOTE_READY status.` },
        { status: 400 }
      );
    }

    const updated = await prisma.componentSourcingRequest.update({
      where: { id: sourcingReq.id },
      data: {
        status: "PAYMENT_PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Quote Accepted: ${sourcingReq.requestNumber}`,
        message: `You accepted the quote for ${sourcingReq.componentName}. Please scan & pay via UPI and submit your 12-digit UTR reference.`,
        link: `/account`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quote accepted! Please proceed to complete UPI payment and submit your UTR reference.",
      sourcingRequest: updated,
    });
  } catch (error: any) {
    console.error("Accept quote error:", error);
    return NextResponse.json({ error: "Failed to accept quote" }, { status: 500 });
  }
}
