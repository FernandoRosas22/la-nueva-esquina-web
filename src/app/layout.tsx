import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/hooks/cart-context";
import { UIProvider } from "@/hooks/ui-context";
import { ToastProvider } from "@/hooks/toast-context";
import { ProductModalProvider } from "@/hooks/product-modal-context";
import { ToastViewport } from "@/components/ui/toast-viewport";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { business } from "@/data/business";
import { getBusinessData } from "@/lib/business-data";
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

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBusinessData();

  return {
    metadataBase: new URL(business.seo.url),
    title: {
      default: data.seoTitle,
      template: `%s | ${data.businessName}`,
    },
    description: data.seoDescription,
    keywords: [
      "rotisería Merlo",
      "milanesas a domicilio",
      "combos Mariano Acosta",
      "empanadas Merlo",
      "delivery comida Merlo",
      "La Nueva Esquina",
    ],
    authors: [{ name: data.businessName }],
    openGraph: {
      title: data.seoTitle,
      description: data.seoDescription,
      url: business.seo.url,
      siteName: data.businessName,
      images: [
        {
          url: "/images/logo/logo.png",
          width: 1200,
          height: 1200,
          alt: data.businessName,
        },
      ],
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.seoTitle,
      description: data.seoDescription,
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getBusinessData();

  return (
    <html lang="es-AR">
      <head>
        <LocalBusinessSchema
          name={data.businessName}
          description={data.heroDescription}
          telephone={data.whatsapp}
          instagram={data.instagram || undefined}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} antialiased bg-noche text-crema`}>
        <ToastProvider>
          <UIProvider>
            <CartProvider>
              <ProductModalProvider>{children}</ProductModalProvider>
            </CartProvider>
          </UIProvider>
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
