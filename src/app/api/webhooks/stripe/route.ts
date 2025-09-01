import { proUsers, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_API ?? "");
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig ?? "",
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntentSucceeded = event.data.object;
      const customer = await stripe.customers.retrieve(
        paymentIntentSucceeded.customer as string,
      );
      const invoice = await stripe.invoices.retrieve(
        String(paymentIntentSucceeded.id),
      );
      const user = (
        await db
          .select()
          .from(users)
          .where(eq(users.email, String("email" in customer && customer.email)))
      )[0] ?? { id: "" };
      await db.insert(proUsers).values({
        userId: user.id,
        expires: new Date(
          Number((invoice.lines.data[0]?.period.end ?? 0) * 1000),
        ),
      });
      break;
    }
    default:
      console.error(`Unhandled event type ${event.type}`);
  }

  return new Response("Webhook received", { status: 200 });
}
