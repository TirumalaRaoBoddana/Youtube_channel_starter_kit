import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <div className="section py-12">
      <article className="prose-cf mx-auto max-w-2xl">
        <h1 className="!mt-0 text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: September 15, 2026</p>
        <h2>What we collect</h2>
        <p>We collect the minimum data needed to run the service: your email and name if you create an account, the channel ideas you submit, the projects and assets you generate, and basic usage counters for daily limits. We do not sell personal data.</p>
        <h2>Guest data</h2>
        <p>If you use the product without an account, generations are associated with an anonymous cookie token so your free quota cannot be bypassed. Clearing cookies starts a fresh guest identity.</p>
        <h2>AI processing</h2>
        <p>Your inputs are sent to the configured AI providers to generate results. When no external provider is configured, generation happens entirely on our servers with the built-in engine. We do not use your content to train models.</p>
        <h2>Your controls</h2>
        <ul>
          <li>Delete any project (and all its assets) from the Projects page</li>
          <li>Delete your account and all associated data by contacting us, or via account settings once enabled</li>
          <li>Opt out of analytics by blocking the analytics endpoint — core functionality is unaffected</li>
        </ul>
        <h2>Retention</h2>
        <p>Guest projects may be purged after 30 days of inactivity. Account data is retained while your account is active and deleted on request.</p>
        <h2>Contact</h2>
        <p>Privacy questions: support@channelforge.ai (replace with the operator's contact for your deployment).</p>

      </article>
    </div>
  );
}
