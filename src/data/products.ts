// Catálogo de productos. Única fuente de verdad para precios y descripciones.
// Para sumar un producto nuevo: agregar un objeto al array `products`.
// Para sacar uno de la sección "Más Pedidos": quitar `featured: true`.
//
// IMPORTANTE - IMÁGENES:
// Las imágenes apuntan a /public/images/products/*.svg, que son placeholders
// temporales (ver public/images/products/LEEME.md). Cuando tengan las fotos
// reales de cada plato, hay que:
//   1) Poner la foto en public/images/products/ con formato .jpg o .webp
//   2) Cambiar la extensión ".svg" por ".jpg" (o ".webp") en el campo `image`
//      del producto correspondiente, acá abajo.

import type { Product } from "@/types";

export const products: Product[] = [
  // ---------- COMBOS ----------
  {
    id: "combo-messi",
    name: "Combo Messi",
    description:
      "El combo número 10. Doble milanesa, papas fritas abundantes, gaseosa y la mejor compañía para ver el partido.",
    price: 30000,
    image: "/images/products/combo-messi.jpeg",
    category: "combos",
    featured: true,
    badge: "EL MÁS PEDIDO",
  },
  {
    id: "combo-dibu-martinez",
    name: "Combo Dibu Martínez",
    description:
      "Un combo que ataja todo: milanesa napolitana, papas y bebida. Ideal para compartir antes de la tanda de penales.",
    price: 25000,
    image: "/images/products/combo-dibu-martinez.jpeg",
    category: "combos",
    featured: true,
    badge: "PROMO",
  },
  {
    id: "combo-adolescente",
    name: "Combo Adolescente",
    description:
      "Porción generosa pensada para los que siempre tienen hambre. Milanesa, papas fritas y gaseosa.",
    price: 25000,
    image: "/images/products/combo-adolescente.jpeg",
    category: "combos",
  },
  {
    id: "combo-argento",
    name: "Combo Argento",
    description:
      "Sabor bien nuestro: milanesa a la napolitana, papas fritas caseras y bebida bien fría.",
    price: 25000,
    image: "/images/products/combo-argento.jpeg",
    category: "combos",
  },
  {
    id: "combo-mcallister",
    name: "Combo McAllister",
    description: "Combo individual con milanesa, papas fritas y gaseosa. Rendidor y a buen precio.",
    price: 20000,
    image: "/images/products/combo-mcallister.jpeg",
    category: "combos",
  },

  // ---------- MILANESAS ----------
  {
    id: "mila-con-fritas",
    name: "Mila con Fritas",
    description:
      "Clásica milanesa de ternera con guarnición de papas fritas abundantes, recién hechas.",
    price: 14000,
    image: "/images/products/mila-con-fritas.jpeg",
    category: "milanesas",
    featured: true,
  },

  // ---------- EMPANADAS ----------
  {
    id: "empanadas",
    name: "Empanadas",
    description:
      "Empanadas caseras, repulgo prolijo y relleno abundante. Elegí la cantidad que necesitás.",
    price: 12000,
    image: "/images/products/empanadas.jpeg",
    category: "empanadas",
    variants: [
      { id: "media-docena", name: "Media Docena", price: 12000 },
      { id: "docena", name: "Docena", price: 23000 },
    ],
  },

  // ---------- HAMBURGUESAS ----------
  {
    id: "hamburguesa-clasica",
    name: "Hamburguesa Clásica",
    description:
      "Medallón jugoso, queso, lechuga, tomate y nuestra salsa de la casa en pan casero.",
    price: 15000,
    image: "/images/products/hamburguesa-clasica.png",
    category: "hamburguesas",
  },

  // ---------- SANDWICHES ----------
  {
    id: "sandwich-de-milanesa",
    name: "Sándwich de Milanesa",
    description:
      "Milanesa de ternera entera en pan, con las opciones clásicas para armarlo a tu gusto.",
    price: 15000,
    image: "/images/products/sandwich-de-milanesa.jpeg",
    category: "sandwiches",
  },
];

export const categoryLabels: Record<Product["category"], string> = {
  combos: "Combos",
  milanesas: "Milanesas",
  empanadas: "Empanadas",
  hamburguesas: "Hamburguesas",
  sandwiches: "Sándwiches",
};

/** Orden en el que se muestran las categorías en el catálogo */
export const categoryOrder: Product["category"][] = [
  "combos",
  "milanesas",
  "empanadas",
  "hamburguesas",
  "sandwiches",
];

export const featuredProducts = products.filter((p) => p.featured);
