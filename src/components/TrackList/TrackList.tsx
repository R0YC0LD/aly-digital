import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { NormalizedTrack } from "@/types/spotify";
import { ARTIST_ID } from "@/config/artist";
import { formatDuration, releaseYear } from "@/utils/formatting";
import styles from "./TrackList.module.css";

type Props = {
  tracks: NormalizedTrack[];
};

type SortMode = "newest" | "oldest";
type FeatureFilter = "all" | "solo" | "feature";

export function TrackList({ tracks }: Props) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [feature, setFeature] = useState<FeatureFilter>("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const safeTracks = useMemo(
    () => tracks.filter((track) => track.artistIds.includes(ARTIST_ID)),
    [tracks],
  );

  const years = useMemo(() => {
    const set = new Set(safeTracks.map((t) => releaseYear(t.releaseDate)).filter(Boolean));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [safeTracks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = safeTracks.filter((track) => {
      if (q && !track.name.toLowerCase().includes(q)) return false;
      if (year !== "all" && releaseYear(track.releaseDate) !== year) return false;
      if (feature === "solo" && track.isFeature) return false;
      if (feature === "feature" && !track.isFeature) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const cmp = b.releaseDate.localeCompare(a.releaseDate);
      return sort === "newest" ? cmp : -cmp;
    });

    return list;
  }, [safeTracks, query, year, feature, sort]);

  return (
    <div>
      <div className={styles.controls}>
        <label className="sr-only" htmlFor="track-search">
          Parça ara
        </label>
        <input
          id="track-search"
          className={styles.field}
          type="search"
          placeholder="Parça adına göre ara"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label className="sr-only" htmlFor="track-year">
          Yıl
        </label>
        <select
          id="track-year"
          className={styles.select}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="all">Tüm yıllar</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="track-feature">
          Solo / Feature
        </label>
        <select
          id="track-feature"
          className={styles.select}
          value={feature}
          onChange={(e) => setFeature(e.target.value as FeatureFilter)}
        >
          <option value="all">Solo & Feature</option>
          <option value="solo">Solo</option>
          <option value="feature">Feature</option>
        </select>

        <label className="sr-only" htmlFor="track-sort">
          Sıralama
        </label>
        <select
          id="track-sort"
          className={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
        >
          <option value="newest">En yeni</option>
          <option value="oldest">En eski</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>Bu filtrelere uyan parça bulunamadı.</p>
      ) : (
        <table className={styles.table}>
          <thead className="sr-only">
            <tr>
              <th>#</th>
              <th>Parça</th>
              <th>Albüm</th>
              <th>Süre</th>
              <th>Yıl</th>
              <th>Spotify</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((track, index) => (
              <tr key={track.id} className={styles.row}>
                <td className="muted">{String(index + 1).padStart(2, "0")}</td>
                <td>
                  <div className={styles.nameCell}>
                    {track.name}
                    {track.explicit ? (
                      <span className={styles.explicit} title="Explicit">
                        E
                      </span>
                    ) : null}
                  </div>
                  <div className={styles.artists}>{track.artistNames.join(", ")}</div>
                </td>
                <td className={`${styles.album} ${styles.hideMobile}`}>{track.albumName}</td>
                <td className="muted">{formatDuration(track.durationMs)}</td>
                <td className={`muted ${styles.hideMobile}`}>
                  {releaseYear(track.releaseDate)}
                </td>
                <td>
                  {track.externalUrl ? (
                    <a
                      className="btn"
                      href={track.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${track.name} Spotify'da aç`}
                      style={{ padding: "0.45rem 0.75rem" }}
                    >
                      Aç
                      <ExternalLink size={14} aria-hidden />
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
