import ytdl from "@distube/ytdl-core";
import type { DownloadTarget, Provider } from "./types";

// Vercel's serverless functions run on a read-only filesystem. ytdl-core
// tries to write debug/update files to disk by default, which throws
// (EROFS) instead of just warning. Both env vars must be set before any
// ytdl call to avoid that crash.
process.env.YTDL_NO_UPDATE = "1";
process.env.YTDL_NO_DEBUG_FILE = "1";

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

function buildFormatList(info: ytdl.videoInfo): string[] {
  const videoQualities = Array.from(
    new Set(
      info.formats
        .filter((format) => format.hasVideo && format.qualityLabel)
        .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
        .map((format) => format.qualityLabel as string)
    )
  ).slice(0, 3);

  const formats = videoQualities.map((quality) => `MP4 · ${quality}`);

  if (info.formats.some((format) => format.hasAudio)) {
    formats.push("MP3 · Áudio");
  }

  return formats.length > 0 ? formats : ["MP4 · Original"];
}

type OEmbedResponse = { title?: string };

/**
 * YouTube's public oEmbed endpoint (used for embed previews) doesn't go
 * through the same bot-detection gate as full page/player scraping. It only
 * exposes the title, but it's a reliable fallback when ytdl-core gets
 * blocked ("Sign in to confirm you're not a bot") from cloud/datacenter IPs
 * — a known limitation of any server-side YouTube extraction without an
 * authenticated session.
 */
async function analyzeViaOEmbed(url: string) {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
  );
  if (!res.ok) {
    throw new Error(`oEmbed request failed with status ${res.status}`);
  }
  const data = (await res.json()) as OEmbedResponse;
  return {
    label: "YouTube",
    contentType: "Vídeo detectado",
    title: data.title ?? "Vídeo do YouTube",
    duration: "—",
    formats: ["MP4 · Original"],
  };
}

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "audio/mp4": "m4a",
  "audio/webm": "webm",
};

function inferExtension(mimeType: string | undefined, fallback: string): string {
  if (!mimeType) return fallback;
  const type = mimeType.split(";")[0]?.trim();
  return EXTENSION_BY_MIME_TYPE[type ?? ""] ?? fallback;
}

/**
 * Resolves a chosen format label (as produced by buildFormatList, e.g.
 * "MP4 · 360p" or "MP3 · Áudio") to a concrete, directly fetchable stream
 * URL. Only reachable when ytdl.getInfo() itself succeeds — if YouTube's
 * bot-detection blocked the earlier /api/analyze call (oEmbed fallback),
 * there's no deciphered stream URL to download from, and this will throw.
 */
async function getDownloadTarget(url: string, format: string): Promise<DownloadTarget> {
  if (!ytdl.validateURL(url)) {
    throw new Error(
      "Não conseguimos reconhecer esse link do YouTube. Verifique e tente novamente."
    );
  }

  let info: ytdl.videoInfo;
  try {
    info = await ytdl.getInfo(url);
  } catch (err) {
    console.error("ytdl.getInfo failed during download:", err);
    throw new Error(
      "Download indisponível para este vídeo agora. Tente novamente em instantes."
    );
  }

  const title = info.videoDetails.title;

  if (format.startsWith("MP3")) {
    const audioFormats = info.formats
      .filter((f) => f.hasAudio && !f.hasVideo && f.url)
      .sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0));
    const chosen = audioFormats[0];
    if (!chosen?.url) {
      throw new Error("Não encontramos uma faixa de áudio para este vídeo.");
    }
    return {
      url: chosen.url,
      mimeType: chosen.mimeType?.split(";")[0] ?? "audio/mp4",
      extension: inferExtension(chosen.mimeType, "m4a"),
      title,
    };
  }

  const quality = format.split("·")[1]?.trim();
  const videoFormats = info.formats.filter(
    (f) => f.hasVideo && f.hasAudio && f.qualityLabel && f.url
  );
  const chosen = videoFormats.find((f) => f.qualityLabel === quality) ?? videoFormats[0];

  if (!chosen?.url) {
    throw new Error("Não encontramos esse formato para este vídeo.");
  }
  return {
    url: chosen.url,
    mimeType: chosen.mimeType?.split(";")[0] ?? "video/mp4",
    extension: inferExtension(chosen.mimeType, "mp4"),
    title,
  };
}

export const youtubeProvider: Provider = {
  id: "youtube",
  label: "YouTube",
  match: (url) => /youtu\.?be/.test(url.toLowerCase()),
  async analyze(url) {
    if (!ytdl.validateURL(url)) {
      throw new Error(
        "Não conseguimos reconhecer esse link do YouTube. Verifique e tente novamente."
      );
    }

    try {
      const info = await ytdl.getInfo(url);
      const { videoDetails } = info;
      const lengthSeconds = Number(videoDetails.lengthSeconds ?? 0);

      return {
        label: "YouTube",
        contentType: "Vídeo detectado",
        title: videoDetails.title,
        duration: lengthSeconds > 0 ? formatDuration(lengthSeconds) : "—",
        formats: buildFormatList(info),
      };
    } catch (err) {
      console.error("ytdl.getInfo failed, falling back to oEmbed:", err);
    }

    try {
      return await analyzeViaOEmbed(url);
    } catch (err) {
      console.error("oEmbed fallback failed:", err);
      throw new Error(
        "Não foi possível obter os dados deste vídeo agora. Ele pode ser privado, restrito ou estar indisponível."
      );
    }
  },
  getDownloadTarget,
};
