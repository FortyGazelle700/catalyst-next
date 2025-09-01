import { z } from "zod";

import { auth } from "@/server/auth";
import { api } from "@/server/api";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z
    .string()
    .min(1, "State is required")
    .max(2, "State must be 2 characters"),
  zip: z.string().min(1, "Zip code is required"),
  canvasUrl: z.string().url("Canvas URL must be a valid URL"),
});

export const POST = auth(async (req) => {
  const body = (await req.json()) as z.infer<typeof schema>;

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
      },
    );
  }

  const response = await (
    await api({
      session: req.auth,
    })
  ).catalyst.schools.create(result.data);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
