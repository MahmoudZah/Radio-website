import { useEffect, useRef, useState } from 'react'
import { createStage } from './stage'

// 1 unit = 10 mm. Keep the 50 mm former and the measured winding counts.
const PIPE_R = 2.5
const PIPE_HEIGHT = 6
const WIRE_R = 0.022
const COIL = { turns: 75, len: 3, y0: -2.65 }
const LOOP = { turns: 5, len: 0.18, y0: 2.55 }

const labels = [
  { id: 'coil', text: '75-turn coil · L ≈ 291 µH', at: [0, COIL.y0 + COIL.len / 2, PIPE_R + 0.25] },
  { id: 'loop', text: '5-turn test loop', at: [0, LOOP.y0 + LOOP.len + 0.25, PIPE_R + 0.25] },
  { id: 'gap', text: 'a few cm apart', at: [PIPE_R + 0.4, (COIL.y0 + COIL.len + LOOP.y0) / 2, 0] },
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
          constructor(turns, len, y0, r) {
            super()
            Object.assign(this, { turns, len, y0, r })
          }
          getPoint(t, out = new THREE.Vector3()) {
            const a = t * this.turns * Math.PI * 2
            return out.set(this.r * Math.sin(a), this.y0 + t * this.len, this.r * Math.cos(a))
          }
        }

        const copper = new THREE.MeshStandardMaterial({ color: 0xb8642e, metalness: 0.88, roughness: 0.26 })
        const pvc = new THREE.MeshStandardMaterial({ color: 0xe7e2d5, roughness: 0.48, metalness: 0 })
        const pvcInner = new THREE.MeshStandardMaterial({ color: 0xb9b5aa, roughness: 0.78, side: THREE.BackSide })
        const tape = new THREE.MeshStandardMaterial({ color: 0x171816, roughness: 0.72 })
        const rimBlue = new THREE.MeshStandardMaterial({ color: 0x45bce7, roughness: 0.3, metalness: 0.15 })

        const group = new THREE.Group()
        scene.add(group)

        // Hollow upright former, with the open rim visible from above.
        group.add(new THREE.Mesh(new THREE.CylinderGeometry(PIPE_R, PIPE_R, PIPE_HEIGHT, 96, 1, true), pvc))
        group.add(new THREE.Mesh(new THREE.CylinderGeometry(PIPE_R - 0.18, PIPE_R - 0.18, PIPE_HEIGHT - 0.2, 96, 1, true), pvcInner))
        const lip = new THREE.Mesh(new THREE.RingGeometry(PIPE_R - 0.25, PIPE_R, 96), pvc)
        lip.rotation.x = -Math.PI / 2
        lip.position.y = PIPE_HEIGHT / 2
        group.add(lip)
        const innerRim = new THREE.Mesh(new THREE.TorusGeometry(PIPE_R - 0.27, 0.045, 10, 96), rimBlue)
        innerRim.rotation.x = Math.PI / 2
        innerRim.position.y = PIPE_HEIGHT / 2 - 0.03
        group.add(innerRim)
        const baseRim = new THREE.Mesh(new THREE.RingGeometry(PIPE_R - 0.18, PIPE_R, 96), pvc)
        baseRim.rotation.x = Math.PI / 2
        baseRim.position.y = -PIPE_HEIGHT / 2
        group.add(baseRim)

        // Four black tape strips cross the plastic shell and copper winding.
        for (let index = 0; index < 4; index += 1) {
          const angle = (index * Math.PI) / 2 - 0.12
          const strip = new THREE.Mesh(
            new THREE.CylinderGeometry(PIPE_R + 0.035, PIPE_R + 0.035, PIPE_HEIGHT - 0.35, 24, 1, true, angle, 0.34),
            tape,
          )
          group.add(strip)
        }

        const winding = ({ turns, len, y0 }) => {
          const curve = new Helix(turns, len, y0, PIPE_R + WIRE_R)
          group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, turns * 56, WIRE_R, 6, false), copper))
          // Short wire tails leave the winding ends, as on the photographed build.
          ;[0, 1].forEach((end) => {
            const p = curve.getPoint(end)
            const tail = new THREE.CatmullRomCurve3([
              p.clone(),
              p.clone().add(new THREE.Vector3(end ? 0.12 : -0.12, end ? 0.35 : -0.3, 0.35)),
              p.clone().add(new THREE.Vector3(end ? 0.22 : -0.22, end ? 1.05 : -0.65, 0.55)),
            ])
            group.add(new THREE.Mesh(new THREE.TubeGeometry(tail, 24, WIRE_R * 1.4, 6, false), copper))
          })
        }
        winding(COIL)
        winding(LOOP)

        group.rotation.y = -0.18
        contactShadow(7, 7, -PIPE_HEIGHT / 2 - 0.05, 0.5)

        camera.position.set(-2.2, 4.2, 18.5)
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
