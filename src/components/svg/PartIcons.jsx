// Line drawings of every part and tool, in the page palette.
// Shared classes: .ln (ink outline), .f-* fills. All 160 x 100 unless noted.

const Svg = ({ children, label, vb = '0 0 160 100' }) => (
  <svg className="part-svg" viewBox={vb} role="img" aria-label={label}>
    {children}
  </svg>
)

export const WireSpool = () => (
  <Svg label="Spool of enamelled copper wire">
    <ellipse className="ln f-gray100" cx="48" cy="50" rx="14" ry="38" />
    <rect className="f-o300" x="48" y="22" width="64" height="56" />
    {Array.from({ length: 15 }, (_, i) => (
      <line key={i} className="ln-thin s-o600" x1={52 + i * 4} y1="22" x2={52 + i * 4} y2="78" />
    ))}
    <line className="ln" x1="48" y1="22" x2="112" y2="22" />
    <line className="ln" x1="48" y1="78" x2="112" y2="78" />
    <ellipse className="ln f-gray100" cx="112" cy="50" rx="14" ry="38" />
    <ellipse className="ln f-ink" cx="112" cy="50" rx="4" ry="10" />
    <path className="ln s-o600" d="M112 24 C 132 20 140 40 152 34" fill="none" />
  </Svg>
)

export const Pipe = () => (
  <Svg label="50 mm PVC pipe">
    <path className="ln f-gray100" d="M30 30 H130 A10 20 0 0 1 130 70 H30 Z" />
    <ellipse className="ln f-paper" cx="30" cy="50" rx="10" ry="20" />
    <ellipse className="ln f-gray" cx="30" cy="50" rx="7" ry="15" />
    <path className="ln-thin" d="M44 38 H120" opacity=".5" />
    <text className="t-dim" x="80" y="92" textAnchor="middle">⌀ 50 mm</text>
  </Svg>
)

export const VarCap = () => (
  <Svg label="Variable tuning capacitor, AM section">
    <rect className="ln f-teal50" x="34" y="22" width="80" height="54" rx="4" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} className="ln-thin f-gray" d={`M50 ${34 + i * 8} a 22 6 0 0 1 44 0 Z`} />
    ))}
    <rect className="ln f-gray100" x="114" y="44" width="30" height="8" />
    <circle className="ln f-ink" cx="146" cy="48" r="3" />
    {[48, 66, 84, 100].map((x) => (
      <line key={x} className="ln" x1={x} y1="76" x2={x} y2="94" />
    ))}
    <path className="ln s-o600" d="M30 84 L118 10" />
    <path className="ln s-o600" d="M106 10 H118 V22" fill="none" />
  </Svg>
)

export const Diode = () => (
  <Svg label="1N60P germanium diode, band marks the cathode">
    <line className="ln" x1="10" y1="50" x2="50" y2="50" />
    <line className="ln" x1="110" y1="50" x2="150" y2="50" />
    <rect className="ln f-teal50" x="50" y="38" width="60" height="24" rx="10" />
    <rect className="f-ink" x="92" y="38" width="8" height="24" />
    <path className="ln-thin" d="M62 50 h20 M76 44 l6 6 -6 6" fill="none" />
    <text className="t-dim" x="80" y="82" textAnchor="middle">1N60P · band → TP3</text>
  </Svg>
)

export const Resistor = () => (
  <Svg label="15 kilo-ohm resistor: brown, green, orange, gold bands">
    <line className="ln" x1="10" y1="50" x2="46" y2="50" />
    <line className="ln" x1="114" y1="50" x2="150" y2="50" />
    <path className="ln f-o50" d="M46 38 q6 -4 12 0 h44 q6 -4 12 0 v24 q-6 4 -12 0 h-44 q-6 4 -12 0 Z" />
    <rect x="60" y="36" width="6" height="28" fill="#6B3A1E" />
    <rect x="72" y="36" width="6" height="28" fill="#2E7D32" />
    <rect x="84" y="36" width="6" height="28" fill="#FF5321" />
    <rect x="100" y="36" width="5" height="28" fill="#C9A227" />
    <text className="t-dim" x="80" y="84" textAnchor="middle">15 kΩ</text>
  </Svg>
)

export const CeramicCap = () => (
  <Svg label="3.3 nF ceramic capacitor, marked 332">
    <line className="ln" x1="70" y1="62" x2="64" y2="96" />
    <line className="ln" x1="90" y1="62" x2="96" y2="96" />
    <ellipse className="ln f-teal" cx="80" cy="42" rx="28" ry="26" />
    <text className="t-ink" x="80" y="48" textAnchor="middle">332</text>
  </Svg>
)

