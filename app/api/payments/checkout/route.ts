import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { payments, paymentsEnabled } from "@/lib/payments";
import { track } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const g = guardApi(req, { requireUser: true });
  if (g.error) return g.error;
  if (!paymentsEnabled) {
    return fail("PAYMENTS_NOT_CONFIGURED", "Pro checkout is not enabled yet. Set PAYMENT_PROVIDER and PAYMENT_SECRET_KEY to activate subscriptions.", 501);
  }
  try {
    const { url } = await payments.createCheckout({ userId: g.user!.id, plan: "pro" });
    track("subscription_started", { userId: g.user!.id, guestToken: null });
    return ok({ url });
  } catch {
    return fail("CHECKOUT_FAILED", "We couldn't start checkout. Please try again.", 500);
  }
}
