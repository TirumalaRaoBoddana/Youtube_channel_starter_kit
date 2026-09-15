import "server-only";
import type { ZodType } from "zod";
import { textProviderChain } from "./providers/text";
import { ProviderError, ConfigurationError, type GenerateTextOptions, type TextAIProvider } from "./types";
import { collections, persist } from "../db";
import { newId } from "../utils/id";
import { logger } from "../utils/logger";
import { isSafePrompt } from "../validation/schemas";
import type { GenerationRequest } from "../db/types";

// AIService: the ONLY module the API layer talks to for text AI.
// Responsibilities: provider fallback chain, single retry, structured-output
// validation, usage tracking (generation_requests), safety screen.

export interface RunTextOptions<T> {
  system: string;
  user: string;
  schema: ZodType<T>;
  requestType: string;
  identity: { userId: string | null; guestToken: string | null };
  projectId?: string | null;
  maxTokens?: number;
}

export interface RunTextResult<T> {
  data: T;
  provider: string;
  model: string;
  tokensUsed: number;
  requestId: string;
}

export async function runStructuredText<T>(opts: RunTextOptions<T>): Promise<RunTextResult<T>> {
  if (!isSafePrompt(opts.user) || !isSafePrompt(opts.system)) {
    throw new ConfigurationError("This request was blocked by our content policy.");
  }

  const record = startRequest(opts);
  let lastError: unknown = null;

  for (const provider of textProviderChain()) {
    if (!provider.isConfigured()) continue;
    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        const res = await provider.generateStructuredOutput({
          system: opts.system, user: opts.user, maxTokens: opts.maxTokens, schema: opts.schema,
        });
        completeRequest(record, provider, res.tokensUsed);
        return { ...res, requestId: record.id };
      } catch (e) {
        lastError = e;
        const retryable = e instanceof ProviderError ? e.retryable : true;
        logger.warn("text_generation_attempt_failed", {
          provider: provider.name, attempt, requestType: opts.requestType, error: String(e),
        });
        if (!retryable) break;
      }
    }
    // provider exhausted → fall through to next provider in the chain
  }

  failRequest(record, lastError);
  throw new GenerationFailure(userFriendly(lastError));
}

export function userFriendly(e: unknown): string {
  if (e instanceof ConfigurationError) return e.message;
  if (e instanceof ProviderError && !e.retryable && e.message.includes("not set")) {
    return "The selected AI provider is not configured. Check the environment variables in the README.";
  }
  return "We couldn't generate this right now. Please try again in a moment.";
}

export class GenerationFailure extends Error {
  constructor(message: string) { super(message); this.name = "GenerationFailure"; }
}

// ── generation request tracking ──
function startRequest(opts: RunTextOptions<unknown>): GenerationRequest {
  const rec: GenerationRequest = {
    id: newId("gen"), userId: opts.identity.userId, guestToken: opts.identity.guestToken,
    projectId: opts.projectId ?? null, provider: "pending", model: "pending",
    requestType: opts.requestType, status: "queued", progress: 0,
    startedAt: new Date().toISOString(), completedAt: null,
    tokensUsed: 0, estimatedCost: 0, errorMessage: null, result: null,
  };
  collections.generationRequests().push(rec);
  persist();
  return rec;
}

// Rough cost estimate for observability (USD per 1k tokens, blended).
const COST_PER_1K: Record<string, number> = { "gpt-4o-mini": 0.0006, "gemini-2.0-flash": 0.0004, demo: 0 };

function completeRequest(rec: GenerationRequest, provider: TextAIProvider, tokens: number) {
  rec.provider = provider.name;
  rec.model = provider.model;
  rec.status = "completed";
  rec.progress = 100;
  rec.completedAt = new Date().toISOString();
  rec.tokensUsed = tokens;
  rec.estimatedCost = (tokens / 1000) * (COST_PER_1K[provider.model] ?? 0.001);
  persist();
}

function failRequest(rec: GenerationRequest, e: unknown) {
  rec.status = "failed";
  rec.completedAt = new Date().toISOString();
  rec.errorMessage = e instanceof Error ? e.message.slice(0, 500) : String(e);
  persist();
}
