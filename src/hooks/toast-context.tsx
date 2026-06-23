"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

export interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Cuánto dura cada toast en pantalla antes de desaparecer solo. */
const TOAST_DURATION_MS = 2000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>{children}</ToastContext.Provider>
  );
}

/** Acceso al sistema de notificaciones. Debe usarse dentro de <ToastProvider>. */
export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext debe usarse dentro de <ToastProvider>");
  }
  return context;
}
