"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function createCheckoutSession(plan: "pro" | "team"): Promise<string> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("not_authenticated");

  const res = await fetch(`${API_URL}/api/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });

  if (res.status === 401) throw new Error("not_authenticated");
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "checkout_failed");
  }

  const data = await res.json();
  return data.checkout_url;
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "€0",
      period: "forever",
      features: [
        "3 job matches per week",
        "Basic CV analysis",
        "View active vacancies",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "€19",
      period: "/month",
      features: [
        "Unlimited job matches",
        "AI cover letter generation",
        "CV optimization per vacancy",
        "Missing keyword detection",
        "Email alerts (daily/weekly)",
        "Application tracker",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      id: "team",
      name: "Team",
      price: "€49",
      period: "/month",
      features: [
        "Everything in Pro",
        "Multi-user access (up to 5)",
        "Shared dashboard",
        "Team application tracker",
        "Priority support",
      ],
      cta: "Upgrade to Team",
      highlighted: false,
    },
  ];

  const handleCTA = async (planId: string) => {
    if (planId === "free") {
      router.push("/signup");
      return;
    }

    setError(null);
    setLoading(planId);

    try {
      const url = await createCheckoutSession(planId as "pro" | "team");
      window.location.href = url; // redirect to Stripe Checkout
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown_error";
      if (message === "not_authenticated") {
        router.push(`/login?redirect=/pricing`);
      } else {
        setError("Could not start checkout. Please try again or contact support.");
      }
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold text-gray-900">
        Plans &amp; Pricing
      </h1>
      <p className="mt-4 text-center text-gray-600">
        Choose the plan that fits your EU career search needs.
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border-2 p-8 ${
              plan.highlighted
                ? "border-blue-600 shadow-lg"
                : "border-gray-200"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-500">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-0.5 text-green-500">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCTA(plan.id)}
              disabled={loading === plan.id}
              className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                plan.highlighted
                  ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              }`}
            >
              {loading === plan.id ? "Redirecting…" : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        Payments processed securely by Stripe. Cancel anytime from your account settings.
      </p>
    </div>
  );
}
