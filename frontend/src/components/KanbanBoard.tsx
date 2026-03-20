"use client";

import type { Application } from "@/lib/types";

const COLUMNS = [
  { id: "interested", label: "Interested", color: "bg-blue-50 border-blue-200" },
  { id: "applied", label: "Applied", color: "bg-yellow-50 border-yellow-200" },
  { id: "interview", label: "Interview", color: "bg-purple-50 border-purple-200" },
  { id: "offer", label: "Offer", color: "bg-green-50 border-green-200" },
  { id: "rejected", label: "Rejected", color: "bg-red-50 border-red-200" },
];

interface Props {
  applications: Application[];
  onStatusChange: (appId: string, newStatus: string) => void;
}

export function KanbanBoard({ applications, onStatusChange }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((app) => app.status === col.id);
        return (
          <div
            key={col.id}
            className={`min-w-[240px] flex-1 rounded-lg border-2 p-3 ${col.color}`}
          >
            <h3 className="text-sm font-semibold text-gray-700">
              {col.label}{" "}
              <span className="text-gray-400">({colApps.length})</span>
            </h3>
            <div className="mt-3 space-y-2">
              {colApps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-md border bg-white p-3 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {app.vacancy.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {app.vacancy.organization}
                  </p>
                  {app.applied_at && (
                    <p className="mt-1 text-xs text-gray-400">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  )}
                  <select
                    value={app.status}
                    onChange={(e) => onStatusChange(app.id, e.target.value)}
                    className="mt-2 w-full rounded border px-2 py-1 text-xs text-gray-600"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
              ))}
              {colApps.length === 0 && (
                <p className="py-4 text-center text-xs text-gray-400">
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
