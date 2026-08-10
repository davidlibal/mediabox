import Link from "next/link";
import { Logo } from "@/components/logo";
import { StatusDot } from "@/components/status-dot";

const navLinks = [
  { href: "/", label: "Download" },
  { href: "/converter", label: "Converter" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <StatusDot />
        </div>

        {/* Mobile menu — native <details>, no client JS needed */}
        <details className="relative md:hidden">
          <summary className="flex h-9 w-9 list-none items-center justify-center rounded-lg border border-border text-text-secondary [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-11 w-44 rounded-2xl border border-border bg-surface-elevated p-1.5 shadow-xl animate-fade-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-border px-3 pt-2">
              <StatusDot />
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
