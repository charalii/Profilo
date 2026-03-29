import { OrgsSection } from "@/components/OrgsSection";

const features = [
  {
    icon: "🧠",
    title: "AI Built for International Organization Hiring",
    desc: "Our matching engine understands EPSO competitions, NATO grade structures, UN P-level requirements, and OECD competency frameworks — not generic ATS keywords. It scores your profile against the exact criteria each institution uses.",
    pill: "5-dimension weighted scoring",
  },
  {
    icon: "🗂️",
    title: "Every Vacancy from Every Portal. One Dashboard.",
    desc: "Stop checking EPSO on Monday, NATO Taleo on Tuesday, UN Careers on Wednesday. Profilo scrapes all five portals continuously and delivers every relevant opening ranked by how well it matches your profile.",
    pill: "Updated daily from source",
  },
  {
    icon: "✍️",
    title: "Cover Letters That Speak Each Institution's Language",
    desc: "Profilo generates cover letters that map your experience to each vacancy's competency requirements — using the right tone and institutional language, whether that's EU competency framework, UN core values, or NATO civilian standards.",
    pill: "One click per vacancy",
  },
  {
    icon: "📊",
    title: "Know Exactly What's Missing From Your CV",
    desc: "For every match, you receive a per-vacancy gap analysis: which keywords to add, what experience to highlight, what to cut, and how to reframe your background for the specific institution — and grade level — you're targeting.",
    pill: "Per-vacancy gap analysis",
  },
  {
    icon: "📋",
    title: "Track Every Application Without the Spreadsheet",
    desc: "Replace the chaos of Google Sheets with a structured kanban pipeline: Saved → Applied → Interview → Offer → Rejected. Set deadlines, add notes, and track your entire pipeline across EPSO competitions, NATO selections, and UN processes simultaneously.",
    pill: "Kanban with deadline alerts",
  },
  {
    icon: "🔔",
    title: "Never Miss a Role That Fits",
    desc: "Every week, Profilo scans new vacancies from EPSO, NATO Taleo, UN Careers, OECD and OSCE against your profile and sends you a ranked digest of roles scoring 80% or higher. Pro users get daily alerts with custom grade and domain filters.",
    pill: "Smart profile-matched alerts",
  },
];

const stats = [
  { num: "5", suffix: "", label: "Official portals scraped daily (EPSO, NATO, UN, OECD, OSCE)" },
  { num: "5", suffix: "", label: "Matching dimensions scored per vacancy" },
  { num: "30", suffix: "s", label: "From CV upload to first ranked matches" },
  { num: "1K", suffix: "+", label: "Active vacancies tracked at any given time" },
];

const testimonials = [
  {
    quote:
      "I was spending 10+ hours a week checking EPSO, NATO Taleo, and UN Careers separately. Profilo cut that to 15 minutes. The match scores are genuinely accurate — it flagged a NATO A3 role I would have completely missed.",
    author: "Policy Advisor, Brussels",
    role: "Beta user",
  },
  {
    quote:
      "The cover letter generator understands how EU institutions think. It's not generic fluff — it actually maps my experience to the competency framework in the vacancy notice and uses the right EPSO language.",
    author: "Legal Officer",
    role: "Transitioning from private sector · Beta user",
  },
  {
    quote:
      "As a career coach specialising in EU and international organisation careers, I've recommended Profilo to every single one of my clients. Nothing else comes close for this niche.",
    author: "EU Career Coach",
    role: "College of Europe alumni network · Beta user",
  },
];

