import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Free Account",
  description:
    "Sign up to Profilo for free. Upload your CV and get AI-matched to live vacancies from EPSO, NATO Taleo, UN Careers, OECD and OSCE — in 30 seconds.",
  alternates: {
    canonical: "https://profilo.eu/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
