export type SocialLink = {
  id: string;
  label: string;
  /** Boş bırakılırsa UI'da render edilmez */
  url: string;
};

/**
 * Doğrulanmamış hesaplar için URL uydurma.
 * URL boşsa ilgili ikon görünmez.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "spotify",
    label: "Spotify",
    url: "https://open.spotify.com/intl-tr/artist/2pwxA6FXPCRje8le8719pQ",
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/alykilla/",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "",
  },
  {
    id: "tiktok",
    label: "TikTok",
    url: "",
  },
  {
    id: "x",
    label: "X",
    url: "",
  },
];

export function getVisibleSocialLinks(): SocialLink[] {
  return socialLinks.filter((link) => Boolean(link.url?.trim()));
}
