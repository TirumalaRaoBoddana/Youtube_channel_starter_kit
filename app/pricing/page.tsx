import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/features/plans";
import { CheckoutButton } from "@/components/site/checkout-button";
import { paymentsEnabled } from "@/lib/payments";
import { getCurrentUser } from "@/lib/auth/session";
import { FaqJsonLd } from "@/components/seo/jsonld";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Free & Pro",
  description: "Start free with daily generations. Pro unlocks higher AI limits, HD exports, unlimited projects and no ads.",
  alternates: { canonical: "/pricing" },
};

const FAQS = [
  { q: "What happens when I hit my daily limit?", a: "Text and image generations reset at midnight UTC. Guests get 3, free accounts get 10 text + 2 image, and Pro gets 200 text + 40 image per day." },
  { q: "Can I cancel anytime?", a: "Yes — Pro is a monthly subscription with no lock-in. Cancel from your dashboard and you keep Pro until the period ends." },
  { q: "Are generated assets mine to use?", a: "Yes. Everything you generate is yours for your channel and branding. If a paid image provider is configured, its usage terms also apply." },
];

export default function PricingPage() {
  const user = getCurrentUser();
  return (
    <div className="section py-14">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-grotesk)" }}>Simple, honest pricing</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">Start free. Upgrade when your channel starts shipping.</p>
      </header>
      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div className="card p-8">
          <h2 className="font-semibold">{PLANS.free.name}</h2>
          <p className="mt-2 text-4xl font-bold">$0</p>
          <ul className="mt-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
            {PLANS.free.features.map(f => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />{f}</li>)}
          </ul>
          <Link href="/generate" className="btn-secondary mt-8 w-full">Start free</Link>
        </div>
        <div className="card border-brand-300 p-8 dark:border-brand-700">
          <h2 className="font-semibold">{PLANS.pro.name}</h2>
          <p className="mt-2 text-4xl font-bold">${PLANS.pro.priceMonthly}<span className="text-sm font-normal text-slate-400">/month</span></p>
          <ul className="mt-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
            {PLANS.pro.features.map(f => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />{f}</li>)}
          </ul>
          <CheckoutButton enabled={paymentsEnabled} signedIn={Boolean(user)} />
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-2xl divide-y divide-slate-200 dark:divide-slate-800">
        {FAQS.map(f => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden className="text-slate-400 group-open:rotate-45">＋</span></summary>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.a}</p>
          </details>
        ))}
      </div>
      <FaqJsonLd faqs={FAQS} />
    </div>
  );
}
