"use client";

import { useEffect, useState } from "react";
import { subscribeToBusinessSettings } from "@/lib/firestore-settings";
import { businessFallback } from "@/lib/business-data";
import type { EffectiveBusinessData } from "@/lib/firestore-settings";

function pickValue(value: string | undefined, fallback: string): string {
  return value && value.trim() !== "" ? value : fallback;
}

/**
 * Se suscribe en tiempo real a la configuración del negocio en Firestore.
 * Mientras no haya datos (carga inicial o campo vacío), usa el valor fijo
 * de business.ts campo por campo, así la web nunca muestra espacios vacíos.
 */
export function useBusinessSettings(): EffectiveBusinessData {
  const [data, setData] = useState<EffectiveBusinessData>(businessFallback);

  useEffect(() => {
    const unsubscribe = subscribeToBusinessSettings(
      (settings) => {
        if (!settings) return;
        setData({
          businessName: pickValue(settings.businessName, businessFallback.businessName),
          whatsapp: pickValue(settings.whatsapp, businessFallback.whatsapp),
          address: pickValue(settings.address, businessFallback.address),
          hours: pickValue(settings.hours, businessFallback.hours),
          instagram: pickValue(settings.instagram, businessFallback.instagram),
          facebook: pickValue(settings.facebook, businessFallback.facebook),
          alias: pickValue(settings.alias, businessFallback.alias),
          cbu: pickValue(settings.cbu, businessFallback.cbu),
          slogan: pickValue(settings.slogan, businessFallback.slogan),
          heroDescription: pickValue(settings.heroDescription, businessFallback.heroDescription),
          seoTitle: pickValue(settings.seoTitle, businessFallback.seoTitle),
          seoDescription: pickValue(settings.seoDescription, businessFallback.seoDescription),
        });
      },
      () => {
        // Si Firestore falla, nos quedamos con el fallback ya establecido.
      }
    );
    return unsubscribe;
  }, []);

  return data;
}
