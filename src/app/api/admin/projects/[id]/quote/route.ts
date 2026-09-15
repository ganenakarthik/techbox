import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { sendNotification } from "@/lib/email";
import { ProjectStatus, QuoteStatus } from "@prisma/client";

export async function POST(
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
    const {
      componentCost = 0,
      pcbCost = 0,
      assemblyCost = 0,
      printCost = 0,
      documentationCost = 0,
      serviceFee = 0,
      deliveryFee = 0,
      discount = 0,
      adminRemarks,
    } = body;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { quotes: { orderBy: { version: "desc" }, take: 1 } },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const nextVersion = (project.quotes[0]?.version || 0) + 1;
    const sub = Number(componentCost) + Number(pcbCost) + Number(assemblyCost) + Number(printCost) + Number(documentationCost) + Number(serviceFee) + Number(deliveryFee);
    const totalCost = Math.max(0, sub - Number(discount));

    const breakdown = {
      componentCost,
      pcbCost,
      assemblyCost,
      printCost,
      documentationCost,
      serviceFee,
      deliveryFee,
      discount,
    };

    const quote = await prisma.projectQuote.create({
      data: {
        projectId: project.id,
        version: nextVersion,
        status: QuoteStatus.SENT,
        componentCost,
        pcbCost,
        assemblyCost,
        printCost,
        documentationCost,
        serviceFee,
        deliveryFee,
        discount,
        totalCost,
        breakdown,
        adminRemarks: adminRemarks || null,
      },
    });

    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: ProjectStatus.QUOTE_SENT,
      },
    });

    // Record audit log
    await logAdminAction({
      adminId: user.id,
      action: "SEND_PROJECT_QUOTE",
      target: `Project:${project.projectCode}`,
      newValue: { quoteVersion: nextVersion, totalCost },
      details: `Sent quote v${nextVersion} (₹${totalCost}) for project ${project.title}`,
    });

    // Send notification
    await sendNotification({
      userId: project.userId,
      title: `Engineering Quote Sent for ${project.title}`,
      message: `Your project quote of ₹${totalCost} is ready for review and student approval.`,
      link: `/account`,
    });

    return NextResponse.json({
      success: true,
      quote,
      message: "Quote sent to customer successfully",
    });
  } catch (error) {
    console.error("Quote create error:", error);
    return NextResponse.json({ error: "Failed to send quote" }, { status: 500 });
  }
}
