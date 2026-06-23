import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-amarillo text-noche hover:bg-dorado-claro shadow-[0_0_0_1px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(245,197,24,0.35)]",
  secondary: "bg-rojo text-crema hover:bg-rojo/90",
  outline:
    "bg-transparent text-dorado border border-dorado hover:bg-dorado hover:text-noche",
  ghost: "bg-transparent text-crema hover:bg-white/10",
  whatsapp: "bg-[#25D366] text-noche hover:bg-[#1ebe57]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amarillo",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
