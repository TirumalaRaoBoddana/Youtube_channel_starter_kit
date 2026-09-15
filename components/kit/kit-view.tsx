"use client";
import { useState } from "react";
import Link from "next/link";
import { Download, RefreshCw, Palette, Loader2, Check, Monitor, Smartphone, Tv, Copy, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import type { ChannelAnalysis } from "@/lib/db/types";

export interface KitViewProps {
  project: { id: string; idea: string; createdAt: string };
  analysis: ChannelAnalysis;
  brandKit: { id: string; name: string; tagline: string; colors: { primary: string; secondary: string; accent: string; background: string }; fonts: { heading: string; body: string }; logoStyle: string } | null;
  assets: { id: string; assetType: "logo" | "banner" | "watermark"; width: number; height: number }[];
  keywordGroups: { category: string; keywords: string[] }[];
  contentIdeas: { id: string; kind: string; title: string; hook: string; targetKeyword: string; difficulty: string; contentPillar: string }[];
  isGuest: boolean;
  isDemo: boolean;
}

type BannerDevice = "desktop" | "mobile" | "tv";

export function KitView(props: KitViewProps) {
  const { analysis: a, brandKit, assets, isGuest, isDemo } = props;
  const [jobs, setJobs] = useState<Record<string, { progress: number; status: string }>>({});
  const [bannerDevice, setBannerDevice] = useState<BannerDevice>("desktop");
  const [copied, setCopied] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: brandKit?.name ?? "", tagline: brandKit?.tagline ?? "" });
  const [notice, setNotice] = useState("");

  const logo = assets.find(x => x.assetType === "logo");
  const banner = assets.find(x => x.assetType === "banner");
  const watermark = assets.find(x => x.assetType === "watermark");

  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 1500); } catch { /* clipboard unavailable */ }
  };
  const downloadText = (filename: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const el = document.createElement("a");
    el.href = url; el.download = filename; el.click();
    URL.revokeObjectURL(url);
    void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: "download_clicked", props: { kind: filename } }) }).catch(() => {});
  };

  const regenerate = async (assetType: "logo" | "banner" | "watermark") => {
    setNotice("");
    const res = await fetch(`/api/generate/${assetType}`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" },
      body: JSON.stringify({ projectId: props.project.id, tagline: brandKit?.tagline }),
    });
    const json = await res.json();
    if (!json.success) { setNotice(json.error?.message ?? "Generation failed. Please try again."); return; }
    pollJob(json.data.jobId, assetType);
    void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: `${assetType}_generated` }) }).catch(() => {});
  };

  const pollJob = (jobId: string, assetType: string) => {
    setJobs(j => ({ ...j, [assetType]: { progress: 5, status: "processing" } }));
    const tick = async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      const json = await res.json();
      if (!json.success) { setJobs(j => ({ ...j, [assetType]: { progress: 100, status: "failed" } })); return; }
      const { status, progress } = json.data;
      if (status === "completed") {
        setJobs(j => ({ ...j, [assetType]: { progress: 100, status: "completed" } }));
        setTimeout(() => window.location.reload(), 400);
      } else if (status === "failed") {
        setJobs(j => ({ ...j, [assetType]: { progress: 100, status: "failed" } }));
        setNotice("Something went wrong while generating your asset. Please try again.");
      } else {
        setJobs(j => ({ ...j, [assetType]: { progress: Math.max(progress, j[assetType]?.progress ?? 0), status } }));
        setTimeout(tick, 700);
      }
    };
    setTimeout(tick, 500);
  };

  const JobBar = ({ assetType, label }: { assetType: string; label: string }) => {
    const job = jobs[assetType];
    if (!job) return null;
    if (job.status === "failed") return <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">Generation failed — please try again.</p>;
    return (
      <div className="mt-3" role="status" aria-live="polite">
        <p className="mb-1 text-xs text-slate-500">Generating your {label}… usually takes a few seconds.</p>
        <Progress value={job.progress} label={`Generating ${label}`} />
      </div>
    );
  };

  const AssetActions = ({ assetType, assetId, filename }: { assetType: "logo" | "banner" | "watermark"; assetId?: string; filename: string }) => (
    <div className="mt-4 flex flex-wrap gap-2">
      <button onClick={() => regenerate(assetType)} disabled={Boolean(jobs[assetType]?.status === "processing" || jobs[assetType]?.status === "queued")} className="btn-secondary !px-3 !py-2 !text-xs">
        {jobs[assetType] && jobs[assetType].status !== "completed" && jobs[assetType].status !== "failed" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden />} Regenerate
      </button>
      {assetId && (
        <a href={`/api/assets/${assetId}/file`} download={filename} className="btn-secondary !px-3 !py-2 !text-xs" onClick={() => void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: "download_clicked", props: { kind: assetType } }) }).catch(() => {})}>
          <Download className="h-3.5 w-3.5" aria-hidden /> Download
        </a>
      )}
    </div>
  );

  return (
    <div className="section py-10">
      {notice && <div role="alert" className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">{notice}</div>}

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-grotesk)" }}>Your YouTube Channel Kit</h1>
          {isDemo && <Badge variant="violet">Demo project</Badge>}
        </div>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">From the idea: “{props.project.idea}”</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={`/api/projects/${props.project.id}/download`} className="btn-primary" onClick={() => void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: "download_clicked", props: { kind: "full_kit" } }) }).catch(() => {})}>
            <Download className="h-4 w-4" aria-hidden /> Download Complete Channel Kit
          </a>
          {isGuest && !isDemo && (
            <Link href={`/register?next=/kit/${props.project.id}`} className="btn-secondary">Create a free account to save it</Link>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Overview ── */}
        <Card className="lg:col-span-2">
          <CardTitle>Overview</CardTitle>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{a.channel_positioning}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Target audience</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{a.target_audience}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Brand personality</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{a.brand_personality}</p>
            </div>
          </div>
        </Card>

        {/* ── Channel names ── */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Channel names</CardTitle>
            <button onClick={() => copy(a.channel_names.map(n => n.name).join("\n"), "names")} className="btn-ghost !p-1.5" aria-label="Copy all names">
              {copied === "names" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <ol className="mt-3 max-h-72 space-y-2.5 overflow-y-auto pr-1">
            {a.channel_names.map((n, i) => (
              <li key={n.name} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-sm font-semibold">{i + 1}. {n.name}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.rationale}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* ── Description ── */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <CardTitle>Channel description</CardTitle>
            <button onClick={() => copy(a.channel_description.seo, "desc")} className="btn-ghost !p-1.5" aria-label="Copy SEO description">
              {copied === "desc" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{a.channel_description.short}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{a.channel_description.seo}</p>
          <button onClick={() => downloadText("channel-description.txt", `${a.channel_description.short}\n\n${a.channel_description.seo}`)} className="btn-secondary mt-4 !px-3 !py-2 !text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download description
          </button>
        </Card>

        {/* ── Brand kit ── */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Brand kit</CardTitle>
            <button onClick={() => setEditOpen(true)} className="btn-ghost !p-1.5" aria-label="Edit brand name and tagline"><Pencil className="h-4 w-4" /></button>
          </div>
          {brandKit && (
            <>
              <p className="mt-3 text-lg font-bold" style={{ fontFamily: "var(--font-grotesk)" }}>{brandKit.name}</p>
              <p className="text-sm italic text-slate-500 dark:text-slate-400">{brandKit.tagline}</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {([["Primary", brandKit.colors.primary], ["Secondary", brandKit.colors.secondary], ["Accent", brandKit.colors.accent], ["Background", brandKit.colors.background]] as const).map(([label, hex]) => (
                  <button key={label} onClick={() => copy(hex, label)} className="group text-left" title={`Copy ${hex}`}>
                    <span className="block h-10 rounded-lg border border-slate-200 dark:border-slate-700" style={{ backgroundColor: hex }} />
                    <span className="mt-1 block text-[10px] text-slate-400">{label}</span>
                    <span className="block text-[10px] font-mono text-slate-500">{copied === label ? "Copied!" : hex}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => downloadText("colors.json", JSON.stringify(brandKit.colors, null, 2))} className="btn-secondary mt-4 !px-3 !py-2 !text-xs w-full">
                <Download className="h-3.5 w-3.5" aria-hidden /> Download brand colors
              </button>
            </>
          )}
        </Card>

        {/* ── Logo ── */}
        <Card>
          <CardTitle>Logo</CardTitle>
          <div className="mt-3 flex items-center gap-4">
            {logo ? (
              <img src={`/api/assets/${logo.id}/file?t=${jobs.logo?.status === "completed" ? Date.now() : 0}`} alt={`Channel logo for ${brandKit?.name ?? "your channel"}`} width={96} height={96} className="h-24 w-24 rounded-2xl border border-slate-200 dark:border-slate-700" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-600">Not generated</div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">800×800 PNG — square, readable at small sizes.</p>
          </div>
          <AssetActions assetType="logo" assetId={logo?.id} filename="logo.png" />
          <JobBar assetType="logo" label="logo" />
        </Card>

        {/* ── Banner ── */}
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Banner</CardTitle>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="radiogroup" aria-label="Banner preview device">
              {([["desktop", Monitor, "Desktop"], ["mobile", Smartphone, "Mobile"], ["tv", Tv, "TV"]] as const).map(([id, Icon, label]) => (
                <button key={id} role="radio" aria-checked={bannerDevice === id} onClick={() => setBannerDevice(id)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${bannerDevice === id ? "bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300" : "text-slate-500"}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700" style={{ aspectRatio: "16/9" }}>
            {banner ? (
              <>
                <img src={`/api/assets/${banner.id}/file?t=${jobs.banner?.status === "completed" ? Date.now() : 0}`} alt={`Channel banner for ${brandKit?.name ?? "your channel"}`} className="absolute inset-0 h-full w-full object-cover" style={{
                  // Simulate YouTube's device crops over the 2560×1440 canvas.
                  objectPosition: bannerDevice === "mobile" ? "center" : "center",
                  transform: bannerDevice === "desktop" ? "scaleY(2.65)" : bannerDevice === "mobile" ? "scale(1.66)" : "none",
                }} />
                <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-dashed border-white/70" style={{
                    width: bannerDevice === "tv" ? "100%" : bannerDevice === "desktop" ? "100%" : "60.4%",
                    height: bannerDevice === "tv" ? "100%" : "29.5%",
                  }} />
                </div>
                <p className="absolute bottom-2 left-2 rounded bg-slate-950/70 px-2 py-1 text-[10px] text-white">
                  {bannerDevice === "tv" ? "TV: full 2560×1440 visible" : bannerDevice === "desktop" ? "Desktop: 2560×423 strip" : "Mobile safe area: 1546×423"}
                </p>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">Banner not generated yet</div>
            )}
          </div>
          <AssetActions assetType="banner" assetId={banner?.id} filename="banner.png" />
          <JobBar assetType="banner" label="banner" />
        </Card>

        {/* ── Watermark ── */}
        <Card>
          <CardTitle>Watermark</CardTitle>
          <div className="mt-3 flex items-center gap-4">
            {watermark ? (
              <div className="relative h-20 w-32 overflow-hidden rounded-lg" style={{ backgroundImage: "linear-gradient(45deg,#94a3b8 25%,transparent 25%,transparent 75%,#94a3b8 75%),linear-gradient(45deg,#94a3b8 25%,#e2e8f0 25%,#e2e8f0 75%,#94a3b8 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,8px 8px" }}>
                <img src={`/api/assets/${watermark.id}/file?t=${jobs.watermark?.status === "completed" ? Date.now() : 0}`} alt="Channel watermark" className="absolute bottom-1 right-1 h-8 w-8" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-[10px] text-slate-400 dark:border-slate-600">Not generated</div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">Shown at real size over a video corner. 300×300, transparency preserved.</p>
          </div>
          <AssetActions assetType="watermark" assetId={watermark?.id} filename="watermark.png" />
          <JobBar assetType="watermark" label="watermark" />
        </Card>

        {/* ── Keywords ── */}
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Channel keywords</CardTitle>
            <Badge variant="amber">AI suggested — not verified search data</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {props.keywordGroups.map(g => (
              <div key={g.category}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{g.category}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.keywords.map(k => <span key={k} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{k}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">SEO keywords</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {(["primary", "secondary", "long_tail"] as const).map(level => (
                <div key={level}>
                  <p className="text-xs font-medium text-brand-600 dark:text-brand-400 capitalize">{level.replace("_", " ")}</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {a.seo_keywords[level].map(k => <li key={k}>• {k}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => downloadText("keywords.txt", props.keywordGroups.map(g => `## ${g.category}\n${g.keywords.join("\n")}`).join("\n\n") + "\n\n## SEO primary\n" + a.seo_keywords.primary.join("\n") + "\n\n## SEO secondary\n" + a.seo_keywords.secondary.join("\n") + "\n\n## SEO long tail\n" + a.seo_keywords.long_tail.join("\n"))} className="btn-secondary mt-4 !px-3 !py-2 !text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download keyword list
          </button>
        </Card>

        {/* ── Content strategy ── */}
        <Card>
          <CardTitle>Content pillars</CardTitle>
          <ol className="mt-3 space-y-3">
            {a.content_pillars.map((p, i) => (
              <li key={p.name} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{p.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <button onClick={() => downloadText("content-pillars.txt", a.content_pillars.map(p => `## ${p.name}\n${p.description}`).join("\n\n"))} className="btn-secondary mt-4 !px-3 !py-2 !text-xs w-full">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download pillars
          </button>
        </Card>

        {/* ── Video ideas ── */}
        <Card className="lg:col-span-3">
          <CardTitle>Video ideas</CardTitle>
          <div className="mt-4">
            <Tabs
              tabs={[
                { id: "long", label: `Long-form (${a.video_ideas.length})`, content: <IdeaTable ideas={a.video_ideas} /> },
                { id: "short", label: `Shorts (${a.shorts_ideas.length})`, content: <IdeaTable ideas={a.shorts_ideas} /> },
              ]}
            />
          </div>
          <button onClick={() => downloadText("video-ideas.txt", `LONG-FORM\n${"=".repeat(30)}\n\n` + a.video_ideas.map((v, i) => `${i + 1}. ${v.title}\n   Hook: ${v.hook}\n   Keyword: ${v.target_keyword} | Difficulty: ${v.difficulty} | Pillar: ${v.content_pillar}`).join("\n\n") + `\n\nSHORTS\n${"=".repeat(30)}\n\n` + a.shorts_ideas.map((v, i) => `${i + 1}. ${v.title}\n   Hook: ${v.hook}`).join("\n\n"))} className="btn-secondary !px-3 !py-2 !text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download video ideas
          </button>
        </Card>

        {/* ── Typography ── */}
        <Card className="lg:col-span-3">
          <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-brand-600" aria-hidden /><CardTitle>Typography & visual style</CardTitle></div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{a.visual_style}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {a.font_recommendations.map(f => (
              <div key={f.name} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-lg font-bold">{f.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.usage} · fallback: {f.fallback}</p>
              </div>
            ))}
          </div>
          <button onClick={() => downloadText("fonts.txt", a.font_recommendations.map(f => `${f.name} — ${f.usage} (fallback: ${f.fallback})`).join("\n"))} className="btn-secondary mt-4 !px-3 !py-2 !text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download fonts
          </button>
        </Card>
      </div>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit brand name & tagline">
        <form onSubmit={(e) => { e.preventDefault(); setEditOpen(false); setNotice("Saved locally for this session — brand kit edits apply to your next banner regeneration."); }}>
          <label htmlFor="bk-name" className="label">Brand name</label>
          <input id="bk-name" className="input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} maxLength={60} />
          <label htmlFor="bk-tagline" className="label mt-4">Tagline</label>
          <input id="bk-tagline" className="input" value={editForm.tagline} onChange={e => setEditForm({ ...editForm, tagline: e.target.value })} maxLength={120} />
          <button type="submit" className="btn-primary mt-6 w-full">Save</button>
        </form>
      </Dialog>
    </div>
  );
}

function IdeaTable({ ideas }: { ideas: { title: string; hook: string; target_keyword: string; difficulty: string; content_pillar: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
            <th className="py-2 pr-4 font-medium">Title</th>
            <th className="hidden py-2 pr-4 font-medium md:table-cell">Hook</th>
            <th className="hidden py-2 pr-4 font-medium sm:table-cell">Keyword</th>
            <th className="py-2 font-medium">Level</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {ideas.map((v, i) => (
            <tr key={i} className="align-top">
              <td className="py-2.5 pr-4">
                <p className="font-medium text-slate-800 dark:text-slate-200">{v.title}</p>
                <p className="mt-0.5 text-xs text-slate-400 md:hidden">{v.hook}</p>
              </td>
              <td className="hidden py-2.5 pr-4 text-xs text-slate-500 dark:text-slate-400 md:table-cell">{v.hook}</td>
              <td className="hidden py-2.5 pr-4 text-xs text-slate-500 sm:table-cell dark:text-slate-400">{v.target_keyword}</td>
              <td className="py-2.5">
                <Badge variant={v.difficulty === "easy" ? "green" : v.difficulty === "hard" ? "amber" : "slate"}>{v.difficulty}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
