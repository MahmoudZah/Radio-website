import { SectionHead } from '../components/ui'
import { MiniDetector, MiniTank, MilestoneWave, SignalChain } from '../components/svg/Diagrams'
import { milestones, team } from '../data/team'

const goals = [
  'Wind the coil and build the tank',
  'Find the resonance and the band the radio can tune',
  'Measure the bandwidth and the quality factor Q',
  'Build the detector and record its response',
  'Compare everything with our predictions',
]

const cardTone = ['tone-teal', 'tone-orange', 'tone-gray']
const tilt = [-2.2, 1.4, -1]

export function Overview() {
  return (
    <>
      <section className="band band-paper" id="overview" aria-labelledby="ov-h">
        <div className="wrap">
          <SectionHead
            id="ov-h"
            n="01"
            label="Overview"
            title="What is M1?"
            sub="Two jobs, one front end."
            intro={
              <p>
                A radio has to do two jobs. First, it must pick one station out of all the signals in the air. Second, it must
                pull the sound back out of that station’s wave. Milestone 1 does both.
              </p>
            }
          />

          <div className="jobs">
            <article className="job">
              <MiniTank />
              <div>
                <p className="job-n">Job 1 · pick</p>
                <h3>The tuned circuit (the tank)</h3>
                <p>A coil and a variable capacitor that resonate at one frequency.</p>
              </div>
            </article>
            <article className="job">
              <MiniDetector />
              <div>
                <p className="job-n">Job 2 · listen</p>
                <h3>The detector</h3>
                <p>
                  A diode, a resistor and a capacitor that follow the peaks of the signal and turn them into a DC level (or, for a
                  real station, into sound).
                </p>
              </div>
            </article>
          </div>

          <figure className="chain-fig">
            <SignalChain />
            <figcaption>
              <span className="key-solid" /> built in M1 <span className="key-dash" /> gain stages added in M2
            </figcaption>
          </figure>

          <div className="ov-split">
            <div>
              <h3 className="h3-rule">Our goals for M1</h3>
              <ol className="goals">
                {goals.map((g, i) => (
                  <li key={g}>
                    <span className="goal-n">{String(i + 1).padStart(2, '0')}</span>
                    {g}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="h3-rule">The project in three milestones</h3>
              <p className="muted">M1 is the tuner and detector. M2 adds an RF amplifier before the detector. M3 solders everything onto a proper board.</p>
            </div>
          </div>
          <MilestoneWave items={milestones} />
        </div>
      </section>

      <section className="band band-concrete team" aria-labelledby="team-h">
        <div className="wrap">
          <div className="team-head">
            <p className="shead-idx">
              <span className="shead-n">01·b</span>
              <span className="shead-l">Who we are</span>
            </p>
            <h2 id="team-h">
              <span className="h-a">Meet the people</span>
              <span className="h-b">behind the radio.</span>
            </h2>
            <p className="team-meta">
              <span>Team {team.number}</span>
              <span>Group {team.group}</span>
              <span>{team.members.length} people, one bench</span>
            </p>
          </div>
          <div className="hang">
            <svg className="hang-wire" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 10 Q500 60 1000 10" />
            </svg>
            <ul>
              {team.members.map((m, i) => (
                <li key={m.name} style={{ '--tilt': `${tilt[i]}deg` }}>
                  <span className="clip" aria-hidden="true" />
                  <span className="string" aria-hidden="true" />
                  <article className="idcard">
                    <header>
                      <span>Team 22 · Group C</span>
                      <span>#{String(i + 1).padStart(2, '0')}</span>
                    </header>
                    <div className={`id-mono ${cardTone[i]}`} aria-hidden="true">
                      {m.initials}
                    </div>
                    <h3 className="team-name" tabIndex={0}>
                      {m.name}
                    </h3>
                    <img
                      className="team-character"
                      src={`/images/team/${m.portrait}.webp`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />
                    <p>Every part of M1</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
          <p className="together">{team.together}</p>
        </div>
      </section>
    </>
  )
}
