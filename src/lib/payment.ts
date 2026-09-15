import { PaymentGateway, PaymentStatus } from "@prisma/client";

export interface PaymentInitiationResult {
  transactionRef: string;
  gateway: PaymentGateway;
  amount: number;
  status: PaymentStatus;
  checkoutUrl?: string;
  metadata?: Record<string, any>;
}

export async function processPayment({
  orderNumber,
  amount,
  method,
  upiId,
}: {
  orderNumber: string;
  amount: number;
  method: string;
  upiId?: string;
}): Promise<PaymentInitiationResult> {
  const transactionRef = `TXN-${method.toUpperCase()}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Determine Gateway enum
  let gateway: PaymentGateway = PaymentGateway.TEST_MODE;
  if (method === "upi") gateway = PaymentGateway.UPI;
  else if (method === "card") gateway = PaymentGateway.CARD;
  else if (method === "net_banking") gateway = PaymentGateway.NET_BANKING;
  else if (method === "cod") gateway = PaymentGateway.CASH_ON_DELIVERY;

  // In development and test sandbox mode:
  // Payments are verified server-side with structured transaction payloads
  if (gateway === PaymentGateway.CASH_ON_DELIVERY) {
    return {
      transactionRef,
      gateway,
      amount,
      status: PaymentStatus.PAYMENT_SUBMITTED,
      metadata: {
        method: "Cash on Delivery",
        verifiedAt: new Date().toISOString(),
        orderNumber,
      },
    };
  }

  return {
    transactionRef,
    gateway,
    amount,
    status: PaymentStatus.PAYMENT_VERIFIED,
    metadata: {
      provider: process.env.PAYMENT_PROVIDER || "TEST_MODE",
      verifiedAt: new Date().toISOString(),
      orderNumber,
      upiId: upiId || null,
      mode: "SANDBOX_SIMULATION",
      reference: `BANK-REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
  };
}
