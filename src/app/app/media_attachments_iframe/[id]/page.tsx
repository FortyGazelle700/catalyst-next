import { api } from "@/server/api";
import { redirect } from "next/navigation";

export default async function ExternalIframePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = (await api({})).canvas.getCtx();

  redirect(
    new URL(
      `/media_attachments_iframe/${(await params).id}`,
      (await ctx).user.canvas.url ?? "",
    ).toString(),
  );
}
