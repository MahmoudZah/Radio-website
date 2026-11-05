import { useEffect, useRef, useState } from 'react'
import { createStage } from './stage'

const base = import.meta.env.BASE_URL

// The dial and knobs face +X in the source file: turn it to face the camera, a little to the left.
const MODEL_YAW = -Math.PI / 2 + 0.5

/** The interactive 3D valve radio in the hero. Drag to turn it. */
export function RadioScene({ className = '' }) {
  const host = useRef(null)
  const [state, setState] = useState('loading')

  useEffect(() => {
    let disposed = false
    let stage = null
    ;(async () => {
      try {
        stage = await createStage(host.current)
        if (disposed) return stage.dispose()
        const { THREE, scene, camera, controls, renderer, start, contactShadow } = stage
        const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js')

        const tl = new THREE.TextureLoader()
        const tex = (name, srgb) =>
          tl.loadAsync(`${base}models/radio_${name}.jpg`).then((t) => {
            if (srgb) t.colorSpace = THREE.SRGBColorSpace
            t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
            return t
          })

        const [obj, map, normalMap, aoMap, metalnessMap] = await Promise.all([
          new OBJLoader().loadAsync(`${base}models/radio.obj`),
          tex('albedo', true),
          tex('normal'),
          tex('ao'),
          tex('metalness'),
        ])
        if (disposed) return

        const material = new THREE.MeshStandardMaterial({ map, normalMap, aoMap, metalnessMap, metalness: 1, roughness: 0.58 })
        obj.traverse((c) => c.isMesh && (c.material = material))

        const box = new THREE.Box3().setFromObject(obj)
        const size = box.getSize(new THREE.Vector3())
        obj.position.sub(box.getCenter(new THREE.Vector3()))
        const pivot = new THREE.Group()
        pivot.add(obj)
        const s = 2.6 / Math.max(size.x, size.y, size.z)
        pivot.scale.setScalar(s)
        pivot.rotation.y = MODEL_YAW
        scene.add(pivot)
        contactShadow(4.2, 3.2, (-size.y * s) / 2 - 0.01)

        camera.position.set(0.3, 0.9, 6.2)
        controls.target.set(0, -0.05, 0)
        controls.minPolarAngle = Math.PI * 0.28
        controls.maxPolarAngle = Math.PI * 0.52
        controls.update()
        start()
        setState('ready')
      } catch (err) {
        console.warn('3D radio could not load:', err)
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
        aria-label="A 3D model of a vintage wooden valve radio. Drag to turn it around."
      />
      {state === 'loading' && <p className="stage3d-msg">Warming up the valves…</p>}
      {state === 'error' && <p className="stage3d-msg">The 3D radio needs WebGL, which is switched off in this browser.</p>}
    </div>
  )
}
