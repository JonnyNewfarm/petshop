import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Petsaco",
  description: "Read the Petsaco privacy policy.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-black/10 pb-8 last:border-b-0 last:pb-0">
      <p className="text-[10px] uppercase tracking-[0.24em] text-black/42">
        Section
      </p>
      <h2 className="mt-3 text-[1.45rem] uppercase tracking-[-0.04em] sm:text-[1.8rem]">
        {title}
      </h2>
      <div className="mt-5 max-w-[74ch] space-y-4 text-[14px] leading-7 text-black/68 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This page explains what information we collect, how we use it, and how we protect it when you browse Petsaco, place an order, or contact us."
    >
      <Section title="Information we collect">
        <p>
          When you place an order or interact with Petsaco, we may collect
          personal information such as your name, email address, shipping
          address, phone number, and order details.
        </p>
        <p>
          Payment details are processed securely by third-party payment
          providers and are not stored directly on our servers.
        </p>
      </Section>

      <Section title="How we use your information">
        <p>
          We use your information to process orders, provide support, improve
          our website, and communicate with you about your purchase.
        </p>
        <p>
          We may also use limited browsing and purchase data to improve product
          pages, advertising performance, and the overall customer experience.
        </p>
      </Section>

      <Section title="Payments, ads and third parties">
        <p>
          We use trusted third-party services such as Stripe for payment
          processing and Meta tools such as the Meta Pixel for analytics and
          advertising performance measurement.
        </p>
        <p>
          These providers may process information according to their own privacy
          policies.
        </p>
      </Section>

      <Section title="Cookies and tracking">
        <p>
          Petsaco uses cookies and similar technologies to understand how
          visitors use the site, remember preferences, and improve advertising
          relevance.
        </p>
        <p>
          By using our website, you agree that these tools may be used for site
          functionality, performance analysis, and marketing purposes where
          applicable.
        </p>
      </Section>

      <Section title="Data protection">
        <p>
          We take reasonable steps to protect your personal information, but no
          website or digital system can be guaranteed to be completely secure at
          all times.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal
          data by contacting us.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:support@petsaco.com"
            className="underline underline-offset-4"
          >
            support@petsaco.com
          </a>
          .
        </p>
      </Section>
    </LegalPageLayout>
  );
}
