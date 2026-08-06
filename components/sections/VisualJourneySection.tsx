"use client";

import { useLayoutEffect, useRef } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import { siteConfig } from "@/data/site";
import { registerGsap } from "@/lib/gsap/register";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./VisualJourneySection.module.css";

export function VisualJourneySection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const images = siteConfig.media.journey;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-journey-panel]");
      panels.forEach((panel) => {
        const side = panel.dataset.side === "right" ? 1 : -1;
        gsap.fromTo(
          panel,
          { xPercent: side * 28, opacity: 0.15, rotate: side * 2.5 },
          {
            xPercent: 0,
            opacity: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 88%",
              end: "top 38%",
              scrub: 0.65,
            },
          },
        );
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      id="gorsel"
      ref={rootRef}
      className={`section-shell ${styles.section}`}
      aria-label="Görsel yolculuk"
    >
      <div className={`section-backdrop ${styles.backdrop}`} aria-hidden="true" />
      <div className={`section-content ${styles.header}`}>
        <p className="meta-label">{siteConfig.visualJourney.meta}</p>
        <h2 className={`display ${styles.title}`}>{siteConfig.visualJourney.title}</h2>
        <p className={styles.subtitle}>{siteConfig.visualJourney.subtitle}</p>
      </div>

      <div className={styles.track}>
        {images.map((src, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <article
              key={src}
              className={`${styles.panel} ${styles[side]}`}
              data-journey-panel
              data-side={side}
            >
              <div className={styles.frame}>
                <MediaImage
                  src={src}
                  alt={`ALY görsel ${index + 1}`}
                  width={960}
                  height={1200}
                  className={styles.image}
                />
              </div>
              <p className={styles.index}>{String(index + 1).padStart(2, "0")}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
