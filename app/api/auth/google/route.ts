import { NextRequest } from "next/server";
import { fail } from "@/lib/utils/api-response";
import { env } from "@/lib/config/env";

// Google OAuth redirect builder. Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.
export async function GET(req: NextRequest) {
  if (!env.google.clientId || !env.google.clientSecret) {
    return fail("NOT_CONFIGURED", "Google sign-in is not configured yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or use email sign-in.", 501);
  }
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.google.clientId);
  url.searchParams.set("redirect_uri", `${env.appUrl}/api/auth/google/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  return Response.redirect(url.toString(), 302);
}
