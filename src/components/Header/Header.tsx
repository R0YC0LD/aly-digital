import type { RefObject } from "react";
import { SPOTIFY_ARTIST_URL } from "@/config/artist";
import styles from "./Header.module.css";

type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
};

export function Header({ menuOpen, onToggleMenu, menuButtonRef }: Props) {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label="ALY ana sayfa">
        ALY
      </a>
      <div className={styles.actions}>
        <a
          className={styles.listen}
          href={SPOTIFY_ARTIST_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          DİNLE ↗
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuBtn}
          aria-expanded={menuOpen}
          aria-controls="fullscreen-menu"
          onClick={onToggleMenu}
        >
          MENÜ
        </button>
      </div>
    </header>
  );
}
