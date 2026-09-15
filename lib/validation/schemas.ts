import { z } from "zod";

export const CONTENT_TYPES = ["Educational","Entertainment","Gaming","Technology","Finance","Fitness","Travel","Cooking","News","Storytelling","Kids","Faceless","Business","Personal Brand","Other"] as const;
export const PERSONALITIES = ["Professional","Friendly","Energetic","Educational","Funny","Inspirational","Minimal","Premium","Bold"] as const;
export const LANGUAGES = ["English","Hindi","Telugu","Tamil","Kannada","Malayalam","Bengali","Marathi","Spanish","Other"] as const;
export const LOGO_STYLES = ["Minimal","Modern","3D","Flat","Gaming","Educational","Luxury","Tech","Cartoon","Mascot","Typography","Abstract"] as const;

export const channelIdeaSchema = z.object({
  idea: z.string().trim().min(8, "Tell us a little more about your channel idea (at least 8 characters).").max(500, "Please keep the idea under 500 characters."),
  targetAudience: z.string().trim().max(200).optional().or(z.literal("")),
  language: z.enum(LANGUAGES).optional(),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  contentType: z.enum(CONTENT_TYPES).optional(),
  personality: z.enum(PERSONALITIES).optional(),
});
export type ChannelIdeaInput = z.infer<typeof channelIdeaSchema>;

export const hexColor = z.string().regex(/^#([0-9a-fA-F]{6})$/, "Must be a 6-digit hex color");

// ── Structured AI output schemas (Zod) ──
export const ideaSchema = z.object({
  title: z.string().min(3).max(120),
  hook: z.string().min(3).max(300),
  target_keyword: z.string().min(2).max(100),
  difficulty: z.string().min(1).max(30),
  content_pillar: z.string().min(1).max(80),
});

export const channelAnalysisSchema = z.object({
  channel_positioning: z.string().min(20).max(800),
  target_audience: z.string().min(5).max(400),
  content_pillars: z.array(z.object({ name: z.string().min(2).max(60), description: z.string().min(5).max(300) })).min(3).max(7),
  channel_names: z.array(z.object({ name: z.string().min(2).max(60), rationale: z.string().min(2).max(240) })).min(10).max(20),
  channel_description: z.object({ short: z.string().min(20).max(300), seo: z.string().min(80).max(1200) }),
  channel_keywords: z.array(z.object({ category: z.string().min(2).max(60), keywords: z.array(z.string().min(2).max(60)).min(3).max(15) })).min(3).max(6),
  seo_keywords: z.object({
    primary: z.array(z.string().min(2).max(60)).min(3).max(10),
    secondary: z.array(z.string().min(2).max(60)).min(3).max(15),
    long_tail: z.array(z.string().min(5).max(90)).min(3).max(15),
  }),
  brand_personality: z.string().min(5).max(300),
  visual_style: z.string().min(5).max(300),
  color_palette: z.array(z.object({ name: z.string().min(2).max(40), hex: hexColor, usage: z.string().min(2).max(120) })).min(3).max(6),
  font_recommendations: z.array(z.object({ name: z.string().min(2).max(60), usage: z.string().min(2).max(120), fallback: z.string().min(2).max(60) })).min(1).max(4),
  tagline: z.string().min(5).max(120),
  video_ideas: z.array(ideaSchema).min(10).max(20),
  shorts_ideas: z.array(ideaSchema).min(10).max(20),
  niche: z.string().min(2).max(60),
});
export type ChannelAnalysisOutput = z.infer<typeof channelAnalysisSchema>;

export const namesOnlySchema = z.object({
  channel_names: z.array(z.object({ name: z.string().min(2).max(60), rationale: z.string().min(2).max(240) })).min(10).max(20),
});

export const descriptionOnlySchema = z.object({
  channel_description: z.object({ short: z.string().min(20).max(300), seo: z.string().min(80).max(1200) }),
});

export const keywordsOnlySchema = z.object({
  channel_keywords: z.array(z.object({ category: z.string().min(2).max(60), keywords: z.array(z.string().min(2).max(60)).min(3).max(15) })).min(3).max(6),
  seo_keywords: z.object({
    primary: z.array(z.string().min(2).max(60)).min(3).max(10),
    secondary: z.array(z.string().min(2).max(60)).min(3).max(15),
    long_tail: z.array(z.string().min(5).max(90)).min(3).max(15),
  }),
});

export const videoIdeasOnlySchema = z.object({
  video_ideas: z.array(ideaSchema).min(10).max(20),
  shorts_ideas: z.array(ideaSchema).min(10).max(20),
});

// ── Image generation inputs ──
export const brandBriefSchema = z.object({
  brand_name: z.string().min(1).max(60),
  visual_identity: z.string().min(3).max(300),
  style: z.enum(LOGO_STYLES),
  colors: z.array(hexColor).min(1).max(6),
  symbols: z.array(z.string().min(1).max(40)).max(8).default([]),
  avoid: z.array(z.string().min(1).max(60)).max(8).default([]),
});
export type BrandBrief = z.infer<typeof brandBriefSchema>;

export const logoRequestSchema = z.object({
  projectId: z.string().min(1).max(64),
  style: z.enum(LOGO_STYLES).optional(),
  regenerate: z.boolean().optional(),
});

export const bannerRequestSchema = z.object({
  projectId: z.string().min(1).max(64),
  tagline: z.string().max(120).optional(),
  uploadSchedule: z.string().max(80).optional(),
  regenerate: z.boolean().optional(),
});

export const watermarkRequestSchema = z.object({
  projectId: z.string().min(1).max(64),
  kind: z.enum(["logo", "initials", "icon"]).default("initials"),
  regenerate: z.boolean().optional(),
});

// standalone tool pages
export const logoToolSchema = z.object({
  channelName: z.string().trim().min(2).max(60),
  niche: z.string().trim().min(2).max(120),
  style: z.enum(LOGO_STYLES).default("Modern"),
  colorPreference: hexColor.optional(),
});
export const bannerToolSchema = z.object({
  channelName: z.string().trim().min(2).max(60),
  tagline: z.string().trim().max(120).default(""),
  niche: z.string().trim().min(2).max(120),
  colorPreference: hexColor.optional(),
});
export const watermarkToolSchema = z.object({
  channelName: z.string().trim().min(2).max(60),
  kind: z.enum(["initials", "icon"]).default("initials"),
  colorPreference: hexColor.optional(),
});
export const keywordToolSchema = z.object({
  niche: z.string().trim().min(2).max(200),
  language: z.enum(LANGUAGES).optional(),
});
export const nameToolSchema = z.object({
  niche: z.string().trim().min(2).max(200),
  personality: z.enum(PERSONALITIES).optional(),
});
export const videoIdeaToolSchema = z.object({
  niche: z.string().trim().min(2).max(200),
  contentType: z.enum(CONTENT_TYPES).optional(),
});

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  name: z.string().trim().min(1).max(80),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

// ── Basic content-safety screen (layer 1; providers add layer 2) ──
const BLOCKED = ["child porn", "csam", "terrorist recruit", "how to make a bomb", "buy illegal", "sell drugs"];
export function isSafePrompt(text: string): boolean {
  const t = text.toLowerCase();
  return !BLOCKED.some(b => t.includes(b));
}
