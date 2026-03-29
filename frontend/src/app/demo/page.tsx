"use client";

import Link from "next/link";

const MOCK_MATCHES = [
  {
    id: "1",
    match_score: 91,
    matched_keywords: ["policy analysis", "EU institutions", "multilingual", "stakeholder management", "AD5"],
    missing_keywords: ["EPSO competency framework", "budget management"],
    vacancy: {
      id: "v1",
      title: "Administrator (AD5) — DG TRADE",
      organization: "European Commission",
      location: "Brussels, Belgium",
      contract_type: "permanent",
      deadline: "2026-04-30",
      source: "epso",
    },
  },
  {
    id: "2",
    match_score: 84,
    matched_keywords: ["international security", "NATO standards", "English C2", "research", "drafting"],
    missing_keywords: ["French B2", "security clearance"],
    vacancy: {
      id: "v2",
      title: "Policy Officer — Emerging Security Challenges",
      organization: "NATO HQ",
      location: "Brussels, Belgium",
      contract_type: "fixed_term",
      deadline: "2026-05-15",
      source: "nato",
    },
  },
  {
    id: "3",
    match_score: 78,
    matched_keywords: ["development policy", "project management", "report writing", "P3 level"],
    missing_keywords: ["field experience", "French B1"],
    vacancy: {
      id: "v3",
      title: "Programme Officer (P3) — Sustainable Development",
      organization: "United Nations",
      location: "Geneva, Switzerland",
      contract_type: "fixed_term",
      deadline: "2026-04-20",
      source: "un",
    },
  },
  {
    id: "4",
    match_score: 72,
    matched_keywords: ["economic analysis", "taxation policy", "data analysis", "Excel"],
    missing_keywords: ["OECD tax model", "macro-econometric modeling"],
    vacancy: {
      id: "v4",
      title: "Policy Analyst — Tax Policy and Statistics",
      organization: "OECD",
      location: "Paris, France",
      contract_type: "fixed_term",
      deadline: "2026-05-01",
      source: "oecd",
    },
  },
  {
    id: "5",
    match_score: 68,
    matched_keywords: ["election observation", "rule of law", "field missions"],
    missing_keywords: ["OSCE region experience", "Russian B1"],
    vacancy: {
      id: "v5",
      title: "Associate Election Expert",
      organization: "OSCE ODIHR",
      location: "Vienna, Austria",
      contract_type: "short_term",
      deadline: "2026-04-10",
      source: "osce",
    },
  },
  {
    id: "6",
    match_score: 65,
    matched_keywords: ["legal analysis", "EU law", "contract drafting"],
    missing_keywords: ["notarial experience", "French C1"],
    vacancy: {
      id: "v6",
      title: "Legal Officer — Legal Service",
      organization: "European Parliament",
      location: "Luxembourg",
      contract_type: "permanent",
      deadline: "2026-06-01",
      source: "epso",
    },
  },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
    score >= 70 ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
    "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${color}`}>
      {score}%
    </span>
  );
}

const STATS = [
  { label: "New vacancies today", value: "23", color: "text-blue-400" },
  { label: "Your matches ≥ 70%", value: "8", color: "text-emerald-400" },
  { label: "Applications tracked", value: "4", color: "text-slate-200" },
  { label: "Upcoming deadlines", value: "3", color: "text-amber-400" },
];

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Demo banner */}
      <div className="mb-6 rounded-lg border border-blue-800/50 bg-blue-950/30 px-4 py-3 text-sm text-blue-300 flex items-center justify-between flex-wrap gap-2">
        <span>
          <strong>Demo mode</strong> — This is a preview with mock data.
          <Link href="/signup" className="ml-2 underline hover:text-white">Create your free account →</Link>
        </span>
        <Link href="/login" className="text-xs text-blue-400 hover:text-white">Already have an account? Sign in</Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your matches</h1>
          <p className="mt-1 text-sm text-slate-400">
            Scored against your CV across EPSO, NATO, UN, OECD and OSCE
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">
            Filter
          </button>
          <button className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
            Refresh matches
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Min score filter */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm text-slate-400">Min score:</span>
        {[50, 65, 75, 85].map((v) => (
          <button key={v} className={`rounded-full px-3 py-1 text-xs font-semibold border ${v === 50 ? "bg-[#1E3A8A] border-blue-700 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
            {v}%+
          </button>
        ))}
      </div>

      {/* Match cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_MATCHES.map((match) => (
          <div key={match.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-100 leading-snug line-clamp-2">
                  {match.vacancy.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{match.vacancy.organization}</p>
              </div>
              <ScoreBadge score={match.match_score} />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              {match.vacancy.location && (
                <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                  {match.vacancy.location}
                </span>
              )}
              {match.vacancy.contract_type && (
                <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                  {match.vacancy.contract_type.replace(/_/g, " ")}
                </span>
              )}
              {match.vacancy.deadline && (
                <span className="rounded-full bg-amber-950/50 px-2 py-1 text-amber-200">
                  Deadline: {new Date(match.vacancy.deadline).toLocaleDateString("en-GB")}
                </span>
              )}
              <span className="rounded-full bg-blue-950/50 px-2 py-1 text-blue-300 uppercase font-medium">
                {match.vacancy.source}
              </span>
            </div>

            {match.matched_keywords.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-emerald-400 mb-1">Matched</p>
                <div className="flex flex-wrap gap-1">
                  {match.matched_keywords.slice(0, 4).map((kw) => (
                    <span key={kw} className="rounded bg-emerald-950/60 px-1.5 py-0.5 text-xs text-emerald-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.missing_keywords.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-rose-400 mb-1">Missing</p>
                <div className="flex flex-wrap gap-1">
                  {match.missing_keywords.map((kw) => (
                    <span key={kw} className="rounded bg-rose-950/50 px-1.5 py-0.5 text-xs text-rose-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Score bar */}
            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all"
                  style={{ width: `${match.match_score}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800">
                Details
              </button>
              <Link
                href="/signup"
                className="rounded-md bg-[#1E3A8A] px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
              >
                AI Generate →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center">
        <p className="text-lg font-semibold text-white">Ready to see your real matches?</p>
        <p className="mt-2 text-sm text-slate-400">Upload your CV and get your first scored matches in under 30 seconds.</p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link href="/signup" className="rounded-md bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800">
            Start free — Upload your CV
          </Link>
          <Link href="/login" className="rounded-md border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
