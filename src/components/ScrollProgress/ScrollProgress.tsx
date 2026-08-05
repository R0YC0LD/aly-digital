import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

export function ScrollProgress() {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (railRef.current) {
        railRef.current.style.setProperty(
          "--progress",
          String(Math.min(1, Math.max(0, progress))),
        );
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={railRef}
      className={styles.rail}
      aria-hidden
      style={{ ["--progress" as string]: 0 }}
    >
      <div className={styles.bar} />
    </div>
  );
}
