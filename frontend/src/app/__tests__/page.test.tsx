import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Landing Page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  // ── HERO SECTION ──
  describe("Hero Section", () => {
    it("renders the main heading", () => {
      expect(screen.getByText("Stop Hunting.")).toBeInTheDocument();
      expect(screen.getByText("Start Matching.")).toBeInTheDocument();
    });

    it("renders the hero badge", () => {
      expect(
        screen.getByText(/Built for EU & International Careers/i)
      ).toBeInTheDocument();
    });

    it("renders the hero description", () => {
      expect(
        screen.getByText(/scrapes 15\+ EU and international vacancy/i)
      ).toBeInTheDocument();
    });

    it("renders the primary CTA button linking to signup", () => {
      const link = screen.getByRole("link", {
        name: /Upload Your CV — Get Your First Matches Free/i,
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/signup");
    });

    it("renders the secondary CTA button", () => {
      expect(
        screen.getByRole("link", { name: /See How It Works/i })
      ).toBeInTheDocument();
    });

    it("renders the no credit card note", () => {
      expect(screen.getByText(/No credit card. No spam/i)).toBeInTheDocument();
    });
  });

  // ── TRUST BAR ──
  describe("Trust Bar", () => {
    it("renders the trust bar with portal names", () => {
      expect(
        screen.getByText(/EPSO · EEAS · NATO · NSPA · EDA/i)
      ).toBeInTheDocument();
    });
  });

  // ── FEATURES SECTION ──
  describe("Features Section", () => {
    it("renders the section title", () => {
      expect(screen.getByText(/Everything you need/i)).toBeInTheDocument();
    });

    it("renders all 6 feature cards", () => {
      const featureTitles = [
        "AI That Actually Understands EU Careers",
        "Every Vacancy. One Dashboard.",
        "Cover Letters That Don't Sound Like Templates",
        "Know Exactly What's Missing From Your CV",
        "Track Everything Without the Spreadsheet",
        "Never Miss a Perfect Match",
      ];

      featureTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it("renders feature pills", () => {
      expect(
        screen.getByText("5-dimension weighted scoring")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Updated daily from source")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Kanban with deadline alerts")
      ).toBeInTheDocument();
    });
  });

  // ── STATS SECTION ──
  describe("Stats Section", () => {
    it("renders all stat numbers", () => {
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("2K")).toBeInTheDocument();
    });

    it("renders stat labels", () => {
      expect(
        screen.getByText("Vacancy sources scraped daily")
      ).toBeInTheDocument();
      expect(
        screen.getByText("From CV upload to first matches")
      ).toBeInTheDocument();
    });
  });

  // ── TESTIMONIALS ──
  describe("Testimonials Section", () => {
    it("renders all 3 testimonials", () => {
      expect(
        screen.getByText(/spending 10\+ hours a week/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/cover letter generator understands/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/recommended Profilo to every single/i)
      ).toBeInTheDocument();
    });

    it("renders testimonial authors", () => {
      expect(
        screen.getByText("Policy Advisor, Brussels")
      ).toBeInTheDocument();
      expect(screen.getByText("Legal Officer")).toBeInTheDocument();
      expect(screen.getByText("EU Career Coach")).toBeInTheDocument();
    });
  });

  // ── FAQ SECTION ──
  describe("FAQ Section", () => {
    it("renders the FAQ title", () => {
      expect(
        screen.getByText("Frequently asked questions.")
      ).toBeInTheDocument();
    });

    it("renders all 8 FAQ questions", () => {
      const questions = [
        "How does Profilo find vacancies?",
        "How accurate is the matching?",
        "Is my CV data safe?",
        "What file format does my CV need to be?",
        "Can I use Profilo if I'm outside the EU?",
        "What's included in the free plan?",
        "How is this different from LinkedIn or Jobscan?",
        "Can I cancel anytime?",
      ];

      questions.forEach((q) => {
        expect(screen.getByText(q)).toBeInTheDocument();
      });
    });
  });

  // ── FINAL CTA ──
  describe("Final CTA Section", () => {
    it("renders the final CTA heading", () => {
      expect(
        screen.getByText(/Your Next EU Career Move/i)
      ).toBeInTheDocument();
    });

    it("renders the final CTA button linking to signup", () => {
      const link = screen.getByRole("link", {
        name: /Get Started Free — Upload Your CV/i,
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/signup");
    });

    it("renders the free plan note", () => {
      expect(
        screen.getByText(/Free plan includes 3 matches per week/i)
      ).toBeInTheDocument();
    });
  });
});
