import type { Metadata } from "next";
import { SeoToolPage } from "@/components/seo/tool-page";
import { SEO_PAGES } from "@/lib/seo/landing-pages";

export const metadata: Metadata = {
  title: "AI YouTube Channel Generator — Free Channel Starter Kit",
  description: SEO_PAGES["ai-youtube-channel-generator"].lede.slice(0, 155),
  alternates: { canonical: "/ai-youtube-channel-generator" },
};

export default function Page() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return <SeoToolPage appUrl={APP_URL} data={SEO_PAGES["ai-youtube-channel-generator"]} />;
}
