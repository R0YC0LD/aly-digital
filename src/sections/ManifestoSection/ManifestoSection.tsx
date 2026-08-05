import { promoSrc } from "@/utils/media";
import styles from "./ManifestoSection.module.css";

export function ManifestoSection() {
  return (
    <section className={styles.section} aria-labelledby="manifesto-title">
      <div className={styles.inner}>
        <div className={styles.copyBlock}>
          <p className="section-label">02 / Manifesto</p>
          <h2 id="manifesto-title" className={styles.headline}>
            Ses bir iz bırakır. Gölge onu taşır.
          </h2>
          <p className={styles.copy}>
            Bu sayfa bir biyografi değil; frekansların arşivi. ALY&apos;nin doğrulanmış
            yayınları, parçaları ve görsel izi burada bir araya geliyor — abartısız,
            doğrudan, net.
          </p>
          <p className={styles.aside}>SES / GÖLGE / HAREKET</p>
        </div>

        <figure className={styles.visual}>
          <img
            src={promoSrc("media/aly/aly-02.webp")}
            alt="ALY tanıtım görseli"
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
          />
          <figcaption className={styles.visualCaption}>Frame / 02</figcaption>
        </figure>
      </div>
    </section>
  );
}
