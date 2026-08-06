# ALY — Dijital Evren

Production-ready Next.js site for ALY (`aly-dijital-evren`).

**Primary target:** Vercel (`aly-digital`)  
Spotify artist: `2pwxA6FXPCRje8le8719pQ`  
Cache tag: `spotify-aly-catalog-v1`

## Scripts

```bash
npm install
npm run sync:spotify
npm run sync:instagram
npm run verify:spotify
npm run verify:instagram
npm run verify:secrets
npm run typecheck
npm run lint
npm test
npm run build
```

## Env

Copy `.env.example` → `.env.local`. Never commit secrets. Spotify/Instagram credentials are server-only.

## Identity

- Instagram stays `null` until `data/identity-audit.json` marks verification and sync confirms.
- Visual journey uses local `public/media/aly/*` assets.
