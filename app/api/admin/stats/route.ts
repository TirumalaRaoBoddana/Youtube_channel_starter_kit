import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { collections } from "@/lib/db";
import { today } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const g = guardApi(req, { requireAdmin: true });
  if (g.error) return g.error;

  const users = collections.users();
  const gens = collections.generationRequests();
  const day = today();
  const monthStart = day.slice(0, 7);

  const byType = new Map<string, number>();
  for (const r of gens) byType.set(r.requestType, (byType.get(r.requestType) ?? 0) + 1);

  return ok({
    totalUsers: users.length,
    usersByDay: new Set(gens.filter(r => r.startedAt.startsWith(day)).map(r => r.userId ?? r.guestToken)).size,
    usersByMonth: new Set(gens.filter(r => r.startedAt.startsWith(monthStart)).map(r => r.userId ?? r.guestToken)).size,
    generations: gens.length,
    imageGenerations: gens.filter(r => r.requestType.startsWith("generate_") || r.requestType.startsWith("regenerate_")).length,
    textGenerations: gens.filter(r => r.requestType === "channel_analysis" || r.requestType === "channel_names" || r.requestType === "channel_keywords" || r.requestType === "video_ideas" || r.requestType === "channel_description").length,
    failedRequests: gens.filter(r => r.status === "failed").length,
    estimatedCost: Number(gens.reduce((s, r) => s + r.estimatedCost, 0).toFixed(4)),
    popularTools: [...byType.entries()].sort((a, b) => b[1] - a[1]).map(([tool, count]) => ({ tool, count })),
    popularNiches: Object.entries(
      collections.projects().reduce<Record<string, number>>((acc, p) => {
        const n = p.analysis?.niche ?? "unknown";
        acc[n] = (acc[n] ?? 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]),
    subscriptions: { pro: users.filter(u => u.plan === "pro").length, free: users.filter(u => u.plan !== "pro").length },
    analyticsEvents: collections.analyticsEvents().length,
  });
}
