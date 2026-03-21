const features = [
  {
    icon: "🧠",
    title: "AI That Actually Understands EU Careers",
    desc: "Our matching engine knows the difference between an EPSO competition and a CAST selection. It weights language proficiency, domain expertise, and the specific competency frameworks EU institutions use — not generic ATS keywords.",
    pill: "5-dimension weighted scoring",
  },
  {
    icon: "🗂️",
    title: "Every Vacancy. One Dashboard.",
    desc: "Stop checking EPSO on Monday, NATO on Tuesday, and EuroBrussels on Wednesday. HireScope scrapes 15+ sources continuously and delivers every relevant opening ranked by how well it matches your profile.",
    pill: "Updated daily from source",
  },
  {
    icon: "✍️",
    title: "Cover Letters That Don't Sound Like Templates",
    desc: "HireScope generates cover letters that map your specific experience to each vacancy's requirements — using the right tone, the right structure, and the institutional language EU recruiters expect.",
    pill: "One click per vacancy",
  },
  {
    icon: "📊",
    title: "Know Exactly What's Missing From Your CV",
    desc: "For every match, you get a CV optimization report: what keywords to add, what experience to highlight, what to cut, and how to reframe your background for maximum impact.",
    pill: "Per-vacancy gap analysis",
  },
  {
    icon: "📋",
    title: "Track Everything Without the Spreadsheet",
    desc: "Replace the chaos of Google Sheets with a kanban board: Saved → Applied → Interview → Offer → Rejected. Drag, drop, track deadlines, add notes. Your entire pipeline in one view.",
    pill: "Kanban with deadline alerts",
  },
  {
    icon: "🔔",
    title: "Never Miss a Perfect Match",
    desc: "Every week, HireScope scans new vacancies against your profile and sends you a digest of roles scoring 80% or higher. Pro users get daily alerts with custom filters. Stop searching. Start receiving.",
    pill: "Smart profile-matched alerts",
  },
];

const stats = [
  { num: "15", suffix: "+", label: "Vacancy sources scraped daily" },
  { num: "5", suffix: "", label: "Matching dimensions scored per vacancy" },
  { num: "30", suffix: "s", label: "From CV upload to first matches" },
  { num: "2K", suffix: "+", label: "Vacancies tracked at any given time" },
];

const testimonials = [
  {
    quote:
      "I was spending 10+ hours a week just finding and reviewing vacancies across different portals. HireScope cut that to 15 minutes. The match scores are genuinely accurate — it flagged a NATO role I would have completely missed.",
    author: "Policy Advisor, Brussels",
    role: "Beta user",
  },
  {
    quote:
      "The cover letter generator understands how EU institutions think. It's not generic fluff — it actually maps my experience to the competency framework in the vacancy notice.",
    author: "Legal Officer",
    role: "Transitioning from private sector · Beta user",
  },
  {
    quote:
      "As a career coach specializing in EU careers, I've recommended HireScope to every single one of my clients. Nothing else comes close for this niche.",
    author: "EU Career Coach",
    role: "College of Europe alumni network · Beta user",
  },
];

const faqs = [
  {
    q: "How does HireScope find vacancies?",
    a: "We scrape 15+ official vacancy portals including EPSO, EEAS, EDA, NATO, NSPA, EuroBrussels, and major EU think tanks and agencies. Our scrapers run daily so you're always seeing the latest openings. We don't rely on job boards reposting listings — we go directly to the source.",
  },
  {
    q: "How accurate is the matching?",
    a: 'Our algorithm scores matches across 5 weighted dimensions: keyword overlap (25%), domain fit (25%), qualifications match (20%), experience alignment (15%), and language proficiency (15%). In beta testing, users rated 85% of top-10 matches as "relevant" or "highly relevant" to their career goals.',
  },
  {
    q: "Is my CV data safe?",
    a: "Absolutely. We're GDPR-compliant by design. Your CV is stored encrypted on EU-based servers (AWS EU-West), processed only for matching purposes, and never shared with third parties. You can delete your data entirely at any time with one click.",
  },
  {
    q: "What file format does my CV need to be?",
    a: "PDF. Upload any standard PDF CV and our parser handles the rest — extracting skills, qualifications, languages, work history, and domain expertise automatically.",
  },
  {
    q: "Can I use HireScope if I'm outside the EU?",
    a: "Yes. HireScope works for anyone applying to EU institutions and international organizations, regardless of where you're based. Many of the roles we track are open to non-EU nationals, and our matching engine accounts for nationality requirements where applicable.",
  },
  {
    q: "What's included in the free plan?",
    a: "Three match reports per week, access to our EPSO and EuroBrussels vacancy feeds, and a basic application tracker (10 slots). It's enough to see if HireScope works for you — and most users upgrade within the first week.",
  },
  {
    q: "How is this different from LinkedIn or Jobscan?",
    a: "LinkedIn's AI is built for mass-market corporate hiring — it doesn't understand EPSO, CAST, SNE postings, or EU competency frameworks. Jobscan optimizes your resume for ATS systems that EU institutions don't use. HireScope is the only platform that combines EU-specific vacancy aggregation with AI matching purpose-built for how these organizations actually hire.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. Cancel in one click from your dashboard and you'll keep access until the end of your billing period. Your data remains available for 30 days before automatic deletion — or delete it immediately if you prefer.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">🇪🇺 Built for EU &amp; International Careers</div>
        <h1>
          Stop Hunting.<br />
          <em>Start Matching.</em>
        </h1>
        <p>
          HireScope&apos;s AI reads your CV, scrapes 15+ EU and international vacancy
          portals in real time, and tells you exactly which roles want someone like
          you — with a match score, a tailored cover letter, and a plan to get hired.
        </p>
        <div className="hero-ctas">
          <a href="#signup" className="btn-primary">
            Upload Your CV — Get Your First Matches Free
          </a>
          <a href="#features" className="btn-secondary">
            See How It Works →
          </a>
        </div>
        <p className="hero-note">
          No credit card. No spam. Just the clearest picture of your EU career
          options you&apos;ve ever seen.
        </p>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <p>
          Aggregating vacancies from{" "}
          <span>
            EPSO · EEAS · NATO · NSPA · EDA · EuroBrussels · 40+ think tanks and
            EU agencies
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
            the way EU institutions actually hire.
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
          Your Next EU Career Move<br />
          Starts With One Upload.
        </h2>
        <p>
          Upload your CV. See your matches in 30 seconds. Get your first tailored
          cover letter. The roles you&apos;ve been searching for are already waiting —
          HireScope just connects the dots.
        </p>
        <a href="#" className="btn-primary">
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
