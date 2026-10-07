import { NextResponse } from "next/server";
import { createOrderInDB, getOrdersFromDB } from "@/lib/neon";

export async function GET() {
  const orders = await getOrdersFromDB();
  return NextResponse.json({ success: true, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, email, address, items, subtotal, gstAmount, shippingFee, grandTotal, utrNumber } = body;

    if (!customerName || !utrNumber) {
      return NextResponse.json({ success: false, error: "Missing required order or UTR fields" }, { status: 400 });
    }

    const order = await createOrderInDB({
      customerName,
      email: email || "customer@partsly.com",
      address: address || "Default Address",
      items: items || [],
      subtotal: subtotal || 0,
      gstAmount: gstAmount || 0,
      shippingFee: shippingFee || 0,
      grandTotal: grandTotal || 0,
      utrNumber,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
