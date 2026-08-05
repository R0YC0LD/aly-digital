import { ArrowDown, ExternalLink } from "lucide-react";
import { SPOTIFY_ARTIST_URL } from "@/config/artist";
import { HERO_PROFILE_SRC, promoSrc } from "@/utils/media";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.grid} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <img
        className={styles.profile}
        src={promoSrc(HERO_PROFILE_SRC)}
        alt=""
        width={800}
        height={800}
        decoding="async"
        fetchPriority="high"
      />

      <div className={styles.content}>
        <p className="section-label">01 / Giriş</p>
        <h1 id="hero-title" className={styles.title}>
          ALY
        </h1>
        <p className={styles.lead}>
          Frekans, gölge ve ritmin kesiştiği dijital arşiv. Doğrulanmış yayınlara in,
          parçaları keşfet.
        </p>
        <div className={styles.actions}>
          <a className="btn btn-primary" href="#latest">
            Müziğe Gir
          </a>
          <a
            className="btn btn-spotify"
            href={SPOTIFY_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify profili
            <ExternalLink size={16} aria-hidden />
          </a>
        </div>
        <div className={styles.scrollHint} aria-hidden>
          Kaydır
          <span />
          <ArrowDown size={14} />
        </div>
      </div>
    </section>
  );
}
