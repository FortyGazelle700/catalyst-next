import { api } from "@/server/api";

export const POST = async (req: Request) => {
  const body = await req.json();

  const response = await (
    await api({})
  ).canvas.todo.list({
    search: {
      title: {
        includes: body.search.title,
      },
      description: {
        includes: body.search.description,
      },
      start: new Date(body.search.start),
      end: new Date(body.search.end),
      completed: body.search.completed,
      courses: body.search.courses,
      status: body.search.status,
    },
    sort: body.sort,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
