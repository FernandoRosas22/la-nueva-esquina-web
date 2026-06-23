"use client";

import { Zap, UtensilsCrossed, Bike, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const puntosConfianza = [
  { icon: Zap, label: "Atención rápida" },
  { icon: UtensilsCrossed, label: "Productos recién preparados" },
  { icon: Bike, label: "Entrega rápida" },
  { icon: MessageCircle, label: "Pedido directo por WhatsApp" },
];

export function TrustSection() {
  return (
    <section className="border-t border-dorado/10 bg-noche px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {puntosConfianza.map((punto, index) => (
            <motion.div
              key={punto.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-dorado/30 bg-noche-suave text-amarillo">
                <punto.icon size={26} />
              </span>
              <p className="text-sm font-semibold text-crema/85 sm:text-base">{punto.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
