export function UnequalAngleDiagram({ longEdge: _longEdge, shortEdge: _shortEdge, thickness: _thickness }: { longEdge: number; shortEdge: number; thickness: number }) {
  // Fixed dimensions for diagram (smaller size) - B is longer, b is shorter
  const fixedLong = 120;
  const fixedShort = 72;
  const fixedThickness = 15;
  const padding = 20;
  const totalWidth = fixedLong + padding * 2 + 50;
  const totalHeight = fixedLong + padding * 2 + 50;

  return (
    <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="unequalAngleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#137fec" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#137fec" stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* L型不等边角钢 - Fixed dimensions */}
      <path
        d={`M ${padding} ${padding} L ${padding + fixedLong} ${padding} L ${padding + fixedLong} ${padding + fixedThickness} L ${padding + fixedThickness} ${padding + fixedThickness} L ${padding + fixedThickness} ${padding + fixedShort} L ${padding} ${padding + fixedShort} Z`}
        fill="url(#unequalAngleGradient)"
        stroke="#137fec"
        strokeWidth={2}
      />

      {/* 尺寸标注 - using letters */}
      {/* 长边标注 B */}
      <line x1={padding} y1={fixedLong + padding + 30} x2={padding + fixedLong} y2={fixedLong + padding + 30} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding} y1={fixedLong + padding + 25} x2={padding} y2={fixedLong + padding + 35} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedLong} y1={fixedLong + padding + 25} x2={padding + fixedLong} y2={fixedLong + padding + 35} stroke="#60a5fa" strokeWidth={1} />
      <text x={padding + fixedLong / 2} y={fixedLong + padding + 45} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="middle">B</text>

      {/* 短边标注 b */}
      <line x1={fixedLong + padding + 30} y1={padding} x2={fixedLong + padding + 30} y2={padding + fixedShort} stroke="#60a5fa" strokeWidth={1} />
      <line x1={fixedLong + padding + 25} y1={padding} x2={fixedLong + padding + 35} y2={padding} stroke="#60a5fa" strokeWidth={1} />
      <line x1={fixedLong + padding + 25} y1={padding + fixedShort} x2={fixedLong + padding + 35} y2={padding + fixedShort} stroke="#60a5fa" strokeWidth={1} />
      <text x={fixedLong + padding + 40} y={padding + fixedShort / 2 + 3} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="start" dominantBaseline="middle">b</text>

      {/* 厚度标注 d */}
      <text x={padding + fixedThickness / 2 + 4} y={padding + fixedThickness / 2 + 4} fill="#60a5fa" fontSize={10} fontWeight="bold" textAnchor="middle">d</text>
    </svg>
  );
}
