import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free, Pro & Team Plans",
  description:
    "Start free and upgrade when you're ready. Profilo's Pro plan gives you unlimited AI matches, cover letters, and daily alerts for EPSO, NATO, UN, OECD and OSCE vacancies.",
  alternates: {
    canonical: "https://profilo.eu/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
