import { useEffect, useRef, useState } from 'react'
import { have } from '../data/measurements'
import { availablePhotoIds } from '../data/photos'

const base = import.meta.env.BASE_URL

/** A measured number, or ___ until we have it. */
export function Val({ v, digits = 0, unit }) {
  if (!have(v)) return <span className="blank">___</span>
  return (
    <span className="val">
      {v.toFixed(digits)}
      {unit ? <span className="unit"> {unit}</span> : null}
    </span>
  )
}

export const Frac = ({ n, d }) => (
  <span className="frac">
    <span className="frac-n">{n}</span>
    <span className="frac-d">{d}</span>
  </span>
)

export const Sqrt = ({ children }) => (
  <span className="sqrt">
    <span className="sqrt-sign" aria-hidden="true">
      √
    </span>
    <span className="sqrt-body">{children}</span>
  </span>
)

export function Details({ summary, children }) {
  return (
    <details className="det">
      <summary>
        <span>{summary}</span>
        <span className="det-ico" aria-hidden="true" />
      </summary>
      <div className="det-body">{children}</div>
    </details>
  )
}

/** Section opener: index on the left, a two-weight headline, optional intro on the right. */
export function SectionHead({ n, label, title, sub, intro, id }) {
  return (
    <header className="shead">
      <p className="shead-idx">
        <span className="shead-n">{n}</span>
        <span className="shead-l">{label}</span>
      </p>
      <h2 id={id}>
        <span className="h-a">{title}</span>
        {sub && <span className="h-b">{sub}</span>}
      </h2>
      {intro && <div className="shead-intro">{intro}</div>}
    </header>
  )
}

/** Photo in a fixed-ratio frame with a caption and click-to-enlarge. */
export function Figure({ n, alt, caption, ratio = '4/3', fallback, className = '' }) {
  const id = String(n).padStart(2, '0')
  const src = `${base}images/img-${id}.jpg`
  const [status, setStatus] = useState('loading')
  const dlg = useRef(null)
  const missing = !availablePhotoIds.has(Number(n)) || status === 'error'

  useEffect(() => {
    const d = dlg.current
    if (!d) return
    const onClick = (e) => e.target === d && d.close()
    d.addEventListener('click', onClick)
    return () => d.removeEventListener('click', onClick)
  }, [status])

  if (missing && !fallback) return null

  return (
    <figure className={`fig ${className}`}>
      <div className="fig-frame" style={{ aspectRatio: ratio }}>
        {!missing && (
          <button
            type="button"
            className={`fig-open${status !== 'ok' ? ' is-loading' : ''}`}
            onClick={() => dlg.current?.showModal()}
            aria-label={`Enlarge: ${alt}`}
            tabIndex={status === 'ok' ? 0 : -1}
          >
            <img src={src} alt={alt} loading="lazy" onLoad={() => setStatus('ok')} onError={() => setStatus('error')} />
          </button>
        )}
        {missing && fallback}
        <span className="fig-corner" aria-hidden="true" />
      </div>
      {caption && (
        <figcaption>
          <span className="fig-id">IMG-{id}</span>
          <span>{caption}</span>
        </figcaption>
      )}
      {!missing && (
        <dialog ref={dlg} className="lightbox" aria-label={alt}>
          <form method="dialog">
            <button className="lb-close">Close</button>
          </form>
          <img src={src} alt={alt} />
          {caption && <p>{caption}</p>}
        </dialog>
      )}
    </figure>
  )
}
