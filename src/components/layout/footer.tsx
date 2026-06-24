"use client";

import { MapPin, Clock, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { business } from "@/data/business";
import { useBusinessSettings } from "@/hooks/use-business-settings";

export function Footer() {
  const data = useBusinessSettings();

  return (
    <footer className="border-t border-dorado/20 bg-noche px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold text-dorado">{data.businessName}</h3>
            <p className="mt-2 text-sm text-crema/60">{data.slogan}</p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-crema/70">
            <div className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-dorado" />
              <span>{data.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={18} className="mt-0.5 shrink-0 text-dorado" />
              <span>{data.hours}</span>
            </div>
            <a
              href={`https://wa.me/${data.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amarillo"
            >
              <MessageCircle size={18} className="shrink-0 text-dorado" />
              Pedir por WhatsApp
            </a>
            {data.instagram && (
              <a
                href={data.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-amarillo"
              >
                <InstagramIcon size={18} className="shrink-0 text-dorado" />
                Seguinos en Instagram
              </a>
            )}
          </div>

          <div className="text-sm text-crema/60">
            <p className="font-semibold text-crema/80">Sitio desarrollado por</p>
            <a
              href={business.developer.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-2 text-dorado hover:text-amarillo"
            >
              <InstagramIcon size={16} />
              {business.developer.name}
            </a>
            <p className="mt-2 text-xs text-crema/40">
              ¿Necesitás una web como esta para tu negocio? Escribime por Instagram.
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-crema/30">
          © {new Date().getFullYear()} {data.businessName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
