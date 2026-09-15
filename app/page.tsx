import Link from "next/link";
import { ArrowRight, Check, Palette, FileText, Hash, Lightbulb, Image, LayoutTemplate, Droplets, BarChart3, Layers, ClipboardList, PlayCircle } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { FaqJsonLd, JsonLd } from "@/components/seo/jsonld";
import { AdSlot } from "@/components/seo/ad-slot";

const STEPS = [
  { n: 1, title: "Enter your idea", body: "One sentence is enough. Add your audience, language and tone if you like — everything else is optional." },
  { n: 2, title: "AI creates your strategy", body: "Positioning, content pillars, channel names, description and keywords tailored to your niche — not generic filler." },
  { n: 3, title: "Generate your branding", body: "Logo, banner with safe-area preview and watermark in your brand colors, ready for YouTube's size requirements." },
  { n: 4, title: "Download your channel kit", body: "A complete ZIP: branding PNGs, description, keywords, content pillars and 40 video ideas. Launch today." },
];

const FEATURES = [
  { icon: Hash, title: "AI Channel Names", body: "10-20 memorable, brandable name options with reasoning — not spammy keyword soup." },
  { icon: Image, title: "AI Logo", body: "Square profile icon readable at small sizes, in 12 style directions." },
  { icon: LayoutTemplate, title: "YouTube Banner", body: "2560×1440 banner with mobile, desktop and TV safe-area previews." },
  { icon: Droplets, title: "Watermark", body: "Minimal transparent watermark — initials, icon or logo mark." },
  { icon: BarChart3, title: "SEO Keywords", body: "Primary, secondary and long-tail keyword sets, clearly labelled as AI suggestions." },
  { icon: Lightbulb, title: "Video Ideas", body: "20 long-form ideas and 20 Shorts ideas with hooks, keywords and difficulty." },
  { icon: Palette, title: "Brand Kit", body: "Colors, typography, tagline and visual style that match your channel's personality." },
  { icon: ClipboardList, title: "Content Strategy", body: "3-7 content pillars so your first 50 videos have a plan, not a panic." },
];

const FAQS = [
  { q: "Do I need an account to try ChannelForge AI?", a: "No. Guests get a free channel generation so you can see a real result before signing up. Create a free account afterwards to save and download your kit." },
  { q: "Are the AI-suggested keywords real search data?", a: "No, and we never pretend otherwise. Keywords are AI suggestions based on your niche. We clearly separate AI-suggested keywords from verified search data, which requires an external keyword tool." },
  { q: "What sizes are the branding assets?", a: "Logos are 800×800 square PNGs, banners are 2560×1440 (YouTube's recommended upload size with the 1546×425 safe area marked), and watermarks are 300×300 transparent PNGs." },
  { q: "Can I regenerate just the logo or banner?", a: "Yes. Every asset card has its own regenerate button, so you can iterate on one element without redoing the whole project." },
  { q: "What is included in the channel kit download?", a: "A ZIP with branding PNGs (logo, banner, watermark), channel description, keyword lists, content pillars, 40 video ideas, brand colors JSON and font recommendations." },
];

export default function LandingPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "ChannelForge AI", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "AI-powered YouTube channel starter kit: names, branding, keywords, content strategy." }} />
      <Hero />

      <section id="how-it-works" className="section py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-500 dark:text-slate-400">Four steps from idea to launch-ready channel kit. Most users finish in under 10 minutes.</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(s => (
            <li key={s.n} className="card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{s.n}</span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Everything your channel needs to launch</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-500 dark:text-slate-400">Not a bag of separate AI tools — one connected workflow that produces a coherent brand.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(f => (
            <div key={f.title} className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-300"><f.icon className="h-5 w-5" aria-hidden /></span>
              <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section py-16">
        <div className="card overflow-hidden !p-0">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-slate-200 p-8 dark:border-slate-800 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Before</p>
              <blockquote className="mt-4 rounded-xl bg-slate-100 p-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                “I want to create a channel explaining AI and mathematics to beginners.”
              </blockquote>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">That's the entire brief. No brand book, no designer, no SEO tool subscriptions.</p>
            </div>
            <div className="p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">After — one generation later</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {["12 brandable channel names with rationale", "Positioning, audience & 5 content pillars", "SEO description + 30 keyword suggestions", "20 long-form + 20 Shorts ideas with hooks", "Logo, 2560×1440 banner & watermark", "Brand colors + typography pairing"].map(t => (
                  <li key={t} className="flex items-start gap-2 text-slate-600 dark:text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />{t}</li>
                ))}
              </ul>
              <Link href="/kit/demo_math_of_ai" className="btn-secondary mt-6 inline-flex">Explore the live demo kit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      <AdSlot type="in-content" />

      <section className="section py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Simple pricing</h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="card p-7">
            <h3 className="font-semibold">Free</h3>
            <p className="mt-2 text-3xl font-bold">$0</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {["3 generations/day as guest", "10 text + 2 image generations/day signed in", "Full channel kit download", "3 saved projects"].map(t => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />{t}</li>
              ))}
            </ul>
            <Link href="/generate" className="btn-secondary mt-6 w-full">Start free</Link>
          </div>
          <div className="card relative border-brand-300 p-7 dark:border-brand-700">
            <span className="badge absolute -top-3 right-6 bg-brand-600 text-white">Pro</span>
            <h3 className="font-semibold">Pro</h3>
            <p className="mt-2 text-3xl font-bold">$9<span className="text-sm font-normal text-slate-400">/month</span></p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {["200 text + 40 image generations/day", "Unlimited saved projects", "HD asset exports", "No ads", "Priority generation"].map(t => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />{t}</li>
              ))}
            </ul>
            <Link href="/pricing" className="btn-primary mt-6 w-full">See Pro details</Link>
          </div>
        </div>
      </section>

      <section className="section py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mx-auto mt-8 max-w-2xl divide-y divide-slate-200 dark:divide-slate-800">
          {FAQS.map(f => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-slate-400 transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
        <FaqJsonLd faqs={FAQS} />
      </section>

      <section className="section pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-violet2-600 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to launch your channel?</h2>
          <p className="mx-auto mt-3 max-w-md text-brand-100">Your next YouTube channel could start with one sentence.</p>
          <Link href="/generate" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-brand-700 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <PlayCircle className="h-4 w-4" aria-hidden /> Generate My Channel
          </Link>
        </div>
      </section>
    </>
  );
}
