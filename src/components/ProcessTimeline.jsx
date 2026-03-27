import { process } from '../data/content';

export default function ProcessTimeline() {
  return (
    <section className="section process-section" id="process">
      <div className="section-heading">
        <p className="eyebrow">HOW WE WORK</p>
        <h2>A sharp three-phase model from signal to shipped system.</h2>
      </div>
      <div className="timeline">
        {process.map((item) => (
          <article className="timeline-card" key={item.step}>
            <span className="timeline-step">{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
