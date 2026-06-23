"use client";

import Image from "next/image";
import { X, Trash2, ShoppingBag, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPrice } from "@/lib/format-price";
import { useCartContext } from "@/hooks/cart-context";
import { useUIContext } from "@/hooks/ui-context";

export function CartDrawer() {
  const { view, close, openCheckout } = useUIContext();
  const { items, increment, decrement, removeItem, clearCart, totalPrice } =
    useCartContext();

  const isOpen = view === "cart";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-noche-suave shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between border-b border-dorado/20 px-5 py-4">
              <h2 className="font-display text-xl font-bold text-dorado">Tu pedido</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar carrito"
                className="rounded-full p-2 text-crema/70 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-crema/60">
                <ShoppingBag size={40} className="text-dorado/40" />
                <p>Todavía no agregaste nada. ¡Elegí algo rico del menú!</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <li
                        key={item.key}
                        className="flex gap-3 border-b border-white/5 pb-4 last:border-none"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-dorado/20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-crema">{item.name}</p>
                              {item.variantName && (
                                <p className="text-xs text-crema/50">{item.variantName}</p>
                              )}
                              <p className="mt-0.5 text-xs text-crema/40">
                                {formatPrice(item.price)} c/u
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              aria-label={`Quitar ${item.name}`}
                              className="text-crema/40 hover:text-rojo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              quantity={item.quantity}
                              onIncrement={() => increment(item.key)}
                              onDecrement={() => decrement(item.key)}
                            />
                            <span className="font-display font-bold text-amarillo">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-4 text-sm font-medium text-crema/50 underline hover:text-rojo"
                  >
                    Vaciar carrito
                  </button>
                </div>

                <div className="border-t border-dorado/20 px-5 py-4">
                  <div className="mb-3 flex items-center justify-between rounded-2xl bg-noche px-4 py-3">
                    <span className="text-base font-semibold text-crema">Total</span>
                    <span className="font-display text-3xl font-extrabold text-amarillo">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="mb-3 flex items-center justify-center gap-1.5 text-xs font-medium text-crema/60">
                    <ShieldCheck size={14} className="text-amarillo" />
                    Pedido seguro · Confirmación inmediata por WhatsApp
                  </p>
                  <Button size="lg" className="w-full" onClick={openCheckout}>
                    Continuar pedido
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
