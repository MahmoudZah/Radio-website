import { useState } from 'react'
import { useReducedMotion } from '../../hooks/useScroll'

/* ------------------------------------------------------------------ */
/* Signal chain: animated pulses run along the path                    */
/* ------------------------------------------------------------------ */

const chain = [
  { key: 'air', title: 'Waves', sub: 'from the air', kind: 'io' },
  { key: 'tank', title: 'Tuned circuit', sub: 'M1 · TP1', kind: 'm1' },
  { key: 'g1', title: 'Gain', sub: 'later · M2', kind: 'later' },
  { key: 'det', title: 'Detector', sub: 'M1 · TP3', kind: 'm1' },
  { key: 'g2', title: 'Gain', sub: 'later · M2', kind: 'later' },
  { key: 'snd', title: 'Sound', sub: 'speaker', kind: 'io' },
]

const sizeRow = { io: 96, m1: 168, later: 112 }
const sizeCol = { io: 60, m1: 74, later: 54 }

function layout(dir) {
  const row = dir === 'row'
  const W = row ? 1000 : 360
  const sizes = row ? sizeRow : sizeCol
  const total = chain.reduce((a, n) => a + sizes[n.kind], 0)
  const span = row ? 1000 - 20 : 0
  const gap = row ? (span - total) / (chain.length - 1) : 40
  let p = row ? 10 : 16
  const nodes = chain.map((n) => {
    const s = sizes[n.kind]
    const o = { ...n, a: p, s }
    p += s + gap
    return o
  })
  const H = row ? 200 : p - gap + 16
  return { W, H, nodes, row }
}

const IoIcon = ({ k, cx, cy }) =>
  k === 'air' ? (
    <g className="dg-io">
      <path d={`M${cx - 30} ${cy} q7.5 -18 15 0 t15 0 t15 0 t15 0`} />
      <path d={`M${cx - 22} ${cy - 22} a 30 30 0 0 1 44 0`} opacity=".5" />
    </g>
  ) : (
    <g className="dg-io">
      <path d={`M${cx - 18} ${cy - 8} h10 l12 -12 v40 l-12 -12 h-10 z`} transform={`translate(0 -8)`} />
      <path d={`M${cx + 10} ${cy - 14} q10 14 0 28 M${cx + 18} ${cy - 22} q16 22 0 44`} />
    </g>
  )

