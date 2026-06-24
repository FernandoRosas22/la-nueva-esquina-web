import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite renderizar los placeholders SVG locales en /public/images/products.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    // Los productos administrados desde /admin pueden traer imágenes de
    // cualquier URL externa (Cloudinary, Imgur, Google Drive, etc., a
    // elección de quien administra el sitio), así que permitimos cualquier
    // hostname HTTPS en vez de una whitelist fija.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
