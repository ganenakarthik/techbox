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

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { projectCode: id }],
      },
      include: {
        files: true,
        quotes: {
          orderBy: { version: "desc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!user || (project.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Access denied: You do not have permission to view this project" }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project GET by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(
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
    const { action, quoteId, remarks } = body;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { projectCode: id }],
      },
      include: {
        quotes: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const latestQuote = project.quotes[0];
    if (!latestQuote) {
      return NextResponse.json({ error: "No quote found for this project" }, { status: 400 });
    }

    if (action === "ACCEPT") {
      // Atomic Commercial Transaction:
      // 1. Mark Quote ACCEPTED
      // 2. Mark Project APPROVED
      // 3. Generate payable Order in database with UPI Payment pending
      const { newOrder } = await prisma.$transaction(async (tx) => {
        await tx.projectQuote.update({
          where: { id: latestQuote.id },
          data: { status: "ACCEPTED" },
        });

        await tx.project.update({
          where: { id: project.id },
          data: { status: "APPROVED" },
        });

        const orderNumber = `PRJ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: user.id,
            recipientName: user.name,
            recipientPhone: user.phone || "7032635858",
            campusDetail: `${project.title || "Custom Project"} (Build Spec Quote v${latestQuote.version})`,
            status: "PENDING",
            subtotal: latestQuote.totalCost,
            discount: latestQuote.discount || 0,
            shippingFee: latestQuote.shippingCost || 0,
            tax: latestQuote.tax || 0,
            total: latestQuote.totalCost,
            paymentMethod: "UPI",
            paymentStatus: "PAYMENT_PENDING",
          },
        });

        await tx.paymentTransaction.create({
          data: {
            orderId: createdOrder.id,
            transactionRef: `TXN-PRJ-${orderNumber}`,
            gateway: "UPI",
            amount: latestQuote.totalCost,
            status: "PAYMENT_PENDING",
          },
        });

        await tx.orderEvent.create({
          data: {
            orderId: createdOrder.id,
            eventType: "ORDER_CREATED",
            actor: `CUSTOMER:${user.id}`,
            message: `Commercial project build order created for approved quote v${latestQuote.version} on "${project.title}"`,
          },
        });

        await tx.notification.create({
          data: {
            userId: user.id,
            title: `Quote Accepted: Project #${project.projectCode}`,
            message: `You approved Quote v${latestQuote.version} for ₹${latestQuote.totalCost}. Order #${createdOrder.orderNumber} is ready for PhonePe UPI payment.`,
            link: `/orders/${createdOrder.orderNumber}`,
          },
        });

        return { newOrder: createdOrder };
      });

      return NextResponse.json({
        success: true,
        message: `Quote approved! Payable order #${newOrder.orderNumber} created. Please complete PhonePe UPI payment.`,
        projectStatus: "APPROVED",
        quoteStatus: "ACCEPTED",
        orderNumber: newOrder.orderNumber,
        orderId: newOrder.id,
        payableAmount: Number(newOrder.total),
      });
    } else if (action === "REVISE" || action === "REJECT") {
      await prisma.$transaction([
        prisma.projectQuote.update({
          where: { id: latestQuote.id },
          data: {
            status: action === "REVISE" ? "REVISION_REQUESTED" : "REJECTED",
            studentRemarks: remarks || null,
          },
        }),
        prisma.project.update({
          where: { id: project.id },
          data: { status: "REQUIREMENTS_READY" },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: action === "REVISE" ? "Revision requested from engineering team" : "Quote declined",
        projectStatus: "REQUIREMENTS_READY",
        quoteStatus: action === "REVISE" ? "REVISION_REQUESTED" : "REJECTED",
      });
    }

    return NextResponse.json({ error: "Invalid action. Must be ACCEPT, REVISE, or REJECT." }, { status: 400 });
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Failed to update project quote status" }, { status: 500 });
  }
}
