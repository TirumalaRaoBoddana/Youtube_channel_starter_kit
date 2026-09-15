import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { checkDailyQuota } from "@/lib/rate-limit";
import { logoToolSchema, bannerToolSchema, watermarkToolSchema, isSafePrompt } from "@/lib/validation/schemas";
import { collections, persist } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import { paletteFor } from "@/lib/utils/colors";
import { detectNiche } from "@/lib/ai/demo/niches";
import { enqueueJob, createImageGenRecord } from "@/lib/images/jobs";
import { generateAsset } from "@/lib/images/service";
import type { ChannelAnalysis, Project } from "@/lib/db/types";
import type { BrandBrief } from "@/lib/validation/schemas";

// Standalone image tools: build a lightweight project from the tool form so
// every tool shares the exact same ImageGenerationService pipeline as the
// full channel-kit flow.
export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const body = (await req.json().catch(() => null)) as { tool?: string } | null;
  if (!body?.tool) return fail("VALIDATION_ERROR", "Missing tool type.", 400);
  if (!["logo", "banner", "watermark"].includes(body.tool)) return fail("VALIDATION_ERROR", "Unknown tool.", 400);

  const quota = checkDailyQuota(idn.key, "image", idn.plan);
  if (!quota.allowed) {
    return fail("QUOTA_EXCEEDED", `You've used all ${quota.limit} image generations for today. ${idn.user ? "Upgrade to Pro for more." : "Create a free account for more."}`, 429);
  }

  const record = body as Record<string, unknown>;
  let channelName = ""; let niche = ""; let style: BrandBrief["style"] = "Modern";
  let tagline = ""; let colorPref: string | undefined; let wmKind: "initials" | "icon" = "initials";

  if (body.tool === "logo") {
    const p = logoToolSchema.safeParse(record);
    if (!p.success) return fail("VALIDATION_ERROR", p.error.issues[0]?.message ?? "Invalid input.", 400);
    channelName = p.data.channelName; niche = p.data.niche; style = p.data.style; colorPref = p.data.colorPreference;
  } else if (body.tool === "banner") {
    const p = bannerToolSchema.safeParse(record);
    if (!p.success) return fail("VALIDATION_ERROR", p.error.issues[0]?.message ?? "Invalid input.", 400);
    channelName = p.data.channelName; niche = p.data.niche; tagline = p.data.tagline; colorPref = p.data.colorPreference;
  } else {
    const p = watermarkToolSchema.safeParse(record);
    if (!p.success) return fail("VALIDATION_ERROR", p.error.issues[0]?.message ?? "Invalid input.", 400);
    channelName = p.data.channelName; wmKind = p.data.kind; colorPref = p.data.colorPreference;
    niche = "branding";
  }
  if (!isSafePrompt(channelName) || !isSafePrompt(niche)) {
    return fail("CONTENT_POLICY", "This request was blocked by our content policy.", 400);
  }

  const nicheProfile = detectNiche(niche);
  const palette = colorPref ? [colorPref, ...paletteFor(nicheProfile.key).slice(1)] : paletteFor(nicheProfile.key);
  const analysis: ChannelAnalysis = {
    channel_positioning: `Standalone ${body.tool} generation for ${channelName}.`,
    target_audience: niche,
    content_pillars: [], channel_names: [{ name: channelName, rationale: "Provided by user" }],
    channel_description: { short: "", seo: "" },
    channel_keywords: [], seo_keywords: { primary: [], secondary: [], long_tail: [] },
    brand_personality: nicheProfile.label, visual_style: nicheProfile.visualStyles[0],
    color_palette: [
      { name: "Primary", hex: palette[0], usage: "primary" },
      { name: "Secondary", hex: palette[1], usage: "secondary" },
      { name: "Accent", hex: palette[2], usage: "accent" },
      { name: "Background", hex: palette[3] ?? "#f8fafc", usage: "background" },
    ],
    font_recommendations: [], tagline, video_ideas: [], shorts_ideas: [], niche: nicheProfile.key,
  };

  const now = new Date().toISOString();
  const project: Project = {
    id: newId("prj"), userId: idn.user?.id ?? null, guestToken: idn.user ? null : idn.guestToken,
    idea: `${channelName} — ${niche}`, input: {}, analysis, status: "ready", createdAt: now, updatedAt: now,
  };
  collections.projects().push(project);
  persist();

  const brief: BrandBrief = {
    brand_name: channelName, visual_identity: nicheProfile.visualStyles[0], style,
    colors: [palette[0], palette[1], palette[2], palette[3] ?? "#f8fafc"],
    symbols: [], avoid: ["photorealistic faces", "cluttered text"],
  };

  const rec = createImageGenRecord({
    identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    projectId: project.id, provider: "image-pipeline", requestType: `tool_${body.tool}`,
  });

  enqueueJob(rec.id, async (update) => {
    update(20);
    const asset = await generateAsset({ project, brief, assetType: body.tool as "logo" | "banner" | "watermark", watermarkKind: wmKind, tagline });
    update(95);
    rec.result = { assetId: asset.id };
  });

  return ok({ jobId: rec.id, projectId: project.id });
}
