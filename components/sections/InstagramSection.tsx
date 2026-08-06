import { PlatformLinks } from "@/components/platforms/PlatformLinks";
import { MediaImage } from "@/components/ui/MediaImage";
import { siteConfig } from "@/data/site";
import styles from "./InstagramSection.module.css";

export function InstagramSection() {
  const igUrl = siteConfig.instagram.url || siteConfig.links.instagram;
  const hasIg = Boolean(igUrl);

  return (
    <section
      id="instagram"
      className={`section-shell ${styles.section}`}
      aria-label="Instagram"
    >
      <div className={`section-backdrop ${styles.backdrop}`} aria-hidden="true" />

      <div className={`section-content ${styles.content}`}>
        <div className={styles.copy}>
          <p className="meta-label">04 / SOSYAL</p>
          <h2 className={`display ${styles.title}`}>{siteConfig.instagram.title}</h2>
          <p className={styles.handle}>
            {hasIg ? siteConfig.instagram.username : "INSTAGRAM YAKINDA"}
          </p>
          {hasIg ? (
            <a
              href={igUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className={`editorial-link ${styles.cta}`}
            >
              {siteConfig.instagram.cta}
            </a>
          ) : (
            <p className={styles.cta}>Resmî Instagram bağlantısı doğrulanınca burada açılacak.</p>
          )}
          <div className={styles.socialRow}>
            <span className="meta-label">SOSYAL</span>
            <PlatformLinks variant="social" placement="social-section" />
          </div>
        </div>

        {hasIg ? (
          <a
            href={igUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portal}
            aria-label="ALY Instagram profiline git (yeni sekme)"
          >
            <div className={styles.ring} aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path
                    id="igCircle"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <text className={styles.ringText}>
                  <textPath href="#igCircle">{siteConfig.instagram.ring}</textPath>
                </text>
              </svg>
            </div>
            <div className={styles.avatar}>
              <MediaImage
                src={siteConfig.media.instagram}
                alt="ALY profil görseli"
                width={150}
                height={150}
                className={styles.avatarImg}
              />
            </div>
          </a>
        ) : (
          <div className={styles.portal} aria-hidden="true">
            <div className={styles.ring}>
              <svg viewBox="0 0 200 200">
                <defs>
                  <path
                    id="igCircleFallback"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <text className={styles.ringText}>
                  <textPath href="#igCircleFallback">{siteConfig.instagram.ring}</textPath>
                </text>
              </svg>
            </div>
            <div className={styles.avatar}>
              <MediaImage
                src={siteConfig.media.instagram}
                alt=""
                width={150}
                height={150}
                className={styles.avatarImg}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
