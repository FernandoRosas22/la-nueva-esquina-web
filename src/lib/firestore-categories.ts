import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES_COLLECTION = "categories";

export interface CategoryDoc {
  name: string;
  order: number;
  active: boolean;
}

export interface Category extends CategoryDoc {
  id: string;
}

/** Se suscribe en tiempo real a todas las categorías, ordenadas por `order`. */
export function subscribeToCategories(
  onChange: (categories: Category[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const categories = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as CategoryDoc),
      }));
      onChange(categories);
    },
    (error) => {
      console.error("Error al leer categorías de Firestore:", error);
      onError?.(error);
    }
  );
}

/** Crea una categoría nueva. */
export async function createCategory(data: CategoryDoc) {
  return addDoc(collection(db, CATEGORIES_COLLECTION), data);
}

/** Actualiza una categoría existente. */
export async function updateCategory(id: string, data: Partial<CategoryDoc>) {
  return updateDoc(doc(db, CATEGORIES_COLLECTION, id), data);
}

/** Elimina una categoría. No afecta a los productos que ya tengan ese texto en su campo `category`. */
export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}
