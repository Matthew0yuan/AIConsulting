export default function Hero() {
  return (
    <section className="hero" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center', 
      padding: '8rem 0 4rem' 
    }}>
      <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="eyebrow">AI CONSULTING STUDIO</p>
        <h1 style={{ maxWidth: '20ch', marginBottom: '1.5rem', fontSize: 'clamp(3rem, 9vw, 5rem)' }}>
          Build the systems layer for your next era of growth.
        </h1>
        <p className="hero-text" style={{ maxWidth: '42rem', marginBottom: '2.5rem' }}>
          Velix AI helps ambitious companies design practical AI
          workflows, automation programs, and decision systems that feel
          advanced without becoming fragile.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <a href="#cases" className="button button-primary">
            See demo cases
          </a>
          <a href="#contact" className="button button-secondary">
            Start a strategy sprint
          </a>
        </div>
      </div>
    </section>
  );
}
