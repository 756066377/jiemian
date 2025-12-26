export function EqualAngleDiagram({ edgeWidth: _edgeWidth, thickness: _thickness }: { edgeWidth: number; thickness: number }) {
  // Fixed dimensions for diagram (smaller size)
  const fixedEdge = 120;
  const fixedThickness = 15;
  const padding = 20;
  const totalSize = fixedEdge + padding * 2 + 60;

  return (
    <svg viewBox={`0 0 ${totalSize} ${totalSize}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="equalAngleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#137fec" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#137fec" stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* L型等边角钢 - Fixed dimensions */}
      <path
        d={`M ${padding} ${padding} L ${padding + fixedEdge} ${padding} L ${padding + fixedEdge} ${padding + fixedThickness} L ${padding + fixedThickness} ${padding + fixedThickness} L ${padding + fixedThickness} ${padding + fixedEdge} L ${padding} ${padding + fixedEdge} Z`}
        fill="url(#equalAngleGradient)"
        stroke="#137fec"
        strokeWidth={2}
      />

      {/* 尺寸标注 - using letters */}
      {/* 顶部边宽标注 b */}
      <line x1={padding} y1={fixedEdge + padding + 30} x2={padding + fixedEdge} y2={fixedEdge + padding + 30} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding} y1={fixedEdge + padding + 25} x2={padding} y2={fixedEdge + padding + 35} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedEdge} y1={fixedEdge + padding + 25} x2={padding + fixedEdge} y2={fixedEdge + padding + 35} stroke="#60a5fa" strokeWidth={1} />
      <text x={padding + fixedEdge / 2} y={fixedEdge + padding + 45} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="middle">b</text>

      {/* 右侧边宽标注 b */}
      <line x1={fixedEdge + padding + 30} y1={padding} x2={fixedEdge + padding + 30} y2={padding + fixedEdge} stroke="#60a5fa" strokeWidth={1} />
      <line x1={fixedEdge + padding + 25} y1={padding} x2={fixedEdge + padding + 35} y2={padding} stroke="#60a5fa" strokeWidth={1} />
      <line x1={fixedEdge + padding + 25} y1={padding + fixedEdge} x2={fixedEdge + padding + 35} y2={padding + fixedEdge} stroke="#60a5fa" strokeWidth={1} />
      <text x={fixedEdge + padding + 40} y={padding + fixedEdge / 2 + 3} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="start" dominantBaseline="middle">b</text>

      {/* 厚度标注 d */}
      <text x={padding + fixedThickness / 2 + 4} y={padding + fixedThickness / 2 + 4} fill="#60a5fa" fontSize={10} fontWeight="bold" textAnchor="middle">d</text>
    </svg>
  );
}
