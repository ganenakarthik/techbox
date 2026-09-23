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
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      componentCost = 0,
      manufacturingCost = 0,
      assemblyCost = 0,
      testingCost = 0,
      shippingCost = 0,
      margin = 0,
      discount = 0,
      taxRate = 0.18,
      currency = "INR",
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
    const baseSubtotal =
      Number(componentCost) +
      Number(manufacturingCost) +
      Number(assemblyCost) +
      Number(testingCost) +
      Number(shippingCost) +
      Number(margin);

    const subtotalAfterDiscount = Math.max(0, baseSubtotal - Number(discount));
    const effectiveTaxRate = Number(taxRate) >= 0 ? Number(taxRate) : 0.18;
    const calculatedTax = Math.round(subtotalAfterDiscount * effectiveTaxRate * 100) / 100;
    const totalCost = Math.round((subtotalAfterDiscount + calculatedTax) * 100) / 100;

    const breakdown = {
      componentCost: Number(componentCost),
      manufacturingCost: Number(manufacturingCost),
      assemblyCost: Number(assemblyCost),
      testingCost: Number(testingCost),
      shippingCost: Number(shippingCost),
      margin: Number(margin),
      discount: Number(discount),
      taxRate: effectiveTaxRate,
      tax: calculatedTax,
      totalCost,
      currency,
    };

    const quote = await prisma.projectQuote.create({
      data: {
        projectId: project.id,
        version: nextVersion,
        status: QuoteStatus.SENT,
        componentCost: Number(componentCost),
        manufacturingCost: Number(manufacturingCost),
        assemblyCost: Number(assemblyCost),
        testingCost: Number(testingCost),
        shippingCost: Number(shippingCost),
        margin: Number(margin),
        taxRate: effectiveTaxRate,
        tax: calculatedTax,
        discount: Number(discount),
        totalCost,
        currency,
        breakdown,
        adminRemarks: adminRemarks || null,
        createdById: user.id,
      },
    });

    // Create corresponding unified Quote record for Customer Portal
    const unifiedQuoteNumber = `Q-PRJ-${project.projectCode}-V${nextVersion}`;
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const items = [
      { description: "Component Bill of Materials (BOM)", unitPrice: Number(componentCost), quantity: 1, totalPrice: Number(componentCost) },
      { description: "Custom PCB & Hardware Fabrication", unitPrice: Number(manufacturingCost), quantity: 1, totalPrice: Number(manufacturingCost) },
      { description: "Assembly & Soldering Service", unitPrice: Number(assemblyCost), quantity: 1, totalPrice: Number(assemblyCost) },
      { description: "Lab Bench Testing & Firmware Validation", unitPrice: Number(testingCost), quantity: 1, totalPrice: Number(testingCost) },
      { description: "Platform Margin & Engineering Overhead", unitPrice: Number(margin), quantity: 1, totalPrice: Number(margin) },
    ].filter((i) => i.unitPrice > 0);

    await prisma.quote.create({
      data: {
        quoteNumber: unifiedQuoteNumber,
        userId: project.userId,
        serviceType: "CUSTOM_PROJECT",
        title: `Project Build Quote: ${project.title}`,
        description: `Full custom project hardware, PCB & assembly quote for project #${project.projectCode}`,
        status: "SENT",
        subtotal: baseSubtotal,
        shippingFee: Number(shippingCost),
        tax: calculatedTax,
        discount: Number(discount),
        totalAmount: totalCost,
        validUntil,
        projectId: project.id,
        createdById: user.id,
        items: {
          create: items,
        },
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
      newValue: { quoteVersion: nextVersion, totalCost, breakdown },
      details: `Generated audited quote v${nextVersion} (₹${totalCost}) for project ${project.title}`,
    });

    // Send notification
    await sendNotification({
      userId: project.userId,
      title: `Engineering Quote Sent for ${project.title}`,
      message: `Your project quote of ₹${totalCost} (v${nextVersion}) is ready for student review.`,
      link: `/account`,
    });

    return NextResponse.json({
      success: true,
      quote,
      message: `Quote v${nextVersion} created and persisted successfully.`,
    });
  } catch (error: any) {
    console.error("Quote creation error:", error);
    return NextResponse.json({ error: "Failed to create project quote" }, { status: 500 });
  }
}
