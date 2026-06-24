import { business } from "@/data/business";

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  telephone: string;
  instagram?: string;
}

/**
 * Inyecta el JSON-LD de tipo LocalBusiness/Restaurant para que buscadores
 * como Google puedan mostrar horarios, dirección y rating en resultados ricos.
 *
 * Nota: openingHoursSpecification necesita horas en formato estructurado
 * (HH:mm), pero el horario configurable desde /admin es texto libre
 * (ej: "De miércoles a domingos de 17:30 a 00:00"), así que esa parte del
 * schema sigue tomando los valores fijos de business.ts.
 */
export function LocalBusinessSchema({
  name,
  description,
  telephone,
  instagram,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    description,
    image: `${business.seo.url}/images/logo/logo.png`,
    url: business.seo.url,
    telephone: telephone.startsWith("+") ? telephone : `+${telephone}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Genova 498",
      addressLocality: "Mariano Acosta, Merlo",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: business.hours.open,
      closes: business.hours.close,
    },
    servesCuisine: "Comida argentina, parrilla, milanesas, empanadas",
    priceRange: "$$",
    sameAs: [instagram].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
