import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function ProviderBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Badge tone="accent">
      {icon}
      {label}
    </Badge>
  );
}
