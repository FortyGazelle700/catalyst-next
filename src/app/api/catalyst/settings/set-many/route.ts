import { z } from "zod";

import { api } from "@/server/api";

export const POST = async (req: Request) => {
  const body = await req.json();

  const schema = z.object({
    settings: z.record(z.string()),
  });

  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        success: false,
        data: [],
        errors: result.error.errors.map((error) => ({
          message: error.message,
        })),
      },
      {
        status: 400,
      }
    );
  }

  const response = await (
    await api({})
  ).catalyst.settings.setMany(result.data?.settings);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
