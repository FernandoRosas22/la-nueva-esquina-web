"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  subscribeToCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/lib/firestore-categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const openCreate = () => {
    setName("");
    setError(null);
    setEditing("new");
  };

  const openEdit = (category: Category) => {
    setName(category.name);
    setError(null);
    setEditing(category);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") {
        const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), -1);
        await createCategory({ name: name.trim(), order: maxOrder + 1, active: true });
      } else if (editing) {
        await updateCategory(editing.id, { name: name.trim() });
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    await updateCategory(category.id, { active: !category.active });
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
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
          <h1 className="font-display text-2xl font-bold text-crema">Categorías</h1>
          <p className="text-sm text-crema/60">
            Sugerencias para el campo &quot;Categoría&quot; al crear productos.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} />
          Nueva categoría
        </Button>
      </div>

      <p className="mb-4 text-xs text-crema/40">
        Nota: borrar o desactivar una categoría acá no modifica los productos que ya tengan ese
        texto guardado. El campo de categoría en cada producto sigue siendo texto libre.
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-crema/60">
          <Loader2 className="animate-spin" size={20} />
          Cargando...
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="rounded-2xl border border-dorado/20 bg-noche-suave px-6 py-12 text-center text-crema/60">
          Todavía no hay categorías creadas.
        </div>
      )}

      {!loading && categories.length > 0 && (
        <ul className="flex flex-col gap-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-xl border border-dorado/20 bg-noche-suave px-4 py-3"
            >
              <span className="font-medium text-crema">{category.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(category)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    category.active
                      ? "bg-amarillo/15 text-amarillo"
                      : "bg-crema/10 text-crema/50"
                  }`}
                >
                  {category.active ? "Activa" : "Inactiva"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(category)}
                  aria-label={`Editar ${category.name}`}
                  className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-amarillo"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(category)}
                  aria-label={`Eliminar ${category.name}`}
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
          <div className="w-full max-w-sm rounded-2xl border border-dorado/20 bg-noche p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-crema">
                {editing === "new" ? "Nueva categoría" : "Editar categoría"}
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
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Combos"
                className="w-full rounded-xl border border-dorado/20 bg-noche-suave px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
              />
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
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-dorado/20 bg-noche p-6 text-center">
            <h3 className="font-display text-lg font-bold text-crema">¿Eliminar categoría?</h3>
            <p className="mt-2 text-sm text-crema/60">
              Vas a eliminar{" "}
              <span className="font-semibold text-crema">{categoryToDelete.name}</span>. Los
              productos que ya la tengan asignada no se modifican.
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
                onClick={() => setCategoryToDelete(null)}
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
