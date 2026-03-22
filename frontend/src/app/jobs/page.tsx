"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User, Vacancy } from "@/lib/types";

export default function JobsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [items, setItems] = useState<Vacancy[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(t);
  }, [q, location]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.listVacancies({
        page: 1,
        limit: 40,
        q: q || undefined,
        location: location || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function quickApply(v: Vacancy) {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "recruiter") {
      alert("Switch to a candidate account to apply.");
      return;
    }
    try {
      await api.createApplication(v.id, "applied");
      router.push("/tracker");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not apply");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Browse jobs</h1>
      <p className="mt-2 text-slate-400">
        Search scraped EU & international postings and internal roles ({total}{" "}
        results).
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, organization, description…"
          className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="sm:w-56 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </div>

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading…</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((v) => (
            <li
              key={v.id}
              className="rounded-xl border border-slate-700 bg-slate-900/50 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{v.title}</h2>
                  <p className="text-sm text-slate-400">{v.organization}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    {v.location && <span>{v.location}</span>}
                    {v.contract_type && <span>{v.contract_type}</span>}
                    <span className="uppercase text-cyan-500/90">{v.source}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/jobs/${v.id}`}
                    className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500"
                  >
                    Details
                  </Link>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500"
                  >
                    Original
                  </a>
                  <button
                    type="button"
                    onClick={() => quickApply(v)}
                    className="rounded-lg bg-[#1A56DB] px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    Apply / track
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length === 0 && (
        <p className="mt-10 text-center text-slate-500">No vacancies match.</p>
      )}

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link href="/dashboard" className="text-cyan-400 hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
