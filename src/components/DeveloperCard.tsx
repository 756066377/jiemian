import { useRef } from 'react';
import './DeveloperCard.css';

export interface DeveloperCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperCard({ isOpen, onClose }: DeveloperCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭卡片
  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  // 清理事件监听
  const cleanup = () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };

  // 在组件卸载时清理
  return (
    <>
      {/* 点击外部监听 - 需要在实际渲染时添加 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            ref={cardRef}
            className="perspective-1000"
          >
            <div className="card-3d">
              {/* 卡片正面 */}
              <div className="card-content bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* 顶部装饰条 */}
                <div className="h-2 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />

                {/* 卡片内容 */}
                <div className="p-8 space-y-6">
                  {/* 开发者信息 */}
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-4">
                      开发者
                    </h3>
                    <p className="text-xl text-primary font-semibold">
                      酷酷的迪迦
                    </p>
                  </div>

                  {/* 分隔线 */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* 邮箱信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">开发者邮箱</span>
                    </div>
                    <p className="text-white font-mono bg-slate-800/50 rounded-lg px-4 py-2 text-center hover:bg-slate-800 transition-colors">
                      iyl666946@gmail.com
                    </p>
                  </div>

                  {/* 企业信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm">开发者企业</span>
                    </div>
                    <p className="text-white font-semibold bg-slate-800/50 rounded-lg px-4 py-2 text-center hover:bg-slate-800 transition-colors">
                      晟昌实业有限公司
                    </p>
                  </div>

                  {/* 关闭按钮 */}
                  <button
                    onClick={onClose}
                    className="w-full btn btn-outline btn-primary mt-4 hover:scale-105 transition-transform"
                  >
                    关闭
                  </button>
                </div>

                {/* 底部装饰 */}
                <div className="h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
