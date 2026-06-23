import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { FeaturedSection } from "@/components/sections/featured-section";
import { CatalogSection } from "@/components/sections/catalog-section";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CheckoutModal } from "@/components/checkout/checkout-modal";
import { MobileCartBar } from "@/components/cart/mobile-cart-bar";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedSection />
        <CatalogSection />
      </main>
      <Footer />

      {/* Overlays globales */}
      <CartDrawer />
      <CheckoutModal />
      <MobileCartBar />
    </>
  );
}
