import { Figure, SectionHead } from '../components/ui'
import * as P from '../components/svg/PartIcons'
import { team } from '../data/team'

const parts = [
  { ref: 'L1', name: 'Enamelled copper wire', spec: '12 m · 0.3 mm', Icon: P.WireSpool },
  { ref: '—', name: 'PVC pipe', spec: '50 mm', Icon: P.Pipe },
  { ref: 'C1', name: 'Tuning capacitor', spec: 'AM section', Icon: P.VarCap },
  { ref: 'D1', name: 'Diode', spec: '1N60P', Icon: P.Diode },
  { ref: 'R1', name: 'Resistor', spec: '15 kΩ', Icon: P.Resistor },
  { ref: 'C2', name: 'Capacitor', spec: '3.3 nF', Icon: P.CeramicCap },
  { ref: '—', name: 'Breadboard and jumper wires', spec: '', Icon: P.Breadboard },
  { ref: '—', name: 'Tape', spec: 'holds the windings', Icon: P.Tape },
]

const tools = [
  { name: 'Function generator', spec: 'up to 2 MHz', Icon: P.FuncGen },
  { name: 'Oscilloscope', spec: '×10 probe', Icon: P.Scope },
  { name: 'Digital multimeter', spec: 'Ω, capacitance and DC', Icon: P.Multimeter },
  { name: 'Sandpaper or a blade', spec: 'to strip the enamel', Icon: P.Sandpaper },
  { name: 'ESP32 board', spec: 'our first attempt at a source', Icon: P.Esp32 },
]

export function Parts() {
  return (
    <section className="band band-paper" id="parts" aria-labelledby="parts-h">
      <div className="wrap">
        <SectionHead
          id="parts-h"
          n="02"
          label="Parts and tools"
          title="Parts and tools"
          sub="Everything on our bench."
          intro={<p>Eight parts and five instruments. The ESP32 is on the list because it was our first try at a signal source (challenge 2 tells that story).</p>}
        />

        <h3 className="h3-rule">
          Parts <span className="count">{parts.length}</span>
        </h3>
        <ul className="bom">
          {parts.map(({ ref, name, spec, Icon }) => (
            <li key={name} className="bom-item">
              <span className="bom-ref">{ref}</span>
              <Icon />
              <p className="bom-name">{name}</p>
              {spec && <p className="bom-spec">{spec}</p>}
            </li>
          ))}
        </ul>

        <h3 className="h3-rule">
          Tools <span className="count">{tools.length}</span>
        </h3>
        <ul className="toolrow">
          {tools.map(({ name, spec, Icon }) => (
            <li key={name}>
              <Icon />
              <div>
                <p className="bom-name">{name}</p>
                <p className="bom-spec">{spec}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="photo-duo">
          <Figure n={2} ratio="4/3" alt="All the Milestone 1 parts laid out on a table." caption="All the parts, laid out before we started." />
          <Figure n={3} ratio="4/3" alt="The instruments we used: generator, oscilloscope and multimeter." caption="The instruments we used." />
        </div>
      </div>
    </section>
  )
}
