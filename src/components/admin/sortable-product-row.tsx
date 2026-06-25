"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format-price";
import { isDataUrl } from "@/lib/is-data-url";
import type { AdminProduct } from "@/lib/firestore-products";

interface SortableProductRowProps {
  product: AdminProduct;
  imageError: boolean;
  onImageError: () => void;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableProductRow({
  product,
  imageError,
  onImageError,
  onToggleActive,
  onEdit,
  onDelete,
}: SortableProductRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="bg-noche-suave/40">
      <td className="w-8 px-2 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reordenar ${product.name}`}
          className="cursor-grab touch-none text-crema/40 hover:text-amarillo active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-dorado/20 bg-noche">
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center text-crema/30">
              <ImageOff size={16} />
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized={isDataUrl(product.image)}
              className="object-cover"
              sizes="48px"
              onError={onImageError}
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
      <td className="px-4 py-3 font-semibold text-amarillo">{formatPrice(product.price)}</td>
      <td className="px-4 py-3 capitalize text-crema/80">{product.category}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onToggleActive}
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            product.active ? "bg-amarillo/15 text-amarillo" : "bg-crema/10 text-crema/50"
          }`}
        >
          {product.active ? "Activo" : "Inactivo"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Editar ${product.name}`}
            className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-amarillo"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Eliminar ${product.name}`}
            className="rounded-lg p-2 text-crema/70 hover:bg-noche hover:text-rojo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
