"use client";

import { useState, useRef, useEffect, type FormEvent, type DragEvent } from "react";
import { ImageOff, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeToCategories } from "@/lib/firestore-categories";
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

const MAX_IMAGE_BYTES = 700 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? emptyValues());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((categories) => {
      setCategoryNames(categories.filter((c) => c.active).map((c) => c.name));
    });
    return unsubscribe;
  }, []);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === "image") setImageError(false);
  };

  const handleFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("La imagen no puede superar los 700 KB (límite de la base de datos).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => update("image", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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
      setError("La foto es obligatoria.");
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
            {categoryNames.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-crema/80">Foto del producto</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragOver ? "border-amarillo bg-amarillo/5" : "border-dorado/30 bg-noche"
          }`}
        >
          {values.image && !imageError ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-dorado/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.image}
                alt="Vista previa"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-xl border border-dorado/20 bg-noche-suave text-crema/40">
              <ImageOff size={20} />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-semibold text-amarillo">
            <UploadCloud size={16} />
            {values.image ? "Cambiar foto" : "Seleccionar imagen"}
          </div>
          <p className="text-xs text-crema/40">
            O arrastrá la imagen acá · JPG, PNG o WEBP · máx. 700 KB
          </p>
        </div>
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
