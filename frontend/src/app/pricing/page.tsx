export default function PricingPage() {
  const plans = [
    {
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
      cta: "Start Pro Trial",
      highlighted: true,
    },
    {
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
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold text-gray-900">
        Plans &amp; Pricing
      </h1>
      <p className="mt-4 text-center text-gray-600">
        Choose the plan that fits your EU career search needs.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border-2 p-8 ${
              plan.highlighted
                ? "border-primary-600 shadow-lg"
                : "border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-500">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-green-500">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium ${
                plan.highlighted
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
