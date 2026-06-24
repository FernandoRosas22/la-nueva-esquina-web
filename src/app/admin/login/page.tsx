"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth-context";

/** Traduce los códigos de error de Firebase Auth a mensajes claros en español. */
function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "El email no es válido.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Email o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Probá de nuevo en unos minutos.";
    default:
      return "No se pudo iniciar sesión. Probá de nuevo.";
  }
}

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      // Si el login es exitoso, AdminGate detecta el cambio de `user`
      // y redirige automáticamente a /admin.
    } catch (err) {
      const code = err instanceof Error && "code" in err ? String(err.code) : "";
      setError(getErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-noche px-4">
      <div className="w-full max-w-sm rounded-3xl border border-dorado/20 bg-noche-suave p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amarillo/15 text-amarillo">
            <LockKeyhole size={26} />
          </span>
          <h1 className="font-display text-2xl font-bold text-crema">Panel Admin</h1>
          <p className="mt-1 text-sm text-crema/60">La Nueva Esquina</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-crema/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-3 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-crema/80">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-3 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rojo/10 px-3 py-2 text-sm text-rojo">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
