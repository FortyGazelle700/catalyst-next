import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const OverrideSchema = z.object({
  dueDate: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  customStatus: z
    .enum(["none", "stuck", "in_progress", "completed"])
    .nullable()
    .optional(),
});

export const POST = auth(
  async (
    req,
    ctx: {
      params: Promise<{ course: string; assignment: string }>;
    },
  ) => {
    const body = (await req.json()) as z.infer<typeof OverrideSchema>;
    const parsed = OverrideSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          data: [],
          errors: parsed.error.errors.map((err) => ({
            message: err.message,
            path: err.path,
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
    ).canvas.courses.assignments.overrides.set({
      ...parsed.data,
      courseId: (await ctx.params).course,
      assignmentId: (await ctx.params).assignment,
    });

    return Response.json(response, {
      status: response.success ? 200 : 400,
    });
  },
);
