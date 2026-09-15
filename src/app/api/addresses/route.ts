import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const addresses = await prisma.userAddress.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      recipientName,
      phone,
      alternatePhone,
      collegeName,
      campusName,
      department,
      buildingOrBlock,
      hostelOrLab,
      roomNumber,
      landmark,
      isDefault = false,
    } = body;

    if (!recipientName || !phone || !collegeName || !buildingOrBlock) {
      return NextResponse.json(
        { error: "Recipient name, phone, college, and building/block are required" },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.userAddress.create({
      data: {
        userId: user.id,
        recipientName,
        phone,
        alternatePhone,
        collegeName,
        campusName: campusName || "Main Campus",
        department: department || "ECE / IoT Lab",
        buildingOrBlock,
        hostelOrLab: hostelOrLab || "Hostel Block B",
        roomNumber: roomNumber || "Room 204",
        landmark,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error: any) {
    console.error("Address POST error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
