"use client";

import { useEffect, useState } from "react";
import { VacancyCard } from "@/components/VacancyCard";
import { api } from "@/lib/api";
import type { MatchResult } from "@/lib/types";

export default function DashboardPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(50);

  useEffect(() => {
    loadMatches();
  }, [minScore]);

  async function loadMatches() {
    setLoading(true);
    try {
      const data = await api.getMatches(minScore);
      setMatches(data.items);
    } catch {
      // Not authenticated or no matches
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleComputeMatches() {
    try {
      await api.computeMatches();
      await loadMatches();
    } catch (err) {
      alert("Please upload a CV first");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">
            Min score:
            <input
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="ml-2 w-16 rounded border px-2 py-1 text-sm"
              min={0}
              max={99}
            />
          </label>
          <button
            onClick={handleComputeMatches}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Refresh Matches
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-gray-500">Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500">No matches found. Upload your CV and compute matches to get started.</p>
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
