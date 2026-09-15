import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { checkDailyQuota } from "@/lib/rate-limit";
import { collections } from "@/lib/db";
import { enqueueJob, createImageGenRecord } from "@/lib/images/jobs";
import { generateAsset, buildBriefFromProject } from "@/lib/images/service";
import { findOwnedProject } from "@/lib/images/routes";
import type { BrandBrief } from "@/lib/validation/schemas";

// Regenerates ONE asset without touching the rest of the project.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const asset = collections.assets().find(a => a.id === params.id);
  if (!asset) return fail("NOT_FOUND", "Asset not found.", 404);
  const project = findOwnedProject(asset.projectId, idn);
  if (!project) return fail("FORBIDDEN", "You do not have access to this asset.", 403);
  if (!project.analysis) return fail("NO_ANALYSIS", "This project has no analysis to regenerate from.", 400);

  const quota = checkDailyQuota(idn.key, "image", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily image generation limit reached.", 429);

  const body = (await req.json().catch(() => ({}))) as { style?: BrandBrief["style"] };
  const brief = buildBriefFromProject(project, body.style ? { style: body.style } : {});

  const rec = createImageGenRecord({
    identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    projectId: project.id, provider: "image-pipeline", requestType: `regenerate_${asset.assetType}`,
  });

  enqueueJob(rec.id, async (update) => {
    update(20);
    const next = await generateAsset({ project, brief, assetType: asset.assetType });
    update(95);
    rec.result = { assetId: next.id };
  });

  return ok({ jobId: rec.id });
}
