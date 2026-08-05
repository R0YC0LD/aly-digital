export const ARTIST_ID = "2pwxA6FXPCRje8le8719pQ";
export const EXPECTED_ARTIST_NAME = "ALY";
export const SPOTIFY_MARKET = "TR";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

type SpotifyImage = {
  url: string;
  width: number | null;
  height: number | null;
};

type NormalizedArtist = {
  id: string;
  name: string;
  externalUrl: string;
  images: SpotifyImage[];
};

type NormalizedRelease = {
  id: string;
  name: string;
  albumType: string;
  albumGroup: string;
  releaseDate: string;
  releaseDatePrecision: string;
  image: SpotifyImage | null;
  externalUrl: string;
  totalTracks: number;
  artistIds: string[];
  artistNames: string[];
  trackIds: string[];
};

type NormalizedTrack = {
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

class HttpError extends Error {
  status: number;
  retryAfter?: number;

  constructor(message: string, status: number, retryAfter?: number) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getClientCredentialsToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const retryAfter = parseRetryAfter(res.headers.get("Retry-After"));
    throw new HttpError(
      `Spotify token error: ${res.status}`,
      res.status,
      retryAfter,
    );
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const asNumber = Number(header);
  if (Number.isFinite(asNumber)) return asNumber * 1000;
  const asDate = Date.parse(header);
  if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
  return undefined;
}

async function spotifyFetch<T>(
  path: string,
  token: string,
  attempt = 0,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429 && attempt < 2) {
    const retryAfter = parseRetryAfter(res.headers.get("Retry-After")) ?? 2000;
    await sleep(Math.min(retryAfter, 10000));
    return spotifyFetch<T>(path, token, attempt + 1);
  }

  if (!res.ok) {
    throw new HttpError(
      `Spotify API error: ${res.status} ${path}`,
      res.status,
      parseRetryAfter(res.headers.get("Retry-After")),
    );
  }

  return (await res.json()) as T;
}

async function fetchAllPages<TItem>(
  initialPath: string,
  token: string,
  pick: (json: { items: TItem[]; next: string | null }) => TItem[],
): Promise<TItem[]> {
  const items: TItem[] = [];
  let path: string | null = initialPath;

  while (path) {
    const absolute = path.startsWith("http")
      ? path.replace(API_BASE, "")
      : path;
    const json = await spotifyFetch<{ items: TItem[]; next: string | null }>(
      absolute,
      token,
    );
    items.push(...pick(json));
    path = json.next;
  }

  return items;
}

function assertArtistIdentity(artist: {
  id: string;
  type: string;
  name: string;
}): void {
  if (artist.id !== ARTIST_ID || artist.type !== "artist") {
    console.error("Spotify artist identity mismatch", {
      expectedId: ARTIST_ID,
      receivedId: artist.id,
      receivedType: artist.type,
      receivedName: artist.name,
    });
    throw new HttpError("Spotify artist identity mismatch", 422);
  }
}

function pickImage(
  images?: Array<{ url: string; width: number | null; height: number | null }>,
): SpotifyImage | null {
  if (!images?.length) return null;
  const sorted = [...images].sort(
    (a, b) => (b.width ?? 0) - (a.width ?? 0),
  );
  const mid = sorted[Math.floor(sorted.length / 2)] ?? sorted[0];
  return { url: mid.url, width: mid.width, height: mid.height };
}

function releaseDateSortKey(date: string, precision: string): string {
  if (!date) return "0000-00-00";
  if (precision === "year" || date.length === 4) return `${date}-01-01`;
  if (precision === "month" || date.length === 7) return `${date}-01`;
  return date;
}

function dedupeTracks(tracks: NormalizedTrack[]): NormalizedTrack[] {
  const byId = new Map<string, NormalizedTrack>();
  const secondary = new Set<string>();

  for (const track of tracks) {
    if (byId.has(track.id)) continue;
    const key = track.linkedFromId || (track.isrc ? `isrc:${track.isrc}` : null);
    if (key && secondary.has(key)) continue;
    byId.set(track.id, track);
    if (key) secondary.add(key);
  }

  return Array.from(byId.values());
}

