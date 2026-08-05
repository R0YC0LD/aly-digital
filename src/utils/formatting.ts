export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatReleaseDate(
  date: string,
  precision: string = "day",
): string {
  if (!date) return "";

  if (precision === "year" || date.length === 4) {
    return date.slice(0, 4);
  }

  if (precision === "month" || date.length === 7) {
    const [y, m] = date.split("-");
    return `${m}.${y}`;
  }

  const [y, m, d] = date.split("-");
  if (!y || !m || !d) return date;
  return `${d}.${m}.${y}`;
}

export function releaseYear(date: string): string {
  return date?.slice(0, 4) || "";
}

/** Sort key that handles year / month / day precision */
export function releaseDateSortKey(
  date: string,
  precision: string = "day",
): string {
  if (!date) return "0000-00-00";
  if (precision === "year" || date.length === 4) return `${date}-01-01`;
  if (precision === "month" || date.length === 7) return `${date}-01`;
  return date;
}

export function albumTypeLabel(albumType: string, albumGroup?: string): string {
  const type = (albumType || "").toLowerCase();
  const group = (albumGroup || "").toLowerCase();

  if (group === "appears_on") return "Yer Aldığı Yayın";
  if (type === "album") return "Albüm";
  if (type === "single") return "Tekli";
  if (type === "compilation") return "Derleme";
  if (type === "ep") return "EP";
  return albumType || "Yayın";
}

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.replace(/^\//, "");
  return `${normalizedBase}${normalizedPath}`;
}
