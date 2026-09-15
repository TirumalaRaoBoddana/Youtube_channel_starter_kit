import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { track } from "@/lib/analytics";
import { resolveIdentity } from "@/lib/auth/identity";
import { z } from "zod";

const schema = z.object({ name: z.string().min(2).max(60), props: z.record(z.unknown()).optional() });
const ALLOWED = new Set([
  "landing_page_view", "channel_generation_started", "channel_generation_completed",
  "logo_generated", "banner_generated", "watermark_generated", "keyword_generated",
  "download_clicked", "signup_completed", "subscription_started", "tool_used", "example_clicked",
]);

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !ALLOWED.has(parsed.data.name)) return fail("VALIDATION_ERROR", "Unknown event.", 400);
  const idn = resolveIdentity(req);
  track(parsed.data.name, { userId: idn.user?.id ?? null, guestToken: idn.guestToken }, parsed.data.props ?? {});
  return ok({ tracked: true });
}
