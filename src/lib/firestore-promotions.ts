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

const PROMOTIONS_COLLECTION = "promotions";

export interface PromotionDoc {
  title: string;
  description: string;
  active: boolean;
  order: number;
}

export interface Promotion extends PromotionDoc {
  id: string;
}

/** Se suscribe en tiempo real a TODAS las promociones (admin). */
export function subscribeToPromotionsAdmin(
  onChange: (promotions: Promotion[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, PROMOTIONS_COLLECTION), orderBy("order", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as PromotionDoc) })));
    },
    (error) => {
      console.error("Error al leer promociones de Firestore:", error);
      onError?.(error);
    }
  );
}

/** Se suscribe en tiempo real solo a las promociones ACTIVAS (web pública). */
export function subscribeToActivePromotions(
  onChange: (promotions: Promotion[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, PROMOTIONS_COLLECTION), orderBy("order", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const promotions = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as PromotionDoc) }))
        .filter((p) => p.active);
      onChange(promotions);
    },
    (error) => {
      console.error("Error al leer promociones de Firestore:", error);
      onError?.(error);
    }
  );
}

export async function createPromotion(data: PromotionDoc) {
  return addDoc(collection(db, PROMOTIONS_COLLECTION), data);
}

export async function updatePromotion(id: string, data: Partial<PromotionDoc>) {
  return updateDoc(doc(db, PROMOTIONS_COLLECTION, id), data);
}

export async function deletePromotion(id: string) {
  return deleteDoc(doc(db, PROMOTIONS_COLLECTION, id));
}
