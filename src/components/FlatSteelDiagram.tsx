export function FlatSteelDiagram({ width: _width, thickness: _thickness }: { width: number; thickness: number }) {
  // Fixed dimensions (smaller size)
  const fixedWidth = 180;
  const fixedThickness = 36;
  const padding = 20;
  const viewWidth = fixedWidth + padding * 2 + 60;
  const viewHeight = fixedThickness + padding * 2 + 50;

  return (
    <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="flatSteelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#137fec" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#137fec" stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* 扁钢主体 - 固定尺寸 */}
      <rect
        x={padding}
        y={padding}
        width={fixedWidth}
        height={fixedThickness}
        fill="url(#flatSteelGradient)"
        stroke="#137fec"
        strokeWidth={2}
        rx={1}
      />

      {/* 尺寸标注 - 使用字母 */}
      {/* 宽度标注 */}
      <line x1={padding} y1={padding + fixedThickness + 20} x2={padding + fixedWidth} y2={padding + fixedThickness + 20} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding} y1={padding + fixedThickness + 15} x2={padding} y2={padding + fixedThickness + 25} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedWidth} y1={padding + fixedThickness + 15} x2={padding + fixedWidth} y2={padding + fixedThickness + 25} stroke="#60a5fa" strokeWidth={1} />
      <text x={padding + fixedWidth / 2} y={padding + fixedThickness + 35} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="middle">b</text>

      {/* 厚度标注 */}
      <line x1={padding + fixedWidth + 20} y1={padding} x2={padding + fixedWidth + 20} y2={padding + fixedThickness} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedWidth + 15} y1={padding} x2={padding + fixedWidth + 25} y2={padding} stroke="#60a5fa" strokeWidth={1} />
      <line x1={padding + fixedWidth + 15} y1={padding + fixedThickness} x2={padding + fixedWidth + 25} y2={padding + fixedThickness} stroke="#60a5fa" strokeWidth={1} />
      <text x={padding + fixedWidth + 30} y={padding + fixedThickness / 2 + 3} fill="#60a5fa" fontSize={12} fontWeight="bold" textAnchor="start" dominantBaseline="middle">t</text>
    </svg>
  );
}
