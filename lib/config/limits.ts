// Central, configurable usage limits. Override via env in production.
export type Plan = "free" | "pro";

export const LIMITS = {
  anon: { text: int("LIMIT_ANON_TEXT", 3), image: int("LIMIT_ANON_IMAGE", 1) },
  free: { text: int("LIMIT_FREE_TEXT", 10), image: int("LIMIT_FREE_IMAGE", 2) },
  pro: { text: int("LIMIT_PRO_TEXT", 200), image: int("LIMIT_PRO_IMAGE", 40) },
} as const;

export const COST_GUARDS = {
  maxPromptChars: 2000,
  maxOutputTokens: 4096,
  maxImageSizePx: 2560,
  requestTimeoutMs: 60_000,
  maxRetries: 1,
};

function int(name: string, dflt: number): number {
  const v = process.env[name];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : dflt;
}

export function limitsForPlan(plan: Plan | "anon") {
  return LIMITS[plan];
}
