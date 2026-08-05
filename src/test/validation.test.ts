import { describe, expect, it, vi } from "vitest";
import { ARTIST_ID } from "@/config/artist";
import {
  assertArtistIdentity,
  filterTracksByArtistId,
  isValidSpotifyPayload,
  trackIncludesArtist,
} from "@/utils/validation";
import { dedupeReleasesById, dedupeTracks } from "@/utils/deduplication";
import type { NormalizedRelease, NormalizedTrack, SpotifyPayload } from "@/types/spotify";
import { getVisibleSocialLinks, socialLinks } from "@/config/socialLinks";

function track(partial: Partial<NormalizedTrack> & { id: string }): NormalizedTrack {
  return {
    name: "Test",
    durationMs: 120000,
    explicit: false,
    externalUrl: "https://open.spotify.com/track/" + partial.id,
    previewUrl: null,
    albumId: "album1",
    albumName: "Album",
    albumImage: null,
    releaseDate: "2024-01-01",
    artistIds: [ARTIST_ID],
    artistNames: ["ALY"],
    trackNumber: 1,
    discNumber: 1,
    isFeature: false,
    ...partial,
  };
}

describe("artist identity", () => {
  it("rejects wrong artist id", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      assertArtistIdentity({
        id: "wrong-id",
        type: "artist",
        name: "ALY",
      }),
    ).toThrow(/identity mismatch/i);
    spy.mockRestore();
  });

  it("rejects same-name artist with different id", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      assertArtistIdentity({
        id: "aaaaaaaaaaaaaaaaaaaaaa",
        type: "artist",
        name: "ALY",
      }),
    ).toThrow(/identity mismatch/i);
    spy.mockRestore();
  });

  it("accepts exact artist id", () => {
    expect(() =>
      assertArtistIdentity({
        id: ARTIST_ID,
        type: "artist",
        name: "ALY",
      }),
    ).not.toThrow();
  });
});

describe("track filtering", () => {
  it("removes compilation tracks without ARTIST_ID", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = filterTracksByArtistId([
      track({ id: "1", artistIds: [ARTIST_ID] }),
      track({ id: "2", artistIds: ["other"], name: "Other Song" }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
    spy.mockRestore();
  });

  it("accepts tracks that include ARTIST_ID", () => {
    expect(
      trackIncludesArtist(["x", ARTIST_ID, "y"]),
    ).toBe(true);
  });
});

describe("deduplication", () => {
  it("keeps one release per album id", () => {
    const releases = [
      { id: "a1", name: "One" },
      { id: "a1", name: "One Dup" },
      { id: "a2", name: "Two" },
    ] as NormalizedRelease[];
    expect(dedupeReleasesById(releases)).toHaveLength(2);
  });

  it("keeps one track per track id", () => {
    const tracks = [
      track({ id: "t1" }),
      track({ id: "t1", albumName: "Other" }),
      track({ id: "t2" }),
    ];
    expect(dedupeTracks(tracks)).toHaveLength(2);
  });
});

describe("payload validation", () => {
  it("rejects payload with mismatched artistId", () => {
    const payload = {
      artistId: "wrong",
      artist: { id: "wrong", name: "ALY", externalUrl: "", images: [] },
      primaryReleases: [],
      featuredReleases: [],
      tracks: [],
      generatedAt: new Date().toISOString(),
      market: "TR",
    } satisfies SpotifyPayload;
    expect(isValidSpotifyPayload(payload)).toBe(false);
  });

  it("rejects tracks missing ARTIST_ID", () => {
    const payload = {
      artistId: ARTIST_ID,
      artist: { id: ARTIST_ID, name: "ALY", externalUrl: "", images: [] },
      primaryReleases: [],
      featuredReleases: [],
      tracks: [track({ id: "t1", artistIds: ["someone-else"] })],
      generatedAt: new Date().toISOString(),
      market: "TR",
    } satisfies SpotifyPayload;
    expect(isValidSpotifyPayload(payload)).toBe(false);
  });
});

describe("preview and social rules", () => {
  it("previewUrl null means no play affordance data", () => {
    const t = track({ id: "p1", previewUrl: null });
    expect(t.previewUrl).toBeNull();
  });

  it("hides social icons when url empty", () => {
    const empty = socialLinks.filter((l) => !l.url.trim());
    expect(empty.length).toBeGreaterThan(0);
    const visible = getVisibleSocialLinks();
    expect(visible.every((l) => Boolean(l.url.trim()))).toBe(true);
    expect(visible.find((l) => l.id === "instagram")).toBeUndefined();
  });
});
