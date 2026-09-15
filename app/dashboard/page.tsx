import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Sparkles, FolderKanban, Image, Type, KeyRound, Lightbulb, Download, Crown } from "lucide-react";
import { getCurrentUser, getGuestToken } from "@/lib/auth/session";
import { collections } from "@/lib/db";
import { usageSummary } from "@/lib/rate-limit";
import { LIMITS } from "@/lib/config/limits";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const TOOLS = [
  { href: "/generate", icon: Sparkles, title: "Channel Kit", body: "Full analysis: names, strategy, branding, keywords, 40 video ideas." },
  { href: "/tools/logo-generator", icon: Image, title: "Logo", body: "Square profile icon in 12 styles." },
  { href: "/tools/banner-generator", icon: Image, title: "Banner", body: "2560×1440 with safe-area preview." },
  { href: "/tools/watermark-generator", icon: Image, title: "Watermark", body: "Minimal transparent mark." },
  { href: "/tools/keyword-generator", icon: KeyRound, title: "Keywords", body: "AI-suggested keyword clusters." },
  { href: "/tools/video-idea-generator", icon: Lightbulb, title: "Video Ideas", body: "Long-form and Shorts ideas with hooks." },
];

export default function DashboardPage() {
  const user = getCurrentUser();
  const guestToken = getGuestToken();
  const identity = user ?? { id: null, plan: "anon" as const };
  const plan = user ? user.plan : ("anon" as const);
  const usage = usageSummary(user?.id ?? null, guestToken);
  const limits = LIMITS[plan];
  const projects = collections.projects()
    .filter(p => (user ? p.userId === user.id : p.guestToken === guestToken))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="section py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-grotesk)" }}>
            {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Your workspace"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {user ? `Plan: ${user.plan === "pro" ? "Pro" : "Free"}` : "You're browsing as a guest. Sign in to keep projects long-term."}
          </p>
        </div>
        <div className="flex gap-3">
          {!user && <Link href="/register" className="btn-secondary">Create free account</Link>}
          <Link href="/generate" className="btn-primary"><Plus className="h-4 w-4" aria-hidden /> New generation</Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Text generations today</p>
          <p className="mt-1 text-2xl font-bold">{usage.text}<span className="text-sm font-normal text-slate-400"> / {limits.text}</span></p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Image generations today</p>
          <p className="mt-1 text-2xl font-bold">{usage.image}<span className="text-sm font-normal text-slate-400"> / {limits.image}</span></p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Saved projects</p>
          <p className="mt-1 text-2xl font-bold">{projects.length}{plan !== "pro" ? <span className="text-sm font-normal text-slate-400"> / 3</span> : null}</p>
        </Card>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2"><FolderKanban className="h-5 w-5 text-brand-600" aria-hidden /> My Projects</h2>
          <Link href="/projects" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">View all</Link>
        </div>
        {projects.length === 0 ? (
          <Card className="py-14 text-center">
            <Type className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" aria-hidden />
            <h3 className="mt-4 font-semibold">You haven't created a channel yet.</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">Your next YouTube channel could start here.</p>
            <Link href="/generate" className="btn-primary mt-5 inline-flex">Create Your First Channel</Link>
            <p className="mt-3 text-xs text-slate-400">Or <Link href="/kit/demo_math_of_ai" className="underline">explore a demo kit</Link> first.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map(p => (
              <Link key={p.id} href={`/kit/${p.id}`} className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <p className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">{p.analysis?.channel_names[0]?.name ?? "Untitled channel"}</p>
                  <Badge variant={p.status === "ready" ? "green" : "slate"}>{p.status}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{p.idea}</p>
                <p className="mt-3 text-[11px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()} · {collections.assets().filter(a => a.projectId === p.id).length} assets</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Generate</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href} className="card group flex items-start gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-300"><t.icon className="h-5 w-5" aria-hidden /></span>
              <span>
                <span className="block text-sm font-semibold">{t.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{t.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {plan !== "pro" && (
        <Card className="mt-10 flex flex-wrap items-center justify-between gap-4 border-brand-200 bg-brand-50/50 dark:border-brand-900 dark:bg-brand-950/30">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-brand-600" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Unlock Pro</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">200 text + 40 image generations daily, unlimited projects, no ads.</p>
            </div>
          </div>
          <Link href="/pricing" className="btn-primary !py-2.5"><Download className="hidden" aria-hidden /> See plans</Link>
        </Card>
      )}
    </div>
  );
}
