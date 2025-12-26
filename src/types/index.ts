export interface HBeamData {
  steel_type: string;
  standard: string;
  category: 'HW_wide_flange' | 'HM_medium_flange' | 'HN_narrow_flange' | 'HT_thin_wall';
  model: string;
  height_mm: number;
  width_mm: number;
  web_thickness_mm: number;
  flange_thickness_mm: number;
  corner_radius_mm: number;
  section_area_cm2: number;
  theoretical_weight_kg_per_m: number;
}

export interface FlatSteelData {
  steel_type: string;
  standard: string;
  model: string;
  width_mm: number;
  thickness_mm: number;
  theoretical_weight_kg_per_m: number;
}

export interface EqualAngleData {
  steel_type: string;
  standard: string;
  model: number;
  edge_width_mm: number;
  thickness_mm: number;
  inner_radius_mm: number;
  section_area_cm2?: number;
  theoretical_weight_kg_per_m?: number;
  surface_area_m2_per_m?: number;
  Ix_cm4?: number;
  ix_cm?: number;
  Wx_cm3?: number;
  Z0_cm?: number;
}

export interface UnequalAngleData {
  steel_type: string;
  standard: string;
  model: number;
  long_edge_width_mm: number;
  short_edge_width_mm: number;
  thickness_mm: number;
  inner_radius_mm: number;
  section_area_cm2?: number;
  theoretical_weight_kg_per_m?: number;
  surface_area_m2_per_m?: number;
  Ix_cm4?: number;
  ix_cm?: number;
  Wx_cm3?: number;
  Iy_cm4?: number;
  iy_cm?: number;
  Wy_cm3?: number;
  Y0_cm?: number;
  X0_cm?: number;
  Iu_cm4?: number;
  iu_cm?: number;
  Wu_cm3?: number;
  tan_alpha?: number;
}

export interface ChannelData {
  steel_type: string;
  standard: string;
  model: string;
  height_mm: number;
  leg_width_mm: number;
  waist_thickness_mm: number;
  average_leg_thickness_mm: number;
  inner_radius_mm: number;
  leg_end_radius_mm: number;
  section_area_cm2?: number;
  theoretical_weight_kg_per_m: number;
  surface_area_m2_per_m?: number;
  Wx_cm3?: number;
  Ix_cm4?: number;
  ix_cm?: number;
  Wy_cm3?: number;
  Iy_cm4?: number;
  iy_cm?: number;
  Iy1_cm4?: number;
  Z0_cm?: number;
}

export interface IBeamData {
  steel_type: string;
  standard: string;
  model: string;
  height_mm: number;
  leg_width_mm: number;
  waist_thickness_mm: number;
  average_leg_thickness_mm: number;
  inner_radius_mm: number;
  leg_end_radius_mm: number;
  section_area_cm2?: number;
  theoretical_weight_kg_per_m: number;
  surface_area_m2_per_m?: number;
  Ix_cm4?: number;
  Wx_cm3?: number;
  ix_cm?: number;
  Iy_cm4?: number;
  Wy_cm3?: number;
  iy_cm?: number;
}

export type SteelData = HBeamData | FlatSteelData | EqualAngleData | UnequalAngleData | ChannelData | IBeamData;

export interface CalculatedProperties {
  Ix: number; // 惯性矩 X 轴 (cm^4)
  Iy: number; // 惯性矩 Y 轴 (cm^4)
  Wx: number; // 截面模量 X 轴 (cm^3)
  Wy: number; // 截面模量 Y 轴 (cm^3)
  ix: number; // 回转半径 X 轴 (cm)
  iy: number; // 回转半径 Y 轴 (cm)
  S: number;  // 外表面积 (m^2/m)
}

export type Category = 'all' | 'HW' | 'HM' | 'HN' | 'HT';

export type SteelCategory = 
  | 'hot_rolled_h_beam'
  | 'hot_rolled_flat_steel'
  | 'hot_rolled_equal_angle'
  | 'hot_rolled_unequal_angle'
  | 'hot_rolled_channel'
  | 'hot_rolled_i_beam';

export type SteelFilterCategory = 'all' | 'equal' | 'unequal';
