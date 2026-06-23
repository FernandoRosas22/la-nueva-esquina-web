// Configuración general de comportamiento de la tienda.
// Separado de business.ts porque acá van "reglas", no datos de contacto.

export const storeConfig = {
  /** Clave usada en localStorage para persistir el carrito */
  cartStorageKey: "lne_cart_v1",

  /** Moneda y formato de precios */
  currency: "ARS",
  locale: "es-AR",

  /** Cantidad máxima de unidades por producto en el carrito */
  maxQuantityPerItem: 20,

  /** Mensaje de WhatsApp: encabezado y pie fijo del pedido */
  whatsapp: {
    header: "🛒 NUEVO PEDIDO",
    footer: "Pedido generado desde La Nueva Esquina Web",
  },

  /** Métodos de pago habilitados, en el orden que se muestran en el checkout */
  paymentMethods: [
    { id: "transferencia", label: "Transferencia" },
    { id: "efectivo", label: "Efectivo" },
  ] as const,
} as const;
