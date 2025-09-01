import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req) => {
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

  const schools = await (
    await api({
      session: req.auth,
    })
  ).catalyst.schools.periods.list({
    id: req.nextUrl.searchParams.get("id") ?? undefined,
  });

  return Response.json(schools, {
    status: 200,
  });
});
