import { values } from '../data/content';

export default function AboutUs() {
  return (
    <section className="section" id="about">
      <div className="section-heading">
        <p className="eyebrow">ABOUT US</p>
        <h2>Our Manifesto</h2>
      </div>
      <div className="service-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {values.map((val, idx) => (
          <article className="glass-card" key={val.title}>
            <div className="card-chip">Belief 0{idx + 1}</div>
            <h3>{val.title}</h3>
            <p>{val.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
