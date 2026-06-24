"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, Tags, Star, Clock, Loader2 } from "lucide-react";
import { subscribeToAllProductsAdmin, type AdminProduct } from "@/lib/firestore-products";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD} día${diffD !== 1 ? "s" : ""}`;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllProductsAdmin((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const stats = useMemo(() => {
    const categories = new Set(products.map((p) => p.category));
    const featuredCount = products.filter((p) => p.featured).length;
    return {
      total: products.length,
      categories: categories.size,
      featured: featuredCount,
    };
  }, [products]);

  const recentProducts = useMemo(() => {
    return [...products]
      .filter((p): p is AdminProduct & { updatedAt: Date } => p.updatedAt !== null)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  }, [products]);

  const lastUpdateLabel = recentProducts[0]
    ? formatRelativeTime(recentProducts[0].updatedAt)
    : "Sin datos";

  const cards = [
    { label: "Productos totales", value: String(stats.total), icon: Package, isText: false },
    { label: "Categorías", value: String(stats.categories), icon: Tags, isText: false },
    { label: "Destacados", value: String(stats.featured), icon: Star, isText: false },
    { label: "Última actualización", value: lastUpdateLabel, icon: Clock, isText: true },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-crema">Dashboard</h1>
      <p className="mt-1 text-sm text-crema/60">Resumen general de tu catálogo</p>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-crema/60">
          <Loader2 className="animate-spin" size={20} />
          Cargando...
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-dorado/20 bg-noche-suave p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-crema/60">{card.label}</span>
                <card.icon size={18} className="text-amarillo" />
              </div>
              <p
                className={`mt-2 font-display font-extrabold text-crema ${
                  card.isText ? "text-lg" : "text-3xl"
                }`}
              >
                {card.value}
              </p>
            </div>
          ))}

          <div className="rounded-2xl border border-dorado/20 bg-noche-suave p-5 sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2 text-sm text-crema/60">
              <Clock size={16} className="text-amarillo" />
              Últimos productos modificados
            </div>
            <ul className="mt-3 flex flex-col divide-y divide-dorado/10">
              {recentProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-crema/80">{p.name}</span>
                  <span className="text-crema/40">{formatRelativeTime(p.updatedAt)}</span>
                </li>
              ))}
              {recentProducts.length === 0 && (
                <li className="py-2 text-sm text-crema/40">Sin productos todavía.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
