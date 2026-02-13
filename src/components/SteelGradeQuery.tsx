import { useState, useMemo } from 'react';
import { steelGradeData } from '../data/steelGradeData';
import { SteelGrade, SteelGradeCategory } from '../types/steelGrade';

const categories: { value: 'all' | SteelGradeCategory; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: '不锈钢、耐热钢', label: '不锈钢、耐热钢' },
  { value: '不锈、耐酸及耐热铸钢', label: '不锈、耐酸及耐热铸钢' },
  { value: '碳素铸钢、合金铸钢及高锰铸钢', label: '碳素铸钢、合金铸钢及高锰铸钢' },
  { value: '普通碳素结构钢', label: '普通碳素结构钢' },
  { value: '优质碳素结构钢', label: '优质碳素结构钢' },
];

export function SteelGradeQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | SteelGradeCategory>('all');

  // 过滤数据
  const filteredData = useMemo(() => {
    return steelGradeData.filter(item => {
      // 类别筛选
      const categoryMatch = selectedCategory === 'all' || item.cat === selectedCategory;
      
      // 搜索筛选
      const term = searchTerm.toLowerCase().trim();
      if (!term) return categoryMatch;
      
      const searchMatch = 
        item.id.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.cn.some(g => g.toLowerCase().includes(term)) ||
        item.jp.some(g => g.toLowerCase().includes(term)) ||
        item.us.some(g => g.toLowerCase().includes(term));
      
      return categoryMatch && searchMatch;
    });
  }, [searchTerm, selectedCategory]);

  // 格式化牌号数组
  const formatGrades = (grades: string[]) => {
    if (!grades || grades.length === 0) return '-';
    return grades.join(', ');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 搜索和筛选区域 */}
      <div className="shrink-0 mb-6">
        <div className="glass-panel rounded-xl p-6 border border-glass-border">
          {/* 搜索框 */}
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="输入牌号搜索 (如: 304, SUS304, 1Cr18Ni9, 1.4301)..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                       focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                         hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* 类别筛选 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">filter_list</span>
              类别筛选:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-bold text-white">查询结果</h2>
        <span className="bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full border border-primary/30">
          共 {filteredData.length} 条记录
        </span>
      </div>

      {/* 结果网格 */}
      {filteredData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-white/5 p-6 rounded-full mb-4">
            <span className="material-symbols-outlined text-4xl text-slate-500">
              folder_open
            </span>
          </div>
          <h3 className="text-lg font-medium text-slate-300">未找到相关牌号</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            请尝试输入不同的关键词，或者切换类别筛选条件。
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
            {filteredData.map((item, index) => (
              <SteelGradeCard key={`${item.id}-${index}`} data={item} formatGrades={formatGrades} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 牌号卡片组件
function SteelGradeCard({ data, formatGrades }: { data: SteelGrade; formatGrades: (grades: string[]) => string }) {
  // 使用中国标准作为主标题，如果没有则使用DIN名称
  const mainTitle = data.cn.length > 0 ? data.cn[0] : data.name;
  const subTitle = data.cn.length > 1 ? data.cn.slice(1).join(', ') : null;

  return (
    <div className="glass-panel rounded-lg border border-glass-border overflow-hidden 
                    hover:border-primary/30 transition-all duration-300 hover:shadow-xl 
                    hover:shadow-primary/10 hover:-translate-y-1 group">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-white/5 to-transparent px-5 py-4 border-b border-white/5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
            {mainTitle}
          </h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded border border-primary/20 
                         whitespace-nowrap ml-2 shrink-0">
            {data.cat}
          </span>
        </div>
        {/* 次要中国标准牌号 */}
        {subTitle && (
          <p className="text-sm text-slate-400">{subTitle}</p>
        )}
      </div>

      {/* 内容 */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-1 gap-2.5 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold mb-1">日本标准 (JIS)</span>
            <span className="text-slate-300 font-medium">{formatGrades(data.jp)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold mb-1">美国标准 (AISI/ASTM)</span>
            <span className="text-slate-300 font-medium">{formatGrades(data.us)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold mb-1">德国标准 (DIN)</span>
            <span className="text-slate-300 font-medium">{data.name} ({data.id})</span>
          </div>
        </div>
      </div>

      {/* 备注 */}
      {data.note && (
        <div className="bg-amber-500/10 px-5 py-2 border-t border-amber-500/20">
          <p className="text-xs text-amber-400 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">info</span>
            {data.note}
          </p>
        </div>
      )}
    </div>
  );
}
