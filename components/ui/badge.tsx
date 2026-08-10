import { cn } from "@/lib/cn";
import { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "error" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-elevated text-text-secondary border-border",
  accent: "bg-accent-muted text-accent border-transparent",
  success: "bg-success/10 text-success border-transparent",
  warning: "bg-warning/10 text-warning border-transparent",
  error: "bg-error/10 text-error border-transparent",
  info: "bg-info/10 text-info border-transparent",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
