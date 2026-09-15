import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ items: [], subtotal: 0 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], subtotal: 0 });
    }

    const items = cart.items.map((item) => {
      const v = item.variant;
      const p = v?.product;
      const price = v ? Number(v.price) : 0;
      const originalPrice = v ? Number(v.mrp) : price;
      const availableStock = v?.inventory?.available ?? 0;

      return {
        id: item.id,
        variantId: item.variantId,
        productId: p?.id,
        name: p ? `${p.name} (${v?.name})` : "Component",
        sku: v?.sku || "",
        price,
        originalPrice,
        image: (p?.images as string[])?.[0] || "/placeholder.png",
        quantity: Math.min(item.quantity, Math.max(1, availableStock)),
        stock: availableStock,
        isKit: false,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({ items, subtotal });
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

    // Handle guest cart merge
    if (Array.isArray(mergeItems) && mergeItems.length > 0) {
      for (const m of mergeItems) {
        if (!m.variantId) continue;
        const existing = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, variantId: m.variantId },
        });

        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + (m.quantity || 1) },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: m.variantId,
              quantity: m.quantity || 1,
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
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
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

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    // Check stock
    const item = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        variant: {
          include: { inventory: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
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
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete from cart" }, { status: 500 });
  }
}
