import { useRef, useState } from "react";
import { Header } from "@/components/Header/Header";
import { FullscreenMenu } from "@/components/FullscreenMenu/FullscreenMenu";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { ScrollProgress } from "@/components/ScrollProgress/ScrollProgress";
import { HeroSection } from "@/sections/HeroSection/HeroSection";
import { ManifestoSection } from "@/sections/ManifestoSection/ManifestoSection";
import { VisualJourneySection } from "@/sections/VisualJourneySection/VisualJourneySection";
import { LatestReleaseSection } from "@/sections/LatestReleaseSection/LatestReleaseSection";
import { DiscographySection } from "@/sections/DiscographySection/DiscographySection";
import { TracksSection } from "@/sections/TracksSection/TracksSection";
import { FeaturedSection } from "@/sections/FeaturedSection/FeaturedSection";
import { FinalSection } from "@/sections/FinalSection/FinalSection";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_DESCRIPTION, SITE_IS_OFFICIAL, SITE_URL } from "@/config/artist";

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "ALY",
    url: SITE_URL || undefined,
    sameAs: ["https://open.spotify.com/intl-tr/artist/2pwxA6FXPCRje8le8719pQ"],
    description: SITE_DESCRIPTION,
    ...(SITE_IS_OFFICIAL ? {} : { disambiguatingDescription: "Resmî olmayan dijital arşiv" }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const spotify = useSpotifyData();
  useDocumentMeta();

  const loading = spotify.status === "loading";
  const error =
    spotify.status === "error" ? spotify.message : undefined;
  const data =
    spotify.status === "success" || spotify.status === "empty"
      ? spotify.data
      : null;

  return (
    <>
      <JsonLd />
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <LoadingScreen />
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        menuButtonRef={menuButtonRef}
      />
      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuButtonRef={menuButtonRef}
      />
      <ScrollProgress />

      <main id="main">
        <HeroSection />
        <ManifestoSection />
        <VisualJourneySection />
        <LatestReleaseSection loading={loading} error={error} data={data} />
        <DiscographySection loading={loading} error={error} data={data} />
        <TracksSection loading={loading} error={error} data={data} />
        <FeaturedSection loading={loading} error={error} data={data} />
        <FinalSection />
      </main>
    </>
  );
}
