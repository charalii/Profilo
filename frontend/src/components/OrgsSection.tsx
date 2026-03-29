'use client';

import { useEffect, useRef } from 'react';

interface Org {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
  tagline: string;
  portal: string;
  description: string;
  salary: string;
  benefits: string[];
  roles: string;
  color: string;
}

const orgs: Org[] = [
  {
    id: 'eu',
    name: 'European Union',
    abbreviation: 'EU',
    logo: '/logos/eu.svg',
    tagline: 'European Commission, Parliament, Council & 40+ Agencies',
    portal: 'EPSO — European Personnel Selection Office',
    description:
      'The EU institutions are among the most sought-after employers in the world, with headquarters in Brussels and Luxembourg and agencies across the continent. EU careers offer exceptional job security, structured career progression, and the chance to shape policy affecting 450 million people.',
    salary: '€4,100 – €18,370 / month net',
    benefits: [
      '16% expatriate allowance on top of base salary',
      'Household & child allowances',
      'Full education grant for dependent children',
      'JSIS health insurance (80–85% reimbursement)',
      'Pension: up to 70% of final salary after 35 years',
      'EU internal tax — significantly lower than national rates',
    ],
    roles: 'Administrators (AD), Assistants (AST), Contract Agents (CAST), Specialists',
    color: '#003399',
  },
  {
    id: 'nato',
    name: 'NATO',
    abbreviation: 'NATO',
    logo: '/logos/nato.svg',
    tagline: 'North Atlantic Treaty Organization — Brussels & Commands worldwide',
    portal: 'NATO Taleo — nato.taleo.net',
    description:
      'NATO employs over 5,000 international civilian staff at its headquarters in Brussels and across strategic commands in Europe and North America. Working at NATO means contributing directly to Euro-Atlantic security alongside professionals from all 32 member nations.',
    salary: '€3,500 – €12,000 / month net (tax-advantaged)',
    benefits: [
      'Reduced NATO internal tax — lower than Belgian national rate',
      'Expatriate supplement for international hires',
      'Education allowance for dependent children',
      'End-of-service gratuity and pension scheme',
      'Annual home leave travel allowance',
      'Comprehensive NATO medical scheme',
    ],
    roles: 'Civilian grades B4–B8, A1–A6, Language Officers, Senior Officials',
    color: '#003F87',
  },
  {
    id: 'un',
    name: 'United Nations',
    abbreviation: 'UN',
    logo: '/logos/un.svg',
    tagline: 'UN Secretariat, Programmes & Specialized Agencies worldwide',
    portal: 'UN Careers — careers.un.org',
    description:
      "The United Nations system employs more than 44,000 staff across hundreds of duty stations — from New York and Geneva to Nairobi and Vienna. A UN career offers unmatched international mobility and the opportunity to work on the world's most pressing challenges.",
    salary: 'P2 ~$50,000 → P5 ~$120,000 / yr net (tax-exempt in most countries)',
    benefits: [
      'Salary exempt from national income tax in most countries',
      'Post Adjustment (PA): up to 70%+ of base salary by duty station',
      'Rental subsidy: up to 40% of rent covered',
      'Education grant: $30,000–$45,000 per year per child',
      'Mobility & hardship allowance for field assignments',
      'UN Joint Staff Pension Fund (23.7% employer contribution)',
    ],
    roles: 'Professional (P1–P7), Director (D1–D2), National Officer (NO)',
    color: '#009EDB',
  },
  {
    id: 'oecd',
    name: 'OECD',
    abbreviation: 'OECD',
    logo: '/logos/oecd.svg',
    tagline: 'Organisation for Economic Co-operation and Development — Paris',
    portal: 'OECD Careers — oecd.org/careers',
    description:
      'Based in the heart of Paris, the OECD sets global standards in economic and social policy. As an OECD staff member you collaborate with governments of 38 member countries on taxation, education, health, climate, and trade — producing the research that shapes national policy worldwide.',
    salary: '€4,500 – €14,000 / month net (tax-exempt in France)',
    benefits: [
      'Fully exempt from French income tax',
      'Competitive base salary on OECD international pay scale',
      'Comprehensive OECD Staff Health Insurance',
      'OECD Pension Fund (~14% employer contribution)',
      'Child allowance & education cost reimbursement',
      'Paris duty-station location allowance',
    ],
    roles: 'Analysts (A1–A4), Senior Economists, Policy Experts, Programme Managers',
    color: '#0052A5',
  },
  {
    id: 'osce',
    name: 'OSCE',
    abbreviation: 'OSCE',
    logo: '/logos/osce.svg',
    tagline: 'Organisation for Security and Co-operation in Europe — Vienna & Field',
    portal: 'OSCE Jobs — jobs.osce.org',
    description:
      "The OSCE is the world's largest regional security organisation, with a Secretariat in Vienna and active field missions in 50+ countries across Europe and Central Asia. OSCE careers combine policy and analysis at HQ with deployment to some of the most strategically significant regions in the world.",
    salary: '€2,800 – €9,500 / month net (Vienna: Austrian tax-exempt)',
    benefits: [
      'Vienna HQ: fully exempt from Austrian income tax',
      'Mission Subsistence Allowance (MSA) in field deployments',
      'Hazard Pay for high-risk duty stations',
      'OSCE Medical Insurance Plan',
      'Education grant for dependent children',
      'End-of-service gratuity (competitive lump-sum)',
    ],
    roles: 'Associate Officers, Political Officers, Election Experts, Mission Monitors',
    color: '#0077C0',
  },
];

export function OrgsSection() {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('org-visible');
          }
        });
      },
      { threshold: 0.12 }
    );
    blockRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-orgs" id="organizations">
      <div className="orgs-intro">
        <span className="lp-overline">Where we source</span>
        <h2 className="lp-h">
          Five organisations.<br />
          <em>Every vacancy.</em>
        </h2>
        <p className="lp-body" style={{ maxWidth: 540 }}>
          Profilo monitors the five official portals in real time — so every opening at EPSO,
          NATO Taleo, UN Careers, OECD and OSCE reaches you the day it is published.
        </p>
      </div>

      {orgs.map((org, i) => (
        <div
          key={org.id}
          className="org-block"
          ref={(el) => { blockRefs.current[i] = el; }}
          style={{ '--org-color': org.color } as React.CSSProperties}
        >
          <div className="org-watermark" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.logo} alt="" />
          </div>
          <div className="org-content">
            <div>
              <div className="org-abbr" style={{ color: org.color }}>{org.abbreviation}</div>
              <h3 className="org-name">{org.name}</h3>
              <p className="org-tagline">{org.tagline}</p>
              <p className="org-portal">
                <strong>Portal:</strong> {org.portal}
              </p>
              <p className="org-description">{org.description}</p>
              <p className="org-roles">
                <strong>Typical roles:</strong> {org.roles}
              </p>
            </div>
            <div>
              <div className="org-salary-block">
                <div className="org-salary-label">Indicative net salary</div>
                <div className="org-salary-value">{org.salary}</div>
              </div>
              <ul className="org-benefits">
                {org.benefits.map((b) => (
                  <li key={b}>
                    <span className="org-benefit-dot" style={{ background: org.color }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
