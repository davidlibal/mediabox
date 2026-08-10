import { ReactNode } from "react";

export function MediaPreview({
  icon,
  loading = false,
  className,
}: {
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  if (loading) {
    return (
      <div
        className={`aspect-video animate-pulse rounded-2xl bg-surface-elevated sm:aspect-square ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface-elevated to-surface sm:aspect-square ${className ?? ""}`}
    >
      {icon}
    </div>
  );
}
