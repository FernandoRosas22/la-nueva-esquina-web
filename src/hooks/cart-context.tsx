"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCart } from "@/hooks/use-cart";

type CartContextValue = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

/** Acceso al carrito global. Debe usarse dentro de <CartProvider>. */
export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de <CartProvider>");
  }
  return context;
}
