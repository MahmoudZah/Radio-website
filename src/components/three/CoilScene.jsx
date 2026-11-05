import { useEffect, useRef, useState } from 'react'
import { createStage } from './stage'

// 1 unit = 10 mm. Real proportions: 50 mm pipe, 75 turns of 0.3 mm wire over about 25 mm.
const PIPE_R = 2.5
const PIPE_LEN = 15
const WIRE_R = 0.022
const COIL = { turns: 75, len: 2.5, x0: -1.2 }
const LOOP = { turns: 5, len: 0.18, x0: -5.4 } // a few cm from the coil, same pipe, same axis

const labels = [
  { id: 'coil', text: '75-turn coil · L ≈ 291 µH', at: [COIL.x0 + COIL.len / 2, PIPE_R + 0.2, 0] },
  { id: 'loop', text: '5-turn test loop', at: [LOOP.x0 + LOOP.len / 2, PIPE_R + 0.2, 0] },
  { id: 'gap', text: 'a few cm apart', at: [(LOOP.x0 + LOOP.len + COIL.x0) / 2, -PIPE_R - 0.4, 0] },
]

/** The coil and test loop on their PVC pipe, built from the real dimensions. Drag to turn. */
export function CoilScene({ className = '' }) {
  const host = useRef(null)
  const tags = useRef({})
  const [state, setState] = useState('loading')

  useEffect(() => {
    let disposed = false
    let stage = null
    ;(async () => {
      try {
        stage = await createStage(host.current, { fov: 28, envIntensity: 0.6 })
        if (disposed) return stage.dispose()
        const { THREE, scene, camera, controls, start, contactShadow } = stage

        class Helix extends THREE.Curve {
          constructor(turns, len, x0, r) {
            super()
            Object.assign(this, { turns, len, x0, r })
          }
          getPoint(t, out = new THREE.Vector3()) {
            const a = t * this.turns * Math.PI * 2
            return out.set(this.x0 + t * this.len, this.r * Math.cos(a), this.r * Math.sin(a))
          }
        }

        const copper = new THREE.MeshStandardMaterial({ color: 0xb8642e, metalness: 1, roughness: 0.3 })
        const pvc = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.62, metalness: 0 })
        const pvcInner = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.8, side: THREE.BackSide })
        const tape = new THREE.MeshStandardMaterial({ color: 0xff5321, roughness: 0.7 })

        const group = new THREE.Group()
        scene.add(group)

        // the pipe: outer wall, inner wall, end rings
        const outer = new THREE.Mesh(new THREE.CylinderGeometry(PIPE_R, PIPE_R, PIPE_LEN, 96, 1, true), pvc)
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(PIPE_R - 0.16, PIPE_R - 0.16, PIPE_LEN, 96, 1, true), pvcInner)
        ;[outer, inner].forEach((m) => {
          m.rotation.z = Math.PI / 2
          group.add(m)
        })
        ;[-1, 1].forEach((side) => {
          const ring = new THREE.Mesh(new THREE.RingGeometry(PIPE_R - 0.16, PIPE_R, 96), pvc)
          ring.rotation.y = (side * Math.PI) / 2
          ring.position.x = (side * PIPE_LEN) / 2
          group.add(ring)
        })

        const winding = ({ turns, len, x0 }) => {
          const curve = new Helix(turns, len, x0, PIPE_R + WIRE_R)
          group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, turns * 56, WIRE_R, 6, false), copper))
          // tape at each end, and the wire tails
          ;[0, 1].forEach((end) => {
            const x = x0 + end * len + (end ? 0.14 : -0.14)
            const band = new THREE.Mesh(new THREE.CylinderGeometry(PIPE_R + 0.03, PIPE_R + 0.03, 0.22, 64, 1, true), tape)
            band.rotation.z = Math.PI / 2
            band.position.x = x
            group.add(band)
            const p = curve.getPoint(end)
            const tail = new THREE.CatmullRomCurve3([
              p.clone(),
              p.clone().add(new THREE.Vector3(end ? 0.3 : -0.3, 0.5, 0.2)),
              p.clone().add(new THREE.Vector3(end ? 0.5 : -0.5, 1.6, 0.8)),
            ])
            group.add(new THREE.Mesh(new THREE.TubeGeometry(tail, 24, WIRE_R * 1.4, 6, false), copper))
          })
        }
        winding(COIL)
        winding(LOOP)

        group.position.x = 1.2
        contactShadow(18, 7, -PIPE_R - 0.05, 0.5)

        camera.position.set(-3, 4.5, 17)
        controls.target.set(0, 0, 0)
        controls.minPolarAngle = Math.PI * 0.2
        controls.maxPolarAngle = Math.PI * 0.55
        controls.autoRotateSpeed = 0.5
        controls.update()

        const v = new THREE.Vector3()
        start(() => {
          const el = host.current
          if (!el) return
          const w = el.clientWidth
          const h = el.clientHeight
          labels.forEach((l) => {
            const node = tags.current[l.id]
            if (!node) return
            v.set(...l.at)
            group.localToWorld(v)
            v.project(camera)
            // keep each tag inside the frame on narrow screens
            const half = node.offsetWidth / 2 + 8
            const px = Math.min(w - half, Math.max(half, ((v.x + 1) / 2) * w))
            node.style.transform = `translate(${px}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -100%)`
            node.style.opacity = v.z < 1 ? 1 : 0
          })
        })
        setState('ready')
      } catch (err) {
        console.warn('3D coil could not load:', err)
        if (!disposed) setState('error')
      }
    })()
    return () => {
      disposed = true
      stage?.dispose()
    }
  }, [])

  return (
    <div className={`stage3d is-${state} ${className}`}>
      <div
        ref={host}
        className="stage3d-canvas"
        role="img"
        aria-label="3D model of the build: a 75-turn copper coil and a 5-turn test loop wound on the same 50 mm PVC pipe, a few centimetres apart. Drag to turn it."
      />
      {state === 'ready' &&
        labels.map((l) => (
          <span key={l.id} ref={(n) => (tags.current[l.id] = n)} className={`tag3d tag3d-${l.id}`} aria-hidden="true">
            {l.text}
          </span>
        ))}
      {state === 'loading' && <p className="stage3d-msg">Winding the coil…</p>}
      {state === 'error' && <p className="stage3d-msg">The 3D coil needs WebGL, which is switched off in this browser.</p>}
    </div>
  )
}
