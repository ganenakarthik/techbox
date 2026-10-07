import { NextResponse } from "next/server";
import { getOrdersFromDB, updateOrderStatusInDB } from "@/lib/neon";
import { isSoleAdminEmail, recordSecurityEvent } from "@/lib/security";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminEmail = searchParams.get("adminEmail") || req.headers.get("x-admin-email") || "";

  // SECURITY GUARD: Only ganenakartiks7@gmail.com is authorized
  if (!isSoleAdminEmail(adminEmail)) {
    recordSecurityEvent(
      "ADMIN_ACCESS_ATTEMPT",
      adminEmail || "anonymous",
      "Unauthorized GET request to /api/admin/orders",
      "CRITICAL"
    );
    return NextResponse.json(
      { success: false, message: "403 Forbidden: Only ganenakartiks7@gmail.com can access admin endpoints." },
      { status: 403 }
    );
  }

  const orders = await getOrdersFromDB();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, newStatus, adminEmail } = body;

    if (!isSoleAdminEmail(adminEmail)) {
      recordSecurityEvent(
        "ADMIN_ACCESS_ATTEMPT",
        adminEmail || "anonymous",
        `Unauthorized PATCH attempt on order ${orderId}`,
        "CRITICAL"
      );
      return NextResponse.json(
        { success: false, message: "403 Forbidden: Sole Admin access required." },
        { status: 403 }
      );
    }

    const updated = await updateOrderStatusInDB(orderId, newStatus);
    if (updated) {
      recordSecurityEvent(
        "ORDER_STATUS_MUTATION",
        adminEmail,
        `Order [${orderId}] status changed to [${newStatus}]`,
        "HIGH"
      );
      return NextResponse.json({ success: true, message: `Order ${orderId} updated to ${newStatus}` });
    }

    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
