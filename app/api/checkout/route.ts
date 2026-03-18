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
        { status: 400 },
      );
    }

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const freeShippingThreshold = 5999; // 499 USD cents if you're using usd
    const shippingAmount = subtotal >= freeShippingThreshold ? 0 : 499;

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
              ? [`${process.env.NEXT_PUBLIC_APP_URL}${item.imageUrl}`]
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["NO", "SE", "DK", "GB", "DE", "FR", "NL", "US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        cart: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: item.name,
            variantName: item.variantName ?? null,
            variantOptions: item.variantOptions ?? [],
            price: item.price,
            quantity: item.quantity,
          })),
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}