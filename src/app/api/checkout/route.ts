import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PaymentGateway, OrderStatus, PaymentStatus } from "@prisma/client";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to checkout. Please log in or create an account." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      items,
      recipientName,
      recipientPhone,
      collegeName,
      campusName,
      department,
      pickupPoint,
      hostelBlock,
      deliverySlot,
      deliverySpeed = "standard",
      paymentMethod = "test_mode",
      couponCode,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!recipientName || !recipientPhone || !pickupPoint) {
      return NextResponse.json(
        { error: "Recipient name, phone, and pickup location are required" },
        { status: 400 }
      );
    }

    // Execute safe database transaction to prevent race conditions & overselling
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        if (!item.variantId) continue;

        // Fetch variant with live inventory and lock/check
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: {
            product: true,
            inventory: true,
          },
        });

        if (!variant) {
          throw new Error(`Component variant not found: ${item.name || item.variantId}`);
        }

        const available = variant.inventory?.available ?? 0;
        const requestedQty = Math.max(1, item.quantity || 1);

        if (available < requestedQty) {
          throw new Error(
            `Insufficient stock for "${variant.product.name} (${variant.name})". Only ${available} available, but ${requestedQty} requested.`
          );
        }

        // Decrement available inventory atomically with concurrency protection (gte check)
        const updateResult = await tx.inventory.updateMany({
          where: {
            variantId: variant.id,
            available: { gte: requestedQty },
          },
          data: {
            available: { decrement: requestedQty },
            reserved: { increment: requestedQty },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(
            `Insufficient stock for "${variant.product.name} (${variant.name})". The remaining units were just purchased by another customer.`
          );
        }

        const unitPrice = Number(variant.price);
        const itemTotal = unitPrice * requestedQty;
        subtotal += itemTotal;

        orderItemsData.push({
          variantId: variant.id,
          productName: `${variant.product.name} (${variant.name})`,
          sku: variant.sku,
          variantName: variant.name,
          unitPrice,
          quantity: requestedQty,
          totalPrice: itemTotal,
          specSnapshot: variant.product.specs || {},
        });
      }

      if (orderItemsData.length === 0) {
        throw new Error("No valid items to purchase");
      }

      // Calculate discounts against real database Coupon table
      let discount = 0;
      if (couponCode) {
        const cleanCoupon = couponCode.trim().toUpperCase();
        const dbCoupon = await tx.coupon.findUnique({
          where: { code: cleanCoupon },
        });

        if (dbCoupon && dbCoupon.isActive && new Date() <= dbCoupon.validUntil) {
          if (subtotal >= Number(dbCoupon.minSpend)) {
            const rawDiscount = Math.round(subtotal * (dbCoupon.discountPercent / 100));
            discount = dbCoupon.maxDiscount ? Math.min(Number(dbCoupon.maxDiscount), rawDiscount) : rawDiscount;
            // Increment usage count
            await tx.coupon.update({
              where: { id: dbCoupon.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        } else if (cleanCoupon === "TECHBOX10") {
          discount = Math.round(subtotal * 0.1);
        } else if (cleanCoupon === "CAMPUSFIRST") {
          discount = Math.min(150, Math.round(subtotal * 0.15));
        }
      }

      // Calculate shipping
      const campusDeliveryFee = subtotal >= 499 ? 0 : 40;
      const speedFee = deliverySpeed === "urgent" ? 99 : 0;
      const shippingFee = campusDeliveryFee + speedFee;
      const grandTotal = Math.max(0, subtotal - discount + shippingFee);

      // Generate order number
      const orderNumber = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

      // Resolve payment gateway
      let gateway: PaymentGateway = PaymentGateway.UPI;
      if (paymentMethod === "card") gateway = PaymentGateway.CARD;
      else if (paymentMethod === "cod") gateway = PaymentGateway.CASH_ON_DELIVERY;
      else if (paymentMethod === "test_mode") gateway = PaymentGateway.TEST_MODE;

      const campusDetail = [collegeName, campusName, department, hostelBlock, pickupPoint]
        .filter(Boolean)
        .join(" | ");

      const cleanUtr = body.utrNumber ? String(body.utrNumber).trim() : null;
      const initialPaymentStatus = cleanUtr ? PaymentStatus.PAYMENT_SUBMITTED : PaymentStatus.PAYMENT_PENDING;

      // Create Order in database
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          campusDetail,
          status: OrderStatus.PENDING,
          subtotal,
          discount,
          shippingFee,
          tax: 0,
          total: grandTotal,
          paymentMethod: gateway,
          paymentStatus: initialPaymentStatus,
          utrNumber: cleanUtr,
          utrSubmittedAt: cleanUtr ? new Date() : null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Provision initial shipment tracking
      const trackingNumber = `TRK-${orderNumber}`;
      await tx.shipment.create({
        data: {
          orderId: order.id,
          carrier: "TechBox Campus Dispatch",
          trackingNumber,
          currentCheckpoint: "Order placed & awaiting verification",
          checkpointHistory: [
            {
              status: "ORDER_CREATED",
              location: collegeName || "Campus Hub",
              timestamp: new Date().toISOString(),
              note: "Order created in TechBox campus dispatch queue.",
            },
          ],
          estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      // Provision payment transaction entry
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          transactionRef: cleanUtr
            ? `TXN-UTR-${cleanUtr}-${orderNumber}`
            : `TXN-INIT-${orderNumber}-${Date.now()}`,
          gateway,
          amount: grandTotal,
          status: initialPaymentStatus,
          gatewayPayload: {
            utr: cleanUtr,
            method: paymentMethod,
            timestamp: new Date().toISOString(),
          },
        },
      });

      // Emit ORDER_CREATED event
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          eventType: "ORDER_CREATED",
          actor: `CUSTOMER:${user.id}`,
          message: `Order ${orderNumber} placed for ₹${grandTotal}`,
          metadata: {
            itemCount: orderItemsData.length,
            deliverySpeed,
            recipientName: recipientName.trim(),
            campusDetail,
          },
        },
      });

      if (cleanUtr) {
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            eventType: "PAYMENT_SUBMITTED",
            actor: `CUSTOMER:${user.id}`,
            message: `Bank payment reference UTR ${cleanUtr} submitted`,
            metadata: { utrNumber: cleanUtr },
          },
        });
      }

      // Persist customer in-app Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: `Order Placed: ${orderNumber}`,
          message: `Your order of ₹${grandTotal} has been placed. Please submit your UPI payment reference to confirm dispatch.`,
          link: `/orders/${orderNumber}`,
        },
      });

      // Clear user database cart
      const userCart = await tx.cart.findUnique({ where: { userId: user.id } });
      if (userCart) {
        await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
      }

      return {
        order,
        orderNumber,
        grandTotal,
        gateway,
        initialPaymentStatus,
      };
    });

    const whatsappUrl = generateWhatsAppOrderUrl({
      orderNumber: result.orderNumber,
      recipientName: result.order.recipientName,
      recipientPhone: result.order.recipientPhone,
      campusDetail: result.order.campusDetail,
      items: (result.order.items || []).map((it: any) => ({
        productName: it.productName,
        quantity: it.quantity,
        price: Number(it.unitPrice),
      })),
      total: result.grandTotal,
      paymentStatus: result.initialPaymentStatus,
      utrNumber: result.order.utrNumber || null,
    });

    return NextResponse.json({
      success: true,
      order: result.order,
      orderId: result.order.id,
      orderNumber: result.orderNumber,
      total: result.grandTotal,
      gateway: result.gateway,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed. Please review your cart and try again." },
      { status: 400 }
    );
  }
}
