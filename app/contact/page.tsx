import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";
import ScrollSection from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Petsaco. Contact our support team for questions about orders, products, shipping or returns. We are here to help.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Petsaco",
    description:
      "Need help with your order or have a question about our pet supplies? Contact the Petsaco support team.",
    url: "https://petsaco.com/contact",
    siteName: "Petsaco",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <ScrollSection>
      <ContactPageClient />
    </ScrollSection>
  );
}
