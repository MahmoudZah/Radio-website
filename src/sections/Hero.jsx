import { RadioScene } from '../components/three/RadioScene'
import { Traces } from '../components/svg/Diagrams'
import { Dial } from '../components/Interactive'
import { team, milestones } from '../data/team'
import { band, qFactor } from '../data/measurements'

const Lock = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
    <path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3" y="7" width="10" height="7.5" rx="1.5" fill="currentColor" />
  </svg>
)

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-h">
      <Traces className="hero-traces" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            {team.course} · {team.courseTitle} · {team.term}
          </p>
          <p className="badge">
            <span className="badge-dot" aria-hidden="true" />
            Milestone 1: The Tuner and the Detector
          </p>
          <h1 id="hero-h">
            <span className="h-a">Team 22</span>
            <span className="h-b">Radio Guide</span>
          </h1>
          <p className="hero-sub">A DIY medium-wave AM radio, built one milestone at a time.</p>
          <a className="btn btn-primary" href="#overview">
            Start the journey
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M8 2v11M3 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </div>

        <div className="hero-stage">
          <RadioScene />
          <dl className="hud">
            <div>
              <dt>f₀</dt>
              <dd>{band.f0Half} kHz</dd>
            </div>
            <div>
              <dt>Q</dt>
              <dd>{qFactor()?.toFixed(2)}</dd>
            </div>
            <div>
              <dt>band</dt>
              <dd>
                {band.lowEnd.toFixed(1)}–{Math.round(band.highEnd)} kHz
              </dd>
            </div>
          </dl>
          <p className="drag-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Drag to turn the radio
          </p>
        </div>

        <div className="hero-foot">
          <div className="hero-dial">
            <p className="mini-k">Our measured tuning band · log scale</p>
            <Dial
              compact
              needle={band.f0Half * 1e3}
              ranges={[
                { label: 'MW broadcast band', from: 531e3, to: 1602e3, tone: 'mw' },
                { label: 'Our band', from: band.lowEnd * 1e3, to: band.highEnd * 1e3, tone: 'ours' },
              ]}
            />
          </div>
          <ol className="keys" aria-label="Milestones">
            {milestones.map((m) => (
              <li key={m.id}>
                {m.active ? (
                  <a className="key is-active" href="#overview" aria-current="step">
                    <span className="key-id">{m.id}</span>
                    <span className="key-t">{m.title}</span>
                  </a>
                ) : (
                  <span className="key" aria-disabled="true">
                    <span className="key-id">
                      {m.id} <Lock />
                    </span>
                    <span className="key-t">{m.title}</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
