# ALY — Dijital Arşiv

Spotify artist ID `2pwxA6FXPCRje8le8719pQ` üzerinden doğrulanmış, production-ready tek sayfa sanatçı sitesi.

> Bu proje varsayılan olarak **resmî site değildir** (`VITE_SITE_IS_OFFICIAL=false`). Metadata içinde “resmî” ifadesi kullanılmaz.

## Mimari özet

- **Frontend:** React + Vite + TypeScript + GSAP ScrollTrigger + CSS Modules
- **Vercel:** `/api/spotify` serverless fonksiyonu Client Credentials ile token alır, veriyi normalize eder
- **GitHub Pages:** `scripts/generate-spotify-data.mjs` build sırasında `public/data/spotify.json` üretir
- **Kimlik kuralı:** Hiçbir yerde Spotify Search kullanılmaz. Tüm veri doğrudan artist ID üzerinden gelir; track `artists` dizisinde ID yoksa parça gösterilmez

## Klasör yapısı

```text
/
├── api/
│   ├── spotify.ts
│   └── _lib/spotify.ts
├── public/
│   ├── data/spotify.json
│   ├── media/aly/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/generate-spotify-data.mjs
├── src/
│   ├── components/
│   ├── sections/
│   ├── config/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── styles/
├── .github/workflows/deploy-pages.yml
├── .env.example
├── vercel.json
└── README.md
```

## Gereksinimler

- Node.js 20+ (önerilen: 22)
- npm 10+
- Spotify Developer App (Client ID + Client Secret)

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` örneği:

```env
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
VITE_DATA_MODE=api
VITE_SITE_URL=http://localhost:5173
VITE_BASE_PATH=/
VITE_SITE_IS_OFFICIAL=false
```

**Önemli:** `SPOTIFY_CLIENT_SECRET` asla `VITE_` ile başlatılmaz, frontend’e gömülmez, `localStorage`’a yazılmaz ve Git’e commit edilmez.

## Spotify Developer App

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) → Create App
2. App adı: örn. `ALY Digital Archive`
3. **Client ID** ve **Client Secret** değerlerini kopyala
4. Bu proje **Client Credentials** kullanır (kullanıcı login’i yok)
5. Redirect URI zorunlu değil; Dashboard’da istenirse `http://localhost:5173` ekleyebilirsin

### Hata kodları

| Kod | Anlamı | Ne yapmalı |
|-----|--------|------------|
| 401 | Geçersiz kimlik bilgisi | Client ID/Secret kontrol et |
| 403 | Yetki / app kısıtı | Dashboard ayarlarını ve app durumunu kontrol et |
| 429 | Rate limit | `Retry-After` beklenir; sonsuz retry yok. İstek sıklığını düşür |

## Local development

### A) Statik veri ile (en kolay)

```bash
npm run generate:spotify
```

`.env` içinde:

```env
VITE_DATA_MODE=static
```

Sonra:

```bash
npm run dev
```

### B) Vercel API ile

```bash
npm i -g vercel
vercel env pull
vercel dev
```

veya Vercel’e deploy edip production URL üzerinden test et.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Vercel deploy (önerilen)

1. Repo’yu Vercel’e import et
2. Environment Variables ekle:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `VITE_DATA_MODE=api`
   - `VITE_SITE_URL=https://senin-domainin.com`
   - `VITE_BASE_PATH=/`
   - `VITE_SITE_IS_OFFICIAL=false`
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output: `dist`
6. Deploy

API cache:

`Cache-Control: public, s-maxage=21600, stale-while-revalidate=86400`

## GitHub Pages deploy

1. Repository → Settings → Pages → Source: **GitHub Actions**
2. Secrets → Actions:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
3. (Opsiyonel) Variables:
   - `VITE_BASE_PATH=/aly-digital/` (repo adına göre)
   - `VITE_SITE_URL=https://kullaniciadi.github.io/aly-digital`
   - `VITE_SITE_IS_OFFICIAL=false`
4. `main` push, `workflow_dispatch` veya günlük schedule workflow’u tetikler
5. Workflow: `.github/workflows/deploy-pages.yml`

### Base path

GitHub Pages alt yolu için:

```env
VITE_BASE_PATH=/aly-digital/
```

Asset yolları `import.meta.env.BASE_URL` / `assetUrl()` ile üretilir. Hardcoded `/assets/...` kullanılmaz.

### Manuel workflow

GitHub → Actions → **Deploy GitHub Pages** → Run workflow

## Promo görselleri

Klasör: `public/media/aly/`

Mevcut proje görselleri buraya kopyalandı:

- `aly-01.jpg` … `aly-07.jpg`
- `aly-08.webp`
- `aly-profile.webp`

Yeni görsel eklerken WebP tercih edin. Görsel yoksa tipografik placeholder kullanılır; başka sanatçı fotoğrafı veya AI portre eklenmez.

## Sosyal bağlantılar

`src/config/socialLinks.ts`

URL boşsa ikon render edilmez. Doğrulanmamış hesap için sahte URL yazmayın.

Spotify linki sabittir:

`https://open.spotify.com/intl-tr/artist/2pwxA6FXPCRje8le8719pQ`

## Öne çıkan parçalar (opsiyonel)

`src/config/featuredTracks.ts` içine Spotify track ID listesi ekleyebilirsiniz. Listedeki parça yine de `artistIds` içinde `2pwxA6FXPCRje8le8719pQ` içermiyorsa gösterilmez.

## Spotify veri güncelleme

- **Vercel:** API cache süresi dolunca / redeploy ile yenilenir
- **GitHub Pages:** günlük schedule veya manuel workflow
- Local: `npm run generate:spotify`

## Secret güvenliği

- Secrets yalnızca server / CI build ortamında
- `public/data/spotify.json` ve `dist` çıktısında secret aranır; bulunursa build fail olur
- `.env` gitignore’dadır

## Spotify attribution

Albüm kapakları orijinal kare oranında (`object-fit: contain`) gösterilir. Her Spotify içeriğinde “Spotify’da aç” bağlantısı ve attribution metni bulunur. Preview URL yoksa play butonu gösterilmez. Otomatik müzik başlatılmaz.

## Custom domain

### Vercel

Project → Settings → Domains → domain ekle → DNS kaydı uygula → `VITE_SITE_URL` güncelle

### GitHub Pages

Repository Settings → Pages → Custom domain → DNS `CNAME` / A kaydı → `VITE_SITE_URL` ve gerekirse `VITE_BASE_PATH=/` ayarla

## Kabul kriterleri (test)

```bash
npm test
```

Kapsanan senaryolar:

1. Yanlış artist ID reddedilir
2. İsmi ALY ama ID farklı sanatçı reddedilir
3. Compilation’da ALY’siz parçalar düşer
4. `artistIds` içinde ID varsa parça kabul edilir
5. Aynı album ID tekilleşir
6. Aynı track ID tekilleşir
7. API fail olunca uygulama çökmez (error state)
8. `previewUrl` null ise play verisi yok
9. Base path `assetUrl` ile korunur
10. Reduced motion’da içerik görünür kalır (CSS/JS fallback)
11. Promo yoksa başka sanatçı fotoğrafı kullanılmaz
12. Boş sosyal URL ikon render etmez

## Lisans / not

Spotify verileri Spotify Web API kullanım şartlarına tabidir. Spotify bir ticari markadır. Bu site sanatçı tarafından onaylanmadıysa “resmî site” olarak sunulmamalıdır.
