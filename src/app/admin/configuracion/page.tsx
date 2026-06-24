"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  subscribeToBusinessSettings,
  saveBusinessSettings,
  defaultBusinessSettings,
  type BusinessSettingsDoc,
} from "@/lib/firestore-settings";

const fields: Array<{ key: keyof BusinessSettingsDoc; label: string; placeholder: string }> = [
  { key: "businessName", label: "Nombre del negocio", placeholder: "La Nueva Esquina" },
  { key: "whatsapp", label: "WhatsApp (con código de país, sin signos)", placeholder: "5491133374980" },
  { key: "address", label: "Dirección", placeholder: "Genova 498, Mariano Acosta, Merlo" },
  { key: "hours", label: "Horario", placeholder: "Todos los días de 19:00 a 00:00 hs" },
  { key: "instagram", label: "Instagram (URL)", placeholder: "https://instagram.com/..." },
  { key: "facebook", label: "Facebook (URL)", placeholder: "https://facebook.com/..." },
  { key: "alias", label: "Alias para transferencias", placeholder: "lanuevaesquina.mp" },
  { key: "cbu", label: "CBU", placeholder: "0000003100000000000000" },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<BusinessSettingsDoc>(defaultBusinessSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToBusinessSettings((data) => {
      if (data) setValues(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const update = (key: keyof BusinessSettingsDoc, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveBusinessSettings(values);
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-crema">Configuración</h1>
      <p className="mt-1 text-sm text-crema/60">Datos generales del negocio</p>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-crema/60">
          <Loader2 className="animate-spin" size={20} />
          Cargando...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium text-crema/80">
                {field.label}
              </label>
              <input
                type="text"
                value={values[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-dorado/20 bg-noche-suave px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
              />
            </div>
          ))}

          <div className="mt-2 flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-amarillo">
                <CheckCircle2 size={16} />
                Guardado
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
