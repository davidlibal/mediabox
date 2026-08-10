type MarkProps = {
  size?: number;
  className?: string;
};

/**
 * MediaBox symbol — a rounded box containing a play/flow mark.
 * Works standalone as favicon/app icon or paired with the wordmark.
 */
export function Logomark({ size = 28, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="26" height="26" rx="8" fill="var(--color-accent)" />
      <path
        d="M13 11.3c0-.9 1-1.5 1.8-1l7 4.7c.7.5.7 1.5 0 2l-7 4.7c-.8.5-1.8-.1-1.8-1v-9.4Z"
        fill="var(--color-background)"
      />
      <circle cx="9.5" cy="22.5" r="1.6" fill="var(--color-background)" />
    </svg>
  );
}

export function Logo({ size = 26, className }: MarkProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Logomark size={size} />
      <span className="text-[17px] font-semibold tracking-tight text-text-primary">
        MediaBox
      </span>
    </div>
  );
}
