"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import { siteConfig } from "@/data/site";
import { registerGsap } from "@/lib/gsap/register";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./VisualJourneySection.module.css";

const BEATS = [
  "ALY",
  "SES / GÖLGE",
  "FREKANS",
  "HAREKET",
  "ARŞİV",
  "İZ",
  "RİTİM",
  "ALY",
];

export function VisualJourneySection() {
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const images = siteConfig.media.journey;
  const [beat, setBeat] = useState(BEATS[0]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const { gsap, ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-journey-frame]");
      const total = Math.max(frames.length, 1);

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const i = Math.min(
            BEATS.length - 1,
            Math.floor(self.progress * BEATS.length),
          );
          setBeat(BEATS[i] ?? BEATS[0]);
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      frames.forEach((frame, index) => {
        const side = frame.dataset.side === "right" ? "right" : "left";
        const fromX = side === "left" ? -125 : 125;
        const fromRot = side === "left" ? -6 : 6;
        const scaleFrom = index % 3 === 0 ? 0.86 : 0.9;
        const position = index * 0.85;

        gsap.set(frame, {
          xPercent: fromX,
          opacity: 0,
          scale: scaleFrom,
          rotation: fromRot,
        });

        tl.to(
          frame,
          {
            xPercent: side === "left" ? -8 : 8,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.55,
            ease: "none",
          },
          position,
        ).to(
          frame,
          {
            xPercent: fromX * -0.28,
            opacity: 0,
            scale: 0.94,
            rotation: fromRot * -0.35,
            duration: 0.65,
            ease: "none",
          },
          position + 0.55,
        );
      });

      void total;
    }, root);

    return () => ctx.revert();
  }, [reduced, images.length]);

  if (reduced) {
    return (
      <section
        id="gorsel"
        className={`section-shell ${styles.section}`}
        aria-label="Görsel yolculuk"
      >
        <div className={`section-content ${styles.header}`}>
          <p className="meta-label">{siteConfig.visualJourney.meta}</p>
          <h2 className={`display ${styles.title}`}>{siteConfig.visualJourney.title}</h2>
          <p className={styles.subtitle}>{siteConfig.visualJourney.subtitle}</p>
        </div>
        <div className={styles.staticGrid}>
          {images.map((src, index) => (
            <div key={src} className={styles.staticCard}>
              <MediaImage
                src={src}
                alt={`ALY görsel ${index + 1}`}
                width={960}
                height={1200}
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="gorsel"
      ref={rootRef}
      className={styles.pinWrap}
      aria-label="Görsel yolculuk"
    >
      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.copy}>
          <p className="meta-label">{siteConfig.visualJourney.meta}</p>
          <h2 className={`display ${styles.beat}`}>{beat}</h2>
          <p className={styles.subtitle}>{siteConfig.visualJourney.subtitle}</p>
        </div>

        <div className={styles.stage}>
          {images.map((src, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            return (
              <div
                key={src}
                className={styles.frame}
                data-journey-frame
                data-side={side}
              >
                <MediaImage
                  src={src}
                  alt={`ALY görsel ${index + 1}`}
                  width={960}
                  height={1200}
                  className={styles.image}
                />
              </div>
            );
          })}
        </div>

        <a className={styles.cta} href="#muzik">
          Müzik bölümüne geç
        </a>
      </div>
    </section>
  );
}
