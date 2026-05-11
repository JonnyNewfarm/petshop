import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund Policy | Petsaco",
  description: "Read the Petsaco refund and return policy.",
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

export default function RefundsPage() {
  return (
    <LegalPageLayout
      eyebrow="Support"
      title="Refund Policy"
      intro="We want every order to feel straightforward and reliable. This page explains when returns and refunds may be available, and how to contact us if something goes wrong."
    >
      <Section title="Returns">
        <p>
          You may request a return within 30 days of receiving your order.
          Returned items must be unused, in original condition, and suitable for
          resale.
        </p>
      </Section>

      <Section title="Returns">
        <p>Refund processing time: 7 days</p>
      </Section>

      <Section title="Refund approval">
        <p>
          Once your returned item has been received and inspected, we will let
          you know whether your refund has been approved.
        </p>
        <p>
          If approved, the refund will be issued to your original payment
          method.
        </p>
      </Section>

      <Section title="Non-returnable situations">
        <p>
          Returns may not be accepted for items that have been used, damaged by
          misuse, or returned in poor condition.
        </p>
      </Section>

      <Section title="Shipping costs">
        <p>
          Original shipping costs are non-refundable unless the item arrived
          damaged, defective, or incorrect.
        </p>
        <p>
          Return shipping costs may be the responsibility of the customer unless
          otherwise agreed.
        </p>
      </Section>

      <Section title="Damaged or incorrect items">
        <p>
          If your item arrives damaged or incorrect, contact us as soon as
          possible with your order details and photos where relevant. We will
          work with you to resolve the issue.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For refund or return questions, email{" "}
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
