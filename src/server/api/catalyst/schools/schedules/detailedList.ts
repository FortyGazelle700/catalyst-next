import { type ApiCtx } from "@/server/api";

export default async function details(_: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { api } = await import("@/server/api");

    const { data: scheduleList } = await (
      await api({})
    ).catalyst.schools.schedules.list({ id });

    const schedules = await Promise.all(
      scheduleList.map(async (schedule) => {
        const { data: periods } = await (
          await api({})
        ).catalyst.schools.schedules.details({
          schoolId: schedule.schoolId ?? "",
          scheduleId: schedule.id,
        });
        return { ...schedule, periods };
      }),
    );

    return {
      success: true,
      data: schedules,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
