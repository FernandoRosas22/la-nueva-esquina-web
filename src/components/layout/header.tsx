"use client";

import Image from "next/image";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCartContext } from "@/hooks/cart-context";
import { useUIContext } from "@/hooks/ui-context";
import { useBusinessSettings } from "@/hooks/use-business-settings";

export function Header() {
  const { totalItems } = useCartContext();
  const { openCart } = useUIContext();
  const data = useBusinessSettings();
  const whatsappUrl = `https://wa.me/${data.whatsapp}`;

  return (
    <header className="sticky top-0 z-50 border-b border-dorado/20 bg-noche/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <a href="#inicio" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt={data.businessName}
            width={48}
            height={48}
            className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
            priority
          />
          <span className="hidden font-display text-lg font-bold leading-tight text-dorado sm:block">
            {data.businessName}
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-3 text-sm font-semibold text-noche transition-transform active:scale-95 sm:px-4"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={openCart}
            aria-label="Ver carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-dorado/40 text-dorado transition-colors hover:bg-dorado/10 active:scale-95"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rojo px-1 text-[11px] font-bold text-crema">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
