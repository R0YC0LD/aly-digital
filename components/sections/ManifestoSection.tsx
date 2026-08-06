import { siteConfig } from "@/data/site";
import styles from "./ManifestoSection.module.css";

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className={`section-shell ${styles.section}`}
      aria-label="Manifesto"
    >
      <div className={`section-backdrop ${styles.backdrop}`} aria-hidden="true" />
      <div className={`section-content ${styles.content}`}>
        <p className="meta-label">01 / MANİFESTO</p>
        <h2 className={`display ${styles.title}`}>{siteConfig.manifesto.title}</h2>
        <p className={`display ${styles.lines}`}>
          {siteConfig.manifesto.lineOne}
          <br />
          {siteConfig.manifesto.lineTwo}
        </p>
        <p className={styles.body}>{siteConfig.manifesto.body}</p>
      </div>
    </section>
  );
}
