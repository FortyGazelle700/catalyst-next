import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/server/api";
import { ArrowRight, Check, X } from "lucide-react";

export default async function ConfirmUpgradePage() {
  const { data: isPro } = await (await api({})).catalyst.account.isPro();
  const you = await (await api({})).catalyst.getCtx();

  if (!isPro) {
    return (
      <div className="@container px-8 py-16">
        <div className="mx-auto flex w-[min(80ch,100%)] flex-col gap-4 rounded-md border p-4">
          <h1 className="text-4xl font-bold">
            Hmm, it looks like we are still processing your upgrade
          </h1>
          <div className="flex w-full flex-col gap-4">
            <p className="text-muted-foreground">
              If you just upgraded, please allow a few minutes for the changes
              to take effect. If this issue is not resolved within 24 hours,
              please contact support.
            </p>
          </div>
          <div className="flex justify-between">
            <Button href="/app/settings?page=/upgrade" variant="secondary">
              <X /> Cancel
            </Button>
            <Button href="/app/settings?page=/upgrade" disabled>
              Close <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container px-8 py-16">
      <div className="mx-auto flex w-[min(80ch,100%)] flex-col gap-4 rounded-md border p-4">
        <h1 className="text-4xl font-bold">Thank you!!</h1>
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col items-stretch gap-4 @4xl:flex-row">
            <div className="flex h-48 flex-1 flex-col justify-end rounded-md border p-4">
              <h3 className="text-3xl font-bold">Pro Upgrade</h3>
              <p className="font-bold">You are now a Pro User! 🎉</p>
              <p className="text-muted-foreground text-xs italic">
                You will now have access to all Pro features.
              </p>
            </div>
            <div className="flex shrink-0 rotate-90 flex-col items-center justify-center @4xl:rotate-0">
              <Check />
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
          <Button href="/app/settings?page=%2Fupgrade" variant="secondary">
            <X /> Cancel
          </Button>
          <Button href="/app/settings?page=%2Fupgrade">
            Close <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
