import { business } from "@/data/business";
import { getEffectiveBusinessData, type EffectiveBusinessData } from "@/lib/firestore-settings";

/** Fallback construido desde business.ts, usado cuando Firestore no tiene el dato. */
export const businessFallback: EffectiveBusinessData = {
  businessName: business.name,
  whatsapp: business.whatsapp.number,
  address: business.address,
  hours: business.hoursLabel,
  instagram: business.social.instagram ?? "",
  facebook: "",
  alias: "",
  cbu: "",
  slogan: business.slogan,
  heroDescription: business.description,
  seoTitle: business.seo.title,
  seoDescription: business.seo.description,
};

/**
 * Obtiene los datos efectivos del negocio (Firestore con fallback a
 * business.ts), ya resueltos contra el fallback de este sitio. Pensado
 * para usarse en Server Components.
 */
export async function getBusinessData(): Promise<EffectiveBusinessData> {
  return getEffectiveBusinessData(businessFallback);
}
