import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await req.json();
    const {
      projectName,
      layers = 2,
      dimensions = "100x100mm",
      quantity = 5,
      thickness = "1.6mm",
      solderMaskColor = "Green",
      silkscreenColor = "White",
      surfaceFinish = "HASL",
      copperWeight = "1oz",
      gerberFileUrl,
      gerberFileName,
    } = body;

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const orderNumber = `PCB-${Math.floor(100000 + Math.random() * 900000)}`;

    const pcbOrder = await prisma.pCBOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        projectName: projectName.trim(),
        layers: Number(layers),
        dimensions,
        quantity: Number(quantity),
        thickness,
        solderMaskColor,
        silkscreenColor,
        surfaceFinish,
        copperWeight,
        gerberFileUrl: gerberFileUrl || null,
        gerberFileName: gerberFileName || null,
        status: "REQUESTED",
      },
    });

    await sendNotification({
      userId: user.id,
      title: `PCB Request ${orderNumber} Submitted!`,
      message: `Your ${layers}-layer PCB fabrication request for "${projectName}" has been submitted for engineering review.`,
      link: `/account`,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      pcbOrder,
      message: "PCB fabrication request submitted successfully for engineering review.",
    });
  } catch (error) {
    console.error("PCB order error:", error);
    return NextResponse.json({ error: "Failed to submit PCB order" }, { status: 500 });
  }
}
