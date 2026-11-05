import { LogoMark } from '../components/TopBar'
import { Traces } from '../components/svg/Diagrams'
import { team } from '../data/team'

export function Footer() {
  return (
    <footer className="footer">
      <Traces className="footer-traces" lines={5} gap={12} height={200} jog={60} />
      <div className="wrap footer-grid">
        <div className="f-brand">
          <LogoMark />
          <p className="f-big">Team {team.number} · Group {team.group}</p>
          <p>{team.members.map((m) => m.name).join(' · ')}</p>
        </div>
        <div>
          <p className="f-k">Course</p>
          <p>
            {team.course} {team.courseTitle}
          </p>
          <p>
            {team.school} · {team.term}
          </p>
        </div>
        <p className="f-line">
          <span>Built with care, copper and a lot of orange tape.</span>
          <a href="#top">Back to the top ↑</a>
        </p>
      </div>
    </footer>
  )
}
