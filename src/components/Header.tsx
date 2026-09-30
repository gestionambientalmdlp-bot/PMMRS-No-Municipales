import React from 'react';
import { 
  Menu, 
  RotateCcw,
  Settings,
  Database
} from 'lucide-react';
import { AppView, PMMRSPlan } from '../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView?: (view: AppView) => void;
  setIsMobileOpen: (open: boolean) => void;
  activePlan: PMMRSPlan;
  loadDemoData?: () => void;
  resetToBlank: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  setIsMobileOpen,
  activePlan,
  resetToBlank
}) => {
  return (
    <header className="bg-white border-b border-[#CCCCCC] px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-[#424242] hover:text-[#6C0053] focus:outline-none"
          title="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#6C0053] bg-[#FFDCF9] px-2 py-0.5 rounded">
              {currentView === 'elaborar' ? 'Elaborar un PMMRS' : currentView === 'revisar' ? 'Revisar un PMMRS' : currentView === 'admin' ? 'Configuración / Admin' : currentView === 'normativo' ? 'Marco Normativo' : 'Sistema PMMRS'}
            </span>
            <span className="text-xs text-[#424242] hidden sm:inline">
              | R.M. 089-2023-MINAM & D.L. 1278
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#424242] truncate max-w-md md:max-w-xl" title={activePlan.titulo}>
            {activePlan.titulo}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={resetToBlank}
          className="p-2 text-[#424242] hover:text-red-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          title="Nuevo Plan en blanco"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
