import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "About Us | Petsaco",
  description: "Learn more about Petsaco and how we support pet owners.",
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

export default function AboutPage() {
  return (
    <LegalPageLayout
      eyebrow="About"
      title="About Petsaco"
      intro="Petsaco is an online pet accessories store focused on practical products for pet owners. We aim to make shopping simple, transparent, and reliable."
    >
      <Section title="Who we are">
        <p>
          Petsaco sells pet-related products through our online store. Our focus
          is on practical accessories that help make everyday pet care easier,
          whether you are at home, on a walk, or traveling with your pet.
        </p>
        <p>
          We are committed to providing clear product information, transparent
          pricing, tracked shipping, and helpful customer support.
        </p>
      </Section>

      <Section title="What we sell">
        <p>
          Our store offers pet accessories such as travel bottles, feeding
          accessories, and everyday pet care products.
        </p>
        <p>
          Each product page is designed to show important details such as price,
          availability, options, descriptions, and relevant product information
          before you place an order.
        </p>
      </Section>

      <Section title="Fulfillment and delivery">
        <p>
          Petsaco works with trusted fulfillment and shipping partners to help
          deliver orders safely and reliably.
        </p>
        <p>
          We remain your point of contact for customer support, order questions,
          shipping updates, returns, and refund requests.
        </p>
      </Section>

      <Section title="Our goal">
        <p>
          Our goal is to provide useful pet products with a clear and simple
          shopping experience.
        </p>
        <p>
          We want customers to understand what they are buying, how orders are
          processed, how shipping works, and how to contact us if they need
          help.
        </p>
      </Section>

      <Section title="Shipping and support">
        <p>
          Orders are typically processed within 1–5 business days. Estimated
          delivery times are explained in our Shipping Policy, and every order
          ships with tracking.
        </p>
        <p>
          When your order has shipped, you will receive tracking information by
          email. If you have questions before or after placing an order, you can
          contact us by email and we will do our best to help.
        </p>
      </Section>

      <Section title="Transparency">
        <p>
          We believe customers should have access to clear store policies before
          placing an order. You can review our Shipping Policy, Refund Policy,
          Privacy Policy, and Terms of Service on our website.
        </p>
        <p>
          If anything is unclear, please contact us before completing your
          purchase.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For questions about Petsaco, our products, or an order, contact{" "}
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
