// Every prediction on the page is computed here from the design numbers.

export const design = {
  d: 50, // coil diameter, mm (the PVC pipe)
  n: 75, // turns
  l: 25, // coil length, mm (about)
  cMin: 20, // pF, nominal
  cMax: 280, // pF
  cRealMin: 100, // pF, what our meter read
  fTarget: 819e3, // Hz
  r: 15e3, // ohm
  cDet: 3.3e-9, // F
}

/** Wheeler single-layer coil. d and l in mm, result in henries. */
export const wheeler = (d, n, l) => ((d * d * n * n) / (457 * d + 1016 * l)) * 1e-6
/** Resonant frequency (Hz) from L (H) and C (F). */
export const f0 = (L, C) => 1 / (2 * Math.PI * Math.sqrt(L * C))
/** Capacitance (F) that resonates L at f (Hz). */
export const cFor = (L, f) => 1 / (Math.pow(2 * Math.PI * f, 2) * L)
/** Percent error, as defined in the guide. */
export const pctErr = (pred, meas) => (100 * (pred - meas)) / meas

/** Normalised response of a tank with quality factor Q, at frequency f, around f0. */
export const tankResponse = (f, fc, Q) => 1 / Math.sqrt(1 + Q * Q * Math.pow(f / fc - fc / f, 2))

export const L = wheeler(design.d, design.n, design.l)

export const predictions = {
  L,
  cFor819: cFor(L, design.fTarget),
  fAtMaxC: f0(L, design.cMax * 1e-12),
  fAtMinC: f0(L, design.cMin * 1e-12),
  fAtRealMin: f0(L, design.cRealMin * 1e-12),
  rc: design.r * design.cDet,
}

export const fmt = {
  uH: (h) => `${Math.round(h * 1e6)} µH`,
  pF: (f) => `${Math.round(f * 1e12)} pF`,
  kHz: (hz) => `${Math.floor(hz / 1e3)} kHz`,
  MHz: (hz) => `${(Math.floor(hz / 1e4) / 100).toFixed(2)} MHz`,
  us: (s) => `${(s * 1e6).toFixed(1)} µs`,
  auto: (hz) => (hz >= 1e6 ? `${(hz / 1e6).toFixed(2)} MHz` : `${Math.round(hz / 1e3)} kHz`),
}
