import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const items = body.items as {
      productId: string;
      variantId?: string | null;
      name: string;
      variantName?: string | null;
      variantOptions?: { name: string; value: string }[];
      price: number;
      quantity: number;
      imageUrl?: string;
    }[];

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No cart items provided." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const freeShippingThreshold = 4900;
    const shippingAmount = subtotal >= freeShippingThreshold ? 0 : 695;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is missing." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.variantName
              ? `${item.name} — ${item.variantName}`
              : item.name,
            images: item.imageUrl
              ? [`${appUrl}${item.imageUrl}`]
              : [],
          },
          unit_amount: item.price,
        },
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingAmount,
              currency: "usd",
            },
            display_name:
              shippingAmount === 0 ? "Free shipping" : "Standard shipping",
          },
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["NO", "SE", "DK", "GB", "DE", "FR", "NL", "US"],
      },
      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        itemCount: String(items.length),
        subtotal: String(subtotal),
        shippingAmount: String(shippingAmount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}