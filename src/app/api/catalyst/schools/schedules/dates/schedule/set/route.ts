import { z } from "zod";

import { auth } from "@/server/auth";
import { api } from "@/server/api";

const schema = z.object({
  id: z.string().optional(),
  dates: z.array(
    z.object({
      repeat: z.number(),
      scheduleId: z.string(),
    }),
  ),
});

export const POST = auth(async (req) => {
  const body = (await req.json()) as z.infer<typeof schema>;

  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        success: false,
        data: [],
        errors: result.error.errors,
      },
      {
        status: 400,
      },
    );
  }

  const response = await (
    await api({
      session: req.auth,
    })
  ).catalyst.schools.schedules.dates.schedule.set(result.data);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
