import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROMO_ASSETS, promoSrc, probeImage } from "@/utils/media";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./VisualJourneySection.module.css";

gsap.registerPlugin(ScrollTrigger);

const COPY_BEATS = [
  { title: "ALY", subtitle: "SES / GÖLGE / HAREKET" },
  { title: "FREKANS", subtitle: "KATMANLAR AÇILIYOR" },
  { title: "GÖLGE", subtitle: "IŞIK KESİŞİMİ" },
  { title: "YAKIN", subtitle: "KAREDEN TAŞAN AN" },
  { title: "RİTİM", subtitle: "DİSKOGRAFİYE GİR" },
  { title: "IZ", subtitle: "@ALYKILLA" },
  { title: "ARŞİV", subtitle: "YENİ YAYINLAR" },
  { title: "ALY", subtitle: "DEVAM ET" },
];

export function VisualJourneySection() {
  const wrapRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  const [beatIndex, setBeatIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      PROMO_ASSETS.map(async (asset) => {
        const ok = await probeImage(promoSrc(asset.src));
        return [asset.id, ok] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setAvailable(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reduced || !wrapRef.current) return;

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-journey-frame]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const nextBeat = Math.min(
              COPY_BEATS.length - 1,
              Math.floor(self.progress * COPY_BEATS.length),
            );
            setBeatIndex(nextBeat);
          },
        },
      });

      frames.forEach((frame, index) => {
        const side = frame.dataset.side === "right" ? "right" : "left";
        const fromX = side === "left" ? -120 : 120;
        const fromRot = side === "left" ? -5 : 5;
        const drift = index % 2 === 0 ? -24 : 18;
        const scaleFrom = index % 3 === 0 ? 0.88 : 0.92;
        const rotAmount = index % 2 === 0 ? fromRot : fromRot * 0.6;
        const position = index * 0.85;

        gsap.set(frame, {
          xPercent: fromX,
          rotation: isMobile ? 0 : rotAmount,
          opacity: 0,
          scale: scaleFrom,
          y: drift,
        });

        tl.to(
          frame,
          {
            xPercent: isMobile ? 0 : side === "left" ? -6 : 6,
            rotation: isMobile ? 0 : rotAmount * 0.12,
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "none",
          },
          position,
        ).to(
          frame,
          {
            xPercent: isMobile ? (side === "left" ? -35 : 35) : fromX * -0.28,
            y: drift * -1.15,
            opacity: 0,
            scale: 0.96,
            rotation: isMobile ? 0 : rotAmount * -0.35,
            duration: 0.65,
            ease: "none",
          },
          position + 0.55,
        );
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [reduced, isMobile, available]);

  const beat = COPY_BEATS[beatIndex] ?? COPY_BEATS[0];

  return (
    <section
      id="journey"
      ref={wrapRef}
      className={styles.pinWrap}
      aria-labelledby="journey-title"
    >
      <div className={styles.sticky}>
        <div className={styles.copy}>
          <p className={styles.kicker}>03 / Görsel Yolculuk</p>
          <h2 id="journey-title" className={styles.title}>
            {beat.title}
          </h2>
          <p className={styles.subtitle}>{beat.subtitle}</p>
        </div>

        <div className={styles.stage}>
          {PROMO_ASSETS.map((asset) => {
            const hasImage = available[asset.id] !== false;
            return (
              <div
                key={asset.id}
                className={styles.frame}
                data-journey-frame
                data-side={asset.side}
              >
                {hasImage ? (
                  <img
                    className={styles.image}
                    src={promoSrc(asset.src)}
                    alt={asset.alt}
                    width={asset.width}
                    height={asset.height}
                    loading="lazy"
                    decoding="async"
                    data-treatment={asset.treatment ?? "raw"}
                    onError={() => {
                      setAvailable((prev) => ({ ...prev, [asset.id]: false }));
                    }}
                  />
                ) : (
                  <div className={styles.placeholder} aria-hidden>
                    ALY
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <a className={`btn ${styles.cta}`} href="#latest">
          Diskografiye gir
        </a>
      </div>
    </section>
  );
}
