import "server-only";
import { collections, persist } from "../db";
import { logger } from "../utils/logger";
import type { GenerationRequest } from "../db/types";

// In-process async job runner for image generation.
// MVP runs jobs in the Next.js server process; the GenerationRequest table is
// the durable contract, so this can be moved to a Redis/BullMQ worker without
// changing the API surface (POST /generate -> job id -> poll /api/jobs/:id).

type JobFn = (update: (progress: number) => void) => Promise<void>;

export function enqueueJob(genId: string, fn: JobFn) {
  // Let the HTTP response flush first.
  setTimeout(() => { run(genId, fn); }, 0);
}

async function run(genId: string, fn: JobFn) {
  const rec = collections.generationRequests().find(r => r.id === genId);
  if (!rec) return;
  rec.status = "processing";
  persist();
  try {
    await fn((progress) => {
      rec.progress = Math.max(rec.progress, Math.min(progress, 99));
      persist();
    });
    rec.status = "completed";
    rec.progress = 100;
    rec.completedAt = new Date().toISOString();
    persist();
  } catch (e) {
    rec.status = "failed";
    rec.errorMessage = e instanceof Error ? e.message.slice(0, 500) : "Generation failed";
    rec.completedAt = new Date().toISOString();
    persist();
    logger.error("image_job_failed", { genId, error: String(e) });
  }
}

export function createImageGenRecord(opts: {
  identity: { userId: string | null; guestToken: string | null };
  projectId: string; provider: string; requestType: string;
}): GenerationRequest {
  const rec: GenerationRequest = {
    id: `gen_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    userId: opts.identity.userId, guestToken: opts.identity.guestToken,
    projectId: opts.projectId, provider: opts.provider, model: "image-pipeline",
    requestType: opts.requestType, status: "queued" as const, progress: 0,
    startedAt: new Date().toISOString(), completedAt: null,
    tokensUsed: 0, estimatedCost: 0, errorMessage: null, result: null,
  };
  collections.generationRequests().push(rec);
  persist();
  return rec;
}
