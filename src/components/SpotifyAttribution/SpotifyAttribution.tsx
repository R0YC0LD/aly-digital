import styles from "./SpotifyAttribution.module.css";

type Props = {
  className?: string;
};

export function SpotifyAttribution({ className }: Props) {
  return (
    <p className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <span className={styles.mark} aria-hidden />
      <span>Spotify verileri Spotify Web API üzerinden alınır. Spotify bir ticari markadır.</span>
    </p>
  );
}
