import { assetUrl } from "@/utils/formatting";

export type PromoAsset = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  side: "left" | "right";
};

/**
 * Promo görselleri — yalnızca public/media/aly altındaki dosyalar.
 * Spotify kapakları burada kullanılmaz.
 */
export const PROMO_ASSETS: PromoAsset[] = [
  {
    id: "aly-01",
    src: "media/aly/aly-01.jpg",
    alt: "ALY tanıtım görseli 1",
    width: 1200,
    height: 1500,
    side: "left",
  },
  {
    id: "aly-02",
    src: "media/aly/aly-02.jpg",
    alt: "ALY tanıtım görseli 2",
    width: 1200,
    height: 1500,
    side: "right",
  },
  {
    id: "aly-03",
    src: "media/aly/aly-03.jpg",
    alt: "ALY tanıtım görseli 3",
    width: 1200,
    height: 1500,
    side: "left",
  },
  {
    id: "aly-04",
    src: "media/aly/aly-04.jpg",
    alt: "ALY tanıtım görseli 4",
    width: 1200,
    height: 1500,
    side: "right",
  },
  {
    id: "aly-05",
    src: "media/aly/aly-05.jpg",
    alt: "ALY tanıtım görseli 5",
    width: 1200,
    height: 1500,
    side: "left",
  },
  {
    id: "aly-06",
    src: "media/aly/aly-06.jpg",
    alt: "ALY tanıtım görseli 6",
    width: 1200,
    height: 1500,
    side: "right",
  },
  {
    id: "aly-07",
    src: "media/aly/aly-07.jpg",
    alt: "ALY tanıtım görseli 7",
    width: 1200,
    height: 1500,
    side: "left",
  },
  {
    id: "aly-08",
    src: "media/aly/aly-08.webp",
    alt: "ALY tanıtım görseli 8",
    width: 800,
    height: 800,
    side: "right",
  },
];

export const HERO_PROFILE_SRC = "media/aly/aly-profile.webp";

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
