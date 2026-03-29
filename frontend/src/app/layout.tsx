import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const APP_URL = "https://profilo.eu";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Profilo — AI Job Matching for EU, NATO, UN, OECD & OSCE Careers",
    template: "%s | Profilo",
  },
  description:
    "Match your CV against live vacancies from EPSO, NATO Taleo, UN Careers, OECD and OSCE. AI-powered matching, tailored cover letters, and application tracking — built specifically for international organisation careers.",
  keywords: [
    "EU jobs","EPSO competition","EPSO jobs","EPSO 2025","NATO careers","NATO civilian jobs",
    "UN careers","UN jobs","United Nations jobs","OECD careers","OSCE jobs",
    "international organisation careers","EU institutions jobs","European Commission jobs",
    "Brussels jobs","international civil servant","CAST permanent","AD grade EU","EU vacancy",
    "EU career","international job matching","EU CV matching","cover letter EU institutions",
  ],
  authors: [{ name: "Profilo", url: APP_URL }],
  creator: "Profilo",
  publisher: "Profilo",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "Profilo — AI Job Matching for EU, NATO, UN, OECD & OSCE Careers",
    description: "Match your CV against live vacancies from EPSO, NATO Taleo, UN Careers, OECD and OSCE.",
    siteName: "Profilo",
    locale: "en_GB",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Profilo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profilo — AI Matching for International Organisation Careers",
    description: "Live vacancies from EPSO, NATO, UN, OECD, OSCE. AI matching, cover letters, tracking.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: APP_URL },
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#141210" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
