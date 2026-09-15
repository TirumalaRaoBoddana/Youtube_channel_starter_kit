import { bannerRequestSchema } from "@/lib/validation/schemas";
import { makeImageRoute } from "@/lib/images/routes";

export const POST = makeImageRoute({
  assetType: "banner",
  parse: (body) => {
    const p = bannerRequestSchema.safeParse(body);
    return p.success ? { projectId: p.data.projectId, tagline: p.data.tagline, uploadSchedule: p.data.uploadSchedule } : null;
  },
});
