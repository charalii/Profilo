"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored !== "light";
    setIsDark(dark);
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", next);
    if (next === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "0 0.25rem" }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setUser(null);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null));
  }, [pathname]);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  }

  const candidateLinks = (
    <>
      <Link
        href="/dashboard"
        className={pathname === "/dashboard" ? "nav-app-active" : ""}
      >
        Dashboard
      </Link>
      <Link
        href="/jobs"
        className={pathname === "/jobs" ? "nav-app-active" : ""}
      >
        Jobs
      </Link>
      <Link
        href="/tracker"
        className={pathname === "/tracker" ? "nav-app-active" : ""}
      >
        Tracker
      </Link>
      <Link
        href="/profile"
        className={pathname === "/profile" ? "nav-app-active" : ""}
      >
        Profile
      </Link>
      <Link
        href="/writer"
        className={pathname === "/writer" ? "nav-app-active" : ""}
      >
        Writer
      </Link>
      <Link
        href="/settings"
        className={pathname === "/settings" ? "nav-app-active" : ""}
      >
        Settings
      </Link>
    </>
  );

  const recruiterLinks = (
    <>
      <Link
        href="/dashboard"
        className={pathname === "/dashboard" ? "nav-app-active" : ""}
      >
        Home
      </Link>
      <Link
        href="/recruiter/jobs"
        className={pathname.startsWith("/recruiter/jobs") ? "nav-app-active" : ""}
      >
        My jobs
      </Link>
      <Link
        href="/recruiter/applications"
        className={
          pathname.startsWith("/recruiter/applications") ? "nav-app-active" : ""
        }
      >
        Inbox
      </Link>
      <Link
        href="/recruiter/analytics"
        className={
          pathname.startsWith("/recruiter/analytics") ? "nav-app-active" : ""
        }
      >
        Analytics
      </Link>
      <Link
        href="/recruiter/candidates"
        className={
          pathname.startsWith("/recruiter/candidates") ? "nav-app-active" : ""
        }
      >
        Candidates
      </Link>
    </>
  );

  return (
    <nav className="site-nav">
      <Link href="/dashboard" className="nav-logo">
        Profilo<span>.</span>
      </Link>
      <ul className="nav-app-links">
        {process.env.NEXT_PUBLIC_HIRESCOPE_DEV === "1" && (
          <li>
            <Link href="/dev" className="text-amber-400/90">
              Dev
            </Link>
          </li>
        )}
        {user?.role === "recruiter" ? recruiterLinks : candidateLinks}
      </ul>
      <div className="nav-app-actions">
        <ThemeToggle />
        {user ? (
          <>
            <span className="nav-user-email" title={user.email}>
              {user.name || user.email}
            </span>
            <button type="button" onClick={logout} className="nav-app-logout">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-app-login">
              Sign in
            </Link>
            <Link href="/signup" className="nav-cta">
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
