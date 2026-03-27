import { cases } from '../data/content';

export default function DemoCases() {
  return (
    <section className="section section-cases" id="cases">
      <div className="section-heading">
        <p className="eyebrow">DEMO CASES</p>
        <h2>Examples of the kind of transformation we help teams launch.</h2>
      </div>
      <div className="cases-grid">
        {cases.map((item) => (
          <article className="case-card" key={item.name}>
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
        ))}
      </div>
    </section>
  );
}
