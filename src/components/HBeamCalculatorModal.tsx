import { useState, useEffect } from 'react';

interface HBeamCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InputDimensions {
  height_mm: number;
  width_mm: number;
  web_thickness_mm: number;
  flange_thickness_mm: number;
}

interface CalculatedResults {
  section_area_cm2: number;
  theoretical_weight_kg_per_m: number;
  Ix: number;
  Iy: number;
  Wx: number;
  Wy: number;
  ix: number;
  iy: number;
  S: number;
}

export function HBeamCalculatorModal({ isOpen, onClose }: HBeamCalculatorModalProps) {
  const [dimensions, setDimensions] = useState<InputDimensions>({
    height_mm: 0,
    width_mm: 0,
    web_thickness_mm: 0,
    flange_thickness_mm: 0,
  });

  const [results, setResults] = useState<CalculatedResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleCalculate = () => {
    const H = dimensions.height_mm;
    const B = dimensions.width_mm;
    const t1 = dimensions.web_thickness_mm;
    const t2 = dimensions.flange_thickness_mm;

    // 计算截面面积 A (cm²)
    const A = (B * t1 + (H - t1) * t2) / 10;

    // 计算理论重量 (kg/m) - 钢材密度取 7.85 g/cm³
    const weight = A * 7.85 / 10;

    // 计算惯性矩 Ix, Iy (cm⁴)
    const Ix = (B * t2 * 2) * Math.pow((H / 10 - t2 / 10) / 2, 2) + (t1 / 10) * Math.pow((H / 10) - 2 * (t2 / 10), 3) / 12;
    const Iy = (2 * t2 * Math.pow(B, 3)) / 12000 + ((H - 2 * t2) * Math.pow(t1, 3)) / 12000;

    // 计算截面模量 Wx, Wy (cm³)
    const Wx = Ix / (H / 20);
    const Wy = Iy / (B / 20);

    // 计算回转半径 ix, iy (cm)
    const ix = Math.sqrt(Ix / A);
    const iy = Math.sqrt(Iy / A);

    // 计算外表面积 S (m²/m)
    const S = (2 * (H + B)) / 1000;

    setResults({
      section_area_cm2: parseFloat(A.toFixed(2)),
      theoretical_weight_kg_per_m: parseFloat(weight.toFixed(2)),
      Ix: parseFloat(Ix.toFixed(0)),
      Iy: parseFloat(Iy.toFixed(0)),
      Wx: parseFloat(Wx.toFixed(0)),
      Wy: parseFloat(Wy.toFixed(0)),
      ix: parseFloat(ix.toFixed(2)),
      iy: parseFloat(iy.toFixed(2)),
      S: parseFloat(S.toFixed(2)),
    });
    setHasCalculated(true);
  };

  const handleReset = () => {
    setDimensions({
      height_mm: 0,
      width_mm: 0,
      web_thickness_mm: 0,
      flange_thickness_mm: 0,
    });
    setResults(null);
    setHasCalculated(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-[#1a2332] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 transform ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">calculate</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">H型钢截面特性计算器</h3>
              <p className="text-xs text-slate-400 mt-0.5">输入外形尺寸，自动计算各项几何特性</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* 内容 */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：输入区域 */}
              <div className="space-y-5">
                <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl">
                  <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg">edit</span>
                    </div>
                    外形尺寸输入
                  </h4>
                  <div className="space-y-4.5">
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 flex items-center justify-between">
                        <span className="font-medium">截面高度 (H)</span>
                        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">h</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          value={dimensions.height_mm || ''}
                          onChange={(e) => setDimensions({ ...dimensions, height_mm: parseFloat(e.target.value) || 0 })}
                          placeholder="例如: 200"
                          className="w-full px-4 py-3 bg-[#0f151c] border border-white/10 rounded-xl text-white text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-mono group-hover:border-white/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium bg-[#0f151c] px-2 py-1 rounded-lg">mm</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-2 flex items-center justify-between">
                        <span className="font-medium">截面宽度 (B)</span>
                        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">b</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          value={dimensions.width_mm || ''}
                          onChange={(e) => setDimensions({ ...dimensions, width_mm: parseFloat(e.target.value) || 0 })}
                          placeholder="例如: 200"
                          className="w-full px-4 py-3 bg-[#0f151c] border border-white/10 rounded-xl text-white text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-mono group-hover:border-white/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium bg-[#0f151c] px-2 py-1 rounded-lg">mm</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-2 flex items-center justify-between">
                        <span className="font-medium">腹板厚度 (t₁)</span>
                        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">tw</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          value={dimensions.web_thickness_mm || ''}
                          onChange={(e) => setDimensions({ ...dimensions, web_thickness_mm: parseFloat(e.target.value) || 0 })}
                          placeholder="例如: 8"
                          className="w-full px-4 py-3 bg-[#0f151c] border border-white/10 rounded-xl text-white text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-mono group-hover:border-white/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium bg-[#0f151c] px-2 py-1 rounded-lg">mm</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-2 flex items-center justify-between">
                        <span className="font-medium">翼缘厚度 (t₂)</span>
                        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">tf</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          value={dimensions.flange_thickness_mm || ''}
                          onChange={(e) => setDimensions({ ...dimensions, flange_thickness_mm: parseFloat(e.target.value) || 0 })}
                          placeholder="例如: 12"
                          className="w-full px-4 py-3 bg-[#0f151c] border border-white/10 rounded-xl text-white text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-mono group-hover:border-white/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium bg-[#0f151c] px-2 py-1 rounded-lg">mm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCalculate}
                    disabled={!dimensions.height_mm || !dimensions.width_mm || !dimensions.web_thickness_mm || !dimensions.flange_thickness_mm}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                    开始计算
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    重置
                  </button>
                </div>
              </div>

              {/* 右侧：结果展示区域 */}
              <div className="space-y-5">

                {/* 计算结果 */}
                {results ? (
                  <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">assessment</span>
                      </div>
                      计算结果
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* 截面面积 */}
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">截面面积 (A)</span>
                          <span className="text-xs text-slate-500">cm²</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.section_area_cm2}</span>
                      </div>

                      {/* 理论重量 */}
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">理论重量 (m)</span>
                          <span className="text-xs text-slate-500">kg/m</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.theoretical_weight_kg_per_m}</span>
                      </div>

                      {/* 惯性矩 */}
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">惯性矩 Ix</span>
                          <span className="text-xs text-slate-500">cm⁴</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.Ix}</span>
                      </div>
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">惯性矩 Iy</span>
                          <span className="text-xs text-slate-500">cm⁴</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.Iy}</span>
                      </div>

                      {/* 截面模量 */}
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">截面模量 Wx</span>
                          <span className="text-xs text-slate-500">cm³</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.Wx}</span>
                      </div>
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">截面模量 Wy</span>
                          <span className="text-xs text-slate-500">cm³</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.Wy}</span>
                      </div>

                      {/* 回转半径 */}
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">回转半径 ix</span>
                          <span className="text-xs text-slate-500">cm</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.ix}</span>
                      </div>
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">回转半径 iy</span>
                          <span className="text-xs text-slate-500">cm</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.iy}</span>
                      </div>

                      {/* 外表面积 */}
                      <div className="group bg-white/[0.02] rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/5 col-span-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">外表面积 (S)</span>
                          <span className="text-xs text-slate-500">m²/m</span>
                        </div>
                        <span className="text-xl font-mono text-white group-hover:text-primary transition-colors">{results.S}</span>
                      </div>
                    </div>
                  </div>
                ) : hasCalculated ? (
                  <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-[300px] border border-white/5">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-3xl text-orange-500">error</span>
                    </div>
                    <p className="text-sm text-slate-400">请输入有效的尺寸参数</p>
                  </div>
                ) : (
                  <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-[300px] border border-white/5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-3xl text-primary">calculate</span>
                    </div>
                    <p className="text-sm text-slate-400">点击计算按钮查看结果</p>
                  </div>
                )}
              </div>
            </div>

            {/* 说明文字 */}
            <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-400">计算说明：</strong>
                本计算器基于H型钢标准截面几何模型计算各项特性。计算结果为理论值，实际使用时请以实际测量或产品规格为准。
                钢材密度取值为 7.85 g/cm³。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
