import HeroSection from "@/components/HeroSection";
import ScrollSection from "@/components/SmoothScroll";

import TrainCardsSection from "@/components/ShopByAnimalSection";
import VideoSection from "@/components/VideoSection";
import EditorialShopSection from "@/components/EditorialShopCollection";

export default function HomePage() {
  return (
    <ScrollSection>
      <HeroSection />
      <TrainCardsSection />
      <VideoSection />
      <EditorialShopSection />
    </ScrollSection>
  );
}
