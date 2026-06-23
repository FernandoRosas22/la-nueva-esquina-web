"use client";

import { useCallback, useEffect, useState } from "react";
import { storeConfig } from "@/config/store";
import type { CartItem, Product, ProductVariant } from "@/types";

/** Genera la clave única de un item dentro del carrito. */
function buildItemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}__${variantId}` : productId;
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storeConfig.cartStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    // Si el contenido guardado está corrupto, arrancamos con carrito vacío
    // en vez de romper toda la app.
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar el carrito guardado una sola vez, al montar en el cliente.
  useEffect(() => {
    setItems(readCartFromStorage());
    setIsHydrated(true);
  }, []);

  // Persistir cada cambio del carrito.
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(storeConfig.cartStorageKey, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product, variant?: ProductVariant) => {
    const key = buildItemKey(product.id, variant?.id);
    const price = variant ? variant.price : product.price;
    const name = product.name;
    const variantName = variant?.name;

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        const nextQuantity = Math.min(
          existing.quantity + 1,
          storeConfig.maxQuantityPerItem
        );
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: nextQuantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name,
          variantName,
          price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.key !== key);
      }
      const clamped = Math.min(quantity, storeConfig.maxQuantityPerItem);
      return prev.map((item) =>
        item.key === key ? { ...item, quantity: clamped } : item
      );
    });
  }, []);

  const increment = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (item) setQuantity(key, item.quantity + 1);
    },
    [items, setQuantity]
  );

  const decrement = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (item) setQuantity(key, item.quantity - 1);
    },
    [items, setQuantity]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    isHydrated,
    addItem,
    removeItem,
    setQuantity,
    increment,
    decrement,
    clearCart,
    totalItems,
    totalPrice,
  };
}
