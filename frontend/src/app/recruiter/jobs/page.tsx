"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User, Vacancy } from "@/lib/types";

export default function RecruiterJobsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Vacancy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contractType, setContractType] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .me()
      .then((u) => {
        if (u.role !== "recruiter") {
          router.replace("/dashboard");
          return;
        }
        setUser(u);
        return load();
      })
      .catch(() => router.push("/login"));
  }, [router]);

  async function load() {
    const res = await api.listVacancies({ mine: true, limit: 100 });
    setItems(res.items);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const kw = keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
      await api.createVacancy({
        title,
        organization,
        location: location || null,
        description: description || null,
        contract_type: contractType || null,
        keywords: kw.length ? kw : undefined,
      });
      setTitle("");
      setOrganization("");
      setLocation("");
      setDescription("");
      setContractType("");
      setKeywords("");
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create job");
    }
  }

  async function remove(id: string) {
    if (!confirm("Deactivate this job posting?")) return;
    await api.deleteVacancy(id);
    await load();
  }

  if (!user) {
    return (
      <div className="px-4 py-16 text-center text-slate-500">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your job postings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Internal listings are matched like scraped vacancies.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white"
        >
          {showForm ? "Close form" : "New job"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-xl border border-slate-700 bg-slate-900/50 p-6"
        >
          {error && (
            <p className="text-sm text-rose-400">{error}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-slate-400">Title</span>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-400">Organization</span>
              <input
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-400">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-400">Contract type</span>
              <input
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-slate-400">Keywords (comma-separated, for AI matching)</span>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="policy, legal, epso, …"
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Publish job
          </button>
        </form>
      )}

      <ul className="mt-10 space-y-3">
        {items.map((v) => (
          <li
            key={v.id}
            className="flex flex-col justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/40 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-semibold text-white">{v.title}</p>
              <p className="text-sm text-slate-400">{v.organization}</p>
              <p className="mt-1 text-xs uppercase text-cyan-500/80">{v.source}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(v.id)}
              className="self-start rounded-lg border border-rose-800 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-950/40"
            >
              Deactivate
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 && !showForm && (
        <p className="mt-10 text-center text-slate-500">No internal jobs yet.</p>
      )}
    </div>
  );
}