function ChainSvg({ dir, className }) {
  const reduced = useReducedMotion()
  const { W, H, nodes, row } = layout(dir)
  const c = row ? 100 : 180
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  const pathD = row
    ? `M${first.a + first.s / 2} ${c} H${last.a + last.s / 2}`
    : `M${c} ${first.a + first.s / 2} V${last.a + last.s / 2}`
  return (
    <svg className={`dg chain ${className}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`ch-${dir}`}>
      <title id={`ch-${dir}`}>
        Signal chain: waves from the air, tuned circuit, gain (later), detector, gain (later), sound. M1 builds the tuned circuit
        and the detector.
      </title>
      <path className="chain-wire" d={pathD} />
      {!reduced &&
        [0, 1.1, 2.2].map((d) => (
          <circle key={d} className="chain-pulse" r="5">
            <animateMotion dur="3.3s" begin={`${d}s`} repeatCount="indefinite" path={pathD} />
          </circle>
        ))}
      {nodes.map((n) => {
        const w = row ? n.s : n.kind === 'm1' ? 240 : n.kind === 'later' ? 180 : 150
        const h = row ? (n.kind === 'm1' ? 92 : n.kind === 'later' ? 70 : 92) : n.s
        const x = row ? n.a : c - w / 2
        const y = row ? c - h / 2 : n.a
        const cx = x + w / 2
        const cy = y + h / 2
        if (n.kind === 'io')
          return (
            <g key={n.key}>
              <IoIcon k={n.key} cx={cx} cy={row ? cy - 6 : cy} />
              <text className="chain-sub" x={row ? cx : cx + 50} y={row ? cy + 46 : cy - 4} textAnchor={row ? 'middle' : 'start'}>
                {n.title}
              </text>
              <text className="chain-sub" x={row ? cx : cx + 50} y={row ? cy + 62 : cy + 12} textAnchor={row ? 'middle' : 'start'}>
                {n.sub}
              </text>
            </g>
          )
        return (
          <g key={n.key} className={`chain-node is-${n.kind}`}>
            <rect x={x} y={y} width={w} height={h} rx="10" />
            <text className="chain-title" x={cx} y={cy - 2} textAnchor="middle">
              {n.title}
            </text>
            <text className="chain-sub" x={cx} y={cy + 20} textAnchor="middle">
              {n.sub}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export const SignalChain = () => (
  <>
    <ChainSvg dir="row" className="only-wide" />
    <ChainSvg dir="col" className="only-narrow" />
  </>
)

/* ------------------------------------------------------------------ */
/* Tiny symbols for the two jobs                                       */
/* ------------------------------------------------------------------ */

export const MiniTank = () => (
  <svg className="mini" viewBox="0 0 140 90" aria-hidden="true">
    <path className="m-w" d="M20 12 H120 M20 78 H120" />
    <path className="m-p" d="M40 12 V22 c14 0 14 11 0 11 c14 0 14 11 0 11 c14 0 14 11 0 11 c14 0 14 11 0 11 V78" />
    <path className="m-w" d="M100 12 V38 M100 52 V78" />
    <path className="m-p" d="M86 38 H114 M86 52 H114" />
    <path className="m-p" d="M82 64 L118 26 M110 26 H118 V34" />
  </svg>
)

export const MiniDetector = () => (
  <svg className="mini" viewBox="0 0 140 90" aria-hidden="true">
    <path className="m-w" d="M6 22 H44 M66 22 H120 M10 78 H120" />
    <path className="m-p m-fill" d="M44 10 V34 L66 22 Z" />
    <path className="m-p" d="M66 10 V34" />
    <path className="m-w" d="M88 22 V36 M88 64 V78 M116 22 V44 M116 56 V78" />
    <rect className="m-p" x="81" y="36" width="14" height="28" />
    <path className="m-p" d="M104 44 H128 M104 56 H128" />
  </svg>
)

/* ------------------------------------------------------------------ */
/* Interactive schematic                                               */
/* ------------------------------------------------------------------ */

const coilPath = (x, y0, humps, len, dir) => {
  const step = len / humps
  let d = `M${x} ${y0}`
  for (let i = 0; i < humps; i++) d += ` c ${dir * 22} 0 ${dir * 22} ${step} 0 ${step}`
  return d
}

export const schematicParts = [
  { id: 'gen', name: 'Generator', text: 'GW Instek function generator. It drives the test loop with a clean sine up to 2 MHz.' },
  { id: 'loop', name: '5-turn test loop', text: 'Wound on the same pipe. It passes the signal to the coil by magnetic coupling, so the generator never touches the tank.' },
  { id: 'coil', name: '75-turn coil', text: 'The L of the tank. Wheeler predicts about 291 µH.' },
  { id: 'cap', name: 'Tuning capacitor', text: 'The C of the tank. Turning it moves the resonance. Ours really covers about 100 to 280 pF.' },
  { id: 'tp1', name: 'TP1', text: 'Top of the tank. The scope reads the tuned signal here, with a ×10 probe.' },
  { id: 'diode', name: '1N60P diode', text: 'Germanium diode, band toward TP3. It only lets the positive peaks through.' },
  { id: 'tp3', name: 'TP3', text: 'Detector output. The multimeter reads its DC level here.' },
  { id: 'rc', name: '15 kΩ ∥ 3.3 nF', text: 'The capacitor holds each peak and the resistor lets it drain. RC ≈ 50 µs.' },
]

export function Schematic({ active, onPick }) {
  const g = (id, children, hit) => (
    <g
      className={`sp${active === id ? ' is-on' : ''}${active && active !== id ? ' is-dim' : ''}`}
      onMouseEnter={() => onPick(id)}
      onClick={() => onPick(id)}
    >
      <rect className="sp-hit" {...hit} />
      {children}
    </g>
  )
  return (
    <svg className="dg schem" viewBox="0 0 960 400" role="img" aria-labelledby="sc-t">
      <title id="sc-t">
        Schematic: a generator drives a 5-turn test loop coupled to a 75-turn coil with a 20 to 280 pF capacitor across it (TP1).
        A 1N60P diode, band toward TP3, feeds TP3, where 15 kΩ and 3.3 nF sit in parallel to ground.
      </title>
      <line className="sc-w" x1="50" y1="340" x2="900" y2="340" />
      <g className="sc-gnd">
        <line x1="470" y1="340" x2="470" y2="352" />
        <line x1="450" y1="352" x2="490" y2="352" />
        <line x1="458" y1="360" x2="482" y2="360" />
        <line x1="465" y1="368" x2="475" y2="368" />
      </g>
      <path className="sc-w" d="M64 200 V140 H174 M64 260 V340 M174 260 V340 M334 260 V340 M334 100 H700 M470 100 V195 M470 213 V340" />
      <path className="sc-w" d="M600 100 H860 M740 100 V168 M740 244 V340 M860 100 V200 M860 218 V340" />

      {g(
        'gen',
        <>
          <circle className="sc-p" cx="64" cy="230" r="30" />
          <path className="sc-p" d="M48 230 q8 -16 16 0 t16 0" />
          <text className="sc-lbl" x="64" y="290" textAnchor="middle">
            Generator
          </text>
        </>,
        { x: 20, y: 190, width: 90, height: 110 },
      )}
      {g(
        'loop',
        <>
          <path className="sc-p" d={coilPath(174, 140, 4, 120, 1)} />
          <text className="sc-lbl" x="174" y="122" textAnchor="middle">
            5-turn loop
          </text>
        </>,
        { x: 140, y: 100, width: 70, height: 170 },
      )}
      <g className="sc-couple">
        <path d="M222 190 H292" />
        <path d="M232 182 L222 190 L232 198 M282 182 L292 190 L282 198" />
        <text x="257" y="174" textAnchor="middle">
          a few cm
        </text>
      </g>
      {g(
        'coil',
        <>
          <path className="sc-p" d={coilPath(334, 100, 8, 160, -1)} />
          <text className="sc-lbl" x="320" y="80" textAnchor="end">
            75 turns
          </text>
          <text className="sc-note" x="318" y="300" textAnchor="end">
            ≈ 291 µH
          </text>
        </>,
        { x: 290, y: 70, width: 60, height: 240 },
      )}
      {g(
        'cap',
        <>
          <path className="sc-p" d="M450 195 H490 M450 213 H490 M440 232 L500 176 M488 174 L500 176 L497 188" />
          <text className="sc-lbl" x="512" y="200">
            20–280 pF
          </text>
          <text className="sc-note" x="512" y="222">
            real: ~100–280
          </text>
        </>,
        { x: 430, y: 160, width: 170, height: 80 },
      )}
      {g(
        'tp1',
        <>
          <circle className="sc-tp" cx="400" cy="100" r="8" />
          <text className="sc-tpl" x="400" y="78" textAnchor="middle">
            TP1
          </text>
        </>,
        { x: 370, y: 60, width: 60, height: 56 },
      )}
      {g(
        'diode',
        <>
          <path className="sc-p sc-fill" d="M560 78 V122 L600 100 Z" />
          <path className="sc-p" d="M600 78 V122" />
          <text className="sc-lbl" x="580" y="62" textAnchor="middle">
            1N60P
          </text>
          <text className="sc-note" x="580" y="146" textAnchor="middle">
            band → TP3
          </text>
        </>,
        { x: 540, y: 44, width: 80, height: 110 },
      )}
      {g(
        'tp3',
        <>
          <circle className="sc-tp" cx="672" cy="100" r="8" />
          <text className="sc-tpl" x="672" y="78" textAnchor="middle">
            TP3
          </text>
        </>,
        { x: 642, y: 60, width: 60, height: 56 },
      )}
      {g(
        'rc',
        <>
          <rect className="sc-p" x="728" y="168" width="24" height="76" />
          <path className="sc-p" d="M840 200 H880 M840 218 H880" />
          <text className="sc-lbl" x="716" y="214" textAnchor="end">
            15 kΩ
          </text>
          <text className="sc-lbl" x="896" y="214">
            3.3 nF
          </text>
        </>,
        { x: 680, y: 150, width: 270, height: 110 },
      )}
      <circle className="sc-dot" cx="470" cy="100" r="4.5" />
      <circle className="sc-dot" cx="740" cy="100" r="4.5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Detector: carrier and envelope                                      */
/* ------------------------------------------------------------------ */

export function Envelope() {
  const W = 600
  const mid = 96
  const env = (x) => (1 + 0.55 * Math.sin((2 * Math.PI * x) / 300)) / 1.55
  let carrier = ''
  let top = ''
  for (let x = 0; x <= W; x++) carrier += `${x ? 'L' : 'M'}${x} ${(mid - 76 * env(x) * Math.sin((2 * Math.PI * x) / 9)).toFixed(1)} `
  for (let x = 0; x <= W; x += 4) top += `${x ? 'L' : 'M'}${x} ${(mid - 76 * env(x)).toFixed(1)} `
  return (
    <svg className="dg env" viewBox={`0 0 ${W} 196`} role="img" aria-labelledby="env-t">
      <title id="env-t">A fast carrier whose height rises and falls; the detector output traces only the tops.</title>
      <line className="env-axis" x1="0" y1={mid} x2={W} y2={mid} />
      <path className="env-carrier" d={carrier} />
      <path className="env-peak" d={top} />
      <text className="env-lbl" x="4" y="190">
        carrier · too fast for RC
      </text>
      <text className="env-lbl is-hot" x={W - 4} y="14" textAnchor="end">
        TP3 · follows the peaks
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Resonance curve                                                     */
/* ------------------------------------------------------------------ */

export function ResonanceCurve({ f0, Q, fLow, fHigh, span = 0.38, neighbours, id = 'rc' }) {
  const W = 560
  const H = 250
  const m = { l: 40, r: 16, t: 20, b: 40 }
  const iw = W - m.l - m.r
  const ih = H - m.t - m.b
  const fmin = f0 * (1 - span)
  const fmax = f0 * (1 + span)
  const X = (f) => m.l + ((f - fmin) / (fmax - fmin)) * iw
  const Y = (a) => m.t + ih - a * ih
  const resp = (f) => 1 / Math.sqrt(1 + Q * Q * Math.pow(f / f0 - f0 / f, 2))
  let d = ''
  for (let i = 0; i <= 240; i++) {
    const f = fmin + ((fmax - fmin) * i) / 240
    d += `${i ? 'L' : 'M'}${X(f).toFixed(1)} ${Y(resp(f)).toFixed(1)} `
  }
  const fill = `${d} L${X(fmax)} ${Y(0)} L${X(fmin)} ${Y(0)} Z`
  return (
    <svg className="dg rcurve" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>
        Resonance curve around {Math.round(f0)} kHz with Q = {Q.toFixed(1)}. The 0.7 line crosses it at the edges of the
        bandwidth.
      </title>
      {[0.25, 0.5, 0.75, 1].map((a) => (
        <line key={a} className="rc-grid" x1={m.l} x2={W - m.r} y1={Y(a)} y2={Y(a)} />
      ))}
      <path className="rc-fill" d={fill} />
      <path className="rc-line" d={d} />
      <line className="rc-07" x1={m.l} x2={W - m.r} y1={Y(0.707)} y2={Y(0.707)} />
      <text className="rc-tick" x={m.l - 6} y={Y(0.707) + 4} textAnchor="end">
        0.7
      </text>
      <text className="rc-tick" x={m.l - 6} y={Y(1) + 4} textAnchor="end">
        1
      </text>
      {fLow && fHigh && (
        <>
          <line className="rc-mark" x1={X(fLow)} x2={X(fLow)} y1={Y(0.707)} y2={Y(0)} />
          <line className="rc-mark" x1={X(fHigh)} x2={X(fHigh)} y1={Y(0.707)} y2={Y(0)} />
          <text className="rc-tick" x={X(fLow)} y={H - 22} textAnchor="end">
            {fLow}
          </text>
          <text className="rc-tick" x={X(fHigh)} y={H - 22}>
            {fHigh}
          </text>
          <path className="rc-bw" d={`M${X(fLow)} ${Y(0.707) - 10} H${X(fHigh)}`} />
        </>
      )}
      {neighbours?.map((f) => (
        <g key={f}>
          <line className="rc-station" x1={X(f)} x2={X(f)} y1={Y(0)} y2={Y(resp(f))} />
          <rect className="rc-station-dot" x={X(f) - 4} y={Y(resp(f)) - 4} width="8" height="8" />
        </g>
      ))}
      <line className="rc-f0" x1={X(f0)} x2={X(f0)} y1={Y(1)} y2={Y(0)} />
      <text className="rc-f0-l" x={X(f0)} y={H - 6} textAnchor="middle">
        f₀ {Math.round(f0)} kHz
      </text>
      <line className="rc-axis" x1={m.l} x2={W - m.r} y1={Y(0)} y2={Y(0)} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Milestone wave (three steps on a curve)                             */
/* ------------------------------------------------------------------ */

export function MilestoneWave({ items }) {
  return (
    <div className="mwave">
      <svg className="mwave-line only-wide" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 150 C 80 150 100 170 166.7 170 C 300 170 360 60 500 60 C 640 60 700 170 833.3 170 C 900 170 920 150 1000 150" />
      </svg>
      <ol className="mwave-items">
        {items.map((m, i) => (
          <li key={m.id} className={`mw${m.active ? ' is-active' : ''}`} style={{ '--i': i }}>
            <span className="mw-ghost" aria-hidden="true">
              {i + 1}
            </span>
            <span className="mw-node" aria-hidden="true">
              {m.active ? (
                <svg viewBox="0 0 24 24">
                  <path d="M3 13 q3 -8 6 0 t6 0 t6 0" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                </svg>
              )}
            </span>
            <h4>
              <span className="mw-id">{m.id}</span> {m.title}
            </h4>
            <p>{m.text}</p>
            {!m.active && <span className="mw-soon">Coming soon</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* PCB traces (decoration in hero and footer)                          */
/* ------------------------------------------------------------------ */

export function Traces({ lines = 7, gap = 14, width = 700, height = 320, jog = 80, className = '' }) {
  const items = []
  for (let i = 0; i < lines; i++) {
    const y = 40 + i * gap
    const bx = 300 - y
    const endX = width - 30 - ((i * 47) % 140)
    items.push(
      <g key={i}>
        <path d={`M0 ${y} H${bx} L${bx + jog} ${y + jog} H${endX}`} />
        <circle cx={endX + 6} cy={y + jog} r="5" />
      </g>,
    )
  }
  return (
    <svg className={`traces ${className}`} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" preserveAspectRatio="xMinYMid slice">
      {items}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* ESP32 DAC: 4 samples per carrier cycle                              */
/* ------------------------------------------------------------------ */

export function Staircase() {
  const W = 420
  const H = 160
  const mid = 80
  const A = 58
  const cycles = 3
  const per = W / cycles
  let sine = ''
  for (let x = 0; x <= W; x++) sine += `${x ? 'L' : 'M'}${x} ${(mid - A * Math.sin((2 * Math.PI * x) / per + 0.6)).toFixed(1)} `
  let stair = ''
  const n = cycles * 4
  for (let k = 0; k < n; k++) {
    const x0 = (k * per) / 4
    const v = Math.round(127 * Math.sin((2 * Math.PI * k) / 4 + 0.6)) / 127
    const y = (mid - A * v).toFixed(1)
    stair += `${k ? 'L' : 'M'}${x0} ${y} H${x0 + per / 4} `
  }
  return (
    <svg className="dg stair" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="st-t">
      <title id="st-t">A smooth 850 kHz sine compared with what the ESP32 DAC produced: a blocky staircase with only four steps per cycle.</title>
      <line className="env-axis" x1="0" x2={W} y1={mid} y2={mid} />
      <path className="st-sine" d={sine} />
      <path className="st-stair" d={stair} />
      {Array.from({ length: n }, (_, k) => (
        <circle key={k} className="st-dot" cx={(k * per) / 4} cy={mid - A * Math.sin((2 * Math.PI * k) / 4 + 0.6)} r="3.2" />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Generator levels: asked for vs. used                                */
/* ------------------------------------------------------------------ */

export function Levels({ asked, used, floor }) {
  const W = 420
  const H = 150
  const x = (v) => 24 + (v / 1.2) * (W - 48)
  return (
    <svg className="dg levels" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="lv-t">
      <title id="lv-t">
        The levels the experiment asks for (0.05 to 1 V) compared with the six levels we used (0.1587 to 1.135 V). The generator
        cannot go below 0.1587 V.
      </title>
      <rect className="lv-zone" x={x(0)} y="18" width={x(floor) - x(0)} height="104" />
      <text className="lv-zone-t" x={x(floor) + 6} y="14">
        ← below the knob’s minimum, {floor} V
      </text>
      <line className="lv-axis" x1={x(0)} x2={x(1.2)} y1="70" y2="70" />
      {[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2].map((v) => (
        <g key={v}>
          <line className="lv-axis" x1={x(v)} x2={x(v)} y1="66" y2="74" />
          <text className="lv-tick" x={x(v)} y="146" textAnchor="middle">
            {v}
          </text>
        </g>
      ))}
      <text className="lv-row" x={x(0)} y="36">
        asked
      </text>
      {asked.map((v) => (
        <rect key={v} className="lv-asked" x={x(v) - 5} y="44" width="10" height="10" />
      ))}
      <text className="lv-row" x={x(0)} y="118">
        used
      </text>
      {used.map((v) => (
        <rect key={v} className="lv-used" x={x(v) - 5} y="86" width="10" height="10" />
      ))}
      <text className="lv-tick" x={W - 6} y="132" textAnchor="end">
        V
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Dimensioned drawing of the coil on its pipe                         */
/* ------------------------------------------------------------------ */

export function CoilDrawing() {
  return (
    <svg className="dg coild" viewBox="0 0 480 214" role="img" aria-labelledby="cd-t">
      <title id="cd-t">Side view of the coil: a 50 mm pipe with 75 turns wound over about 25 mm.</title>
      <defs>
        <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="5" className="cd-hatch" />
        </pattern>
      </defs>
      <rect className="cd-pipe" x="40" y="50" width="300" height="110" />
      <rect className="cd-coil" x="150" y="44" width="80" height="122" fill="url(#hatch)" />
      <line className="cd-center" x1="20" x2="360" y1="105" y2="105" />
      {/* d */}
      <path className="cd-dim" d="M380 50 V160 M372 50 H388 M372 160 H388" />
      <text className="cd-t" x="396" y="110">
        d = 50
      </text>
      {/* l */}
      <path className="cd-dim" d="M150 186 H230 M150 178 V194 M230 178 V194" />
      <text className="cd-t" x="190" y="206" textAnchor="middle">
        l ≈ 25
      </text>
      <text className="cd-t is-hot" x="190" y="32" textAnchor="middle">
        n = 75 turns
      </text>
      <text className="cd-u" x="40" y="206">
        mm
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Finding the AM section with a meter                                 */
/* ------------------------------------------------------------------ */

export function CapLegs() {
  const [step, setStep] = useState(0)
  const steps = [
    { leg: 'body', text: 'Ohms from the metal body to each leg. 0 Ω means that leg is the rotor.', read: '0 Ω' },
    { leg: 'C', text: 'Capacitance from the rotor to each other leg, turning the shaft end to end.', read: '0.10–0.28 nF' },
    { leg: 'C', text: 'Keep the leg whose range fits the AM section. That pair is the tuning capacitor.', read: 'AM ✓' },
  ]
  const s = steps[step]
  const legs = ['A', 'B', 'C', 'D']
  return (
    <div className="caplegs">
      <svg className="dg" viewBox="0 0 300 170" role="img" aria-label={`Step ${step + 1}: ${s.text}`}>
        <rect className="cl-body" x="40" y="20" width="160" height="90" rx="6" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} className="cl-plate" d={`M70 ${44 + i * 14} a 50 9 0 0 1 100 0`} />
        ))}
        {legs.map((l, i) => {
          const x = 62 + i * 38
          const on = (step === 0 && l === 'B') || (step > 0 && (l === 'B' || l === 'C'))
          return (
            <g key={l}>
              <line className={`cl-leg${on ? ' is-on' : ''}`} x1={x} x2={x} y1="110" y2="146" />
              <text className="cl-t" x={x} y="162" textAnchor="middle">
                {l === 'B' && step > 0 ? 'rotor' : l}
              </text>
            </g>
          )
        })}
        <rect className="cl-meter" x="222" y="30" width="70" height="40" rx="4" />
        <text className="cl-read" x="257" y="56" textAnchor="middle">
          {s.read}
        </text>
        <path className="cl-probe" d={step === 0 ? 'M222 60 C 200 70 200 30 200 30' : 'M222 60 C 190 80 138 130 138 146'} />
        <path className="cl-probe" d="M240 70 C 240 140 100 150 100 146" />
      </svg>
      <div className="cl-ctrl">
        <ol>
          {steps.map((t, i) => (
            <li key={i}>
              <button type="button" aria-pressed={step === i} onClick={() => setStep(i)}>
                <span className="cl-n">{i + 1}</span>
                {t.text}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
