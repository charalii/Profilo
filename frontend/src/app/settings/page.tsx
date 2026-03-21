"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AlertPreference, User } from "@/lib/types";
import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [alerts, setAlerts] = useState<AlertPreference | null>(null);
  const [frequency, setFrequency] = useState("weekly");
  const [minScore, setMinScore] = useState(60);
  const [alertsActive, setAlertsActive] = useState(true);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    api.me().then((u) => {
      setUser(u);
      setName(u.name || "");
      setEmail(u.email);
    });
    api.getAlertPreferences().then((a) => {
      if (a) {
        setAlerts(a);
        setFrequency(a.frequency);
        setMinScore(a.min_match_score);
        setAlertsActive(a.is_active);
      }
    });
  }, []);

  async function saveProfile() {
    setSaving(true);
    setProfileMsg("");
    try {
      const updated = await api.updateUser({ name, email });
      setUser(updated);
      setProfileMsg("Profile updated");
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveAlerts() {
    setAlertMsg("");
    try {
      const updated = await api.updateAlertPreferences({
        frequency,
        min_match_score: minScore,
        is_active: alertsActive,
      });
      setAlerts(updated);
      setAlertMsg("Alert preferences saved");
    } catch (err) {
      setAlertMsg(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        <div className="mt-8 space-y-8">
          {/* Profile */}
          <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage your account details.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-600"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                {profileMsg && (
                  <span className="text-sm text-slate-400">{profileMsg}</span>
                )}
              </div>
            </div>
          </section>

          {/* Email Alerts */}
          <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Email Alerts</h2>
            <p className="mt-1 text-sm text-slate-400">
              Configure when and how you receive match alerts.
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={alertsActive}
                  onChange={(e) => setAlertsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600"
                />
                <label className="text-sm text-slate-300">
                  Enable email alerts
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Minimum Match Score
                </label>
                <input
                  type="number"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  min={0}
                  max={99}
                  className="mt-1 w-32 rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={saveAlerts}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Alerts
                </button>
                {alertMsg && (
                  <span className="text-sm text-slate-400">{alertMsg}</span>
                )}
              </div>
            </div>
          </section>

          {/* Subscription */}
          <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Subscription</h2>
            <p className="mt-1 text-sm text-slate-400">
              You are on the{" "}
              <strong className="text-white">
                {user?.plan === "free" ? "Free" : user?.plan || "Free"}
              </strong>{" "}
              plan.
            </p>
            <a
              href="/pricing"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Upgrade Plan
            </a>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
