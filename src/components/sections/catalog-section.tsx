"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/menu/product-card";
import { useProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";

export function CatalogSection() {
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  // Las categorías ya no son una lista fija: se derivan de los productos
  // que efectivamente existen en Firestore, en el orden en que aparecen.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const product of products) {
      if (!seen.has(product.category)) {
        seen.add(product.category);
        list.push(product.category);
      }
    }
    return list;
  }, [products]);

  const visibleProducts =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="catalogo" className="bg-noche px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-dorado sm:text-3xl">
            Nuestro Menú
          </h2>
          <p className="mt-2 text-crema/60">Elegí lo que más te guste y agregalo al carrito</p>
        </div>

        {!loading && products.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("todos")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-colors",
                activeCategory === "todos"
                  ? "border-amarillo bg-amarillo text-noche"
                  : "border-dorado/30 text-crema/80 hover:border-dorado"
              )}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-colors",
                  activeCategory === category
                    ? "border-amarillo bg-amarillo text-noche"
                    : "border-dorado/30 text-crema/80 hover:border-dorado"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-crema/60">
            <Loader2 className="animate-spin text-amarillo" size={28} />
            <p>Cargando menú...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rojo/30 bg-rojo/10 px-5 py-8 text-center text-crema/80">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dorado/20 bg-noche-suave px-5 py-12 text-center text-crema/60">
            Todavía no hay productos cargados en el menú.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="flex flex-col gap-5">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
