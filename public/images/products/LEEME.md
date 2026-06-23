# Imágenes de productos — pendientes de reemplazo

Los archivos `.svg` de esta carpeta son **placeholders temporales**, generados
automáticamente para que la web funcione mientras no haya fotos reales de
cada plato.

## Cómo reemplazar una imagen

1. Sacar (o pedir) una foto del plato real. Recomendado: cuadrada o 4:3,
   buena luz, fondo simple, mínimo 1000x1000px.
2. Guardarla en esta misma carpeta con formato `.jpg` o `.webp`, por ejemplo:
   `combo-messi.jpg`
3. Abrir `src/data/products.ts` y cambiar la extensión en el campo `image`
   del producto correspondiente:

   ```ts
   image: "/images/products/combo-messi.svg",   // antes
   image: "/images/products/combo-messi.jpg",   // después
   ```

4. Listo. Next.js optimiza automáticamente la imagen nueva.

## Productos pendientes de foto real

- combo-messi
- combo-dibu-martinez
- combo-adolescente
- combo-argento
- combo-mcallister
- mila-con-fritas
- empanadas
- hamburguesa-clasica
- sandwich-de-milanesa
