import { NextResponse } from "next/server";
import { getProviderById } from "@/lib/providers/registry";

/**
 * Mock endpoint: no real file is produced yet (providers land in a later
 * phase). Returns plausible metadata so the UI can render a real network
 * round-trip instead of faking everything client-side.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const providerId = body?.provider;
  const format = typeof body?.format === "string" ? body.format : "";

  const provider = getProviderById(providerId);
  if (!provider) {
    return NextResponse.json({ error: "Provider inválido." }, { status: 400 });
  }

  return NextResponse.json({
    fileName: `conteudo-${provider.id}.mp4`,
    format,
    size: "24.6 MB",
  });
}
