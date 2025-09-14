"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiCtx } from "@/server/api";
import {
  ArrowRight,
  ArrowUpToLine,
  DollarSign,
  Gem,
  ListTree,
  UserCircle,
} from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type Stripe from "stripe";

export default function GeneralSettings({
  setLink,
  isPro,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
  isPro: boolean;
}) {
  const [plans, setPlans] = useState<
    Stripe.Response<Stripe.ApiList<Stripe.Price>>["data"]
  >([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/catalyst/pro/pricing", {
        cache: "force-cache",
        next: { revalidate: 24 * 60 * 60 * 1000 },
      });
      const { success, data } = (await response.json()) as {
        success: boolean;
        data: Stripe.Response<Stripe.ApiList<Stripe.Price>>["data"];
        errors: { message: string }[];
      };
      if (success) {
        setPlans(data);
      }
    })().catch(console.error);
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Gem /> Pro Status
        </h2>
      </div>
      <div className="flex gap-4">
        <span className="text-muted-foreground flex w-full items-center justify-center py-8 text-xs">
          {isPro ? "Pro!! 🎉" : "Not upgraded yet"}
        </span>
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <DollarSign /> Plans
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        {plans.length == 0 &&
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton className="h-36 w-full rounded-sm border p-4" key={idx} />
          ))}
        {plans
          ?.sort((a, b) =>
            (a.recurring?.interval_count ?? 0) *
              (a.recurring?.interval == "year" ? 12 : 1) >
            (b.recurring?.interval_count ?? 0) *
              (b.recurring?.interval == "year" ? 12 : 1)
              ? 1
              : -1,
          )
          .reverse()
          .map((plan, idx) => (
            <div
              key={plan.id}
              className="flex h-36 items-end justify-between rounded-sm border p-4"
            >
              <h3 className="text-xl font-bold">{plan.nickname}</h3>
              <div className="flex h-full flex-col items-end gap-1">
                <Button
                  className="mb-auto h-8 text-xs"
                  variant={idx == 0 ? "default" : "secondary"}
                  href={`/app/upgrade/confirm?id=${plan.id}`}
                >
                  Upgrade <ArrowUpToLine className="size-4" />
                </Button>
                <p className="font-bold">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: plan.currency,
                  }).format(
                    (plan.unit_amount ?? 0) /
                      100 /
                      ((plan.recurring?.interval_count ?? 0) *
                        (plan.recurring?.interval == "year" ? 12 : 1)),
                  )}
                  /mo
                </p>
                <p className="text-muted-foreground text-xs italic">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: plan.currency,
                  }).format((plan.unit_amount ?? 0) / 100)}
                  /
                  {(plan.recurring?.interval_count ?? 0) == 1
                    ? ""
                    : (plan.recurring?.interval_count ?? 0)}
                  {plan.recurring?.interval == "year" ? "yr" : "mo"}
                </p>
              </div>
            </div>
          ))
          .reverse()}
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <ListTree /> Related Settings
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/account")}
        >
          <div className="flex items-center gap-3">
            <UserCircle className="size-6" />
            <span>Account</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
