# Imágenes de productos

Todas las fotos de productos ya son las reales del negocio (no hay
placeholders). Los archivos actuales son:

- combo-messi.jpeg
- combo-dibu-martinez.jpeg
- combo-adolescente.jpeg
- combo-argento.jpeg
- combo-mcallister.jpeg
- mila-con-fritas.jpeg
- empanadas.jpeg
- hamburguesa-clásica.png
- Sandwich-de-mila.jpeg

## Cómo cambiar una foto en el futuro

1. Sacar (o pedir) una foto del plato real. Recomendado: cuadrada o 4:3,
   buena luz, fondo simple, mínimo 1000x1000px.
2. Reemplazar el archivo en esta carpeta (mismo nombre) o subir uno nuevo.
3. Si el nombre del archivo cambia, actualizar la ruta en el campo `image`
   del producto correspondiente en `src/data/products.ts`.
4. Listo. Next.js optimiza automáticamente la imagen nueva.

## Cómo agregar un producto nuevo

Editar `src/data/products.ts` y agregar un objeto al array `products`,
siguiendo el mismo formato que los productos existentes. Ahí también se
pueden definir `chips` (etiquetas cortas tipo "Preparado al momento") y,
a futuro, `extras` u `observations` si se activa esa función.
