"use client";

import { ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "@/lib/format-price";
import { useCartContext } from "@/hooks/cart-context";
import { useUIContext } from "@/hooks/ui-context";

export function MobileCartBar() {
  const { totalItems, totalPrice } = useCartContext();
  const { openCart, view } = useUIContext();

  const shouldShow = totalItems > 0 && view === "closed";

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.button
          type="button"
          onClick={openCart}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "tween", duration: 0.25 }}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-2xl bg-amarillo px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] sm:hidden"
        >
          <span className="flex items-center gap-2 font-bold text-noche">
            <ShoppingCart size={20} />
            Ver carrito ({totalItems})
          </span>
          <span className="font-display text-lg font-extrabold text-noche">
            {formatPrice(totalPrice)}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
