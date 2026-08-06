"use client";

import { useState } from "react";
import { MusicStartGate } from "@/components/audio/MusicStartGate";
import { GlobalSideRevealLayer } from "@/components/global/GlobalSideRevealLayer";
import { ScrollProgress } from "@/components/global/ScrollProgress";
import { AlyLoadingScreen } from "@/components/loading/AlyLoadingScreen";
import { Header } from "@/components/layout/Header";
import { InteractiveMenu } from "@/components/menu/InteractiveMenu";
import {
  AudioPreviewProvider,
  useAudioPreviewContext,
} from "@/components/providers/AudioPreviewProvider";
import { ChaosProvider } from "@/components/providers/ChaosProvider";
import { SpotifyPlaybackProvider } from "@/components/providers/SpotifyPlaybackProvider";
import type { MusicCatalog } from "@/lib/spotify/types";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: React.ReactNode;
  catalog: MusicCatalog;
};

function ShellInner({ children, catalog }: Props) {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const { stopPreview } = useAudioPreviewContext();
  useLenis(!reduced, menuOpen);

  return (
    <>
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <div className="page-background" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <AlyLoadingScreen />
      <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((v) => !v)} />
      <InteractiveMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        catalog={catalog}
        onStopAudio={stopPreview}
      />
      <GlobalSideRevealLayer />
      <ScrollProgress />
      {children}
      <MusicStartGate />
    </>
  );
}

export function SiteShell({ children, catalog }: Props) {
  return (
    <ChaosProvider>
      <AudioPreviewProvider>
        <SpotifyPlaybackProvider>
          <ShellInner catalog={catalog}>{children}</ShellInner>
        </SpotifyPlaybackProvider>
      </AudioPreviewProvider>
    </ChaosProvider>
  );
}
