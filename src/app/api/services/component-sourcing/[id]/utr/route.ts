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

    const body = await req.json();
    const { utrNumber } = body;

    if (!utrNumber || String(utrNumber).trim().length < 6) {
      return NextResponse.json(
        { error: "Valid 12-digit UTR or bank reference number is required." },
        { status: 400 }
      );
    }

    const cleanUtr = String(utrNumber).trim();

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

    // Check duplicate UTR across sourcing requests & order transactions
    const duplicate = await prisma.componentSourcingRequest.findFirst({
      where: {
        utrNumber: cleanUtr,
        id: { not: sourcingReq.id },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: `This UTR (${cleanUtr}) has already been submitted for another request (${duplicate.requestNumber}). Each payment reference may only be submitted once.` },
        { status: 400 }
      );
    }

    const updated = await prisma.componentSourcingRequest.update({
      where: { id: sourcingReq.id },
      data: {
        utrNumber: cleanUtr,
        utrSubmittedAt: new Date(),
        status: "PAYMENT_SUBMITTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `UTR Submitted: ${sourcingReq.requestNumber}`,
        message: `Your UTR reference ${cleanUtr} has been received for component sourcing order ${sourcingReq.requestNumber}. Pending manual bank credit verification.`,
        link: `/account`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "UTR reference submitted successfully! Operations will verify with bank records before initiating component procurement.",
      sourcingRequest: updated,
    });
  } catch (error: any) {
    console.error("Sourcing UTR submit error:", error);
    return NextResponse.json({ error: "Failed to submit UTR reference" }, { status: 500 });
  }
}
