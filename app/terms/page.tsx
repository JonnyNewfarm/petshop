import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Petsaco",
  description: "Read the Petsaco terms of service.",
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

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      intro="By using Petsaco and placing an order through our website, you agree to the following terms. These terms are designed to keep the shopping experience clear, fair, and transparent."
    >
      <Section title="General">
        <p>
          Petsaco sells pet-related products through our online store. By
          browsing this website or placing an order, you agree to these terms.
        </p>
      </Section>

      <Section title="Orders">
        <p>
          All orders are subject to availability, payment approval, and order
          confirmation.
        </p>
        <p>
          We reserve the right to cancel or refuse any order if we identify
          pricing errors, stock issues, fraudulent activity, or other unusual
          circumstances.
        </p>
      </Section>

      <Section title="Pricing and currency">
        <p>
          All prices displayed on the website are listed in USD unless otherwise
          stated. Prices may change without notice.
        </p>
      </Section>

      <Section title="Shipping and fulfillment">
        <p>
          Orders are typically processed within 1–5 business days. Estimated
          delivery times, tracking information, shipping costs, and delay
          information are explained in our Shipping Policy.
        </p>
        <p>
          We work with trusted fulfillment partners and shipping providers to
          process and deliver orders.
        </p>
      </Section>

      <Section title="Delays">
        <p>
          We are not responsible for delays caused by customs, carriers,
          weather, local delivery disruptions, or circumstances outside our
          reasonable control.
        </p>
      </Section>

      <Section title="Returns and refunds">
        <p>
          Please review our Refund Policy for complete information about
          returns, refunds, and eligibility.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have questions about these terms, contact{" "}
          <a
            href="mailto:support@petsaco.com"
            className="underline underline-offset-4"
          >
            sales@petsaco.com
          </a>
          .
        </p>
      </Section>
    </LegalPageLayout>
  );
}
