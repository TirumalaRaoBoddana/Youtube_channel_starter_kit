import { NextRequest } from "next/server";
import { payments, paymentsEnabled } from "@/lib/payments";
import { collections, persistNow } from "@/lib/db";
import { logger } from "@/lib/utils/logger";

// Provider webhooks update subscription state server-side.
// Client-side payment status is NEVER trusted.
export async function POST(req: NextRequest) {
  if (!paymentsEnabled) return new Response("not configured", { status: 501 });
  const payload = await req.text();
  const event = await payments.verifyWebhook(payload, req.headers.get("x-signature"));
  if (!event) return new Response("invalid signature", { status: 400 });

  if (event.userId && event.status) {
    const user = collections.users().find(u => u.id === event.userId);
    if (user) {
      user.plan = event.status === "active" ? "pro" : "free";
      persistNow();
    }
  }
  logger.info("payment_webhook", { type: event.type });
  return new Response("ok");
}
