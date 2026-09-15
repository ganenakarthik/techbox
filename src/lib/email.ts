import { prisma } from "./prisma";

export interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export async function sendNotification({
  userId,
  title,
  message,
  link,
}: SendNotificationParams) {
  try {
    // 1. Create database notification for customer dashboard
    const notif = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        link: link || null,
      },
    });

    // 2. In dev/sandbox mode, log the simulated email dispatch
    console.log(`[EMAIL DISPATCH] To User: ${userId} | Subject: ${title} | Link: ${link || "N/A"}`);
    console.log(`[EMAIL BODY]: ${message}`);

    return notif;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return null;
  }
}
