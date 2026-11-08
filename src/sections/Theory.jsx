import { useState } from 'react'
import { Details, Figure, Frac, SectionHead, Sqrt } from '../components/ui'
import { CoilDrawing, Envelope, ResonanceCurve, Schematic, schematicParts } from '../components/svg/Diagrams'
import { Tuner } from '../components/Interactive'
import { band, qFactor } from '../data/measurements'
import { predictions } from '../lib/physics'

export function Theory() {
  const [part, setPart] = useState('tp1')
  const info = schematicParts.find((p) => p.id === part)
  const q = qFactor()
  return (
    <section className="band band-ink" id="theory" aria-labelledby="theory-h">
      <div className="wrap">
        <SectionHead
          id="theory-h"
          n="03"
          label="Theory"
          title="The theory in one minute"
          sub="Four ideas, all on this page."
          intro={<p>Resonance picks the station, Wheeler sizes the coil, an RC follows the peaks, and Q says how sharp it all is.</p>}
        />

        {/* 1 · resonance, with the live tuner */}
        <div className="theory-a">
          <div className="t-text">
            <p className="t-n">
              <span>A</span> Resonance
            </p>
            <p>A coil (L) and a capacitor (C) trade energy back and forth. They respond most strongly at one frequency:</p>
            <p className="eq-big" aria-label="f zero equals one over two pi root L C">
              f<sub>0</sub> = <Frac n="1" d={<>2π<Sqrt>LC</Sqrt></>} />
            </p>
            <p>Turn the capacitor and C changes, so the radio tunes to a different frequency. Try it.</p>
            <Details summary="Where the formula comes from">
              <p>
                The coil resists a changing current by X<sub>L</sub> = 2πfL, the capacitor by X<sub>C</sub> = 1/(2πfC). At resonance the
                two are equal: 2πfL = 1/(2πfC). Solve for f and you get f<sub>0</sub>.
              </p>
            </Details>
          </div>
          <Tuner />
        </div>

        <div className="theory-grid">
          {/* 2 · the coil */}
          <article className="t-card">
            <p className="t-n">
              <span>B</span> The coil
            </p>
            <p>For a single-layer coil, Wheeler’s formula gives its inductance in µH:</p>
            <p className="eq-mid">
              L ≈ <Frac n="d²n²" d="457d + 1016l" />
            </p>
            <CoilDrawing />
            <p className="t-small">
              d = 50 mm (pipe diameter), n = 75 turns, l ≈ 25 mm (coil length). That gives{' '}
              <b className="mono">L ≈ {Math.round(predictions.L * 1e6)} µH</b>.
            </p>
          </article>

          {/* 4 · Q */}
          <article className="t-card">
            <p className="t-n">
              <span>D</span> Quality factor
            </p>
            <p>Q tells us how sharp the tuning is:</p>
            <p className="eq-mid">
              Q = <Frac n={<>f<sub>0</sub></>} d={<>f<sub>high</sub> − f<sub>low</sub></>} />
            </p>
            <ResonanceCurve id="theory-q" f0={band.f0Half} Q={q} fLow={band.fLow} fHigh={band.fHigh} span={0.3} />
            <p className="t-small">
              f<sub>low</sub> and f<sub>high</sub> are the frequencies where the signal falls to 0.7 of its peak. This is our measured
              tank: 960 and 1201 kHz around 1072 kHz.
            </p>
          </article>
        </div>

        {/* 3 · detector */}
        <div className="theory-c">
          <div className="t-text">
            <p className="t-n">
              <span>C</span> The detector
            </p>
            <p>
              The diode lets current through in one direction only. The capacitor holds the peak voltage and the resistor lets it
              drain slowly.
            </p>
            <p className="eq-mid">RC = 15 kΩ × 3.3 nF ≈ 50 µs</p>
            <p>
              The output follows the peaks of the wave but ignores the fast carrier. For a steady sine the output is a steady DC level.
              For an AM station it is the sound itself.
            </p>
            <Details summary="Why 50 µs is the right size">
              <p>
                A carrier near 1 MHz repeats every 1 µs, so the capacitor barely sags between peaks. Speech changes over hundreds of
                microseconds, so 50 µs is short enough to follow it: 2 µs ≪ 50 µs ≪ 200 µs (a 5 kHz tone).
              </p>
            </Details>
          </div>
          <div className="scope">
            <div className="scope-bar">
              <span>CH1 · TP1</span>
              <span className="hot">CH2 · TP3</span>
            </div>
            <Envelope />
          </div>
        </div>

        {/* schematic */}
        <div className="schem-block">
          <div className="schem-head">
            <h3>Our circuit</h3>
            <p className="muted-d">Point at a part, or pick one from the list.</p>
          </div>
          <div className="schem-grid">
            <Figure
              n={4}
              ratio="12/5"
              className="schem-fig"
              alt="Our redrawn schematic: generator, 5-turn test loop, 75-turn coil with variable capacitor (TP1), 1N60P, then 15 kΩ in parallel with 3.3 nF (TP3)."
              caption="Generator → 5-turn test loop → 75-turn coil + variable capacitor (TP1) → 1N60P → 15 kΩ ∥ 3.3 nF (TP3)."
              fallback={
                <div className="schem-scroll" tabIndex={0} role="region" aria-label="Schematic, scrolls sideways on small screens">
                  <Schematic active={part} onPick={setPart} />
                </div>
              }
            />
            <aside className="schem-info" aria-live="polite">
              <ul className="schem-list">
                {schematicParts.map((p) => (
                  <li key={p.id}>
                    <button type="button" aria-pressed={part === p.id} onClick={() => setPart(p.id)}>
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="schem-text">
                <p className="schem-name">{info.name}</p>
                <p>{info.text}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
