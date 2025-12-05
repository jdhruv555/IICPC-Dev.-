
import React from 'react';
import { AppMode } from '../types';
import { LayoutTemplate, Activity, ShieldCheck } from 'lucide-react';

interface AppLayoutProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ mode, setMode, children }) => {
  return (
    <div className="h-full w-full flex flex-col relative isolate">
      {/* Deep Atmospheric Glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-indigo-900/20 rounded-[100%] blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[400px] bg-blue-900/10 rounded-[100%] blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="z-50 flex items-center justify-between px-6 py-5 w-full max-w-[1400px] mx-auto shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg shadow-black/20">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Sentinel<span className="text-white/40 font-normal">Architect</span></h1>
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          <NavTab 
            active={mode === AppMode.ARCHITECT} 
            onClick={() => setMode(AppMode.ARCHITECT)}
            icon={<LayoutTemplate size={16} />}
            label="System Design"
          />
          <NavTab 
            active={mode === AppMode.SIMULATION} 
            onClick={() => setMode(AppMode.SIMULATION)}
            icon={<Activity size={16} />}
            label="Live Simulation"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
             <div className="text-xs font-bold text-white">Dhruv Jha</div>
             <div className="text-[10px] font-medium text-white/40">Security Admin</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/50">DJ</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 relative z-10 px-4 pb-2 overflow-hidden flex flex-col max-w-[1400px] mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-3 text-center relative z-20 shrink-0">
        <p className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase hover:text-white/40 transition-colors cursor-default">
          Made by Dhruv Jha
        </p>
      </footer>
    </div>
  );
};

const NavTab = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300
      ${active 
        ? 'bg-white/10 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)] ring-1 ring-white/10' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AppLayout;
