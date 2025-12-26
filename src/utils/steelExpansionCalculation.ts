import {
  CalculationMode,
  MaterialDeduction,
  ExperienceInput,
  KFactorInput,
  CalculationResult,
  ValidationWarning
} from '../types/steelExpansion';

// Epsilon值用于浮点数比较
const EPSILON = 0.0001;

// 内置常用扣除值数据库
const DEDUCTION_DATABASE: Record<string, MaterialDeduction> = {
  carbon_5mm: {
    material: 'carbon_5mm',
    thickness: 5,
    deduction: 8.5,
    description: '5mm碳钢'
  },
  carbon_10mm: {
    material: 'carbon_10mm',
    thickness: 10,
    deduction: 17,
    description: '10mm碳钢'
  },
  stainless: {
    material: 'stainless',
    thickness: 0,
    deduction: 0,
    description: '不锈钢（需自定义）'
  },
  aluminum: {
    material: 'aluminum',
    thickness: 0,
    deduction: 0,
    description: '铝板（需自定义）'
  },
  custom: {
    material: 'custom',
    thickness: 0,
    deduction: 0,
    description: '自定义'
  }
};

// 保留2位小数
function toFixed2(value: number): number {
  return Math.round(value * 100) / 100;
}

// 参数验证
export function validateInput(
  input: ExperienceInput | KFactorInput,
  mode: CalculationMode
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // 验证边长
  if (input.edgeA <= 0) {
    warnings.push({ field: 'edgeA', message: 'A边长必须大于0', severity: 'error' });
  }

  // U型需要验证B和C边
  if (input.templateType === 'U') {
    if (input.edgeB === undefined || input.edgeB <= 0) {
      warnings.push({ field: 'edgeB', message: 'B边长必须大于0', severity: 'error' });
    }
    if (input.edgeC === undefined || input.edgeC <= 0) {
      warnings.push({ field: 'edgeC', message: 'C边长必须大于0', severity: 'error' });
    }
  }

  // 验证板厚
  if (input.thickness <= 0) {
    warnings.push({ field: 'thickness', message: '板厚必须大于0', severity: 'error' });
  }

  // 验证最小折边长度（经验值：板厚的3倍）
  const minBendEdge = input.thickness * 3;
  if (input.templateType === 'L' && input.edgeA < minBendEdge) {
    warnings.push({
      field: 'edgeA',
      message: `A边长建议不小于${toFixed2(minBendEdge)}mm（板厚×3）`,
      severity: 'warning'
    });
  }

  if (mode === 'kfactor') {
    const kInput = input as KFactorInput;
    
    // 验证角度
    if (kInput.angle <= 0 || kInput.angle > 180) {
      warnings.push({ field: 'angle', message: '角度必须在0-180度之间', severity: 'error' });
    }

    // 验证内R
    if (kInput.innerRadius < 0) {
      warnings.push({ field: 'innerRadius', message: '内R不能为负', severity: 'error' });
    }

    // 验证K因子
    if (kInput.kFactor <= 0 || kInput.kFactor > 0.5) {
      warnings.push({ field: 'kFactor', message: 'K因子必须在0-0.5之间', severity: 'error' });
    }

    // 警告：大圆弧折弯
    if (kInput.innerRadius > kInput.thickness * 2) {
      warnings.push({
        field: 'innerRadius',
        message: '大圆弧折弯，建议使用K-Factor法精确计算',
        severity: 'warning'
      });
    }
  } else {
    const expInput = input as ExperienceInput;
    
    // 验证扣除值
    const deduction = getDeduction(expInput);
    if (deduction <= 0) {
      warnings.push({
        field: 'customDeduction',
        message: '扣除值必须大于0，请选择常用材质或自定义',
        severity: 'error'
      });
    }
  }

  return warnings;
}

// 获取扣除值
function getDeduction(input: ExperienceInput): number {
  if (input.customDeduction !== undefined && input.customDeduction > 0) {
    return input.customDeduction;
  }
  return DEDUCTION_DATABASE[input.material]?.deduction || 0;
}

