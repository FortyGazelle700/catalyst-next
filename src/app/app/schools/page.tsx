import { api } from "@/server/api";
import { auth } from "@/server/auth";
import { type Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "School",
};

export default async function SchoolPage() {
  const session = await auth();
  if (!session?.authorized) {
    redirect("/login");
    return;
  }

  const school_id = await unstable_cache(
    async () => {
      try {
        const apiClient = await api({
          session: session,
        });
        const { data: school_id } =
          await apiClient.catalyst.account.settings.get({
            key: "school_id",
          });
        return school_id;
      } catch (_err) {
        console.error(_err);
        notFound();
      }
    },
    [session?.user?.id ?? ""],
    {
      revalidate: 24 * 60 * 60,
    },
  )();

  if (!school_id) {
    notFound();
  }

  redirect(`/app/schools/${school_id}`);
}
