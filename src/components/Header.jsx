import BrandLogo from './BrandLogo';

export default function Header() {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <a href="/" className="brand-logo-link" aria-label="Verlix AI home">
          <BrandLogo />
        </a>
        <div>
          <p className="brand-tag">Consulting for high-velocity teams</p>
        </div>
      </div>
      <nav className="nav-links">
        <a href="#about">About Us</a>
        <a href="#services">Capabilities</a>
        <a href="#cases">Demo Cases</a>
        <a href="#process">Approach</a>
      </nav>
    </header>
  );
}
