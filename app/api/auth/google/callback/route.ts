import { NextRequest } from "next/server";
import { env } from "@/lib/config/env";
import { collections, persistNow } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import { createSession } from "@/lib/auth/session";

// Google OAuth callback: exchanges the code, then signs the user in.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });
  if (!env.google.clientId || !env.google.clientSecret) return new Response("Google OAuth not configured", { status: 501 });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, client_id: env.google.clientId, client_secret: env.google.clientSecret,
      redirect_uri: `${env.appUrl}/api/auth/google/callback`, grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return new Response("Token exchange failed", { status: 502 });
  const tokens = await tokenRes.json() as { id_token: string };

  const claims = JSON.parse(Buffer.from(tokens.id_token.split(".")[1], "base64url").toString()) as { email: string; name?: string };
  let user = collections.users().find(u => u.email.toLowerCase() === claims.email.toLowerCase());
  if (!user) {
    user = {
      id: newId("usr"), email: claims.email.toLowerCase(), name: claims.name ?? claims.email.split("@")[0],
      passwordHash: null,
      role: env.adminEmails.includes(claims.email.toLowerCase()) ? "admin" : "user",
      plan: "free", disabled: false, createdAt: new Date().toISOString(),
    };
    collections.users().push(user);
    persistNow();
  }
  createSession(user.id);
  return Response.redirect(`${env.appUrl}/dashboard`, 302);
}
