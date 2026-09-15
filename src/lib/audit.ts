import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export interface LogAuditParams {
  adminId?: string;
  action: string;
  target: string;
  previousValue?: any;
  newValue?: any;
  details?: string;
  ipAddress?: string;
}

export async function logAdminAction({
  adminId,
  action,
  target,
  previousValue,
  newValue,
  details,
  ipAddress,
}: LogAuditParams) {
  try {
    return await prisma.adminAuditLog.create({
      data: {
        adminId: adminId || null,
        action,
        target,
        previousValue: previousValue !== undefined ? (previousValue as Prisma.InputJsonValue) : Prisma.JsonNull,
        newValue: newValue !== undefined ? (newValue as Prisma.InputJsonValue) : Prisma.JsonNull,
        details: details || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
    return null;
  }
}
