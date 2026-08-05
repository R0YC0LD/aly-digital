/**
 * Build-time Spotify data generator for GitHub Pages.
 * Uses SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET from env / GitHub Secrets.
 * Never writes secrets into the output JSON.
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ARTIST_ID = "2pwxA6FXPCRje8le8719pQ";
export const EXPECTED_ARTIST_NAME = "ALY";
export const SPOTIFY_MARKET = "TR";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.resolve(__dirname, "../public/data/spotify.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(header) {
  if (!header) return undefined;
  const asNumber = Number(header);
  if (Number.isFinite(asNumber)) return asNumber * 1000;
  const asDate = Date.parse(header);
  if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
  return undefined;
}

async function getToken(clientId, clientSecret) {
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
    throw new Error(`Spotify token error: ${res.status}`);
  }

  const json = await res.json();
  return json.access_token;
}

async function spotifyFetch(pathName, token, attempt = 0) {
  const res = await fetch(`${API_BASE}${pathName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429 && attempt < 2) {
    const retryAfter = parseRetryAfter(res.headers.get("Retry-After")) ?? 2000;
    await sleep(Math.min(retryAfter, 10000));
    return spotifyFetch(pathName, token, attempt + 1);
  }

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status} ${pathName}`);
  }

  return res.json();
}

async function fetchAllPages(initialPath, token) {
  const items = [];
  let next = initialPath;

  while (next) {
    const pathName = next.startsWith("http") ? next.replace(API_BASE, "") : next;
    const json = await spotifyFetch(pathName, token);
    items.push(...(json.items ?? []));
    next = json.next;
  }

  return items;
}

function assertArtistIdentity(artist) {
  if (!artist || artist.id !== ARTIST_ID || artist.type !== "artist") {
    console.error("Spotify artist identity mismatch", {
      expectedId: ARTIST_ID,
      receivedId: artist?.id,
      receivedType: artist?.type,
      receivedName: artist?.name,
    });
    process.exit(1);
  }

  if (
    artist.name &&
    artist.name.trim().toLowerCase() !== EXPECTED_ARTIST_NAME.toLowerCase()
  ) {
    console.warn("Artist name differs from expected secondary check", artist.name);
  }
}

function pickImage(images) {
  if (!images?.length) return null;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  const mid = sorted[Math.floor(sorted.length / 2)] ?? sorted[0];
  return { url: mid.url, width: mid.width, height: mid.height };
}

function releaseDateSortKey(date, precision = "day") {
  if (!date) return "0000-00-00";
  if (precision === "year" || date.length === 4) return `${date}-01-01`;
  if (precision === "month" || date.length === 7) return `${date}-01`;
  return date;
}

function dedupeTracks(tracks) {
  const byId = new Map();
  const secondary = new Set();

  for (const track of tracks) {
    if (byId.has(track.id)) continue;
    const key = track.linkedFromId || (track.isrc ? `isrc:${track.isrc}` : null);
    if (key && secondary.has(key)) continue;
    byId.set(track.id, track);
    if (key) secondary.add(key);
  }

  return Array.from(byId.values());
}

async function buildPayload(clientId, clientSecret) {
  const token = await getToken(clientId, clientSecret);
  const artistRaw = await spotifyFetch(`/artists/${ARTIST_ID}`, token);
  assertArtistIdentity(artistRaw);

  const albums = await fetchAllPages(
    `/artists/${ARTIST_ID}/albums?include_groups=album,single,appears_on&market=${SPOTIFY_MARKET}&limit=50`,
    token,
  );

  const albumMap = new Map();
  for (const album of albums) {
    if (!albumMap.has(album.id)) albumMap.set(album.id, album);
  }

  const allTracks = [];
  const releaseBuilders = [];

  for (const album of albumMap.values()) {
    const tracks = await fetchAllPages(
      `/albums/${album.id}/tracks?market=${SPOTIFY_MARKET}&limit=50`,
      token,
    );

    const albumArtistIds = album.artists.map((a) => a.id);
    const isPrimaryArtist = albumArtistIds.includes(ARTIST_ID);
    const albumGroup = album.album_group || album.album_type;
    const albumImage = pickImage(album.images);
    const validTrackIds = [];

    for (const track of tracks) {
      const artistIds = track.artists.map((a) => a.id);
      if (!artistIds.includes(ARTIST_ID)) continue;

      const isFeature =
        albumGroup === "appears_on" ||
        !isPrimaryArtist ||
        artistIds[0] !== ARTIST_ID;

      allTracks.push({
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
      });
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
  const primaryReleases = [];
  const featuredReleases = [];

  for (const item of releaseBuilders) {
    const trackIds = item.trackIds.filter((id) => trackIdSet.has(id));
    if (trackIds.length === 0) continue;

    const release = {
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

  const sortNewest = (list) =>
    [...list].sort((a, b) =>
      releaseDateSortKey(b.releaseDate, b.releaseDatePrecision).localeCompare(
        releaseDateSortKey(a.releaseDate, a.releaseDatePrecision),
      ),
    );

  const payload = {
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

  if (payload.artistId !== ARTIST_ID || payload.artist.id !== ARTIST_ID) {
    console.error("Spotify artist identity mismatch");
    process.exit(1);
  }

  return payload;
}

async function main() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required for generate:spotify",
    );
    process.exit(1);
  }

  console.log(`Generating Spotify data for artist ${ARTIST_ID}...`);
  const payload = await buildPayload(clientId, clientSecret);

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  const json = JSON.stringify(payload, null, 2);

  if (
    json.includes(clientId) ||
    json.includes(clientSecret) ||
    /client_secret/i.test(json)
  ) {
    console.error("Refusing to write output that appears to contain secrets");
    process.exit(1);
  }

  await writeFile(OUT_FILE, `${json}\n`, "utf8");
  console.log(`Wrote ${OUT_FILE}`);
  console.log(
    `Releases: ${payload.primaryReleases.length} primary, ${payload.featuredReleases.length} featured, ${payload.tracks.length} tracks`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
