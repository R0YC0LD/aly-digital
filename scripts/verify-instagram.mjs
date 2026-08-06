import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.join(ROOT, "data", "generated", "instagram-media.json");
const AUDIT = path.join(ROOT, "data", "identity-audit.json");

async function main() {
  const raw = await readFile(FILE, "utf8");
  const data = JSON.parse(raw);
  const audit = JSON.parse(await readFile(AUDIT, "utf8"));
  const errors = [];

  if (data.schemaVersion == null) errors.push("missing schemaVersion");
  if (data.verified === true && (!data.profileUrl || !data.items?.length)) {
    errors.push("verified true but missing profile/items");
  }
  if (data.verified !== true && data.profileUrl) {
    errors.push("unverified payload should not claim profileUrl without API");
  }
  if (audit.instagram?.setInSiteConfig === true && audit.instagram?.status !== "verified") {
    errors.push("identity-audit setInSiteConfig without verified status");
  }

  console.log(
    JSON.stringify(
      {
        verified: Boolean(data.verified),
        items: data.items?.length || 0,
        username: data.username,
        auditStatus: audit.instagram?.status || null,
      },
      null,
      2,
    ),
  );

  if (errors.length) {
    console.error("[verify-instagram] FAILED");
    for (const e of errors) console.error(" -", e);
    process.exit(1);
  }

  console.log("[verify-instagram] OK");
}

main();
