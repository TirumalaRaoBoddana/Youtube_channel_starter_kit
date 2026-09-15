import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/site/auth-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="section flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to access your saved channel kits.</p>
        <AuthForm mode="login" />
        <div className="relative my-6 text-center">
          <span className="relative z-10 bg-white px-3 text-xs text-slate-400 dark:bg-slate-900">or</span>
          <span aria-hidden className="absolute left-0 top-1/2 h-px w-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <a href="/api/auth/google" className="btn-secondary w-full">Continue with Google</a>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New here? <Link href="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">Create a free account</Link>
        </p>
      </div>
    </div>
  );
}
