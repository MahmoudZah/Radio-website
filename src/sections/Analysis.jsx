import { SectionHead } from '../components/ui'
import { BandCompare } from '../components/Interactive'
import { band } from '../data/measurements'
import { fmt, pctErr, predictions as p } from '../lib/physics'

const reasons = [
  {
    t: 'The capacitor’s real range',
    d: 'The prediction assumed 20 to 280 pF. Our meter showed the AM section really covers about 100 to 280 pF, which changes the predicted tuning range. The replacement generator measured 972.4 kHz to 1.126 MHz.',
  },
  {
    t: 'Extra capacitance',
    d: 'The breadboard, the wires, the diode and the probe all add picofarads in parallel with the tank. That pulls every frequency down.',
  },
  {
    t: 'The coil',
    d: 'Wheeler’s formula assumes perfectly tight, even turns and a coil exactly 25 mm long. Our real inductance is probably a bit different.',
  },
  {
    t: 'A broad peak',
    d: 'The reported Q is 4.51, so the peak is broad and the exact cutoff frequencies are harder to read.',
  },
]

export function Analysis() {
  const rows = [
    { q: 'Band’s low end (280 pF)', pred: p.fAtMaxC, meas: band.lowEnd * 1e3 },
    { q: 'Band’s high end, with 20 pF', pred: p.fAtMinC, meas: band.highEnd * 1e3 },
    { q: 'Band’s high end, with 100 pF (the real minimum)', pred: p.fAtRealMin, meas: band.highEnd * 1e3 },
  ]
  return (
    <section className="band band-paper" id="analysis" aria-labelledby="an-h">
      <div className="wrap">
        <SectionHead
          id="an-h"
          n="07"
          label="Analysis"
          title="Predicted vs measured"
          sub="A narrow measured band around 1.07 MHz."
          intro={<p>Percent error = 100 × (prediction − measured) / measured.</p>}
        />

        <div className="table-wrap is-dark">
          <table className="readout">
            <caption>Table 7 · Predictions against measurements</caption>
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col" className="r">
                  Prediction
                </th>
                <th scope="col" className="r">
                  Measured
                </th>
                <th scope="col" className="r">
                  Error
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                // error from the prediction as written in Table 4 (557 kHz, 2.08 MHz, ...)
                const shown = r.pred >= 1e6 ? Math.floor(r.pred / 1e4) * 1e4 : Math.floor(r.pred / 1e3) * 1e3
                const e = pctErr(shown, r.meas)
                return (
                  <tr key={r.q}>
                    <th scope="row">{r.q}</th>
                    <td className="r">{r.pred >= 1e6 ? fmt.MHz(r.pred) : fmt.kHz(r.pred)}</td>
                    <td className="r">{(r.meas / 1e3).toFixed(1)} kHz</td>
                    <td className="r hot">
                      {e > 0 ? '+' : ''}
                      {Math.round(e)} %
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <h3 className="h3-rule">The three bands on one dial</h3>
        <BandCompare
          rows={[
            { label: 'Predicted, 20–280 pF', from: p.fAtMaxC, to: p.fAtMinC, tone: 'pred' },
            { label: 'Predicted, 100–280 pF', from: p.fAtMaxC, to: p.fAtRealMin, tone: 'pred2' },
            { label: 'Measured', from: band.lowEnd * 1e3, to: band.highEnd * 1e3, tone: 'meas' },
          ]}
        />
        <p className="muted small">The pale strip in each row is the medium-wave broadcast band, 531–1602 kHz.</p>

        <h3 className="h3-rule">Why measured results differ from predictions</h3>
        <ol className="reasons">
          {reasons.map((r, i) => (
            <li key={r.t}>
              <span className="r-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4>{r.t}</h4>
              <p>{r.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
