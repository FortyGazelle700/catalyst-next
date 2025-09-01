import { z } from "zod";

import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { periodType } from "@/server/db/schema";

const schema = z.object({
  periods: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      name: z.string(),
      options: z
        .array(
          z.object({
            id: z.string(),
            order: z.number(),
            name: z.string(),
          }),
        )
        .optional(),
      type: z.enum(periodType.enumValues),
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
  ).catalyst.schools.periods.set(result.data);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
