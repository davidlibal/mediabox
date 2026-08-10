import type { Provider } from "./types";

export const instagramProvider: Provider = {
  id: "instagram",
  label: "Instagram",
  match: (url) => /instagram\.com/.test(url.toLowerCase()),
  async analyze() {
    // Mock response — real Instagram integration lands in a later phase.
    return {
      label: "Instagram",
      contentType: "Reel detectado",
      title: "Bastidores da produção — episódio 3",
      duration: "00:32",
      formats: ["MP4 · Original", "MP4 · 720p"],
    };
  },
};
