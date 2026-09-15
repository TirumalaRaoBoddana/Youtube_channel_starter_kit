import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { channelIdeaSchema, descriptionOnlySchema } from "@/lib/validation/schemas";
import { DESCRIPTION_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";
import { generateDemoAnalysis } from "@/lib/ai/demo/generator";

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);
  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  const parsed = channelIdeaSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);

  // Derive context from the submitted idea itself (never from unrelated prior
  // projects). The demo engine is a local, zero-cost way to get a niche-fit
  // name + pillars that the description prompt weaves in.
  const ctx = generateDemoAnalysis({ idea: parsed.data.idea });
  const names = ctx.channel_names[0]?.name;
  const pillars = ctx.content_pillars.map(p => p.name).join(", ");

  try {
    const result = await runStructuredText({
      system: DESCRIPTION_PROMPT.system,
      user: DESCRIPTION_PROMPT.user(parsed.data.idea, names, pillars),
      schema: descriptionOnlySchema,
      requestType: "channel_description",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });
    return ok({ ...result.data, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", e.message, 502);
    return fail("GENERATION_FAILED", "Something went wrong while generating the description. Please try again.", 500);
  }
}
