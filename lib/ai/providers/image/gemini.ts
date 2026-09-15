import type { ImageAIProvider, GenerateImageOptions } from "../../types";
import { ProviderError } from "../../types";
import { env } from "../../../config/env";
import { COST_GUARDS } from "../../../config/limits";

export class GeminiImageProvider implements ImageAIProvider {
  readonly name = "gemini";
  readonly model: string;
  constructor() { this.model = env.image.model || "imagen-3.0-generate-002"; }
  isConfigured() { return Boolean(env.image.apiKey); }

  async generateImage(opts: GenerateImageOptions): Promise<{ bytes: Buffer; mimeType: string }> {
    if (!this.isConfigured()) throw new ProviderError(this.name, "IMAGE_AI_API_KEY is not set for the Gemini image provider.", false);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? COST_GUARDS.requestTimeoutMs * 2);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:predict?key=${encodeURIComponent(env.image.apiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: opts.prompt.slice(0, 3500) }],
          parameters: { sampleCount: 1, aspectRatio: opts.width >= 2000 ? "16:9" : "1:1" },
        }),
        signal: opts.signal ?? controller.signal,
      });
      if (!res.ok) throw new ProviderError(this.name, `Gemini images API error ${res.status}`, res.status === 429 || res.status >= 500);
      const json = await res.json() as { predictions: { bytesBase64Encoded: string; mimeType?: string }[] };
      const pred = json.predictions?.[0];
      if (!pred) throw new ProviderError(this.name, "Gemini returned no image data.", true);
      return { bytes: Buffer.from(pred.bytesBase64Encoded, "base64"), mimeType: pred.mimeType ?? "image/png" };
    } catch (e) {
      if (e instanceof ProviderError) throw e;
      throw new ProviderError(this.name, e instanceof Error ? e.message : "Gemini image request failed", true);
    } finally { clearTimeout(timer); }
  }
}
