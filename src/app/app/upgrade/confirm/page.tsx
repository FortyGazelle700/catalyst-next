import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/server/api";
import { ArrowRight, X } from "lucide-react";

export default async function ConfirmUpgradePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { data: pricing } = await (await api({})).catalyst.pro.pricing();
  const planId = (await searchParams).id;
  const plan = pricing.find((plan) => plan.id == planId);
  const you = await (await api({})).catalyst.getCtx();

  if (!plan) {
    return (
      <div className="@container px-8 py-16">
        <div className="mx-auto flex w-[min(80ch,100%)] flex-col gap-4 rounded-md border p-4">
          <h1 className="text-4xl font-bold">
            An Error Occurred While Upgrading
          </h1>
          <div className="flex w-full flex-col gap-4">
            <p className="text-muted-foreground">
              We encountered an error while processing your upgrade. Please try
              again later.
            </p>
          </div>
          <div className="flex justify-between">
            <Button href="/app/settings?page=%2Fupgrade" variant="secondary">
              <X /> Cancel
            </Button>
            <Button disabled>
              Confirm <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { data: pay } = await (
    await api({})
  ).catalyst.pro.pay({
    priceId: planId ?? "",
  });

  return (
    <div className="@container px-8 py-16">
      <div className="mx-auto flex w-[min(80ch,100%)] flex-col gap-4 rounded-md border p-4">
        <h1 className="text-4xl font-bold">Confirm Upgrade?</h1>
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col items-stretch gap-4 @4xl:flex-row">
            <div className="flex h-48 flex-1 flex-col justify-end rounded-md border p-4">
              <h3 className="text-3xl font-bold">{plan.nickname} Upgrade</h3>
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
            <div className="flex shrink-0 rotate-90 flex-col items-center justify-center @4xl:rotate-0">
              <ArrowRight />
            </div>
            <div className="flex h-48 flex-1 flex-col justify-end rounded-md border p-4">
              <UserAvatar
                name={`${you.user.settings.f_name} ${you.user.settings.l_name}`}
                image={you.session?.user?.image ?? undefined}
                className="size-10"
              />
              <h3 className="text-2xl font-bold">
                {you.user.settings.f_name} {you.user.settings.l_name}
              </h3>
              <p className="text-muted-foreground text-xs italic">
                {you.session?.user?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button href="/app/settings?page=/upgrade" variant="secondary">
            <X /> Cancel
          </Button>
          <Button href={pay.url ?? ""}>
            Confirm <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
