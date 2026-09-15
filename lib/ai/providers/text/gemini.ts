import type { ZodType } from "zod";
import type { TextAIProvider, GenerateTextOptions, StructuredResult } from "../../types";
import { ProviderError } from "../../types";
import { validateStructured } from "../../json-repair";
import { env } from "../../../config/env";
import { COST_GUARDS } from "../../../config/limits";

export class GeminiTextProvider implements TextAIProvider {
  readonly name = "gemini";
  readonly model: string;
  constructor() { this.model = env.text.model || "gemini-2.0-flash"; }
  isConfigured() { return Boolean(env.text.apiKey); }

  private async call(opts: GenerateTextOptions, jsonMode: boolean) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? COST_GUARDS.requestTimeoutMs);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(env.text.apiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: opts.system }] },
          contents: [{ role: "user", parts: [{ text: opts.user }] }],
          generationConfig: {
            maxOutputTokens: Math.min(opts.maxTokens ?? COST_GUARDS.maxOutputTokens, COST_GUARDS.maxOutputTokens),
            ...(jsonMode ? { responseMimeType: "application/json" } : {}),
          },
        }),
        signal: opts.signal ?? controller.signal,
      });
      if (!res.ok) {
        const retryable = res.status === 429 || res.status >= 500;
        throw new ProviderError(this.name, `Gemini API error ${res.status}`, retryable);
      }
      const json = await res.json() as { candidates: { content: { parts: { text: string }[] } }[]; usageMetadata?: { totalTokenCount: number } };
      const text = json.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";
      return { text, tokensUsed: json.usageMetadata?.totalTokenCount ?? 0 };
    } catch (e) {
      if (e instanceof ProviderError) throw e;
      throw new ProviderError(this.name, e instanceof Error ? e.message : "Gemini request failed", true);
    } finally { clearTimeout(timer); }
  }

  async generateText(opts: GenerateTextOptions) { return this.call(opts, false); }

  async generateStructuredOutput<T>(opts: GenerateTextOptions & { schema: ZodType<T> }): Promise<StructuredResult<T>> {
    const { text, tokensUsed } = await this.call(opts, true);
    const { data } = await validateStructured(text, opts.schema, async () => {
      const fixed = await this.call({
        ...opts,
        user: `${opts.user}\n\nYour previous reply was invalid JSON. Return ONLY corrected JSON. Previous reply:\n${text.slice(0, 3000)}`,
      }, true);
      return fixed.text;
    });
    return { data, provider: this.name, model: this.model, tokensUsed };
  }
}
