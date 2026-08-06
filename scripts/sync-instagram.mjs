import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "generated", "instagram-media.json");

async function writeFallback(reason) {
  const payload = {
    schemaVersion: 1,
    source: "fallback",
    verified: false,
    username: null,
    profileUrl: null,
    generatedAt: new Date().toISOString(),
    items: [],
    counts: { total: 0 },
    note: reason,
  };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.warn(`[sync-instagram] Wrote safe empty fallback (${reason})`);
}

async function fetchOfficial() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  if (!token || !userId) return null;

  const url = new URL(`https://graph.facebook.com/v19.0/${userId}/media`);
  url.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp");
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "24");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`instagram_${res.status}`);
  const data = await res.json();
  const items = (data.data || []).map((item) => ({
    id: item.id,
    caption: item.caption || "",
    mediaType: item.media_type,
    mediaUrl: item.media_url || item.thumbnail_url || null,
    permalink: item.permalink || null,
    timestamp: item.timestamp || null,
  }));

  return {
    schemaVersion: 1,
    source: "instagram-graph",
    verified: true,
    username: process.env.INSTAGRAM_USERNAME || null,
    profileUrl: process.env.INSTAGRAM_USERNAME
      ? `https://www.instagram.com/${process.env.INSTAGRAM_USERNAME}/`
      : null,
    generatedAt: new Date().toISOString(),
    items,
    counts: { total: items.length },
  };
}

async function main() {
  try {
    const official = await fetchOfficial();
    if (!official) {
      await writeFallback("missing-instagram-env");
      process.exitCode = 0;
      return;
    }
    await mkdir(path.dirname(OUT), { recursive: true });
    await writeFile(OUT, `${JSON.stringify(official, null, 2)}\n`, "utf8");
    console.log(`[sync-instagram] Wrote ${official.counts.total} items`);
  } catch (error) {
    console.error("[sync-instagram] Failed:", error.message);
    await writeFallback(`sync-failed:${error.message}`);
    process.exitCode = 0;
  }
}

main();
