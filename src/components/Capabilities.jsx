import { services } from '../data/content';
import Reveal from './Reveal';

export default function Capabilities() {
  return (
    <section className="section" id="services">
      <Reveal delay={0}>
        <div className="section-heading">
          <p className="eyebrow">CAPABILITIES</p>
          <h2>Consulting built for operators, not just innovation theater.</h2>
        </div>
      </Reveal>
      <div className="service-grid">
        {services.map((service, idx) => (
          <Reveal delay={idx * 150} key={service.title}>
            <article className="glass-card" style={{ height: '100%' }}>
              <div className="card-chip">Core offer</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
