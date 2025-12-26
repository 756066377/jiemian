import { memo } from 'react';
import { HBeamData, SteelData } from '../types';

interface ModelListItemProps {
  model: SteelData;
  selected: boolean;
  onClick: () => void;
  steelCategory: string;
  getCategoryLabel: (model: SteelData) => string;
  getAngleSpec: (model: SteelData) => string;
  hasDuplicateModels: (targetModel: string | number) => boolean;
}

function ModelListItem({ 
  model, 
  selected, 
  onClick, 
  steelCategory,
  getCategoryLabel,
  getAngleSpec,
  hasDuplicateModels
}: ModelListItemProps) {
  const id = JSON.stringify(model) + model.steel_type;
  const categoryLabel = getCategoryLabel(model);
  const isDuplicate = hasDuplicateModels(model.model);
  const item = model as HBeamData;
  const angleSpec = (steelCategory === 'hot_rolled_equal_angle' || steelCategory === 'hot_rolled_unequal_angle') ? getAngleSpec(model) : '';

  return (
    <button
      key={id}
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
        selected
          ? 'text-sm font-medium bg-primary/20 text-primary border border-primary/30 shadow-sm'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center justify-between gap-1 w-full">
          <span className="truncate">{angleSpec || model.model}</span>
          {categoryLabel && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-white/10 shrink-0">{categoryLabel}</span>
          )}
        </div>
        {steelCategory === 'hot_rolled_h_beam' && (isDuplicate || item.category) && item.height_mm !== undefined && item.width_mm !== undefined && (
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>{item.height_mm}×{item.width_mm}mm</span>
            {item.web_thickness_mm !== undefined && item.flange_thickness_mm !== undefined && (
              <span className="text-slate-600">({item.web_thickness_mm}×{item.flange_thickness_mm})</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export default memo(ModelListItem);
