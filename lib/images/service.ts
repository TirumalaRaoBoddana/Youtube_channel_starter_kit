import "server-only";
import sharp from "sharp";
import { imageProviderChain } from "../ai/providers/image";
import { ProviderError } from "../ai/types";
import { LOGO_PROMPT, BANNER_PROMPT, WATERMARK_PROMPT } from "../ai/prompts";
import { storage } from "../storage";
import { collections, persist } from "../db";
import { newId } from "../utils/id";
import { logger } from "../utils/logger";
import type { AssetType, GeneratedAsset, Project } from "../db/types";
import type { BrandBrief } from "../validation/schemas";

// YouTube brand asset specifications (current recommended sizes).
export const SPECS = {
  logo: { width: 800, height: 800 },          // square profile picture (YT min 98x98, 800 crisp)
  banner: { width: 2560, height: 1440 },      // recommended upload size
  bannerSafeArea: { width: 1546, height: 425 }, // text/logo safe area
  watermark: { width: 300, height: 300 },     // recommended >=150x150, 300 for retina
} as const;

// ImageGenerationService: builds structured prompts from a brand brief,
// calls the provider chain, then post-processes (crop/resize/optimize) and
// stores via StorageService. Never returns raw provider output.

export interface GenerateAssetInput {
  project: Project;
  brief: BrandBrief;
  assetType: AssetType;
  watermarkKind?: "logo" | "initials" | "icon";
  tagline?: string;
  uploadSchedule?: string;
}

export async function generateAsset(input: GenerateAssetInput): Promise<GeneratedAsset> {
  const { assetType, brief, project } = input;
  const spec = SPECS[assetType];

  // Machine-readable brief header lets provider-agnostic post steps (and the
  // demo renderer) recover structure without parsing natural language.
  const header = [
    `BRAND_NAME: ${brief.brand_name}`,
    `BRAND_STYLE: ${brief.style}`,
    `BRAND_COLORS: ${brief.colors.join(",")}`,
    brief.symbols.length ? `BRAND_SYMBOLS: ${brief.symbols.join(",")}` : "",
    brief.avoid.length ? `BRAND_AVOID: ${brief.avoid.join(",")}` : "",
    input.tagline ? `BRAND_TAGLINE: ${input.tagline}` : "",
    input.uploadSchedule ? `BRAND_SCHEDULE: ${input.uploadSchedule}` : "",
  ].filter(Boolean).join("\n");

  let prompt: string;
  if (assetType === "logo") prompt = `${header}\n\n${LOGO_PROMPT.build({ ...brief, style: brief.style })}`;
  else if (assetType === "banner") prompt = `${header}\n\n${BANNER_PROMPT.build({ brand_name: brief.brand_name, tagline: input.tagline ?? "", style: brief.style, colors: brief.colors, uploadSchedule: input.uploadSchedule })}`;
  else prompt = `${header}\n\n${WATERMARK_PROMPT.build({ brand_name: brief.brand_name, kind: input.watermarkKind ?? "initials", colors: brief.colors })}${input.watermarkKind === "icon" ? " (icon style)" : ""}`;

  let bytes: Buffer | null = null;
  let providerUsed = "";
  let lastError: unknown = null;
  for (const provider of imageProviderChain()) {
    if (!provider.isConfigured()) continue;
    try {
      const res = await provider.generateImage({ prompt, width: spec.width, height: spec.height });
      bytes = res.bytes;
      providerUsed = provider.name;
      break;
    } catch (e) {
      lastError = e;
      logger.warn("image_generation_attempt_failed", { provider: provider.name, assetType, error: String(e) });
      if (e instanceof ProviderError && !e.retryable) break;
    }
  }
  if (!bytes) throw new Error(lastError instanceof Error ? lastError.message : "All image providers failed.");

  // ── post-processing: exact spec size, optimization ──
  const processed = await sharp(bytes)
    .resize(spec.width, spec.height, { fit: "cover", position: "centre" })
    .png({ quality: 90, compressionLevel: 8 })
    .toBuffer();

  const assetId = newId("ast");
  const storageKey = `projects/${project.id}/${assetType}/${assetId}.png`;
  await storage.put(storageKey, processed, "image/png");

  const asset: GeneratedAsset = {
    id: assetId, projectId: project.id, assetType, storageKey,
    mimeType: "image/png", width: spec.width, height: spec.height,
    promptSummary: prompt.split("\n\n").pop()?.slice(0, 200) ?? "",
    provider: providerUsed, createdAt: new Date().toISOString(),
  };
  // replace previous asset of same type (regeneration replaces, keeps history clean)
  const db = collections.assets();
  const idx = db.findIndex(a => a.projectId === project.id && a.assetType === assetType);
  if (idx >= 0) {
    void storage.delete(db[idx].storageKey);
    db[idx] = asset;
  } else {
    db.push(asset);
  }
  persist();
  return asset;
}

export function buildBriefFromProject(project: Project, overrides: Partial<BrandBrief> = {}): BrandBrief {
  const a = project.analysis;
  const palette = a?.color_palette ?? [];
  return {
    brand_name: a?.channel_names[0]?.name ?? project.idea.slice(0, 40),
    visual_identity: a?.visual_style ?? "clean modern design",
    style: (overrides.style ?? "Modern") as BrandBrief["style"],
    colors: palette.length >= 3 ? [palette[0].hex, palette[1].hex, palette[2].hex, palette[3]?.hex ?? "#f8fafc"] : ["#4f46e5", "#8b5cf6", "#f59e0b", "#f8fafc"],
    symbols: overrides.symbols ?? [],
    avoid: overrides.avoid ?? ["photorealistic faces", "cluttered text", "watermarks of other brands"],
  };
}
