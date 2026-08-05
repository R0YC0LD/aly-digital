import sharp from "sharp";
import { mkdir, rm, unlink, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "media", "aly");

const sources = {
  a1: path.join(outDir, "aly-01.jpg"),
  a2: path.join(outDir, "aly-02.jpg"),
  a3: path.join(outDir, "aly-03.jpg"),
  profile: path.join(outDir, "aly-profile.webp"),
};

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function writeWebp(pipeline, filename, quality = 82) {
  const dest = path.join(outDir, filename);
  await pipeline.webp({ quality, effort: 5 }).toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(`wrote ${filename} (${meta.width}x${meta.height})`);
  return dest;
}

async function main() {
  for (const [key, p] of Object.entries(sources)) {
    if (!(await exists(p))) {
      throw new Error(`Missing source: ${key} -> ${p}`);
    }
  }

  await mkdir(outDir, { recursive: true });

  // Optimized full-frame webps of unique sources
  await writeWebp(sharp(sources.a1).rotate().resize({ width: 1600, withoutEnlargement: true }), "aly-01.webp");
  await writeWebp(sharp(sources.a2).rotate().resize({ width: 1600, withoutEnlargement: true }), "aly-02.webp");
  await writeWebp(sharp(sources.a3).rotate().resize({ width: 1600, withoutEnlargement: true }), "aly-03.webp");

  // aly-04: aly-01 crop top (portrait)
  await writeWebp(
    sharp(sources.a1)
      .rotate()
      .resize(1200, 1500, { fit: "cover", position: "top" }),
    "aly-04.webp"
  );

  // aly-05: aly-02 crop center
  await writeWebp(
    sharp(sources.a2)
      .rotate()
      .resize(1200, 1500, { fit: "cover", position: "centre" }),
    "aly-05.webp"
  );

  // aly-06: aly-03 crop bottom / right-ish
  await writeWebp(
    sharp(sources.a3)
      .rotate()
      .resize(1200, 1500, { fit: "cover", position: "right bottom" }),
    "aly-06.webp"
  );

  // aly-07: profile enlarged / portrait crop
  await writeWebp(
    sharp(sources.profile)
      .rotate()
      .resize(1000, 1250, { fit: "cover", position: "centre" })
      .modulate({ brightness: 1.02, saturation: 0.95 }),
    "aly-07.webp",
    85
  );

  // aly-08: aly-01 alternate crop (left, slight contrast)
  await writeWebp(
    sharp(sources.a1)
      .rotate()
      .resize(1100, 1400, { fit: "cover", position: "left" })
      .normalize()
      .modulate({ saturation: 0.85 }),
    "aly-08.webp"
  );

  // aly-hero: wide crop from aly-01 for hero background
  await writeWebp(
    sharp(sources.a1)
      .rotate()
      .resize(2400, 1350, { fit: "cover", position: "centre" })
      .modulate({ brightness: 0.92, saturation: 0.9 }),
    "aly-hero.webp",
    80
  );

  // Optional journey diversity: soft grayscale from aly-02
  await writeWebp(
    sharp(sources.a2)
      .rotate()
      .resize(1200, 1500, { fit: "cover", position: "attention" })
      .greyscale()
      .modulate({ brightness: 1.05 }),
    "aly-05-tone.webp",
    80
  );

  // Cleanup tiny useless ig asset + empty ig folder
  const tinyIg = path.join(outDir, "aly-ig-01.jpg");
  if (await exists(tinyIg)) {
    await unlink(tinyIg);
    console.log("deleted aly-ig-01.jpg");
  }
  const igDir = path.join(outDir, "ig");
  if (await exists(igDir)) {
    await rm(igDir, { recursive: true, force: true });
    console.log("removed ig folder");
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
