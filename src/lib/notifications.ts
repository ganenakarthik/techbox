import { prisma } from "./prisma";

export interface NotificationPayload {
  userId: string;
  phone?: string | null;
  title: string;
  message: string;
  link?: string;
  type?: "SMS" | "WHATSAPP" | "SYSTEM";
}

/**
 * Sends a multi-channel notification (Database persistent record + optional SMS/WhatsApp API dispatch)
 */
export async function sendNotification(payload: NotificationPayload) {
  const { userId, phone, title, message, link } = payload;

  try {
    // 1. Create persistent database notification record
    const dbNotification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        link: link || "/account",
        isRead: false,
      },
    });

    // 2. Dispatch Fast2SMS / Twilio API if credentials exist
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;

    if (phone && (fast2smsKey || twilioToken)) {
      if (fast2smsKey) {
        // Fast2SMS API call for Indian mobile numbers
        fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: fast2smsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "q",
            message: `${title}: ${message}`,
            language: "english",
            flash: 0,
            numbers: phone.replace(/[^0-9]/g, "").slice(-10),
          }),
        }).catch((err) => console.error("Fast2SMS dispatch error:", err));
      }
    } else {
      console.log(`📱 [NOTIFICATION DEV LOG] To: ${phone || userId} | ${title} -> ${message}`);
    }

    return dbNotification;
  } catch (error) {
    console.error("sendNotification error:", error);
    return null;
  }
}

/**
 * Automated alert: Quote Ready for Customer Review
 */
export async function notifyQuoteReady(userId: string, phone: string | null, quoteNumber: string, quoteId: string) {
  return sendNotification({
    userId,
    phone,
    title: "Quote Ready for Review 📄",
    message: `Your engineering quote ${quoteNumber} is ready for review on Partsly. Tap to review & accept.`,
    link: `/account/quotes/${quoteId}`,
  });
}

/**
 * Automated alert: Payment Verified by Admin Operator
 */
export async function notifyPaymentVerified(userId: string, phone: string | null, entityNumber: string) {
  return sendNotification({
    userId,
    phone,
    title: "Payment Verified ✅",
    message: `Payment for ${entityNumber} has been verified! Operations team is preparing your hardware order.`,
    link: `/account/orders`,
  });
}

/**
 * Automated alert: Campus Runner Dispatched
 */
export async function notifyRunnerDispatched(userId: string, phone: string | null, orderNumber: string, runnerInfo?: string) {
  return sendNotification({
    userId,
    phone,
    title: "Campus Runner Dispatched 🛵",
    message: `Order ${orderNumber} is out for delivery! ${runnerInfo ? `Runner: ${runnerInfo}` : "Your runner is heading to your campus gate."}`,
    link: `/account/orders`,
  });
}
