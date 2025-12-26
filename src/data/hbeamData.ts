import { HBeamData } from '../types';

// Import the complete H-beam data from the JSON file
// This file contains 130 records with all 4 categories: HW, HM, HN, HT
import rawData from '../../国标数据/热轧H型钢.json';

// Extract records from the JSON structure
const rawRecords = (rawData as any).records || [];

// Ensure type safety while importing
export const hbeamData: HBeamData[] = rawRecords.map((record: any) => ({
  steel_type: record.steel_type,
  standard: record.standard,
  category: record.category, // This will be: HW_wide_flange, HM_medium_flange, HN_narrow_flange, HT_thin_wall
  model: record.model,
  height_mm: record.height_mm,
  width_mm: record.width_mm,
  web_thickness_mm: record.web_thickness_mm,
  flange_thickness_mm: record.flange_thickness_mm,
  corner_radius_mm: record.corner_radius_mm,
  section_area_cm2: record.section_area_cm2,
  theoretical_weight_kg_per_m: record.theoretical_weight_kg_per_m,
}));

// Debug: log data distribution (can be removed)
console.log('H-Beam data loaded:', {
  total: hbeamData.length,
  HW: hbeamData.filter(d => d.category === 'HW_wide_flange').length,
  HM: hbeamData.filter(d => d.category === 'HM_medium_flange').length,
  HN: hbeamData.filter(d => d.category === 'HN_narrow_flange').length,
  HT: hbeamData.filter(d => d.category === 'HT_thin_wall').length
});
