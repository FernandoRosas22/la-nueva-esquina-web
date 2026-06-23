import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  size = "md",
  className,
}: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-dorado/40 bg-noche px-2 py-1",
        className
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Restar uno"
        className={cn(
          buttonSize,
          "flex items-center justify-center rounded-full text-dorado hover:bg-dorado/15 transition-colors active:scale-90"
        )}
      >
        <Minus size={iconSize} />
      </button>
      <span className="min-w-[1.5ch] text-center font-semibold text-crema tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Sumar uno"
        className={cn(
          buttonSize,
          "flex items-center justify-center rounded-full text-noche bg-amarillo hover:bg-dorado-claro transition-colors active:scale-90"
        )}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
