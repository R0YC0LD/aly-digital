import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/data/site";

const ROOT = process.cwd();
const TARGET = "2pwxA6FXPCRje8le8719pQ";

describe("ALY identity", () => {
  it("uses ALY target artist id everywhere in site config", () => {
    expect(siteConfig.targetArtistId).toBe(TARGET);
    expect(siteConfig.spotify.artistId).toBe(TARGET);
    expect(siteConfig.artistName).toBe("ALY");
    expect(siteConfig.links.spotifyArtist).toContain(TARGET);
    expect(siteConfig.links.instagram).toBeNull();
    expect(siteConfig.tickets.url).toBeNull();
  });

  it("keeps Instagram unverified until audit allows it", () => {
    const audit = JSON.parse(
      readFileSync(path.join(ROOT, "data/identity-audit.json"), "utf8"),
    );
    expect(audit.targetArtistId).toBe(TARGET);
    expect(audit.instagram.setInSiteConfig).toBe(false);
    expect(siteConfig.instagram.url).toBeNull();
  });

  it("ships empty valid generated catalogs for ALY", () => {
    const catalog = JSON.parse(
      readFileSync(path.join(ROOT, "data/generated/spotify-catalog.json"), "utf8"),
    );
    const singles = JSON.parse(
      readFileSync(path.join(ROOT, "data/generated/spotify-single-tracks.json"), "utf8"),
    );
    const ig = JSON.parse(
      readFileSync(path.join(ROOT, "data/generated/instagram-media.json"), "utf8"),
    );

    expect(catalog.targetArtistId).toBe(TARGET);
    expect(catalog.schemaVersion).toBeGreaterThanOrEqual(4);
    expect(Array.isArray(catalog.releases)).toBe(true);
    expect(singles.targetArtistId).toBe(TARGET);
    expect(ig.verified).toBe(false);
  });

  it("does not hardcode Şehinşah artist id in site config", () => {
    expect(JSON.stringify(siteConfig)).not.toContain("0FUsrstJwmg4WVHQMTYuUA");
  });
});
