export interface SteelGrade {
  id: string; // DIN标准编号
  name: string; // DIN标准名称
  cn: string[]; // 中国标准(GB)
  jp: string[]; // 日本标准(JIS)
  us: string[]; // 美国标准(AISI/ASTM)
  cat: string; // 类别
  note?: string | null; // 备注
}

export type SteelGradeCategory = 
  | '不锈钢、耐热钢'
  | '不锈、耐酸及耐热铸钢'
  | '碳素铸钢、合金铸钢及高锰铸钢'
  | '普通碳素结构钢'
  | '优质碳素结构钢';
