import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { keywordToolSchema, keywordsOnlySchema } from "@/lib/validation/schemas";
import { KEYWORDS_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";

// KeywordService note: keywords are labelled "AI suggested". Verified search
// data requires an external keyword provider (KeywordService extension point);
// we never present AI output as live volume data.
export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);
  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  const parsed = keywordToolSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);

  try {
    const result = await runStructuredText({
      system: KEYWORDS_PROMPT.system,
      user: KEYWORDS_PROMPT.user(parsed.data.niche + (parsed.data.language ? ` (language: ${parsed.data.language})` : "")),
      schema: keywordsOnlySchema,
      requestType: "channel_keywords",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });
    return ok({ ...result.data, source: "ai" as const, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", e.message, 502);
    return fail("GENERATION_FAILED", "Something went wrong while generating keywords. Please try again.", 500);
  }
}
