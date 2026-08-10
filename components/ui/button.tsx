import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 ease-out active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_-8px_var(--color-accent)]",
  secondary:
    "bg-surface-elevated text-text-primary border border-border hover:bg-surface-hover hover:border-border-strong",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
