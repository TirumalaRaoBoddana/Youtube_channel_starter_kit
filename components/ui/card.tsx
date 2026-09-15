import { cn } from "@/lib/utils/cn";
export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card p-6", className)} {...rest}>{children}</div>;
}
export function CardTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-slate-900 dark:text-slate-100", className)}>{children}</h3>;
}
