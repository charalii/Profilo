"use client";

import { useEffect, useRef } from "react";

/**
 * When NEXT_PUBLIC_HIRESCOPE_DEV=1, requests a demo JWT once (no login form).
 * Set NEXT_PUBLIC_DEV_ROLE=recruiter to default as recruiter.
 */
export function DevAutoLogin() {
  const ran = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NEXT_PUBLIC_HIRESCOPE_DEV !== "1") return;
    if (ran.current) return;
    if (localStorage.getItem("token")) return;

    ran.current = true;
    const role = (process.env.NEXT_PUBLIC_DEV_ROLE || "candidate") as
      | "candidate"
      | "recruiter";

    fetch("/api/dev/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
      .then((r) => {
        if (!r.ok) return null;
        return r.json() as Promise<{ access_token?: string }>;
      })
      .then((data) => {
        if (data?.access_token) {
          localStorage.setItem("token", data.access_token);
          window.dispatchEvent(new CustomEvent("profilo-auth"));
          window.location.reload();
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
