export function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="5.5" width="20" height="13" rx="4" fill="currentColor" opacity="0.14" />
      <path d="M10.2 9.4a.8.8 0 0 1 1.2-.7l5 2.6a.8.8 0 0 1 0 1.4l-5 2.6a.8.8 0 0 1-1.2-.7V9.4Z" fill="currentColor" />
    </svg>
  );
}

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="6" stroke="currentColor" strokeWidth="1.6" opacity="0.5" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9.5 14.5 14.5 9.5M11 8l.9-.9a3 3 0 1 1 4.24 4.24L15 12.4M13 16l-.9.9A3 3 0 1 1 7.86 12.6L9 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
