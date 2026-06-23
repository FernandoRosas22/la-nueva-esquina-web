"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCartContext } from "@/hooks/cart-context";
import { useProductModalContext } from "@/hooks/product-modal-context";
import type { Product, ProductVariant } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartContext();
  const { openProduct } = useProductModalContext();
  const hasVariants = Boolean(product.variants?.length);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAdd = () => {
    addItem(product, hasVariants ? selectedVariant : undefined);
  };

  return (
    <div className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-dorado/20 bg-noche-suave shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-dorado/50 hover:shadow-xl sm:flex-row">
      <button
        type="button"
        onClick={() => openProduct(product)}
        aria-label={`Ver detalle de ${product.name}`}
        className="relative h-52 w-full shrink-0 cursor-pointer overflow-hidden sm:h-auto sm:w-56"
      >
        {product.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="rojo">{product.badge}</Badge>
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 224px"
        />
      </button>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <button
            type="button"
            onClick={() => openProduct(product)}
            className="text-left"
          >
            <h3 className="font-display text-xl font-bold text-crema transition-colors hover:text-amarillo sm:text-2xl">
              {product.name}
            </h3>
          </button>
          <p className="mt-1 text-sm text-crema/70 sm:text-base">{product.description}</p>

          {product.chips && product.chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-dorado/20 bg-noche px-3 py-1 text-xs font-medium text-crema/60"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {hasVariants && (
            <div className="mt-4 flex flex-wrap gap-2">
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
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="font-display text-2xl font-extrabold text-amarillo">
            {formatPrice(displayPrice)}
          </span>
          <Button size="md" onClick={handleAdd} className="shrink-0">
            <Plus size={18} />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
