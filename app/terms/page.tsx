import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <div className="section py-12">
      <article className="prose-cf mx-auto max-w-2xl">
        <h1 className="!mt-0 text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: September 15, 2026</p>
        <h2>The service</h2>
        <p>ChannelForge AI generates YouTube channel strategy and branding assets from your inputs. Generated content is provided as creative suggestions; you are responsible for how you use it on your channel.</p>
        <h2>Your content</h2>
        <p>You keep ownership of what you create with the service, including generated assets, subject to the terms of any underlying AI provider. You are responsible for ensuring your use complies with YouTube's policies and applicable law.</p>
        <h2>Acceptable use</h2>
        <p>You agree not to use the service to generate unlawful, hateful, deceptive or impersonating content, to circumvent usage limits, or to resell raw API access. Accounts violating this may be disabled.</p>
        <h2>AI output disclaimer</h2>
        <p>AI-generated keywords are suggestions, not verified search data. AI-generated names, descriptions and strategies are starting points that you should review before publishing. We do not guarantee rankings, monetization or channel performance.</p>
        <h2>Subscriptions</h2>
        <p>Where paid plans are offered, subscriptions renew monthly until cancelled. Cancellation takes effect at the end of the current billing period.</p>
        <h2>Liability</h2>
        <p>The service is provided as-is. To the maximum extent permitted by law, our liability is limited to the amounts you paid us in the previous three months.</p>

      </article>
    </div>
  );
}
