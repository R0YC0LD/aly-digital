import { ExternalLink } from "lucide-react";
import styles from "./ErrorState.module.css";

type Props = {
  message?: string;
  spotifyUrl: string;
};

export function ErrorState({
  message = "Spotify verileri şu anda yüklenemiyor.",
  spotifyUrl,
}: Props) {
  return (
    <div className={styles.wrap} role="alert">
      <h2 className={styles.title}>Bağlantı Kesildi</h2>
      <p className={styles.text}>{message}</p>
      <a
        className="btn btn-spotify"
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        ALY Spotify profiline git
        <ExternalLink size={16} aria-hidden />
      </a>
    </div>
  );
}
