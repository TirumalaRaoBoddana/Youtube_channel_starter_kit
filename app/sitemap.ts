import type { MetadataRoute } from "next";
import { NICHE_PAGES } from "@/lib/seo/niche-pages";
import { POSTS } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const statics = ["", "/pricing", "/blog", "/generate",
    "/tools/logo-generator", "/tools/banner-generator", "/tools/watermark-generator",
    "/tools/keyword-generator", "/tools/name-generator", "/tools/video-idea-generator",
    "/ai-youtube-channel-generator", "/youtube-logo-generator", "/youtube-banner-generator",
    "/youtube-watermark-generator", "/youtube-keyword-generator", "/youtube-channel-name-generator",
    "/youtube-video-idea-generator", "/faceless-youtube-channel-generator", "/kit/demo_math_of_ai",
  ];
  return [
    ...statics.map(s => ({ url: `${base}${s}`, changeFrequency: "weekly" as const, priority: s === "" ? 1 : 0.8 })),
    ...NICHE_PAGES.map(n => ({ url: `${base}/youtube-channel-generator/${n.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...POSTS.map(p => ({ url: `${base}/blog/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
