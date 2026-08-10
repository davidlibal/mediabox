import { Logomark } from "@/components/logo";
import { StatusDot } from "@/components/status-dot";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left sm:px-8">
        <div className="flex items-center gap-2.5">
          <Logomark size={20} />
          <div className="leading-tight">
            <div className="text-sm font-medium text-text-primary">MediaBox</div>
            <div className="text-xs text-text-muted">Personal media utility</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <div className="flex items-center gap-3">
            <StatusDot />
            <span className="text-xs text-text-muted">Version 1.0.0</span>
          </div>
          <p className="text-xs text-text-muted">Desenvolvido por David Liborio</p>
        </div>
      </div>
    </footer>
  );
}
