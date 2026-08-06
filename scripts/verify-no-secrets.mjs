import { readFile } from "node:fs/promises";
import path from "node:path";
import { readdir } from "node:fs/promises";

const ROOT = process.cwd();
const SECRET_PATTERNS = [
  /SPOTIFY_CLIENT_SECRET\s*=\s*["']?[^\s"']{8,}/i,
  /INSTAGRAM_ACCESS_TOKEN\s*=\s*["']?[^\s"']{8,}/i,
  /-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----/,
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".vercel",
  "dist",
  "coverage",
]);

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, acc);
    } else if (/\.(ts|tsx|js|mjs|json|md|yml|yaml|css|txt|example)$/i.test(entry.name)) {
      if (entry.name === ".env" || entry.name === ".env.local") continue;
      acc.push(full);
    }
  }
  return acc;
}

async function main() {
  const files = await walk(ROOT);
  const hits = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith(".env")) continue;
    const text = await readFile(file, "utf8");
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        hits.push(rel);
        break;
      }
    }
  }

  if (hits.length) {
    console.error("[verify-no-secrets] FAILED — possible secrets in:");
    for (const h of hits.slice(0, 40)) console.error(" -", h);
    process.exit(1);
  }

  console.log(`[verify-no-secrets] OK — scanned ${files.length} files`);
}

main();
