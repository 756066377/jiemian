import { useState, useEffect } from 'react';
import { SteelData, FlatSteelData, EqualAngleData, UnequalAngleData, ChannelData, IBeamData, HBeamData } from '../types';
import { calculateProperties } from '../utils/calculations';
import { HBeamDiagram, FlatSteelDiagram, EqualAngleDiagram, UnequalAngleDiagram, ChannelDiagram, IBeamDiagram } from './index';

interface DetailViewProps {
  data: SteelData | null;
  onOpenCalculator: () => void;
}

export function DetailView({ data, onOpenCalculator }: DetailViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Add animation when data changes
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
    setIsVisible(!!data);
  }, [data, isMounted]);

  if (!data) {
    return (
      <div className="flex-1 glass-panel rounded-xl overflow-hidden flex items-center justify-center">
        <p className="text-slate-500 text-sm">请选择一个型号查看详情</p>
      </div>
    );
  }

  const calculated = data.steel_type === 'hot_rolled_h_beam' ? calculateProperties(data as HBeamData) : null;
  const isHBeam = data.steel_type === 'hot_rolled_h_beam';

  const getSteelName = (type: string) => {
    const names: Record<string, string> = {
      'hot_rolled_h_beam': 'H型钢',
      'hot_rolled_flat_steel': '扁钢',
      'hot_rolled_equal_angle': '角钢',
      'hot_rolled_unequal_angle': '角钢',
      'hot_rolled_channel': '槽钢',
      'hot_rolled_i_beam': '工字钢'
    };
    return names[type] || type;
  };

  const getAngleSpecDisplay = (data: SteelData): string => {
    const equalAngle = data as EqualAngleData;
    const unequalAngle = data as UnequalAngleData;

    // Equal angle: B × d
    if (equalAngle.edge_width_mm !== undefined && equalAngle.thickness_mm !== undefined) {
      return `${equalAngle.edge_width_mm}×${equalAngle.thickness_mm}`;
    }

    // Unequal angle: B × b × d
    if (unequalAngle.long_edge_width_mm !== undefined && unequalAngle.short_edge_width_mm !== undefined && unequalAngle.thickness_mm !== undefined) {
      return `${unequalAngle.long_edge_width_mm}×${unequalAngle.short_edge_width_mm}×${unequalAngle.thickness_mm}`;
    }

    return String(data.model);
  };

  const renderDiagram = () => {
    switch (data.steel_type) {
      case 'hot_rolled_flat_steel': {
        const flatData = data as FlatSteelData;
        return <FlatSteelDiagram width={flatData.width_mm} thickness={flatData.thickness_mm} />;
      }
      case 'hot_rolled_equal_angle': {
        const angleData = data as EqualAngleData;
        return <EqualAngleDiagram edgeWidth={angleData.edge_width_mm} thickness={angleData.thickness_mm} />;
      }
      case 'hot_rolled_unequal_angle': {
        const angleData = data as UnequalAngleData;
        return <UnequalAngleDiagram longEdge={angleData.long_edge_width_mm} shortEdge={angleData.short_edge_width_mm} thickness={angleData.thickness_mm} />;
      }
      case 'hot_rolled_channel': {
        const channelData = data as ChannelData;
        return <ChannelDiagram 
          height={channelData.height_mm} 
          legWidth={channelData.leg_width_mm} 
          waistThickness={channelData.waist_thickness_mm} 
          legThickness={channelData.average_leg_thickness_mm} 
        />;
      }
      case 'hot_rolled_i_beam': {
        const iBeamData = data as IBeamData;
        return <IBeamDiagram 
          height={iBeamData.height_mm} 
          legWidth={iBeamData.leg_width_mm} 
          waistThickness={iBeamData.waist_thickness_mm} 
          legThickness={iBeamData.average_leg_thickness_mm} 
        />;
      }
      default: {
        const hBeamData = data as HBeamData;
        return <HBeamDiagram H={hBeamData.height_mm} B={hBeamData.width_mm} t1={hBeamData.web_thickness_mm} t2={hBeamData.flange_thickness_mm} />;
      }
    }
  };

  const renderKPIs = () => {
    switch (data.steel_type) {
      case 'hot_rolled_flat_steel': {
        const flatData = data as FlatSteelData;
        return (
          <>
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">scale</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">理论重量</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {flatData.theoretical_weight_kg_per_m.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">kg/m</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-blue-400 text-sm">straighten</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">宽度</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{flatData.width_mm}</p>
              <p className="text-xs text-slate-500">mm</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-purple-400 text-sm">height</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">厚度</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{flatData.thickness_mm}</p>
              <p className="text-xs text-slate-500">mm</p>
            </div>
          </>
        );
      }
      case 'hot_rolled_equal_angle':
      case 'hot_rolled_unequal_angle': {
        const angleData = data as EqualAngleData | UnequalAngleData;
        return (
          <>
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">scale</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">理论重量</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {angleData.theoretical_weight_kg_per_m?.toFixed(2) || '-'}
              </p>
              <p className="text-xs text-slate-500">kg/m</p>
            </div>
            {angleData.section_area_cm2 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-400 text-sm">square_foot</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">截面面积</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{angleData.section_area_cm2.toFixed(2)}</p>
                <p className="text-xs text-slate-500">cm²</p>
              </div>
            )}
            {angleData.Ix_cm4 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-purple-400 text-sm">rotate_90_degrees_cw</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Ix)</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{angleData.Ix_cm4.toFixed(1)}</p>
                <p className="text-xs text-slate-500">cm⁴</p>
              </div>
            )}
            {'Iy_cm4' in angleData && angleData.Iy_cm4 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-green-400 text-sm">rotate_90_degrees_ccw</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Iy)</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{(angleData as UnequalAngleData).Iy_cm4!.toFixed(1)}</p>
                <p className="text-xs text-slate-500">cm⁴</p>
              </div>
            )}
          </>
        );
      }
      case 'hot_rolled_channel': {
        const channelData = data as ChannelData;
        return (
          <>
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">scale</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">理论重量</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {channelData.theoretical_weight_kg_per_m.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">kg/m</p>
            </div>
            {channelData.section_area_cm2 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-400 text-sm">square_foot</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">截面面积</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{channelData.section_area_cm2.toFixed(2)}</p>
                <p className="text-xs text-slate-500">cm²</p>
              </div>
            )}
            {channelData.Ix_cm4 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-purple-400 text-sm">rotate_90_degrees_cw</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Ix)</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{channelData.Ix_cm4.toFixed(1)}</p>
                <p className="text-xs text-slate-500">cm⁴</p>
              </div>
            )}
            {channelData.Iy_cm4 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-green-400 text-sm">rotate_90_degrees_ccw</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Iy)</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{channelData.Iy_cm4.toFixed(1)}</p>
                <p className="text-xs text-slate-500">cm⁴</p>
              </div>
            )}
          </>
        );
      }
      case 'hot_rolled_i_beam': {
        const iBeamData = data as IBeamData;
        return (
          <>
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">scale</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">理论重量</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {iBeamData.theoretical_weight_kg_per_m.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">kg/m</p>
            </div>
            {iBeamData.section_area_cm2 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-400 text-sm">square_foot</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">截面面积</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{iBeamData.section_area_cm2.toFixed(2)}</p>
                <p className="text-xs text-slate-500">cm²</p>
              </div>
            )}
            {iBeamData.Ix_cm4 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-purple-400 text-sm">rotate_90_degrees_cw</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Ix)</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{iBeamData.Ix_cm4}</p>
                <p className="text-xs text-slate-500">cm⁴</p>
              </div>
            )}
            {iBeamData.Iy_cm4 && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-green-400 text-sm">rotate_90_degrees_ccw</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Iy)</p>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{iBeamData.Iy_cm4}</p>
                <p className="text-xs text-slate-500">cm⁴</p>
              </div>
            )}
          </>
        );
      }
      default: {
        const hBeamData = data as HBeamData;
        return (
          <>
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">scale</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">理论重量</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {hBeamData.theoretical_weight_kg_per_m.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500">kg/m</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-blue-400 text-sm">square_foot</span>
                <p className="text-xs text-slate-400 uppercase tracking-wide">截面面积 (A)</p>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {hBeamData.section_area_cm2.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500">cm²</p>
            </div>
            {calculated && (
              <>
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-purple-400 text-sm">rotate_90_degrees_cw</span>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Ix)</p>
                  </div>
                  <p className="text-2xl font-bold text-white font-mono">{calculated.Ix}</p>
                  <p className="text-xs text-slate-500">cm⁴</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-green-400 text-sm">rotate_90_degrees_ccw</span>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">惯性矩 (Iy)</p>
                  </div>
                  <p className="text-2xl font-bold text-white font-mono">{calculated.Iy}</p>
                  <p className="text-xs text-slate-500">cm⁴</p>
                </div>
              </>
            )}
          </>
        );
      }
    }
  };

  const renderDetailTable = () => {
    switch (data.steel_type) {
      case 'hot_rolled_flat_steel': {
        const flatData = data as FlatSteelData;
        return (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Parameter</th>
                <th className="px-6 py-3 font-medium text-right">Value</th>
                <th className="px-6 py-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">宽度</td>
                <td className="px-6 py-3 text-white text-right">{flatData.width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">厚度</td>
                <td className="px-6 py-3 text-white text-right">{flatData.thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">理论重量</td>
                <td className="px-6 py-3 text-white text-right">{flatData.theoretical_weight_kg_per_m.toFixed(2)}</td>
                <td className="px-6 py-3 text-right">kg/m</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">执行标准</td>
                <td className="px-6 py-3 text-white text-right">{flatData.standard}</td>
                <td className="px-6 py-3 text-right">-</td>
              </tr>
            </tbody>
          </table>
        );
      }
      case 'hot_rolled_equal_angle': {
        const angleData = data as EqualAngleData;
        return (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Parameter</th>
                <th className="px-6 py-3 font-medium text-right">Value</th>
                <th className="px-6 py-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">边宽度 (b)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.edge_width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">边厚度 (d)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">内圆弧半径 (r)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.inner_radius_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              {angleData.section_area_cm2 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面面积</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.section_area_cm2.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm²</td>
                </tr>
              )}
              {angleData.theoretical_weight_kg_per_m && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">理论重量</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.theoretical_weight_kg_per_m.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">kg/m</td>
                </tr>
              )}
              {angleData.Wx_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wx)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.Wx_cm3.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {angleData.ix_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (ix)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.ix_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              {angleData.Z0_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">质心距离 (Z₀)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.Z0_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">执行标准</td>
                <td className="px-6 py-3 text-white text-right">{angleData.standard}</td>
                <td className="px-6 py-3 text-right">-</td>
              </tr>
            </tbody>
          </table>
        );
      }
      case 'hot_rolled_unequal_angle': {
        const angleData = data as UnequalAngleData;
        return (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Parameter</th>
                <th className="px-6 py-3 font-medium text-right">Value</th>
                <th className="px-6 py-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">长边宽度 (B)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.long_edge_width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">短边宽度 (b)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.short_edge_width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">边厚度 (d)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">内圆弧半径 (r)</td>
                <td className="px-6 py-3 text-white text-right">{angleData.inner_radius_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              {angleData.section_area_cm2 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面面积</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.section_area_cm2.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm²</td>
                </tr>
              )}
              {angleData.theoretical_weight_kg_per_m && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">理论重量</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.theoretical_weight_kg_per_m.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">kg/m</td>
                </tr>
              )}
              {angleData.Wx_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wx)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.Wx_cm3.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {angleData.Wy_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wy)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.Wy_cm3.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {angleData.ix_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (ix)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.ix_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              {angleData.iy_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (iy)</td>
                  <td className="px-6 py-3 text-white text-right">{angleData.iy_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              {angleData.X0_cm && angleData.Y0_cm && (
                <>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 font-sans">质心距离 (X₀)</td>
                    <td className="px-6 py-3 text-white text-right">{angleData.X0_cm.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right">cm</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 font-sans">质心距离 (Y₀)</td>
                    <td className="px-6 py-3 text-white text-right">{angleData.Y0_cm.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right">cm</td>
                  </tr>
                </>
              )}
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">执行标准</td>
                <td className="px-6 py-3 text-white text-right">{angleData.standard}</td>
                <td className="px-6 py-3 text-right">-</td>
              </tr>
            </tbody>
          </table>
        );
      }
      case 'hot_rolled_channel': {
        const channelData = data as ChannelData;
        return (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Parameter</th>
                <th className="px-6 py-3 font-medium text-right">Value</th>
                <th className="px-6 py-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">高度 (h)</td>
                <td className="px-6 py-3 text-white text-right">{channelData.height_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">腿宽度 (b)</td>
                <td className="px-6 py-3 text-white text-right">{channelData.leg_width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">腰厚度 (d)</td>
                <td className="px-6 py-3 text-white text-right">{channelData.waist_thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">平均腿厚度 (t)</td>
                <td className="px-6 py-3 text-white text-right">{channelData.average_leg_thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">内圆弧半径 (r)</td>
                <td className="px-6 py-3 text-white text-right">{channelData.inner_radius_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              {channelData.section_area_cm2 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面面积</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.section_area_cm2.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm²</td>
                </tr>
              )}
              {channelData.theoretical_weight_kg_per_m && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">理论重量</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.theoretical_weight_kg_per_m.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">kg/m</td>
                </tr>
              )}
              {channelData.Wx_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wx)</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.Wx_cm3.toFixed(1)}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {channelData.Wy_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wy)</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.Wy_cm3.toFixed(1)}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {channelData.ix_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (ix)</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.ix_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              {channelData.iy_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (iy)</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.iy_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              {channelData.Z0_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">距离 (Z₀)</td>
                  <td className="px-6 py-3 text-white text-right">{channelData.Z0_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">执行标准</td>
                <td className="px-6 py-3 text-white text-right">{channelData.standard}</td>
                <td className="px-6 py-3 text-right">-</td>
              </tr>
            </tbody>
          </table>
        );
      }
      case 'hot_rolled_i_beam': {
        const iBeamData = data as IBeamData;
        return (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Parameter</th>
                <th className="px-6 py-3 font-medium text-right">Value</th>
                <th className="px-6 py-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">高度 (h)</td>
                <td className="px-6 py-3 text-white text-right">{iBeamData.height_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">腿宽度 (b)</td>
                <td className="px-6 py-3 text-white text-right">{iBeamData.leg_width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">腰厚度 (d)</td>
                <td className="px-6 py-3 text-white text-right">{iBeamData.waist_thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">平均腿厚度 (t)</td>
                <td className="px-6 py-3 text-white text-right">{iBeamData.average_leg_thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">内圆弧半径 (r)</td>
                <td className="px-6 py-3 text-white text-right">{iBeamData.inner_radius_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              {iBeamData.section_area_cm2 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面面积</td>
                  <td className="px-6 py-3 text-white text-right">{iBeamData.section_area_cm2.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm²</td>
                </tr>
              )}
              {iBeamData.theoretical_weight_kg_per_m && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">理论重量</td>
                  <td className="px-6 py-3 text-white text-right">{iBeamData.theoretical_weight_kg_per_m.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">kg/m</td>
                </tr>
              )}
              {iBeamData.Wx_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wx)</td>
                  <td className="px-6 py-3 text-white text-right">{iBeamData.Wx_cm3}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {iBeamData.Wy_cm3 && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">截面系数 (Wy)</td>
                  <td className="px-6 py-3 text-white text-right">{iBeamData.Wy_cm3}</td>
                  <td className="px-6 py-3 text-right">cm³</td>
                </tr>
              )}
              {iBeamData.ix_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (ix)</td>
                  <td className="px-6 py-3 text-white text-right">{iBeamData.ix_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              {iBeamData.iy_cm && (
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 font-sans">回转半径 (iy)</td>
                  <td className="px-6 py-3 text-white text-right">{iBeamData.iy_cm.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">cm</td>
                </tr>
              )}
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">执行标准</td>
                <td className="px-6 py-3 text-white text-right">{iBeamData.standard}</td>
                <td className="px-6 py-3 text-right">-</td>
              </tr>
            </tbody>
          </table>
        );
      }
      default: {
        const hBeamData = data as HBeamData;
        return (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Parameter</th>
                <th className="px-6 py-3 font-medium">Symbol</th>
                <th className="px-6 py-3 font-medium text-right">Value</th>
                <th className="px-6 py-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">截面高度</td>
                <td className="px-6 py-3 text-primary">H</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.height_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">截面宽度</td>
                <td className="px-6 py-3 text-primary">B</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.width_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">腹板厚度</td>
                <td className="px-6 py-3 text-primary">t1</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.web_thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">翼缘厚度</td>
                <td className="px-6 py-3 text-primary">t2</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.flange_thickness_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">圆角半径</td>
                <td className="px-6 py-3 text-primary">r</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.corner_radius_mm}</td>
                <td className="px-6 py-3 text-right">mm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">截面面积</td>
                <td className="px-6 py-3 text-primary">A</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.section_area_cm2.toFixed(1)}</td>
                <td className="px-6 py-3 text-right">cm²</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">理论重量</td>
                <td className="px-6 py-3 text-primary">m</td>
                <td className="px-6 py-3 text-white text-right">{hBeamData.theoretical_weight_kg_per_m.toFixed(1)}</td>
                <td className="px-6 py-3 text-right">kg/m</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">截面模量 (Major Axis)</td>
                <td className="px-6 py-3 text-primary">Wx</td>
                <td className="px-6 py-3 text-white text-right">{calculated?.Wx || '-'}</td>
                <td className="px-6 py-3 text-right">cm³</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">截面模量 (Minor Axis)</td>
                <td className="px-6 py-3 text-primary">Wy</td>
                <td className="px-6 py-3 text-white text-right">{calculated?.Wy || '-'}</td>
                <td className="px-6 py-3 text-right">cm³</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">回转半径 (Major Axis)</td>
                <td className="px-6 py-3 text-primary">ix</td>
                <td className="px-6 py-3 text-white text-right">{calculated?.ix || '-'}</td>
                <td className="px-6 py-3 text-right">cm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">回转半径 (Minor Axis)</td>
                <td className="px-6 py-3 text-primary">iy</td>
                <td className="px-6 py-3 text-white text-right">{calculated?.iy || '-'}</td>
                <td className="px-6 py-3 text-right">cm</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-sans">外表面积</td>
                <td className="px-6 py-3 text-primary">S</td>
                <td className="px-6 py-3 text-white text-right">{calculated?.S || '-'}</td>
                <td className="px-6 py-3 text-right">m²/m</td>
              </tr>
            </tbody>
          </table>
        );
      }
    }
  };

  return (
    <div className={`flex-1 flex flex-col glass-panel rounded-xl overflow-hidden transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div>
          <h3 className="text-xl font-bold font-display text-white">
            {getSteelName(data.steel_type)} {getAngleSpecDisplay(data)}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {data.standard}
          </p>
        </div>
        {isHBeam && (
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-base">calculate</span>
            计算
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="aspect-square bg-[#0f151c] rounded-2xl border border-white/10 relative flex items-center justify-center p-8 group overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              ></div>
              {renderDiagram()}
            </div>

            <div className="glass-card p-4 rounded-xl">
              <h4 className="text-sm font-semibold text-slate-200 mb-3 border-b border-white/5 pb-2">
                几何尺寸
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">型号</p>
                  <p className="text-lg font-mono text-white">{data.model}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-2/3 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderKPIs()}
            </div>

            <div className="glass-card rounded-xl overflow-hidden flex flex-col flex-1 min-h-[300px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h4 className="text-sm font-semibold text-slate-200">
                  详细参数
                </h4>
              </div>

              <div className="overflow-x-auto">
                {renderDetailTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
