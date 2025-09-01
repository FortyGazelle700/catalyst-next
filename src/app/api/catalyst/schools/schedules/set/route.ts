import { z } from "zod";

import { auth } from "@/server/auth";
import { api } from "@/server/api";

const schema = z.object({
  schoolId: z.string().optional(),
  options: z.object({
    observeDST: z.boolean().default(false),
    timezone: z.string().default("America/New_York"),
  }),
  schedules: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      periods: z.array(
        z.object({
          start: z.string(),
          end: z.string(),
          order: z.number(),
          optionId: z.string(),
        }),
      ),
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
  ).catalyst.schools.schedules.set(result.data);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
