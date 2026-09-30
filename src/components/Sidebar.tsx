import React from 'react';
import { 
  Home, 
  FileEdit, 
  CheckSquare, 
  BookOpen, 
  FolderArchive, 
  HelpCircle, 
  ShieldCheck,
  Menu,
  X,
  Mail,
  Settings
} from 'lucide-react';
import { AppView, PMMRSPlan } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activePlan: PMMRSPlan;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  activePlan,
  isMobileOpen,
  setIsMobileOpen
}) => {
  // Calculate completion percentage based on chapters
  const completedChapters = activePlan.capitulos.filter(c => c.completado).length;
  const totalChapters = activePlan.capitulos.length;
  const progressPercentage = Math.round((completedChapters / (totalChapters || 7)) * 100);

  const navItems = [
    { id: 'inicio' as AppView, label: 'Inicio', icon: Home },
    { id: 'elaborar' as AppView, label: 'Elaborar un PMMRS', icon: FileEdit },
    { id: 'revisar' as AppView, label: 'Revisar un PMMRS', icon: CheckSquare },
    { id: 'normativo' as AppView, label: 'Marco Normativo', icon: BookOpen },
    { id: 'admin' as AppView, label: 'Configuración / Admin', icon: Settings },
    { id: 'ayuda' as AppView, label: 'Guía y Metodología', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container - Sticky on desktop to always stay visible at top */}
      <aside className={`
        fixed lg:sticky lg:top-0 lg:h-screen lg:self-start inset-y-0 left-0 z-40 w-72 bg-[#424242] text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand header */}
        <div className="p-6 border-b border-[#6C0053] bg-[#363636] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C0053] flex items-center justify-center text-white shadow-lg border border-[#70BA74]/40">
              <ShieldCheck className="w-6 h-6 text-[#70BA74]" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white">PMMRS Perú</h1>
              <p className="text-xs text-[#CCCCCC]">Residuos No Municipales</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-[#CCCCCC] hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Active plan status card */}
        <div className="p-4 m-3 bg-[#333333] rounded-xl border border-[#CCCCCC]/20 shadow-inner shrink-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-[#FFDCF9]">Plan Activo:</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#70BA74]/20 text-[#70BA74] font-semibold">
              {activePlan.estado}
            </span>
          </div>
          <p className="text-xs font-semibold text-white truncate mb-2" title={activePlan.titulo}>
            {activePlan.company.razonSocial || 'Sin empresa asignada'}
          </p>
          <div className="w-full bg-[#222222] rounded-full h-2 mb-1 overflow-hidden">
            <div 
              className="bg-[#70BA74] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#CCCCCC]">
            <span>Avance del Plan</span>
            <span className="font-bold text-white">{progressPercentage}%</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-[#6C0053] text-white shadow-md border-l-4 border-[#70BA74]' 
                    : 'text-[#CCCCCC] hover:bg-[#505050] hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#70BA74]' : 'text-[#CCCCCC]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[#505050] text-xs text-[#CCCCCC] bg-[#3a3a3a] space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#70BA74] animate-pulse"></span>
            <span className="font-semibold text-white">R.M. N.° 089-2023-MINAM</span>
          </div>
          <p className="text-[11px] text-[#CCCCCC]">Conforme a D.L. 1278 y NTP 900.058:2019</p>
          <div className="pt-2 border-t border-[#505050]/80 text-[10px] text-gray-300 space-y-1">
            <p className="font-medium text-[#FFDCF9]">Casa Altair - Equilibria</p>
            <a 
              href="mailto:casa_altair@equilibria360.com" 
              className="inline-flex items-center gap-1 text-[#70BA74] hover:text-[#88d98d] hover:underline"
              title="Contacto para consultas profesionales"
            >
              <Mail className="w-3 h-3 text-[#70BA74]" />
              <span>casa_altair@equilibria360.com</span>
            </a>
            <p className="text-gray-400">Lima, Perú — Setiembre de 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
};
