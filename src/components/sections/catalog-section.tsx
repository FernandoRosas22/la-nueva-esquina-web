"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/menu/product-card";
import { categoryLabels, categoryOrder, products } from "@/data/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState<Product["category"] | "todos">(
    "todos"
  );

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

        {/* Tabs de categoría */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              activeCategory === "todos"
                ? "border-amarillo bg-amarillo text-noche"
                : "border-dorado/30 text-crema/80 hover:border-dorado"
            )}
          >
            Todos
          </button>
          {categoryOrder.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                activeCategory === category
                  ? "border-amarillo bg-amarillo text-noche"
                  : "border-dorado/30 text-crema/80 hover:border-dorado"
              )}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Listado */}
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
      </div>
    </section>
  );
}
