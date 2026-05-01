import { process } from '../data/content';
import Reveal from './Reveal';

export default function ProcessTimeline() {
  return (
    <section className="section process-section" id="process">
      <Reveal delay={0}>
        <div className="section-heading">
          <p className="eyebrow">HOW WE WORK</p>
          <h2>A sharp three-phase model from signal to shipped system.</h2>
        </div>
      </Reveal>
      <div className="timeline">
        {process.map((item, idx) => (
          <Reveal delay={idx * 150} key={item.step}>
            <article className="timeline-card" style={{ height: '100%' }}>
              <span className="timeline-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
