import { auth } from "@/server/auth";

export const GET = auth(async (req) => {
  if (req.auth?.authorized) {
    return Response.json(
      {
        success: true,
        data: {
          message: "pong",
        },
        errors: [],
      },
      {
        status: 200,
      },
    );
  } else {
    return Response.json(
      {
        success: false,
        data: null,
        errors: [
          {
            message: "Unauthorized",
          },
        ],
      },
      {
        status: 401,
      },
    );
  }
});
