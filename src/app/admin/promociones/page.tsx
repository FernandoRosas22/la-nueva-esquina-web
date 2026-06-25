"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  subscribeToPromotionsAdmin,
  createPromotion,
  updatePromotion,
  deletePromotion,
  type Promotion,
} from "@/lib/firestore-promotions";

interface FormValues {
  title: string;
  description: string;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Promotion | "new" | null>(null);
  const [values, setValues] = useState<FormValues>({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPromotionsAdmin((data) => {
      setPromotions(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const openCreate = () => {
    setValues({ title: "", description: "" });
    setError(null);
    setEditing("new");
  };

  const openEdit = (promotion: Promotion) => {
    setValues({ title: promotion.title, description: promotion.description });
    setError(null);
    setEditing(promotion);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") {
        const maxOrder = promotions.reduce((max, p) => Math.max(max, p.order), -1);
        await createPromotion({
          title: values.title.trim(),
          description: values.description.trim(),
          active: true,
          order: maxOrder + 1,
        });
      } else if (editing) {
        await updatePromotion(editing.id, {
          title: values.title.trim(),
          description: values.description.trim(),
        });
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (promotion: Promotion) => {
    await updatePromotion(promotion.id, { active: !promotion.active });
  };

  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return;
    setDeleting(true);
    try {
      await deletePromotion(promotionToDelete.id);
      setPromotionToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-crema">Promociones</h1>
          <p className="text-sm text-crema/60">
            Las promociones activas aparecen como banner arriba del menú.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} />
          Nueva promoción
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-crema/60">
          <Loader2 className="animate-spin" size={20} />
          Cargando...
        </div>
      )}

      {!loading && promotions.length === 0 && (
        <div className="rounded-2xl border border-dorado/20 bg-noche-suave px-6 py-12 text-center text-crema/60">
          Todavía no hay promociones. Ejemplo: &quot;🔥 10% OFF pagando por transferencia&quot;.
        </div>
      )}

      {!loading && promotions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {promotions.map((promotion) => (
            <li
              key={promotion.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-dorado/20 bg-noche-suave px-4 py-3"
            >
              <div>
                <p className="font-medium text-crema">{promotion.title}</p>
                {promotion.description && (
                  <p className="text-sm text-crema/60">{promotion.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(promotion)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    promotion.active
                      ? "bg-amarillo/15 text-amarillo"
                      : "bg-crema/10 text-crema/50"
                  }`}
                >
                  {promotion.active ? "Activa" : "Inactiva"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(promotion)}
                  aria-label={`Editar ${promotion.title}`}
                  className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-amarillo"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPromotionToDelete(promotion)}
                  aria-label={`Eliminar ${promotion.title}`}
                  className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-rojo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de crear/editar */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-dorado/20 bg-noche p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-crema">
                {editing === "new" ? "Nueva promoción" : "Editar promoción"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Cerrar"
                className="text-crema/50 hover:text-crema"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-crema/80">Título</label>
                <input
                  type="text"
                  autoFocus
                  value={values.title}
                  onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: 🔥 10% OFF pagando por transferencia"
                  className="w-full rounded-xl border border-dorado/20 bg-noche-suave px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-crema/80">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={2}
                  value={values.description}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Detalle corto de la promo"
                  className="w-full resize-none rounded-xl border border-dorado/20 bg-noche-suave px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
                />
              </div>
              {error && (
                <div className="rounded-xl bg-rojo/10 px-3 py-2 text-sm text-rojo">{error}</div>
              )}
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {promotionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-dorado/20 bg-noche p-6 text-center">
            <h3 className="font-display text-lg font-bold text-crema">¿Eliminar promoción?</h3>
            <p className="mt-2 text-sm text-crema/60">
              Vas a eliminar{" "}
              <span className="font-semibold text-crema">{promotionToDelete.title}</span>
              definitivamente.
            </p>
            <div className="mt-5 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setPromotionToDelete(null)}
                disabled={deleting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
