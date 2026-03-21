export function MarketingNav() {
  return (
    <nav className="site-nav">
      <a href="/" className="nav-logo">
        Hire<span>Scope</span>
      </a>
      <ul className="nav-links">
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#testimonials">Reviews</a>
        </li>
        <li>
          <a href="#faq">FAQ</a>
        </li>
        <li>
          <a href="#pricing">Pricing</a>
        </li>
      </ul>
      <a href="/signup" className="nav-cta">
        Get Started Free
      </a>
    </nav>
  );
}
