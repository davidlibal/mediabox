"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Mock download action: no real file exists yet (providers land in a later phase),
 * so this only reflects success in the UI instead of faking a binary download.
 */
export function DownloadButton({
  children,
  doneLabel = "Baixado",
  ...props
}: ButtonProps & { doneLabel?: string }) {
  const [done, setDone] = useState(false);

  return (
    <Button
      {...props}
      onClick={() => {
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
