export function IBeamDiagram(_: { height: number; legWidth: number; waistThickness: number; legThickness: number; }) {
  // Fixed dimensions for diagram (smaller size)
  const fixedH = 120;
  const fixedB = 64;
  const fixedD = 10;
  const fixedT = 7;
  const padding = 20;
  const totalWidth = fixedB + padding * 2 + 50;
  const totalHeight = fixedH + padding * 2 + 50;

  return (
    <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="iBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#137fec" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#137fec" stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* 工字钢主体 - I 形状 - 双轴对称 */}
      <path
        d={`M ${padding} ${padding} L ${padding + fixedB} ${padding}
           L ${padding + fixedB} ${padding + fixedT}
           L ${padding + fixedB / 2 + fixedD / 2} ${padding + fixedT}
           L ${padding + fixedB / 2 + fixedD / 2} ${padding + fixedH - fixedT}
           L ${padding + fixedB} ${padding + fixedH - fixedT}
           L ${padding + fixedB} ${padding + fixedH}
           L ${padding} ${padding + fixedH}
           L ${padding} ${padding + fixedH - fixedT}
           L ${padding + fixedB / 2 - fixedD / 2} ${padding + fixedH - fixedT}
           L ${padding + fixedB / 2 - fixedD / 2} ${padding + fixedT}
           L ${padding} ${padding + fixedT}
           Z`}
        fill="url(#iBeamGradient)"
        stroke="#137fec"
        strokeWidth={2}
      />

      {/* 尺寸标注 - using letters */}
      {/* 高度标注 h */}
      <line x1={padding + fixedB + 35} y1={padding} x2={padding + fixedB + 35} y2={padding + fixedH} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedB + 30} y1={padding} x2={padding + fixedB + 40} y2={padding} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedB + 30} y1={padding + fixedH} x2={padding + fixedB + 40} y2={padding + fixedH} stroke="#60a5fa" strokeWidth={1} />
      <text x={padding + fixedB + 45} y={padding + fixedH / 2 + 3} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="start" dominantBaseline="middle">h</text>

      {/* 宽度标注 b */}
      <line x1={padding} y1={fixedH + padding + 30} x2={padding + fixedB} y2={fixedH + padding + 30} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding} y1={fixedH + padding + 25} x2={padding} y2={fixedH + padding + 35} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedB} y1={fixedH + padding + 25} x2={padding + fixedB} y2={fixedH + padding + 35} stroke="#60a5fa" strokeWidth={1} />
      <text x={padding + fixedB / 2} y={fixedH + padding + 45} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="middle">b</text>

      {/* 腰厚度标注 d */}
      <text x={padding + fixedB / 2} y={padding + fixedH / 2} fill="#60a5fa" fontSize={10} fontWeight="bold" textAnchor="middle">d</text>
    </svg>
  );
}
