import type { DownloadTarget, Provider } from "./types";
import { pickItem, resolveMedia, toTarget } from "./gallerydl";

// Matches both standalone share links (instagram.com/reel/{code}/) and
// profile-scoped links (instagram.com/{username}/reel/{code}/).
const INSTAGRAM_URL_PATTERN = /instagram\.com\/(?:[^/?#]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/i;

const INVALID_LINK_MESSAGE =
  "Não conseguimos reconhecer esse link do Instagram. Use o link de uma publicação ou reel.";

export const instagramProvider: Provider = {
  id: "instagram",
  label: "Instagram",
  match: (url) => /instagram\.com/.test(url.toLowerCase()),
  async analyze(url) {
    if (!INSTAGRAM_URL_PATTERN.test(url)) throw new Error(INVALID_LINK_MESSAGE);

    const media = await resolveMedia(url);
    const hasVideo = media.items.some((i) => i.kind === "video");

    return {
      label: "Instagram",
      contentType: hasVideo ? "Vídeo detectado" : "Imagem detectada",
      title: media.title,
      duration: "—",
      formats: hasVideo ? ["MP4 · Original"] : ["JPG · Original"],
    };
  },
  async getDownloadTarget(url, format): Promise<DownloadTarget> {
    if (!INSTAGRAM_URL_PATTERN.test(url)) throw new Error(INVALID_LINK_MESSAGE);

    const media = await resolveMedia(url);
    const item = pickItem(media, format.startsWith("JPG"));
    return toTarget(item, media.title);
  },
};