export const Breadboard = () => (
  <Svg label="Breadboard">
    <rect className="ln f-paper" x="10" y="14" width="140" height="72" rx="4" />
    <line className="s-orange ln-thin" x1="18" y1="20" x2="142" y2="20" />
    <line className="s-teal ln-thin" x1="18" y1="80" x2="142" y2="80" />
    <rect className="f-gray100" x="10" y="47" width="140" height="6" />
    {Array.from({ length: 16 }, (_, c) =>
      [26, 32, 38, 60, 66, 72].map((y) => <rect key={`${c}-${y}`} className="f-ink" x={20 + c * 8} y={y} width="2.4" height="2.4" />),
    )}
    <path className="ln s-o600" d="M28 33 C 40 4 70 4 84 33" fill="none" />
  </Svg>
)

export const Tape = () => (
  <Svg label="Roll of tape">
    <circle className="ln f-orange" cx="70" cy="50" r="34" />
    <circle className="ln f-paper" cx="70" cy="50" r="16" />
    <path className="ln f-orange" d="M98 70 L140 82 L136 92 L94 78 Z" />
  </Svg>
)

export const FuncGen = () => (
  <Svg label="Function generator showing 834.0 kHz">
    <rect className="ln f-gray100" x="8" y="18" width="144" height="66" rx="4" />
    <rect className="f-ink" x="18" y="28" width="66" height="24" rx="2" />
    <text className="t-led" x="51" y="45" textAnchor="middle">834.0 kHz</text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} className="ln-thin f-paper" x={18 + i * 17} y="60" width="13" height="8" rx="1" />
    ))}
    <circle className="ln f-gray" cx="104" cy="40" r="11" />
    <line className="ln" x1="104" y1="40" x2="110" y2="33" />
    <circle className="ln f-gray" cx="132" cy="40" r="8" />
    <circle className="ln f-ink" cx="104" cy="70" r="5" />
    <circle className="ln f-ink" cx="132" cy="70" r="5" />
  </Svg>
)

export const Scope = () => (
  <Svg label="Oscilloscope">
    <rect className="ln f-gray100" x="8" y="14" width="144" height="74" rx="4" />
    <rect className="f-ink" x="16" y="22" width="84" height="56" rx="2" />
    {[1, 2, 3].map((i) => (
      <line key={i} className="s-grid" x1={16 + i * 21} y1="22" x2={16 + i * 21} y2="78" />
    ))}
    <line className="s-grid" x1="16" y1="50" x2="100" y2="50" />
    <path className="s-teal ln" d="M16 50 q5.25 -20 10.5 0 t10.5 0 t10.5 0 t10.5 0 t10.5 0 t10.5 0 t10.5 0 t10.5 0" fill="none" />
    {[0, 1, 2].map((r) =>
      [0, 1].map((c) => <circle key={`${r}${c}`} className="ln-thin f-gray" cx={116 + c * 20} cy={32 + r * 18} r="6" />),
    )}
  </Svg>
)

export const Multimeter = () => (
  <Svg label="Digital multimeter reading 0.28 nF">
    <rect className="ln f-orange" x="48" y="6" width="64" height="90" rx="8" />
    <rect className="ln f-teal50" x="56" y="14" width="48" height="20" rx="2" />
    <text className="t-ink t-mono" x="80" y="28.5" textAnchor="middle" style={{ fontSize: 9.5 }}>0.28 nF</text>
    <circle className="ln f-gray100" cx="80" cy="56" r="13" />
    <line className="ln" x1="80" y1="56" x2="88" y2="47" />
    <circle className="ln f-ink" cx="64" cy="84" r="4" />
    <circle className="ln f-ink" cx="96" cy="84" r="4" />
    <path className="ln" d="M64 88 C 50 100 20 96 14 70" fill="none" />
    <path className="ln" d="M96 88 C 110 100 140 96 146 70" fill="none" />
  </Svg>
)

export const Sandpaper = () => (
  <Svg label="Sandpaper and a blade">
    <rect className="ln f-o50" x="16" y="18" width="70" height="64" rx="3" />
    {Array.from({ length: 40 }, (_, i) => (
      <circle key={i} className="f-o600" cx={22 + ((i * 37) % 60)} cy={24 + ((i * 23) % 54)} r="1.2" />
    ))}
    <path className="ln f-gray100" d="M100 70 L148 24 L154 30 L108 78 Z" />
    <path className="ln f-ink" d="M92 78 L104 66 L112 74 L100 86 Z" />
  </Svg>
)

export const Esp32 = () => (
  <Svg label="ESP32 development board">
    <rect className="ln f-ink" x="16" y="20" width="128" height="60" rx="3" />
    <rect className="ln-light f-gray" x="70" y="28" width="56" height="40" rx="2" />
    <text className="t-ink t-mono" x="98" y="52" textAnchor="middle">ESP32</text>
    <path className="s-teal ln" d="M126 32 h10 v8 h-8 v8 h8" fill="none" />
    {Array.from({ length: 15 }, (_, i) => (
      <g key={i}>
        <rect className="f-gray" x={22 + i * 8} y="16" width="3" height="6" />
        <rect className="f-gray" x={22 + i * 8} y="78" width="3" height="6" />
      </g>
    ))}
    <rect className="f-orange" x="36" y="34" width="10" height="10" />
    <text className="t-dim-l" x="41" y="62" textAnchor="middle">GPIO 26</text>
  </Svg>
)
