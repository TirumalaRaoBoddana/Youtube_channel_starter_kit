import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { channelIdeaSchema, channelAnalysisSchema } from "@/lib/validation/schemas";
import { CHANNEL_ANALYSIS_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota, endpointRateLimit } from "@/lib/rate-limit";
import { collections, persist } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import { track } from "@/lib/analytics";
import { logger } from "@/lib/utils/logger";
import { maxProjects } from "@/lib/features/plans";
import type { Project, ChannelAnalysis } from "@/lib/db/types";

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  if (!endpointRateLimit(`analyze:${idn.ip}`, 10)) {
    return fail("RATE_LIMITED", "Too many requests. Please slow down a little.", 429);
  }

  // Validate BEFORE charging quota — an invalid request must not burn the
  // daily allowance (the endpoint burst limiter above guards spam).
  const parsed = channelIdeaSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Please check your input.", 400);
  }
  const input = parsed.data;

  if (idn.user && collections.projects().filter(p => p.userId === idn.user!.id).length >= maxProjects(idn.plan)) {
    return fail("PROJECT_LIMIT", "You've reached your saved project limit. Delete a project or upgrade to Pro.", 403);
  }

  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) {
    return fail("QUOTA_EXCEEDED", `You've used all ${quota.limit} free generations for today. ${idn.user ? "Upgrade to Pro for higher limits." : "Create a free account for more daily generations."}`, 429);
  }

  track("channel_generation_started", { userId: idn.user?.id ?? null, guestToken: idn.guestToken });

  try {
    const result = await runStructuredText<ChannelAnalysis>({
      system: CHANNEL_ANALYSIS_PROMPT.system,
      user: CHANNEL_ANALYSIS_PROMPT.user(input),
      schema: channelAnalysisSchema,
      requestType: "channel_analysis",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });

    const now = new Date().toISOString();
    const project: Project = {
      id: newId("prj"), userId: idn.user?.id ?? null, guestToken: idn.user ? null : idn.guestToken,
      idea: input.idea, input: { ...input, idea: undefined } as Project["input"],
      analysis: result.data, status: "ready", createdAt: now, updatedAt: now,
    };
    collections.projects().push(project);

    // Denormalized copies for the dashboard/keyword pages.
    collections.brandKits().push({
      id: newId("bkt"), projectId: project.id,
      name: result.data.channel_names[0]?.name ?? "Your Channel",
      tagline: result.data.tagline,
      colors: {
        primary: result.data.color_palette[0]?.hex ?? "#4f46e5",
        secondary: result.data.color_palette[1]?.hex ?? "#8b5cf6",
        accent: result.data.color_palette[2]?.hex ?? "#f59e0b",
        background: result.data.color_palette[3]?.hex ?? "#f8fafc",
      },
      fonts: {
        heading: result.data.font_recommendations[0]?.name ?? "Space Grotesk",
        body: result.data.font_recommendations[1]?.name ?? "Inter",
      },
      logoStyle: "Modern", updatedAt: now,
    });
    collections.keywordSets().push({
      id: newId("kw"), projectId: project.id, groups: result.data.channel_keywords, source: "ai", createdAt: now,
    });
    for (const v of result.data.video_ideas) {
      collections.contentIdeas().push({ id: newId("cid"), projectId: project.id, kind: "long", ...v, createdAt: now });
    }
    for (const s of result.data.shorts_ideas) {
      collections.contentIdeas().push({ id: newId("cid"), projectId: project.id, kind: "short", ...s, createdAt: now });
    }
    persist();

    track("channel_generation_completed", { userId: idn.user?.id ?? null, guestToken: idn.guestToken }, { provider: result.provider });

    return ok({ projectId: project.id, analysis: result.data, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", e.message, 502);
    logger.error("analyze_failed", { error: String(e) });
    return fail("GENERATION_FAILED", "Something went wrong while analyzing your idea. Please try again.", 500);
  }
}
