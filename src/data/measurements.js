// Our measured numbers. Anything still `null` shows as ___ and is skipped in the charts.

// Table 5: the tank at TP1 (kHz)
export const band = {
  lowEnd: 377.1, // capacitor fully meshed
  highEnd: 581.4, // capacitor fully open
  f0Half: 491, // capacitor at half travel
  fLow: 460, // TP1 at 0.7 of its peak, below f0
  fHigh: 530, // TP1 at 0.7 of its peak, above f0
}

// Table 6: the detector at f0 = 491 kHz.
// src = generator setting (V), tp1 = TP1 peak (mV), tp3 = TP3 DC (mV)
export const detector = [
  { src: 0.1587, tp1: null, tp3: null },
  { src: 0.354, tp1: null, tp3: null },
  { src: 0.5493, tp1: null, tp3: null },
  { src: 0.7446, tp1: null, tp3: null },
  { src: 0.9399, tp1: null, tp3: null },
  { src: 1.135, tp1: null, tp3: null },
]

// What the meter read across the AM section of the tuning capacitor
export const capMeasured = { min: 100, max: 280 } // pF

export const have = (v) => typeof v === 'number' && Number.isFinite(v)

export const qFactor = () =>
  have(band.f0Half) && have(band.fLow) && have(band.fHigh) && band.fHigh > band.fLow
    ? band.f0Half / (band.fHigh - band.fLow)
    : null
