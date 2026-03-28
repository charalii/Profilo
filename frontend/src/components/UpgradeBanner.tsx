"use client";

import { useRouter } from "next/navigation";

interface UpgradeBannerProps {
  weeklyUsed: number;
  limit: number;
}

/**
 * Shows a soft warning when the user is approaching or has hit the free tier limit.
 * Rendered inside the dashboard or match results page.
 */
export default function UpgradeBanner({ weeklyUsed, limit }: UpgradeBannerProps) {
  const router = useRouter();
  const isBlocked = weeklyUsed >= limit;
  const isWarning = weeklyUsed >= limit - 1 && !isBlocked;

  if (!isBlocked && !isWarning) return null;

  return (
    <div
      className={`mb-6 flex items-center justify-between rounded-lg px-4 py-3 text-sm ${
        isBlocked
          ? "border border-orange-200 bg-orange-50 text-orange-800"
          : "border border-yellow-200 bg-yellow-50 text-yellow-800"
      }`}
    >
      <span>
        {isBlocked
          ? `You've used all ${limit} free matches this week. Upgrade to Pro for unlimited matches.`
          : `You've used ${weeklyUsed} of ${limit} free matches this week.`}
      </span>
      <button
        onClick={() => router.push("/pricing")}
        className="ml-4 shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
      >
        Upgrade to Pro →
      </button>
    </div>
  );
}
