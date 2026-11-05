import { Figure, SectionHead, Val } from '../components/ui'
import { Chart } from '../components/Chart'
import { QPlay } from '../components/Interactive'
import { ResonanceCurve } from '../components/svg/Diagrams'
import { band, detector, qFactor } from '../data/measurements'

export function Measure() {
  const q = qFactor()
  return (
    <section className="band band-ink" id="measure" aria-labelledby="measure-h">
      <div className="wrap">
        <SectionHead
          id="measure-h"
          n="06"
          label="Measure"
          title="Measure it"
          sub="What the scope actually said."
          intro={
            <p>
              The generator drives the test loop, a few centimetres from the coil on the same axis. We read TP1 on the scope and TP3’s
              DC with a multimeter.
            </p>
          }
        />

        <div className="setup">
          <div className="setup-note">
            <h3>Setup</h3>
            <p>
              We compensated the probe and set both probe and channel to ×10, because a ×1 probe adds about 100 pF and would detune the
              tank.
            </p>
            <dl className="spec">
              <div>
                <dt>Source</dt>
                <dd>GW Instek, into the 5-turn loop</dd>
              </div>
              <div>
                <dt>TP1</dt>
                <dd>OWON SDS1102, ×10 probe</dd>
              </div>
              <div>
                <dt>TP3</dt>
                <dd>multimeter, DC volts</dd>
              </div>
            </dl>
          </div>
          <Figure n={11} ratio="4/3" alt="The GW Instek generator with its display at 834.0 kHz." desc="Generator, display at 834.0 kHz" caption="The GW Instek generator, display at 834.0 kHz." />
          <Figure n={12} ratio="4/3" alt="The scope setup with the probe on TP1." desc="The scope setup" caption="The scope setup." />
        </div>

        {/* 6.1 */}
        <article className="mrow">
          <p className="mrow-n">6.1</p>
          <div className="mrow-body">
            <h3>Resonance</h3>
            <p>
              At half travel of the capacitor, we swept the generator until TP1 peaked: f₀. Then we turned the capacitor to each end and
              found the peak again, which gave the two ends of the band.
            </p>
            <div className="big-reads">
              <div>
                <span>f₀ at half travel</span>
                <b>
                  <Val v={band.f0Half} unit="kHz" />
                </b>
              </div>
              <div>
                <span>band low end</span>
                <b>
                  <Val v={band.lowEnd} digits={1} unit="kHz" />
                </b>
              </div>
              <div>
                <span>band high end</span>
                <b>
                  <Val v={band.highEnd} digits={1} unit="kHz" />
                </b>
              </div>
            </div>
          </div>
          <Figure n={13} ratio="16/10" alt="Scope screenshot of TP1 at resonance." desc="Scope screenshot of TP1 at resonance" caption="TP1 at resonance." className="mrow-fig" />
        </article>

        {/* 6.2 */}
        <article className="mrow">
          <p className="mrow-n">6.2</p>
          <div className="mrow-body">
            <h3>Bandwidth and Q</h3>
            <p>At f₀ we found the frequencies where TP1 fell to 0.7 of its peak.</p>
            <div className="table-wrap">
              <table className="readout">
                <caption>Table 5 · The tank at TP1</caption>
                <thead>
                  <tr>
                    <th scope="col">Band low end</th>
                    <th scope="col">Band high end</th>
                    <th scope="col">f₀ at half travel</th>
                    <th scope="col">f_low</th>
                    <th scope="col">f_high</th>
                    <th scope="col">Q</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-k="Band low end">
                      <Val v={band.lowEnd} digits={1} unit="kHz" />
                    </td>
                    <td data-k="Band high end">
                      <Val v={band.highEnd} digits={1} unit="kHz" />
                    </td>
                    <td data-k="f₀ at half travel">
                      <Val v={band.f0Half} unit="kHz" />
                    </td>
                    <td data-k="f_low">
                      <Val v={band.fLow} unit="kHz" />
                    </td>
                    <td data-k="f_high">
                      <Val v={band.fHigh} unit="kHz" />
                    </td>
                    <td data-k="Q" className="hot">
                      <Val v={q} digits={1} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="calc-line">
              Q = 491 / (530 − 460) = <b>{q?.toFixed(2)}</b>. That is a broad, gentle peak rather than a sharp one.
            </p>
          </div>
          <div className="mrow-fig scope">
            <div className="scope-bar">
              <span>TP1 · measured points</span>
              <span className="hot">Q {q?.toFixed(1)}</span>
            </div>
            <ResonanceCurve id="meas" f0={band.f0Half} Q={q} fLow={band.fLow} fHigh={band.fHigh} span={0.3} />
          </div>
        </article>

        <QPlay />

        {/* 6.3 */}
        <article className="mrow">
          <p className="mrow-n">6.3</p>
          <div className="mrow-body">
            <h3>The detector</h3>
            <p>At f₀ we recorded TP1’s peak and TP3’s DC at six generator settings.</p>
            <div className="table-wrap">
              <table className="readout readout-rows">
                <caption>Table 6 · The detector at f₀ = 491 kHz</caption>
                <thead>
                  <tr>
                    <th scope="col">Generator setting (V)</th>
                    <th scope="col" className="r">
                      TP1 peak
                    </th>
                    <th scope="col" className="r">
                      TP3 DC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detector.map((r) => (
                    <tr key={r.src}>
                      <th scope="row">{r.src}</th>
                      <td className="r">
                        <Val v={r.tp1} unit="mV" />
                      </td>
                      <td className="r">
                        <Val v={r.tp3} unit="mV" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Figure n={14} ratio="4/3" alt="TP3 DC level on the multimeter or scope." desc="TP3 DC on the multimeter or scope" caption="TP3 DC on the meter." className="mrow-fig" />
        </article>
        <div className="charts">
          <Chart title="TP3 DC vs generator setting" unit="mV" rows={detector.map((r) => ({ x: r.src, y: r.tp3 }))} />
          <Chart title="TP1 peak vs generator setting" unit="mV" rows={detector.map((r) => ({ x: r.src, y: r.tp1 }))} />
        </div>
      </div>
    </section>
  )
}
