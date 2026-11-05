import { Figure, SectionHead } from '../components/ui'
import { Levels, Staircase } from '../components/svg/Diagrams'
import { detector } from '../data/measurements'

const cases = [
  {
    title: 'No generator above 1 MHz',
    problem: 'The medium-wave band runs up to about 2 MHz, but the generators we found stopped at 1 MHz.',
    tried: 'We built our own source (challenge 2).',
    worked: 'Finding a better generator (challenge 3).',
    lesson: 'Check an instrument’s range against the highest frequency you need before planning the measurements.',
  },
  {
    title: 'The ESP32 idea',
    tried:
      'We programmed an ESP32 to make an AM signal on its built-in DAC (pin GPIO 26): a 2 kHz tone modulating an 850 kHz carrier, with 70 % modulation. We changed the carrier and sample rate through the serial monitor.',
    problem:
      'Noise. The scope showed the AM envelope clearly, but the waveform was dirty. At 3.4 MS/s, each 850 kHz carrier cycle is built from only 4 samples, and the DAC has only 8 bits, so the output is a rough staircase full of unwanted frequencies.',
    worked: 'Switching to a real function generator (challenge 3).',
    lesson: 'A clean RF sine needs many samples per cycle, and the ESP32 cannot give that at these frequencies.',
    visual: (
      <div className="case-visual">
        <Staircase />
        <p className="cv-cap">
          <span className="lg-sine">ideal 850 kHz sine</span>
          <span className="lg-stair">what 4 samples per cycle give</span>
        </p>
        <Figure n={15} optional ratio="16/9" alt="Scope photo of the AM signal from the ESP32." desc="Scope photo of the ESP32 AM signal" caption="The AM signal from the ESP32 on our scope." />
      </div>
    ),
  },
  {
    title: 'The right instrument',
    problem: 'We needed a clean source that covers the whole band.',
    tried: 'Looking for a generator with more range.',
    worked: 'A GW Instek function generator that goes up to 2 MHz, enough to cover the whole band. We used it instead of the ESP32 for all the measurements.',
    lesson: 'The ESP32 can still be useful later, for audio-frequency tests.',
  },
  {
    title: 'Finding the right capacitor legs',
    problem: 'There was no label telling us which terminals were the AM section.',
    tried: 'Measuring resistance to find the rotor, then capacitance on each leg.',
    worked: 'That solved it: the AM section read about 0.1 to 0.28 nF (see step 4).',
    lesson: 'When a part is unlabelled, the meter is the datasheet.',
  },
  {
    title: 'The generator would not go low enough',
    problem: 'The experiment asks for source levels of 0.05, 0.1, 0.2, 0.3, 0.5 and 1 V. Our generator’s output level knob would not go below 0.1587 V.',
    tried: 'Every other setting was within range.',
    worked: 'We used six evenly spaced levels from 0.1587 V to 1.135 V instead.',
    lesson: 'When an instrument limits the plan, keep the spirit of the test (six levels across the range) and say exactly what changed.',
    visual: (
      <div className="case-visual">
        <Levels asked={[0.05, 0.1, 0.2, 0.3, 0.5, 1]} used={detector.map((d) => d.src)} floor={0.1587} />
      </div>
    ),
  },
]

const fields = [
  ['problem', 'Problem'],
  ['tried', 'What we tried'],
  ['worked', 'What worked'],
  ['lesson', 'Lesson'],
]

export function Challenges() {
  return (
    <section className="band band-paper" id="challenges" aria-labelledby="ch-h">
      <div className="wrap">
        <SectionHead
          id="ch-h"
          n="08"
          label="Challenges"
          title="The journey and the challenges"
          sub="What went wrong, and what we did."
          intro={<p>Most of our time went into the source, not the circuit. These five problems shaped how we measured everything.</p>}
        />
        <ol className="cases">
          {cases.map((c, i) => (
            <li key={c.title} className={`case${c.visual ? ' has-visual' : ''}`}>
              <div className="case-head">
                <span className="case-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>
                  <span className="sr-only">Challenge {i + 1}: </span>
                  {c.title}
                </h3>
              </div>
              <dl className="case-grid">
                {fields.map(([k, label]) => (
                  <div key={k} className={`cf cf-${k}`}>
                    <dt>{label}</dt>
                    <dd>{c[k]}</dd>
                  </div>
                ))}
              </dl>
              {c.visual}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
