import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { FeaturedSection } from "@/components/sections/featured-section";
import { CatalogSection } from "@/components/sections/catalog-section";
import { TrustSection } from "@/components/sections/trust-section";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CheckoutModal } from "@/components/checkout/checkout-modal";
import { MobileCartBar } from "@/components/cart/mobile-cart-bar";
import { WhatsAppFloatingButton } from "@/components/ui/whatsapp-floating-button";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedSection />
        <CatalogSection />
        <TrustSection />
      </main>
      <Footer />

      {/* Overlays globales */}
      <CartDrawer />
      <CheckoutModal />
      <MobileCartBar />
      <WhatsAppFloatingButton />
    </>
  );
}
