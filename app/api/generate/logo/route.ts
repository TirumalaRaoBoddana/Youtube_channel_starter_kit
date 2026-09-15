import { logoRequestSchema } from "@/lib/validation/schemas";
import { makeImageRoute } from "@/lib/images/routes";

export const POST = makeImageRoute({
  assetType: "logo",
  parse: (body) => {
    const p = logoRequestSchema.safeParse(body);
    return p.success ? { projectId: p.data.projectId, style: p.data.style } : null;
  },
});
