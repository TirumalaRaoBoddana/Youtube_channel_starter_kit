import type { ZodType } from "zod";
import type { TextAIProvider, GenerateTextOptions, StructuredResult } from "../../types";
import { ProviderError } from "../../types";
import { validateStructured } from "../../json-repair";
import { env } from "../../../config/env";
import { COST_GUARDS } from "../../../config/limits";

export class OpenAITextProvider implements TextAIProvider {
  readonly name = "openai";
  readonly model: string;
  constructor() { this.model = env.text.model || "gpt-4o-mini"; }
  isConfigured() { return Boolean(env.text.apiKey); }

  private async call(opts: GenerateTextOptions, jsonMode: boolean) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? COST_GUARDS.requestTimeoutMs);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.text.apiKey}` },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: opts.system },
            { role: "user", content: opts.user },
          ],
          max_tokens: Math.min(opts.maxTokens ?? COST_GUARDS.maxOutputTokens, COST_GUARDS.maxOutputTokens),
          ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: opts.signal ?? controller.signal,
      });
      if (!res.ok) {
        const retryable = res.status === 429 || res.status >= 500;
        throw new ProviderError(this.name, `OpenAI API error ${res.status}`, retryable);
      }
      const json = await res.json() as { choices: { message: { content: string } }[]; usage?: { total_tokens: number } };
      return { text: json.choices[0]?.message?.content ?? "", tokensUsed: json.usage?.total_tokens ?? 0 };
    } catch (e) {
      if (e instanceof ProviderError) throw e;
      throw new ProviderError(this.name, e instanceof Error ? e.message : "OpenAI request failed", true);
    } finally { clearTimeout(timer); }
  }

  async generateText(opts: GenerateTextOptions) { return this.call(opts, false); }

  async generateStructuredOutput<T>(opts: GenerateTextOptions & { schema: ZodType<T> }): Promise<StructuredResult<T>> {
    const { text, tokensUsed } = await this.call(opts, true);
    const { data } = await validateStructured(text, opts.schema, async () => {
      // One repair pass: ask the model to fix its own JSON against the errors.
      const fixed = await this.call({
        ...opts,
        user: `${opts.user}\n\nYour previous reply was invalid JSON. Return ONLY corrected JSON. Previous reply:\n${text.slice(0, 3000)}`,
      }, true);
      return fixed.text;
    });
    return { data, provider: this.name, model: this.model, tokensUsed };
  }
}
