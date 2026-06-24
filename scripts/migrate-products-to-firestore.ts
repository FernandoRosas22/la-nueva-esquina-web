/**
 * Script de migración: copia los productos de src/data/products.ts
 * a la colección "products" de Firestore.
 *
 * Cómo correrlo (una sola vez, desde la raíz del proyecto):
 *   npx tsx scripts/migrate-products-to-firestore.ts
 *
 * Requiere que las variables de entorno de Firebase estén disponibles
 * (las mismas de .env.local). Si usás dotenv automático de Next no aplica
 * acá porque es un script standalone, así que las cargamos a mano abajo.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { products as seedProducts } from "../src/data/products";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function migrate() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      "Faltan variables de entorno de Firebase. Verificá que exista .env.local con NEXT_PUBLIC_FIREBASE_*."
    );
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const productsRef = collection(db, "products");

  // Chequeo de seguridad: si ya hay productos en Firestore, no migramos de
  // nuevo para evitar duplicados. Si se quiere re-migrar a propósito, hay
  // que borrar la colección manualmente desde Firebase Console primero.
  const existing = await getDocs(productsRef);
  if (!existing.empty) {
    console.log(
      `La colección "products" ya tiene ${existing.size} documento(s). No se migró nada para evitar duplicados.`
    );
    console.log('Si querés volver a migrar desde cero, borrá la colección "products" en Firebase Console y corré este script de nuevo.');
    process.exit(0);
  }

  console.log(`Migrando ${seedProducts.length} productos a Firestore...`);

  let order = 0;
  for (const product of seedProducts) {
    await addDoc(productsRef, {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      badge: product.badge ?? "",
      featured: product.featured ?? false,
      active: true,
      order: order++,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ ${product.name}`);
  }

  console.log("\nMigración completa. Revisá la colección en Firebase Console para confirmar.");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("Error durante la migración:", error);
  process.exit(1);
});
