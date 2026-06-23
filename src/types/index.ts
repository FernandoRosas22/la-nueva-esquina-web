// Tipos compartidos de toda la aplicación.
// Mantener este archivo como única fuente de verdad evita
// definiciones de tipos duplicadas o inconsistentes entre componentes.

export type ProductCategory =
  | "combos"
  | "milanesas"
  | "empanadas"
  | "hamburguesas"
  | "sandwiches";

export interface ProductVariant {
  /** Identificador único de la variante dentro del producto (ej: "media-docena") */
  id: string;
  /** Nombre visible de la variante (ej: "Media Docena") */
  name: string;
  /** Precio en pesos argentinos, sin formatear */
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Precio base. Si el producto tiene variantes, este precio se ignora en la UI. */
  price: number;
  image: string;
  category: ProductCategory;
  /** Marca productos para la sección "Más Pedidos" */
  featured?: boolean;
  /** Etiqueta promocional opcional, ej: "PROMO", "NUEVO" */
  badge?: string;
  /** Variantes de tamaño/cantidad (ej: empanadas por media docena o docena) */
  variants?: ProductVariant[];
}

export interface CartItem {
  /** Clave única en el carrito: combina productId + variantId si existe */
  key: string;
  productId: string;
  name: string;
  /** Nombre de la variante elegida, si aplica */
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
}

export type PaymentMethod = "transferencia" | "efectivo";

export interface CheckoutData {
  name: string;
  phone: string;
  address: string;
  comments: string;
  paymentMethod: PaymentMethod;
}

export interface BusinessHours {
  /** Hora de apertura en formato 24hs, ej: "19:00" */
  open: string;
  /** Hora de cierre en formato 24hs, ej: "00:00" */
  close: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}
