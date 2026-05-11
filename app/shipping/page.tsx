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
          Orders are processed Monday–Saturday, excluding public holidays and
          other days when carriers or fulfillment partners are unavailable.
        </p>
      </Section>

      <Section title="Order cutoff time">
        <p>
          Our daily order cutoff time is 2:00 PM Pacific Standard Time. Orders
          placed after the cutoff time may begin processing on the next business
          day.
        </p>
      </Section>

      <Section title="Estimated transit time">
        <p>
          Estimated transit time is typically 5–12 business days after your
          order has been handed to the carrier.
        </p>
        <p>
          Transit time may vary depending on your delivery location, carrier
          performance, customs processing, weather, local delivery disruptions,
          demand, and other external factors outside our control.
        </p>
      </Section>

      <Section title="Total estimated delivery time">
        <p>
          The total estimated delivery time is typically 6–17 business days.
          This includes both order processing time and carrier transit time.
        </p>
        <p>
          Delivery estimates are not guaranteed and may vary during high-demand
          periods, holidays, customs processing, or unexpected carrier delays.
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

      <Section title="Fulfillment and delivery">
        <p>
          Petsaco works with trusted fulfillment and shipping partners to help
          process, pack, and deliver customer orders.
        </p>
        <p>
          We remain your point of contact for customer support, order questions,
          shipping updates, returns, and refund requests.
        </p>
      </Section>

      <Section title="Shipping destinations">
        <p>
          We currently ship to the United States, Canada, the United Kingdom,
          Australia, and New Zealand.
        </p>
        <p>
          Shipping availability may vary by product, destination, or checkout
          availability.
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
          delivery disruptions, public holidays, or other circumstances outside
          our reasonable control.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have questions about shipping, contact{" "}
          <a
            href="mailto:sales@petsaco.com"
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
