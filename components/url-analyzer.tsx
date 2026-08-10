"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YoutubeGlyph, InstagramGlyph, LinkGlyph } from "@/components/icons/platform-icons";
import { detectPlatform, platformMeta, type Platform } from "@/lib/platform";

type Stage = "idle" | "analyzing" | "result" | "processing" | "ready";

const glyphs: Record<Platform, (props: { className?: string }) => React.JSX.Element> = {
  youtube: YoutubeGlyph,
  instagram: InstagramGlyph,
};

export function UrlAnalyzer() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [format, setFormat] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const detected = useMemo(() => detectPlatform(url), [url]);

  function handleAnalyze() {
    setError(null);
    const platform = detectPlatform(url);
    if (!platform) {
      setError("Não conseguimos identificar essa plataforma. Verifique o link e tente novamente.");
      return;
    }
    setStage("analyzing");
    window.setTimeout(() => {
      setFormat(0);
      setStage("result");
    }, 1100);
  }

  function handleProcess() {
    setStage("processing");
    window.setTimeout(() => setStage("ready"), 900);
  }

  function reset() {
    setStage("idle");
    setUrl("");
    setError(null);
  }

  const platform = detected ?? "youtube";
  const meta = platformMeta[platform];
  const Glyph = glyphs[platform];

  return (
    <div className="w-full">
      {/* Input card */}
      <div
        className={`group relative flex flex-col gap-3 rounded-2xl border bg-surface p-2 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:gap-0 ${
          error ? "border-error/50" : "border-border focus-within:border-accent/60"
        }`}
        style={{
          boxShadow: url && !error ? "0 0 0 4px var(--color-accent-muted)" : undefined,
        }}
      >
        <div className="flex flex-1 items-center gap-3 px-3 py-2.5 sm:py-2">
          <LinkGlyph className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
              if (stage !== "idle") setStage("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="Cole seu link aqui..."
            className="w-full bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={stage === "analyzing"}
          className="w-full sm:w-auto"
        >
          {stage === "analyzing" ? "Analisando..." : "Analisar"}
        </Button>
      </div>

      {/* Inline detection / error feedback */}
      <div className="mt-3 min-h-[28px] px-1">
        {error && (
          <p className="animate-fade-in text-sm text-error">{error}</p>
        )}
        {!error && detected && stage === "idle" && (
          <div className="flex animate-fade-in items-center gap-2 text-sm text-text-secondary">
            {glyphs[detected]({ className: "h-4 w-4 text-accent" })}
            <span>
              {platformMeta[detected].label} · {platformMeta[detected].contentType}
            </span>
          </div>
        )}
      </div>

      {/* Analyzing skeleton */}
      {stage === "analyzing" && (
        <div className="mt-6 grid animate-fade-up gap-5 rounded-3xl border border-border bg-surface p-5 sm:grid-cols-[180px_1fr]">
          <div className="aspect-video animate-pulse rounded-2xl bg-surface-elevated sm:aspect-square" />
          <div className="space-y-3">
            <div className="h-3 w-24 animate-pulse rounded-full bg-surface-elevated" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-elevated" />
            <div className="h-3 w-16 animate-pulse rounded-full bg-surface-elevated" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-elevated" />
              <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-elevated" />
            </div>
          </div>
        </div>
      )}

      {/* Result / processing / ready */}
      {(stage === "result" || stage === "processing" || stage === "ready") && (
        <div className="mt-6 animate-fade-up rounded-3xl border border-border bg-surface p-5">
          {stage !== "ready" ? (
            <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface-elevated to-surface sm:aspect-square">
                <Glyph className="h-9 w-9 text-accent/70" />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <Badge tone="accent">
                  <Glyph className="h-3.5 w-3.5" />
                  {meta.label}
                </Badge>
                <h3 className="text-[15px] font-medium text-text-primary">{meta.title}</h3>
                <p className="text-xs text-text-muted">{meta.duration}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {meta.formats.map((f, i) => (
                    <button
                      key={f}
                      onClick={() => setFormat(i)}
                      disabled={stage === "processing"}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        format === i
                          ? "border-accent/60 bg-accent-muted text-accent"
                          : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <Button onClick={handleProcess} disabled={stage === "processing"}>
                    {stage === "processing" ? "Processando..." : "Processar"}
                  </Button>
                  <button onClick={reset} className="text-xs text-text-muted hover:text-text-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/10">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-success">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-text-primary">Seu arquivo está pronto.</p>
                  <p className="text-xs text-text-muted">
                    conteudo-{platform}.mp4 · {meta.formats[format]} · 24.6 MB
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button>Baixar arquivo</Button>
                <Link href="/converter">
                  <Button variant="secondary">Converter arquivo</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
