import type { Provider } from "./types";

export const youtubeProvider: Provider = {
  id: "youtube",
  label: "YouTube",
  match: (url) => /youtu\.?be/.test(url.toLowerCase()),
  async analyze() {
    // Mock response — real YouTube integration lands in a later phase.
    return {
      label: "YouTube",
      contentType: "Vídeo detectado",
      title: "Como criar produtos com identidade visual forte",
      duration: "12:47",
      formats: ["MP4 · 1080p", "MP4 · 720p", "MP3 · Áudio"],
    };
  },
};
