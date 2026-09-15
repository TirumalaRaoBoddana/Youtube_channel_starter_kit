import type { Metadata } from "next";
import { SeoToolPage } from "@/components/seo/tool-page";
import { SEO_PAGES } from "@/lib/seo/landing-pages";

export const metadata: Metadata = {
  title: "YouTube Video Idea Generator — 40 Ideas With Hooks",
  description: SEO_PAGES["youtube-video-idea-generator"].lede.slice(0, 155),
  alternates: { canonical: "/youtube-video-idea-generator" },
};

export default function Page() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return <SeoToolPage appUrl={APP_URL} data={SEO_PAGES["youtube-video-idea-generator"]} />;
}
