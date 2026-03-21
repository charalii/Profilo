"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { AppShell } from "@/components/AppShell";

export default function WriterPage() {
  const [question, setQuestion] = useState("");
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [vacancyOrg, setVacancyOrg] = useState("");
  const [vacancyDesc, setVacancyDesc] = useState("");
  const [wordLimit, setWordLimit] = useState<number | "">("");
  const [language, setLanguage] = useState("en");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Humanize tab
  const [mode, setMode] = useState<"generate" | "humanize">("generate");
  const [rawText, setRawText] = useState("");
  const [humanized, setHumanized] = useState("");

  async function handleGenerate() {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const doc = await api.generateApplicationAnswer({
        question,
        vacancy_title: vacancyTitle || undefined,
        vacancy_org: vacancyOrg || undefined,
        vacancy_description: vacancyDesc || undefined,
        word_limit: wordLimit ? Number(wordLimit) : undefined,
        language,
      });
      setAnswer(doc.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleHumanize() {
    if (!rawText.trim()) return;
    setLoading(true);
    setError("");
    setHumanized("");
    try {
      const doc = await api.humanizeText(rawText);
      setHumanized(doc.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Humanization failed");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Application Answer Writer
        </h1>
        <p className="text-slate-400 mb-6">
          Generate human-sounding answers for application questions. Built to
          pass AI detection tools.
        </p>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "generate"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Generate Answer
          </button>
          <button
            onClick={() => setMode("humanize")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "humanize"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Humanize Text
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {mode === "generate" ? (
          <div className="space-y-4">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Application Question *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='e.g. "Describe your experience with project management in an international environment"'
                rows={3}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Vacancy context (optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Job Title
                </label>
                <input
                  value={vacancyTitle}
                  onChange={(e) => setVacancyTitle(e.target.value)}
                  placeholder="e.g. Policy Officer"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Organization
                </label>
                <input
                  value={vacancyOrg}
                  onChange={(e) => setVacancyOrg(e.target.value)}
                  placeholder="e.g. European Commission"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Job Description (optional — helps tailor the answer)
              </label>
              <textarea
                value={vacancyDesc}
                onChange={(e) => setVacancyDesc(e.target.value)}
                placeholder="Paste the job description or key requirements here..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Word Limit
                </label>
                <input
                  type="number"
                  value={wordLimit}
                  onChange={(e) =>
                    setWordLimit(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="e.g. 300 (leave empty for auto)"
                  min={50}
                  max={1000}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="el">Greek</option>
                  <option value="it">Italian</option>
                  <option value="nl">Dutch</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !question.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? "Generating..." : "Generate Human Answer"}
            </button>

            {/* Anti-detection info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">
                Anti-Detection Features
              </h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>
                  &bull; High burstiness — varied sentence lengths (short, medium, long)
                </li>
                <li>
                  &bull; High perplexity — unexpected but natural word choices
                </li>
                <li>
                  &bull; No AI transition words (Furthermore, Moreover, etc.)
                </li>
                <li>
                  &bull; Active voice, first person, contractions
                </li>
                <li>
                  &bull; Concrete details from your CV, not vague statements
                </li>
                <li>
                  &bull; Mixed register — professional but natural
                </li>
                <li>
                  &bull; Post-processing filter removes remaining AI patterns
                </li>
              </ul>
            </div>

            {answer && (
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Generated Answer
                  </h3>
                  <button
                    onClick={() => copyToClipboard(answer)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {answer}
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  {answer.split(/\s+/).length} words
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Humanize mode */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Paste AI-generated text to humanize
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your AI-generated cover letter, answer, or any text here..."
                rows={8}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleHumanize}
              disabled={loading || !rawText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? "Humanizing..." : "Humanize Text"}
            </button>

            {humanized && (
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Humanized Version
                  </h3>
                  <button
                    onClick={() => copyToClipboard(humanized)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {humanized}
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  {humanized.split(/\s+/).length} words
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
