import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { collections, persist } from "@/lib/db";
import { storage } from "@/lib/storage";
import { findOwnedProject } from "@/lib/images/routes";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const idn = resolveIdentity(req);
  const project = findOwnedProject(params.id, idn);
  if (!project) return fail("NOT_FOUND", "Project not found.", 404);

  return ok({
    project,
    brandKit: collections.brandKits().find(b => b.projectId === project.id) ?? null,
    assets: collections.assets().filter(a => a.projectId === project.id),
    keywordSet: collections.keywordSets().find(k => k.projectId === project.id) ?? null,
    contentIdeas: collections.contentIdeas().filter(c => c.projectId === project.id),
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);
  const project = findOwnedProject(params.id, idn);
  if (!project) return fail("NOT_FOUND", "Project not found.", 404);

  // cascade delete: assets (storage + rows), keywords, ideas, brand kit
  for (const a of collections.assets().filter(a => a.projectId === project.id)) {
    await storage.delete(a.storageKey);
  }
  await storage.deleteDir(`projects/${project.id}`);
  const db = collections;
  const spliceWhere = <T extends { projectId: string }>(arr: T[]) => {
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i].projectId === project.id) arr.splice(i, 1);
  };
  spliceWhere(db.assets());
  spliceWhere(db.keywordSets());
  spliceWhere(db.contentIdeas());
  spliceWhere(db.brandKits());
  const pi = db.projects().findIndex(p => p.id === project.id);
  if (pi >= 0) db.projects().splice(pi, 1);
  persist();
  return ok({ deleted: true });
}
