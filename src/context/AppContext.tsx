"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductVariant, ProjectKit, COLLEGES, College } from "@/data/mockData";
import { BRAND } from "@/config/brand";

export interface CartItem {
  id: string; // unique cart item id
  productId?: string;
  variantId?: string;
  projectKitId?: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  stock?: number;
  isKit?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string | null;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  college?: string;
  campus?: string;
  room?: string;
  phone?: string | null;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  hasPassword?: boolean;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (params: {
    product?: any;
    variant?: any;
    kit?: any;
    quantity?: number;
    productId?: string;
    variantId?: string;
    projectKitId?: string;
    name?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    sku?: string;
    stock?: number;
    isKit?: boolean;
    openDrawer?: boolean;
  }) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  freeDeliveryThreshold: number;
  freeDeliveryProgress: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // array of product ids
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authRedirectUrl: string | null;
  setAuthRedirectUrl: (url: string | null) => void;

  // Authentication & Role
  user: UserProfile | null;
  login: (email: string, password?: string, role?: "CUSTOMER" | "ADMIN" | "STAFF") => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  sendOtp: (phone: string, purpose?: string) => Promise<{ success: boolean; resendAfterSeconds?: number; devOtp?: string; error?: string; formattedPhone?: string; isExistingUser?: boolean }>;
  verifyOtp: (phone: string, otp: string, purpose?: string) => Promise<{ success: boolean; isNewUser?: boolean; user?: any; error?: string; attemptsRemaining?: number }>;
  registerWithPhone: (data: { phone: string; name: string; email?: string }) => Promise<{ success: boolean; user?: any; error?: string }>;
  loginWithPassword: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: "CUSTOMER" | "ADMIN" | "STAFF") => void;

  // Campus Delivery State
  selectedCollege: College;
  setSelectedCollege: (col: College) => void;
  selectedCampusName: string;
  setSelectedCampusName: (name: string) => void;
  selectedPickupPoint: string;
  setSelectedPickupPoint: (point: string) => void;
  selectedDeliverySlot: string;
  setSelectedDeliverySlot: (slot: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "warning" | "info") => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile | null>(null);

  const [selectedCollege, setSelectedCollege] = useState<College>(COLLEGES[0]);
  const [selectedCampusName, setSelectedCampusName] = useState<string>(COLLEGES[0].campuses[0].name);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>(COLLEGES[0].campuses[0].pickupLocations[0]);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string>(COLLEGES[0].campuses[0].deliverySlots[0]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Cart from server
  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setCart(data.items);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch Wishlist from server
  const refreshWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        if (data.productIds) {
          setWishlist(data.productIds);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Initial Session Hydration on Mount
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            await refreshCart();
            await refreshWishlist();
            return;
          }
        }
      } catch {
        // network error, fallback to guest
      }

      // Guest: Load from localStorage (partsly_cart with legacy techbox_cart fallback)
      try {
        const savedCart = localStorage.getItem(BRAND.cartStorageKey) || localStorage.getItem("techbox_cart");
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem(BRAND.wishlistStorageKey) || localStorage.getItem("techbox_wishlist");
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch {
        // ignore
      }
    }

    initSession();
  }, [refreshCart, refreshWishlist]);

  // Guest Cart persistence to localStorage
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(BRAND.cartStorageKey, JSON.stringify(cart));
      } catch {
        // ignore
      }
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(BRAND.wishlistStorageKey, JSON.stringify(wishlist));
      } catch {
        // ignore
      }
    }
  }, [wishlist, user]);

  const addToCart = async ({
    product,
    variant,
    kit,
    quantity = 1,
    productId,
    variantId,
    name,
    price,
    originalPrice,
    image,
    sku,
    stock: propStock,
    openDrawer = true,
  }: {
    product?: any;
    variant?: any;
    kit?: any;
    quantity?: number;
    productId?: string;
    variantId?: string;
    projectKitId?: string;
    name?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    sku?: string;
    stock?: number;
    isKit?: boolean;
    openDrawer?: boolean;
  }) => {
    if (kit) {
      const existing = cart.find((item) => item.projectKitId === kit.id);
      if (existing) {
        setCart((prev) =>
          prev.map((i) =>
            i.projectKitId === kit.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        );
      } else {
        const newItem: CartItem = {
          id: `kit-${kit.id}-${Date.now()}`,
          projectKitId: kit.id,
          name: kit.title || kit.name,
          sku: kit.sku || `KIT-${(kit.category || "ENG").toUpperCase().slice(0, 3)}-${String(kit.id).slice(0, 6)}`,
          price: Number(kit.price),
          originalPrice: Number(kit.mrp || kit.price),
          image: kit.images?.[0] || "/placeholder.png",
          quantity,
          isKit: true,
        };
        setCart((prev) => [...prev, newItem]);
      }
      addToast(`Added "${kit.title || kit.name}" project kit to cart`, "success");
      if (openDrawer) setIsCartDrawerOpen(true);
      return;
    }

    const activeVariant = variant || (product?.variants ? product.variants[0] : null);
    const targetVariantId = activeVariant?.id || variantId;

    if (activeVariant || product) {
      const effectiveStock = activeVariant?.stock ?? propStock ?? 10;
      const effectiveName = activeVariant?.name
        ? (product ? `${product.name} (${activeVariant.name})` : activeVariant.name)
        : (product?.name || name || "Product");
      const effectiveSku = activeVariant?.sku || sku || "SKU-ITEM";
      const effectivePrice = Number(activeVariant?.price ?? price ?? 0);
      const effectiveMrp = Number(activeVariant?.mrp ?? originalPrice ?? effectivePrice);
      const effectiveImage = product?.images?.[0] || image || "/placeholder.png";
      const effectiveProductId = product?.id || productId || "";

      if (effectiveStock <= 0) {
        addToast(`"${effectiveName}" is currently out of stock`, "error");
        return;
      }

      if (user && targetVariantId) {
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variantId: targetVariantId,
              quantity,
            }),
          });

          if (res.ok) {
            await refreshCart();
            addToast(`Added "${effectiveName}" to cart`, "success");
            if (openDrawer) setIsCartDrawerOpen(true);
            return;
          } else {
            const err = await res.json();
            addToast(err.error || "Failed to add item to cart", "error");
            return;
          }
        } catch {
          // fallback to client state
        }
      }

      // Guest cart
      const existing = cart.find((item) => item.variantId === targetVariantId);
      if (existing) {
        setCart((prev) =>
          prev.map((i) =>
            i.variantId === targetVariantId ? { ...i, quantity: i.quantity + quantity } : i
          )
        );
      } else {
        const newItem: CartItem = {
          id: `prod-${targetVariantId || Date.now()}-${Date.now()}`,
          productId: effectiveProductId,
          variantId: targetVariantId,
          name: effectiveName,
          sku: effectiveSku,
          price: effectivePrice,
          originalPrice: effectiveMrp,
          image: effectiveImage,
          quantity,
          stock: effectiveStock,
          isKit: false,
        };
        setCart((prev) => [...prev, newItem]);
      }
      addToast(`Added "${effectiveName}" to cart`, "success");
      if (openDrawer) setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (user) {
      try {
        await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
        await refreshCart();
        addToast("Item removed from cart", "info");
        return;
      } catch {
        // ignore
      }
    }
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast("Item removed from cart", "info");
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    if (user) {
      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId, quantity }),
        });

        if (res.ok) {
          await refreshCart();
          return;
        } else {
          const err = await res.json();
          addToast(err.error || "Stock limit reached", "warning");
          return;
        }
      } catch {
        // ignore
      }
    }

    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch("/api/cart?clear=true", { method: "DELETE" });
      } catch {
        // ignore
      }
    }
    setCart([]);
    setCouponCode("");
    setDiscountAmount(0);
    try {
      localStorage.removeItem(BRAND.cartStorageKey);
      localStorage.removeItem("techbox_cart");
    } catch {
      // ignore
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (user) {
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.added) {
            setWishlist((prev) => [...prev, productId]);
            addToast("Added to wishlist ❤️", "success");
          } else {
            setWishlist((prev) => prev.filter((id) => id !== productId));
            addToast("Removed from wishlist", "info");
          }
          return;
        }
      } catch {
        // ignore
      }
    }

    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast("Removed from wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        addToast("Added to wishlist ❤️", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 499;
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "PARTSLY10" || clean === "TECHBOX10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponCode(clean);
      addToast(`Coupon ${clean} applied (10% OFF)!`, "success");
      return { success: true, message: "10% Student discount applied!" };
    }
    if (clean === "CAMPUSFIRST") {
      const discount = Math.min(150, Math.round(subtotal * 0.15));
      setDiscountAmount(discount);
      setCouponCode(clean);
      addToast("Coupon CAMPUSFIRST applied (₹150 OFF)!", "success");
      return { success: true, message: "Welcome campus discount applied!" };
    }
    return { success: false, message: `Invalid coupon code. Try ${BRAND.defaultCoupon}` };
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    addToast("Coupon removed", "info");
  };

  // Real production login against PostgreSQL API
  const login = async (email: string, password = "password123", role: "CUSTOMER" | "ADMIN" | "STAFF" = "CUSTOMER"): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);

        // Merge guest cart if any
        if (cart.length > 0) {
          try {
            await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ mergeItems: cart }),
            });
          } catch {
            // ignore
          }
        }

        await refreshCart();
        await refreshWishlist();
        addToast(`Welcome back, ${data.user.name}!`, "success");
        setIsAuthModalOpen(false);
        return true;
      } else {
        const err = await res.json();
        addToast(err.error || "Authentication failed", "error");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      addToast("Network error during login", "error");
      return false;
    }
  };

  const signup = async (data: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const resData = await res.json();
        setUser(resData.user);

        // Merge guest cart
        if (cart.length > 0) {
          try {
            await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ mergeItems: cart }),
            });
          } catch {
            // ignore
          }
        }

        await refreshCart();
        await refreshWishlist();
        addToast(`Account created successfully! Welcome to ${BRAND.displayName}.`, "success");
        setIsAuthModalOpen(false);
        return true;
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to create account", "error");
        return false;
      }
    } catch {
      addToast("Network error during signup", "error");
      return false;
    }
  };

  const sendOtp = async (phone: string, purpose: string = "LOGIN") => {
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to send OTP", "error");
        return { success: false, error: data.error, resendAfterSeconds: data.resendAfterSeconds };
      }
      return {
        success: true,
        resendAfterSeconds: data.resendAfterSeconds,
        devOtp: data.devOtp,
        formattedPhone: data.formattedPhone,
        isExistingUser: data.isExistingUser,
      };
    } catch {
      addToast("Network error sending OTP", "error");
      return { success: false, error: "Network error" };
    }
  };

  const verifyOtp = async (phone: string, otp: string, purpose: string = "LOGIN") => {
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, purpose, guestCartItems: cart }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Verification failed", "error");
        return { success: false, error: data.error, attemptsRemaining: data.attemptsRemaining };
      }

      if (!data.isNewUser && data.user) {
        setUser(data.user);
        await refreshCart();
        await refreshWishlist();
        addToast(data.message || `Welcome back, ${data.user.name}!`, "success");
        setIsAuthModalOpen(false);

        if (authRedirectUrl) {
          const dest = authRedirectUrl;
          setAuthRedirectUrl(null);
          window.location.href = dest;
        }
      }
      return data;
    } catch {
      addToast("Network error verifying OTP", "error");
      return { success: false, error: "Network error" };
    }
  };

  const registerWithPhone = async (data: { phone: string; name: string; email?: string }) => {
    try {
      const res = await fetch("/api/auth/otp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, guestCartItems: cart }),
      });
      const resData = await res.json();
      if (!res.ok) {
        addToast(resData.error || "Registration failed", "error");
        return { success: false, error: resData.error };
      }

      setUser(resData.user);
      await refreshCart();
      await refreshWishlist();
      addToast(resData.message || `Account created successfully! Welcome to ${BRAND.displayName}.`, "success");
      setIsAuthModalOpen(false);

      if (authRedirectUrl) {
        const dest = authRedirectUrl;
        setAuthRedirectUrl(null);
        window.location.href = dest;
      }
      return { success: true, user: resData.user };
    } catch {
      addToast("Network error creating account", "error");
      return { success: false, error: "Network error" };
    }
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, guestCartItems: cart }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        await refreshCart();
        await refreshWishlist();
        addToast(`Welcome back, ${data.user.name}!`, "success");
        setIsAuthModalOpen(false);

        if (authRedirectUrl) {
          const dest = authRedirectUrl;
          setAuthRedirectUrl(null);
          window.location.href = dest;
        }
        return true;
      } else {
        addToast(data.error || "Invalid credentials", "error");
        return false;
      }
    } catch {
      addToast("Network error during login", "error");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    setCart([]);
    setWishlist([]);
    try {
      localStorage.removeItem(BRAND.cartStorageKey);
      localStorage.removeItem(BRAND.wishlistStorageKey);
      localStorage.removeItem("techbox_cart");
      localStorage.removeItem("techbox_wishlist");
    } catch {
      // ignore
    }
    addToast("Logged out successfully", "info");
  };

  const switchRole = (role: "CUSTOMER" | "ADMIN" | "STAFF") => {
    if (!user) return;
    setUser({ ...user, role });
    addToast(`Switched active view to ${role}`, "info");
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        subtotal,
        freeDeliveryThreshold,
        freeDeliveryProgress,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authRedirectUrl,
        setAuthRedirectUrl,
        user,
        login,
        signup,
        sendOtp,
        verifyOtp,
        registerWithPhone,
        loginWithPassword,
        logout,
        switchRole,
        selectedCollege,
        setSelectedCollege,
        selectedCampusName,
        setSelectedCampusName,
        selectedPickupPoint,
        setSelectedPickupPoint,
        selectedDeliverySlot,
        setSelectedDeliverySlot,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
