import { values } from '../data/content';
import Reveal from './Reveal';

export default function AboutUs() {
  return (
    <section className="section" id="about">
      <Reveal delay={0}>
        <div className="section-heading">
          <p className="eyebrow">ABOUT US</p>
          <h2>Our Manifesto</h2>
        </div>
      </Reveal>
      <div className="service-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {values.map((val, idx) => (
          <Reveal delay={idx * 150} key={val.title}>
            <article className="glass-card" style={{ height: '100%' }}>
              <div className="card-chip">Belief 0{idx + 1}</div>
              <h3>{val.title}</h3>
              <p>{val.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
