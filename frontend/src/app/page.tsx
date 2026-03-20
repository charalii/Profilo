import { CVUpload } from "@/components/CVUpload";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Land Your Dream{" "}
          <span className="text-primary-600">EU &amp; International</span> Career
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          HireScope scrapes live vacancies from 10+ EU and international
          organization portals, matches them against your CV, and generates
          tailor-made cover letters — so you only apply where you fit.
        </p>
        <div className="mt-10">
          <CVUpload />
        </div>
      </section>

      {/* Pain Points */}
      <section className="border-t py-16">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Stop Wasting Time on Wrong-Fit Applications
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Ghost Jobs & ATS Rejection",
              desc: "80% of applications never reach a human. We only show real, active vacancies with direct links.",
            },
            {
              title: "Generic CVs Don't Work",
              desc: "Our AI analyzes each vacancy and tells you exactly which keywords are missing from your CV.",
            },
            {
              title: "83-Day Average Time-to-Offer",
              desc: "Focus on high-match positions. Our scoring engine prioritizes vacancies where you have the best chance.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="border-t py-16">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          We Monitor 10+ Institutional Portals
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {[
            "EEAS", "EDA", "NATO", "NSPA", "EU Careers (EPSO)",
            "EuroBrussels", "Frontex", "EUISS", "EUSPA",
          ].map((source) => (
            <span
              key={source}
              className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
            >
              {source}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        &copy; 2026 HireScope. AI-Powered Job Matching for EU Careers.
      </footer>
    </div>
  );
}
