import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/hooks/cart-context";
import { UIProvider } from "@/hooks/ui-context";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { business } from "@/data/business";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(business.seo.url),
  title: {
    default: business.seo.title,
    template: `%s | ${business.name}`,
  },
  description: business.seo.description,
  keywords: [
    "rotisería Merlo",
    "milanesas a domicilio",
    "combos Mariano Acosta",
    "empanadas Merlo",
    "delivery comida Merlo",
    "La Nueva Esquina",
  ],
  authors: [{ name: business.name }],
  openGraph: {
    title: business.seo.title,
    description: business.seo.description,
    url: business.seo.url,
    siteName: business.name,
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200,
        height: 1200,
        alt: business.name,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: business.seo.title,
    description: business.seo.description,
    images: ["/images/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/logo/logo.png",
    apple: "/images/logo/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <head>
        <LocalBusinessSchema />
      </head>
      <body className={`${playfair.variable} ${inter.variable} antialiased bg-noche text-crema`}>
        <UIProvider>
          <CartProvider>{children}</CartProvider>
        </UIProvider>
      </body>
    </html>
  );
}
