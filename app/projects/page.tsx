import Link from "next/link";
import { Trash2, FolderKanban } from "lucide-react";
import { getCurrentUser, getGuestToken } from "@/lib/auth/session";
import { collections } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { DeleteProjectButton } from "@/components/dashboard/delete-project";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Projects" };

export default function ProjectsPage() {
  const user = getCurrentUser();
  const guestToken = getGuestToken();
  const projects = collections.projects()
    .filter(p => (user ? p.userId === user.id : p.guestToken === guestToken))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="section py-10">
      <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-grotesk)" }}>My Projects</h1>
      {projects.length === 0 ? (
        <div className="card mt-8 py-14 text-center">
          <FolderKanban className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" aria-hidden />
          <h2 className="mt-4 font-semibold">No projects yet</h2>
          <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">Generate your first channel kit — it takes about a minute.</p>
          <Link href="/generate" className="btn-primary mt-5 inline-flex">Create Your First Channel</Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {projects.map(p => (
            <li key={p.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <Link href={`/kit/${p.id}`} className="min-w-0 flex-1">
                <p className="font-semibold hover:text-brand-600 dark:hover:text-brand-400">{p.analysis?.channel_names[0]?.name ?? "Untitled"}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{p.idea}</p>
                <p className="mt-1 text-[11px] text-slate-400">Created {new Date(p.createdAt).toLocaleDateString()}</p>
              </Link>
              <div className="flex items-center gap-3">
                <Badge variant="green">{p.status}</Badge>
                <a href={`/api/projects/${p.id}/download`} className="btn-secondary !px-3 !py-1.5 !text-xs">Download kit</a>
                <DeleteProjectButton projectId={p.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
