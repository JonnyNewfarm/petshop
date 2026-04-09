import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.payment_status === "paid" || session.status === "complete";

    return NextResponse.json({
      paid,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? "usd",
    });
  } catch (error) {
    console.error("Verify checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to verify checkout session" },
      { status: 500 }
    );
  }
}