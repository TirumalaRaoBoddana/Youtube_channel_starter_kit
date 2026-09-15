import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost } from "@/lib/blog/posts";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/jsonld";
import { AdSlot } from "@/components/seo/ad-slot";

export function generateStaticParams() { return POSTS.map(p => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.description, alternates: { canonical: `/blog/${post.slug}` } };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <article className="section py-12">
      <BreadcrumbJsonLd items={[{ name: "Home", url: appUrl }, { name: "Blog", url: `${appUrl}/blog` }, { name: post.title, url: `${appUrl}/blog/${post.slug}` }]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, datePublished: post.date, author: { "@type": "Organization", name: "ChannelForge AI" } }} />
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.readingMinutes} min read</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-grotesk)" }}>{post.title}</h1>
      </header>
      <div className="prose-cf mx-auto mt-10 max-w-2xl">
        {post.body.map((b, i) => {
          if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
          if (b.type === "ul") return <ul key={i}>{b.items.map(it => <li key={it}>{it}</li>)}</ul>;
          return <p key={i}>{b.text}</p>;
        })}
      </div>
      <div className="mx-auto max-w-2xl"><AdSlot type="in-content" /></div>
      <div className="mx-auto mt-4 max-w-2xl rounded-3xl bg-gradient-to-br from-brand-700 to-violet2-600 px-8 py-8 text-center text-white">
        <h2 className="text-xl font-bold">Put this into practice</h2>
        <p className="mt-1 text-sm text-brand-100">Generate your complete channel kit in one minute.</p>
        <Link href="/generate" className="mt-5 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700">Generate My Channel</Link>
      </div>
    </article>
  );
}
