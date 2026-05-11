import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Shipping Policy | Petsaco",
  description: "Read the Petsaco shipping policy.",
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

export default function ShippingPage() {
  return (
    <LegalPageLayout
      eyebrow="Shipping"
      title="Shipping Policy"
      intro="We want your Petsaco order to be delivered clearly and reliably. This policy explains our processing times, estimated delivery times, tracking, and what to do if your order is delayed."
    >
      <Section title="Processing time">
        <p>
          Orders are typically processed within 1–5 business days after payment
          confirmation.
        </p>
        <p>
          Processing times may be longer during high-demand periods, holidays,
          or if additional order verification is required.
        </p>
      </Section>

      <Section title="Estimated delivery time">
        <p>
          Estimated delivery time is typically 7–15 business days after your
          order has been processed and shipped.
        </p>
        <p>
          Delivery times may vary depending on your location, carrier
          performance, customs processing, demand, weather, and other external
          factors outside our control.
        </p>
      </Section>

      <Section title="Shipping cost">
        <p>
          We currently offer free shipping on all orders placed through our
          website.
        </p>
        <p>
          Any available shipping options and costs will be shown at checkout
          before you complete your order.
        </p>
      </Section>

      <Section title="Tracking">
        <p>
          Every order ships with tracking. When your order has shipped, you will
          receive a tracking number by email.
        </p>
        <p>
          Tracking information may take some time to update after the carrier
          receives the package.
        </p>
      </Section>

      <Section title="Fulfillment">
        <p>
          We work with trusted fulfillment partners and shipping providers to
          process, pack, and deliver orders.
        </p>
        <p>
          Orders may be shipped from different fulfillment locations depending
          on product availability and delivery destination.
        </p>
      </Section>

      <Section title="Incorrect shipping information">
        <p>
          Customers are responsible for providing a complete and accurate
          shipping address at checkout.
        </p>
        <p>
          If you notice that your shipping information is incorrect, contact us
          as soon as possible. We will do our best to help, but we cannot
          guarantee changes after an order has been processed or shipped.
        </p>
      </Section>

      <Section title="Delayed or missing orders">
        <p>
          If your order has not arrived within the estimated delivery window,
          please contact us with your order number so we can help check the
          shipment status.
        </p>
        <p>
          Some delays may be caused by customs, carriers, weather, local
          delivery disruptions, or other circumstances outside our reasonable
          control.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have questions about shipping, contact{" "}
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
