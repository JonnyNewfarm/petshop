import HeroSection from "@/components/HeroSection";
import ScrollSection from "@/components/SmoothScroll";

import TrainCardsSection from "@/components/ShopByAnimalSection";
import VideoSection from "@/components/VideoSection";
import EditorialShopSection from "@/components/EditorialShopCollection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Petsaco – Pet Supplies for Dogs, Cats & Small Animals",
    template: "%s | Petsaco",
  },
  description:
    "Shop high-quality pet supplies at Petsaco. Discover toys, food, accessories and training equipment for dogs, cats and small animals. Fast delivery and great prices.",

  keywords: [
    "pet shop",
    "pet supplies",
    "dog products",
    "cat products",
    "pet toys",
    "pet accessories",
    "dog toys",
    "cat toys",
    "pet food",
    "online pet store",
  ],

  metadataBase: new URL("https://petsaco.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Petsaco – Everything Your Pet Needs",
    description:
      "Buy pet supplies online at Petsaco. Explore toys, accessories and essentials for dogs, cats and small animals.",
    url: "https://petsaco.com",
    siteName: "Petsaco",
    images: [
      {
        url: "/og-image.jpg", // create a 1200x630 image
        width: 1200,
        height: 630,
        alt: "Petsaco online pet store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Petsaco – Pet Supplies Online",
    description:
      "Find quality products for dogs and cats at Petsaco. Toys, accessories and essentials with fast shipping.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

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
