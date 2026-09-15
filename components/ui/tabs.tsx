"use client";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Tabs({ tabs, initial = 0 }: { tabs: { id: string; label: string; content: React.ReactNode }[]; initial?: number }) {
  const [active, setActive] = useState(tabs[initial]?.id);
  return (
    <div>
      <div role="tablist" aria-label="Content tabs" className="mb-4 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
        {tabs.map(t => (
          <button
            key={t.id} role="tab" aria-selected={active === t.id} id={`tab-${t.id}`} aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn("rounded-lg px-4 py-2 text-sm font-medium transition-all", active === t.id ? "bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200")}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map(t => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== t.id}>
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  );
}
