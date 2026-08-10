import { Badge } from "@/components/ui/badge";
import { ConverterFlow } from "@/components/converter-flow";

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

      <ConverterFlow />
    </div>
  );
}
