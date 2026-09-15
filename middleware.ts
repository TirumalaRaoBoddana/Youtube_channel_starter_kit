import { NextResponse, type NextRequest } from "next/server";

// Issues the anonymous guest token cookie (guest projects + quota identity).
// The token is also forwarded as a request header so server code sees the SAME
// token the client is about to receive — critical when the very first request
// of a session is an API call (cookies can't be written during RSC rendering).
export function middleware(req: NextRequest) {
  const existing = req.cookies.get("cf_guest")?.value;
  if (existing) return NextResponse.next();

  const token = `g_${crypto.randomUUID().replace(/-/g, "")}`;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-cf-guest", token);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.cookies.set("cf_guest", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 3600,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
