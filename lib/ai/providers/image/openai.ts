import type { ImageAIProvider, GenerateImageOptions } from "../../types";
import { ProviderError } from "../../types";
import { env } from "../../../config/env";
import { COST_GUARDS } from "../../../config/limits";

export class OpenAIImageProvider implements ImageAIProvider {
  readonly name = "openai";
  readonly model: string;
  constructor() { this.model = env.image.model || "gpt-image-1"; }
  isConfigured() { return Boolean(env.image.apiKey); }

  async generateImage(opts: GenerateImageOptions): Promise<{ bytes: Buffer; mimeType: string }> {
    if (!this.isConfigured()) throw new ProviderError(this.name, "IMAGE_AI_API_KEY is not set for the OpenAI image provider.", false);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? COST_GUARDS.requestTimeoutMs * 2);
    try {
      // gpt-image-1 only supports square sizes; banner is composed via
      // outpaint-safe prompt + post-processing in ImageGenerationService.
      const size = opts.width >= 2000 ? "1536x1024" : "1024x1024";
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.image.apiKey}` },
        body: JSON.stringify({
          model: this.model,
          prompt: opts.prompt.slice(0, 3500),
          n: 1, size, quality: "medium",
        }),
        signal: opts.signal ?? controller.signal,
      });
      if (!res.ok) throw new ProviderError(this.name, `OpenAI images API error ${res.status}`, res.status === 429 || res.status >= 500);
      const json = await res.json() as { data: { b64_json?: string; url?: string }[] };
      const item = json.data?.[0];
      if (!item) throw new ProviderError(this.name, "OpenAI returned no image data.", true);
      if (item.b64_json) return { bytes: Buffer.from(item.b64_json, "base64"), mimeType: "image/png" };
      const imgRes = await fetch(item.url!);
      return { bytes: Buffer.from(await imgRes.arrayBuffer()), mimeType: "image/png" };
    } catch (e) {
      if (e instanceof ProviderError) throw e;
      throw new ProviderError(this.name, e instanceof Error ? e.message : "OpenAI image request failed", true);
    } finally { clearTimeout(timer); }
  }
}
