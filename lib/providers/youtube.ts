import ytdl from "@distube/ytdl-core";
import type { Provider } from "./types";

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
};
