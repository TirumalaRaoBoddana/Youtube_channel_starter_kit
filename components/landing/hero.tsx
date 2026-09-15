"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const EXAMPLES = [
  "I want to create a channel explaining AI and mathematics to beginners.",
  "A faceless channel telling untold history stories with voiceover.",
  "Budget travel guides for solo travellers in South India.",
  "Simple home cooking for students living away from home.",
];
const NICHES = ["AI & Tech", "Gaming", "Fitness", "Finance", "Cooking", "Travel", "Education", "Storytelling"];

async function trackEvent(name: string, props?: Record<string, unknown>) {
  try { await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name, props }) }); } catch { /* analytics are best-effort */ }
}

export function Hero() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const start = (value: string) => {
    void trackEvent("example_clicked", { idea: value.slice(0, 80) });
    router.push(`/generate?idea=${encodeURIComponent(value)}`);
  };
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-violet2-500/10 blur-3xl" />
      </div>
      <div className="section relative py-16 text-center sm:py-24">
        <p className="badge mx-auto bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"><Sparkles className="h-3 w-3" aria-hidden /> AI-powered channel launch workflow</p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl" style={{ fontFamily: "var(--font-grotesk)" }}>
          Launch Your YouTube Channel <span className="bg-gradient-to-r from-brand-600 to-violet2-500 bg-clip-text text-transparent">With AI</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
          From one simple idea, generate your channel name, branding, keywords, content strategy and visual identity — then download the complete channel kit.
        </p>

        <form
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); if (idea.trim().length >= 8) start(idea.trim()); else router.push(`/generate?idea=${encodeURIComponent(idea.trim())}`); }}
        >
          <label htmlFor="hero-idea" className="sr-only">Describe your channel idea</label>
          <input
            id="hero-idea" value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="Describe your channel idea…"
            className="input !py-4 sm:flex-1"
          />
          <button type="submit" className="btn-primary !py-4 whitespace-nowrap">
            Generate My Channel <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </form>

        <div className="mx-auto mt-6 max-w-2xl text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Try an example</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => start(ex)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-600">
                {ex.length > 52 ? ex.slice(0, 52) + "…" : ex}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Popular niches:</span>
            {NICHES.map(n => (
              <button key={n} onClick={() => start(`A YouTube channel about ${n.toLowerCase()} for beginners`)} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">{n}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
