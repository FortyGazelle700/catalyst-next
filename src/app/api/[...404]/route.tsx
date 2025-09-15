function returner() {
  return new Response(
    JSON.stringify({
      success: false,
      data: null,
      errors: [{ message: "404 — Api Route Not Found" }],
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 404,
    },
  );
}

export const GET = returner;
export const POST = returner;
export const PUT = returner;
export const DELETE = returner;
export const PATCH = returner;
