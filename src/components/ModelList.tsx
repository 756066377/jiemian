import { useCallback, useMemo } from 'react';
import { HBeamData, EqualAngleData, UnequalAngleData, SteelData } from '../types';
import ModelListItem from './ModelListItem';

const CATEGORY_LABELS: Record<string, string> = {
  'HW_wide_flange': 'HW',
  'HM_medium_flange': 'HM',
  'HN_narrow_flange': 'HN',
  'HT_thin_wall': 'HT',
};

export function ModelList({
  models,
  selectedId,
  onModelSelect,
  steelCategory,
  getItemId
}: {
  models: SteelData[];
  selectedId: string | null;
  onModelSelect: (id: string) => void;
  steelCategory: string;
  getItemId: (model: SteelData) => string;
}) {
  const getCategoryLabel = useCallback((model: SteelData): string => {
    // Only show category labels for H-beam data
    if (steelCategory !== 'hot_rolled_h_beam') return '';

    const item = model as HBeamData;
    if (item.category && CATEGORY_LABELS[item.category]) {
      return CATEGORY_LABELS[item.category];
    }
    return '';
  }, [steelCategory]);

  // Get display spec for angle steel
  const getAngleSpec = useCallback((model: SteelData): string => {
    const equalAngle = model as EqualAngleData;
    const unequalAngle = model as UnequalAngleData;

    // Equal angle: B × d
    if (equalAngle.edge_width_mm !== undefined && equalAngle.thickness_mm !== undefined) {
      return `${equalAngle.edge_width_mm}×${equalAngle.thickness_mm}`;
    }

    // Unequal angle: B × b × d
    if (unequalAngle.long_edge_width_mm !== undefined && unequalAngle.short_edge_width_mm !== undefined && unequalAngle.thickness_mm !== undefined) {
      return `${unequalAngle.long_edge_width_mm}×${unequalAngle.short_edge_width_mm}×${unequalAngle.thickness_mm}`;
    }

    return String(model.model);
  }, []);

  // Check if there are multiple entries with same model to show dimensions
  const hasDuplicateModels = useMemo(() => {
    const modelSet = new Set<string>();
    const duplicates = new Set<string>();
    
    for (const m of models) {
      const modelStr = String(m.model);
      if (modelSet.has(modelStr)) {
        duplicates.add(modelStr);
      }
      modelSet.add(modelStr);
    }
    
    return (targetModel: string | number) => duplicates.has(String(targetModel));
  }, [models]);

  return (
    <div className="w-48 shrink-0 flex flex-col overflow-hidden glass-panel rounded-xl">
      <div className="p-3 border-b border-white/5 bg-white/5">
        <span className="text-xs font-bold text-slate-400 uppercase">
          {steelCategory === 'hot_rolled_equal_angle' || steelCategory === 'hot_rolled_unequal_angle' ? '规格' : 'Model No.'}
        </span>
      </div>
      <div className="overflow-y-auto p-2 space-y-1 h-full">
        {models.map((model) => {
          const id = getItemId(model);
          return (
            <ModelListItem
              key={id}
              model={model}
              selected={selectedId === id}
              onClick={() => onModelSelect(id)}
              steelCategory={steelCategory}
              getCategoryLabel={getCategoryLabel}
              getAngleSpec={getAngleSpec}
              hasDuplicateModels={hasDuplicateModels}
            />
          );
        })}
      </div>
    </div>
  );
}
