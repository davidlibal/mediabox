"use client";

import { useRef, useState } from "react";
import { UploadGlyph } from "@/components/icons/file-icons";

export function FileDrop({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={`mt-10 w-full max-w-xl cursor-pointer rounded-3xl border border-dashed p-12 text-center transition-colors ${
        dragging ? "border-accent/60 bg-accent-muted/40" : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated">
          <UploadGlyph className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-sm text-text-secondary">Arraste seu arquivo aqui, ou</p>
        <span className="rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-strong">
          Selecionar arquivo
        </span>
      </div>
    </div>
  );
}
