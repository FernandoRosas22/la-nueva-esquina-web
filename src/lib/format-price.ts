import { storeConfig } from "@/config/store";

/** Formatea un número como precio en pesos argentinos: 30000 -> "$30.000" */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat(storeConfig.locale, {
    style: "currency",
    currency: storeConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("ARS", "$")
    .trim();
}
