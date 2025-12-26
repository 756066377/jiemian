import { FlatSteelData } from '../types';
import rawJson from '../../国标数据/热轧扁钢.json';

export const flatSteelData: FlatSteelData[] = (rawJson as any).records.map((r: any) => ({
  steel_type: r.steel_type,
  standard: r.standard,
  model: `${Math.round(r.width_mm)}×${Math.round(r.thickness_mm)}`,
  width_mm: r.width_mm,
  thickness_mm: r.thickness_mm,
  theoretical_weight_kg_per_m: r.theoretical_weight_kg_per_m
}));
