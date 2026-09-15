import { describe, it, expect } from "vitest";
import { PLANS, canGenerateLogo, canDownloadKit, canUseAdvancedSEO, seesAds, maxProjects } from "../lib/features/plans";
import { LIMITS, COST_GUARDS } from "../lib/config/limits";

describe("plan & pricing logic", () => {
  it("free tier is free, pro has a price", () => {
    expect(PLANS.free.priceMonthly).toBe(0);
    expect(PLANS.pro.priceMonthly).toBeGreaterThan(0);
  });
  it("pro limits exceed free limits", () => {
    expect(LIMITS.pro.text).toBeGreaterThan(LIMITS.free.text);
    expect(LIMITS.pro.image).toBeGreaterThan(LIMITS.free.image);
    expect(LIMITS.free.text).toBeGreaterThan(LIMITS.anon.text);
  });
  it("feature flags: core generation is free, advanced SEO is pro", () => {
    expect(canGenerateLogo("anon")).toBe(true);
    expect(canDownloadKit("free")).toBe(true);
    expect(canUseAdvancedSEO("free")).toBe(false);
    expect(canUseAdvancedSEO("pro")).toBe(true);
  });
  it("pro users see no ads", () => {
    expect(seesAds("pro")).toBe(false);
    expect(seesAds("free")).toBe(true);
  });
  it("project caps: free 3, pro unlimited", () => {
    expect(maxProjects("free")).toBe(3);
    expect(maxProjects("pro")).toBe(Infinity);
  });
  it("cost guards are set", () => {
    expect(COST_GUARDS.maxPromptChars).toBeGreaterThan(0);
    expect(COST_GUARDS.maxOutputTokens).toBeLessThanOrEqual(4096);
    expect(COST_GUARDS.maxImageSizePx).toBeLessThanOrEqual(2560);
    expect(COST_GUARDS.maxRetries).toBe(1);
  });
});
