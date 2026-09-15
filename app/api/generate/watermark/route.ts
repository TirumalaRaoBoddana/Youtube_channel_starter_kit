import { watermarkRequestSchema } from "@/lib/validation/schemas";
import { makeImageRoute } from "@/lib/images/routes";

export const POST = makeImageRoute({
  assetType: "watermark",
  parse: (body) => {
    const p = watermarkRequestSchema.safeParse(body);
    return p.success ? { projectId: p.data.projectId, kind: p.data.kind } : null;
  },
});
