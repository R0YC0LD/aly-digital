export const ARTIST_ID = "2pwxA6FXPCRje8le8719pQ";
export const EXPECTED_ARTIST_NAME = "ALY";
export const SPOTIFY_MARKET = "TR";

export const SPOTIFY_ARTIST_URL =
  "https://open.spotify.com/intl-tr/artist/2pwxA6FXPCRje8le8719pQ";

export const SITE_IS_OFFICIAL =
  (import.meta.env.VITE_SITE_IS_OFFICIAL ?? "false").toLowerCase() === "true";

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(
  /\/$/,
  "",
);

export const SITE_TITLE = SITE_IS_OFFICIAL
  ? "ALY — Resmî Dijital Arşiv"
  : "ALY — Dijital Arşiv";

export const SITE_DESCRIPTION =
  "ALY dijital arşivi — doğrulanmış Spotify diskografisi, yayınlar ve parçalar.";

export const CREDIT_LINE = "Tasarım & geliştirme";
