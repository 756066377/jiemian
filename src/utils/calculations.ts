import { HBeamData, CalculatedProperties } from '../types';

/**
 * 计算 H 型钢的力学性能参数
 * 基于截面几何属性进行理论计算
 */
export function calculateProperties(data: HBeamData): CalculatedProperties {
  const H = data.height_mm / 10; // 转换为 cm
  const B = data.width_mm / 10;
  const t1 = data.web_thickness_mm / 10;
  const t2 = data.flange_thickness_mm / 10;
  const A = data.section_area_cm2;

  // 计算惯性矩 Ix, Iy (单位: cm^4)
  // Ix ≈ (B * t2 * 2) * (H/2 - t2/2)^2 + t1 * (H - 2*t2)^3 / 12
  const Ix = (B * t2 * 2) * Math.pow((H - t2) / 2, 2) + (t1 * Math.pow(H - 2 * t2, 3)) / 12;
  const Iy = (2 * t2 * Math.pow(B, 3)) / 12 + (H - 2 * t2) * Math.pow(t1, 3) / 12;

  // 计算截面模量 Wx, Wy (单位: cm^3)
  const Wx = Ix / (H / 2);
  const Wy = Iy / (B / 2);

  // 计算回转半径 ix, iy (单位: cm)
  const ix = Math.sqrt(Ix / A);
  const iy = Math.sqrt(Iy / A);

  // 计算外表面积 S (单位: m^2/m)
  const S = (2 * (H + B)) / 1000;

  return {
    Ix: parseFloat(Ix.toFixed(0)),
    Iy: parseFloat(Iy.toFixed(0)),
    Wx: parseFloat(Wx.toFixed(0)),
    Wy: parseFloat(Wy.toFixed(0)),
    ix: parseFloat(ix.toFixed(2)),
    iy: parseFloat(iy.toFixed(2)),
    S: parseFloat(S.toFixed(2))
  };
}

/**
 * 根据分类筛选器代码返回中文名称
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'HW_wide_flange': 'HW（宽翼缘）',
    'HM_medium_flange': 'HM（中翼缘）',
    'HN_narrow_flange': 'HN（窄翼缘）',
    'HT_thin_wall': 'HT（薄壁）'
  };
  return labels[category] || category;
}
