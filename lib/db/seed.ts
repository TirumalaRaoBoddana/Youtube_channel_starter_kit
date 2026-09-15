import { collections, persistNow } from "./index";
import { generateDemoAnalysis } from "../ai/demo/generator";
import { generateAsset, buildBriefFromProject } from "../images/service";
import { newId } from "../utils/id";
import { logger } from "../utils/logger";
import type { Project } from "./types";

// Seeds ONE public demo project (spec: demo mode, no fake user accounts).
// Demo assets are rendered through the same ImageGenerationService as real
// requests, so the demo is a genuine product output.
export async function seedDemoData() {
  if (collections.projects().some(p => p.id.startsWith("demo_"))) return;

  const idea = "I want to create a channel explaining AI and mathematics to beginners";
  const analysis = generateDemoAnalysis({ idea, targetAudience: "students and self-taught programmers", contentType: "Educational", personality: "Educational" });

  const now = new Date().toISOString();
  const project: Project = {
    id: "demo_math_of_ai",
    userId: null,
    guestToken: "demo_public",
    idea,
    input: { targetAudience: "students and self-taught programmers", contentType: "Educational", personality: "Educational", language: "English" },
    analysis,
    status: "ready",
    createdAt: now,
    updatedAt: now,
  };
  collections.projects().push(project);

  collections.brandKits().push({
    id: newId("bkt"), projectId: project.id,
    name: analysis.channel_names[0]?.name ?? "The Math of AI",
    tagline: analysis.tagline,
    colors: {
      primary: analysis.color_palette[0]?.hex ?? "#4f46e5",
      secondary: analysis.color_palette[1]?.hex ?? "#8b5cf6",
      accent: analysis.color_palette[2]?.hex ?? "#f59e0b",
      background: analysis.color_palette[3]?.hex ?? "#f8fafc",
    },
    fonts: {
      heading: analysis.font_recommendations[0]?.name ?? "Space Grotesk",
      body: analysis.font_recommendations[1]?.name ?? "Inter",
    },
    logoStyle: "Modern", updatedAt: now,
  });
  collections.keywordSets().push({ id: newId("kw"), projectId: project.id, groups: analysis.channel_keywords, source: "ai", createdAt: now });
  for (const v of analysis.video_ideas) collections.contentIdeas().push({ id: newId("cid"), projectId: project.id, kind: "long", ...v, createdAt: now });
  for (const s of analysis.shorts_ideas) collections.contentIdeas().push({ id: newId("cid"), projectId: project.id, kind: "short", ...s, createdAt: now });
  persistNow();

  try {
    const brief = buildBriefFromProject(project);
    await generateAsset({ project, brief, assetType: "logo" });
    await generateAsset({ project, brief, assetType: "banner", tagline: analysis.tagline, uploadSchedule: "New videos every Tuesday & Friday" });
    await generateAsset({ project, brief, assetType: "watermark", watermarkKind: "initials" });
  } catch (e) {
    logger.warn("demo_asset_seed_failed", { error: String(e) });
  }
  logger.info("demo_seed_complete", { projectId: project.id });
}
