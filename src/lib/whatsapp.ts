import { storeConfig } from "@/config/store";
import { formatPrice } from "@/lib/format-price";
import type { CartItem, CheckoutData } from "@/types";

const paymentLabels: Record<CheckoutData["paymentMethod"], string> = {
  transferencia: "Transferencia",
  efectivo: "Efectivo",
};

/** Construye el texto del pedido en el formato pactado con el negocio. */
export function buildOrderMessage(items: CartItem[], checkout: CheckoutData): string {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const itemsLines = items
    .map((item) => {
      const label = item.variantName ? `${item.name} (${item.variantName})` : item.name;
      return `• ${label} x${item.quantity}`;
    })
    .join("\n");

  const lines = [
    storeConfig.whatsapp.header,
    "",
    "Cliente:",
    checkout.name,
    "",
    "Teléfono:",
    checkout.phone,
    "",
    "Dirección:",
    checkout.address,
    "",
    "PEDIDO",
    itemsLines,
    "",
    "Total:",
    formatPrice(total),
    "",
    "Forma de pago:",
    paymentLabels[checkout.paymentMethod],
  ];

  if (checkout.comments.trim()) {
    lines.push("", "Comentarios:", checkout.comments.trim());
  }

  lines.push("", storeConfig.whatsapp.footer);

  return lines.join("\n");
}

/**
 * Devuelve la URL de wa.me lista para abrir, con el mensaje codificado.
 * `whatsappNumber` se pasa desde afuera (configuración dinámica del
 * negocio) en vez de leerse fijo de business.ts.
 */
export function buildWhatsAppUrl(
  items: CartItem[],
  checkout: CheckoutData,
  whatsappNumber: string
): string {
  const message = buildOrderMessage(items, checkout);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
