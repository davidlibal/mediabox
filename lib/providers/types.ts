export type ProviderId = "youtube" | "instagram";

export interface ProviderMeta {
  label: string;
  contentType: string;
  title: string;
  duration: string;
  formats: string[];
}

export interface Provider {
  id: ProviderId;
  label: string;
  match: (url: string) => boolean;
  analyze: (url: string) => Promise<ProviderMeta>;
}
