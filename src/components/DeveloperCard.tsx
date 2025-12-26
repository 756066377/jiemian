import { useRef, useEffect } from 'react';
import './DeveloperCard.css';

export interface DeveloperCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperCard({ isOpen, onClose }: DeveloperCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭卡片
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // 清理事件监听
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
              <div className="card-content overflow-hidden">
                {/* 背景金属光泽 */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 via-transparent to-transparent" />

                {/* 卡片内容 */}
                <div className="relative p-8 space-y-6">
                  {/* 顶部金色装饰条 */}
                  <div className="h-1.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6" />

                  {/* 开发者信息 */}
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-600 to-yellow-700 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black">
                        <img src="/avatar.jpg" alt="开发者头像" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-500 tracking-wider uppercase">
                      开发者
                    </h3>
                    <p className="text-xl text-yellow-400 font-semibold font-serif">
                      酷酷的迪迦
                    </p>
                  </div>

                  {/* 金色装饰线 */}
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-80" />

                  {/* 邮箱信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-yellow-600/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs uppercase tracking-widest text-yellow-600/90">Email</span>
                    </div>
                    <p className="text-yellow-100 font-mono bg-black/40 border border-yellow-600/30 rounded px-4 py-3 text-center hover:bg-black/60 transition-colors tracking-wide">
                      iyl666946@gmail.com
                    </p>
                  </div>

                  {/* 企业信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-yellow-600/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs uppercase tracking-widest text-yellow-600/90">Company</span>
                    </div>
                    <p className="text-yellow-100 font-semibold bg-black/40 border border-yellow-600/30 rounded px-4 py-3 text-center hover:bg-black/60 transition-colors tracking-wide">
                      晟昌实业有限公司
                    </p>
                  </div>

                  {/* 底部装饰 */}
                  <div className="h-1.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
