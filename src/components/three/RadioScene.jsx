import { useEffect, useRef, useState } from 'react'
import { createStage } from './stage'

const base = import.meta.env.BASE_URL

// Keep the radio's dial facing the camera at a shallow three-quarter angle.
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
        controls.autoRotate = false
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const { scene: obj } = await new GLTFLoader().loadAsync(`${base}models/RadioVintage.glb`)
        if (disposed) return

        const box = new THREE.Box3().setFromObject(obj)
        const size = box.getSize(new THREE.Vector3())
        obj.position.sub(box.getCenter(new THREE.Vector3()))
        const pivot = new THREE.Group()
        pivot.add(obj)
        const s = 2.2 / Math.max(size.x, size.y, size.z)
        pivot.scale.setScalar(s)
        pivot.position.x = 0.65
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
