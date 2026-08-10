import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    application: "ok",
    database: "not_configured",
    providers: "mock",
    timestamp: new Date().toISOString(),
  });
}
