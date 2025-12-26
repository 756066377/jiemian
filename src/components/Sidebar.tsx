export function Sidebar({ selectedCategory, onCategoryChange }: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void
}) {
  const categories = [
    { id: 'hot_rolled_h_beam', name: '热轧H型钢', sub: 'H-Beam', icon: 'table_restaurant' },
    { id: 'hot_rolled_flat_steel', name: '热轧扁钢', sub: 'Flat Steel', icon: 'horizontal_rule' },
    { id: 'hot_rolled_equal_angle', name: '热轧角钢', sub: 'Angle Steel', icon: 'crop_square' },
    { id: 'hot_rolled_channel', name: '热轧槽钢', sub: 'Channel Steel', icon: 'call_to_action' },
    { id: 'hot_rolled_i_beam', name: '热轧工字钢', sub: 'I-Beam', icon: 'view_week' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-glass-border flex flex-col z-10 hidden md:flex">
      <div className="p-4 pb-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
          选择类别 (Category)
        </p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                selectedCategory === cat.id
                  ? 'active-nav-item'
                  : 'hover:bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </span>
              <div className="text-left">
                <p className="text-sm font-medium">{cat.name}</p>
                <p className="text-[10px] opacity-60">{cat.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-white/5">
        <div className="bg-gradient-to-br from-primary/20 to-transparent p-4 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            <span className="text-xs font-bold text-primary">当前标准</span>
          </div>
          <p className="text-xs text-slate-300">GB/T 11263-2017</p>
          <p className="text-[10px] text-slate-500 mt-1">热轧型钢国家标准</p>
        </div>
      </div>
    </aside>
  );
}
