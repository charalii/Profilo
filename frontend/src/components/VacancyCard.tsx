"use client";

import { MatchBadge } from "./MatchBadge";
import { GeneratePanel } from "./GeneratePanel";
import type { MatchResult } from "@/lib/types";
import { useState } from "react";

interface Props {
  match: MatchResult;
}

export function VacancyCard({ match }: Props) {
  const { vacancy } = match;
  const [showGenerate, setShowGenerate] = useState(false);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-5 shadow-sm transition hover:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100 line-clamp-2">
            {vacancy.title}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{vacancy.organization}</p>
        </div>
        <MatchBadge score={match.match_score} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {vacancy.location && (
          <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
            {vacancy.location}
          </span>
        )}
        {vacancy.contract_type && (
          <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
            {vacancy.contract_type.replace(/_/g, " ")}
          </span>
        )}
        {vacancy.deadline && (
          <span className="rounded-full bg-amber-950/50 px-2 py-1 text-amber-200">
            Deadline: {new Date(vacancy.deadline).toLocaleDateString()}
          </span>
        )}
        <span className="rounded-full bg-blue-950/50 px-2 py-1 text-blue-300">
          {vacancy.source.toUpperCase()}
        </span>
      </div>

      {match.matched_keywords.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-emerald-400">Matched:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {match.matched_keywords.slice(0, 5).map((kw) => (
              <span key={kw} className="rounded bg-emerald-950/60 px-1.5 py-0.5 text-xs text-emerald-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {match.missing_keywords.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-rose-400">Missing:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {match.missing_keywords.slice(0, 5).map((kw) => (
              <span key={kw} className="rounded bg-rose-950/50 px-1.5 py-0.5 text-xs text-rose-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <a
          href={vacancy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          View Vacancy
        </a>
        <button
          onClick={() => setShowGenerate(!showGenerate)}
          className="rounded-md bg-[#1A56DB] px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
        >
          AI Generate
        </button>
      </div>

      {showGenerate && (
        <GeneratePanel vacancyId={vacancy.id} vacancyTitle={vacancy.title} />
      )}
    </div>
  );
}