export async function buildSpotifyPayload(
  clientId: string,
  clientSecret: string,
): Promise<SpotifyPayload> {
  const token = await getClientCredentialsToken(clientId, clientSecret);

  const artistRaw = await spotifyFetch<{
    id: string;
    type: string;
    name: string;
    external_urls?: { spotify?: string };
    images?: Array<{ url: string; width: number | null; height: number | null }>;
  }>(`/artists/${ARTIST_ID}`, token);

  assertArtistIdentity(artistRaw);

  type RawAlbum = {
    id: string;
    name: string;
    album_type: string;
    album_group?: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    external_urls?: { spotify?: string };
    images?: Array<{ url: string; width: number | null; height: number | null }>;
    artists: Array<{ id: string; name: string }>;
  };

  const albums = await fetchAllPages<RawAlbum>(
    `/artists/${ARTIST_ID}/albums?include_groups=album,single,appears_on&market=${SPOTIFY_MARKET}&limit=50`,
    token,
    (json) => json.items,
  );

  const albumMap = new Map<string, RawAlbum>();
  for (const album of albums) {
    if (!albumMap.has(album.id)) albumMap.set(album.id, album);
  }

  const allTracks: NormalizedTrack[] = [];
  const releaseBuilders: Array<{
    release: Omit<NormalizedRelease, "trackIds" | "totalTracks"> & {
      totalTracks: number;
    };
    trackIds: string[];
    albumGroup: string;
    isPrimaryArtist: boolean;
  }> = [];

  for (const album of albumMap.values()) {
    type RawTrack = {
      id: string;
      name: string;
      duration_ms: number;
      explicit: boolean;
      track_number: number;
      disc_number: number;
      external_urls?: { spotify?: string };
      preview_url?: string | null;
      artists: Array<{ id: string; name: string }>;
      linked_from?: { id?: string } | null;
      external_ids?: { isrc?: string };
    };

    const tracks = await fetchAllPages<RawTrack>(
      `/albums/${album.id}/tracks?market=${SPOTIFY_MARKET}&limit=50`,
      token,
      (json) => json.items,
    );

    const albumArtistIds = album.artists.map((a) => a.id);
    const isPrimaryArtist = albumArtistIds.includes(ARTIST_ID);
    const albumGroup = album.album_group || album.album_type;
    const albumImage = pickImage(album.images);

    const validTrackIds: string[] = [];

    for (const track of tracks) {
      const artistIds = track.artists.map((a) => a.id);
      if (!artistIds.includes(ARTIST_ID)) continue;

      const isFeature =
        albumGroup === "appears_on" || !isPrimaryArtist || artistIds[0] !== ARTIST_ID;

      const normalized: NormalizedTrack = {
        id: track.id,
        name: track.name,
        durationMs: track.duration_ms,
        explicit: track.explicit,
        externalUrl: track.external_urls?.spotify ?? "",
        previewUrl: track.preview_url ?? null,
        albumId: album.id,
        albumName: album.name,
        albumImage,
        releaseDate: album.release_date,
        artistIds,
        artistNames: track.artists.map((a) => a.name),
        trackNumber: track.track_number,
        discNumber: track.disc_number,
        isFeature,
        linkedFromId: track.linked_from?.id ?? null,
        isrc: track.external_ids?.isrc ?? null,
      };

      allTracks.push(normalized);
      validTrackIds.push(track.id);
    }

    if (validTrackIds.length === 0) continue;

    releaseBuilders.push({
      release: {
        id: album.id,
        name: album.name,
        albumType: album.album_type,
        albumGroup,
        releaseDate: album.release_date,
        releaseDatePrecision: album.release_date_precision,
        image: albumImage,
        externalUrl: album.external_urls?.spotify ?? "",
        totalTracks: validTrackIds.length,
        artistIds: albumArtistIds,
        artistNames: album.artists.map((a) => a.name),
      },
      trackIds: validTrackIds,
      albumGroup,
      isPrimaryArtist,
    });
  }

  const dedupedTracks = dedupeTracks(allTracks).filter((track) => {
    if (!track.artistIds.includes(ARTIST_ID)) {
      console.warn("Dropped track missing ARTIST_ID in artistIds", track.id);
      return false;
    }
    return true;
  });

  const trackIdSet = new Set(dedupedTracks.map((t) => t.id));

  const primaryReleases: NormalizedRelease[] = [];
  const featuredReleases: NormalizedRelease[] = [];

  for (const item of releaseBuilders) {
    const trackIds = item.trackIds.filter((id) => trackIdSet.has(id));
    if (trackIds.length === 0) continue;

    const release: NormalizedRelease = {
      ...item.release,
      totalTracks: trackIds.length,
      trackIds,
    };

    const isPrimary =
      (item.albumGroup === "album" || item.albumGroup === "single") &&
      item.isPrimaryArtist;

    if (isPrimary) primaryReleases.push(release);
    else featuredReleases.push(release);
  }

  const sortNewest = <T extends { releaseDate: string; releaseDatePrecision: string }>(
    list: T[],
  ) =>
    [...list].sort(
      (a, b) =>
        releaseDateSortKey(b.releaseDate, b.releaseDatePrecision).localeCompare(
          releaseDateSortKey(a.releaseDate, a.releaseDatePrecision),
        ),
    );

  return {
    artistId: ARTIST_ID,
    artist: {
      id: artistRaw.id,
      name: artistRaw.name,
      externalUrl:
        artistRaw.external_urls?.spotify ??
        `https://open.spotify.com/artist/${ARTIST_ID}`,
      images: (artistRaw.images ?? []).map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
    },
    primaryReleases: sortNewest(primaryReleases),
    featuredReleases: sortNewest(featuredReleases),
    tracks: [...dedupedTracks].sort((a, b) =>
      releaseDateSortKey(b.releaseDate, "day").localeCompare(
        releaseDateSortKey(a.releaseDate, "day"),
      ),
    ),
    generatedAt: new Date().toISOString(),
    market: SPOTIFY_MARKET,
  };
}

export { HttpError };
