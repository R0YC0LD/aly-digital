import { assetUrl } from "@/utils/formatting";

export type PromoAsset = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  side: "left" | "right";
  /** CSS treatment class suffix for visual variety */
  treatment?: "raw" | "cool" | "warm" | "grain" | "lift";
};

/**
 * Promo görselleri — yalnızca public/media/aly altındaki dosyalar.
 * Spotify kapakları burada kullanılmaz.
 * Kaynak: kullanıcının sağladığı ALY görsellerinden türetilmiş crop/tone varyantları.
 */
export const PROMO_ASSETS: PromoAsset[] = [
  {
    id: "aly-01",
    src: "media/aly/aly-01.webp",
    alt: "ALY tanıtım görseli",
    width: 1200,
    height: 1500,
    side: "left",
    treatment: "raw",
  },
  {
    id: "aly-02",
    src: "media/aly/aly-02.webp",
    alt: "ALY tanıtım görseli",
    width: 1200,
    height: 1500,
    side: "right",
    treatment: "cool",
  },
  {
    id: "aly-03",
    src: "media/aly/aly-03.webp",
    alt: "ALY tanıtım görseli",
    width: 1200,
    height: 1500,
    side: "left",
    treatment: "grain",
  },
  {
    id: "aly-04",
    src: "media/aly/aly-04.webp",
    alt: "ALY tanıtım görseli — yakın plan",
    width: 1200,
    height: 1500,
    side: "right",
    treatment: "lift",
  },
  {
    id: "aly-05",
    src: "media/aly/aly-05.webp",
    alt: "ALY tanıtım görseli",
    width: 1200,
    height: 1500,
    side: "left",
    treatment: "warm",
  },
  {
    id: "aly-05-tone",
    src: "media/aly/aly-05-tone.webp",
    alt: "ALY tanıtım görseli — ton varyasyonu",
    width: 1200,
    height: 1500,
    side: "right",
    treatment: "cool",
  },
  {
    id: "aly-06",
    src: "media/aly/aly-06.webp",
    alt: "ALY tanıtım görseli",
    width: 1200,
    height: 1500,
    side: "left",
    treatment: "grain",
  },
  {
    id: "aly-07",
    src: "media/aly/aly-07.webp",
    alt: "ALY profil karesi",
    width: 1000,
    height: 1250,
    side: "right",
    treatment: "lift",
  },
  {
    id: "aly-08",
    src: "media/aly/aly-08.webp",
    alt: "ALY tanıtım görseli",
    width: 1200,
    height: 1500,
    side: "left",
    treatment: "raw",
  },
];

export const HERO_PROFILE_SRC = "media/aly/aly-profile.webp";
export const HERO_BG_SRC = "media/aly/aly-hero.webp";
export const INSTAGRAM_URL = "https://www.instagram.com/alykilla/";

export function promoSrc(relativePath: string): string {
  return assetUrl(relativePath);
}

/** Check if a promo image loads; used to fall back to typographic placeholder */
export function probeImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
