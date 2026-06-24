"use client";

import { AuthProvider } from "@/hooks/auth-context";
import { AdminGate } from "@/components/admin/admin-gate";

// Nota: no se puede exportar `metadata` desde un layout marcado "use client".
// El noindex de /admin ya está cubierto por robots.ts (disallow: "/admin").

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGate>{children}</AdminGate>
    </AuthProvider>
  );
}
