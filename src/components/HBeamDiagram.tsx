interface HBeamDiagramProps {
  H: number;
  B: number;
  t1: number;
  t2: number;
}

export function HBeamDiagram(_: HBeamDiagramProps) {
  // Fixed dimensions for diagram (smaller size)
  const fixedH = 120;
  const fixedB = 96; // H型钢翼缘更宽
  const fixedT1 = 6;
  const fixedT2 = 7;

  const centerX = 100;
  const centerY = 100;

  const startX = centerX - fixedB / 2;
  const startY = centerY - fixedH / 2;

  const webLeftX = startX + (fixedB - fixedT1) / 2;
  const webRightX = startX + (fixedB + fixedT1) / 2;
  const webTopY = startY + fixedT2;
  const webBottomY = startY + fixedH - fixedT2;

  return (
    <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(19,127,236,0.3)] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* H-Beam Shape - Fixed dimensions */}
      <path
        d={`M ${startX} ${startY}
            L ${startX + fixedB} ${startY}
            L ${startX + fixedB} ${webTopY}
            L ${webRightX} ${webTopY}
            L ${webRightX} ${webBottomY}
            L ${startX + fixedB} ${webBottomY}
            L ${startX + fixedB} ${startY + fixedH}
            L ${startX} ${startY + fixedH}
            L ${startX} ${webBottomY}
            L ${webLeftX} ${webBottomY}
            L ${webLeftX} ${webTopY}
            L ${startX} ${webTopY} Z`}
        fill="url(#beamGradient)"
        stroke="#137fec"
        strokeWidth="2"
      />

      {/* Dimension Lines - using letters */}
      {/* Height H */}
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={startX + fixedB + 10}
        x2={startX + fixedB + 10}
        y1={startY}
        y2={startY + fixedH}
      />
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={startX + fixedB + 5}
        y1={startY}
        x2={startX + fixedB + 15}
        y2={startY}
      />
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={startX + fixedB + 5}
        y1={startY + fixedH}
        x2={startX + fixedB + 15}
        y2={startY + fixedH}
      />
      <text
        fill="#60a5fa"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize="12"
        x={startX + fixedB + 18}
        y={centerY}
        textAnchor="start"
        dominantBaseline="middle"
      >H</text>

      {/* Width B */}
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={startX}
        x2={startX + fixedB}
        y1={startY - 10}
        y2={startY - 10}
      />
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={startX}
        y1={startY - 15}
        x2={startX}
        y2={startY - 5}
      />
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={startX + fixedB}
        y1={startY - 15}
        x2={startX + fixedB}
        y2={startY - 5}
      />
      <text
        fill="#60a5fa"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize="12"
        x={centerX}
        y={startY - 18}
        textAnchor="middle"
      >B</text>

      {/* Web thickness t1 */}
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={webLeftX}
        x2={webRightX}
        y1={webTopY + 5}
        y2={webTopY + 5}
      />
      <text
        fill="#60a5fa"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize="10"
        x={centerX}
        y={webTopY + 8}
        textAnchor="middle"
      >t1</text>

      {/* Flange thickness t2 */}
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={webRightX + 5}
        x2={webRightX + 5}
        y1={startY}
        y2={startY + fixedT2}
      />
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={webRightX + 3}
        y1={startY}
        x2={webRightX + 7}
        y2={startY}
      />
      <line
        stroke="#60a5fa"
        strokeWidth="1"
        x1={webRightX + 3}
        y1={startY + fixedT2}
        x2={webRightX + 7}
        y2={startY + fixedT2}
      />
      <text
        fill="#60a5fa"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize="10"
        x={webRightX + 12}
        y={startY + fixedT2 / 2}
        dominantBaseline="middle"
      >t2</text>
    </svg>
  );
}
