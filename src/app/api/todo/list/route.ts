import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const TodoListSchema = z.object({
  search: z.object({
    title: z.string(),
    description: z.string(),
    start: z.string(),
    end: z.string(),
    completed: z.enum(["yes", "no", "all"]),
    courses: z.array(z.string()),
    status: z.array(z.enum(["", "graded", "submitted", "unsubmitted"])),
  }),
  sort: z.array(
    z.enum(["title", "status", "date", "description", "completed", "course"]),
  ),
});

type Searchable = { includes: string };

export const POST = auth(async (req) => {
  const { data: body, error } = TodoListSchema.safeParse(await req.json());

  if (error) {
    return Response.json(
      { error: "Invalid request body", details: error.errors },
      { status: 400 },
    );
  }

  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.todo.list({
    search: {
      title: body.search.title as unknown as Searchable,
      description: body.search.description as unknown as Searchable,
      start: body.search.start ? new Date(body.search.start) : new Date(),
      end: body.search.end ? new Date(body.search.end) : new Date(),
      completed: body.search.completed,
      courses: body.search.courses,
      status: body.search.status,
    },
    sort: body.sort,
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
