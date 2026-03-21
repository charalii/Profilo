"use client";

import type { Application, ApplicationRecruiter } from "@/lib/types";

const COLUMNS = [
  { id: "interested", label: "Interested", color: "border-slate-600 bg-slate-900/40" },
  { id: "applied", label: "Applied", color: "border-amber-700/50 bg-amber-950/20" },
  { id: "screening", label: "Screening", color: "border-cyan-700/50 bg-cyan-950/20" },
  { id: "interview", label: "Interview", color: "border-violet-700/50 bg-violet-950/20" },
  { id: "offer", label: "Offer", color: "border-emerald-700/50 bg-emerald-950/20" },
  { id: "rejected", label: "Rejected", color: "border-rose-800/50 bg-rose-950/20" },
  { id: "withdrawn", label: "Withdrawn", color: "border-slate-700 bg-slate-950/40" },
];

type BoardApp = Application | ApplicationRecruiter;

interface Props {
  applications: BoardApp[];
  onStatusChange: (appId: string, newStatus: string) => void;
}

function candidateLine(app: BoardApp) {
  if ("candidate_email" in app) {
    const r = app as ApplicationRecruiter;
    return (
      <p className="mt-1 text-xs text-cyan-300/90">
        {r.candidate_name || r.candidate_email}
      </p>
    );
  }
  return null;
}

export function KanbanBoard({ applications, onStatusChange }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((app) => app.status === col.id);
        return (
          <div
            key={col.id}
            className={`min-w-[220px] flex-1 rounded-lg border-2 p-3 ${col.color}`}
          >
            <h3 className="text-sm font-semibold text-slate-200">
              {col.label}{" "}
              <span className="text-slate-500">({colApps.length})</span>
            </h3>
            <div className="mt-3 space-y-2">
              {colApps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-md border border-slate-600 bg-slate-950/60 p-3 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-100 line-clamp-2">
                    {app.vacancy.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {app.vacancy.organization}
                  </p>
                  {candidateLine(app)}
                  {app.applied_at && (
                    <p className="mt-1 text-xs text-slate-600">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  )}
                  <select
                    value={app.status}
                    onChange={(e) => onStatusChange(app.id, e.target.value)}
                    className="mt-2 w-full rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-300"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {colApps.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-600">
                  No applications
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
