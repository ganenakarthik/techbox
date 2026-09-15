import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        OR: [{ id }, { ticketNumber: id }],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        order: {
          select: { orderNumber: true, status: true, total: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Support ticket not found" }, { status: 404 });
    }

    // STRICT MULTI-TENANT SECURITY: Only the owner or an admin/staff can view this ticket
    if (user.role !== "ADMIN" && user.role !== "STAFF" && ticket.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access: You do not have permission to view this ticket" },
        { status: 403 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error("Support ticket detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}

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

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        OR: [{ id }, { ticketNumber: id }],
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Support ticket not found" }, { status: 404 });
    }

    // STRICT MULTI-TENANT SECURITY: Only the owner or an admin/staff can reply
    if (user.role !== "ADMIN" && user.role !== "STAFF" && ticket.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access: You cannot reply to another customer's ticket" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { message } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const currentMessages = Array.isArray(ticket.messages) ? (ticket.messages as any[]) : [];
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: user.name || (user.role === "ADMIN" ? "Support Staff" : "Customer"),
      role: user.role,
      text: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        messages: [...currentMessages, newMessage],
        status: user.role === "CUSTOMER" && ticket.status === "RESOLVED" ? "OPEN" : ticket.status,
      },
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    console.error("Support ticket reply POST error:", error);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
