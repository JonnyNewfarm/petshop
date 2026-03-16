import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

type MetadataCartItem = {
  productId: string;
  variantId?: string | null;
  name: string;
  variantName?: string | null;
  variantOptions?: { name: string; value: string }[];
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const existingOrder = await prisma.order.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (!existingOrder) {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            limit: 100,
          },
        );

        const shippingDetails = session.collected_information?.shipping_details;
        const customerDetails = session.customer_details;

        let metadataItems: MetadataCartItem[] = [];

        try {
          metadataItems = session.metadata?.cart
            ? (JSON.parse(session.metadata.cart) as MetadataCartItem[])
            : [];
        } catch {
          metadataItems = [];
        }

        await prisma.order.create({
          data: {
            stripeSessionId: session.id,
            customerName:
              shippingDetails?.name ??
              customerDetails?.name ??
              null,
            customerEmail: customerDetails?.email ?? null,
            currency: session.currency ?? null,
            amountTotal: session.amount_total ?? null,
            paymentStatus: session.payment_status ?? null,
            status: "paid",

            shippingLine1: shippingDetails?.address?.line1 ?? null,
            shippingLine2: shippingDetails?.address?.line2 ?? null,
            shippingCity: shippingDetails?.address?.city ?? null,
            shippingState: shippingDetails?.address?.state ?? null,
            shippingPostalCode:
              shippingDetails?.address?.postal_code ?? null,
            shippingCountry: shippingDetails?.address?.country ?? null,

            items: {
              create: lineItems.data.map((item, index) => {
                const metadataItem = metadataItems[index];

                return {
                  productId: metadataItem?.productId ?? null,
                  variantId: metadataItem?.variantId ?? null,
                  productName: metadataItem?.name ?? item.description,
                  variantName: metadataItem?.variantName ?? null,
                  variantOptions: metadataItem?.variantOptions ?? [],
                  price:
                    item.amount_total && item.quantity
                      ? Math.round(item.amount_total / item.quantity)
                      : item.price?.unit_amount ?? 0,
                  quantity: item.quantity ?? 1,
                };
              }),
            },
          },
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}