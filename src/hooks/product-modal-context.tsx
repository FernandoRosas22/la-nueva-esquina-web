"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/types";

interface ProductModalContextValue {
  /** Producto actualmente mostrado en el modal de detalle, o null si está cerrado */
  product: Product | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
}

const ProductModalContext = createContext<ProductModalContextValue | null>(null);

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const value: ProductModalContextValue = {
    product,
    openProduct: (p) => setProduct(p),
    closeProduct: () => setProduct(null),
  };

  return (
    <ProductModalContext.Provider value={value}>{children}</ProductModalContext.Provider>
  );
}

/** Controla el modal de detalle de producto. Debe usarse dentro de <ProductModalProvider>. */
export function useProductModalContext(): ProductModalContextValue {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error("useProductModalContext debe usarse dentro de <ProductModalProvider>");
  }
  return context;
}
