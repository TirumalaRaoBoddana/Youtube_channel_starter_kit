import type { Metadata } from "next";
import { SeoToolPage } from "@/components/seo/tool-page";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_PAGE_DATA } from "@/lib/seo/tool-pages";

export const metadata: Metadata = {
  title: "YouTube Keyword Generator (Free)",
  description: TOOL_PAGE_DATA["keyword"].lede.slice(0, 155),
  alternates: { canonical: "/tools/keyword-generator" },
};

export default function Page() {
  const data = TOOL_PAGE_DATA["keyword"];
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return (
    <SeoToolPage
      appUrl={APP_URL}
      data={{ ...data, tool: <ToolForm tool="keyword" cta="Generate Keywords" /> }}
    />
  );
}
