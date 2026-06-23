"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { featuredProducts } from "@/data/products";
import { formatPrice } from "@/lib/format-price";
import { useCartContext } from "@/hooks/cart-context";
import { useProductModalContext } from "@/hooks/product-modal-context";

export function FeaturedSection() {
  const { addItem } = useCartContext();
  const { openProduct } = useProductModalContext();

  return (
    <section id="destacados" className="bg-noche px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-dorado/30" />
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-amarillo sm:text-3xl">
            Más Pedidos
          </h2>
          <span className="h-px flex-1 bg-dorado/30" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-dorado/30 bg-noche-suave shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {product.badge && (
                <div className="absolute left-3 top-3 z-10">
                  <Badge variant="rojo">{product.badge}</Badge>
                </div>
              )}

              <button
                type="button"
                onClick={() => openProduct(product)}
                aria-label={`Ver detalle de ${product.name}`}
                className="relative h-56 w-full cursor-pointer overflow-hidden sm:h-64"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/10 to-transparent" />
              </button>

              <div className="flex flex-1 flex-col p-5">
                <button type="button" onClick={() => openProduct(product)} className="text-left">
                  <h3 className="font-display text-xl font-bold text-crema transition-colors hover:text-amarillo">
                    {product.name}
                  </h3>
                </button>
                <p className="mt-1 line-clamp-2 text-sm text-crema/70">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-2xl font-extrabold text-amarillo">
                    {formatPrice(product.price)}
                  </span>
                  <Button size="sm" onClick={() => addItem(product)}>
                    Agregar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
