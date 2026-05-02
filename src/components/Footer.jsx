import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="footer section" style={{ paddingBottom: '2rem', paddingTop: '0', borderTop: '1px solid var(--line)', marginTop: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '2rem' }}>
        <div className="brand-lockup">
          <BrandLogo compact />
        </div>
        <div style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Verlix AI Consulting. All rights reserved.
        </div>
        <nav style={{ display: 'flex', gap: '1rem', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
          <a href="#" style={{ textDecoration: 'underline' }}>Privacy</a>
          <a href="#" style={{ textDecoration: 'underline' }}>Terms</a>
          <a href="#" style={{ textDecoration: 'underline' }}>LinkedIn</a>
        </nav>
      </div>
    </footer>
  );
}
