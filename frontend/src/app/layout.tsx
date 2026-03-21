import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireScope - AI-Powered Job Matching for EU Careers",
  description:
    "Match your CV against live EU, NATO, and international organization vacancies. Get AI-generated cover letters and CV optimization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <nav className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="text-xl font-bold text-primary-600">
              HireScope
            </a>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="/tracker" className="text-sm text-gray-600 hover:text-gray-900">
                Tracker
              </a>
              <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a
                href="/login"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Sign In
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
