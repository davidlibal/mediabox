import Link from "next/link";
import { UrlAnalyzer } from "@/components/url-analyzer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YoutubeGlyph, InstagramGlyph } from "@/components/icons/platform-icons";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col px-5 sm:px-8">
      <section className="flex min-h-[62vh] flex-col items-center justify-center gap-8 py-20 text-center sm:py-28">
        <Badge tone="neutral" className="animate-fade-up">
          Download · Conversão
        </Badge>

        <h1 className="animate-fade-up text-balance text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
          Conteúdo e arquivos.
          <br />
          Em um só lugar.
        </h1>

        <p className="max-w-md text-balance text-base text-text-secondary sm:text-lg">
          Cole um link ou envie um arquivo. O MediaBox resolve o resto.
        </p>

        <div className="w-full max-w-2xl">
          <UrlAnalyzer />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Badge tone="neutral">
            <YoutubeGlyph className="h-3.5 w-3.5" />
            YouTube
          </Badge>
          <Badge tone="neutral">
            <InstagramGlyph className="h-3.5 w-3.5" />
            Instagram
          </Badge>
          <Badge tone="neutral" className="opacity-60">
            TikTok · em breve
          </Badge>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 border-t border-border/70 py-14 text-center">
        <p className="text-sm text-text-secondary">Ou converta um arquivo diretamente</p>
        <Link href="/converter">
          <Button variant="secondary" size="lg">
            Abrir conversor
          </Button>
        </Link>
      </section>
    </div>
  );
}
