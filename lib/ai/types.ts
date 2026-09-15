// ── Provider abstraction: the rest of the app never imports a provider directly ──
import type { ZodType } from "zod";

export interface GenerateTextOptions {
  system: string;
  user: string;
  maxTokens?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface StructuredResult<T> { data: T; provider: string; model: string; tokensUsed: number; }

export interface TextAIProvider {
  readonly name: string;
  readonly model: string;
  isConfigured(): boolean;
  generateText(opts: GenerateTextOptions): Promise<{ text: string; tokensUsed: number }>;
  generateStructuredOutput<T>(opts: GenerateTextOptions & { schema: ZodType<T> }): Promise<StructuredResult<T>>;
}

export interface GenerateImageOptions {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface ImageAIProvider {
  readonly name: string;
  readonly model: string;
  isConfigured(): boolean;
  // Providers return PNG bytes; post-processing (crop/resize/optimize) happens
  // in ImageGenerationService, not here.
  generateImage(opts: GenerateImageOptions): Promise<{ bytes: Buffer; mimeType: string }>;
}

export class ProviderError extends Error {
  constructor(public provider: string, message: string, public retryable = false) {
    super(message);
    this.name = "ProviderError";
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) { super(message); this.name = "ConfigurationError"; }
}
