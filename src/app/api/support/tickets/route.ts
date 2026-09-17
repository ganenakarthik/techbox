import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("Support tickets GET error:", error);
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, category, message, orderId } = body;

    if (!subject || !category || !message) {
      return NextResponse.json(
        { error: "Subject, category, and initial message are required" },
        { status: 400 }
      );
    }

    // If orderId is provided, verify it belongs to this customer (or resolve by orderNumber)
    let resolvedOrderId: string | null = null;
    if (orderId && typeof orderId === "string" && orderId.trim()) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: orderId.trim() },
            { orderNumber: orderId.trim() },
          ],
          userId: user.id,
        },
      });
      if (order) {
        resolvedOrderId = order.id;
      }
    }

    const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialMessages = [
      {
        id: `msg-${Date.now()}`,
        sender: user.name || "Customer",
        role: "CUSTOMER",
        text: message.trim(),
        timestamp: new Date().toISOString(),
      },
      {
        id: `msg-${Date.now() + 1}`,
        sender: "Partsly System",
        role: "SYSTEM",
        text: "Ticket received. A campus engineer has been assigned to your query.",
        timestamp: new Date().toISOString(),
      },
    ];

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: user.id,
        orderId: resolvedOrderId,
        subject: subject.trim(),
        category: category.trim(),
        status: "OPEN",
        priority: "NORMAL",
        messages: initialMessages,
      },
      include: {
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error: any) {
    console.error("Support ticket create error:", error);
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}
