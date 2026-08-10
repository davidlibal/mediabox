import type { Provider, ProviderId } from "./types";
import { youtubeProvider } from "./youtube";
import { instagramProvider } from "./instagram";

const providers: Provider[] = [youtubeProvider, instagramProvider];

export function findProvider(url: string): Provider | null {
  return providers.find((p) => p.match(url)) ?? null;
}

export function getProviderById(id: ProviderId): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function listProviders(): Provider[] {
  return providers;
}
