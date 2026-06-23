import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind evitando conflictos (ej: dos paddings distintos). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
