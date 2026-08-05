import { ARTIST_ID, SPOTIFY_ARTIST_URL } from "@/config/artist";
import type { SpotifyPayload } from "@/types/spotify";
import { isValidSpotifyPayload, sanitizePayload } from "@/utils/validation";
import { assetUrl } from "@/utils/formatting";

export type DataLoadState =
  | { status: "loading" }
  | { status: "success"; data: SpotifyPayload; source: "api" | "static" }
  | { status: "error"; message: string; spotifyUrl: string }
  | { status: "empty"; data: SpotifyPayload; source: "api" | "static" };

const dataMode = (import.meta.env.VITE_DATA_MODE as string | undefined) || "api";

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

function validateOrThrow(data: unknown): SpotifyPayload {
  if (!isValidSpotifyPayload(data, ARTIST_ID)) {
    console.error("Spotify artist identity mismatch or invalid payload");
    throw new Error("Spotify artist identity mismatch");
  }
  return sanitizePayload(data, ARTIST_ID);
}

async function loadFromApi(): Promise<SpotifyPayload> {
  const data = await fetchJson("/api/spotify");
  return validateOrThrow(data);
}

async function loadFromStatic(): Promise<SpotifyPayload> {
  const url = assetUrl("data/spotify.json");
  const data = await fetchJson(url);
  return validateOrThrow(data);
}

export async function loadSpotifyData(): Promise<DataLoadState> {
  try {
    if (dataMode === "static") {
      const data = await loadFromStatic();
      if (
        data.tracks.length === 0 &&
        data.primaryReleases.length === 0 &&
        data.featuredReleases.length === 0
      ) {
        return { status: "empty", data, source: "static" };
      }
      return { status: "success", data, source: "static" };
    }

    try {
      const data = await loadFromApi();
      if (
        data.tracks.length === 0 &&
        data.primaryReleases.length === 0 &&
        data.featuredReleases.length === 0
      ) {
        return { status: "empty", data, source: "api" };
      }
      return { status: "success", data, source: "api" };
    } catch (apiError) {
      console.warn("API load failed, attempting static fallback", apiError);
      try {
        const data = await loadFromStatic();
        if (
          data.tracks.length === 0 &&
          data.primaryReleases.length === 0 &&
          data.featuredReleases.length === 0
        ) {
          return { status: "empty", data, source: "static" };
        }
        return { status: "success", data, source: "static" };
      } catch {
        throw apiError;
      }
    }
  } catch (error) {
    console.error("Spotify data load failed", error);
    return {
      status: "error",
      message: "Spotify verileri şu anda yüklenemiyor.",
      spotifyUrl: SPOTIFY_ARTIST_URL,
    };
  }
}
