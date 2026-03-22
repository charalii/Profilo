"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User, Vacancy } from "@/lib/types";

export default function VacancyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    api
      .getVacancy(id)
      .then(setVacancy)
      .catch(() => setVacancy(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "recruiter") {
      alert("Switch to a candidate account to apply.");
      return;
    }
    setApplying(true);
    try {
      await api.createApplication(id, "applied");
      router.push("/tracker");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not apply");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-slate-400">Vacancy not found.</p>
        <Link href="/jobs" className="mt-4 inline-block text-cyan-400 hover:underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/jobs" className="text-sm text-cyan-400 hover:underline">
        &larr; All jobs
      </Link>

      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{vacancy.title}</h1>
            <p className="mt-1 text-lg text-slate-400">{vacancy.organization}</p>
          </div>
          <span className="inline-block rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {vacancy.source}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
          {vacancy.location && (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {vacancy.location}
            </span>
          )}
          {vacancy.contract_type && (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {vacancy.contract_type}
            </span>
          )}
          {vacancy.deadline && (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {vacancy.deadline}
            </span>
          )}
          {vacancy.salary_range && (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {vacancy.salary_range}
            </span>
          )}
        </div>

        {vacancy.keywords.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Keywords
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {vacancy.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {vacancy.description && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </h3>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {vacancy.description}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-700 pt-6">
          <a
            href={vacancy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
          >
            View original posting
          </a>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply / Track"}
          </button>
          {user && user.role === "candidate" && (
            <>
              <Link
                href={`/writer?vacancy=${id}`}
                className="rounded-lg border border-cyan-600/50 px-4 py-2 text-sm font-medium text-cyan-400 hover:border-cyan-500"
              >
                Generate cover letter
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
