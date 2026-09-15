import { cn } from "@/lib/utils/cn";
const variants = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};
export function Badge({ variant = "slate", className, children }: { variant?: keyof typeof variants; className?: string; children: React.ReactNode }) {
  return <span className={cn("badge", variants[variant], className)}>{children}</span>;
}
