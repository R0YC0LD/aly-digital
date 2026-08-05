import { ExternalLink } from "lucide-react";
import { CREDIT_LINE, SPOTIFY_ARTIST_URL } from "@/config/artist";
import { getVisibleSocialLinks } from "@/config/socialLinks";
import { SpotifyAttribution } from "@/components/SpotifyAttribution/SpotifyAttribution";
import styles from "./FinalSection.module.css";

export function FinalSection() {
  const links = getVisibleSocialLinks();

  return (
    <section id="links" className={styles.section} aria-labelledby="final-title">
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>
        <p className="section-label">08–09 / Bağlantılar & Final</p>
        <h2 id="final-title" className={styles.title}>
          ALY
        </h2>
        <p className={styles.copy}>
          Arşiv burada kapanır, frekans Spotify&apos;da devam eder. Doğrulanmış
          yayınlara dönmek için tek tık yeterli.
        </p>

        <a
          className="btn btn-spotify"
          href={SPOTIFY_ARTIST_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Spotify&apos;da dinle
          <ExternalLink size={16} aria-hidden />
        </a>

        {links.length > 0 ? (
          <div className={styles.links} aria-label="Sosyal bağlantılar">
            {links.map((link) => (
              <a
                key={link.id}
                className={styles.social}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <ExternalLink size={14} aria-hidden />
              </a>
            ))}
          </div>
        ) : null}

        <footer className={styles.footer}>
          <SpotifyAttribution />
          <p style={{ margin: 0 }}>
            {CREDIT_LINE} · Bu site Spotify Web API kimlik doğrulaması ile çalışır.
          </p>
        </footer>
      </div>
    </section>
  );
}
