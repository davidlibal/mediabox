import { NextResponse } from "next/server";
import { findProvider } from "@/lib/providers/registry";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";

  if (!url) {
    return NextResponse.json({ error: "Informe um link." }, { status: 400 });
  }

  const provider = findProvider(url);
  if (!provider) {
    return NextResponse.json(
      { error: "Não conseguimos identificar essa plataforma. Verifique o link e tente novamente." },
      { status: 422 }
    );
  }

  try {
    const meta = await provider.analyze(url);
    return NextResponse.json({ provider: provider.id, meta });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível analisar esse link agora. Tente novamente.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