// 模式A：经验扣除法计算
export function calculateByExperience(input: ExperienceInput): CalculationResult {
  const warnings = validateInput(input, 'experience');
  const hasErrors = warnings.some(w => w.severity === 'error');
  const breakdown: string[] = [];

  if (hasErrors) {
    return {
      totalLength: 0,
      breakdown: [],
      isValid: false,
      warnings: warnings.map(w => w.message)
    };
  }

  const deduction = getDeduction(input);
  let totalLength = 0;

  if (input.templateType === 'L') {
    // L型：A边 + B边 - 扣除值（假设L型有一个折弯）
    // L型只有两个边，实际上是展开后的总长
    totalLength = toFixed2(input.edgeA + input.edgeB!);
    breakdown.push(`A边：${toFixed2(input.edgeA)}mm`);
    breakdown.push(`B边：${toFixed2(input.edgeB!)}mm`);
    breakdown.push(`扣除值：${toFixed2(deduction)}mm`);
    breakdown.push(`展开长度：${totalLength}mm`);
  } else {
    // U型：A边 + B边 + C边 - 2×扣除值（两个折弯）
    totalLength = toFixed2(input.edgeA + input.edgeB! + input.edgeC! - 2 * deduction);
    breakdown.push(`A边：${toFixed2(input.edgeA)}mm`);
    breakdown.push(`B边：${toFixed2(input.edgeB!)}mm`);
    breakdown.push(`C边：${toFixed2(input.edgeC!)}mm`);
    breakdown.push(`扣除值：${toFixed2(deduction)}mm × 2 = ${toFixed2(2 * deduction)}mm`);
    breakdown.push(`展开长度：${totalLength}mm`);
  }

  return {
    totalLength,
    breakdown,
    isValid: true,
    warnings: warnings.filter(w => w.severity === 'warning').map(w => w.message)
  };
}

