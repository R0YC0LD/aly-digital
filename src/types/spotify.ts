export type SpotifyImage = {
  url: string;
  width: number | null;
  height: number | null;
};

export type NormalizedArtist = {
  id: string;
  name: string;
  externalUrl: string;
  images: SpotifyImage[];
};

export type NormalizedRelease = {
  id: string;
  name: string;
  albumType: string;
  albumGroup: string;
  releaseDate: string;
  releaseDatePrecision: "year" | "month" | "day" | string;
  image: SpotifyImage | null;
  externalUrl: string;
  totalTracks: number;
  artistIds: string[];
  artistNames: string[];
  trackIds: string[];
};

export type NormalizedTrack = {
  id: string;
  name: string;
  durationMs: number;
  explicit: boolean;
  externalUrl: string;
  previewUrl: string | null;
  albumId: string;
  albumName: string;
  albumImage: SpotifyImage | null;
  releaseDate: string;
  artistIds: string[];
  artistNames: string[];
  trackNumber: number;
  discNumber: number;
  isFeature: boolean;
  linkedFromId?: string | null;
  isrc?: string | null;
};

export type SpotifyPayload = {
  artistId: string;
  artist: NormalizedArtist;
  primaryReleases: NormalizedRelease[];
  featuredReleases: NormalizedRelease[];
  tracks: NormalizedTrack[];
  generatedAt: string;
  market: string;
};

export type SpotifyRawArtist = {
  id: string;
  type: string;
  name: string;
  external_urls?: { spotify?: string };
  images?: Array<{ url: string; width: number | null; height: number | null }>;
};

export type SpotifyRawSimplifiedArtist = {
  id: string;
  name: string;
};

export type SpotifyRawAlbum = {
  id: string;
  name: string;
  album_type: string;
  album_group?: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  external_urls?: { spotify?: string };
  images?: Array<{ url: string; width: number | null; height: number | null }>;
  artists: SpotifyRawSimplifiedArtist[];
};

export type SpotifyRawTrack = {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  track_number: number;
  disc_number: number;
  external_urls?: { spotify?: string };
  preview_url?: string | null;
  artists: SpotifyRawSimplifiedArtist[];
  linked_from?: { id?: string } | null;
  external_ids?: { isrc?: string };
};
