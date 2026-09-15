import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TicketStatus } from "@prisma/client";
import { logAdminAction } from "@/lib/audit";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        OR: [{ id }, { ticketNumber: id }],
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, priority, adminReply } = body;

    const updateData: any = {};
    if (status) {
      updateData.status = status as TicketStatus;
    }
    if (priority) {
      updateData.priority = priority;
    }

    if (adminReply && typeof adminReply === "string" && adminReply.trim()) {
      const currentMessages = Array.isArray(ticket.messages) ? (ticket.messages as any[]) : [];
      const newStaffMsg = {
        id: `msg-${Date.now()}`,
        sender: `Support Staff (${user.name || "TechBox Admin"})`,
        role: "ADMIN",
        text: adminReply.trim(),
        timestamp: new Date().toISOString(),
      };
      updateData.messages = [...currentMessages, newStaffMsg];
    }

    const updated = await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: updateData,
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: ticket.userId,
        title: `Ticket ${ticket.ticketNumber} Updated`,
        message: status
          ? `Status changed to ${status}.`
          : `New response received from TechBox engineering team.`,
        link: `/account/support`,
      },
    });

    await logAdminAction({
      adminId: user.id,
      action: "UPDATE_SUPPORT_TICKET",
      target: `Ticket:${ticket.ticketNumber}`,
      newValue: body,
      previousValue: { status: ticket.status, priority: ticket.priority },
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    console.error("Admin ticket update error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
