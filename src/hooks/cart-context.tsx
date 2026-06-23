"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useCart } from "@/hooks/use-cart";
import { useUIContext } from "@/hooks/ui-context";
import { useToastContext } from "@/hooks/toast-context";
import type { Product, ProductVariant } from "@/types";

type BaseCartValue = ReturnType<typeof useCart>;
type CartContextValue = BaseCartValue;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  const { openCart } = useUIContext();
  const { showToast } = useToastContext();

  // Envolvemos addItem para que, además de sumar el producto al carrito,
  // muestre una notificación y abra el carrito automáticamente
  // (igual que la referencia de Ale Burgers).
  const addItem = useCallback(
    (product: Product, variant?: ProductVariant) => {
      cart.addItem(product, variant);
      showToast("Producto agregado al carrito");
      openCart();
    },
    [cart, openCart, showToast]
  );

  const value: CartContextValue = { ...cart, addItem };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Acceso al carrito global. Debe usarse dentro de <CartProvider>. */
export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de <CartProvider>");
  }
  return context;
}
