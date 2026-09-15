import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { NICHE_PAGES, getNichePage } from "@/lib/seo/niche-pages";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/jsonld";
import { AdSlot } from "@/components/seo/ad-slot";

export function generateStaticParams() {
  return NICHE_PAGES.map(n => ({ niche: n.slug }));
}

export function generateMetadata({ params }: { params: { niche: string } }): Metadata {
  const page = getNichePage(params.niche);
  if (!page) return { title: "Niche not found" };
  return {
    title: page.h1,
    description: page.lede.slice(0, 155),
    alternates: { canonical: `/youtube-channel-generator/${page.slug}` },
  };
}

export default function NichePage({ params }: { params: { niche: string } }) {
  const page = getNichePage(params.niche);
  if (!page) notFound();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="section py-12">
      <BreadcrumbJsonLd items={[{ name: "Home", url: appUrl }, { name: "Channel Generator", url: `${appUrl}/ai-youtube-channel-generator` }, { name: page.label, url: `${appUrl}/youtube-channel-generator/${page.slug}` }]} />
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-grotesk)" }}>{page.h1}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-500 dark:text-slate-400">{page.lede}</p>
      </header>

      <div className="mx-auto mt-10 max-w-2xl">
        <div className="card p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Try it with this example</p>
          <p className="mx-auto mt-2 max-w-md text-sm italic text-slate-600 dark:text-slate-300">“{page.exampleIdea}”</p>
          <Link href={`/generate?idea=${encodeURIComponent(page.exampleIdea)}`} className="btn-primary mt-5 inline-flex">
            Generate this channel <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <article className="prose-cf mx-auto mt-12 max-w-3xl">
        {page.paragraphs.map(p => (
          <section key={p.heading}>
            <h2>{p.heading}</h2>
            <p>{p.body}</p>
          </section>
        ))}
        <section>
          <h2>Content pillars this generator suggests for {page.label.toLowerCase()} channels</h2>
          <ul>{page.pillars.map(p => <li key={p}>{p}</li>)}</ul>
          <p>Every generation adapts these to your specific idea — pillars above are the typical starting structure, not a fixed template.</p>
        </section>
      </article>

      <AdSlot type="in-content" />

      <section className="mx-auto mt-4 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
          {page.faqs.map(f => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}<span aria-hidden className="text-slate-400 transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
        <FaqJsonLd faqs={page.faqs} />
      </section>

      <section className="mx-auto mt-10 max-w-3xl">
        <h2 className="text-lg font-semibold">Other niches</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {NICHE_PAGES.filter(n => n.slug !== page.slug).map(n => (
            <Link key={n.slug} href={`/youtube-channel-generator/${n.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300">{n.label}</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
