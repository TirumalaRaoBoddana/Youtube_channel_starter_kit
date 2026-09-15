import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { videoIdeaToolSchema, videoIdeasOnlySchema } from "@/lib/validation/schemas";
import { VIDEO_IDEAS_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);
  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  const parsed = videoIdeaToolSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);

  try {
    const result = await runStructuredText({
      system: VIDEO_IDEAS_PROMPT.system,
      user: VIDEO_IDEAS_PROMPT.user(parsed.data.niche, parsed.data.contentType ?? "mixed"),
      schema: videoIdeasOnlySchema,
      requestType: "video_ideas",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });
    return ok({ ...result.data, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", e.message, 502);
    return fail("GENERATION_FAILED", "Something went wrong while generating ideas. Please try again.", 500);
  }
}
