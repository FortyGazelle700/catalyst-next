"use server";

import { type ApiCtx } from "@/server/api";
import Stripe from "stripe";

export default async function pricing(_ctx: ApiCtx) {
  return async () => {
    const stripe = new Stripe(process.env.STRIPE_API ?? "");
    const defaultPrice = await stripe.products.retrieve(
      process.env.PRO_ID ?? "",
    );
    const data = await stripe.prices.list({ product: String(defaultPrice.id) });

    return {
      success: true,
      data: data.data,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
