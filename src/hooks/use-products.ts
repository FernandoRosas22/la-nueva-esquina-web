"use client";

import { useEffect, useState } from "react";
import { subscribeToActiveProducts } from "@/lib/firestore-products";
import type { Product } from "@/types";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

/**
 * Se suscribe en tiempo real a los productos activos en Firestore.
 * Cuando se edita o agrega un producto desde /admin, esta lista se
 * actualiza sola, sin recargar la página.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToActiveProducts(
      (data) => {
        setProducts(data);
        setLoading(false);
        setError(null);
      },
      () => {
        setError("No se pudieron cargar los productos. Probá de nuevo en un momento.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { products, loading, error };
}
