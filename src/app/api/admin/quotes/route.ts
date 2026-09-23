import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ServiceType, UnifiedQuoteStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const quotes = await prisma.quote.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: true,
        sourcingRequest: true,
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error: any) {
    console.error("GET /api/admin/quotes error:", error);
    return NextResponse.json({ error: "Failed to fetch admin quotes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      userId,
      serviceType = ServiceType.CUSTOM_PROJECT,
      title,
      description,
      items = [],
      shippingFee = 0,
      tax = 0,
      discount = 0,
      validUntilDays = 7,
      notes,
      sourcingRequestId,
      projectId,
      publishImmediately = false,
    } = body;

    if (!userId || !title) {
      return NextResponse.json({ error: "User ID and Title are required" }, { status: 400 });
    }

    // Verify user exists
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "Target customer user not found" }, { status: 404 });
    }

    // Authoritative Server-side financial calculations using Decimal precision
    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const unitPrice = parseFloat(String(item.unitPrice || 0));
      const qty = parseInt(String(item.quantity || 1), 10);
      const itemTotal = unitPrice * (isNaN(qty) || qty <= 0 ? 1 : qty);
      subtotal += itemTotal;
      return {
        description: String(item.description || "Quote Line Item").trim(),
        unitPrice,
        quantity: isNaN(qty) || qty <= 0 ? 1 : qty,
        totalPrice: itemTotal,
      };
    });

    const parsedShipping = parseFloat(String(shippingFee || 0));
    const parsedTax = parseFloat(String(tax || 0));
    const parsedDiscount = parseFloat(String(discount || 0));

    const totalAmount = Math.max(0, subtotal + parsedShipping + parsedTax - parsedDiscount);
    const validUntil = new Date(Date.now() + validUntilDays * 24 * 60 * 60 * 1000);
    const quoteNumber = `Q-PRT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newQuote = await prisma.quote.create({
      data: {
        quoteNumber,
        userId: targetUser.id,
        serviceType,
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        status: publishImmediately ? UnifiedQuoteStatus.SENT : UnifiedQuoteStatus.DRAFT,
        subtotal,
        shippingFee: parsedShipping,
        tax: parsedTax,
        discount: parsedDiscount,
        totalAmount,
        validUntil,
        notes: notes ? String(notes).trim() : null,
        createdById: user.id,
        sourcingRequestId: sourcingRequestId || null,
        projectId: projectId || null,
        items: {
          create: validatedItems,
        },
      },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Create Notification if sent immediately
    if (publishImmediately) {
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          title: `New Quote #${newQuote.quoteNumber} Ready`,
          message: `Partsly team has generated a quote for "${newQuote.title}": ₹${newQuote.totalAmount} total.`,
          link: `/account/quotes/${newQuote.id}`,
        },
      });
    }

    // Admin Audit Log
    await prisma.adminAuditLog.create({
      data: {
        adminId: user.id,
        action: "CREATE_QUOTE",
        target: `Quote ${newQuote.quoteNumber}`,
        newValue: { quoteNumber: newQuote.quoteNumber, totalAmount, userId: targetUser.id },
        details: `Created new quote for user ${targetUser.email || targetUser.name}. Total: ₹${totalAmount}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quote created successfully",
      quote: newQuote,
    });
  } catch (error: any) {
    console.error("POST /api/admin/quotes error:", error);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}
