import ytdl from "@distube/ytdl-core";
import type { Provider } from "./types";

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

    let info: ytdl.videoInfo;
    try {
      info = await ytdl.getInfo(url);
    } catch {
      throw new Error(
        "Não foi possível obter os dados deste vídeo agora. Ele pode ser privado, restrito ou estar indisponível."
      );
    }

    const { videoDetails } = info;
    const lengthSeconds = Number(videoDetails.lengthSeconds ?? 0);

    return {
      label: "YouTube",
      contentType: "Vídeo detectado",
      title: videoDetails.title,
      duration: lengthSeconds > 0 ? formatDuration(lengthSeconds) : "—",
      formats: buildFormatList(info),
    };
  },
};
