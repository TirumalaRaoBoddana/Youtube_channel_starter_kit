export type Role = "user" | "admin";
export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null; // null for OAuth-only accounts
  name: string;
  role: Role;
  plan: Plan;
  disabled: boolean;
  createdAt: string;
}

export interface Session { id: string; userId: string; expiresAt: string; }

export type ProjectStatus = "draft" | "ready";

export interface Project {
  id: string;
  userId: string | null; // null => guest project (cookie-owned)
  guestToken: string | null;
  idea: string;
  input: {
    targetAudience?: string;
    language?: string;
    country?: string;
    contentType?: string;
    personality?: string;
  };
  analysis: ChannelAnalysis | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKit {
  id: string;
  projectId: string;
  name: string;
  tagline: string;
  colors: { primary: string; secondary: string; accent: string; background: string };
  fonts: { heading: string; body: string };
  logoStyle: string;
  updatedAt: string;
}

export type AssetType = "logo" | "banner" | "watermark";

export interface GeneratedAsset {
  id: string;
  projectId: string;
  assetType: AssetType;
  storageKey: string;
  mimeType: string;
  width: number;
  height: number;
  promptSummary: string;
  provider: string;
  createdAt: string;
}

export interface KeywordSet {
  id: string;
  projectId: string;
  groups: { category: string; keywords: string[] }[];
  source: "ai" | "external";
  createdAt: string;
}

export interface ContentIdea {
  id: string;
  projectId: string;
  kind: "long" | "short";
  title: string;
  hook: string;
  target_keyword: string;
  difficulty: string;
  content_pillar: string;
  createdAt: string;
}

export type GenerationStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";

export interface GenerationRequest {
  id: string;
  userId: string | null;
  guestToken: string | null;
  projectId: string | null;
  provider: string;
  model: string;
  requestType: string; // channel_analysis | names | keywords | logo | ...
  status: GenerationStatus;
  progress: number;
  startedAt: string;
  completedAt: string | null;
  tokensUsed: number;
  estimatedCost: number;
  errorMessage: string | null;
  result: unknown | null;
}

export interface UsageEvent {
  id: string;
  userId: string | null;
  guestToken: string | null;
  ip: string | null;
  kind: "text" | "image";
  day: string; // YYYY-MM-DD
  at: string;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  userId: string | null;
  guestToken: string | null;
  props: Record<string, unknown>;
  at: string;
}

export interface SavedGeneration {
  id: string;
  userId: string;
  requestType: string;
  payload: unknown;
  createdAt: string;
}

export interface ChannelAnalysis {
  channel_positioning: string;
  target_audience: string;
  content_pillars: { name: string; description: string }[];
  channel_names: { name: string; rationale: string }[];
  channel_description: { short: string; seo: string };
  channel_keywords: { category: string; keywords: string[] }[];
  seo_keywords: { primary: string[]; secondary: string[]; long_tail: string[] };
  brand_personality: string;
  visual_style: string;
  color_palette: { name: string; hex: string; usage: string }[];
  font_recommendations: { name: string; usage: string; fallback: string }[];
  tagline: string;
  video_ideas: { title: string; hook: string; target_keyword: string; difficulty: string; content_pillar: string }[];
  shorts_ideas: { title: string; hook: string; target_keyword: string; difficulty: string; content_pillar: string }[];
  niche: string;
}
