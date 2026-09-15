import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { collections } from "@/lib/db";
import { storage } from "@/lib/storage";
import { resolveIdentity } from "@/lib/auth/identity";
import { findOwnedProject } from "@/lib/images/routes";
import { fail } from "@/lib/utils/api-response";

// Builds the complete channel kit ZIP server-side.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const idn = resolveIdentity(req);
  const project = findOwnedProject(params.id, idn);
  if (!project) return fail("NOT_FOUND", "Project not found.", 404);
  const a = project.analysis;
  if (!a) return fail("NO_ANALYSIS", "This project has nothing to download yet.", 400);

  const zip = new JSZip();
  const branding = zip.folder("branding")!;
  const strategy = zip.folder("strategy")!;
  const brand = zip.folder("brand")!;

  for (const asset of collections.assets().filter(x => x.projectId === project.id)) {
    const bytes = await storage.get(asset.storageKey);
    if (bytes) branding.file(`${asset.assetType}.png`, new Uint8Array(bytes));
  }

  strategy.file("channel-description.txt",
    `${a.channel_names[0]?.name ?? "Channel"}\n${a.tagline}\n\nShort description:\n${a.channel_description.short}\n\nFull (SEO) description:\n${a.channel_description.seo}\n`);
  strategy.file("keywords.txt",
    a.channel_keywords.map(g => `## ${g.category}\n${g.keywords.join("\n")}`).join("\n\n") +
    `\n\n## SEO — Primary\n${a.seo_keywords.primary.join("\n")}` +
    `\n\n## SEO — Secondary\n${a.seo_keywords.secondary.join("\n")}` +
    `\n\n## SEO — Long tail\n${a.seo_keywords.long_tail.join("\n")}`);
  strategy.file("content-pillars.txt", a.content_pillars.map(p => `## ${p.name}\n${p.description}`).join("\n\n"));
  strategy.file("video-ideas.txt",
    `LONG-FORM VIDEO IDEAS\n${"=".repeat(40)}\n\n` +
    a.video_ideas.map((v, i) => `${i + 1}. ${v.title}\n   Hook: ${v.hook}\n   Keyword: ${v.target_keyword} | Difficulty: ${v.difficulty} | Pillar: ${v.content_pillar}`).join("\n\n") +
    `\n\n\nSHORTS IDEAS\n${"=".repeat(40)}\n\n` +
    a.shorts_ideas.map((v, i) => `${i + 1}. ${v.title}\n   Hook: ${v.hook}\n   Keyword: ${v.target_keyword}`).join("\n\n"));

  brand.file("colors.json", JSON.stringify(a.color_palette, null, 2));
  brand.file("fonts.txt", a.font_recommendations.map(f => `${f.name} — ${f.usage} (fallback: ${f.fallback})`).join("\n"));
  brand.file("channel-names.txt", a.channel_names.map(n => `${n.name} — ${n.rationale}`).join("\n"));
  zip.file("README.txt", `ChannelForge AI — Channel Kit for "${a.channel_names[0]?.name}"\nGenerated ${new Date().toISOString()}\n\nbranding/  → logo, banner, watermark PNGs\nstrategy/  → description, keywords, pillars, video ideas\nbrand/     → colors, fonts, name options\n`);

  const bytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="channel-kit-${project.id}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
