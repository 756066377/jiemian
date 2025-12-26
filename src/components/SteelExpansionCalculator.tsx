import { useState, useMemo } from 'react';
import { 
  CalculationMode, 
  TemplateType, 
  BendDirection, 
  MaterialType,
  ExperienceInput,
  KFactorInput
} from '../types/steelExpansion';
import { 
  calculateByExperience, 
  calculateByKFactor, 
  validateInput,
  toFixed2
} from '../utils/steelExpansionCalculation';

export default function SteelExpansionCalculator() {
  const [mode, setMode] = useState<CalculationMode>('experience');
  const [templateType, setTemplateType] = useState<TemplateType>('L');
  const [edgeA, setEdgeA] = useState('100');
  const [edgeB, setEdgeB] = useState('50');
  const [edgeC, setEdgeC] = useState('50');
  const [thickness, setThickness] = useState('5');
  const [direction, setDirection] = useState<BendDirection>('up');
  
  // 经验扣除法参数
  const [material, setMaterial] = useState<MaterialType>('carbon_5mm');
  const [customDeduction, setCustomDeduction] = useState('');
  
  // K-Factor法参数
  const [angle, setAngle] = useState('90');
  const [innerRadius, setInnerRadius] = useState('3');
  const [kFactor, setKFactor] = useState('0.33');

  // 计算结果
  const result = useMemo(() => {
    const edgeANum = parseFloat(edgeA) || 0;
    const edgeBNum = parseFloat(edgeB) || 0;
    const edgeCNum = parseFloat(edgeC) || 0;
    const thicknessNum = parseFloat(thickness) || 0;

    if (mode === 'experience') {
      const input: ExperienceInput = {
        templateType,
        edgeA: edgeANum,
        edgeB: templateType === 'U' ? edgeBNum : edgeBNum,
        edgeC: templateType === 'U' ? edgeCNum : undefined,
        thickness: thicknessNum,
        material,
        customDeduction: customDeduction ? parseFloat(customDeduction) : undefined,
        direction
      };
      return calculateByExperience(input);
    } else {
      const input: KFactorInput = {
        templateType,
        edgeA: edgeANum,
        edgeB: templateType === 'U' ? edgeBNum : edgeBNum,
        edgeC: templateType === 'U' ? edgeCNum : undefined,
        thickness: thicknessNum,
        angle: parseFloat(angle) || 90,
        innerRadius: parseFloat(innerRadius) || 0,
        kFactor: parseFloat(kFactor) || 0.33,
        direction
      };
      return calculateByKFactor(input);
    }
  }, [mode, templateType, edgeA, edgeB, edgeC, thickness, direction, material, customDeduction, angle, innerRadius, kFactor]);

  // 验证警告
  const warnings = useMemo(() => {
    const edgeANum = parseFloat(edgeA) || 0;
    const edgeBNum = parseFloat(edgeB) || 0;
    const edgeCNum = parseFloat(edgeC) || 0;
    const thicknessNum = parseFloat(thickness) || 0;

    if (mode === 'experience') {
      const input: ExperienceInput = {
        templateType,
        edgeA: edgeANum,
        edgeB: templateType === 'U' ? edgeBNum : edgeBNum,
        edgeC: templateType === 'U' ? edgeCNum : undefined,
        thickness: thicknessNum,
        material,
        customDeduction: customDeduction ? parseFloat(customDeduction) : undefined,
        direction
      };
      return validateInput(input, 'experience');
    } else {
      const input: KFactorInput = {
        templateType,
        edgeA: edgeANum,
        edgeB: templateType === 'U' ? edgeBNum : edgeBNum,
        edgeC: templateType === 'U' ? edgeCNum : undefined,
        thickness: thicknessNum,
        angle: parseFloat(angle) || 90,
        innerRadius: parseFloat(innerRadius) || 0,
        kFactor: parseFloat(kFactor) || 0.33,
        direction
      };
      return validateInput(input, 'kfactor');
    }
  }, [mode, templateType, edgeA, edgeB, edgeC, thickness, direction, material, customDeduction, angle, innerRadius, kFactor]);

  // 生成SVG预览
  const svgPreview = useMemo(() => {
    const thicknessNum = parseFloat(thickness) || 0;
    const strokeWidth = Math.min(Math.max(thicknessNum, 3), 8); // 限制线宽范围
    
    const fixedSize = 120; // 固定画布大小
    
    if (templateType === 'L') {
      // L型预览 - 固定示意图
      const width = 80; // 固定宽度
      const height = 70; // 固定高度
      const startX = (fixedSize - width) / 2;
      const startY = (fixedSize - height) / 2;
      
      return (
        <svg viewBox={`0 0 ${fixedSize} ${fixedSize}`} className="w-full h-auto max-w-[200px]">
          <g transform={`translate(${startX}, ${startY})`}>
            {/* 正面（蓝色） */}
            <path
              d={`M 0 0 L ${width} 0 L ${width} ${height}`}
              stroke={direction === 'up' ? '#3B82F6' : '#9CA3AF'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            {/* 背面（灰色虚线） */}
            <path
              d={`M 0 0 L 0 ${height}`}
              stroke={direction === 'up' ? '#9CA3AF' : '#3B82F6'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray="4 2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            {/* 字母标注 */}
            <text x={width / 2} y={-8} textAnchor="middle" className="text-xs fill-white" fontSize="14" fontWeight="bold">
              A
            </text>
            <text x={-8} y={height / 2} textAnchor="middle" className="text-xs fill-white" fontSize="14" fontWeight="bold">
              B
            </text>
          </g>
        </svg>
      );
    } else {
      // U型预览 - 固定示意图
      const width = 80; // 固定宽度
      const height = 80; // 固定高度
      const bendY = 40; // 折弯位置（中间）
      const startX = (fixedSize - width) / 2;
      const startY = (fixedSize - height) / 2;
      
      return (
        <svg viewBox={`0 0 ${fixedSize} ${fixedSize}`} className="w-full h-auto max-w-[200px]">
          <g transform={`translate(${startX}, ${startY})`}>
            {/* 正面（蓝色）- U形底部和右侧 */}
            <path
              d={`M 0 ${bendY} L ${width} ${bendY} L ${width} ${height}`}
              stroke={direction === 'up' ? '#3B82F6' : '#9CA3AF'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            {/* 背面（灰色虚线）- U形左侧 */}
            <path
              d={`M 0 0 L 0 ${bendY}`}
              stroke={direction === 'up' ? '#9CA3AF' : '#3B82F6'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray="4 2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            {/* 字母标注 */}
            <text x={width / 2} y={bendY - 8} textAnchor="middle" className="text-xs fill-white" fontSize="14" fontWeight="bold">
              A
            </text>
            <text x={-8} y={bendY / 2} textAnchor="middle" className="text-xs fill-white" fontSize="14" fontWeight="bold">
              C
            </text>
            <text x={-8} y={bendY + (height - bendY) / 2} textAnchor="middle" className="text-xs fill-white" fontSize="14" fontWeight="bold">
              B
            </text>
          </g>
        </svg>
      );
    }
  }, [templateType, thickness, direction]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      {/* 标题栏 */}
      <div className="glass-panel rounded-xl p-4">
        <h2 className="text-xl font-bold text-white mb-4">钢板展开计算器</h2>

        {/* 计算模式选择 */}
        <div className="join mb-4 w-full">
          <button
            onClick={() => setMode('experience')}
            className={`btn join-item flex-1 px-4 py-2 ${
              mode === 'experience'
                ? 'bg-primary hover:bg-primary/90 text-white border-primary'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
            }`}
          >
            经验扣除法
          </button>
          <button
            onClick={() => setMode('kfactor')}
            className={`btn join-item flex-1 px-4 py-2 ${
              mode === 'kfactor'
                ? 'bg-primary hover:bg-primary/90 text-white border-primary'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
            }`}
          >
            K-Factor法
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* 左侧输入面板 */}
        <div className="w-1/2 glass-panel rounded-xl p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* 模板类型 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                模板类型
              </label>
              <div className="join w-full">
                <button
                  onClick={() => setTemplateType('L')}
                  className={`btn join-item flex-1 px-4 py-2 ${
                    templateType === 'L'
                      ? 'bg-primary hover:bg-primary/90 text-white border-primary'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                  }`}
                >
                  L型
                </button>
                <button
                  onClick={() => setTemplateType('U')}
                  className={`btn join-item flex-1 px-4 py-2 ${
                    templateType === 'U'
                      ? 'bg-primary hover:bg-primary/90 text-white border-primary'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                  }`}
                >
                  U型
                </button>
              </div>
            </div>

            {/* 折弯方向 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                折弯方向
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDirection('up')}
                  className={`btn flex-1 px-4 py-2 ${
                    direction === 'up'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                  }`}
                >
                  上折（蓝色正面）
                </button>
                <button
                  onClick={() => setDirection('down')}
                  className={`btn flex-1 px-4 py-2 ${
                    direction === 'down'
                      ? 'bg-slate-500 hover:bg-slate-600 text-white border-slate-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                  }`}
                >
                  下折（灰色背面）
                </button>
              </div>
            </div>

            {/* 尺寸输入 */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  A边长（mm）
                </label>
                <input
                  type="number"
                  value={edgeA}
                  onChange={(e) => setEdgeA(e.target.value)}
                  className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                    warnings.some(w => w.field === 'edgeA' && w.severity === 'error')
                      ? '!border-error'
                      : ''
                  }`}
                  placeholder="请输入A边长"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {templateType === 'U' ? 'B边长（mm）' : 'B边长（mm）'}
                </label>
                <input
                  type="number"
                  value={edgeB}
                  onChange={(e) => setEdgeB(e.target.value)}
                  className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                    warnings.some(w => w.field === 'edgeB' && w.severity === 'error')
                      ? '!border-error'
                      : ''
                  }`}
                  placeholder="请输入B边长"
                />
              </div>

              {templateType === 'U' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    C边长（mm）
                  </label>
                  <input
                    type="number"
                    value={edgeC}
                    onChange={(e) => setEdgeC(e.target.value)}
                    className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                      warnings.some(w => w.field === 'edgeC' && w.severity === 'error')
                        ? '!border-error'
                        : ''
                    }`}
                    placeholder="请输入C边长"
                  />
                </div>
              )}
            </div>

            {/* 板厚 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                板厚（mm）
              </label>
              <input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                  warnings.some(w => w.field === 'thickness' && w.severity === 'error')
                    ? '!border-error'
                    : ''
                }`}
                placeholder="请输入板厚"
              />
            </div>

            {/* 模式A：经验扣除法参数 */}
            {mode === 'experience' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    材质
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as MaterialType)}
                    className="select select-bordered w-full select-sm bg-slate-800 text-white border-white/20 focus:border-primary"
                  >
                    <option value="carbon_5mm">5mm碳钢（扣除8.5）</option>
                    <option value="carbon_10mm">10mm碳钢（扣除17）</option>
                    <option value="stainless">不锈钢（需自定义）</option>
                    <option value="aluminum">铝板（需自定义）</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>

                {(material === 'stainless' || material === 'aluminum' || material === 'custom') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      自定义扣除值（mm）
                    </label>
                    <input
                      type="number"
                      value={customDeduction}
                      onChange={(e) => setCustomDeduction(e.target.value)}
                      className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                        warnings.some(w => w.field === 'customDeduction' && w.severity === 'error')
                          ? '!border-error'
                          : ''
                      }`}
                      placeholder="请输入自定义扣除值"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 模式B：K-Factor法参数 */}
            {mode === 'kfactor' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    折弯角度（°）
                  </label>
                  <input
                    type="number"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                      warnings.some(w => w.field === 'angle' && w.severity === 'error')
                        ? '!border-error'
                        : ''
                    }`}
                    placeholder="请输入角度"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    内R（mm）
                  </label>
                  <input
                    type="number"
                    value={innerRadius}
                    onChange={(e) => setInnerRadius(e.target.value)}
                    className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                      warnings.some(w => w.field === 'innerRadius' && w.severity === 'error')
                        ? '!border-error'
                        : ''
                    }`}
                    placeholder="请输入内R"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    K因子
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={kFactor}
                    onChange={(e) => setKFactor(e.target.value)}
                    className={`input input-bordered input-sm w-full bg-slate-800 text-white border-white/20 focus:border-primary ${
                      warnings.some(w => w.field === 'kFactor' && w.severity === 'error')
                        ? '!border-error'
                        : ''
                    }`}
                    placeholder="请输入K因子（0-0.5）"
                  />
                </div>
              </div>
            )}

            {/* 警告信息 */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`alert text-sm ${
                      warning.severity === 'error'
                        ? 'alert-error'
                        : 'alert-warning'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      {warning.severity === 'error' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      )}
                    </svg>
                    <span>{warning.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧预览和结果面板 */}
        <div className="w-1/2 glass-panel rounded-xl p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* SVG预览 */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">实时预览</h3>
              <div className="card bg-slate-900 border border-slate-700">
                <div className="card-body p-6 min-h-[200px] flex items-center justify-center">
                  {svgPreview}
                </div>
              </div>
            </div>

            {/* 计算结果 */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">计算结果</h3>
              {result.isValid ? (
                <div className="space-y-3">
                  <div className="card bg-primary/10 border border-primary/20">
                    <div className="card-body p-4">
                      <h2 className="card-title text-sm text-slate-400">展开总长</h2>
                      <div className="text-3xl font-bold text-primary">
                        {toFixed2(result.totalLength)} mm
                      </div>
                    </div>
                  </div>

                  {/* 计算明细 */}
                  <div className="card bg-white/5 border border-white/10">
                    <div className="card-body p-4">
                      <h2 className="card-title text-sm text-slate-300 mb-2">计算明细</h2>
                      <div className="space-y-1">
                        {result.breakdown.map((line, index) => (
                          <div key={index} className="text-xs text-slate-400 font-mono">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 警告信息 */}
                  {result.warnings.length > 0 && (
                    <div className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <div
                          key={index}
                          className="alert alert-warning text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-error text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>参数错误，请检查输入</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
