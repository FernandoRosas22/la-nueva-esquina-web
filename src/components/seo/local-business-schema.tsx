import { business } from "@/data/business";

/**
 * Inyecta el JSON-LD de tipo LocalBusiness/Restaurant para que buscadores
 * como Google puedan mostrar horarios, dirección y rating en resultados ricos.
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    description: business.description,
    image: `${business.seo.url}/images/logo/logo.png`,
    url: business.seo.url,
    telephone: `+${business.whatsapp.number}`,
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
    sameAs: [business.social.instagram].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
