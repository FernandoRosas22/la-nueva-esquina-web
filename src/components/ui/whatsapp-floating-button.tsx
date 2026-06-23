"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { business } from "@/data/business";
import { useCartContext } from "@/hooks/cart-context";
import { useUIContext } from "@/hooks/ui-context";

export function WhatsAppFloatingButton() {
  const whatsappUrl = `https://wa.me/${business.whatsapp.number}`;
  const { totalItems } = useCartContext();
  const { view } = useUIContext();

  // Se oculta mientras el carrito o el checkout están abiertos, para no
  // competir visualmente ni quedar clickeable detrás del overlay.
  const isOverlayOpen = view !== "closed";

  // En mobile, cuando la barra de "Ver carrito" está visible (hay items y
  // el carrito está cerrado), subimos el botón para que no se solapen.
  const mobileCartBarVisible = totalItems > 0 && !isOverlayOpen;

  return (
    <AnimatePresence>
      {!isOverlayOpen && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`fixed right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-noche shadow-[0_4px_20px_rgba(37,211,102,0.5)] transition-[bottom] duration-200 sm:bottom-6 sm:right-6 ${
            mobileCartBarVisible ? "bottom-24" : "bottom-5"
          }`}
        >
          <MessageCircle size={28} fill="currentColor" className="text-noche" strokeWidth={1.5} />
          <span className="absolute h-full w-full animate-ping rounded-full bg-[#25D366]/40" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
