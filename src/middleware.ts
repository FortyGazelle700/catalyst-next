export { auth as authMiddleware } from "@/server/auth";

import { type NextRequest, NextResponse, userAgent } from "next/server";

export async function middleware(request: NextRequest) {
  // Store current request url in a custom header, which you can read later
  const { ua } = userAgent(request);
  const headersList = request.headers;
  const ip = headersList.get("x-forwarded-for");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-ip", ip ?? "<unknown>");
  requestHeaders.set("x-ua", ua ?? "<unknown>");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
