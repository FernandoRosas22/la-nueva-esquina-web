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
  /** Slogan corto, debajo del nombre en el hero (ej: "Tu mejor versión en cada comida") */
  slogan: string;
  /** Texto descriptivo del hero, debajo del slogan */
  heroDescription: string;
  /** Título que ve Google en los resultados de búsqueda */
  seoTitle: string;
  /** Meta descripción que ve Google en los resultados de búsqueda */
  seoDescription: string;
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
  slogan: "",
  heroDescription: "",
  seoTitle: "",
  seoDescription: "",
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

/**
 * Datos efectivos del negocio: usa lo configurado en Firestore si existe
 * y no está vacío, y cae al valor fijo de business.ts en caso contrario.
 * Pensado para Server Components (SEO, schema, sitemap) y para el primer
 * render de componentes de cliente antes de que llegue el listener.
 */
export interface EffectiveBusinessData {
  businessName: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  alias: string;
  cbu: string;
  slogan: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
}

function pickValue(firestoreValue: string | undefined, fallback: string): string {
  return firestoreValue && firestoreValue.trim() !== "" ? firestoreValue : fallback;
}

/**
 * Lee la configuración de Firestore una sola vez y la combina con los
 * valores fijos de business.ts como respaldo campo por campo. Si Firestore
 * falla (sin red, regla denegada, etc.) devuelve directamente el fallback
 * completo en vez de romper la página.
 */
export async function getEffectiveBusinessData(
  fallback: EffectiveBusinessData
): Promise<EffectiveBusinessData> {
  try {
    const settings = await getBusinessSettings();
    if (!settings) return fallback;
    return {
      businessName: pickValue(settings.businessName, fallback.businessName),
      whatsapp: pickValue(settings.whatsapp, fallback.whatsapp),
      address: pickValue(settings.address, fallback.address),
      hours: pickValue(settings.hours, fallback.hours),
      instagram: pickValue(settings.instagram, fallback.instagram),
      facebook: pickValue(settings.facebook, fallback.facebook),
      alias: pickValue(settings.alias, fallback.alias),
      cbu: pickValue(settings.cbu, fallback.cbu),
      slogan: pickValue(settings.slogan, fallback.slogan),
      heroDescription: pickValue(settings.heroDescription, fallback.heroDescription),
      seoTitle: pickValue(settings.seoTitle, fallback.seoTitle),
      seoDescription: pickValue(settings.seoDescription, fallback.seoDescription),
    };
  } catch (error) {
    console.error("Error al leer configuración de Firestore, usando valores fijos:", error);
    return fallback;
  }
}
