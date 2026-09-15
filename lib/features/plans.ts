import type { Plan } from "../db/types";

export const PLANS = {
  free: {
    id: "free", name: "Free", priceMonthly: 0,
    features: [
      "3 channel generations (guest) / 10 text generations per day (signed in)",
      "2 image generations per day",
      "Basic branding assets",
      "3 saved projects",
      "Ads supported",
    ],
  },
  pro: {
    id: "pro", name: "Pro", priceMonthly: 9,
    features: [
      "200 text generations per day",
      "40 image generations per day",
      "HD asset exports",
      "Unlimited saved projects",
      "No ads",
      "Complete brand kit & downloads",
      "Priority generation queue",
    ],
  },
} as const;

// Feature-flag helpers: the single place UI/API check entitlements.
export function canGenerateLogo(plan: Plan | "anon") { return true; }
export function canGenerateBanner(plan: Plan | "anon") { return true; }
export function canDownloadKit(plan: Plan | "anon") { return true; }
export function canUseAdvancedSEO(plan: Plan | "anon") { return plan === "pro"; }
export function seesAds(plan: Plan | "anon") { return plan !== "pro"; }
export function maxProjects(plan: Plan | "anon") { return plan === "pro" ? Infinity : 3; }