const faqs = [
  {
    q: "Which portals does Profilo scrape?",
    a: "Profilo pulls live vacancies from the five major international employer portals: EPSO (EU institutions), NATO Taleo (NATO civilian), UN Careers (UN Secretariat and agencies), OECD Careers, and OSCE Jobs. Our scrapers run daily — you're always seeing current openings, not stale reposts.",
  },
  {
    q: "How accurate is the matching for EPSO and NATO roles?",
    a: "Our algorithm scores matches across 5 weighted dimensions: keyword overlap (25%), domain fit (25%), qualifications match (20%), experience alignment (15%), and language proficiency (15%). We specifically account for EPSO competition types (Open, CAST, SNE), NATO civilian grade structures, and UN P-level requirements. In beta testing, users rated 85% of top-10 matches as \"relevant\" or \"highly relevant\".",
  },
  {
    q: "Can it handle EPSO-specific competitions (CAST, SNE, Open Competitions)?",
    a: "Yes. Profilo distinguishes between EPSO Open Competitions, CAST permanent/temporary selections, and SNE (Seconded National Expert) postings — and adjusts matching and cover letter generation accordingly. Each type has different requirements and our AI is trained on all of them.",
  },
  {
    q: "Does it cover EU agencies (EMA, EBA, Europol, etc.) as well?",
    a: "Yes. Beyond the core EU institutions (Commission, Parliament, Council, Court), Profilo tracks vacancies from 40+ EU agencies and bodies that publish through EPSO or their own portals. Agency roles are clearly labelled and matched separately from interinstitutional competitions.",
  },
  {
    q: "Is my CV data safe and GDPR-compliant?",
    a: "Absolutely. We're GDPR-compliant by design: your CV is stored encrypted on EU-based servers (AWS EU-West), processed only for matching purposes, and never shared with third parties. You can delete your data entirely at any time with one click.",
  },
  {
    q: "Can I use Profilo if I'm not an EU citizen?",
    a: "Yes. Many roles at NATO, the UN, OECD, and OSCE are open to non-EU nationals. Even some EU positions (particularly at agencies) accept third-country nationals. Profilo's matching engine accounts for nationality eligibility requirements where specified in the vacancy notice.",
  },
  {
    q: "How is this different from LinkedIn or generic job boards?",
    a: "LinkedIn's AI is built for corporate hiring — it doesn't understand EPSO, CAST, NATO civilian grades, or UN P-levels. Generic job boards repost listings days late and without the institutional context. Profilo is the only platform that combines real-time scraping of the actual source portals with AI matching purpose-built for how these five organisations actually hire.",
  },
  {
    q: "What's included in the free plan?",
    a: "Three match reports per week, access to all five vacancy feeds (EPSO, NATO, UN, OECD, OSCE), and a basic application tracker (10 slots). It's enough to see if Profilo works for you — most users upgrade within the first week.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. Cancel in one click from your dashboard and you'll keep access until the end of your billing period. Your data remains available for 30 days before automatic deletion — or delete it immediately if you prefer.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://profilo.eu/#website",
      url: "https://profilo.eu",
      name: "Profilo",
      description:
        "AI job matching for EU, NATO, UN, OECD and OSCE careers",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://profilo.eu/jobs?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://profilo.eu/#app",
      name: "Profilo",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://profilo.eu",
      description:
        "Match your CV against live vacancies from EPSO, NATO Taleo, UN Careers, OECD and OSCE. AI-powered matching, tailored cover letters, and application tracking for international organisation careers.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Free plan available",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">🌍 EPSO · NATO · UN · OECD · OSCE</div>
        <h1>
          Stop Hunting.<br />
          <em>Start Matching.</em>
        </h1>
        <p>
          Profilo reads your CV, scrapes EPSO, NATO Taleo, UN Careers, OECD and
          OSCE in real time, and tells you exactly which roles want someone like
          you — with a match score, a tailored cover letter, and a plan to get hired.
        </p>
        <div className="hero-ctas">
          <a href="/signup" className="btn-primary">
            Upload Your CV — Get Your First Matches Free
          </a>
          <a href="#features" className="btn-secondary">
            See How It Works →
          </a>
        </div>
        <p className="hero-note">
          No credit card. No spam. Just the clearest picture of your international
          career options you've ever seen.
        </p>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <p>
          Live vacancies sourced directly from{" "}
          <span>
            EPSO · NATO Taleo · UN Careers · OECD Careers · OSCE Jobs
          </span>
        </p>
      </div>

      {/* FEATURES */}
      <section className="landing-section features" id="features">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="section-label">Features</span>
          <h2 className="section-title">
            Everything you need.<br />
            Nothing you don&apos;t.
          </h2>
          <p className="section-sub">
            One platform to find, match, apply, and track — built specifically for
            the way international organisations actually hire.
          </p>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-pill">{f.pill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="landing-section stats">
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label" style={{ color: "var(--accent)" }}>
            By the numbers
          </span>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            Built on real intelligence,<br />
            not keyword soup.
          </h2>
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">
                  {s.num}
                  {s.suffix && <span>{s.suffix}</span>}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANISATIONS */}
      <OrgsSection />

      {/* TESTIMONIALS */}
      <section className="landing-section social-proof" id="testimonials">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">
            Built for the people who actually apply to these jobs.
          </h2>
          <div className="testimonials">
            {testimonials.map((t) => (
              <div key={t.author} className="testimonial">
                <p>{t.quote}</p>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section faq" id="faq">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Frequently asked questions.</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta" id="signup">
        <h2>
          Your Next International Career Move<br />
          Starts With One Upload.
        </h2>
        <p>
          Upload your CV. See your matches in 30 seconds. Get your first tailored
          cover letter. The roles at EPSO, NATO, UN, OECD and OSCE that fit your
          profile — Profilo connects the dots.
        </p>
        <a href="/signup" className="btn-primary">
          Get Started Free — Upload Your CV
        </a>
        <p className="final-cta-note">
          Free plan includes 3 matches per week · No credit card required · GDPR
          compliant · Cancel anytime
        </p>
      </section>
    </>
  );
}
