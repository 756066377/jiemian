// 钢板展开计算器类型定义

export type CalculationMode = 'experience' | 'kfactor';

export type MaterialType = 
  | 'carbon_5mm'
  | 'carbon_10mm'
  | 'stainless'
  | 'aluminum'
  | 'custom';

export type BendDirection = 'up' | 'down';

export type TemplateType = 'L' | 'U';

export interface MaterialDeduction {
  material: MaterialType;
  thickness: number;
  deduction: number;
  description: string;
}

export interface ExperienceInput {
  // 模式A：经验扣除法输入参数
  templateType: TemplateType;      // L型或U型
  edgeA: number;                   // A边长（外包尺寸）
  edgeB?: number;                  // B边长（U型时需要）
  edgeC?: number;                  // C边长（U型时需要）
  thickness: number;               // 板厚
  material: MaterialType;          // 材质
  customDeduction?: number;        // 自定义扣除值
  direction: BendDirection;        // 折弯方向
}

export interface KFactorInput {
  // 模式B：K-Factor法输入参数
  templateType: TemplateType;
  edgeA: number;
  edgeB?: number;
  edgeC?: number;
  thickness: number;
  angle: number;                   // 折弯角度（度）
  innerRadius: number;             // 内R
  kFactor: number;                // K因子
  direction: BendDirection;
}

export interface CalculationResult {
  totalLength: number;             // 展开总长
  breakdown: string[];             // 计算明细
  isValid: boolean;                // 是否有效
  warnings: string[];              // 警告信息
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}
