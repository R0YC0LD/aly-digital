import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import styles from "./FullscreenMenu.module.css";

export type MenuItem = {
  id: string;
  label: string;
  href: string;
  preview: string;
};

const ITEMS: MenuItem[] = [
  { id: "01", label: "ANA SAYFA", href: "#top", preview: "ALY\nGİRİŞ" },
  { id: "02", label: "GÖRSEL YOLCULUK", href: "#journey", preview: "SES\nGÖLGE" },
  { id: "03", label: "SON YAYIN", href: "#latest", preview: "YENİ\nYAYIN" },
  { id: "04", label: "DİSKOGRAFİ", href: "#discography", preview: "ARŞİV\nKATALOG" },
  { id: "05", label: "PARÇALAR", href: "#tracks", preview: "PARÇA\nLİSTE" },
  { id: "06", label: "BAĞLANTILAR", href: "#links", preview: "BAĞ\nLANTI" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
};

export function FullscreenMenu({ open, onClose, menuButtonRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [active, setActive] = useState(ITEMS[0]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const focusables = () =>
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const nodes = Array.from(focusables());
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeRef.current?.focus(), 40);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current) {
      menuButtonRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [open, menuButtonRef]);

  return (
    <div
      id="fullscreen-menu"
      ref={panelRef}
      className={styles.overlay}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
      {...(!open ? ({ inert: "" } as object) : {})}
    >
      <h2 id={titleId} className="sr-only">
        Site menüsü
      </h2>
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Menüyü kapat"
      >
        KAPAT
      </button>

      <nav className={styles.nav} aria-label="Bölümler">
        {ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={styles.link}
            data-active={active.id === item.id}
            onFocus={() => setActive(item)}
            onMouseEnter={() => setActive(item)}
            onClick={onClose}
          >
            <span className={styles.num}>{item.id}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <aside className={styles.preview} aria-hidden>
        <div className={styles.previewInner}>
          <div className={styles.previewLabel}>
            {active.preview.split("\n").map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
