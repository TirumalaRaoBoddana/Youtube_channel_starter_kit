import "server-only";
import type { TextAIProvider } from "../../types";
import { env } from "../../../config/env";
import { DemoTextProvider } from "./demo";
import { OpenAITextProvider } from "./openai";
import { GeminiTextProvider } from "./gemini";

const registry: Record<string, () => TextAIProvider> = {
  demo: () => new DemoTextProvider(),
  openai: () => new OpenAITextProvider(),
  gemini: () => new GeminiTextProvider(),
};

// Fallback chain from TEXT_AI_PROVIDER (comma separated), always ending in demo
// so the product keeps working when a paid provider is down/unconfigured.
export function textProviderChain(): TextAIProvider[] {
  const requested = env.text.provider.split(",").map(s => s.trim()).filter(Boolean);
  const chain = requested.map(name => registry[name]?.()).filter((p): p is TextAIProvider => Boolean(p));
  if (!chain.some(p => p.name === "demo")) chain.push(new DemoTextProvider());
  return chain;
}
