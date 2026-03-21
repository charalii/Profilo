"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { RecruiterAnalytics, User } from "@/lib/types";

export default function RecruiterAnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<RecruiterAnalytics | null>(null);

  useEffect(() => {
    api
      .me()
      .then((u) => {
        if (u.role !== "recruiter") {
          router.replace("/dashboard");
          return;
        }
        setUser(u);
        return api.getRecruiterAnalytics().then(setData);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">
        Loading analytics…
      </div>
    );
  }

  const statusEntries = Object.entries(data.by_status).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Recruiter analytics</h1>
      <p className="mt-2 text-slate-400">
        Snapshot of your postings and inbound applications.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <p className="text-xs uppercase text-slate-500">Open jobs</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">{data.open_jobs}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <p className="text-xs uppercase text-slate-500">Total applications</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {data.total_applications}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <p className="text-xs uppercase text-slate-500">Last 7 days</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {data.applications_last_7_days}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Pipeline distribution</h2>
        <ul className="mt-4 space-y-2">
          {statusEntries.length === 0 && (
            <li className="text-sm text-slate-500">No applications yet.</li>
          )}
          {statusEntries.map(([status, count]) => (
            <li
              key={status}
              className="flex items-center justify-between rounded-lg border border-slate-700/60 px-3 py-2 text-sm"
            >
              <span className="capitalize text-slate-300">{status}</span>
              <span className="font-semibold text-cyan-300">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
