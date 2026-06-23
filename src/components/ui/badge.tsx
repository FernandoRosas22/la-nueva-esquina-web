import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "rojo" | "dorado";
  className?: string;
}

export function Badge({ children, variant = "rojo", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        variant === "rojo" && "bg-rojo text-crema",
        variant === "dorado" && "bg-dorado text-noche",
        className
      )}
    >
      {children}
    </span>
  );
}
