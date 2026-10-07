import { NextResponse } from "next/server";
import { getUserByEmailFromDB } from "@/lib/neon";
import { isSoleAdminEmail } from "@/lib/security";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "";

  if (!email) {
    return NextResponse.json({ success: false, user: null }, { status: 400 });
  }

  const user = await getUserByEmailFromDB(email);
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 444 });
  }

  const role = isSoleAdminEmail(user.email) ? "admin" : "customer";

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
  });
}
