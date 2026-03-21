"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VacancyCard } from "@/components/VacancyCard";
import { api } from "@/lib/api";
import type { MatchResult, RecruiterAnalytics, User } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [analytics, setAnalytics] = useState<RecruiterAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(50);

  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u);
        if (u.role === "recruiter") {
          return api.getRecruiterAnalytics().then(setAnalytics);
        }
        return Promise.resolve();
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!user || user.role !== "candidate") return;
    loadMatches();
  }, [minScore, user]);

  async function loadMatches() {
    setLoading(true);
    try {
      const data = await api.getMatches(minScore);
      setMatches(data.items);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleComputeMatches() {
    try {
      await api.computeMatches();
      await loadMatches();
    } catch {
      alert("Please upload a CV first");
    }
  }

  if (loading && !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">
        Loading…
      </div>
    );
  }

  if (user?.role === "recruiter") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-bold text-white">Recruiter overview</h1>
        <p className="mt-2 text-slate-400">
          Manage postings, review candidates, and track pipeline performance.
        </p>

        {analytics && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Open jobs
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-400">
                {analytics.open_jobs}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Applications
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-400">
                {analytics.total_applications}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Last 7 days
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-400">
                {analytics.applications_last_7_days}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Status mix
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {Object.entries(analytics.by_status)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ") || "—"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/recruiter/jobs"
            className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Manage jobs
          </Link>
          <Link
            href="/recruiter/applications"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Inbox
          </Link>
          <Link
            href="/recruiter/analytics"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Analytics
          </Link>
          <Link
            href="/recruiter/candidates"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Search candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Your matches</h1>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm text-slate-400">
            Min score:{" "}
            <input
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="ml-2 w-16 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-sm text-white"
              min={0}
              max={99}
            />
          </label>
          <button
            type="button"
            onClick={handleComputeMatches}
            className="rounded-md bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Refresh matches
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-slate-500">Loading matches…</div>
      ) : matches.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-slate-400">
            No matches found. Upload your CV and compute matches to get started.
          </p>
          <Link
            href="/profile"
            className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:underline"
          >
            Go to profile
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <VacancyCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
