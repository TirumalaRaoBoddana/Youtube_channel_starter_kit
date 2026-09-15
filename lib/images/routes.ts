import "server-only";
import { NextRequest } from "next/server";
import { ok, fail } from "../utils/api-response";
import { guardApi } from "../auth/guard";
import { resolveIdentity, type Identity } from "../auth/identity";
import { checkDailyQuota } from "../rate-limit";
import { collections } from "../db";
import { enqueueJob, createImageGenRecord } from "./jobs";
import { generateAsset, buildBriefFromProject } from "./service";
import type { AssetType, Project } from "../db/types";
import type { BrandBrief } from "../validation/schemas";
import { LOGO_STYLES } from "../validation/schemas";

export interface ImageRouteOpts {
  assetType: AssetType;
  parse: (body: unknown) => { projectId: string; style?: typeof LOGO_STYLES[number]; tagline?: string; uploadSchedule?: string; kind?: "logo" | "initials" | "icon" } | null;
}

export function makeImageRoute(opts: ImageRouteOpts) {
  return async function POST(req: NextRequest) {
    const g = guardApi(req);
    if (g.error) return g.error;
    const idn = resolveIdentity(req);

    // Validate and authorize BEFORE charging quota — a request that would fail
    // anyway must not burn the user's daily allowance.
    const parsed = opts.parse(await req.json().catch(() => null));
    if (!parsed) return fail("VALIDATION_ERROR", "Please check your input.", 400);

    const project = findOwnedProject(parsed.projectId, idn);
    if (!project) return fail("NOT_FOUND", "Project not found.", 404);
    if (!project.analysis) return fail("NO_ANALYSIS", "Generate a channel analysis for this project first.", 400);

    const quota = checkDailyQuota(idn.key, "image", idn.plan);
    if (!quota.allowed) {
      return fail("QUOTA_EXCEEDED", `You've used all ${quota.limit} image generations for today. ${idn.user ? "Upgrade to Pro for more." : "Sign up free for more daily generations."}`, 429);
    }

    const brief: BrandBrief = buildBriefFromProject(project, { style: parsed.style });
    const rec = createImageGenRecord({
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
      projectId: project.id, provider: "image-pipeline", requestType: `generate_${opts.assetType}`,
    });

    enqueueJob(rec.id, async (update) => {
      update(15);
      const asset = await generateAsset({
        project, brief, assetType: opts.assetType,
        watermarkKind: parsed.kind, tagline: parsed.tagline, uploadSchedule: parsed.uploadSchedule,
      });
      update(90);
      rec.result = { assetId: asset.id };
    });

    return ok({ jobId: rec.id, projectId: project.id });
  };
}

export function findOwnedProject(projectId: string, idn: Identity): Project | null {
  return collections.projects().find(p =>
    p.id === projectId &&
    (idn.user ? p.userId === idn.user.id || p.guestToken === idn.guestToken : p.guestToken === idn.guestToken)
  ) ?? null;
}
