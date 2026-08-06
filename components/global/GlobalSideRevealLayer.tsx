"use client";

/**
 * Optional fixed-atmosphere layer for side reveals.
 * Primary journey animation lives in VisualJourneySection.
 */
import styles from "./GlobalSideRevealLayer.module.css";

export function GlobalSideRevealLayer() {
  return <div className={styles.layer} aria-hidden="true" />;
}
