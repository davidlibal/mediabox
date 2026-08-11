"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/download-button";
import { MediaPreview } from "@/components/media-preview";
import { FormatSelector } from "@/components/format-selector";
import { ProviderBadge } from "@/components/provider-badge";
import { StatusIndicator } from "@/components/status-indicator";
import { YoutubeGlyph, InstagramGlyph, LinkGlyph } from "@/components/icons/platform-icons";
import { detectPlatform, type Platform } from "@/lib/platform";

type Stage = "idle" | "analyzing" | "result" | "processing" | "ready";

type AnalyzeMeta = {
  label: string;
  contentType: string;
  title: string;
  duration: string;
  formats: string[];
};

type DownloadResult = {
  fileName: string;
  size: string;
  blobUrl: string;
};

const glyphs: Record<Platform, (props: { className?: string }) => React.JSX.Element> = {
  youtube: YoutubeGlyph,
  instagram: InstagramGlyph,
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

function extractFileName(contentDisposition: string | null, fallback: string): string {
  const match = contentDisposition?.match(/filename="([^"]+)"/);
  return match?.[1] ?? fallback;
}

export function UrlAnalyzer() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [format, setFormat] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Platform | null>(null);
  const [meta, setMeta] = useState<AnalyzeMeta | null>(null);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);

  const hinted = useMemo(() => detectPlatform(url), [url]);

  async function analyze(targetUrl: string) {
    setError(null);
    setStage("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não conseguimos identificar essa plataforma. Verifique o link e tente novamente.");
        setStage("idle");
        return;
      }
      setProvider(data.provider as Platform);
      setMeta(data.meta as AnalyzeMeta);
      setFormat(0);
      setStage("result");
    } catch {
      setError("Falha ao conectar. Tente novamente.");
      setStage("idle");
    }
  }

  async function handleProcess() {
    if (!provider || !meta) return;
    setStage("processing");
    setProcessError(null);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: meta.formats[format] }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setProcessError(data?.error ?? "Não foi possível preparar o download agora. Tente novamente.");
        setStage("result");
        return;
      }

      const blob = await res.blob();
      const fileName = extractFileName(res.headers.get("content-disposition"), "arquivo");
      const blobUrl = URL.createObjectURL(blob);
      setResult({ fileName, size: formatBytes(blob.size), blobUrl });
      setStage("ready");
    } catch {
      setProcessError("Falha ao conectar. Tente novamente.");
      setStage("result");
    }
  }

  function reset() {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    setStage("idle");
    setUrl("");
    setError(null);
    setProcessError(null);
    setProvider(null);
    setMeta(null);
    setResult(null);
  }

  const Glyph = glyphs[provider ?? "youtube"];

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
            onKeyDown={(e) => e.key === "Enter" && analyze(url)}
            placeholder="Cole seu link aqui..."
            aria-label="URL do conteúdo"
            className="w-full bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <Button
          size="lg"
          onClick={() => analyze(url)}
          disabled={stage === "analyzing"}
          className="w-full sm:w-auto"
        >
          {stage === "analyzing" ? "Analisando..." : "Analisar"}
        </Button>
      </div>

      {/* Inline detection / error feedback */}
      <div className="mt-3 min-h-[28px] px-1">
        {error && (
          <div className="flex animate-fade-in items-center gap-3 text-sm">
            <span className="text-error">{error}</span>
            <button onClick={() => analyze(url)} className="font-medium text-accent hover:text-accent-hover">
              Tentar novamente
            </button>
          </div>
        )}
        {!error && hinted && stage === "idle" && (
          <div className="flex animate-fade-in items-center gap-2 text-sm text-text-secondary">
            {glyphs[hinted]({ className: "h-4 w-4 text-accent" })}
            <span>Link do {hinted === "youtube" ? "YouTube" : "Instagram"} detectado</span>
          </div>
        )}
      </div>

      {/* Analyzing skeleton */}
      {stage === "analyzing" && (
        <div className="mt-6 animate-fade-up rounded-3xl border border-border bg-surface p-5">
          <StatusIndicator label="Analisando conteúdo..." />
          <div className="mt-4 grid gap-5 sm:grid-cols-[180px_1fr]">
            <MediaPreview loading />
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
        </div>
      )}

      {/* Result / processing / ready */}
      {(stage === "result" || stage === "processing" || stage === "ready") && meta && (
        <div className="mt-6 animate-fade-up rounded-3xl border border-border bg-surface p-5">
          {stage !== "ready" ? (
            <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
              <MediaPreview icon={<Glyph className="h-9 w-9 text-accent/70" />} />
              <div className="flex flex-col justify-center gap-2">
                <ProviderBadge icon={<Glyph className="h-3.5 w-3.5" />} label={meta.label} />
                <h3 className="text-[15px] font-medium text-text-primary">{meta.title}</h3>
                <p className="text-xs text-text-muted">{meta.duration}</p>

                <FormatSelector
                  formats={meta.formats}
                  selected={format}
                  onSelect={setFormat}
                  disabled={stage === "processing"}
                />

                {processError && <p className="text-xs text-error">{processError}</p>}

                <div className="mt-3 flex items-center gap-3">
                  <Button onClick={handleProcess} disabled={stage === "processing"}>
                    {stage === "processing" ? "Processando..." : "Processar"}
                  </Button>
                  {stage === "processing" ? (
                    <StatusIndicator label="Preparando arquivo..." />
                  ) : (
                    <button onClick={reset} className="text-xs text-text-muted hover:text-text-secondary">
                      Cancelar
                    </button>
                  )}
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
                    {result?.fileName} · {meta.formats[format]} · {result?.size}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <DownloadButton href={result?.blobUrl} downloadName={result?.fileName}>
                  Baixar arquivo
                </DownloadButton>
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
