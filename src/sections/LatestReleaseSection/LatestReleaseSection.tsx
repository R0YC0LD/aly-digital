import { ExternalLink } from "lucide-react";
import type { SpotifyPayload } from "@/types/spotify";
import { ARTIST_ID, SPOTIFY_ARTIST_URL } from "@/config/artist";
import {
  albumTypeLabel,
  formatDuration,
  formatReleaseDate,
} from "@/utils/formatting";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { SpotifyAttribution } from "@/components/SpotifyAttribution/SpotifyAttribution";
import styles from "./LatestReleaseSection.module.css";

type Props = {
  loading: boolean;
  error?: string;
  data?: SpotifyPayload | null;
};

export function LatestReleaseSection({ loading, error, data }: Props) {
  const latest = data?.primaryReleases?.[0] ?? null;
  const tracks =
    data?.tracks.filter(
      (track) =>
        latest &&
        latest.trackIds.includes(track.id) &&
        track.artistIds.includes(ARTIST_ID),
    ) ?? [];

  return (
    <section id="latest" className="section" aria-labelledby="latest-title">
      <div className="container">
        <p className="section-label">04 / Son Yayın</p>
        <h2 id="latest-title" className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", margin: "0 0 1.5rem" }}>
          Son Yayın
        </h2>

        {loading ? (
          <div className={styles.skeleton} aria-busy="true" aria-live="polite">
            <div className={styles.skelBlock} />
            <div className={styles.skelBlock} style={{ height: 120 }} />
          </div>
        ) : null}

        {!loading && error ? (
          <ErrorState message={error} spotifyUrl={SPOTIFY_ARTIST_URL} />
        ) : null}

        {!loading && !error && !latest ? (
          <p className="muted">Henüz doğrulanmış bir birincil yayın bulunamadı.</p>
        ) : null}

        {!loading && !error && latest ? (
          <div className={styles.grid}>
            {latest.image?.url ? (
              <img
                className={styles.cover}
                src={latest.image.url}
                alt={`${latest.name} kapak görseli`}
                width={latest.image.width ?? 640}
                height={latest.image.height ?? 640}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className={styles.cover} aria-hidden />
            )}

            <div>
              <h3 className={styles.title}>{latest.name}</h3>
              <p className={styles.meta}>
                {albumTypeLabel(latest.albumType, latest.albumGroup)} ·{" "}
                {formatReleaseDate(latest.releaseDate, latest.releaseDatePrecision)}
              </p>
              {latest.externalUrl ? (
                <a
                  className="btn btn-spotify"
                  href={latest.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spotify&apos;da aç
                  <ExternalLink size={16} aria-hidden />
                </a>
              ) : null}

              <ul className={styles.tracks}>
                {tracks.map((track) => (
                  <li key={track.id} className={styles.track}>
                    <span className="muted">{track.trackNumber}</span>
                    <span>{track.name}</span>
                    <span className="muted">{formatDuration(track.durationMs)}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "1.25rem" }}>
                <SpotifyAttribution />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
