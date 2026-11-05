import { SectionHead } from '../components/ui'
import { qFactor } from '../data/measurements'

const checks = [
  'Coil wound and tank built',
  'Resonance found at TP1',
  'Band, bandwidth and Q measured',
  'Detector built and tested at TP3',
  'Tables 4, 5 and 6 completed',
  'Predictions compared with measurements',
  'Challenges documented',
]

export function Conclusion() {
  return (
    <section className="band band-ink" id="conclusion" aria-labelledby="co-h">
      <div className="wrap">
        <SectionHead id="co-h" n="09" label="Conclusion" title="Checkpoint and conclusion" sub="M1 works as a radio’s front end." />
        <div className="concl">
          <ul className="checks" aria-label="M1 checklist">
            {checks.map((c) => (
              <li key={c}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <rect x="1" y="1" width="18" height="18" rx="4" />
                  <path d="M5 10.5 8.5 14 15 6.5" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
          <div className="concl-text">
            <p className="concl-lead">
              The tank picks one frequency (Q ≈ {qFactor()?.toFixed(0)}) and the detector turns the signal’s peaks into a DC level.
            </p>
            <p>
              Our measured band was lower and narrower than predicted, mostly because the capacitor’s real range starts at about 100
              pF, plus stray capacitance in the circuit.
            </p>
          </div>
        </div>

        <div className="next">
          <div>
            <p className="next-k">Next · M2</p>
            <h3>An RF amplifier before the detector</h3>
            <p>
              Real stations arrive as millivolts or less, which a diode alone cannot follow. M2 adds two amplifier stages before the
              detector.
            </p>
          </div>
          <svg className="next-svg" viewBox="0 0 300 120" aria-hidden="true">
            <path className="nx-w" d="M0 60 H40" />
            <rect className="nx-m1" x="40" y="36" width="60" height="48" rx="6" />
            <text x="70" y="65" textAnchor="middle">
              tank
            </text>
            <path className="nx-w" d="M100 60 H120" />
            <path className="nx-amp" d="M120 36 L156 60 L120 84 Z" />
            <path className="nx-w" d="M156 60 H170" />
            <path className="nx-amp" d="M170 36 L206 60 L170 84 Z" />
            <path className="nx-w" d="M206 60 H226" />
            <rect className="nx-m1" x="226" y="36" width="60" height="48" rx="6" />
            <text x="256" y="65" textAnchor="middle">
              det.
            </text>
            <text className="nx-lock" x="163" y="108" textAnchor="middle">
              M2 · coming soon
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
