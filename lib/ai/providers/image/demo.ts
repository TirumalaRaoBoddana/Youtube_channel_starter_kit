import sharp from "sharp";
import type { ImageAIProvider, GenerateImageOptions } from "../../types";
import { renderLogoSvg, renderBannerSvg, renderWatermarkSvg, type SvgBrand } from "../../../images/svg";

// Demo image provider: renders real, brand-styled PNG artwork locally from
// structured brand briefs. Used when no image API key is configured, so every
// feature works end-to-end offline. Swap via IMAGE_AI_PROVIDER=openai|gemini.
export class DemoImageProvider implements ImageAIProvider {
  readonly name = "demo";
  readonly model = "channelforge-svg-renderer-v1";
  isConfigured() { return true; }

  async generateImage(opts: GenerateImageOptions): Promise<{ bytes: Buffer; mimeType: string }> {
    const brand = parseBrief(opts.prompt);
    let svg: string;
    if (opts.width >= 2000) svg = renderBannerSvg(brand, opts.width, opts.height);
    else if (opts.prompt.includes("watermark")) svg = renderWatermarkSvg(brand, opts.prompt.includes("(icon style)") ? "icon" : "initials", Math.min(opts.width, 300));
    else svg = renderLogoSvg(brand, Math.min(opts.width, 1024));

    const bytes = await sharp(Buffer.from(svg)).resize(opts.width, opts.height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ quality: 92 }).toBuffer();
    return { bytes, mimeType: "image/png" };
  }
}

// The prompt engine (lib/ai/prompts/*) embeds a machine-readable brief header
// in every image prompt; the demo provider parses it back out.
function parseBrief(prompt: string): SvgBrand & { schedule?: string } {
  const grab = (key: string) => prompt.match(new RegExp(`${key}:\\s*(.*)`))?.[1]?.trim() ?? "";
  return {
    brandName: grab("BRAND_NAME") || "Channel",
    tagline: grab("BRAND_TAGLINE") || undefined,
    style: grab("BRAND_STYLE") || "Modern",
    colors: (grab("BRAND_COLORS") || "#4f46e5,#8b5cf6,#f59e0b,#f8fafc").split(",").map(s => s.trim()).filter(Boolean),
    uploadSchedule: grab("BRAND_SCHEDULE") || undefined,
  };
}
