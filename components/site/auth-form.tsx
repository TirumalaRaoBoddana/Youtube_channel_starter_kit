"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AlertCircle } from "lucide-react";

function AuthFormInner({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" },
        body: JSON.stringify(mode === "register" ? form : { email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Something went wrong. Please try again.");
      router.push(params.get("next") ?? "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
        </div>
      )}
      {mode === "register" && (
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" required maxLength={80} className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" required className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password {mode === "register" && <span className="text-xs font-normal text-slate-400">(min 8 characters)</span>}</label>
        <input id="password" type="password" required minLength={mode === "register" ? 8 : 1} maxLength={128} className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete={mode === "register" ? "new-password" : "current-password"} />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  return <Suspense fallback={null}><AuthFormInner mode={mode} /></Suspense>;
}
