import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to merge cart" }, { status: 401 });
    }

    const body = await req.json();
    const { items = [] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, message: "No items to merge", mergedCount: 0 });
    }

    // Ensure customer has a cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    let mergedCount = 0;

    for (const item of items) {
      if (!item.variantId) continue;
      const requestedQty = Math.max(1, parseInt(item.quantity || 1, 10));

      // Revalidate variant and stock in PostgreSQL
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { inventory: true, product: true },
      });

      if (!variant) continue;
      const availableStock = variant.inventory?.available ?? 0;
      if (availableStock <= 0) continue; // Out of stock

      const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, variantId: item.variantId },
      });

      if (existingCartItem) {
        // Cap quantity at available stock
        const targetQty = Math.min(availableStock, Math.max(existingCartItem.quantity, requestedQty));
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: targetQty },
        });
      } else {
        const targetQty = Math.min(availableStock, requestedQty);
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: item.variantId,
            quantity: targetQty,
          },
        });
      }
      mergedCount++;
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true, inventory: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully merged ${mergedCount} items into your cart`,
      mergedCount,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Cart merge error:", error);
    return NextResponse.json({ error: "Failed to merge guest cart" }, { status: 500 });
  }
}
