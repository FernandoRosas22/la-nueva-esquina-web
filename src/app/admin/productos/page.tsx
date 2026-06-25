"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  subscribeToAllProductsAdmin,
  createProduct,
  updateProductDoc,
  deleteProductDoc,
  reorderProducts,
  type AdminProduct,
} from "@/lib/firestore-products";
import {
  ProductForm,
  valuesFromProductDoc,
  type ProductFormValues,
} from "@/components/admin/product-form";
import { SortableProductRow } from "@/components/admin/sortable-product-row";

type ModalState = { mode: "create" } | { mode: "edit"; product: AdminProduct } | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [reorderError, setReorderError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    const unsubscribe = subscribeToAllProductsAdmin((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(products, oldIndex, newIndex);
    // Actualización optimista: se ve el nuevo orden al instante, sin
    // esperar la confirmación de Firestore.
    setProducts(reordered);
    setReorderError(null);

    try {
      await reorderProducts(reordered.map((p) => p.id));
    } catch (err) {
      console.error(err);
      setReorderError("No se pudo guardar el nuevo orden. Probá de nuevo.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-crema">Productos</h1>
          <p className="text-sm text-crema/60">
            {products.length} producto{products.length !== 1 ? "s" : ""} en total · arrastrá
            <span className="mx-1 inline-block">⠿</span>para cambiar el orden del catálogo
          </p>
        </div>
        <Button onClick={() => setModal({ mode: "create" })}>
          <Plus size={18} />
          Nuevo producto
        </Button>
      </div>

      {reorderError && (
        <div className="mb-4 rounded-xl bg-rojo/10 px-3 py-2 text-sm text-rojo">
          {reorderError}
        </div>
      )}

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
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-noche-suave text-crema/60">
              <tr>
                <th className="w-8 px-2 py-3"></th>
                <th className="px-4 py-3 font-medium">Foto</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={products.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody className="divide-y divide-dorado/10">
                  {products.map((product) => (
                    <SortableProductRow
                      key={product.id}
                      product={product}
                      imageError={imageErrors[product.id] ?? false}
                      onImageError={() =>
                        setImageErrors((prev) => ({ ...prev, [product.id]: true }))
                      }
                      onToggleActive={() => handleToggleActive(product)}
                      onEdit={() => setModal({ mode: "edit", product })}
                      onDelete={() => setProductToDelete(product)}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
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
