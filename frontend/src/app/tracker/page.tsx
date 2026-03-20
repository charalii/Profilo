"use client";

import { useEffect, useState } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { api } from "@/lib/api";
import type { Application } from "@/lib/types";

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(appId: string, newStatus: string) {
    await api.updateApplication(appId, { status: newStatus });
    await loadApplications();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Application Tracker</h1>
      <p className="mt-2 text-gray-600">
        Track your job applications from interest to offer.
      </p>

      {loading ? (
        <div className="mt-12 text-center text-gray-500">Loading applications...</div>
      ) : (
        <div className="mt-8">
          <KanbanBoard
            applications={applications}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
}
