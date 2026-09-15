export function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className ?? "h-4 w-full"}`} aria-hidden />;
}
