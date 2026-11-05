import { useState } from 'react'
import { navLinks, navOwner, sections } from '../data/sections'
import { useActiveSection, useScrollProgress } from '../hooks/useScroll'

export const LogoMark = () => (
  <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="1" y="1" width="30" height="30" rx="7" />
    {/* an LC tank in one glyph: coil humps then capacitor plates */}
    <path d="M6 20c0-4 4-4 4 0 0-4 4-4 4 0 0-4 4-4 4 0" />
    <path d="M22 11v18M26 11v18" />
    <circle cx="24" cy="6.5" r="2.2" />
  </svg>
)

export function TopBar() {
  const progress = useScrollProgress()
  const active = useActiveSection(sections.map((s) => s.id))
  const owner = active ? navOwner[active] || active : null
  const [open, setOpen] = useState(false)
  const current = sections.find((s) => s.id === active)

  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="brand-name">Team 22</span>
          <span className="brand-sub">Radio Guide</span>
        </a>
        <span className="now" aria-hidden="true">
          {current ? `${current.n} ${current.label}` : 'M1'}
        </span>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen((v) => !v)}>
          <span className="menu-lines" aria-hidden="true" />
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="main-nav" className={`nav${open ? ' is-open' : ''}`} aria-label="Sections">
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} aria-current={owner === l.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                  <span className="nav-n">{l.n}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  )
}
