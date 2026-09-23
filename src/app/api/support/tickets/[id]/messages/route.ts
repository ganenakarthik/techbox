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
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { text, fileUrl, fileName } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    // Find ticket with ownership / staff check
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const isOwner = ticket.userId === user.id;
    const isStaff = user.role === "ADMIN" || user.role === "STAFF";

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    const existingMessages: any[] = Array.isArray(ticket.messages) ? (ticket.messages as any[]) : [];

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: user.name || (isStaff ? "Partsly Lab Engineer" : "Customer"),
      role: isStaff ? "STAFF" : "CUSTOMER",
      text: text.trim(),
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...existingMessages, newMessage];
    const newStatus = isStaff ? "IN_PROGRESS" : "OPEN";

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        messages: updatedMessages,
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, ticket: updatedTicket, message: newMessage });
  } catch (error: any) {
    console.error("Support ticket message error:", error);
    return NextResponse.json({ error: "Failed to append message to ticket thread" }, { status: 500 });
  }
}
