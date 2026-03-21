import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireScope — AI Job Matching for EU & International Careers",
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
      <body>
        <nav className="site-nav">
          <a href="/" className="nav-logo">
            Hire<span>Scope</span>
          </a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Reviews</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <a href="/signup" className="nav-cta">Get Started Free</a>
        </nav>
        {children}
        <footer className="site-footer">
          <a href="/" className="footer-logo">
            Hire<span>Scope</span>
          </a>
          <p>&copy; 2026 HireScope. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="mailto:hello@hirescope.eu">Contact</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
