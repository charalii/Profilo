export function MarketingNav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a href="/" className="nav-logo" aria-label="Profilo home">
        Profilo<span>.</span>
      </a>
      <ul className="nav-links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#organizations">Organisations</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#guarantee">Guarantee</a></li>
        <li><a href="/signup" className="nav-cta">Start free →</a></li>
      </ul>
    </nav>
  );
}
