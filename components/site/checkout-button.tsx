"use client";
import { useState } from "react";
import Link from "next/link";

export function CheckoutButton({ enabled, signedIn }: { enabled: boolean; signedIn: boolean }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (!signedIn) return <Link href="/register?next=/pricing" className="btn-primary mt-8 w-full">Create account to upgrade</Link>;

  const checkout = async () => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/payments/checkout", { method: "POST", headers: { "x-cf-client": "1" } });
      const json = await res.json();
      if (json.success && json.data?.url) window.location.href = json.data.url;
      else setMsg(json.error?.message ?? "Checkout is not available yet.");
    } catch {
      setMsg("Checkout is not available yet.");
    } finally { setBusy(false); }
  };

  return (
    <div className="mt-8">
      <button onClick={checkout} disabled={busy || !enabled} className="btn-primary w-full">
        {busy ? "Starting checkout…" : enabled ? "Upgrade to Pro" : "Pro checkout coming soon"}
      </button>
      {(!enabled || msg) && <p className="mt-2 text-center text-xs text-slate-400">{msg || "Payments are not configured on this deployment yet — the free tier has no limits on features, only daily generations."}</p>}
    </div>
  );
}
