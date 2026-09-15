import { getCurrentUser } from "@/lib/auth/session";
import { env } from "@/lib/config/env";
import { collections } from "@/lib/db";
import { today } from "@/lib/rate-limit";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

function Stats() {
  const users = collections.users();
  const gens = collections.generationRequests();
  const day = today();
  const byType = new Map<string, number>();
  for (const r of gens) byType.set(r.requestType, (byType.get(r.requestType) ?? 0) + 1);
  const stats = [
    ["Total users", String(users.length)],
    ["Active today", String(new Set(gens.filter(r => r.startedAt.startsWith(day)).map(r => r.userId ?? r.guestToken)).size)],
    ["Total generations", String(gens.length)],
    ["Image generations", String(gens.filter(r => r.requestType.startsWith("generate_") || r.requestType.startsWith("tool_") || r.requestType.startsWith("regenerate_")).length)],
    ["Text generations", String(gens.filter(r => ["channel_analysis", "channel_names", "channel_keywords", "video_ideas", "channel_description"].includes(r.requestType)).length)],
    ["Failed requests", String(gens.filter(r => r.status === "failed").length)],
    ["Est. AI cost", `$${gens.reduce((s, r) => s + r.estimatedCost, 0).toFixed(4)}`],
    ["Projects", String(collections.projects().length)],
  ] as const;
  return (
    <div className="section py-10">
      <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-grotesk)" }}>Admin dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Popular tools</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {[...byType.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t, c]) => (
              <li key={t} className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">{t}</span><Badge variant="brand">{c}</Badge></li>
            ))}
            {byType.size === 0 && <li className="text-slate-400">No generations yet.</li>}
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold">Popular niches</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {Object.entries(collections.projects().reduce<Record<string, number>>((acc, p) => { const n = p.analysis?.niche ?? "unknown"; acc[n] = (acc[n] ?? 0) + 1; return acc; }, {}))
              .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([n, c]) => (
                <li key={n} className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">{n}</span><Badge variant="violet">{c}</Badge></li>
              ))}
          </ul>
        </Card>
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold">Users</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-xs uppercase tracking-wide text-slate-400"><th className="py-2">Name</th><th>Email</th><th>Plan</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id}><td className="py-2 pr-4">{u.name}</td><td className="pr-4">{u.email}</td><td className="pr-4">{u.plan}</td><td className="pr-4">{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="py-4 text-slate-400">No registered users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const user = getCurrentUser();
  const isAdmin = user && (user.role === "admin" || env.adminEmails.includes(user.email.toLowerCase()));
  if (!isAdmin) {
    return (
      <div className="section py-20 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Sign in with an account whose email is listed in the ADMIN_EMAILS environment variable.
        </p>
      </div>
    );
  }
  return <Stats />;
}
