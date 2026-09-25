import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ error: "Share code required" }, { status: 400 });
    }

    const sharedCart = await prisma.sharedCart.findUnique({
      where: { shareCode: code.toUpperCase() },
    });

    if (!sharedCart) {
      return NextResponse.json({ error: "Shared BOM link not found or expired" }, { status: 404 });
    }

    let items = [];
    try {
      items = JSON.parse(sharedCart.itemsJson);
    } catch {
      items = [];
    }

    return NextResponse.json({
      success: true,
      cart: {
        id: sharedCart.id,
        shareCode: sharedCart.shareCode,
        title: sharedCart.title,
        creatorName: sharedCart.creatorName,
        teamSize: sharedCart.teamSize,
        items,
        createdAt: sharedCart.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch shared cart:", error);
    return NextResponse.json({ error: "Internal server error fetching shared BOM" }, { status: 500 });
  }
}
