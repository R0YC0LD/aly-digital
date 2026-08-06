import { SiteShell } from "@/components/SiteShell";
import { HeroSection } from "@/components/hero/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { VisualJourneySection } from "@/components/sections/VisualJourneySection";
import { MusicSection } from "@/components/music/MusicSection";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { FinalSection } from "@/components/sections/FinalSection";
import { getMusicCatalog } from "@/lib/spotify/catalog-service";

export default async function HomePage() {
  const catalog = await getMusicCatalog();

  return (
    <SiteShell catalog={catalog}>
      <main id="main" className="main">
        <HeroSection />
        <ManifestoSection />
        <VisualJourneySection />
        <MusicSection catalog={catalog} />
        <InstagramSection />
        <FinalSection />
      </main>
    </SiteShell>
  );
}
