export default function Header() {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <a href="/" className="brand-mark" aria-label="Home">V</a>
        <div>
          <p className="brand-name">Velix AI</p>
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
