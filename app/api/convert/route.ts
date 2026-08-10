import { NextResponse } from "next/server";

/**
 * Mock endpoint: no real conversion happens yet (Convertio integration
 * lands in a later phase). Returns plausible output metadata.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const fileName = typeof body?.fileName === "string" ? body.fileName : "arquivo";
  const targetFormat = typeof body?.targetFormat === "string" ? body.targetFormat : "zip";

  const base = fileName.replace(/\.[^.]+$/, "");
  return NextResponse.json({
    fileName: `${base}.${targetFormat.toLowerCase()}`,
  });
}
