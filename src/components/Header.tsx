export function Header({ onMinimize, onMaximize, onClose }: {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}) {
  return (
    <header className="h-16 shrink-0 glass-panel z-50 flex items-center justify-between px-6 border-b border-glass-border select-none">
      {/* 拖动区域 - 左侧Logo和标题 */}
      <div
        className="flex items-center gap-3 flex-1 h-full"
        data-tauri-drag-region
      >
        <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-xl">architecture</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-lg tracking-tight">
            SteelLibrary <span className="text-primary">Pro</span>
          </h1>
          <p className="text-xs text-slate-400 -mt-1">截面特性查询系统</p>
        </div>
      </div>

      {/* 窗口控制按钮 - 禁用拖动 */}
      <div className="flex items-center gap-1" data-tauri-drag-region="false">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Minimize button clicked');
            if (onMinimize) onMinimize();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors no-drag z-50 relative"
          title="最小化"
          data-tauri-drag-region="false"
        >
          <span className="material-symbols-outlined text-lg pointer-events-none" data-tauri-drag-region="false">remove</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Maximize button clicked');
            if (onMaximize) onMaximize();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors no-drag z-50 relative"
          title="最大化"
          data-tauri-drag-region="false"
        >
          <span className="material-symbols-outlined text-lg pointer-events-none" data-tauri-drag-region="false">check_box_outline_blank</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Close button clicked');
            if (onClose) onClose();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-9 h-9 flex items-center justify-center rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors no-drag z-50 relative"
          title="关闭"
          data-tauri-drag-region="false"
        >
          <span className="material-symbols-outlined text-lg pointer-events-none" data-tauri-drag-region="false">close</span>
        </button>
      </div>
    </header>
  );
}
