import { z } from "zod";

import { api } from "@/server/api";

export const POST = async (req: Request) => {
  const body = await req.json();

  const schema = z.object({
    category: z.string(),
    importance: z.string(),
    title: z.string(),
    description: z.string(),
    pathname: z.string(),
    date: z.string(),
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
  ).catalyst.support.feedback.provide({
    ...result.data,
    date: new Date(result.data.date),
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
