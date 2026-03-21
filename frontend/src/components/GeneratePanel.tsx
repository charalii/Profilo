"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  vacancyId: string;
  vacancyTitle: string;
}

export function GeneratePanel({ vacancyId, vacancyTitle }: Props) {
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [cvOptimization, setCvOptimization] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleGenerate(type: "cover_letter" | "cv_optimization") {
    setLoading(type);
    try {
      if (type === "cover_letter") {
        const doc = await api.generateCoverLetter(vacancyId);
        setCoverLetter(doc.content);
      } else {
        const doc = await api.generateCVOptimization(vacancyId);
        setCvOptimization(doc.content);
      }
    } catch {
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-600 bg-slate-950/40 p-4">
      <p className="text-xs font-medium text-slate-500">AI Generation for:</p>
      <p className="text-sm font-semibold text-slate-100">{vacancyTitle}</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => handleGenerate("cover_letter")}
          disabled={loading !== null}
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
        >
          {loading === "cover_letter" ? "Generating..." : "Cover Letter"}
        </button>
        <button
          onClick={() => handleGenerate("cv_optimization")}
          disabled={loading !== null}
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
        >
          {loading === "cv_optimization" ? "Generating..." : "CV Optimization"}
        </button>
      </div>

      {coverLetter && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-300">Cover Letter</h4>
          <div className="mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap rounded border border-slate-700 bg-slate-950/40 p-3 text-xs text-slate-200">
            {coverLetter}
          </div>
        </div>
      )}

      {cvOptimization && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-300">CV Optimization</h4>
          <div className="mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap rounded border border-slate-700 bg-slate-950/40 p-3 text-xs text-slate-200">
            {cvOptimization}
          </div>
        </div>
      )}
    </div>
  );
}
