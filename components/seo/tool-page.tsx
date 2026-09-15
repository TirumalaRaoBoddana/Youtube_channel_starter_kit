import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdSlot } from "./ad-slot";
import { FaqJsonLd, BreadcrumbJsonLd, JsonLd } from "./jsonld";
import type { ReactNode } from "react";

export interface SeoPageData {
  slug: string;
  h1: string;
  lede: string;
  tool?: ReactNode;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
}

export function SeoToolPage({ data, appUrl }: { data: SeoPageData; appUrl: string }) {
  return (
    <div className="section py-12">
      <BreadcrumbJsonLd items={[{ name: "Home", url: appUrl }, { name: data.h1, url: `${appUrl}/${data.slug}` }]} />
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-grotesk)" }}>{data.h1}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-500 dark:text-slate-400">{data.lede}</p>
      </header>

      {data.tool && <div className="mx-auto mt-10 max-w-5xl">{data.tool}</div>}

      <article className="prose-cf mx-auto mt-14 max-w-3xl">
        {data.sections.map(s => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            {s.bullets && <ul>{s.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
          </section>
        ))}
      </article>

      <AdSlot type="in-content" />

      <section className="mx-auto mt-6 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
          {data.faqs.map(f => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}<span aria-hidden className="text-slate-400 transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
        <FaqJsonLd faqs={data.faqs} />
      </section>

      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-lg font-semibold">Related tools</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.related.map(r => (
            <Link key={r.href} href={r.href} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-600">
              {r.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-14 max-w-3xl rounded-3xl bg-gradient-to-br from-brand-700 to-violet2-600 px-8 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Want the complete channel kit?</h2>
        <p className="mt-2 text-sm text-brand-100">Names, branding, keywords and 40 video ideas from one sentence.</p>
        <Link href="/generate" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700">Generate My Channel <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: data.h1, applicationCategory: "MultimediaApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
    </div>
  );
}
