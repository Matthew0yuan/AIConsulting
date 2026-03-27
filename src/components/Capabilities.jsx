import { services } from '../data/content';

export default function Capabilities() {
  return (
    <section className="section" id="services">
      <div className="section-heading">
        <p className="eyebrow">CAPABILITIES</p>
        <h2>Consulting built for operators, not just innovation theater.</h2>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <article className="glass-card" key={service.title}>
            <div className="card-chip">Core offer</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
