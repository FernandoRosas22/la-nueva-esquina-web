"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type UIView = "closed" | "cart" | "checkout";

interface UIContextValue {
  view: UIView;
  openCart: () => void;
  openCheckout: () => void;
  close: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<UIView>("closed");

  const value: UIContextValue = {
    view,
    openCart: () => setView("cart"),
    openCheckout: () => setView("checkout"),
    close: () => setView("closed"),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/** Controla si está abierto el drawer de carrito, el de checkout, o ninguno. */
export function useUIContext(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext debe usarse dentro de <UIProvider>");
  }
  return context;
}
