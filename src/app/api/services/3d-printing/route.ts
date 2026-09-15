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
      partName,
      material = "PLA",
      infillPercent = 20,
      color = "Black",
      layerHeight = "0.2mm Standard",
      quantity = 1,
      stlFileUrl,
      stlFileName,
    } = body;

    if (!partName) {
      return NextResponse.json({ error: "Part name is required" }, { status: 400 });
    }

    const orderNumber = `3DP-${Math.floor(100000 + Math.random() * 900000)}`;

    const printOrder = await prisma.printOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        partName: partName.trim(),
        material,
        infillPercent: Number(infillPercent),
        color,
        layerHeight,
        quantity: Number(quantity),
        stlFileUrl: stlFileUrl || null,
        stlFileName: stlFileName || null,
        status: "REQUESTED",
      },
    });

    await sendNotification({
      userId: user.id,
      title: `3D Print Order ${orderNumber} Submitted!`,
      message: `Your ${material} 3D print request for "${partName}" is queued for dimensional review.`,
      link: `/account`,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      printOrder,
      message: "3D printing order submitted successfully.",
    });
  } catch (error) {
    console.error("3D Print order error:", error);
    return NextResponse.json({ error: "Failed to submit 3D print order" }, { status: 500 });
  }
}
