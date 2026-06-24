"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format-price";
import {
  subscribeToAllProductsAdmin,
  createProduct,
  updateProductDoc,
  deleteProductDoc,
  type AdminProduct,
} from "@/lib/firestore-products";
import {
  ProductForm,
  valuesFromProductDoc,
  type ProductFormValues,
} from "@/components/admin/product-form";

type ModalState = { mode: "create" } | { mode: "edit"; product: AdminProduct } | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = subscribeToAllProductsAdmin((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const existingCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const handleCreate = async (values: ProductFormValues) => {
    const maxOrder = products.reduce((max, p) => Math.max(max, p.order), -1);
    await createProduct({
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      image: values.image.trim(),
      category: values.category.trim(),
      badge: values.badge || undefined,
      featured: values.featured,
      active: values.active,
      order: maxOrder + 1,
    });
    setModal(null);
  };

  const handleEdit = async (id: string, values: ProductFormValues) => {
    await updateProductDoc(id, {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      image: values.image.trim(),
      category: values.category.trim(),
      badge: values.badge || undefined,
      featured: values.featured,
      active: values.active,
    });
    setModal(null);
  };

  const handleToggleActive = async (product: AdminProduct) => {
    await updateProductDoc(product.id, { active: !product.active });
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProductDoc(productToDelete.id);
      setProductToDelete(null);
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
          <h1 className="font-display text-2xl font-bold text-crema">Productos</h1>
          <p className="text-sm text-crema/60">
            {products.length} producto{products.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Button onClick={() => setModal({ mode: "create" })}>
          <Plus size={18} />
          Nuevo producto
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-crema/60">
          <Loader2 className="animate-spin" size={20} />
          Cargando productos...
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="rounded-2xl border border-dorado/20 bg-noche-suave px-6 py-12 text-center text-crema/60">
          Todavía no hay productos. Creá el primero con el botón de arriba.
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-dorado/20">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-noche-suave text-crema/60">
              <tr>
                <th className="px-4 py-3 font-medium">Foto</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dorado/10">
              {products.map((product) => (
                <tr key={product.id} className="bg-noche-suave/40">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-dorado/20 bg-noche">
                      {imageErrors[product.id] ? (
                        <div className="flex h-full w-full items-center justify-center text-crema/30">
                          <ImageOff size={16} />
                        </div>
                      ) : (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [product.id]: true }))
                          }
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-crema">{product.name}</div>
                    {product.badge && (
                      <Badge variant="rojo" className="mt-1">
                        {product.badge}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-amarillo">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 capitalize text-crema/80">{product.category}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(product)}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        product.active
                          ? "bg-amarillo/15 text-amarillo"
                          : "bg-crema/10 text-crema/50"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "edit", product })}
                        aria-label={`Editar ${product.name}`}
                        className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-amarillo"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        aria-label={`Eliminar ${product.name}`}
                        className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-rojo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de crear/editar */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-dorado/20 bg-noche p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-crema">
                {modal.mode === "create" ? "Nuevo producto" : "Editar producto"}
              </h2>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Cerrar"
                className="text-crema/50 hover:text-crema"
              >
                <X size={20} />
              </button>
            </div>
            <ProductForm
              existingCategories={existingCategories}
              initialValues={
                modal.mode === "edit" ? valuesFromProductDoc(modal.product) : undefined
              }
              submitLabel={modal.mode === "create" ? "Crear producto" : "Guardar cambios"}
              onCancel={() => setModal(null)}
              onSubmit={(values) =>
                modal.mode === "create"
                  ? handleCreate(values)
                  : handleEdit(modal.product.id, values)
              }
            />
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-dorado/20 bg-noche p-6 text-center">
            <h3 className="font-display text-lg font-bold text-crema">¿Eliminar producto?</h3>
            <p className="mt-2 text-sm text-crema/60">
              Vas a eliminar <span className="font-semibold text-crema">{productToDelete.name}</span>{" "}
              definitivamente. Esta acción no se puede deshacer.
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
                onClick={() => setProductToDelete(null)}
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
