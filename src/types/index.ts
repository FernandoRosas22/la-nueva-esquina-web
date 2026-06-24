// Tipos compartidos de toda la aplicación.
// Mantener este archivo como única fuente de verdad evita
// definiciones de tipos duplicadas o inconsistentes entre componentes.

// Antes era un union fijo ("combos" | "milanesas" | ...). Ahora las
// categorías son dinámicas (se administran desde /admin y viven en
// Firestore), así que el tipo pasa a ser el id de categoría como string.
export type ProductCategory = string;

export interface ProductVariant {
  /** Identificador único de la variante dentro del producto (ej: "media-docena") */
  id: string;
  /** Nombre visible de la variante (ej: "Media Docena") */
  name: string;
  /** Precio en pesos argentinos, sin formatear */
  price: number;
}

/**
 * Extra opcional que se puede sumar a un producto (ej: "Extra cheddar").
 * PREPARADO PARA EL FUTURO: el tipo ya existe y los productos pueden declarar
 * `extras`, pero todavía no hay UI conectada para seleccionarlos en el carrito.
 * Cuando se quiera activar, el componente ProductCard es el lugar natural
 * para agregar los checkboxes/steppers correspondientes.
 */
export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

/**
 * Observación predefinida para un producto (ej: "Sin tomate", "Sin cebolla").
 * PREPARADO PARA EL FUTURO: mismo estado que ProductExtra, sin UI todavía.
 */
export interface ProductObservation {
  id: string;
  label: string;
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
  /** Chips cortos debajo de la descripción (ej: "Preparado al momento") */
  chips?: string[];
  /** Extras opcionales (preparado para el futuro, sin UI activa aún) */
  extras?: ProductExtra[];
  /** Observaciones predefinidas (preparado para el futuro, sin UI activa aún) */
  observations?: ProductObservation[];
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
