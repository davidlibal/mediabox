import { NextResponse } from "next/server";
import { findProvider } from "@/lib/providers/registry";

// Streaming a real video/audio file through this function can take longer
// than the platform default. Give it more headroom (still bounded by the
// hosting plan's hard cap).
export const maxDuration = 60;

function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|]+/g, " ").trim();
  return cleaned.slice(0, 120) || "arquivo";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const format = typeof body?.format === "string" ? body.format : "";

  if (!url) {
    return NextResponse.json({ error: "Link ausente." }, { status: 400 });
  }

  const provider = findProvider(url);
  if (!provider) {
    return NextResponse.json(
      { error: "Não conseguimos identificar essa plataforma." },
      { status: 400 }
    );
  }

  if (!provider.getDownloadTarget) {
    return NextResponse.json(
      { error: "Download ainda não disponível para essa plataforma." },
      { status: 501 }
    );
  }

  let target;
  try {
    target = await provider.getDownloadTarget(url, format);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível preparar o download agora. Tente novamente.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.url);
  } catch (err) {
    console.error("Upstream fetch failed:", err);
    return NextResponse.json(
      { error: "Falha ao baixar o arquivo de origem." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "O arquivo de origem não está disponível." },
      { status: 502 }
    );
  }

  const fileName = `${sanitizeFileName(target.title)}.${target.extension}`;
  const contentLength = upstream.headers.get("content-length");

  return new Response(upstream.body, {
    headers: {
      "Content-Type": target.mimeType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      ...(contentLength ? { "Content-Length": contentLength } : {}),
    },
  });
}
