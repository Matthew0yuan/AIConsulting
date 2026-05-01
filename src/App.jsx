import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Capabilities from './components/Capabilities';
import DemoCases from './components/DemoCases';
import ProcessTimeline from './components/ProcessTimeline';
import ContactPanel from './components/ContactPanel';
import ParticlesBackground from './components/ParticlesBackground';
import Reveal from './components/Reveal';
import MetricsRow from './components/MetricsRow';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="page-shell">
      <ParticlesBackground />
      <Header />
      <main>
        <Reveal delay={0}>
          <Hero />
        </Reveal>
        <Reveal delay={150}>
          <section className="logo-band" aria-label="Positioning highlights" style={{ justifyContent: 'center' }}>
            <span>AI transformation</span>
            <span style={{ color: 'var(--teal)' }}>•</span>
            <span>Workflow redesign</span>
            <span style={{ color: 'var(--teal)' }}>•</span>
            <span>Revenue systems</span>
            <span style={{ color: 'var(--teal)' }}>•</span>
            <span>Decision intelligence</span>
            <span style={{ color: 'var(--teal)' }}>•</span>
            <span>Agent architecture</span>
          </section>
        </Reveal>
        <AboutUs />
        <MetricsRow />
        <Capabilities />
        <DemoCases />
        <ProcessTimeline />
        <Reveal delay={0}>
          <ContactPanel />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
