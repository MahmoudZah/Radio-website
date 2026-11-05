import { Details, SectionHead } from '../components/ui'
import { predictions as p, fmt } from '../lib/physics'

export function Predictions() {
  const Lu = (p.L * 1e6).toFixed(2)
  const cells = [
    { k: 'L', v: fmt.uH(p.L), note: 'Wheeler' },
    { k: 'C for 819 kHz', v: fmt.pF(p.cFor819), note: 'solve f₀ for C' },
    { k: 'f at 280 pF', v: fmt.kHz(p.fAtMaxC), note: 'bottom of the band' },
    { k: 'f at 20 pF', v: fmt.MHz(p.fAtMinC), note: 'top of the band' },
    { k: 'RC', v: fmt.us(p.rc), note: '15 kΩ × 3.3 nF' },
  ]
  return (
    <section className="band band-paper" id="predictions" aria-labelledby="pred-h">
      <div className="wrap">
        <SectionHead
          id="pred-h"
          n="04"
          label="Predictions"
          title="Predictions"
          sub="Before we measured anything."
          intro={<p>We wrote these down first, so the measurements could prove us right or wrong. Section 07 checks them.</p>}
        />
        <div className="readout-strip" role="table" aria-label="Table 4: predictions">
          <p className="rs-cap" role="caption">
            Table 4 · Predictions
          </p>
          <div className="rs-cells" role="row">
            {cells.map((c) => (
              <div key={c.k} className="rs-cell" role="cell">
                <span className="rs-k">{c.k}</span>
                <span className="rs-v">{c.v}</span>
                <span className="rs-note">{c.note}</span>
              </div>
            ))}
          </div>
        </div>

        <Details summary="Show the calculations">
          <ol className="calc">
            <li>
              <b>Inductance.</b> L = d²n² / (457d + 1016l) = (50² × 75²) / (457 × 50 + 1016 × 25) = 14 062 500 / 48 250 ={' '}
              <span className="mono">{Lu} µH</span> ≈ 291 µH
            </li>
            <li>
              <b>C for 819 kHz.</b> C = 1 / ((2πf)² L) = 1 / ((2π × 819 000)² × {Lu} × 10⁻⁶) ={' '}
              <span className="mono">{(p.cFor819 * 1e12).toFixed(1)} pF</span> ≈ 130 pF
            </li>
            <li>
              <b>f at 280 pF.</b> f = 1 / (2π √({Lu} × 10⁻⁶ × 280 × 10⁻¹²)) = <span className="mono">{(p.fAtMaxC / 1e3).toFixed(1)} kHz</span>
            </li>
            <li>
              <b>f at 20 pF.</b> f = 1 / (2π √({Lu} × 10⁻⁶ × 20 × 10⁻¹²)) = <span className="mono">{(p.fAtMinC / 1e6).toFixed(3)} MHz</span> ≈
              2.08 MHz
            </li>
            <li>
              <b>Detector.</b> RC = 15 000 Ω × 3.3 × 10⁻⁹ F = <span className="mono">{(p.rc * 1e6).toFixed(1)} µs</span>
            </li>
          </ol>
        </Details>
      </div>
    </section>
  )
}
