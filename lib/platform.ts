export type Platform = "youtube" | "instagram";

export function detectPlatform(url: string): Platform | null {
  const value = url.trim().toLowerCase();
  if (!value) return null;
  if (/youtu\.?be/.test(value)) return "youtube";
  if (/instagram\.com/.test(value)) return "instagram";
  return null;
}

export const platformMeta: Record<
  Platform,
  { label: string; contentType: string; title: string; duration: string; formats: string[] }
> = {
  youtube: {
    label: "YouTube",
    contentType: "Vídeo detectado",
    title: "Como criar produtos com identidade visual forte",
    duration: "12:47",
    formats: ["MP4 · 1080p", "MP4 · 720p", "MP3 · Áudio"],
  },
  instagram: {
    label: "Instagram",
    contentType: "Reel detectado",
    title: "Bastidores da produção — episódio 3",
    duration: "00:32",
    formats: ["MP4 · Original", "MP4 · 720p"],
  },
};
