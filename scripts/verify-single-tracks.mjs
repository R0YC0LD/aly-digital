import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.join(ROOT, "data", "generated", "spotify-single-tracks.json");
const TARGET = "2pwxA6FXPCRje8le8719pQ";

async function main() {
  let raw;
  try {
    raw = await readFile(FILE, "utf8");
  } catch {
    console.warn("[verify-single-tracks] missing file — skip");
    return;
  }

  const data = JSON.parse(raw);
  const tracks = data.tracks || [];
  const errors = [];
  const ids = new Set();

  if (data.targetArtistId && data.targetArtistId !== TARGET) {
    errors.push(`targetArtistId mismatch`);
  }

  for (const t of tracks) {
    const id = t.spotifyId || t.id;
    if (!id) errors.push(`missing id ${t.name}`);
    if (ids.has(id)) errors.push(`duplicate ${id}`);
    ids.add(id);
    if (t.uri !== `spotify:track:${id}`) errors.push(`bad uri ${id}`);
    if (!String(t.spotifyUrl || "").includes(`/track/${id}`)) errors.push(`bad url ${id}`);
    if (String(t.spotifyUrl || "").includes("/search/")) errors.push(`search ${id}`);
    if (!t.targetArtistIsPrimary) errors.push(`not primary ${id}`);
    if (!Array.isArray(t.artists) || t.artists[0]?.id !== TARGET) {
      errors.push(`artists primary missing ${id}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        verifiedTracks: tracks.length,
        targetArtistId: TARGET,
        errors: errors.length,
      },
      null,
      2,
    ),
  );

  if (errors.length) {
    console.error("[verify-single-tracks] FAILED");
    for (const e of errors.slice(0, 40)) console.error(" -", e);
    process.exit(1);
  }

  console.log(`[verify-single-tracks] OK — ${tracks.length} tracks`);
}

main();
