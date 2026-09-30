import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { AppView, PMMRSPlan, ReviewReport } from './types';
import { DEMO_PLAN, DEMO_REVIEW_REPORT, createBlankPlan, createBlankReviewReport } from './data/demoData';
import { downloadJsonFile } from './utils/printReport';
import { saveDraftToLocalStorage } from './utils/draftStorage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { InicioView } from './components/InicioView';
import { ElaborarPlanView } from './components/ElaborarPlanView';
import { RevisarPlanView } from './components/RevisarPlanView';
import { MarcoNormativoView } from './components/MarcoNormativoView';
import { AdminConfigView } from './components/AdminConfigView';
import { DocumentosGuardadosView } from './components/DocumentosGuardadosView';
import { AyudaView } from './components/AyudaView';
import { FirestoreProvider } from './context/FirestoreContext';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('inicio');
  const [activePlan, setActivePlan] = useState<PMMRSPlan>(() => createBlankPlan());
  const [reviewReport, setReviewReport] = useState<ReviewReport>(() => createBlankReviewReport());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const loadDemoData = () => {
    setActivePlan(DEMO_PLAN);
    setReviewReport(DEMO_REVIEW_REPORT);
  };

  const resetToBlank = () => {
    const blank = createBlankPlan();
    setActivePlan(blank);
    setReviewReport(createBlankReviewReport(blank));
  };

  const handleLoadDraftPlan = (plan: PMMRSPlan) => {
    setActivePlan(plan);
    saveDraftToLocalStorage(plan);
    setCurrentView('elaborar');
  };

  const exportPlanJson = () => {
    const safeName = activePlan.company.razonSocial ? activePlan.company.razonSocial.replace(/[^a-zA-Z0-9]/g, '_') : 'Plan';
    const filename = `PMMRS_${safeName}_2026.json`;
    downloadJsonFile(activePlan, filename);
  };

  return (
    <FirestoreProvider>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row font-sans text-[#424242]">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          activePlan={activePlan}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentView={currentView}
            setCurrentView={setCurrentView}
            setIsMobileOpen={setIsMobileOpen}
            activePlan={activePlan}
            loadDemoData={loadDemoData}
            resetToBlank={resetToBlank}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentView === 'inicio' && (
              <InicioView
                setCurrentView={setCurrentView}
                activePlan={activePlan}
                loadDemoData={loadDemoData}
                onLoadDraft={handleLoadDraftPlan}
              />
            )}

            {currentView === 'elaborar' && (
              <ElaborarPlanView
                activePlan={activePlan}
                setActivePlan={setActivePlan}
                loadDemoData={loadDemoData}
              />
            )}

            {currentView === 'revisar' && (
              <RevisarPlanView
                activePlan={activePlan}
                reviewReport={reviewReport}
                setReviewReport={setReviewReport}
              />
            )}

            {currentView === 'normativo' && (
              <MarcoNormativoView />
            )}

            {currentView === 'admin' && (
              <AdminConfigView />
            )}

            {currentView === 'guardados' && (
              <DocumentosGuardadosView
                activePlan={activePlan}
                setActivePlan={setActivePlan}
                reviewReport={reviewReport}
                setReviewReport={setReviewReport}
                loadDemoData={loadDemoData}
              />
            )}

            {currentView === 'ayuda' && (
              <AyudaView />
            )}

            {/* Bottom Copyright Section */}
            <footer className="mt-12 pt-6 pb-4 border-t border-[#CCCCCC]/60 text-center no-print text-xs text-[#424242]">
              <p className="font-semibold text-sm text-[#424242] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <span>
                  Elaborado y diseñado por{' '}
                  <span className="text-[#6C0053] font-bold">Casa Altair - Equilibria</span>
                </span>
                <a
                  href="mailto:casa_altair@equilibria360.com"
                  className="inline-flex items-center gap-1.5 text-[#6C0053] hover:text-[#51003d] bg-[#FFDCF9] hover:bg-[#f3cbe8] px-2.5 py-0.5 rounded-full text-xs font-bold transition-all border border-[#6C0053]/25 shadow-xs"
                  title="Enviar correo para consultas profesionales"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6C0053]" />
                  <span>casa_altair@equilibria360.com</span>
                </a>
                <span className="text-gray-500">| Lima, Perú — Setiembre de 2026</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Plataforma Técnica de Gestión Ambiental para Planes de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS)
              </p>
            </footer>
          </main>
        </div>
      </div>
    </FirestoreProvider>
  );
}
