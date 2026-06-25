"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeToActivePromotions, type Promotion } from "@/lib/firestore-promotions";

export function PromotionsBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToActivePromotions((data) => setPromotions(data));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (promotions.length < 2) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % promotions.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [promotions.length]);

  if (promotions.length === 0) return null;

  const current = promotions[index % promotions.length];

  return (
    <div className="overflow-hidden border-b border-dorado/20 bg-gradient-to-r from-rojo/90 via-rojo to-rojo/90 px-4 py-2.5 text-center sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-bold text-crema sm:text-base">{current.title}</p>
          {current.description && (
            <p className="text-xs text-crema/80 sm:text-sm">{current.description}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
