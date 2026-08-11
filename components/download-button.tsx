"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type DownloadButtonProps = ButtonProps & {
  doneLabel?: string;
  /** Object URL (or direct URL) of the already-fetched file to save. */
  href?: string;
  /** File name used for the browser's save dialog. */
  downloadName?: string;
};

export function DownloadButton({
  children,
  doneLabel = "Baixado",
  href,
  downloadName,
  onClick,
  ...props
}: DownloadButtonProps) {
  const [done, setDone] = useState(false);

  return (
    <Button
      {...props}
      onClick={(event) => {
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.download = downloadName ?? "";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        onClick?.(event);
        setDone(true);
        window.setTimeout(() => setDone(false), 2000);
      }}
    >
      {done ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {doneLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
