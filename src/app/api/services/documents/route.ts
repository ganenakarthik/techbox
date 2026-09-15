import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendNotification } from "@/lib/email";
import { DocServiceType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await req.json();
    const {
      projectTitle,
      docType = "REPORT",
      pageCount = 30,
      formattingStyle = "IEEE Standard",
      deadline,
      referenceFileUrl,
    } = body;

    if (!projectTitle) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const orderNumber = `DOC-${Math.floor(100000 + Math.random() * 900000)}`;

    let type: DocServiceType = DocServiceType.REPORT;
    if (docType === "PPT") type = DocServiceType.PPT;
    else if (docType === "SYNOPSIS") type = DocServiceType.SYNOPSIS;
    else if (docType === "CIRCUIT_DIAGRAM") type = DocServiceType.CIRCUIT_DIAGRAM;
    else if (docType === "POSTER") type = DocServiceType.POSTER;
    else if (docType === "VIVA_PREP") type = DocServiceType.VIVA_PREP;

    const documentOrder = await prisma.documentOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        projectTitle: projectTitle.trim(),
        docType: type,
        pageCount: Number(pageCount) || null,
        formattingStyle,
        deadline: deadline ? new Date(deadline) : null,
        referenceFileUrl: referenceFileUrl || null,
        status: "REQUESTED",
      },
    });

    await sendNotification({
      userId: user.id,
      title: `Documentation Request ${orderNumber} Queued!`,
      message: `Your request for "${projectTitle}" (${type}) has been scheduled for formatting and technical writeup.`,
      link: `/account`,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      documentOrder,
      message: "Documentation service request received successfully.",
    });
  } catch (error) {
    console.error("Document order error:", error);
    return NextResponse.json({ error: "Failed to submit document order" }, { status: 500 });
  }
}
