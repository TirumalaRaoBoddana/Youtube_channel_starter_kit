"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const remove = async () => {
    setBusy(true);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE", headers: { "x-cf-client": "1" } });
    setBusy(false);
    if (res.ok) window.location.reload();
    else setOpen(false);
  };
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Delete project" className="btn-ghost !p-2 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete this project?">
        <p className="text-sm text-slate-500 dark:text-slate-400">This permanently removes the project, its generated assets and downloads. This cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={remove} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            {busy ? "Deleting…" : "Delete project"}
          </button>
        </div>
      </Dialog>
    </>
  );
}
