"use server";

import { type ApiCtx } from "@/server/api";
import Stripe from "stripe";

export default async function isPro(ctx: ApiCtx) {
  return async ({ priceId }: { priceId: string }) => {
    const stripe = new Stripe(process.env.STRIPE_API ?? "");
    let customer = (
      await stripe.customers.list({
        email: ctx.user.get?.email,
      })
    ).data[0];
    customer ??= await stripe.customers.create({
      email: ctx.user.get?.email,
      metadata: {
        catalyst_user_id: ctx.user.get?.id ?? "guest",
      },
    });
    if (customer.metadata.catalyst_user_id != ctx.user.get?.id) {
      await stripe.customers.update(customer.id, {
        metadata: {
          catalyst_user_id: ctx.user.get?.id ?? "guest",
        },
      });
    }
    const url = new URL("/app/upgrade/success", process.env.PUBLISH_URL);

    const data = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      success_url: url.toString(),
    });

    return {
      success: true,
      data: data,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
