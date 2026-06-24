import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";

const PRODUCTS_COLLECTION = "products";

/** Forma de un documento de producto tal como se guarda en Firestore. */
export interface ProductDoc {
  name: string;
  description: string;
  price: number;
  /** URL completa de la imagen (no se usa Firebase Storage por ahora) */
  image: string;
  category: string;
  badge?: string;
  featured: boolean;
  active: boolean;
  /** Orden de aparición en el catálogo */
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/** Convierte un documento de Firestore al tipo Product usado en toda la UI pública. */
function toProduct(id: string, data: ProductDoc): Product {
  return {
    id,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    category: data.category,
    badge: data.badge || undefined,
    featured: data.featured,
  };
}

/**
 * Se suscribe en tiempo real a los productos ACTIVOS, ordenados por `order`.
 * Usado por la web pública (catálogo). Devuelve la función de cleanup.
 */
export function subscribeToActiveProducts(
  onChange: (products: Product[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs
        .map((d) => ({ id: d.id, data: d.data() as ProductDoc }))
        .filter((d) => d.data.active !== false)
        .map((d) => toProduct(d.id, d.data));
      onChange(products);
    },
    (error) => {
      console.error("Error al leer productos de Firestore:", error);
      onError?.(error);
    }
  );
}

/** Producto con sus metadatos administrativos, usado solo en /admin. */
export type AdminProduct = Product & { active: boolean; order: number; updatedAt: Date | null };

/**
 * Se suscribe en tiempo real a TODOS los productos (activos e inactivos).
 * Usado por el panel de administración.
 */
export function subscribeToAllProductsAdmin(
  onChange: (products: AdminProduct[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs.map((d) => {
        const data = d.data() as ProductDoc;
        const updatedAtValue = data.updatedAt;
        const updatedAt =
          updatedAtValue && typeof updatedAtValue === "object" && "toDate" in updatedAtValue
            ? (updatedAtValue as { toDate: () => Date }).toDate()
            : null;
        return {
          ...toProduct(d.id, data),
          active: data.active !== false,
          order: data.order ?? 0,
          updatedAt,
        };
      });
      onChange(products);
    },
    (error) => {
      console.error("Error al leer productos (admin) de Firestore:", error);
      onError?.(error);
    }
  );
}

/** Crea un producto nuevo en Firestore. */
export async function createProduct(data: Omit<ProductDoc, "createdAt" | "updatedAt">) {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  return addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...clean,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Actualiza campos puntuales de un producto existente. */
export async function updateProductDoc(id: string, data: Partial<ProductDoc>) {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  return updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
    ...clean,
    updatedAt: serverTimestamp(),
  });
}

/** Elimina un producto definitivamente de Firestore. */
export async function deleteProductDoc(id: string) {
  return deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}
