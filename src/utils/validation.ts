import { ARTIST_ID, EXPECTED_ARTIST_NAME } from "@/config/artist";
import type {
  NormalizedTrack,
  SpotifyPayload,
  SpotifyRawArtist,
} from "@/types/spotify";

export class ArtistIdentityError extends Error {
  constructor(message = "Spotify artist identity mismatch") {
    super(message);
    this.name = "ArtistIdentityError";
  }
}

export function assertArtistIdentity(artist: SpotifyRawArtist): void {
  if (!artist || artist.type !== "artist" || artist.id !== ARTIST_ID) {
    console.error("Spotify artist identity mismatch", {
      expectedId: ARTIST_ID,
      receivedId: artist?.id,
      receivedType: artist?.type,
      receivedName: artist?.name,
    });
    throw new ArtistIdentityError("Spotify artist identity mismatch");
  }

  // Secondary name check only — never used for lookup
  if (
    artist.name &&
    artist.name.trim().toLowerCase() !== EXPECTED_ARTIST_NAME.toLowerCase()
  ) {
    console.warn("Artist name differs from expected secondary check", {
      expectedName: EXPECTED_ARTIST_NAME,
      receivedName: artist.name,
      artistId: artist.id,
    });
  }
}

export function trackIncludesArtist(
  artistIds: string[] | undefined,
  artistId: string = ARTIST_ID,
): boolean {
  return Array.isArray(artistIds) && artistIds.includes(artistId);
}

export function filterTracksByArtistId(
  tracks: NormalizedTrack[],
  artistId: string = ARTIST_ID,
): NormalizedTrack[] {
  return tracks.filter((track) => {
    const ok = trackIncludesArtist(track.artistIds, artistId);
    if (!ok) {
      console.warn("Dropped track missing ARTIST_ID in artistIds", {
        trackId: track.id,
        trackName: track.name,
        artistIds: track.artistIds,
      });
    }
    return ok;
  });
}

export function isValidSpotifyPayload(
  data: unknown,
  artistId: string = ARTIST_ID,
): data is SpotifyPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as Partial<SpotifyPayload>;

  if (payload.artistId !== artistId) return false;
  if (!payload.artist || payload.artist.id !== artistId) return false;
  if (!Array.isArray(payload.tracks)) return false;
  if (!Array.isArray(payload.primaryReleases)) return false;
  if (!Array.isArray(payload.featuredReleases)) return false;

  const allTracksValid = payload.tracks.every((track) =>
    trackIncludesArtist(track.artistIds, artistId),
  );

  return allTracksValid;
}

export function sanitizePayload(
  data: SpotifyPayload,
  artistId: string = ARTIST_ID,
): SpotifyPayload {
  if (data.artistId !== artistId || data.artist.id !== artistId) {
    console.error("Spotify artist identity mismatch");
    throw new ArtistIdentityError("Spotify artist identity mismatch");
  }

  const tracks = filterTracksByArtistId(data.tracks, artistId);
  const trackIdSet = new Set(tracks.map((t) => t.id));

  const attachValidTracks = (releases: SpotifyPayload["primaryReleases"]) =>
    releases
      .map((release) => ({
        ...release,
        trackIds: (release.trackIds ?? []).filter((id) => trackIdSet.has(id)),
      }))
      .filter((release) => release.trackIds.length > 0);

  return {
    ...data,
    artistId,
    tracks,
    primaryReleases: attachValidTracks(data.primaryReleases),
    featuredReleases: attachValidTracks(data.featuredReleases),
  };
}
