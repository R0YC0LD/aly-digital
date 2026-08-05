import { useEffect, useId, useRef } from "react";
import { ExternalLink } from "lucide-react";
import type { NormalizedRelease, NormalizedTrack } from "@/types/spotify";
import { ARTIST_ID } from "@/config/artist";
import { albumTypeLabel, formatDuration, formatReleaseDate } from "@/utils/formatting";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { SpotifyAttribution } from "@/components/SpotifyAttribution/SpotifyAttribution";
import styles from "./ReleaseModal.module.css";

type Props = {
  release: NormalizedRelease | null;
  tracks: NormalizedTrack[];
  onClose: () => void;
};

export function ReleaseModal({ release, tracks, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const open = Boolean(release);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!release) return null;

  const validTracks = tracks.filter(
    (track) =>
      release.trackIds.includes(track.id) && track.artistIds.includes(ARTIST_ID),
  );

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.top}>
          {release.image?.url ? (
            <img
              className={styles.cover}
              src={release.image.url}
              alt={`${release.name} kapak görseli`}
              width={release.image.width ?? 300}
              height={release.image.height ?? 300}
            />
          ) : (
            <div className={styles.cover} aria-hidden />
          )}
          <div>
            <h2 id={titleId} className={styles.title}>
              {release.name}
            </h2>
            <p className={styles.meta}>
              {albumTypeLabel(release.albumType, release.albumGroup)} ·{" "}
              {formatReleaseDate(release.releaseDate, release.releaseDatePrecision)} ·{" "}
              {validTracks.length} parça
            </p>
            {release.externalUrl ? (
              <a
                className="btn btn-spotify"
                style={{ marginTop: "1rem" }}
                href={release.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Spotify&apos;da aç
                <ExternalLink size={16} aria-hidden />
              </a>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Kapat"
          >
            KAPAT
          </button>
        </div>

        <ul className={styles.list}>
          {validTracks.map((track) => (
            <li key={track.id} className={styles.item}>
              <span className="muted">{track.trackNumber}</span>
              <div>
                <strong>{track.name}</strong>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {track.artistNames.join(", ")}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span className="muted">{formatDuration(track.durationMs)}</span>
                {track.externalUrl ? (
                  <a
                    className="btn"
                    href={track.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${track.name} Spotify'da aç`}
                    style={{ padding: "0.45rem 0.7rem" }}
                  >
                    Aç
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <SpotifyAttribution />
      </div>
    </div>
  );
}
