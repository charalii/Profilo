"use client";

import { useEffect, useState } from "react";

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

export function MarketingNav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a href="/" className="nav-logo" aria-label="Profilo home">
        Profilo<span>.</span>
      </a>
      <ul className="nav-links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#organizations">Organisations</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#guarantee">Guarantee</a></li>
        <li><ThemeToggle /></li>
        <li><a href="/signup" className="nav-cta">Start free →</a></li>
      </ul>
    </nav>
  );
}
