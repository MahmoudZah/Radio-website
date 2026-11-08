// Readings taken with the replacement function generator.

// Table 5: the tank at TP1 (kHz)
export const band = {
  lowEnd: 972.4, // capacitor fully meshed
  highEnd: 1126, // capacitor fully open
  f0Half: 1072, // capacitor at half travel
  fLow: 960, // TP1 at 0.7 of its peak, below f0
  fHigh: 1201, // TP1 at 0.7 of its peak, above f0
  reportedQ: 4.51,
}

// Table 6: the detector at f0 = 1.072 MHz.
// src = generator setting (V), tp1 = TP1 peak (mV), tp3 = TP3 DC (mV)
export const detector = [
  { src: 1.035, tp1: 1330, tp3: 842.7 },
  { src: 0.5, tp1: 669.1, tp3: 423.8 },
  { src: 0.304, tp1: 376.7, tp3: 251.2 },
  { src: 0.2031, tp1: 248.9, tp3: 156.7 },
  { src: 0.0961, tp1: 114.3, tp3: 64.8 },
  { src: 0.05, tp1: 47.1, tp3: 14.3 },
]

// What the meter read across the AM section of the tuning capacitor
export const capMeasured = { min: 100, max: 280 } // pF

export const have = (v) => typeof v === 'number' && Number.isFinite(v)

export const qFactor = () =>
  have(band.reportedQ)
    ? band.reportedQ
    : have(band.f0Half) && have(band.fLow) && have(band.fHigh) && band.fHigh > band.fLow
      ? band.f0Half / (band.fHigh - band.fLow)
      : null
