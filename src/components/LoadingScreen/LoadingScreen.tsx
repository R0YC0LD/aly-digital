import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

const SESSION_KEY = "aly-loading-seen";

type Props = {
  onDone?: () => void;
};

export function LoadingScreen({ onDone }: Props) {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";
    const duration = seen ? 400 : 1400;

    const hideTimer = window.setTimeout(() => {
      setDone(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      onDone?.();
    }, duration);

    const unmountTimer = window.setTimeout(() => setMounted(false), duration + 500);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [onDone]);

  if (!mounted) return null;

  return (
    <div
      className={styles.overlay}
      data-done={done}
      role="status"
      aria-live="polite"
      aria-label="Yükleniyor"
    >
      <div className={styles.scan} aria-hidden />
      <div className={styles.word} aria-hidden>
        {"ALY".split("").map((letter, i) => (
          <span key={`${letter}-${i}`} className={styles.letter}>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
