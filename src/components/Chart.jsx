import { have } from '../data/measurements'

const niceMax = (v) => {
  if (!(v > 0)) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const m = v / p
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p
}

/** Inline-SVG line chart on a scope-style screen. x is linear in the generator setting. */
export function Chart({ title, unit, rows, xMax = 1.2 }) {
  const W = 360
  const H = 250
  const m = { l: 46, r: 14, t: 14, b: 40 }
  const iw = W - m.l - m.r
  const ih = H - m.t - m.b
  const pts = rows.filter((r) => have(r.y))
  const top = niceMax(Math.max(0, ...pts.map((p) => p.y)))
  const X = (v) => m.l + (v / xMax) * iw
  const Y = (v) => m.t + ih - (v / top) * ih
  const empty = pts.length === 0
  return (
    <figure className="chart">
      <figcaption>{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}. ${empty ? 'Readings not entered yet.' : pts.map((p) => `${p.x} V gives ${p.y} ${unit}`).join('; ')}`}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line className="ch-grid" x1={m.l} x2={W - m.r} y1={m.t + ih - f * ih} y2={m.t + ih - f * ih} />
            {!empty && (
              <text className="ch-tick" x={m.l - 8} y={m.t + ih - f * ih + 4} textAnchor="end">
                {Number((f * top).toPrecision(3))}
              </text>
            )}
          </g>
        ))}
        {[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2].map((v) => (
          <g key={v}>
            <line className="ch-grid" x1={X(v)} x2={X(v)} y1={m.t} y2={m.t + ih} />
            <text className="ch-tick" x={X(v)} y={m.t + ih + 16} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        {rows.map((r) => (
          <line key={r.x} className="ch-set" x1={X(r.x)} x2={X(r.x)} y1={m.t + ih} y2={m.t + ih - 6} />
        ))}
        {!empty && (
          <>
            <polyline className="ch-line" points={pts.map((p) => `${X(p.x)},${Y(p.y)}`).join(' ')} />
            {pts.map((p) => (
              <rect key={p.x} className="ch-dot" x={X(p.x) - 4} y={Y(p.y) - 4} width="8" height="8" />
            ))}
          </>
        )}
        {empty && (
          <text className="ch-empty" x={m.l + iw / 2} y={m.t + ih / 2} textAnchor="middle">
            waiting for readings
          </text>
        )}
        <text className="ch-unit" x={m.l} y={H - 4}>
          generator setting (V)
        </text>
        <text className="ch-unit" x={W - m.r} y={H - 4} textAnchor="end">
          {unit}
        </text>
      </svg>
    </figure>
  )
}
