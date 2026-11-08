import { Figure, SectionHead } from '../components/ui'
import { Staircase } from '../components/svg/Diagrams'

const cases = [
  {
    title: 'No generator above 1 MHz',
    problem: 'The medium-wave band runs up to about 2 MHz, but our first, malfunctioning generator stopped at 1 MHz.',
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
        <Figure n={15} ratio="16/9" alt="Scope photo of the AM signal from the ESP32." caption="The AM signal from the ESP32 on our scope." />
      </div>
    ),
  },
  {
    title: 'The right instrument',
    problem: 'We needed a clean source that covers the whole band.',
    tried: 'Looking for a generator with more range.',
    worked: 'We replaced it with a function generator that goes up to 2 MHz, enough to cover the whole band. We used it for the new measurements.',
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
    title: 'The first generator gave conflicting readings',
    problem: 'Our first function generator was malfunctioning, so its readings did not agree with the circuit’s response.',
    tried: 'We replaced it and repeated the measurements with the new generator.',
    worked: 'Tables 5 and 6 use the readings from the replacement generator.',
    lesson: 'Use one verified source for a measurement set, and do not mix readings from different instruments.',
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
