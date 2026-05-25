import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { firebaseUid, email } = session.metadata || {};

    try {
      await connectToDatabase();
      if (firebaseUid) {
        await User.findOneAndUpdate(
          { firebaseUid },
          { 
            plan: "Pro",
            aiCredits: 999999 // Unlimited
          }
        );
        console.log(`Successfully upgraded user ${email} to Pro plan.`);
      }
    } catch (dbError) {
      console.error("Database Error during webhook processing:", dbError);
    }
  }

  return NextResponse.json({ received: true });
}
