"use client";
import Link from "next/link";

interface Props {
  weeklyUsed: number;
  limit: number | null;
}

export default function UpgradeBanner({ weeklyUsed, limit }: Props) {
  if (!limit) return null; // unlimited plan

  const pct = Math.min((weeklyUsed / limit) * 100, 100);
  const reached = weeklyUsed >= limit;
  const nearLimit = weeklyUsed >= limit * 0.8;

  if (!nearLimit) return null;

  return (
    <div
      className={`rounded-lg border px-4 py-3 mb-4 flex items-center justify-between gap-4 text-sm ${
        reached
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-amber-50 border-amber-200 text-amber-800"
      }`}
    >
      <div>
        {reached ? (
          <>
            <strong>Weekly limit reached</strong> — you've used {weeklyUsed}/{limit} matches this week.
          </>
        ) : (
          <>
            <strong>{limit - weeklyUsed} match{limit - weeklyUsed !== 1 ? "es" : ""} left</strong> this week ({weeklyUsed}/{limit} used).
          </>
        )}
      </div>
      <Link
        href="/pricing"
        className="shrink-0 rounded-md bg-[#1E3A8A] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#142966] transition-colors"
      >
        Upgrade to Pro →
      </Link>
    </div>
  );
}
