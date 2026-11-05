export const sections = [
  { id: 'overview', n: '01', label: 'Overview' },
  { id: 'parts', n: '02', label: 'Parts' },
  { id: 'theory', n: '03', label: 'Theory' },
  { id: 'predictions', n: '04', label: 'Predictions' },
  { id: 'build', n: '05', label: 'Build' },
  { id: 'measure', n: '06', label: 'Measure' },
  { id: 'analysis', n: '07', label: 'Analysis' },
  { id: 'challenges', n: '08', label: 'Challenges' },
  { id: 'conclusion', n: '09', label: 'Conclusion' },
]

export const navLinks = sections.filter((s) => s.id !== 'predictions')
export const navOwner = { predictions: 'theory' }
