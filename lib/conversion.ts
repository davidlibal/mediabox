export type FileCategory = "image" | "video" | "audio" | "document" | "other";

const extensionMap: Record<string, FileCategory> = {
  png: "image", jpg: "image", jpeg: "image", webp: "image", gif: "image", heic: "image", svg: "image",
  mp4: "video", mov: "video", webm: "video", mkv: "video", avi: "video",
  mp3: "audio", wav: "audio", ogg: "audio", m4a: "audio", flac: "audio",
  pdf: "document", docx: "document", doc: "document", txt: "document", rtf: "document", pptx: "document",
};

export const categoryMeta: Record<
  FileCategory,
  { label: string; formats: string[] }
> = {
  image: { label: "Imagem", formats: ["PNG", "JPG", "WEBP", "AVIF"] },
  video: { label: "Vídeo", formats: ["MP4", "MOV", "WEBM", "GIF"] },
  audio: { label: "Áudio", formats: ["MP3", "WAV", "OGG", "FLAC"] },
  document: { label: "Documento", formats: ["PDF", "DOCX", "TXT"] },
  other: { label: "Arquivo", formats: ["ZIP"] },
};

export function detectCategory(fileName: string): FileCategory {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return extensionMap[ext] ?? "other";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
