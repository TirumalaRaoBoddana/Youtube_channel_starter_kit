import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { collections } from "@/lib/db";

export async function GET(req: NextRequest) {
  const idn = resolveIdentity(req);
  const projects = collections.projects()
    .filter(p => (idn.user ? p.userId === idn.user.id : p.guestToken === idn.guestToken))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(p => ({
      id: p.id, idea: p.idea, status: p.status, createdAt: p.createdAt,
      channelName: p.analysis?.channel_names[0]?.name ?? null,
      assetCount: collections.assets().filter(a => a.projectId === p.id).length,
    }));
  return ok({ projects });
}
