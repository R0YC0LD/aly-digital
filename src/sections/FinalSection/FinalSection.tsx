import { ExternalLink, Instagram } from "lucide-react";
import { CREDIT_LINE, SPOTIFY_ARTIST_URL } from "@/config/artist";
import { getVisibleSocialLinks } from "@/config/socialLinks";
import { INSTAGRAM_URL, promoSrc } from "@/utils/media";
import { SpotifyAttribution } from "@/components/SpotifyAttribution/SpotifyAttribution";
import styles from "./FinalSection.module.css";

export function FinalSection() {
  const links = getVisibleSocialLinks();

  return (
    <section id="links" className={styles.section} aria-labelledby="final-title">
      <div className={styles.glow} aria-hidden />
      <img
        className={styles.bgStill}
        src={promoSrc("media/aly/aly-03.webp")}
        alt=""
        width={1200}
        height={1500}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.inner}>
        <p className="section-label">08–09 / Bağlantılar & Final</p>
        <h2 id="final-title" className={styles.title}>
          ALY
        </h2>
        <p className={styles.copy}>
          Arşiv burada kapanır, frekans dışarıda devam eder. Spotify&apos;da dinle,
          Instagram&apos;da görsel akışı takip et.
        </p>

        <div className={styles.ctaRow}>
          <a
            className="btn btn-spotify"
            href={SPOTIFY_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify&apos;da dinle
            <ExternalLink size={16} aria-hidden />
          </a>
          <a
            className="btn btn-primary"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={16} aria-hidden />
            @alykilla
          </a>
        </div>

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
