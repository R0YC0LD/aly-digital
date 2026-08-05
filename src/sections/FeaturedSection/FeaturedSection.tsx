import { ExternalLink } from "lucide-react";
import type { SpotifyPayload } from "@/types/spotify";
import { ARTIST_ID, SPOTIFY_ARTIST_URL } from "@/config/artist";
import { albumTypeLabel, releaseYear } from "@/utils/formatting";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import styles from "./FeaturedSection.module.css";

type Props = {
  loading: boolean;
  error?: string;
  data?: SpotifyPayload | null;
};

export function FeaturedSection({ loading, error, data }: Props) {
  const featured = data?.featuredReleases ?? [];

  return (
    <section id="featured" className="section" aria-labelledby="featured-title">
      <div className="container">
        <p className="section-label">07 / Yer Aldığı Yayınlar</p>
        <h2
          id="featured-title"
          className="display"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", margin: "0 0 0.75rem" }}
        >
          Yer Aldığı Yayınlar
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: "1.5rem", maxWidth: "38rem" }}>
          Compilation veya ortak yayınlarda yalnızca ALY&apos;nin artist listesinde
          bulunduğu parçalar gösterilir.
        </p>

        {loading ? <p className="muted">Yükleniyor…</p> : null}
        {!loading && error ? (
          <ErrorState message={error} spotifyUrl={SPOTIFY_ARTIST_URL} />
        ) : null}
        {!loading && !error && featured.length === 0 ? (
          <p className="muted">Henüz doğrulanmış featured yayın yok.</p>
        ) : null}

        {!loading && !error && featured.length > 0 ? (
          <div className={styles.list}>
            {featured.map((release) => {
              const tracks = (data?.tracks ?? []).filter(
                (track) =>
                  release.trackIds.includes(track.id) &&
                  track.artistIds.includes(ARTIST_ID),
              );
              if (tracks.length === 0) return null;

              return (
                <article key={release.id} className={styles.item}>
                  {release.image?.url ? (
                    <img
                      className={styles.cover}
                      src={release.image.url}
                      alt={`${release.name} kapak görseli`}
                      width={release.image.width ?? 300}
                      height={release.image.height ?? 300}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.cover} aria-hidden />
                  )}
                  <div>
                    <h3 className={styles.title}>{release.name}</h3>
                    <p className="muted" style={{ margin: 0 }}>
                      {releaseYear(release.releaseDate)} ·{" "}
                      {albumTypeLabel(release.albumType, release.albumGroup)}
                    </p>
                    <ul className={styles.tracks}>
                      {tracks.map((track) => (
                        <li key={track.id}>
                          <strong>{track.name}</strong>
                          <span className="muted"> — {track.artistNames.join(", ")}</span>
                        </li>
                      ))}
                    </ul>
                    {release.externalUrl ? (
                      <a
                        className="btn btn-spotify"
                        style={{ marginTop: "0.9rem" }}
                        href={release.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Spotify&apos;da aç
                        <ExternalLink size={16} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
