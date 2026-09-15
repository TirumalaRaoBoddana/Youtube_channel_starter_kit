"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CONTENT_TYPES, PERSONALITIES, LANGUAGES } from "@/lib/validation/schemas";

const STAGES = [
  "Understanding your channel idea",
  "Building channel strategy",
  "Creating brand identity",
  "Preparing your channel kit",
];

type Phase = "form" | "working" | "error";

function WizardInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [phase, setPhase] = useState<Phase>("form");
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    idea: params.get("idea") ?? "",
    targetAudience: "", language: "", country: "", contentType: "", personality: "",
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idea.trim().length < 8) { setError("Tell us a little more about your idea (at least 8 characters)."); return; }
    setPhase("working"); setStage(0); setError("");
    timerRef.current = setInterval(() => setStage(s => Math.min(s + 1, STAGES.length - 1)), 1800);
    try {
      const res = await fetch("/api/channel/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-cf-client": "1" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Something went wrong. Please try again.");
      void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: "channel_generation_completed" }) }).catch(() => {});
      router.push(`/kit/${json.data.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPhase("error");
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  if (phase === "working") {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center" role="status" aria-live="polite">
        <Sparkles className="mx-auto h-8 w-8 text-brand-600" aria-hidden />
        <h2 className="mt-4 text-xl font-bold">Building your channel…</h2>
        <div className="mt-6 space-y-3 text-left">
          {STAGES.map((s, i) => (
            <p key={s} className={`flex items-center gap-3 text-sm ${i < stage ? "text-slate-400 line-through" : i === stage ? "font-medium text-slate-900 dark:text-white" : "text-slate-400"}`}>
              {i < stage ? <Check className="h-4 w-4 text-emerald-500" aria-hidden /> : i === stage ? <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden /> : <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600" aria-hidden />}
              {s}{i === stage ? "…" : i < stage ? " ✓" : ""}
            </p>
          ))}
        </div>
        <div className="mt-6"><Progress value={((stage + 0.5) / STAGES.length) * 100} label="Generation progress" /></div>
        <p className="mt-3 text-xs text-slate-400">This usually takes a few seconds.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Describe your YouTube channel</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Only the idea is required — everything else helps the AI customize your kit.</p>

      {phase === "error" && error && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="idea" className="label">Your channel idea <span className="text-red-500" aria-hidden>*</span></label>
        <textarea id="idea" rows={3} required minLength={8} maxLength={500} value={form.idea}
          onChange={e => setForm({ ...form, idea: e.target.value })}
          placeholder='Example: "I want to create a channel explaining AI and mathematics to beginners."'
          className="input resize-none" />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="audience" className="label">Target audience <span className="text-xs text-slate-400">(optional)</span></label>
          <input id="audience" maxLength={200} value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} placeholder="e.g. college students, busy parents" className="input" />
        </div>
        <div>
          <label htmlFor="language" className="label">Language <span className="text-xs text-slate-400">(optional)</span></label>
          <select id="language" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="input">
            <option value="">Any</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="country" className="label">Country / region <span className="text-xs text-slate-400">(optional)</span></label>
          <input id="country" maxLength={100} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="e.g. India" className="input" />
        </div>
        <div>
          <label htmlFor="contentType" className="label">Content type <span className="text-xs text-slate-400">(optional)</span></label>
          <select id="contentType" value={form.contentType} onChange={e => setForm({ ...form, contentType: e.target.value })} className="input">
            <option value="">Any</option>
            {CONTENT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="label">Channel personality <span className="text-xs text-slate-400">(optional)</span></legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Channel personality">
          {PERSONALITIES.map(p => (
            <button key={p} type="button" role="radio" aria-checked={form.personality === p}
              onClick={() => setForm({ ...form, personality: form.personality === p ? "" : p })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${form.personality === p ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:text-slate-300"}`}>
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn-primary mt-8 w-full !py-3.5 text-base">
        <Sparkles className="h-4 w-4" aria-hidden /> Generate My Channel
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">Free to try — no account needed for your first generation.</p>
    </form>
  );
}

export function GenerateWizard() {
  return <Suspense fallback={<div className="card mx-auto max-w-2xl p-8"><div className="skeleton h-6 w-1/2" /><div className="skeleton mt-4 h-24" /></div>}><WizardInner /></Suspense>;
}
