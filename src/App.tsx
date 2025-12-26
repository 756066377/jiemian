import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header, Sidebar, FilterBar, ModelList, DetailView, HBeamCalculatorModal, SteelExpansionCalculator, DeveloperCard } from './components';
import { hbeamData } from './data/hbeamData';
import { flatSteelData } from './data/flatSteelData';
import { equalAngleData } from './data/equalAngleData';
import { unequalAngleData } from './data/unequalAngleData';
import { channelData } from './data/channelData';
import { iBeamData } from './data/iBeamData';
import { HBeamData, Category, SteelData, SteelFilterCategory } from './types';
import { getCurrentWindow } from '@tauri-apps/api/window';
import './index.css';

// Pre-merged data for angle steel to avoid recalculating on every render
const angleData = [...equalAngleData, ...unequalAngleData];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('hot_rolled_h_beam');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<Category | SteelFilterCategory>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flatSteelWidthFilter, setFlatSteelWidthFilter] = useState<number | null>(null);
  const [angleTypeFilter, setAngleTypeFilter] = useState<'equal' | 'unequal' | null>('equal');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Get data based on selected category
  const currentData = useMemo(() => {
    switch (selectedCategory) {
      case 'hot_rolled_flat_steel':
        return flatSteelData;
      case 'hot_rolled_equal_angle':
      case 'hot_rolled_unequal_angle':
        return angleData;
      case 'hot_rolled_channel':
        return channelData;
      case 'hot_rolled_i_beam':
        return iBeamData;
      default:
        return hbeamData;
    }
  }, [selectedCategory]);

  // Filter models based on search and filter
  const filteredModels = useMemo(() => {
    let filtered = [...currentData];

    // Apply angle type filter (for angle steel)
    if ((selectedCategory === 'hot_rolled_equal_angle' || selectedCategory === 'hot_rolled_unequal_angle') && angleTypeFilter) {
      if (angleTypeFilter === 'equal') {
        filtered = filtered.filter((d: any) => d.steel_type === 'hot_rolled_equal_angle');
      } else if (angleTypeFilter === 'unequal') {
        filtered = filtered.filter((d: any) => d.steel_type === 'hot_rolled_unequal_angle');
      }
    }

    // Apply flat steel width filter
    if (selectedCategory === 'hot_rolled_flat_steel' && flatSteelWidthFilter !== null) {
      filtered = filtered.filter((d: any) => d.width_mm === flatSteelWidthFilter);
    }

    // Apply H-beam category filter
    if (selectedCategory === 'hot_rolled_h_beam' && filterType !== 'all') {
      if (filterType === 'HW') {
        filtered = filtered.filter(d => (d as HBeamData).category === 'HW_wide_flange');
      } else if (filterType === 'HM') {
        filtered = filtered.filter(d => (d as HBeamData).category === 'HM_medium_flange');
      } else if (filterType === 'HN') {
        filtered = filtered.filter(d => (d as HBeamData).category === 'HN_narrow_flange');
      } else if (filterType === 'HT') {
        filtered = filtered.filter(d => (d as HBeamData).category === 'HT_thin_wall');
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => {
        // Angle steel: search by dimensions (B×d or B×b×d)
        if (selectedCategory === 'hot_rolled_equal_angle' || selectedCategory === 'hot_rolled_unequal_angle') {
          const item = d as any;
          if (item.edge_width_mm !== undefined) {
            // Equal angle: B×d
            const spec = `${item.edge_width_mm}×${item.thickness_mm}`;
            return spec.includes(query) || String(item.model).toLowerCase().includes(query);
          } else if (item.long_edge_width_mm !== undefined) {
            // Unequal angle: B×b×d
            const spec = `${item.long_edge_width_mm}×${item.short_edge_width_mm}×${item.thickness_mm}`;
            return spec.includes(query) || String(item.model).toLowerCase().includes(query);
          }
        }

        // Other steel types: search by model
        return String(d.model).toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [currentData, searchQuery, filterType, selectedCategory, flatSteelWidthFilter, angleTypeFilter]);

  // Generate unique ID for each item - IMPORTANT: Must be consistent between App and ModelList
  // Add steel type prefix to prevent ID conflicts between different steel types
  const getItemId = useCallback((model: SteelData): string => {
    const item = model as HBeamData;

    // H-beams: use category + dimensions
    if (selectedCategory === 'hot_rolled_h_beam' && item.category && item.height_mm !== undefined && item.width_mm !== undefined) {
      return `${selectedCategory}::${item.category}_${item.height_mm}x${item.width_mm}`;
    }

    // Angle steel: use steel type + model + thickness to distinguish equal vs unequal with same model
    if (selectedCategory === 'hot_rolled_equal_angle' || selectedCategory === 'hot_rolled_unequal_angle') {
      const angleItem = model as any;
      return `${angleItem.steel_type}::${String(model.model)}_${angleItem.thickness_mm}`;
    }

    // All other steel types: use steel type + model to ensure uniqueness
    return `${selectedCategory}::${String(model.model)}`;
  }, [selectedCategory]);

  // Get selected model data
  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    return filteredModels.find(d => getItemId(d) === selectedId) || null;
  }, [selectedId, filteredModels, getItemId]);

  // Reset selected ID and filter type when category changes (CRITICAL FIX)
  useEffect(() => {
    setSelectedId(null);
    // Reset filter type to 'all' when switching to non-H-beam types
    if (selectedCategory !== 'hot_rolled_h_beam') {
      setFilterType('all');
    }
    // Reset flat steel width filter when switching to non-flat steel types
    if (selectedCategory !== 'hot_rolled_flat_steel') {
      setFlatSteelWidthFilter(null);
    }
    // Reset angle type filter to 'equal' when switching to angle types
    if (selectedCategory === 'hot_rolled_equal_angle' || selectedCategory === 'hot_rolled_unequal_angle') {
      setAngleTypeFilter('equal');
    }
  }, [selectedCategory]);

  // Debug: log filtered data distribution
  useEffect(() => {
    if (selectedCategory === 'hot_rolled_h_beam') {
      const categories = filteredModels.map(d => (d as HBeamData).category);
      const uniqueCategories = [...new Set(categories)];
      console.log('Filtered H-beam data:', {
        total: filteredModels.length,
        filterType,
        categories: uniqueCategories,
        counts: uniqueCategories.map(cat => ({
          category: cat,
          count: filteredModels.filter(d => (d as HBeamData).category === cat).length
        }))
      });
    }
  }, [filteredModels, selectedCategory, filterType]);

  const handleMinimize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.toggleMaximize();
  };

  const handleClose = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  return (
    <div className="bg-[#111a22] text-white font-body overflow-hidden h-screen flex flex-col bg-grid-pattern">
      <Header 
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />
        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1219]/50 overflow-hidden relative">
          {/* 钢板展开计算器 */}
          {selectedCategory === 'steel_expansion_calculator' ? (
            <div className="p-6 overflow-hidden h-full">
              <SteelExpansionCalculator />
            </div>
          ) : selectedCategory === 'developer_info' ? (
            <div className="p-6 overflow-hidden h-full flex items-center justify-center">
              <DeveloperCard />
            </div>
          ) : (
            <>
              {/* Model Selection & Filters Header */}
              <div className="p-6 pb-2 shrink-0">
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterType={filterType as Category | SteelFilterCategory}
                  onFilterChange={setFilterType}
                  steelCategory={selectedCategory}
                  flatSteelWidthFilter={flatSteelWidthFilter}
                  onFlatSteelWidthChange={setFlatSteelWidthFilter}
                  angleTypeFilter={angleTypeFilter}
                  onAngleTypeChange={setAngleTypeFilter}
                />
              </div>
              {/* Content Split: List & Detail */}
              <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">
                <ModelList
                  models={filteredModels}
                  selectedId={selectedId}
                  onModelSelect={setSelectedId}
                  steelCategory={selectedCategory}
                  getItemId={getItemId}
                />
                <DetailView data={selectedData} onOpenCalculator={() => setIsCalculatorOpen(true)} />
              </div>
            </>
          )}
        </main>
      </div>

      <HBeamCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* 开发者信息卡片 */}
      <DeveloperCard />
    </div>
  );
}

export default App;
