import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: null, items: [] });
    }

    return NextResponse.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          variantId: item.variantId,
          name: item.variant?.product?.name || item.variant?.name || "Item",
          price: Number(item.variant?.price || 0),
          originalPrice: Number(item.variant?.mrp || 0),
          image: (item.variant?.product?.images as string[])?.[0] || "/placeholder.png",
          quantity: item.quantity,
          availableStock: item.variant?.inventory?.available ?? 0,
          sku: item.variant?.sku || "SKU-ITEM",
          isKit: false,
        })),
      },
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { variantId, quantity = 1, mergeItems } = body;

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    // Handle guest cart merge with strict stock validation
    if (Array.isArray(mergeItems) && mergeItems.length > 0) {
      for (const m of mergeItems) {
        if (!m.variantId) continue;

        // Verify available stock before merging
        const variant = await prisma.productVariant.findUnique({
          where: { id: m.variantId },
          include: { inventory: true },
        });

        const available = variant?.inventory?.available ?? 0;
        if (available <= 0) continue; // Out of stock items are dropped

        const requestedQty = Math.max(1, Number(m.quantity) || 1);
        const cappedQty = Math.min(requestedQty, available);

        const existing = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, variantId: m.variantId },
        });

        if (existing) {
          const finalQty = Math.min(existing.quantity + cappedQty, available);
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: finalQty },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: m.variantId,
              quantity: cappedQty,
            },
          });
        }
      }
      return NextResponse.json({ success: true, message: "Cart merged" });
    }

    if (!variantId) {
      return NextResponse.json({ error: "Variant ID required" }, { status: 400 });
    }

    // Verify stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { inventory: true },
    });

    if (!variant || (variant.inventory?.available ?? 0) <= 0) {
      return NextResponse.json({ error: "Item is out of stock" }, { status: 400 });
    }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > (variant.inventory?.available ?? 0)) {
        return NextResponse.json(
          { error: `Only ${variant.inventory?.available} units available in stock` },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      if (quantity > (variant.inventory?.available ?? 0)) {
        return NextResponse.json(
          { error: `Only ${variant.inventory?.available} units available in stock` },
          { status: 400 }
        );
      }

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId) {
      return NextResponse.json({ error: "cartItemId required" }, { status: 400 });
    }

    // IDOR Protection: Query cart item strictly scoped to the authenticated user's cart
    const item = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId: user.id },
      },
      include: {
        variant: {
          include: { inventory: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found in your cart" }, { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    const available = item.variant?.inventory?.available ?? 999;
    if (quantity > available) {
      return NextResponse.json(
        { error: `Maximum available stock is ${available}` },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");
    const clearAll = searchParams.get("clear") === "true";

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json({ success: true });
    }

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      return NextResponse.json({ success: true, message: "Cart cleared" });
    }

    if (cartItemId) {
      // IDOR Protection: Delete only if item belongs to user's cart
      const deleteResult = await prisma.cartItem.deleteMany({
        where: {
          id: cartItemId,
          cartId: cart.id,
        },
      });

      if (deleteResult.count === 0) {
        return NextResponse.json({ error: "Item not found in your cart" }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Item removed" });
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete from cart" }, { status: 500 });
  }
}
