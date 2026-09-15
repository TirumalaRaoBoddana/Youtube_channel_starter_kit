import Link from "next/link";
import { Zap } from "lucide-react";

const groups = [
  { title: "Product", links: [["Generate", "/generate"], ["Pricing", "/pricing"], ["Demo kit", "/kit/demo_math_of_ai"], ["Dashboard", "/dashboard"]] },
  { title: "Tools", links: [["Logo generator", "/tools/logo-generator"], ["Banner generator", "/tools/banner-generator"], ["Name generator", "/tools/name-generator"], ["Keyword generator", "/tools/keyword-generator"], ["Video idea generator", "/tools/video-idea-generator"], ["Watermark generator", "/tools/watermark-generator"]] },
  { title: "Resources", links: [["Blog", "/blog"], ["Channel generator guide", "/ai-youtube-channel-generator"], ["Faceless channels", "/faceless-youtube-channel-generator"], ["About", "/blog/how-to-start-a-youtube-channel"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 font-bold" style={{ fontFamily: "var(--font-grotesk)" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-violet2-500 text-white"><Zap className="h-3.5 w-3.5" aria-hidden /></span>
            ChannelForge AI
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Turn your YouTube idea into a complete channel brand in minutes.</p>
        </div>
        {groups.map(g => (
          <nav key={g.title} aria-label={g.title}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{g.title}</h3>
            <ul className="mt-3 space-y-2">
              {g.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="section border-t border-slate-200 py-6 text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} ChannelForge AI. Not affiliated with YouTube or Google. AI-generated keywords are suggestions, not verified search data.
      </div>
    </footer>
  );
}
