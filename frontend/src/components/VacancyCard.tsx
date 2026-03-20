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
    <div className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {vacancy.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{vacancy.organization}</p>
        </div>
        <MatchBadge score={match.match_score} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {vacancy.location && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
            {vacancy.location}
          </span>
        )}
        {vacancy.contract_type && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
            {vacancy.contract_type.replace(/_/g, " ")}
          </span>
        )}
        {vacancy.deadline && (
          <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-600">
            Deadline: {new Date(vacancy.deadline).toLocaleDateString()}
          </span>
        )}
        <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-600">
          {vacancy.source.toUpperCase()}
        </span>
      </div>

      {match.matched_keywords.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-green-700">Matched:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {match.matched_keywords.slice(0, 5).map((kw) => (
              <span key={kw} className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {match.missing_keywords.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-red-700">Missing:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {match.missing_keywords.slice(0, 5).map((kw) => (
              <span key={kw} className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-700">
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
          className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          View Vacancy
        </a>
        <button
          onClick={() => setShowGenerate(!showGenerate)}
          className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
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
