"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  specs: string;
  image: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  pincode: string;
  setPincode: (pin: string) => void;
  couponCode: string;
  discountPercentage: number;
  applyCoupon: (code: string) => boolean;
  addToCart: (item: { id: string; name: string; price: number; originalPrice?: number; specs: string; image: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  shippingFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "esp32-wroom-32d",
      name: "ESP32-WROOM-32D Wi-Fi + BT Module",
      price: 249,
      originalPrice: 320,
      quantity: 2,
      specs: "4MB Flash, Dual Core 240MHz",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "raspberry-pi-pico-w",
      name: "Raspberry Pi Pico W Board",
      price: 499,
      originalPrice: 599,
      quantity: 1,
      specs: "RP2040 Dual ARM Cortex M0+",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    }
  ]);

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [pincode, setPincode] = useState("560001");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === "PARTSLY10" || formatted === "WELCOME10") {
      setCouponCode(formatted);
      setDiscountPercentage(10);
      return true;
    } else if (formatted === "PARTSLY20") {
      setCouponCode(formatted);
      setDiscountPercentage(20);
      return true;
    }
    return false;
  };

  const addToCart = (item: { id: string; name: string; price: number; originalPrice?: number; specs: string; image: string }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id);
      if (exists) {
        return prev.filter((w) => w.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isWishlisted = (id: string) => wishlist.some((w) => w.id === id);

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const shippingFee = taxableAmount > 999 || taxableAmount === 0 ? 0 : 49;
  const grandTotal = taxableAmount + gstAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        pincode,
        setPincode,
        couponCode,
        discountPercentage,
        applyCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isWishlisted,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        discountAmount,
        gstAmount,
        shippingFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
