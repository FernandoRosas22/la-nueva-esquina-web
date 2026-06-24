"use client";

import { useState, type FormEvent } from "react";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminProduct } from "@/lib/firestore-products";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  badge: string;
  featured: boolean;
  active: boolean;
}

const badgeOptions = [
  { value: "", label: "Sin etiqueta" },
  { value: "EL MÁS PEDIDO", label: "🔥 EL MÁS PEDIDO" },
  { value: "RECOMENDADO", label: "⭐ RECOMENDADO" },
  { value: "PROMO", label: "💸 PROMO" },
  { value: "NUEVO", label: "🆕 NUEVO" },
];

function emptyValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    badge: "",
    featured: false,
    active: true,
  };
}

export function valuesFromProductDoc(product: AdminProduct): ProductFormValues {
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    image: product.image,
    category: product.category,
    badge: product.badge ?? "",
    featured: product.featured ?? false,
    active: product.active,
  };
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  /** Categorías existentes, para sugerir como datalist (el campo sigue siendo texto libre) */
  existingCategories: string[];
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  initialValues,
  existingCategories,
  submitLabel,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? emptyValues());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === "image") setImageError(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNumber = Number(values.price);
    if (!values.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!values.category.trim()) {
      setError("La categoría es obligatoria.");
      return;
    }
    if (!values.image.trim()) {
      setError("La URL de la imagen es obligatoria.");
      return;
    }
    const imageValue = values.image.trim();
    const isValidImageValue =
      imageValue.startsWith("http://") ||
      imageValue.startsWith("https://") ||
      imageValue.startsWith("/");
    if (!isValidImageValue) {
      setError(
        'La imagen tiene que ser una URL completa (https://...) o una ruta que empiece con "/".'
      );
      return;
    }
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("El precio tiene que ser un número mayor a 0.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el producto. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-crema/80">Nombre</label>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
          placeholder="Ej: Combo Messi"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-crema/80">Descripción</label>
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full resize-none rounded-xl border border-dorado/20 bg-noche px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
          placeholder="Descripción completa del producto"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-crema/80">Precio</label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
            placeholder="15000"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-crema/80">Categoría</label>
          <input
            type="text"
            required
            list="categorias-existentes"
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
            placeholder="Ej: combos"
          />
          <datalist id="categorias-existentes">
            {existingCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-crema/80">URL de la imagen</label>
        <input
          type="text"
          required
          value={values.image}
          onChange={(e) => update("image", e.target.value)}
          className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-2.5 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
          placeholder="https://... o /images/products/foto.jpg"
        />
        {values.image && (
          <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-xl border border-dorado/20 bg-noche">
            {imageError ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-crema/40">
                <ImageOff size={20} />
                <span className="text-[10px]">No se pudo cargar</span>
              </div>
            ) : (
              // Usamos <img> nativo (no next/image) para esta vista previa:
              // la URL la está escribiendo el usuario en tiempo real, y
              // next/image requiere que el hostname ya esté permitido y la
              // URL completa y válida antes de intentar optimizarla.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.image}
                alt="Vista previa"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-crema/80">Etiqueta promocional</label>
        <select
          value={values.badge}
          onChange={(e) => update("badge", e.target.value)}
          className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-2.5 text-crema focus:border-amarillo focus:outline-none"
        >
          {badgeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-crema/80">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 accent-amarillo"
          />
          Producto destacado (aparece en &quot;Más Pedidos&quot;)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-crema/80">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => update("active", e.target.checked)}
            className="h-4 w-4 accent-amarillo"
          />
          Activo (visible en la web)
        </label>
      </div>

      {error && (
        <div className="rounded-xl bg-rojo/10 px-3 py-2 text-sm text-rojo">{error}</div>
      )}

      <div className="mt-2 flex gap-3">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "Guardando..." : submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
