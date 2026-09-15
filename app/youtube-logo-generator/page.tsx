import type { Metadata } from "next";
import { SeoToolPage } from "@/components/seo/tool-page";
import { SEO_PAGES } from "@/lib/seo/landing-pages";

export const metadata: Metadata = {
  title: "YouTube Logo Generator: Profile Pictures That Work",
  description: SEO_PAGES["youtube-logo-generator"].lede.slice(0, 155),
  alternates: { canonical: "/youtube-logo-generator" },
};

export default function Page() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return <SeoToolPage appUrl={APP_URL} data={SEO_PAGES["youtube-logo-generator"]} />;
}
