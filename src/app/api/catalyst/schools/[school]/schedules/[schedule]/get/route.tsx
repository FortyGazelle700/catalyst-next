import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(
  async (
    req,
    { params }: { params: Promise<{ school: string; schedule: string }> },
  ) => {
    if (!req.auth) {
      return Response.json(
        {
          success: false,
          errors: [{ message: "Unauthorized" }],
          data: null,
        },
        { status: 400 },
      );
    }

    const schedules = await (
      await api({
        session: req.auth,
      })
    ).catalyst.schools.schedules.list({
      id: (await params).school,
    });

    const scheduleId = (await params).schedule;

    return Response.json(
      {
        data: schedules.data.find((s) => s.id == scheduleId) ?? null,
        errors: schedules.errors,
        success: schedules.success,
      },
      {
        status: 200,
      },
    );
  },
);
