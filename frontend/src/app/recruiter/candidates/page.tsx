"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { CandidateSearchItem, User } from "@/lib/types";

export default function RecruiterCandidatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [q, setQ] = useState("");
  const [minYears, setMinYears] = useState<number | "">("");
  const [items, setItems] = useState<CandidateSearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((u) => {
        if (u.role !== "recruiter") {
          router.replace("/dashboard");
          return;
        }
        setUser(u);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      void search();
    }, 350);
    return () => clearTimeout(t);
  }, [q, minYears, user]);

  async function search() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.searchCandidates({
        q: q || undefined,
        min_years: minYears === "" ? undefined : Number(minYears),
      });
      setItems(res.items);
      setTotal(res.total);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="px-4 py-16 text-center text-slate-500">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Candidate search</h1>
      <p className="mt-2 text-slate-400">
        Search uploaded CV profiles ({total} matches).
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, email, or CV text"
          className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-white"
        />
        <input
          type="number"
          value={minYears}
          onChange={(e) =>
            setMinYears(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Min years"
          className="sm:w-40 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-white"
        />
      </div>

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Searching…</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((c) => (
            <li
              key={c.cv_profile_id}
              className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"
            >
              <p className="font-semibold text-white">{c.name || c.email}</p>
              <p className="text-sm text-slate-400">{c.email}</p>
              <p className="mt-2 text-xs text-slate-500">
                {c.years_experience} yrs exp · {c.education_level || "n/a"}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.keywords.slice(0, 12).map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-cyan-200"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length === 0 && (
        <p className="mt-10 text-center text-slate-500">No candidates found.</p>
      )}
    </div>
  );
}
