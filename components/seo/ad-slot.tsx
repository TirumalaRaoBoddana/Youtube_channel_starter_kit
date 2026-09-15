import { env } from "@/lib/config/env";
import { getCurrentUser } from "@/lib/auth/session";
import { seesAds } from "@/lib/features/plans";

// Ad abstraction. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT_ID is set,
// and never for Pro users (server-side check — no client trust).
export function AdSlot({ type, label = "Advertisement" }: { type: "banner" | "sidebar" | "in-content"; label?: string }) {
  const user = getCurrentUser();
  if (!env.adsenseClientId) return null;
  if (user && !seesAds(user.plan)) return null;
  const style = type === "sidebar" ? "min-h-[600px] lg:min-h-[600px]" : type === "banner" ? "min-h-[90px]" : "min-h-[250px]";
  return (
    <aside aria-label={label} className={`my-8 flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 p-4 text-center text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 ${style}`}>
      <ins className="adsbygoogle block w-full" style={{ display: "block" }} data-ad-client={env.adsenseClientId} data-ad-slot={type} data-ad-format="auto" data-full-width-responsive="true" />
      <span className="sr-only">Advertisement</span>
    </aside>
  );
}
