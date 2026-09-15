"use client";
import { useState } from "react";
import { Loader2, Download, Sparkles, AlertCircle, Monitor, Smartphone, Tv } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LOGO_STYLES } from "@/lib/validation/schemas";

type Tool = "logo" | "banner" | "watermark" | "keyword" | "name" | "video-idea";

interface FieldDef { id: string; label: string; type: "text" | "select"; placeholder?: string; options?: string[]; required?: boolean; }

const FIELDS: Record<Tool, FieldDef[]> = {
  logo: [
    { id: "channelName", label: "Channel name", type: "text", placeholder: "e.g. The Math of AI", required: true },
    { id: "niche", label: "Channel niche", type: "text", placeholder: "e.g. AI and mathematics for beginners", required: true },
    { id: "style", label: "Logo style", type: "select", options: [...LOGO_STYLES] },
    { id: "colorPreference", label: "Color preference (optional)", type: "text", placeholder: "#4f46e5" },
  ],
  banner: [
    { id: "channelName", label: "Channel name", type: "text", placeholder: "e.g. The Math of AI", required: true },
    { id: "tagline", label: "Tagline (optional)", type: "text", placeholder: "Hard ideas, drawn simply." },
    { id: "niche", label: "Channel niche", type: "text", placeholder: "e.g. AI and mathematics", required: true },
    { id: "colorPreference", label: "Color preference (optional)", type: "text", placeholder: "#4f46e5" },
  ],
  watermark: [
    { id: "channelName", label: "Channel name", type: "text", placeholder: "e.g. The Math of AI", required: true },
    { id: "kind", label: "Watermark type", type: "select", options: ["initials", "icon"] },
    { id: "colorPreference", label: "Color preference (optional)", type: "text", placeholder: "#4f46e5" },
  ],
  keyword: [
    { id: "niche", label: "Your channel niche / topic", type: "text", placeholder: "e.g. budget travel in South India", required: true },
    { id: "language", label: "Language (optional)", type: "select", options: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Bengali", "Marathi", "Spanish"] },
  ],
  name: [
    { id: "niche", label: "What is your channel about?", type: "text", placeholder: "e.g. explaining stock markets to students", required: true },
    { id: "personality", label: "Channel personality (optional)", type: "select", options: ["Professional", "Friendly", "Energetic", "Educational", "Funny", "Inspirational", "Minimal", "Premium", "Bold"] },
  ],
  "video-idea": [
    { id: "niche", label: "Your channel niche / topic", type: "text", placeholder: "e.g. home workouts for beginners", required: true },
    { id: "contentType", label: "Content type (optional)", type: "select", options: ["Educational", "Entertainment", "Gaming", "Technology", "Finance", "Fitness", "Travel", "Cooking", "News", "Storytelling", "Kids", "Faceless", "Business", "Personal Brand"] },
  ],
};

const ENDPOINTS: Record<Tool, string> = {
  logo: "/api/tools/image", banner: "/api/tools/image", watermark: "/api/tools/image",
  keyword: "/api/channel/keywords", name: "/api/channel/names", "video-idea": "/api/channel/video-ideas",
};

type Result =
  | { kind: "image"; assetId: string }
  | { kind: "names"; names: { name: string; rationale: string }[] }
  | { kind: "keywords"; groups: { category: string; keywords: string[] }[]; seo: { primary: string[]; secondary: string[]; long_tail: string[] } }
  | { kind: "ideas"; long: { title: string; hook: string; target_keyword: string; difficulty: string }[]; shorts: { title: string; hook: string }[] }
  | null;

export function ToolForm({ tool, cta }: { tool: Tool; cta: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [device, setDevice] = useState<"desktop" | "mobile" | "tv">("desktop");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setResult(null); setProgress(10);
    const isImage = ["logo", "banner", "watermark"].includes(tool);
    const ticker = isImage ? setInterval(() => setProgress(p => Math.min(p + 12, 92)), 900) : null;
    try {
      const payload = tool === "logo" || tool === "banner" || tool === "watermark"
        ? { tool, ...values, ...(values.colorPreference && !/^#[0-9a-fA-F]{6}$/.test(values.colorPreference) ? { colorPreference: undefined } : {}) }
        : values;
      const res = await fetch(ENDPOINTS[tool], {
        method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Something went wrong. Please try again.");
      void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: "tool_used", props: { tool } }) }).catch(() => {});

      if (isImage) {
        // poll job
        const jobId = json.data.jobId as string;
        const poll = async (): Promise<string> => {
          const r = await fetch(`/api/jobs/${jobId}`);
          const j = await r.json();
          if (!j.success) throw new Error("Job lookup failed.");
          if (j.data.status === "completed") return j.data.result?.assetId as string;
          if (j.data.status === "failed") throw new Error(j.data.error ?? "Something went wrong while generating your asset. Please try again.");
          setProgress(Math.max(j.data.progress, 15));
          await new Promise(r2 => setTimeout(r2, 700));
          return poll();
        };
        const assetId = await poll();
        setResult({ kind: "image", assetId });
      } else if (tool === "name") {
        setResult({ kind: "names", names: json.data.channel_names });
      } else if (tool === "keyword") {
        setResult({ kind: "keywords", groups: json.data.channel_keywords, seo: json.data.seo_keywords });
      } else {
        setResult({ kind: "ideas", long: json.data.video_ideas, shorts: json.data.shorts_ideas });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      if (ticker) clearInterval(ticker);
      setBusy(false); setProgress(0);
    }
  };

  const fields = FIELDS[tool];

  return (
    <div className="grid gap-8 lg:grid-cols-2" id="tool">
      <form onSubmit={submit} className="card p-6">
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.id}>
              <label htmlFor={`tf-${f.id}`} className="label">{f.label}{f.required && <span className="text-red-500" aria-hidden> *</span>}</label>
              {f.type === "select" ? (
                <select id={`tf-${f.id}`} className="input" value={values[f.id] ?? ""} onChange={e => setValues({ ...values, [f.id]: e.target.value })}>
                  <option value="">Choose…</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input id={`tf-${f.id}`} className="input" required={f.required} placeholder={f.placeholder} maxLength={200}
                  value={values[f.id] ?? ""} onChange={e => setValues({ ...values, [f.id]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
        {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Generating…</> : <><Sparkles className="h-4 w-4" aria-hidden /> {cta}</>}
        </button>
        {busy && <div className="mt-4"><Progress value={progress} label="Generation progress" /><p className="mt-2 text-center text-xs text-slate-400">Usually takes a few seconds.</p></div>}
      </form>

      <div className="card min-h-[320px] p-6" aria-live="polite">
        {!result && !busy && (
          <div className="flex h-full min-h-[272px] flex-col items-center justify-center text-center">
            <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-600" aria-hidden />
            <p className="mt-3 text-sm text-slate-400">Your result will appear here.</p>
          </div>
        )}
        {busy && !result && <div className="space-y-3"><div className="skeleton h-40 w-full" /><div className="skeleton h-4 w-2/3" /><div className="skeleton h-4 w-1/2" /></div>}

        {result?.kind === "image" && (
          <div>
            {tool === "banner" ? (
              <>
                <div className="mb-3 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="radiogroup" aria-label="Preview device">
                  {([["desktop", Monitor, "Desktop"], ["mobile", Smartphone, "Mobile"], ["tv", Tv, "TV"]] as const).map(([id, Icon, label]) => (
                    <button key={id} role="radio" aria-checked={device === id} onClick={() => setDevice(id)}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${device === id ? "bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300" : "text-slate-500"}`}>
                      <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
                    </button>
                  ))}
                </div>
                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700" style={{ aspectRatio: "16/9" }}>
                  <img src={`/api/assets/${result.assetId}/file`} alt="Generated YouTube banner" className="absolute inset-0 h-full w-full object-cover"
                    style={{ transform: device === "desktop" ? "scaleY(2.65)" : device === "mobile" ? "scale(1.66)" : "none" }} />
                  <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-dashed border-white/70" style={{ width: device === "mobile" ? "60.4%" : "100%", height: device === "tv" ? "100%" : "29.5%" }} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">Dashed line = {device === "tv" ? "full TV view" : device === "desktop" ? "desktop visible strip (2560×423)" : "mobile safe area (1546×423)"}</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <img src={`/api/assets/${result.assetId}/file`} alt={`Generated ${tool}`}
                  className={tool === "watermark" ? "h-40 w-40" : "h-48 w-48 rounded-3xl border border-slate-200 dark:border-slate-700"} />
                {tool === "watermark" && <p className="text-xs text-slate-400">Previewed over a checkered (transparent) background.</p>}
              </div>
            )}
            <a href={`/api/assets/${result.assetId}/file`} download={`${tool}.png`} className="btn-primary mt-5 w-full">
              <Download className="h-4 w-4" aria-hidden /> Download {tool}
            </a>
          </div>
        )}

        {result?.kind === "names" && (
          <div>
            <h3 className="mb-3 font-semibold">{result.names.length} channel name ideas</h3>
            <ol className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {result.names.map((n, i) => (
                <li key={n.name} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p className="text-sm font-semibold">{i + 1}. {n.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.rationale}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {result?.kind === "keywords" && (
          <div>
            <p className="badge mb-3 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">AI suggested — not verified search data</p>
            <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
              {result.groups.map(g => (
                <div key={g.category}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{g.category}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {g.keywords.map(k => <span key={k} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{k}</span>)}
                  </div>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Long-tail phrases</p>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {result.seo.long_tail.map(k => <li key={k}>• {k}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {result?.kind === "ideas" && (
          <div className="max-h-[28rem] space-y-6 overflow-y-auto pr-1">
            <div>
              <h3 className="mb-2 font-semibold">Long-form ideas ({result.long.length})</h3>
              <ul className="space-y-2">
                {result.long.map((v, i) => (
                  <li key={i} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{v.hook}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Shorts ideas ({result.shorts.length})</h3>
              <ul className="space-y-2">
                {result.shorts.map((v, i) => (
                  <li key={i} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{v.hook}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
