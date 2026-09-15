import Link from "next/link";
import { Zap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { getCurrentUser } from "@/lib/auth/session";

export function SiteNavbar() {
  const user = getCurrentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <nav aria-label="Main" className="section flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight" style={{ fontFamily: "var(--font-grotesk)" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-violet2-500 text-white"><Zap className="h-4 w-4" aria-hidden /></span>
          <span className="text-lg">ChannelForge<span className="text-brand-600 dark:text-brand-400"> AI</span></span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/#how-it-works" className="btn-ghost">How it works</Link>
          <Link href="/tools/logo-generator" className="btn-ghost">Tools</Link>
          <Link href="/pricing" className="btn-ghost">Pricing</Link>
          <Link href="/blog" className="btn-ghost">Blog</Link>
          <Link href="/kit/demo_math_of_ai" className="btn-ghost">Demo</Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard" className="btn-primary !px-4 !py-2">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">Sign in</Link>
              <Link href="/generate" className="btn-primary !px-4 !py-2">Generate free</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
