"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/download-button";
import { MediaPreview } from "@/components/media-preview";
import { FormatSelector } from "@/components/format-selector";
import { StatusIndicator } from "@/components/status-indicator";
import { FileDrop } from "@/components/file-drop";
import { Badge } from "@/components/ui/badge";
import { ImageGlyph, VideoGlyph, AudioGlyph, DocumentGlyph, FileGlyph } from "@/components/icons/file-icons";
import { detectCategory, categoryMeta, formatBytes, type FileCategory } from "@/lib/conversion";

type Stage = "idle" | "selected" | "processing" | "ready";

const glyphs: Record<FileCategory, (props: { className?: string }) => React.JSX.Element> = {
  image: ImageGlyph,
  video: VideoGlyph,
  audio: AudioGlyph,
  document: DocumentGlyph,
  other: FileGlyph,
};

export function ConverterFlow() {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState(0);
  const [result, setResult] = useState<{ fileName: string } | null>(null);

  function handleFile(selected: File) {
    setFile(selected);
    setFormat(0);
    setResult(null);
    setStage("selected");
  }

  async function handleConvert() {
    if (!file) return;
    setStage("processing");
    const category = detectCategory(file.name);
    const targetFormat = categoryMeta[category].formats[format];
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, targetFormat }),
    });
    const data = await res.json();
    setResult(data);
    setStage("ready");
  }

  function reset() {
    setStage("idle");
    setFile(null);
    setResult(null);
  }

  if (stage === "idle") {
    return <FileDrop onFile={handleFile} />;
  }

  if (!file) return null;

  const category = detectCategory(file.name);
  const meta = categoryMeta[category];
  const Glyph = glyphs[category];

  return (
    <div className="mt-10 w-full max-w-xl rounded-3xl border border-border bg-surface p-5 text-left">
      {stage === "processing" && (
        <>
          <StatusIndicator label="Convertendo arquivo..." />
          <div className="mt-4 grid gap-5 sm:grid-cols-[120px_1fr]">
            <MediaPreview loading />
            <div className="space-y-3">
              <div className="h-3 w-24 animate-pulse rounded-full bg-surface-elevated" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-elevated" />
              <div className="h-3 w-16 animate-pulse rounded-full bg-surface-elevated" />
            </div>
          </div>
        </>
      )}

      {stage === "selected" && (
        <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
          <MediaPreview icon={<Glyph className="h-9 w-9 text-accent/70" />} />
          <div className="flex flex-col justify-center gap-2">
            <Badge tone="accent">{meta.label}</Badge>
            <h3 className="text-[15px] font-medium text-text-primary">{file.name}</h3>
            <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>

            <FormatSelector formats={meta.formats} selected={format} onSelect={setFormat} />

            <div className="mt-3 flex items-center gap-3">
              <Button onClick={handleConvert}>Converter</Button>
              <button onClick={reset} className="text-xs text-text-muted hover:text-text-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === "ready" && result && (
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
                {result.fileName} · {formatBytes(file.size)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <DownloadButton>Baixar arquivo</DownloadButton>
            <button onClick={reset} className="text-xs text-text-muted hover:text-text-secondary">
              Converter outro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
