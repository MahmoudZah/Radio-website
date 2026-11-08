import { useId, useState } from 'react'
import { L, f0, fmt, tankResponse } from '../lib/physics'
import { band, have, qFactor } from '../data/measurements'
import { ResonanceCurve } from './svg/Diagrams'

/* Log-scale dial from 300 kHz to 2.4 MHz */
const D_MIN = 300e3
const D_MAX = 2.4e6
const dpos = (hz) => (Math.log(hz / D_MIN) / Math.log(D_MAX / D_MIN)) * 100
const dialTicks = [300e3, 400e3, 500e3, 600e3, 800e3, 1e6, 1.5e6, 2e6]
// labels that are dropped on narrow screens so the scale never crowds
const minorTicks = new Set([400e3, 600e3, 1.5e6])

const Ticks = () =>
  dialTicks.map((t, i) => (
    <span
      key={t}
      className={`dial-tick${minorTicks.has(t) ? ' is-minor' : ''}${i === 0 ? ' is-first' : ''}`}
      style={{ left: `${dpos(t)}%` }}
    >
      <span>{t >= 1e6 ? `${t / 1e6}M` : `${t / 1e3}k`}</span>
    </span>
  ))

/** The radio dial: a band of frequencies on a log scale, with optional needle and shaded ranges. */
export function Dial({ needle, ranges = [], compact = false }) {
  return (
    <div className={`dial${compact ? ' is-compact' : ''}`}>
      <div className="dial-track">
        {ranges.map((r) => (
          <span
            key={r.label}
            className={`dial-range is-${r.tone}`}
            style={{ left: `${dpos(r.from)}%`, width: `${dpos(r.to) - dpos(r.from)}%` }}
            title={r.label}
          />
        ))}
        <Ticks />
        {needle &&<span className="dial-needle" style={{ left: `${dpos(needle)}%` }} />}
      </div>
    </div>
  )
}

/** Turn the capacitor, watch f0 move. Uses L from Wheeler. */
export function Tuner() {
  const id = useId()
  const [c, setC] = useState(130)
  const f = f0(L, c * 1e-12)
  const real = c >= 100
  // rotor angle: fully meshed (280 pF) = 0°, fully open (20 pF) = 180°
  const angle = (1 - (c - 20) / 260) * 180

  return (
    <div className="tuner">
      <div className="tuner-top">
        <svg className="gang" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="gang-ring" cx="60" cy="60" r="54" />
          <path className="gang-stator" d="M60 60 L6 60 A54 54 0 0 1 114 60 Z" />
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '60px 60px' }}>
            <path className="gang-rotor" d="M60 60 L12 60 A48 48 0 0 1 108 60 Z" />
          </g>
          <circle className="gang-shaft" cx="60" cy="60" r="7" />
        </svg>
        <div className="tuner-read">
          <p className="tr-k">Resonance with L = {fmt.uH(L)}</p>
          <p className="tr-f" aria-live="polite">
            {fmt.auto(f)}
          </p>
          <p className="tr-c">
            C = <b>{c} pF</b>
            <span className={`tr-flag${real ? '' : ' is-out'}`}>{real ? 'inside our capacitor’s real range' : 'below what our capacitor reaches'}</span>
          </p>
        </div>
      </div>

      <label className="slider" htmlFor={id}>
        <span className="sr-only">Tuning capacitance in picofarads</span>
        <input id={id} type="range" min="20" max="280" step="1" value={c} onChange={(e) => setC(+e.target.value)} />
        <span className="slider-scale" aria-hidden="true">
          <span>20 pF</span>
          <span>100 pF</span>
          <span>280 pF</span>
        </span>
      </label>

      <Dial
        needle={f}
        ranges={[
          { label: 'MW broadcast band', from: 531e3, to: 1602e3, tone: 'mw' },
          { label: 'Our measured band', from: band.lowEnd * 1e3, to: band.highEnd * 1e3, tone: 'ours' },
        ]}
      />
      <ul className="legend">
        <li className="lg-mw">MW broadcast band, 531–1602 kHz</li>
        <li className="lg-ours">our measured band</li>
        <li className="lg-needle">this setting, as predicted</li>
      </ul>
    </div>
  )
}

/** How Q decides whether a neighbouring station leaks through. */
export function QPlay() {
  const id = useId()
  const [q, setQ] = useState(qFactor() ?? 7)
  const fc = have(band.f0Half) ? band.f0Half : 1072
  const leak = tankResponse(fc + 9, fc, q)
  const bw = fc / q
  return (
    <div className="qplay">
      <div className="qplay-ctrl">
        <p className="tr-k">Play with Q · how selective is the tank?</p>
        <p className="qp-q" aria-live="polite">Q = {q.toFixed(2)}</p>
        <dl className="qp-facts">
          <div>
            <dt>bandwidth</dt>
            <dd>{bw.toFixed(1)} kHz</dd>
          </div>
          <div>
            <dt>neighbour 9 kHz away</dt>
            <dd>{Math.round(leak * 100)}% of ours</dd>
          </div>
        </dl>
      <label className="slider" htmlFor={id}>
        <span className="sr-only">Quality factor</span>
        <input id={id} type="range" min="3" max="120" step="0.01" value={q} onChange={(e) => setQ(+e.target.value)} />
        <span className="slider-scale" aria-hidden="true">
          <span>3</span>
          <span>ours: {qFactor()?.toFixed(2) ?? '—'}</span>
          <span>120</span>
        </span>
      </label>
      <p className="qp-note">
        The orange squares are stations 9 kHz either side of ours, the spacing used for medium wave in our region. Around Q = 120
        the bandwidth matches that spacing near our measured resonance.
      </p>
      </div>
      <div className="qplay-plot">
        <ResonanceCurve id="qplay" f0={fc} Q={q} span={0.12} neighbours={[fc - 9, fc + 9]} />
      </div>
    </div>
  )
}

/** Predicted vs measured band on the same log dial. */
export function BandCompare({ rows }) {
  return (
    <div className="bands">
      {rows.map((r) => (
        <div key={r.label} className={`band-row is-${r.tone}`}>
          <p className="band-l">{r.label}</p>
          <div className="band-track">
            <span className="band-mw" style={{ left: `${dpos(531e3)}%`, width: `${dpos(1602e3) - dpos(531e3)}%` }} />
            <span
              className={`band-bar${dpos(r.to) > 82 ? ' to-inside' : ''}`}
              style={{ left: `${dpos(r.from)}%`, width: `${dpos(r.to) - dpos(r.from)}%` }}
            >
              <span className="band-from">{fmt.auto(r.from)}</span>
              <span className="band-to">{fmt.auto(r.to)}</span>
            </span>
          </div>
        </div>
      ))}
      <div className="band-row band-axis" aria-hidden="true">
        <p className="band-l" />
        <div className="band-track">
          <Ticks />
        </div>
      </div>
    </div>
  )
}
