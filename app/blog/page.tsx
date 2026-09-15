import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/blog/posts";
import { AdSlot } from "@/components/seo/ad-slot";

export const metadata: Metadata = {
  title: "Blog — YouTube Growth Guides",
  description: "Practical, hype-free guides on starting and growing a YouTube channel: naming, branding, banner sizes, niches and keywords.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="section py-12">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-grotesk)" }}>YouTube growth, minus the hype</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">Practical guides on starting and growing a channel — written to be used, not skimmed.</p>
      </header>
      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        {POSTS.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {p.readingMinutes} min read</p>
            <h2 className="mt-2 font-semibold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400">{p.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{p.description}</p>
          </Link>
        ))}
      </div>
      <div className="mx-auto max-w-4xl"><AdSlot type="banner" /></div>
    </div>
  );
}
