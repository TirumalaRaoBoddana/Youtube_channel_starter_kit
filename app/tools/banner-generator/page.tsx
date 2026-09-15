import type { Metadata } from "next";
import { SeoToolPage } from "@/components/seo/tool-page";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_PAGE_DATA } from "@/lib/seo/tool-pages";

export const metadata: Metadata = {
  title: "YouTube Banner Generator (Free)",
  description: TOOL_PAGE_DATA["banner"].lede.slice(0, 155),
  alternates: { canonical: "/tools/banner-generator" },
};

export default function Page() {
  const data = TOOL_PAGE_DATA["banner"];
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return (
    <SeoToolPage
      appUrl={APP_URL}
      data={{ ...data, tool: <ToolForm tool="banner" cta="Generate Banner" /> }}
    />
  );
}
