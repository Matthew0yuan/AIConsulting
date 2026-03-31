import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Capabilities from './components/Capabilities';
import DemoCases from './components/DemoCases';
import ProcessTimeline from './components/ProcessTimeline';
import ContactPanel from './components/ContactPanel';
import ParticlesBackground from './components/ParticlesBackground';

export default function App() {
  return (
    <div className="page-shell">
      <ParticlesBackground />
      <Header />
      <main>
        <Hero />
        <section className="logo-band" aria-label="Positioning highlights" style={{ justifyContent: 'center' }}>
          <span>AI transformation</span>
          <span>Workflow redesign</span>
          <span>Revenue systems</span>
          <span>Decision intelligence</span>
          <span>Agent architecture</span>
        </section>
        <AboutUs />
        <Capabilities />
        <DemoCases />
        <ProcessTimeline />
        <ContactPanel />
      </main>
    </div>
  );
}
