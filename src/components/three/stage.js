// Shared three.js set-up for the two 3D scenes (the radio and the coil).
// three is imported on demand so the page itself never waits for it.

export async function createStage(el, { fov = 30, exposure = 1.05, envIntensity = 0.45 } = {}) {
  const THREE = await import('three')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = exposure
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = envIntensity

  // palette lighting: warm key, sage rim
  scene.add(new THREE.HemisphereLight(0xf1ecdf, 0x292824, 0.55))
  const key = new THREE.DirectionalLight(0xffd2bf, 2.6)
  key.position.set(-4, 5, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x8e9b86, 2.2)
  rim.position.set(5, 3, -6)
  scene.add(rim)

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.autoRotate = !reduced
  controls.autoRotateSpeed = 0.7
  controls.addEventListener('start', () => (controls.autoRotate = false))

  const resize = () => {
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  resize()

  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' })
  io.observe(el)

  const disposables = []
  const start = (tick) => {
    renderer.setAnimationLoop((t) => {
      if (!visible) return
      controls.update()
      tick?.(t)
      renderer.render(scene, camera)
    })
  }

  const dispose = () => {
    renderer.setAnimationLoop(null)
    ro.disconnect()
    io.disconnect()
    controls.dispose()
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        ;[].concat(o.material).forEach((m) => {
          Object.values(m).forEach((v) => v && v.isTexture && v.dispose())
          m.dispose()
        })
      }
    })
    disposables.forEach((d) => d.dispose?.())
    pmrem.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }

  /** soft round shadow under an object */
  const contactShadow = (w, d, y, strength = 0.55) => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64)
    grd.addColorStop(0, `rgba(0,0,0,${strength})`)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 128)
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.y = y
    scene.add(m)
    return m
  }

  return { THREE, renderer, scene, camera, controls, start, dispose, contactShadow, reduced, disposables }
}
