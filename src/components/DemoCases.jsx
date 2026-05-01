import { cases } from '../data/content';
import Reveal from './Reveal';

export default function DemoCases() {
  return (
    <section className="section section-cases" id="cases">
      <Reveal delay={0}>
        <div className="section-heading">
          <p className="eyebrow">DEMO CASES</p>
          <h2>Examples of the kind of transformation we help teams launch.</h2>
        </div>
      </Reveal>
      <div className="cases-grid">
        {cases.map((item, idx) => (
          <Reveal delay={idx * 150} key={item.name}>
            <article className="case-card" style={{ height: '100%' }}>
              <div className="case-topline">
                <span>{item.category}</span>
                <strong>{item.outcome}</strong>
              </div>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <button type="button" className="case-link" aria-label={`Explore workflow for ${item.name}`}>
                Explore workflow
              </button>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
