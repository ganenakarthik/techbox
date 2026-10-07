import { NextResponse } from "next/server";
import { submitBOMRFQToDB } from "@/lib/neon";

export async function POST(request: Request) {
  try {
    const { bomItems, totalTargetPrice, contactEmail } = await request.json();

    if (!bomItems || !Array.isArray(bomItems) || bomItems.length === 0) {
      return NextResponse.json({ success: false, error: "BOM items array is required" }, { status: 400 });
    }

    const rfq = await submitBOMRFQToDB({
      bomItems,
      totalTargetPrice: totalTargetPrice || 0,
      contactEmail: contactEmail || "engineer@partsly.com",
    });

    return NextResponse.json({ success: true, message: "BOM RFQ submitted to Partsly Sourcing Desk", rfq });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
