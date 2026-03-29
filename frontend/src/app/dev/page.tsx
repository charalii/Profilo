"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ScraperInfo {
  id: string;
  name: string;
  base_url: string | null;
  method: string | null;
  implemented: boolean;
}

export default function DevToolsPage() {
  const [devOn, setDevOn] = useState<boolean | null>(null);
  const [scrapers, setScrapers] = useState<ScraperInfo[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [`${new Date().toISOString().slice(11, 19)} ${line}`, ...prev].slice(0, 40));
  }, []);

  useEffect(() => {
    fetch("/api/dev/status")
      .then((r) => setDevOn(r.ok))
      .catch(() => setDevOn(false));
  }, []);

  useEffect(() => {
    if (!devOn) return;
    fetch("/api/dev/scrapers")
      .then((r) => r.json())
      .then((d: { scrapers?: ScraperInfo[] }) => setScrapers(d.scrapers || []))
      .catch(() => setScrapers([]));
  }, [devOn]);

  async function devLogin(role: "candidate" | "recruiter") {
    setBusy(`login-${role}`);
    try {
      const data = await api.devToken(role);
      localStorage.setItem("token", data.access_token);
      pushLog(`Logged in as ${role} (token stored).`);
      window.dispatchEvent(new CustomEvent("profilo-auth"));
      window.location.reload();
    } catch (e) {
      pushLog(`Login failed: ${e instanceof Error ? e.message : "error"}`);
    } finally {
      setBusy(null);
    }
  }

  async function runScrape(id: string) {
    setBusy(`scrape-${id}`);
    try {
      const res = await api.runScrape(id);
      pushLog(`Scrape ${id}: ${res.listings_processed} listings upserted.`);
    } catch (e) {
      pushLog(
        `Scrape ${id} failed: ${e instanceof Error ? e.message : "error"}`
      );
    } finally {
      setBusy(null);
    }
  }

  if (devOn === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-white">Dev tools disabled</h1>
        <p className="mt-2 text-slate-400">
          Start the API with{" "}
          <code className="rounded bg-slate-800 px-1 text-cyan-300">
            HIRESCOPE_DEV=1
          </code>{" "}
          (see docker-compose or your shell).
        </p>
        <Link href="/" className="mt-6 inline-block text-cyan-400 hover:underline">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Development / API</h1>
      <p className="mt-2 text-slate-400">
        Demo login, manual scrapes, and links to live data. Requires{" "}
        <code className="text-cyan-300">HIRESCOPE_DEV=1</code> on the backend.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="font-semibold text-white">Skip login (demo JWT)</h2>
          <p className="mt-1 text-sm text-slate-500">
            Stores token in localStorage (same as real login).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => devLogin("candidate")}
              className="rounded-lg bg-[#1A56DB] px-3 py-2 text-sm text-white"
            >
              Candidate
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => devLogin("recruiter")}
              className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200"
            >
              Recruiter
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="font-semibold text-white">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm text-cyan-400">
            <li>
              <Link href="/jobs" className="hover:underline">
                /jobs — browse vacancies (DB)
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:underline">
                /dashboard — matches or recruiter stats
              </Link>
            </li>
            <li>
              <a
                href="/api/health"
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                GET /api/health
              </a>
            </li>
            <li>
              <a
                href="/api/vacancies?limit=5"
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                GET /api/vacancies?limit=5
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="font-semibold text-white">Vacancy scrapers</h2>
        <p className="mt-1 text-sm text-slate-500">
          Runs the same code as Celery task <code>scrape</code>. Needs network
          from the API process; Playwright sources may need extra setup.
        </p>
        <ul className="mt-4 space-y-2">
          {scrapers.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-700/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-medium text-slate-200">{s.name}</span>
                <span className="ml-2 text-xs text-slate-500">
                  {s.id}
                  {s.implemented ? "" : " (not wired)"}
                </span>
                {s.base_url && (
                  <p className="text-xs text-slate-600 truncate max-w-md">
                    {s.base_url}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={!s.implemented || busy !== null}
                onClick={() => runScrape(s.id)}
                className="shrink-0 rounded-md bg-emerald-800/80 px-3 py-1.5 text-xs text-white disabled:opacity-40"
              >
                {busy === `scrape-${s.id}` ? "Running…" : "Run scrape"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950/40 p-4">
        <h3 className="text-sm font-semibold text-slate-400">Log</h3>
        <pre className="mt-2 max-h-64 overflow-auto text-xs text-slate-300">
          {log.length ? log.join("\n") : "—"}
        </pre>
      </div>
    </div>
  );
}
