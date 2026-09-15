import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-bold text-brand-600" style={{ fontFamily: "var(--font-grotesk)" }}>404</p>
      <h1 className="mt-4 text-2xl font-bold">This page doesn't exist</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">The link may be broken, or the project may have been deleted.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/generate" className="btn-secondary">Generate a channel</Link>
      </div>
    </div>
  );
}