// 模式B：K-Factor法计算
export function calculateByKFactor(input: KFactorInput): CalculationResult {
  const warnings = validateInput(input, 'kfactor');
  const hasErrors = warnings.some(w => w.severity === 'error');
  const breakdown: string[] = [];

  if (hasErrors) {
    return {
      totalLength: 0,
      breakdown: [],
      isValid: false,
      warnings: warnings.map(w => w.message)
    };
  }

  // 计算折弯补偿：BA = (π × θ / 180) × (R + K × T)
  // θ: 折弯角度
  // R: 折弯内圆角半径
  // K: K因子
  // T: 板厚
  const bendAllowance = (Math.PI * input.angle / 180) * (input.innerRadius + input.kFactor * input.thickness);
  const roundedBA = toFixed2(bendAllowance);

  // 计算内尺寸（外尺寸减去圆角部分）
  // 对于90度折弯，每个圆角需要减去一个内半径R
  const radiusDeduction = input.innerRadius;

  let totalLength = 0;
  const bendLines: { edge: string; position: number; calculation: string }[] = [];

  if (input.templateType === 'L') {
    // L型：展开长度 = (A - R - T) + (B - R - T) + BA
    // A' = A - (R + T), B' = B - (R + T)（直边长度 = 外尺寸 - 圆角半径 - 板厚）
    const straightEdgeA = input.edgeA - radiusDeduction - input.thickness;
    const straightEdgeB = input.edgeB! - radiusDeduction - input.thickness;

    totalLength = toFixed2(straightEdgeA + straightEdgeB + bendAllowance);

    // 折弯线位置 = 直边长度 + BA/2
    const bendLineA = toFixed2(straightEdgeA + roundedBA / 2);
    const bendLineB = toFixed2(straightEdgeB + roundedBA / 2);

    breakdown.push(`外尺寸 A边：${toFixed2(input.edgeA)}mm`);
    breakdown.push(`外尺寸 B边：${toFixed2(input.edgeB!)}mm`);
    breakdown.push(`直边 A' = A - (R + T) = ${toFixed2(input.edgeA)} - (${toFixed2(input.innerRadius)} + ${toFixed2(input.thickness)}) = ${toFixed2(straightEdgeA)}mm`);
    breakdown.push(`直边 B' = B - (R + T) = ${toFixed2(input.edgeB!)} - (${toFixed2(input.innerRadius)} + ${toFixed2(input.thickness)}) = ${toFixed2(straightEdgeB)}mm`);
    breakdown.push(`折弯补偿 BA = (π × ${toFixed2(input.angle)} / 180) × (${toFixed2(input.innerRadius)} + ${toFixed2(input.kFactor)} × ${toFixed2(input.thickness)})`);
    breakdown.push(`= ${toFixed2(Math.PI * input.angle / 180)} × ${toFixed2(input.innerRadius + input.kFactor * input.thickness)}`);
    breakdown.push(`= ${toFixed2(roundedBA)}mm`);
    breakdown.push(`展开长度 L = A' + B' + BA = ${toFixed2(straightEdgeA)} + ${toFixed2(straightEdgeB)} + ${toFixed2(roundedBA)} = ${totalLength}mm`);

    // 折弯线距离
    bendLines.push({
      edge: 'A',
      position: bendLineA,
      calculation: `${toFixed2(straightEdgeA)} + ${toFixed2(roundedBA / 2)} = ${bendLineA}mm`
    });
    bendLines.push({
      edge: 'B',
      position: bendLineB,
      calculation: `${toFixed2(straightEdgeB)} + ${toFixed2(roundedBA / 2)} = ${bendLineB}mm`
    });
  } else {
    // U型：展开长度 = (A - 2R - T) + (B - 2R - T) + (C - 2R - T) + 2 × BA
    // 直边长度 = 外尺寸 - 2×圆角半径 - 板厚
    const straightEdgeA = input.edgeA - 2 * radiusDeduction - input.thickness;
    const straightEdgeB = input.edgeB! - 2 * radiusDeduction - input.thickness;
    const straightEdgeC = input.edgeC! - 2 * radiusDeduction - input.thickness;

    totalLength = toFixed2(straightEdgeA + straightEdgeB + straightEdgeC + 2 * bendAllowance);

    // 折弯线位置 = 直边长度 + BA/2
    const bendLineA = toFixed2(straightEdgeA + roundedBA / 2);
    const bendLineC = toFixed2(straightEdgeC + roundedBA / 2);

    breakdown.push(`外尺寸 A边：${toFixed2(input.edgeA)}mm`);
    breakdown.push(`外尺寸 B边：${toFixed2(input.edgeB!)}mm`);
    breakdown.push(`外尺寸 C边：${toFixed2(input.edgeC!)}mm`);
    breakdown.push(`直边 A' = A - (2R + T) = ${toFixed2(input.edgeA)} - (2 × ${toFixed2(input.innerRadius)} + ${toFixed2(input.thickness)}) = ${toFixed2(straightEdgeA)}mm`);
    breakdown.push(`直边 B' = B - (2R + T) = ${toFixed2(input.edgeB!)} - (2 × ${toFixed2(input.innerRadius)} + ${toFixed2(input.thickness)}) = ${toFixed2(straightEdgeB)}mm`);
    breakdown.push(`直边 C' = C - (2R + T) = ${toFixed2(input.edgeC!)} - (2 × ${toFixed2(input.innerRadius)} + ${toFixed2(input.thickness)}) = ${toFixed2(straightEdgeC)}mm`);
    breakdown.push(`折弯补偿 BA = (π × ${toFixed2(input.angle)} / 180) × (${toFixed2(input.innerRadius)} + ${toFixed2(input.kFactor)} × ${toFixed2(input.thickness)})`);
    breakdown.push(`= ${toFixed2(Math.PI * input.angle / 180)} × ${toFixed2(input.innerRadius + input.kFactor * input.thickness)}`);
    breakdown.push(`= ${toFixed2(roundedBA)}mm`);
    breakdown.push(`展开长度 L = A' + B' + C' + 2 × BA = ${toFixed2(straightEdgeA)} + ${toFixed2(straightEdgeB)} + ${toFixed2(straightEdgeC)} + 2 × ${toFixed2(roundedBA)} = ${totalLength}mm`);

    // 折弯线距离
    bendLines.push({
      edge: 'A',
      position: bendLineA,
      calculation: `${toFixed2(straightEdgeA)} + ${toFixed2(roundedBA / 2)} = ${bendLineA}mm`
    });
    bendLines.push({
      edge: 'C',
      position: bendLineC,
      calculation: `${toFixed2(straightEdgeC)} + ${toFixed2(roundedBA / 2)} = ${bendLineC}mm`
    });
  }

  return {
    totalLength,
    breakdown,
    isValid: true,
    warnings: warnings.filter(w => w.severity === 'warning').map(w => w.message),
    bendLines
  };
}

export { EPSILON, toFixed2 };
