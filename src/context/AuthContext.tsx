"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SOLE_ADMIN_EMAIL } from "@/lib/security";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: UserSession | null;
  isAdmin: boolean;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // Load session from LocalStorage on initial load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("partsly_user_session");
      const savedToken = localStorage.getItem("partsly_auth_token");
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAdmin = Boolean(user && user.email.trim().toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase());

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("partsly_user_session", JSON.stringify(data.user));
        localStorage.setItem("partsly_auth_token", data.token);
        closeAuthModal();
        return { success: true, message: data.message || "Logged in successfully" };
      } else {
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch (err: any) {
      return { success: false, message: err.message || "Network error during login" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("partsly_user_session", JSON.stringify(data.user));
        localStorage.setItem("partsly_auth_token", data.token);
        closeAuthModal();
        return { success: true, message: data.message || "Account created successfully" };
      } else {
        return { success: false, message: data.message || "Failed to create account" };
      }
    } catch (err: any) {
      return { success: false, message: err.message || "Network error during sign up" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("partsly_user_session");
    localStorage.removeItem("partsly_auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
