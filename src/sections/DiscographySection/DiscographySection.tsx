import { useMemo, useState } from "react";
import type { NormalizedRelease, SpotifyPayload } from "@/types/spotify";
import { ReleaseCard } from "@/components/ReleaseCard/ReleaseCard";
import { ReleaseModal } from "@/components/ReleaseModal/ReleaseModal";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { SPOTIFY_ARTIST_URL } from "@/config/artist";
import styles from "./DiscographySection.module.css";

type Tab = "all" | "album" | "single" | "appears_on";

type Props = {
  loading: boolean;
  error?: string;
  data?: SpotifyPayload | null;
};

export function DiscographySection({ loading, error, data }: Props) {
  const [tab, setTab] = useState<Tab>("all");
  const [active, setActive] = useState<NormalizedRelease | null>(null);

  const releases = useMemo(() => {
    if (!data) return [];
    const all = [...data.primaryReleases, ...data.featuredReleases];
    return all.filter((release) => {
      if (tab === "all") return true;
      if (tab === "appears_on") {
        return (
          release.albumGroup === "appears_on" ||
          data.featuredReleases.some((r) => r.id === release.id)
        );
      }
      if (tab === "album") {
        return release.albumType === "album" && release.albumGroup !== "appears_on";
      }
      if (tab === "single") {
        return release.albumType === "single" && release.albumGroup !== "appears_on";
      }
      return true;
    });
  }, [data, tab]);

  return (
    <section id="discography" className="section" aria-labelledby="disco-title">
      <div className="container">
        <p className="section-label">05 / Diskografi</p>
        <h2
          id="disco-title"
          className="display"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", margin: "0 0 1.25rem" }}
        >
          Diskografi
        </h2>

        <div className={styles.tabs} role="tablist" aria-label="Diskografi filtreleri">
          {(
            [
              ["all", "Tümü"],
              ["album", "Albümler"],
              ["single", "Tekliler"],
              ["appears_on", "Yer Aldığı Yayınlar"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? <p className="muted">Yükleniyor…</p> : null}
        {!loading && error ? (
          <ErrorState message={error} spotifyUrl={SPOTIFY_ARTIST_URL} />
        ) : null}
        {!loading && !error && releases.length === 0 ? (
          <p className="muted">Bu sekmede gösterilecek yayın yok.</p>
        ) : null}

        {!loading && !error && releases.length > 0 ? (
          <div className={styles.grid}>
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} onOpen={setActive} />
            ))}
          </div>
        ) : null}
      </div>

      <ReleaseModal
        release={active}
        tracks={data?.tracks ?? []}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
