import { DesignerCredit } from "@/components/layout/DesignerCredit";
import { PlatformLinks } from "@/components/platforms/PlatformLinks";
import { siteConfig } from "@/data/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={`display ${styles.brand}`}>{siteConfig.artistName}</p>
        <p className={styles.year}>{new Date().getFullYear()} · DİJİTAL EVREN</p>
      </div>
      <nav className={styles.links} aria-label="Footer">
        <a href="#gorsel">GÖRSEL</a>
        <a href="#muzik">MÜZİK</a>
        <a href="#instagram">INSTAGRAM</a>
      </nav>
      <div className={styles.footerBottom}>
        <div className={styles.platformsWrap}>
          <PlatformLinks variant="all" placement="footer" className={styles.platforms} />
        </div>
        <div className={styles.creditSlot}>
          <DesignerCredit />
        </div>
      </div>
    </footer>
  );
}
