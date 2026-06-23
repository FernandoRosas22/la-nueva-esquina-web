"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { business } from "@/data/business";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-noche px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24"
    >
      {/* Resplandor dorado ambiental, sutil, no decorativo de relleno */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-dorado/20 blur-3xl sm:h-[560px] sm:w-[560px]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/images/logo/logo.png"
            alt={business.name}
            width={140}
            height={140}
            className="mb-6 h-28 w-28 rounded-full object-cover shadow-[0_0_40px_rgba(212,175,55,0.35)] sm:h-36 sm:w-36"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-display text-4xl font-extrabold uppercase tracking-wide text-dorado sm:text-6xl"
        >
          {business.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-3 font-display text-lg font-semibold italic text-amarillo sm:text-2xl"
        >
          {business.slogan}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-4 max-w-xl text-balance text-base text-crema/80 sm:text-lg"
        >
          {business.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={() =>
              document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Menú
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              document.getElementById("destacados")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Pedir Ahora
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-sm font-medium text-crema/60"
        >
          Abrimos {business.hoursLabel}
        </motion.p>
      </div>
    </section>
  );
}
