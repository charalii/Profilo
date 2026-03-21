"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CVUpload } from "@/components/CVUpload";
import { api } from "@/lib/api";
import type { CVProfile, User } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CVProfile | null>(null);
  const [error, setError] = useState("");
  const [kwInput, setKwInput] = useState("");

  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u);
        if (u.role === "recruiter") {
          setError("Candidate profile & CV parsing are for candidate accounts.");
          return;
        }
        return api
          .getProfile()
          .then(setProfile)
          .catch(() => setProfile(null));
      })
      .catch(() => router.push("/login"));
  }, [router]);

  async function onUploaded() {
    const p = await api.getProfile();
    setProfile(p);
  }

  async function addKeyword() {
    if (!profile || !kwInput.trim()) return;
    const next = Array.from(
      new Set([...profile.keywords, kwInput.trim().toLowerCase()])
    );
    const updated = await api.updateProfile({ keywords: next });
    setProfile(updated);
    setKwInput("");
  }

  if (user?.role === "recruiter") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">{error}</p>
        <Link href="/dashboard" className="mt-6 inline-block text-cyan-400 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Your profile</h1>
      <p className="mt-2 text-slate-400">
        Upload a PDF CV for AI parsing, keyword extraction, and matching.
      </p>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Resume</h2>
        <div className="mt-4">
          <CVUpload onUploaded={onUploaded} />
        </div>
      </div>

      {profile && (
        <>
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">Parsed signals</h2>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Experience (years)</dt>
                <dd className="text-slate-200">{profile.years_experience}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Education</dt>
                <dd className="text-slate-200">{profile.education_level}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Languages (count)</dt>
                <dd className="text-slate-200">{profile.language_count}</dd>
              </div>
              <div>
                <dt className="text-slate-500">File</dt>
                <dd className="text-slate-200">{profile.file_name || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">Skills & keywords</h2>
            <p className="mt-1 text-sm text-slate-500">
              Used for matching. Add custom terms to improve scores.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-200"
                >
                  {k}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                placeholder="Add keyword"
                className="flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
