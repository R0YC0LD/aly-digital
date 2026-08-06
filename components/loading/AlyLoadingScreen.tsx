"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import styles from "./AlyLoadingScreen.module.css";

type Props = {
  onDone?: () => void;
};

function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return true;
  if (!siteConfig.loading.showOncePerSession) return false;
  try {
    return sessionStorage.getItem(siteConfig.loading.sessionKey) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(siteConfig.loading.sessionKey, "1");
  } catch {
    /* ignore */
  }
}

export function AlyLoadingScreen({ onDone }: Props) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!siteConfig.loading.enabled) {
      onDone?.();
      return;
    }
    if (hasSeenIntro()) {
      onDone?.();
      return;
    }

    setVisible(true);
    document.body.dataset.loading = "true";

    const maxMs = siteConfig.loading.maxVisibleMs || 1500;
    const exitMs = Math.round((siteConfig.loading.exitDuration || 0.42) * 1000);

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
      markSeen();
      window.setTimeout(() => {
        document.body.dataset.loading = "false";
        setVisible(false);
        onDone?.();
      }, exitMs);
    }, maxMs);

    return () => {
      window.clearTimeout(exitTimer);
      document.body.dataset.loading = "false";
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.root} ${exiting ? styles.exit : ""}`}
      role="status"
      aria-live="polite"
      aria-label="ALY yükleniyor"
    >
      <div className={styles.shutter} aria-hidden="true">
        <span className={styles.blade} />
        <span className={styles.blade} />
        <span className={styles.blade} />
        <span className={styles.blade} />
      </div>
      <p className={`display ${styles.wordmark}`}>ALY</p>
      <p className={styles.meta}>DİJİTAL EVREN</p>
    </div>
  );
}
