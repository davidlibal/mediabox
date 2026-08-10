import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Converter — MediaBox",
  description: "Transforme seus arquivos para o formato que você precisa.",
};

export default function ConverterPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 py-24 text-center sm:px-8">
      <Badge tone="neutral">Converter</Badge>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
        Converta seus arquivos.
      </h1>
      <p className="mt-3 max-w-md text-balance text-base text-text-secondary sm:text-lg">
        Transforme seus arquivos para o formato que você precisa.
      </p>

      <div className="mt-10 w-full max-w-xl rounded-3xl border border-dashed border-border bg-surface p-12 transition-colors hover:border-border-strong">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-text-muted">
              <path d="M12 16V4m0 0L7 9m5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">Arraste seu arquivo aqui, ou</p>
          <span className="cursor-not-allowed rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-text-muted">
            Selecionar arquivo
          </span>
        </div>
      </div>

      <p className="mt-6 text-xs text-text-muted">
        O conversor chega na próxima fase — integração com upload, formatos e processamento em tempo real.
      </p>
    </div>
  );
}
