import "server-only";
import type { ImageAIProvider } from "../../types";
import { env } from "../../../config/env";
import { DemoImageProvider } from "./demo";
import { OpenAIImageProvider } from "./openai";
import { GeminiImageProvider } from "./gemini";

const registry: Record<string, () => ImageAIProvider> = {
  demo: () => new DemoImageProvider(),
  openai: () => new OpenAIImageProvider(),
  gemini: () => new GeminiImageProvider(),
};

export function imageProviderChain(): ImageAIProvider[] {
  const requested = env.image.provider.split(",").map(s => s.trim()).filter(Boolean);
  const chain = requested.map(name => registry[name]?.()).filter((p): p is ImageAIProvider => Boolean(p));
  if (!chain.some(p => p.name === "demo")) chain.push(new DemoImageProvider());
  return chain;
}
