# Reglas de seguridad de Firestore — La Nueva Esquina

Estas son las reglas FINALES que hay que publicar en Firebase Console
(Firestore Database → pestaña "Rules"), reemplazando las reglas temporales
y abiertas que se usaron solo para la migración inicial.

## Reglas a publicar

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Productos: cualquiera puede leerlos (la web pública los necesita
    // sin estar logueado). Solo un usuario autenticado (el admin) puede
    // crear, editar o eliminar.
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // Configuración del negocio: lectura pública, escritura solo admin.
    match /businessSettings/{settingsId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // Categorías: lectura pública (sugerencias en el form de productos),
    // escritura solo admin.
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // Promociones: lectura pública (banner en la web), escritura solo admin.
    match /promotions/{promotionId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // Cualquier otra colección futura: bloqueada por defecto hasta que
    // se agregue una regla explícita para ella.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Cómo publicarlas

1. Firebase Console → tu proyecto → Build → Firestore Database
2. Pestaña **"Rules"**
3. Reemplazar todo el contenido del editor por el bloque de arriba
4. Click en **"Publish"**

## Por qué son seguras

- **Lectura pública** en `products` y `businessSettings`: necesario para
  que la web (catálogo, precios, WhatsApp, etc.) funcione para cualquier
  visitante sin tener que loguearse.
- **Escritura solo autenticado** (`request.auth != null`): solo alguien
  que inició sesión con el email/password creado en Firebase Authentication
  puede crear, editar o eliminar productos o configuración. Como solo la
  dueña tiene esas credenciales, solo ella puede modificar datos.
- **Bloqueo por defecto** de cualquier otra colección: si en el futuro se
  agrega una colección nueva sin actualizar las reglas, queda cerrada por
  seguridad en vez de abierta por accidente.
