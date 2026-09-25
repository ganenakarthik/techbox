import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, title, creatorName, teamSize } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cannot share an empty cart" },
        { status: 400 }
      );
    }

    // Generate random 6-character uppercase share code (e.g. BOM7X9)
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let shareCode = "";
    for (let i = 0; i < 6; i++) {
      shareCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure uniqueness
    const existing = await prisma.sharedCart.findUnique({
      where: { shareCode },
    });

    if (existing) {
      shareCode += Math.floor(Math.random() * 9 + 1);
    }

    const sharedCart = await prisma.sharedCart.create({
      data: {
        shareCode,
        title: title || "Engineering Capstone Project BOM",
        creatorName: creatorName || "Team Lead",
        teamSize: Number(teamSize) || 4,
        itemsJson: JSON.stringify(items),
      },
    });

    const origin = request.headers.get("origin") || "https://partsly.in";
    const shareUrl = `${origin}/cart/share/${sharedCart.shareCode}`;

    return NextResponse.json({
      success: true,
      shareCode: sharedCart.shareCode,
      shareUrl,
      itemsCount: items.length,
    });
  } catch (error) {
    console.error("Failed to create shared cart:", error);
    return NextResponse.json(
      { error: "Internal server error creating shared BOM link" },
      { status: 500 }
    );
  }
}
