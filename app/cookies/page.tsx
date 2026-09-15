import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy", alternates: { canonical: "/cookies" } };

export default function Page() {
  return (
    <div className="section py-12">
      <article className="prose-cf mx-auto max-w-2xl">
        <h1 className="!mt-0 text-3xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="text-xs text-slate-400">Last updated: September 15, 2026</p>
        <h2>What cookies we use</h2>
        <ul>
          <li>Session cookie (cf_session): keeps you signed in. Strictly necessary, httpOnly.</li>
          <li>Guest token (cf_guest): associates guest generations with your free quota. Strictly necessary for abuse prevention.</li>
          <li>Theme preference (localStorage): remembers light/dark mode. Stored locally in your browser, never sent to us.</li>
        </ul>
        <h2>Analytics</h2>
        <p>If enabled by the operator, privacy-conscious analytics record product events (generation started, download clicked) without collecting unnecessary personal information.</p>
        <h2>Advertising</h2>
        <p>If the operator enables advertising (Google AdSense), the ad provider may set its own cookies per its policies. Pro accounts do not see ads. You can control ad personalization through Google's ad settings.</p>
        <h2>Managing cookies</h2>
        <p>You can clear or block cookies in your browser settings. Blocking the session cookie signs you out; blocking the guest cookie resets your guest quota identity.</p>

      </article>
    </div>
  );
}
