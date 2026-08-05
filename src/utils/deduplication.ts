import type { NormalizedRelease, NormalizedTrack } from "@/types/spotify";

export function dedupeReleasesById(releases: NormalizedRelease[]): NormalizedRelease[] {
  const map = new Map<string, NormalizedRelease>();
  for (const release of releases) {
    if (!map.has(release.id)) {
      map.set(release.id, release);
    }
  }
  return Array.from(map.values());
}

/**
 * Primary key: Spotify track ID.
 * Secondary: linked_from.id or ISRC when present (same recording across releases).
 */
export function dedupeTracks(tracks: NormalizedTrack[]): NormalizedTrack[] {
  const byId = new Map<string, NormalizedTrack>();
  const secondaryKeys = new Set<string>();

  for (const track of tracks) {
    if (byId.has(track.id)) continue;

    const secondary =
      track.linkedFromId || (track.isrc ? `isrc:${track.isrc}` : null);

    if (secondary && secondaryKeys.has(secondary)) continue;

    byId.set(track.id, track);
    if (secondary) secondaryKeys.add(secondary);
  }

  return Array.from(byId.values());
}

export function dedupeByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}
