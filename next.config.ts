import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite renderizar los placeholders SVG locales en /public/images/products.
    // Al reemplazarlos por fotos reales (.jpg/.webp), esta opción puede quitarse
    // si se desea, ya que esos formatos no la necesitan.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};

export default nextConfig;
