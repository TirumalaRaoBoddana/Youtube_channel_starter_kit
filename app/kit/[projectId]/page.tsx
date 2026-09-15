import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/lib/db";
import { getCurrentUser, getGuestToken } from "@/lib/auth/session";
import { KitView } from "@/components/kit/kit-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { projectId: string } }): Promise<Metadata> {
  const project = collections.projects().find(p => p.id === params.projectId);
  const name = project?.analysis?.channel_names[0]?.name ?? "Channel";
  return { title: `${name} — Channel Kit`, robots: { index: params.projectId === "demo_math_of_ai", follow: false } };
}

export default function KitPage({ params }: { params: { projectId: string } }) {
  const user = getCurrentUser();
  const guestToken = getGuestToken();
  const project = collections.projects().find(p => p.id === params.projectId);
  if (!project || !project.analysis) notFound();

  const isDemo = project.id === "demo_math_of_ai";
  const owned = user ? project.userId === user.id || project.guestToken === guestToken : project.guestToken === guestToken;
  if (!owned && !isDemo) notFound();

  const brandKit = collections.brandKits().find(b => b.projectId === project.id) ?? null;
  const assets = collections.assets().filter(a => a.projectId === project.id);
  const keywordSet = collections.keywordSets().find(k => k.projectId === project.id) ?? null;
  const contentIdeas = collections.contentIdeas().filter(c => c.projectId === project.id);

  return (
    <KitView
      project={{ id: project.id, idea: project.idea, createdAt: project.createdAt }}
      analysis={project.analysis}
      brandKit={brandKit}
      assets={assets.map(a => ({ id: a.id, assetType: a.assetType, width: a.width, height: a.height }))}
      keywordGroups={keywordSet?.groups ?? project.analysis.channel_keywords}
      contentIdeas={contentIdeas.map(c => ({ id: c.id, kind: c.kind, title: c.title, hook: c.hook, targetKeyword: c.target_keyword, difficulty: c.difficulty, contentPillar: c.content_pillar }))}
      isGuest={!user}
      isDemo={isDemo}
    />
  );
}
