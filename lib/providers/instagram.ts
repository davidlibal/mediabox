import type { DownloadTarget, Provider } from "./types";

// Matches both standalone share links (instagram.com/reel/{code}/) and
// profile-scoped links (instagram.com/{username}/reel/{code}/) — Instagram
// generates both formats depending on where the link is copied from.
const INSTAGRAM_URL_PATTERN = /instagram\.com\/(?:[^/?#]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/i;

function extractShortcode(url: string): string | null {
  const match = url.match(INSTAGRAM_URL_PATTERN);
  return match?.[2] ?? null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMetaTag(property: string, html: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return undefined;
}

type InstagramMedia = {
  videoUrl?: string;
  imageUrl?: string;
  title: string;
};

/**
 * Public Instagram posts render Open Graph meta tags (og:video, og:image,
 * og:title) server-side so that link previews work on other platforms —
 * this is the same mechanism crawlers use and doesn't require a logged-in
 * session. It only works for public, non-age-gated posts; private accounts
 * or posts that require login return a page with no og:video/og:image tags,
 * which we surface as a clear error instead of a silent failure.
 */
async function extractMedia(url: string): Promise<InstagramMedia> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    console.error("Instagram fetch failed:", err);
    throw new Error("Não foi possível acessar o Instagram agora. Tente novamente em instantes.");
  }

  if (!res.ok) {
    throw new Error(
      "Não foi possível acessar essa publicação. Ela pode ser privada, ter sido removida ou exigir login."
    );
  }

  const html = await res.text();
  const videoUrl = extractMetaTag("og:video:secure_url", html) ?? extractMetaTag("og:video", html);
  const imageUrl = extractMetaTag("og:image", html);
  const title = extractMetaTag("og:title", html) ?? "Post do Instagram";

  if (!videoUrl && !imageUrl) {
    throw new Error(
      "Não conseguimos acessar esse conteúdo. Ele pode ser privado, ter sido removido ou exigir login no Instagram."
    );
  }

  return { videoUrl, imageUrl, title };
}

export const instagramProvider: Provider = {
  id: "instagram",
  label: "Instagram",
  match: (url) => /instagram\.com/.test(url.toLowerCase()),
  async analyze(url) {
    if (!extractShortcode(url)) {
      throw new Error(
        "Não conseguimos reconhecer esse link do Instagram. Use o link de uma publicação ou reel."
      );
    }

    const media = await extractMedia(url);

    return {
      label: "Instagram",
      contentType: media.videoUrl ? "Vídeo detectado" : "Imagem detectada",
      title: media.title,
      duration: "—",
      formats: media.videoUrl ? ["MP4 · Original"] : ["JPG · Original"],
    };
  },
  async getDownloadTarget(url, format): Promise<DownloadTarget> {
    if (!extractShortcode(url)) {
      throw new Error(
        "Não conseguimos reconhecer esse link do Instagram. Use o link de uma publicação ou reel."
      );
    }

    const media = await extractMedia(url);

    if (format.startsWith("JPG")) {
      if (!media.imageUrl) {
        throw new Error("Não encontramos uma imagem para baixar nesta publicação.");
      }
      return {
        url: media.imageUrl,
        mimeType: "image/jpeg",
        extension: "jpg",
        title: media.title,
      };
    }

    if (!media.videoUrl) {
      throw new Error("Não encontramos um vídeo para baixar nesta publicação.");
    }
    return {
      url: media.videoUrl,
      mimeType: "video/mp4",
      extension: "mp4",
      title: media.title,
    };
  },
};
