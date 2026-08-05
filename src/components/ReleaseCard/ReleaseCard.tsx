import type { NormalizedRelease } from "@/types/spotify";
import { albumTypeLabel, releaseYear } from "@/utils/formatting";
import styles from "./ReleaseCard.module.css";

type Props = {
  release: NormalizedRelease;
  onOpen: (release: NormalizedRelease) => void;
};

export function ReleaseCard({ release, onOpen }: Props) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen(release)}
      aria-label={`${release.name} detaylarını aç`}
    >
      <div className={styles.coverWrap}>
        {release.image?.url ? (
          <img
            className={styles.cover}
            src={release.image.url}
            alt=""
            width={release.image.width ?? 300}
            height={release.image.height ?? 300}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={styles.placeholder} aria-hidden>
            ALY
          </span>
        )}
      </div>
      <div className={styles.meta}>
        <h3 className={styles.name}>{release.name}</h3>
        <p className={styles.sub}>
          {releaseYear(release.releaseDate)} · {albumTypeLabel(release.albumType, release.albumGroup)} ·{" "}
          {release.totalTracks} parça
        </p>
      </div>
    </button>
  );
}
