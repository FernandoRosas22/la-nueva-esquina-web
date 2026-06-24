import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SETTINGS_COLLECTION = "businessSettings";
/** Documento único: siempre usamos este mismo id fijo. */
const SETTINGS_DOC_ID = "main";

export interface BusinessSettingsDoc {
  businessName: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  alias: string;
  cbu: string;
}

export const defaultBusinessSettings: BusinessSettingsDoc = {
  businessName: "",
  whatsapp: "",
  address: "",
  hours: "",
  instagram: "",
  facebook: "",
  alias: "",
  cbu: "",
};

function settingsDocRef() {
  return doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
}

/** Lee la configuración una sola vez (usado en la web pública en el primer render). */
export async function getBusinessSettings(): Promise<BusinessSettingsDoc | null> {
  const snap = await getDoc(settingsDocRef());
  if (!snap.exists()) return null;
  return snap.data() as BusinessSettingsDoc;
}

/** Se suscribe en tiempo real a la configuración del negocio. */
export function subscribeToBusinessSettings(
  onChange: (settings: BusinessSettingsDoc | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    settingsDocRef(),
    (snap) => {
      onChange(snap.exists() ? (snap.data() as BusinessSettingsDoc) : null);
    },
    (error) => {
      console.error("Error al leer businessSettings de Firestore:", error);
      onError?.(error);
    }
  );
}

/** Crea o actualiza el documento de configuración del negocio. */
export async function saveBusinessSettings(data: BusinessSettingsDoc) {
  return setDoc(settingsDocRef(), data, { merge: true });
}
