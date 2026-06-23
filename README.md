# La Nueva Esquina — Web de Pedidos

Sitio web tipo app de delivery para la rotisería **La Nueva Esquina**
(Mariano Acosta, Merlo, Buenos Aires). El cliente ve el menú, agrega
productos a un carrito persistente, completa sus datos y el pedido se
envía automáticamente por WhatsApp.

🔗 **Demo en producción:** _(se completa después del primer deploy)_

Stack: **Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion**.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # entorno de desarrollo en http://localhost:3000
npm run build    # build de producción
npm start        # servir el build de producción localmente
npm run lint     # chequeo de calidad de código
```

## Estructura

```
src/
├── app/                  # Rutas de Next.js (App Router)
│   ├── layout.tsx        # Layout raíz: fuentes, SEO, providers globales
│   ├── page.tsx          # Página principal (home / única página)
│   ├── globals.css       # Tokens de diseño (colores, tipografía) y estilos base
│   ├── sitemap.ts         # Generador de sitemap.xml
│   └── robots.ts          # Generador de robots.txt
│
├── components/
│   ├── layout/           # Header y Footer
│   ├── sections/         # Hero, Más Pedidos, Catálogo (secciones de la home)
│   ├── menu/             # ProductCard (tarjeta grande de producto)
│   ├── cart/             # Drawer del carrito y barra inferior mobile
│   ├── checkout/         # Modal de checkout (formulario -> WhatsApp)
│   ├── ui/                # Componentes base reutilizables (Button, Badge, etc.)
│   └── seo/               # Datos estructurados Schema.org
│
├── data/
│   ├── products.ts        # Catálogo completo: productos, precios, variantes
│   └── business.ts        # Datos del negocio: dirección, horario, WhatsApp, redes
│
├── config/
│   └── store.ts            # Configuración de comportamiento (no de contenido)
│
├── hooks/
│   ├── use-cart.ts         # Lógica del carrito (localStorage)
│   ├── cart-context.tsx    # Provider global del carrito
│   └── ui-context.tsx      # Provider para abrir/cerrar carrito y checkout
│
├── lib/
│   ├── utils.ts             # Helper `cn` para combinar clases Tailwind
│   ├── format-price.ts      # Formateo de precios en pesos argentinos
│   └── whatsapp.ts          # Generación del mensaje y link de WhatsApp
│
└── types/
    └── index.ts              # Tipos TypeScript compartidos
```

### Convenciones

- **Contenido vivo en `src/data/`** — nunca hardcodear precios, productos
  ni datos de contacto dentro de componentes.
- **Componentes chicos y con una sola responsabilidad**, agrupados por
  dominio (`cart/`, `checkout/`, `menu/`, etc.), no por tipo técnico.
- **Toda la paleta de colores vive en `globals.css`** como variables CSS,
  no hardcodeada en componentes (`bg-amarillo`, `text-dorado`, etc.).
- **El carrito persiste en localStorage** automáticamente; no hace falta
  guardar nada manualmente.

## Cómo hacer cambios comunes

| Quiero...                                  | Edito...                                  |
|---------------------------------------------|--------------------------------------------|
| Cambiar un precio o agregar un producto     | `src/data/products.ts`                    |
| Cambiar dirección, horario o WhatsApp       | `src/data/business.ts`                    |
| Reemplazar una foto de producto             | `public/images/products/` (ver `LEEME.md`)|
| Cambiar el texto del mensaje de WhatsApp    | `src/lib/whatsapp.ts`                     |
| Cambiar colores de la marca                 | `src/app/globals.css` (sección `:root`)   |

## Deploy

El proyecto está listo para desplegar en [Vercel](https://vercel.com) sin
configuración adicional: detecta Next.js automáticamente.

```bash
npm run build && npx vercel --prod
```

O conectando el repositorio de GitHub directamente desde el dashboard de
Vercel (recomendado): cada push a `main` genera un deploy automático.

## Licencia

Privado © La Nueva Esquina.
