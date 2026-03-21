"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { api } from "@/lib/api";
import type { ApplicationRecruiter, User } from "@/lib/types";

export default function RecruiterApplicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<ApplicationRecruiter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((u) => {
        if (u.role !== "recruiter") {
          router.replace("/dashboard");
          return;
        }
        setUser(u);
        return load();
      })
      .catch(() => router.push("/login"));
  }, [router]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getRecruiterApplications();
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(appId: string, newStatus: string) {
    await api.updateApplication(appId, { status: newStatus });
    await load();
  }

  if (!user) {
    return (
      <div className="px-4 py-16 text-center text-slate-500">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Application inbox</h1>
      <p className="mt-2 text-slate-400">
        Move candidates through screening, interviews, and offers. Status
        changes email the candidate when SMTP is configured.
      </p>

      {loading ? (
        <div className="mt-12 text-center text-slate-500">Loading…</div>
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
