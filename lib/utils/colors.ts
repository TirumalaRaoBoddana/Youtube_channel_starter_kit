// Deterministic brand color generation from a seed string (used by the demo
// image provider and as a fallback when the text AI omits palette details).
const PALETTES: Record<string, string[]> = {
  ai: ["#4f46e5", "#8b5cf6", "#22d3ee", "#f8fafc"],
  tech: ["#2563eb", "#06b6d4", "#f59e0b", "#f8fafc"],
  gaming: ["#7c3aed", "#ec4899", "#22d3ee", "#0f172a"],
  fitness: ["#16a34a", "#84cc16", "#f97316", "#f8fafc"],
  finance: ["#0f766e", "#059669", "#eab308", "#f8fafc"],
  cooking: ["#ea580c", "#f59e0b", "#dc2626", "#fffbeb"],
  travel: ["#0284c7", "#14b8a6", "#f59e0b", "#f0f9ff"],
  education: ["#4338ca", "#6366f1", "#f59e0b", "#f8fafc"],
  kids: ["#f472b6", "#facc15", "#38bdf8", "#fff7ed"],
  storytelling: ["#9333ea", "#f43f5e", "#fbbf24", "#faf5ff"],
  news: ["#dc2626", "#1e293b", "#f8fafc", "#f1f5f9"],
  business: ["#1e293b", "#475569", "#f59e0b", "#f8fafc"],
  default: ["#4f46e5", "#8b5cf6", "#f59e0b", "#f8fafc"],
};

export function paletteFor(niche: string): string[] {
  return PALETTES[niche] ?? PALETTES.default;
}

export function isHexColor(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}
