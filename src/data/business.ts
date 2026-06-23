// Datos del negocio. Si algo cambia en la vida real
// (dirección, horario, teléfono), se edita únicamente acá.

import type { BusinessHours, SocialLinks } from "@/types";

export const business = {
  name: "La Nueva Esquina",
  slogan: "Tu mejor versión en cada comida",
  description:
    "Tu rotisería de confianza en la palma de tu mano. Pedí tus combos favoritos, milanesas y promociones con un solo clic y recibilos en casa.",

  address: "Genova 498, Mariano Acosta, Merlo, Buenos Aires",

  hours: {
    open: "19:00",
    close: "00:00",
  } satisfies BusinessHours,

  /** Texto legible para mostrar el horario en la UI */
  hoursLabel: "Todos los días de 19:00 a 00:00 hs",

  whatsapp: {
    /** Número en formato internacional, sin signos ni espacios */
    number: "5491133374980",
  },

  social: {
    instagram: "https://www.instagram.com/fer.rosas22?igsh=ZHlvYnR4aTcwbWl2&utm_source=qr",
    // facebook y tiktok quedan listos para completar a futuro
  } satisfies SocialLinks,

  /** Datos de quien desarrolló y mantiene el sitio (footer / contacto) */
  developer: {
    name: "Fernando Rosas",
    instagram: "https://www.instagram.com/fer.rosas22?igsh=ZHlvYnR4aTcwbWl2&utm_source=qr",
  },

  seo: {
    title: "La Nueva Esquina | Rotisería y Combos en Merlo",
    description:
      "Combos, milanesas, hamburguesas, empanadas y promociones para compartir. Pedí online y recibilo en tu casa en Mariano Acosta, Merlo.",
    url: "https://lanuevaesquina.vercel.app",
  },
} as const;
