"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
                isSuccess
                  ? "bg-[#111111]/95 border-[#22c55e]/30 text-white"
                  : isError
                  ? "bg-[#111111]/95 border-[#ef4444]/40 text-white"
                  : isWarning
                  ? "bg-[#111111]/95 border-[#f59e0b]/40 text-white"
                  : "bg-[#111111]/95 border-[#262626] text-white"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />}
                {isError && <AlertCircle className="w-5 h-5 text-[#ef4444]" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-[#ff6a00]" />}
              </div>

              <div className="flex-1 text-sm leading-snug font-medium text-neutral-200">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-neutral-400 hover:text-white transition-colors p-0.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
