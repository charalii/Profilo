import { OrgsSection } from "@/components/OrgsSection";

const faqs = [
  {
    q: "Which portals does Profilo monitor?",
    a: "Profilo pulls live vacancies from the five major international employer portals: EPSO (EU institutions), NATO Taleo (NATO civilian), UN Careers (UN Secretariat and agencies), OECD Careers, and OSCE Jobs. Our scrapers run daily — you are always seeing current openings, not stale reposts.",
  },
  {
    q: "How accurate is the matching for EPSO and NATO roles?",
    a: "Our algorithm scores matches across 5 weighted dimensions: keyword overlap (25%), domain fit (25%), qualifications match (20%), experience alignment (15%), and language proficiency (15%). We specifically account for EPSO competition types (Open, CAST, SNE), NATO civilian grade structures, and UN P-level requirements.",
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
    a: "Absolutely. We are GDPR-compliant by design: your CV is stored encrypted on EU-based servers (AWS EU-West), processed only for matching purposes, and never shared with third parties. You can delete your data entirely at any time with one click.",
  },
  {
    q: "Can I use Profilo if I am not an EU citizen?",
    a: "Yes. Many roles at NATO, the UN, OECD, and OSCE are open to non-EU nationals. Even some EU positions (particularly at agencies) accept third-country nationals. Profilo's matching engine accounts for nationality eligibility requirements where specified in the vacancy notice.",
  },
  {
    q: "How is this different from LinkedIn or generic job boards?",
    a: "LinkedIn's AI is built for corporate hiring — it does not understand EPSO, CAST, NATO civilian grades, or UN P-levels. Generic job boards repost listings days late and without institutional context. Profilo is the only platform that combines real-time scraping of the actual source portals with AI matching purpose-built for how these five organisations actually hire.",
  },
  {
    q: "What is included in the free trial?",
    a: "All plans include a 7-day free trial with full access. No charge until day 8. Cancel any time before that and you pay nothing.",
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
      description: "AI job matching for EU, NATO, UN, OECD and OSCE careers",
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
        description: "7-day free trial available",
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

      {/* ── HERO ── */}
      <section className="hero">
        <div className="lp-container-xs">
          <span className="hero-eyebrow">EU · NATO · UN · OECD · OSCE</span>
          <h1>
            Your CV, finally<br /><em>speaking their</em><br />language.
          </h1>
          <p className="hero-sub">
            EPSO, NATO, UN — every institution speaks a different legal dialect.
            Profilo translates your experience into exactly what each evaluator
            is looking for.
          </p>
          <div className="hero-actions">
            <a className="btn-dark" href="/signup">Start for free →</a>
            <a className="btn-outline" href="#how">See how it works</a>
          </div>
          <p className="hero-note">No credit card · Cancel anytime · GDPR compliant</p>
        </div>
      </section>

      {/* ── PROOF BAR ── */}
      <div className="proof-bar">
        <div className="proof-bar-inner">
          <div className="proof-item">
            <div className="proof-num">170K</div>
            <div className="proof-lbl">candidates compete for each AD5 call</div>
          </div>
          <div className="proof-div" />
          <div className="proof-item">
            <div className="proof-num">&lt;3%</div>
            <div className="proof-lbl">pass the first screening</div>
          </div>
          <div className="proof-div" />
          <div className="proof-item">
            <div className="proof-num">15h</div>
            <div className="proof-lbl">saved per week on manual research</div>
          </div>
          <div className="proof-div" />
          <div className="proof-item">
            <div className="proof-num">5</div>
            <div className="proof-lbl">official portals monitored automatically</div>
          </div>
        </div>
      </div>

      {/* ── PROBLEM ── */}
      <section className="section-problem" id="problem">
        <div className="lp-container-sm">
          <span className="lp-overline">The problem</span>
          <h2 className="lp-h">
            You are not rejected<br />because you are <em>unqualified</em>.
          </h2>
          <p className="lp-body">
            EU institutions do not hire on talent or potential. They hire on
            regulatory compliance — a precise, legalistic matching between your
            formal profile and the vacancy notice&apos;s requirements. Most excellent
            candidates fail at the first filter. Not because they lack the skills.
            Because their CV never spoke the language.
          </p>
        </div>

        <div className="lp-container" style={{ marginTop: 64 }}>
          <div className="problem-grid">
            <div className="problem-cell">
              <div className="problem-cell-num">01</div>
              <div className="problem-cell-title">Zero visibility across sources</div>
              <div className="problem-cell-text">
                EPSO, NATO Taleo, UN Careers, OECD, OSCE — each has its own portal,
                its own cadence, its own notice format. Staying on top of all of them
                manually takes hours every week.
              </div>
            </div>
            <div className="problem-cell">
              <div className="problem-cell-num">02</div>
              <div className="problem-cell-title">Eligibility buried in legalese</div>
              <div className="problem-cell-text">
                Each notice contains formal requirements written in institutional
                language. Reading and cross-referencing them against your own profile
                is a specialist skill most candidates lack.
              </div>
            </div>
            <div className="problem-cell">
              <div className="problem-cell-num">03</div>
              <div className="problem-cell-title">Generic CVs fail the first filter</div>
              <div className="problem-cell-text">
                LinkedIn-style CVs are written to impress humans. EU evaluators are
                not reading for impression — they are checking for compliance. The
                language must match the notice, word for word.
              </div>
            </div>
            <div className="problem-cell">
              <div className="problem-cell-num">04</div>
              <div className="problem-cell-title">No feedback, no iteration</div>
              <div className="problem-cell-text">
                When you fail the screening, institutions tell you nothing. Without
                knowing which keywords were missing, which criteria were unmet, there
                is no way to improve for the next round.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PULLQUOTE ── */}
      <section className="section-quote">
        <div className="lp-container-sm">
          <p className="quote-text">
            The most common reason for rejection at EPSO screening is not insufficient
            experience — it is insufficient alignment between the candidate&apos;s language
            and the notice&apos;s formal criteria.
          </p>
          <p className="quote-attr">— Experienced EPSO Selection Board Member</p>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="section-solution" id="how">
        <div className="lp-container">
          <div className="solution-lead">
            <div>
              <span className="lp-overline">How Profilo works</span>
              <h2 className="lp-h">
                Intelligence that works<br />while you sleep.
              </h2>
              <p className="lp-body" style={{ marginTop: 16 }}>
                Profilo is not a job board. It is a compliance engine. It reads
                vacancy notices the way an institutional lawyer would — then maps
                your experience to what the evaluator is specifically checking for.
              </p>
            </div>
            <div className="solution-steps">
              <div className="solution-step">
                <div className="step-num">01</div>
                <div>
                  <div className="step-title">Upload your CV once</div>
                  <div className="step-text">
                    Profilo parses your profile — experience, education, languages,
                    domain expertise — and builds a structural representation of
                    your eligibility.
                  </div>
                </div>
              </div>
              <div className="solution-step">
                <div className="step-num">02</div>
                <div>
                  <div className="step-title">We monitor 5 portals daily</div>
                  <div className="step-text">
                    EPSO, NATO Taleo, UN Careers, OECD Careers, OSCE Jobs — every
                    new notice is parsed and scored against your profile automatically.
                  </div>
                </div>
              </div>
              <div className="solution-step">
                <div className="step-num">03</div>
                <div>
                  <div className="step-title">See exactly where you stand</div>
                  <div className="step-text">
                    Each match shows your compliance score, matched keywords, and —
                    critically — the precise gaps you need to address before applying.
                  </div>
                </div>
              </div>
              <div className="solution-step">
                <div className="step-num">04</div>
                <div>
                  <div className="step-title">Apply with documents that convert</div>
                  <div className="step-text">
                    Your writing partner generates cover letters in the exact
                    institutional register the evaluator expects — not generic,
                    not AI-sounding. Mapped to the notice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE TABLE ── */}
      <section className="section-value">
        <div className="lp-container">
          <span className="lp-overline">What you&apos;re getting</span>
          <h2 className="lp-h">
            Everything you would<br />otherwise <em>pay for separately</em>.
          </h2>
          <p className="lp-body" style={{ marginTop: 12, maxWidth: 560 }}>
            A specialist EU career consultant charges €150–300/hour for exactly
            these services. Profilo delivers them automatically, at every application.
          </p>

          <div className="value-table">
            <div className="value-row value-row-head">
              <div>What you get</div>
              <div style={{ textAlign: "right" }}>Market rate</div>
              <div style={{ textAlign: "right" }}>Yours</div>
            </div>
            <div className="value-row">
              <div>
                <div className="value-name">EU/NATO vacancy aggregation</div>
                <div className="value-desc">5 portals, monitored daily, in one place</div>
              </div>
              <div className="value-market">€0 (your time)</div>
              <div className="value-yours">Included</div>
            </div>
            <div className="value-row">
              <div>
                <div className="value-name">Compliance scoring engine</div>
                <div className="value-desc">5-dimension match against formal eligibility criteria</div>
              </div>
              <div className="value-market">€150/hr consultant</div>
              <div className="value-yours">Included</div>
            </div>
            <div className="value-row">
              <div>
                <div className="value-name">Keyword gap analysis</div>
                <div className="value-desc">Exactly what&apos;s missing, for each specific notice</div>
              </div>
              <div className="value-market">€75 per application</div>
              <div className="value-yours">Included</div>
            </div>
            <div className="value-row">
              <div>
                <div className="value-name">Institutional-language cover letters</div>
                <div className="value-desc">Written in the register each evaluator expects</div>
              </div>
              <div className="value-market">€200 per letter</div>
              <div className="value-yours">Unlimited</div>
            </div>
            <div className="value-row">
              <div>
                <div className="value-name">CV tailoring per vacancy</div>
                <div className="value-desc">Specific reframing for each notice&apos;s language</div>
              </div>
              <div className="value-market">€120 per CV</div>
              <div className="value-yours">Unlimited</div>
            </div>
            <div className="value-row">
              <div>
                <div className="value-name">Application tracker</div>
                <div className="value-desc">Every stage, every deadline, in one view</div>
              </div>
              <div className="value-market">DIY spreadsheet</div>
              <div className="value-yours">Included</div>
            </div>
            <div className="value-total-row">
              <div>
                <div className="value-total-lbl">Total value if purchased separately</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 4 }}>
                  Conservative estimate, per active job search
                </div>
              </div>
              <div>
                <div className="value-total-price">€1,200+</div>
                <div className="value-total-you">You pay €19/month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORGANISATIONS ── */}
      <OrgsSection />

      {/* ── WHO IT'S FOR ── */}
      <section className="section-who">
        <div className="lp-container">
          <span className="lp-overline">Who this is for</span>
          <h2 className="lp-h">
            Profilo is built for<br />a very specific person.
          </h2>
          <div className="who-grid">
            <div>
              <div className="who-col-title yes">This is for you if —</div>
              <div className="who-list">
                <div className="who-item"><span className="who-check">→</span>You are targeting AD5–AD7 or equivalent NATO/IO grades</div>
                <div className="who-item"><span className="who-check">→</span>You have relevant experience but struggle to communicate it in institutional language</div>
                <div className="who-item"><span className="who-check">→</span>You are applying to multiple institutions and losing track of deadlines and requirements</div>
                <div className="who-item"><span className="who-check">→</span>You have failed a first screening and do not know why</div>
                <div className="who-item"><span className="who-check">→</span>You are a career coach or consultant with multiple EU-track clients</div>
                <div className="who-item"><span className="who-check">→</span>You are transitioning from a national institution, military, or consultancy to an EU/IO career</div>
              </div>
            </div>
            <div>
              <div className="who-col-title no">This is not for you if —</div>
              <div className="who-list">
                <div className="who-item"><span className="who-check" style={{ color: "var(--ink-3)" }}>—</span>You are looking for private-sector or corporate jobs</div>
                <div className="who-item"><span className="who-check" style={{ color: "var(--ink-3)" }}>—</span>You want a one-click application tool with no engagement</div>
                <div className="who-item"><span className="who-check" style={{ color: "var(--ink-3)" }}>—</span>You are not willing to invest time in understanding the notices</div>
                <div className="who-item"><span className="who-check" style={{ color: "var(--ink-3)" }}>—</span>You expect Profilo to replace the substantive preparation required for assessments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-testimonials">
        <div className="lp-container">
          <span className="lp-overline">Early users</span>
          <h2 className="lp-h">
            What they said<br />after the first week.
          </h2>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="testi-quote">
                I applied for six positions over two years with no response. Within
                three weeks of using Profilo, I finally understood what the evaluators
                were actually looking for.
              </div>
              <div className="testi-author">M.V.</div>
              <div className="testi-role">Former national diplomat · Now at EEAS</div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">
                The keyword gap analysis alone is worth the subscription. It showed
                me in 30 seconds what a €200 consultant told me in an hour.
              </div>
              <div className="testi-author">K.L.</div>
              <div className="testi-role">Policy Adviser · EU Careers applicant</div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">
                I use Profilo for all my clients who are targeting Brussels positions.
                The institutional language of the cover letters is something I could
                not replicate manually at scale.
              </div>
              <div className="testi-author">D.P.</div>
              <div className="testi-role">EU Career Coach · Brussels</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section-pricing" id="pricing">
        <div className="trial-banner">
          All plans include a <strong>7-day free trial</strong>. No charge until day 8. Cancel anytime before.
        </div>

        <div className="pricing-intro">
          <span className="lp-overline">Pricing</span>
          <h2 className="lp-h">
            One EU position pays<br />€40,000–80,000 per year.
          </h2>
          <p className="lp-body" style={{ marginTop: 12, maxWidth: 480 }}>
            The question is not whether Profilo is worth it.
            The question is whether you can afford not to use it.
          </p>

          <div className="pricing-anchor">
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--ink-3)", marginBottom: 6 }}>
              What you&apos;d pay a specialist instead
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px,2.5vw,24px)", color: "var(--ink)" }}>
              EU career consultant: <strong>€150–300 / hour</strong>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
              CV review + cover letter + match analysis = €400–600 per application cycle
            </div>
          </div>
        </div>

        <div className="pricing-grid">
          {/* ── STARTER €19 ── */}
          <div className="plan">
            <div className="plan-tag">7-day trial · then</div>
            <div className="plan-name">Starter</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--ink-3)" }}>You pay</span>
            </div>
            <div className="plan-price">€19</div>
            <div className="plan-per">/month · cancel anytime</div>
            <hr className="plan-divider" />
            <div className="bonus-list">
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text">
                  <strong>10 matches per week</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Across all 5 portals, scored daily</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text">
                  <strong>Cover letters up to 400 words</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>3 per month · institutional language</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text">
                  <strong>Keyword gap analysis</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>See exactly what&apos;s missing per vacancy</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text"><strong>Weekly email digest</strong></div>
              </div>
            </div>
            <div className="plan-limit">Not included: full-length cover letters, CV tailoring, daily alerts, tracker.</div>
            <hr className="plan-divider" />
            <a href="/signup" className="plan-btn">Start 7-day trial →</a>
          </div>

          {/* ── PRO €49 (FEATURED) ── */}
          <div className="plan featured">
            <div className="plan-tag">Best value · 7-day trial</div>
            <div className="plan-name">Pro</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,.45)" }}>You pay</span>
            </div>
            <div className="plan-price">€49</div>
            <div className="plan-per">/month · cancel anytime</div>

            <div className="vstack">
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
                What you&apos;re actually getting
              </div>
              <div className="vstack-row">
                <span className="vstack-item">Unlimited match scoring</span>
                <span className="vstack-val">€30/mo</span>
              </div>
              <div className="vstack-row">
                <span className="vstack-item">Full cover letters, unlimited</span>
                <span className="vstack-val">€450/mo</span>
              </div>
              <div className="vstack-row">
                <span className="vstack-item">CV tailoring per vacancy</span>
                <span className="vstack-val">€200/mo</span>
              </div>
              <div className="vstack-row">
                <span className="vstack-item">Keyword gap analysis</span>
                <span className="vstack-val">€80/mo</span>
              </div>
              <div className="vstack-row">
                <span className="vstack-item">Daily alerts + deadline tracker</span>
                <span className="vstack-val">€20/mo</span>
              </div>
              <div className="vstack-total">
                <span className="vstack-total-lbl">Total value</span>
                <span className="vstack-total-price">€780/mo</span>
              </div>
            </div>

            <div className="bonus-list">
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text">
                  <strong>Unlimited matches, every day</strong><br />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>No weekly cap. Every new vacancy, scored.</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text">
                  <strong>Full cover letters, no word limit</strong><br />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Unlimited per month · full institutional register</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text">
                  <strong>CV tailoring per vacancy</strong><br />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Reframing suggestions for each notice&apos;s language</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text"><strong>Daily alerts + full deadline tracker</strong></div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon">✓</div>
                <div className="bonus-text"><strong>Application Kanban (unlimited)</strong></div>
              </div>
            </div>

            <a href="/signup" className="plan-btn">Start 7-day trial — €49/mo →</a>
            <div style={{ textAlign: "center", fontSize: "11.5px", color: "rgba(255,255,255,.3)", marginTop: 10 }}>
              30-day money-back guarantee after trial
            </div>
          </div>

          {/* ── EXPERT €97 ── */}
          <div className="plan">
            <div className="plan-tag">For coaches &amp; power users</div>
            <div className="plan-name">Expert</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--ink-3)" }}>You pay</span>
            </div>
            <div className="plan-price">€97</div>
            <div className="plan-per">/month · cancel anytime</div>
            <hr className="plan-divider" />
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 12 }}>
              Everything in Pro, plus:
            </div>
            <div className="bonus-list">
              <div className="bonus-item">
                <div className="bonus-icon" style={{ background: "var(--ink)", color: "var(--white)" }}>+</div>
                <div className="bonus-text">
                  <strong>5 team seats</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Manage up to 4 clients or colleagues</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon" style={{ background: "var(--ink)", color: "var(--white)" }}>+</div>
                <div className="bonus-text">
                  <strong>Weekly compliance audit</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>AI report: where your profile stands vs. this week&apos;s market demand</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon" style={{ background: "var(--ink)", color: "var(--white)" }}>+</div>
                <div className="bonus-text">
                  <strong>1:1 onboarding call</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>30-min session to configure your profile for maximum match accuracy</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon" style={{ background: "var(--ink)", color: "var(--white)" }}>+</div>
                <div className="bonus-text">
                  <strong>B2B API access</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>For integrations and custom workflows</span>
                </div>
              </div>
              <div className="bonus-item">
                <div className="bonus-icon" style={{ background: "var(--ink)", color: "var(--white)" }}>+</div>
                <div className="bonus-text">
                  <strong>Priority support</strong><br />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Response within 24 hours</span>
                </div>
              </div>
            </div>
            <a href="/signup" className="plan-btn">Start 7-day trial →</a>
          </div>
        </div>

        <div style={{ marginTop: 36, textAlign: "center", fontSize: 13, color: "var(--ink-3)", padding: "0 48px" }}>
          All prices exclude VAT where applicable · Stripe-secured payments · Cancel before day 8 to pay nothing
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section className="section-guarantee" id="guarantee">
        <div className="lp-container">
          <div className="guarantee-box">
            <div className="guarantee-seal">
              <div className="guarantee-seal-top">Money back</div>
              <div className="guarantee-seal-num">30</div>
              <div className="guarantee-seal-bottom">Day guarantee</div>
            </div>
            <div>
              <div className="guarantee-title">If it does not deliver, we refund. No questions.</div>
              <div className="guarantee-text">
                Try Profilo Pro for 30 days. If you do not find it meaningfully useful —
                whether it is the match quality, the writing partner output, or anything
                else — email us and we will refund your payment in full. We are not
                interested in keeping money from people the product did not serve.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-faq">
        <div className="lp-container-sm">
          <span className="lp-overline">FAQ</span>
          <h2 className="lp-h">Frequently asked questions.</h2>
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

      {/* ── FINAL CTA ── */}
      <section className="section-cta">
        <div className="lp-container-xs">
          <span className="cta-overline">You have everything to gain</span>
          <h2 className="cta-h">
            The position exists.<br /><em>Your application</em><br />needs to reach it.
          </h2>
          <p className="cta-sub">
            Start for free. Upload your CV. See your first matches in minutes.
            No consultants, no spreadsheets, no guesswork.
          </p>
          <a className="btn-light" href="/signup">Start for free →</a>
          <p className="cta-note">No credit card · Cancel anytime · Your data stays yours</p>
        </div>
      </section>
    </>
  );
}
