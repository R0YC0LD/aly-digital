import { PlatformLink, type PlatformLinkItem } from "@/components/platforms/PlatformLink";
import type { PlatformIconName } from "@/components/platforms/BrandIcon";
import { siteConfig } from "@/data/site";
import styles from "./PlatformLinks.module.css";

const candidates: PlatformLinkItem[] = [
  {
    id: "spotify",
    label: "Spotify",
    href: siteConfig.links.spotifyArtist,
    icon: "spotify" as PlatformIconName,
    analyticsEvent: "spotify_artist_open",
  },
  {
    id: "appleMusic",
    label: "Apple Music",
    href: siteConfig.links.appleMusicArtist || "",
    icon: "appleMusic" as PlatformIconName,
    analyticsEvent: "apple_music_open",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: siteConfig.links.youtube || "",
    icon: "youtube" as PlatformIconName,
    analyticsEvent: "youtube_open",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: siteConfig.links.tiktok || "",
    icon: "tiktok" as PlatformIconName,
    analyticsEvent: "tiktok_open",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: siteConfig.links.instagram || "",
    icon: "instagram" as PlatformIconName,
    analyticsEvent: "instagram_open",
  },
];

export const allPlatforms: PlatformLinkItem[] = candidates.filter((p) => Boolean(p.href));

type Variant = "all" | "listen" | "social";

const sets: Record<Variant, string[]> = {
  all: ["spotify", "appleMusic", "youtube", "tiktok", "instagram"],
  listen: ["spotify", "appleMusic", "youtube"],
  social: ["instagram", "tiktok", "youtube"],
};

type Props = {
  variant?: Variant;
  showLabels?: boolean;
  placement?: string;
  className?: string;
};

export function PlatformLinks({
  variant = "all",
  showLabels = false,
  placement = "menu",
  className = "",
}: Props) {
  const ids = new Set(sets[variant]);
  const items = allPlatforms.filter((p) => ids.has(p.id));

  if (!items.length) return null;

  return (
    <div className={`${styles.row} ${className}`.trim()} role="list" aria-label="Platform bağlantıları">
      {items.map((item) => (
        <div key={item.id} role="listitem">
          <PlatformLink item={item} showLabel={showLabels} placement={placement} />
        </div>
      ))}
    </div>
  );
}
