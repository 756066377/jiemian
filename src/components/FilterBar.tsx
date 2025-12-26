import { Category, SteelFilterCategory } from '../types';

// Common widths for hot-rolled flat steel (GB/T 704-1988)
const COMMON_WIDTHS = [
  10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 32, 36, 40, 45, 50, 56, 60, 63, 65,
  70, 75, 80, 85, 90, 95, 100, 105, 110, 120, 125, 130, 140, 150
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  steelCategory,
  flatSteelWidthFilter,
  onFlatSteelWidthChange,
  angleTypeFilter,
  onAngleTypeChange
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterType: Category | SteelFilterCategory;
  onFilterChange: (type: Category | SteelFilterCategory) => void;
  steelCategory: string;
  flatSteelWidthFilter?: number | null;
  onFlatSteelWidthChange?: (width: number | null) => void;
  angleTypeFilter?: 'equal' | 'unequal' | null;
  onAngleTypeChange?: (type: 'equal' | 'unequal' | null) => void;
}) {
  // Get steel name and filters based on category
  const getSteelInfo = (category: string) => {
    switch (category) {
      case 'hot_rolled_flat_steel':
        return {
          name: '热轧扁钢',
          filters: [] as const,
          placeholder: '搜索型号 (如: 100×10)...'
        };
      case 'hot_rolled_equal_angle':
      case 'hot_rolled_unequal_angle':
        return {
          name: '热轧角钢',
          filters: [
            { id: 'equal', label: '等边角钢' },
            { id: 'unequal', label: '不等边角钢' },
          ] as const,
          placeholder: '搜索规格 (如: 90×6, 100×63×8)...'
        };
      case 'hot_rolled_channel':
        return {
          name: '热轧槽钢',
          filters: [] as const,
          placeholder: '搜索型号 (如: 20a)...'
        };
      case 'hot_rolled_i_beam':
        return {
          name: '热轧工字钢',
          filters: [] as const,
          placeholder: '搜索型号 (如: 25a)...'
        };
      default:
        return {
          name: '热轧H型钢',
          filters: [
            { id: 'all', label: '全部型号' },
            { id: 'HW', label: 'HW（宽翼缘）' },
            { id: 'HM', label: 'HM（中翼缘）' },
            { id: 'HN', label: 'HN（窄翼缘）' },
            { id: 'HT', label: 'HT（薄壁）' },
          ] as const,
          placeholder: '搜索型号 (如: H596×199×10×15)...'
        };
    }
  };

  const steelInfo = getSteelInfo(steelCategory);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          {steelInfo.name}
          <span className="text-sm font-normal text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            GB Standard
          </span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">请选择具体型号以查看截面特性数据。</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative w-full md:w-80 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
            search
          </span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={steelInfo.placeholder}
          className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-[#1e293b]/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-[#1e293b] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 sm:text-sm transition-all shadow-inner"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <kbd className="hidden sm:inline-block border border-gray-600 rounded px-2 text-xs font-sans font-medium text-gray-400">
            Ctrl K
          </kbd>
        </div>
      </div>
      
      {/* Width Filter for Flat Steel */}
      {steelCategory === 'hot_rolled_flat_steel' && onFlatSteelWidthChange && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 uppercase tracking-wide font-medium">宽度筛选 (mm)</label>
          <select
            value={flatSteelWidthFilter || 'all'}
            onChange={(e) => onFlatSteelWidthChange(e.target.value === 'all' ? null : Number(e.target.value))}
            className="px-3 py-2 border border-white/10 rounded-lg bg-[#1e293b]/50 text-slate-100 text-sm focus:outline-none focus:bg-[#1e293b] focus:border-primary/50 transition-colors"
          >
            <option value="all">全部宽度</option>
            {COMMON_WIDTHS.map(width => (
              <option key={width} value={width}>{width}mm</option>
            ))}
          </select>
        </div>
      )}

      {/* Chips / Quick Filters */}
      {steelInfo.filters.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {steelInfo.filters.map((filter) => {
            // For angle steel, use angleTypeFilter instead of filterType
            const isSelected = steelCategory === 'hot_rolled_equal_angle' || steelCategory === 'hot_rolled_unequal_angle'
              ? angleTypeFilter === filter.id
              : filterType === filter.id;

            const handleClick = () => {
              if (steelCategory === 'hot_rolled_equal_angle' || steelCategory === 'hot_rolled_unequal_angle') {
                onAngleTypeChange?.(filter.id as 'equal' | 'unequal');
              } else {
                onFilterChange(filter.id as Category | SteelFilterCategory);
              }
            };

            return (
              <button
                key={filter.id}
                onClick={handleClick}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-white border border-primary'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
