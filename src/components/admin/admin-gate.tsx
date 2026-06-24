"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Loader2 } from "lucide-react";

const LOGIN_PATH = "/admin/login";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === LOGIN_PATH;

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace(LOGIN_PATH);
    }
    if (user && isLoginPage) {
      router.replace("/admin");
    }
  }, [user, loading, isLoginPage, router]);

  // La página de login se muestra siempre tal cual, sin sidebar ni guardas.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Mientras Firebase determina si hay sesión, mostramos un loader simple
  // en vez de parpadear entre estados.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noche">
        <Loader2 className="animate-spin text-amarillo" size={32} />
      </div>
    );
  }

  // Sin sesión: no renderizamos nada del panel mientras el useEffect
  // redirige a /admin/login.
  if (!user) {
    return null;
  }

  // Autenticado: mostramos el shell del panel con sidebar.
  return (
    <div className="flex min-h-screen bg-noche text-crema">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
