import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaBox — Conteúdo e arquivos, em um só lugar",
  description:
    "Baixe conteúdo do Instagram e YouTube, e converta arquivos para o formato que você precisa. Simples, rápido e seguro.",
  openGraph: {
    title: "MediaBox",
    description: "Conteúdo e arquivos. Em um só lugar.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <div className="mb-backdrop" />
        <div className="mb-grid" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
