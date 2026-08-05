import { describe, expect, it } from "vitest";
import { assetUrl, formatDuration, releaseDateSortKey } from "@/utils/formatting";

describe("formatting utilities", () => {
  it("formats duration", () => {
    expect(formatDuration(125000)).toBe("2:05");
  });

  it("builds asset urls with base path", () => {
    const url = assetUrl("data/spotify.json");
    expect(url.endsWith("data/spotify.json")).toBe(true);
    expect(url.includes("//data")).toBe(false);
  });

  it("normalizes release date sort keys by precision", () => {
    expect(releaseDateSortKey("2024", "year")).toBe("2024-01-01");
    expect(releaseDateSortKey("2024-05", "month")).toBe("2024-05-01");
    expect(releaseDateSortKey("2024-05-09", "day")).toBe("2024-05-09");
  });
});
