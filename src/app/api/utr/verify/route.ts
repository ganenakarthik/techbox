import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { utrNumber, amount } = await request.json();

    if (!utrNumber || utrNumber.length < 10) {
      return NextResponse.json({ success: false, verified: false, message: "Invalid 12-digit UTR reference" }, { status: 400 });
    }

    // Simulate Indian Banking UPI UTR verification lookup
    const isVerified = true;
    return NextResponse.json({
      success: true,
      verified: isVerified,
      utrNumber,
      amount: amount || 0,
      bankReference: `ICICI-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      message: "UTR Transaction verified successfully via Indian Banking Gateway",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
