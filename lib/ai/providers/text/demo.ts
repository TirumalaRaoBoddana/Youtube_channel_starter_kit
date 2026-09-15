import type { ZodType } from "zod";
import type { TextAIProvider, GenerateTextOptions, StructuredResult } from "../../types";
import { generateDemoAnalysis } from "../../demo/generator";
import { channelAnalysisSchema, namesOnlySchema, descriptionOnlySchema, keywordsOnlySchema, videoIdeasOnlySchema } from "../../../validation/schemas";
import { validateStructured } from "../../json-repair";

// Demo provider: a deterministic niche-aware engine used when no API key is
// configured. It is honest about being local — the API response reports
// provider="demo" so the UI can label results as offline/demo output.
export class DemoTextProvider implements TextAIProvider {
  readonly name = "demo";
  readonly model = "channelforge-demo-engine-v1";
  isConfigured() { return true; }

  async generateText(opts: GenerateTextOptions): Promise<{ text: string; tokensUsed: number }> {
    // The demo engine is structured-first; text mode returns JSON of a full analysis.
    const analysis = generateDemoAnalysis({ idea: opts.user.slice(0, 500) });
    const text = JSON.stringify(analysis);
    return { text, tokensUsed: 0 };
  }

  async generateStructuredOutput<T>(opts: GenerateTextOptions & { schema: ZodType<T> }): Promise<StructuredResult<T>> {
    const idea = extractIdea(opts.user);
    const full = generateDemoAnalysis(idea);
    // Serve the slice matching the requested schema so single-tool endpoints
    // (names only, keywords only…) behave exactly like the full analysis.
    const schemaRef = opts.schema as unknown;
    let payload: unknown = full;
    if (schemaRef === namesOnlySchema) payload = { channel_names: full.channel_names };
    else if (schemaRef === descriptionOnlySchema) payload = { channel_description: full.channel_description };
    else if (schemaRef === keywordsOnlySchema) payload = { channel_keywords: full.channel_keywords, seo_keywords: full.seo_keywords };
    else if (schemaRef === videoIdeasOnlySchema) payload = { video_ideas: full.video_ideas, shorts_ideas: full.shorts_ideas };
    const { data } = await validateStructured(JSON.stringify(payload), opts.schema);
    return { data, provider: this.name, model: this.model, tokensUsed: 0 };
  }
}

function extractIdea(userPrompt: string) {
  const m = userPrompt.match(/Channel idea:\s*(.+)/i);
  return { idea: (m ? m[1] : userPrompt).trim().slice(0, 500) };
}
