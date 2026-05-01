import { metrics } from '../data/content';
import Reveal from './Reveal';

export default function MetricsRow() {
  return (
    <section className="section" style={{ paddingTop: '0' }}>
      <div className="metric-row" style={{ justifyContent: 'center' }}>
        {metrics.map((metric, idx) => (
          <Reveal key={metric.label} delay={idx * 150}>
            <div className="metric-card" style={{ textAlign: 'center' }}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
