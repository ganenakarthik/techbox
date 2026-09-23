import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to submit a sourcing request. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      componentName,
      manufacturer,
      mpn,
      quantity = 1,
      packageType,
      preferredBrand,
      specifications,
      acceptableAlts,
      targetUnitPrice,
      urgency = "Standard (5-7 days)",
      notes,
      referenceFileName,
    } = body;

    if (!componentName || !String(componentName).trim()) {
      return NextResponse.json(
        { error: "Component name or description is required." },
        { status: 400 }
      );
    }

    const parsedQty = Math.max(1, parseInt(String(quantity), 10) || 1);
    const parsedTargetPrice = targetUnitPrice ? parseFloat(String(targetUnitPrice)) : null;

    const requestNumber = `SRC-${Math.floor(100000 + Math.random() * 900000)}`;

    const sourcingRequest = await prisma.componentSourcingRequest.create({
      data: {
        requestNumber,
        userId: user.id,
        componentName: String(componentName).trim(),
        manufacturer: manufacturer ? String(manufacturer).trim() : null,
        mpn: mpn ? String(mpn).trim() : null,
        quantity: parsedQty,
        packageType: packageType ? String(packageType).trim() : null,
        preferredBrand: preferredBrand ? String(preferredBrand).trim() : null,
        specifications: specifications ? String(specifications).trim() : null,
        acceptableAlts: acceptableAlts ? String(acceptableAlts).trim() : null,
        targetUnitPrice: parsedTargetPrice && !isNaN(parsedTargetPrice) ? parsedTargetPrice : null,
        urgency: String(urgency).trim(),
        notes: notes ? String(notes).trim() : null,
        referenceFileName: referenceFileName ? String(referenceFileName).trim() : null,
        status: "SUBMITTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Sourcing Request Received: ${requestNumber}`,
        message: `Your sourcing request for "${componentName}" has been submitted for engineering procurement review.`,
        link: `/account`,
      },
    });

    return NextResponse.json({
      success: true,
      requestNumber,
      sourcingRequest,
      message: "Sourcing request submitted successfully. Our engineering procurement team will review your specifications.",
    });
  } catch (error: any) {
    console.error("Component sourcing POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit component sourcing request." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.componentSourcingRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("Component sourcing GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch sourcing requests." },
      { status: 500 }
    );
  }
}
