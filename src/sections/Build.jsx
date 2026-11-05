import { Figure, SectionHead } from '../components/ui'
import { CapLegs } from '../components/svg/Diagrams'
import { CoilScene } from '../components/three/CoilScene'

const steps = [
  {
    title: 'Wind the coil',
    body: <p>Tape the start of the wire to the pipe. Wind 75 turns side by side with no gaps and no crossings. Tape the end.</p>,
    tip: 'Keep the wire tight, because loose turns change L.',
    img: { n: 5, desc: 'Winding the 75-turn coil', alt: 'The 75-turn coil wound side by side on the PVC pipe, ends taped.' },
  },
  {
    title: 'Wind the test loop on the same pipe',
    body: (
      <p>
        To keep construction simple, we wound the 5-turn test loop and the 75-turn coil on the same PVC pipe. The loop is what the
        generator drives, and it passes the signal to the coil by magnetic coupling.
      </p>
    ),
    img: { n: 6, desc: 'The 5-turn loop on the same pipe', alt: 'The 5-turn test loop on the same pipe, a few centimetres from the coil.' },
  },
  {
    title: 'Clean the wire ends',
    body: <p>Enamel is an insulator. Scrape 1 cm off every end until the copper shines.</p>,
    tip: 'A dull end looks connected and is not. If in doubt, check it on the meter.',
    img: { n: 7, desc: 'Cleaned wire ends', alt: 'A wire end with 1 cm of enamel scraped off, showing bright copper.' },
  },
  {
    title: 'Find the right capacitor terminals',
    body: (
      <>
        <p>
          Our capacitor has several gangs and several legs, and we did not know which ones were the AM section. Our meter read about
          0.1 to 0.28 nF for the AM section once we found it. We did not mount the capacitor on the pipe.
        </p>
        <CapLegs />
      </>
    ),
    img: { n: 8, desc: 'Capacitor and the multimeter readings', alt: 'The tuning capacitor with the multimeter reading its AM section.' },
  },
  {
    title: 'Build the detector on the breadboard',
    body: (
      <p>
        The 1N60P goes from TP1 (the top of the tank) to TP3, with its band towards TP3. The 15 kΩ resistor and the 3.3 nF capacitor
        go side by side from TP3 to ground.
      </p>
    ),
    tip: 'The band is the cathode. Turn the diode round and TP3 stays at zero.',
    img: { n: 9, desc: 'Detector on the breadboard', alt: 'The detector on the breadboard: diode from TP1 to TP3, resistor and capacitor from TP3 to ground.' },
  },
]

const wave = (i) => (i % 2 ? 'M50 0 C50 25 18 25 18 50 C18 75 50 75 50 100' : 'M50 0 C50 25 82 25 82 50 C82 75 50 75 50 100')

export function Build() {
  return (
    <section className="band band-concrete" id="build" aria-labelledby="build-h">
      <div className="wrap">
        <SectionHead
          id="build-h"
          n="05"
          label="Build"
          title="Build it"
          sub="Five steps, one pipe."
          intro={<p>Turn the model to see what you are aiming for: the coil and the test loop share one 50 mm pipe, a few centimetres apart.</p>}
        />
        <div className="coil-stage">
          <CoilScene />
          <p className="drag-hint is-light" aria-hidden="true">
            Drag to turn · drawn to scale from our dimensions
          </p>
        </div>

        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className={`step${i % 2 ? ' flip' : ''}`}>
              <span className="ghost" aria-hidden="true">
                {i + 1}
              </span>
              <div className="rail" aria-hidden="true">
                <span className="hexnode">{i + 1}</span>
                {i < steps.length - 1 && (
                  <svg className="wave" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d={wave(i)} vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </div>
              <div className="step-copy">
                <p className="step-k">Step {i + 1}</p>
                <h3>{s.title}</h3>
                {s.body}
                {s.tip && (
                  <p className="tip">
                    <b>Tip</b> {s.tip}
                  </p>
                )}
              </div>
              <Figure n={s.img.n} ratio="4/3" alt={s.img.alt} desc={s.img.desc} caption={s.img.desc + '.'} className="step-fig" />
            </li>
          ))}
        </ol>
        <Figure n={10} ratio="21/9" className="finished" alt="The finished Milestone 1 build." desc="The finished M1" caption="The finished M1." />
      </div>
    </section>
  )
}
