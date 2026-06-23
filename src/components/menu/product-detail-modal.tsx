"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPrice } from "@/lib/format-price";
import { useCartContext } from "@/hooks/cart-context";
import { useProductModalContext } from "@/hooks/product-modal-context";
import type { ProductVariant } from "@/types";

/** Chips por defecto, usados solo si el producto no tiene `chips` propios. */
const chipsPorDefecto = [
  "🥩 Preparado al momento",
  "🔥 Producto caliente",
  "🚚 Entrega rápida",
  "⭐ Calidad garantizada",
];

export function ProductDetailModal() {
  const { product, closeProduct } = useProductModalContext();
  const { addItem } = useCartContext();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  const isOpen = Boolean(product);
  const hasVariants = Boolean(product?.variants?.length);

  // Cada vez que se abre un producto nuevo, resetear cantidad y variante
  // seleccionada para no arrastrar el estado del producto anterior.
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant(product.variants?.[0]);
    }
  }, [product]);

  if (!product) return null;

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const chips = product.chips && product.chips.length > 0 ? product.chips : chipsPorDefecto;

  const handleAdd = () => {
    addItem(product, hasVariants ? selectedVariant : undefined, quantity);
    closeProduct();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeProduct}
          />
          <div className="fixed inset-0 z-[71] flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-noche-suave shadow-2xl sm:max-w-lg sm:rounded-3xl"
            >
              {/* Imagen grande, protagonista */}
              <div className="relative h-72 w-full shrink-0 overflow-hidden rounded-t-3xl sm:h-80">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noche-suave via-transparent to-black/30" />

                {product.badge && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="rojo">{product.badge}</Badge>
                  </div>
                )}

                <button
                  type="button"
                  onClick={closeProduct}
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-crema backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Información del producto */}
              <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                <h2 className="font-display text-2xl font-extrabold text-crema sm:text-3xl">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-crema/75 sm:text-base">
                  {product.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-dorado/20 bg-noche px-3 py-1 text-xs font-medium text-crema/60"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {hasVariants && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-crema/80">Elegí una opción</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants!.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                            selectedVariant?.id === variant.id
                              ? "border-amarillo bg-amarillo text-noche"
                              : "border-dorado/40 text-crema/80 hover:border-dorado"
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precio destacado + selector de cantidad */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <span className="font-display text-4xl font-extrabold text-amarillo">
                    {formatPrice(displayPrice)}
                  </span>
                  <QuantityStepper
                    quantity={quantity}
                    onIncrement={() => setQuantity((q) => Math.min(q + 1, 20))}
                    onDecrement={() => setQuantity((q) => Math.max(q - 1, 1))}
                  />
                </div>

                {/* Acciones */}
                <div className="mt-6 flex flex-col gap-3">
                  <Button size="lg" className="w-full" onClick={handleAdd}>
                    <ShoppingCart size={18} />
                    Agregar al carrito
                  </Button>
                  <button
                    type="button"
                    onClick={closeProduct}
                    className="text-center text-sm font-semibold text-crema/60 underline-offset-4 transition-colors hover:text-amarillo hover:underline"
                  >
                    Seguir viendo menú
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
