import styles from "./ManifestoSection.module.css";

export function ManifestoSection() {
  return (
    <section className={styles.section} aria-labelledby="manifesto-title">
      <div className={styles.inner}>
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
    </section>
  );
}
