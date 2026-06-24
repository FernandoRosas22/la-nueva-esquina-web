"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/auth-context";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: UtensilsCrossed },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-amarillo text-noche"
                : "text-crema/70 hover:bg-noche-suave hover:text-crema"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Barra superior mobile */}
      <div className="flex items-center justify-between border-b border-dorado/20 bg-noche-suave px-4 py-3 sm:hidden">
        <span className="font-display font-bold text-amarillo">Panel Admin</span>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
          className="text-crema"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {mobileOpen && (
        <div className="border-b border-dorado/20 bg-noche-suave px-4 py-3 sm:hidden">
          <NavLinks />
          <button
            type="button"
            onClick={signOut}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rojo hover:bg-noche"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}

      {/* Sidebar fijo desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-dorado/20 bg-noche-suave p-5 sm:flex">
        <div className="mb-8 px-1">
          <span className="font-display text-xl font-bold text-amarillo">La Nueva Esquina</span>
          <p className="text-xs text-crema/50">Panel administrador</p>
        </div>
        <NavLinks />
        <button
          type="button"
          onClick={signOut}
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rojo transition-colors hover:bg-noche"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}
