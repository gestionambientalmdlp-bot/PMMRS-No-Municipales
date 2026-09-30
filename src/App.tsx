import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { AppView, PMMRSPlan, ReviewReport } from './types';
import { loadDemoPlanFromFirestore, createBlankPlan, createBlankReviewReport } from './data/demoData';
import { runSpecializedAudit } from './utils/auditEngine';
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
  const [demoLoadState, setDemoLoadState] = useState<{
    loading: boolean;
    message: string | null;
    type: 'success' | 'error' | 'info';
  }>({ loading: false, message: null, type: 'info' });

  const loadDemoData = async () => {
    setDemoLoadState({
      loading: true,
      message: 'Conectando a Firebase Firestore y cargando el Plan Modelo Oficial (13 capítulos y 12 anexos)...',
      type: 'info'
    });
    try {
      const planFromFirestore = await loadDemoPlanFromFirestore();
      if (planFromFirestore && planFromFirestore.capitulos && planFromFirestore.capitulos.length > 0) {
        setActivePlan(planFromFirestore);
        saveDraftToLocalStorage(planFromFirestore);
        const report = runSpecializedAudit(planFromFirestore);
        setReviewReport(report);
        setDemoLoadState({
          loading: false,
          message: `¡Plan Modelo Oficial cargado fielmente desde Firebase Firestore! Empresa: ${planFromFirestore.company.razonSocial || 'Textiles Andina S.A.C.'} (${planFromFirestore.capitulos.length} capítulos y ${planFromFirestore.anexos?.length || 12} anexos oficiales R.M. 089-2023-MINAM).`,
          type: 'success'
        });
      } else {
        setDemoLoadState({
          loading: false,
          message: 'No se encontraron datos en la colección "modelo_plan" de Firestore.',
          type: 'error'
        });
      }
    } catch (err: any) {
      console.error('Error al cargar demo de Firestore:', err);
      setDemoLoadState({
        loading: false,
        message: 'Error al consultar la colección en Firebase Firestore: ' + (err.message || 'Verifique la conexión'),
        type: 'error'
      });
    } finally {
      setTimeout(() => {
        setDemoLoadState(prev => ({ ...prev, message: null }));
      }, 6000);
    }
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
        {/* Toast Notificación de Carga de Demo desde Firebase */}
        {demoLoadState.message && (
          <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-2 duration-300">
            <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
              demoLoadState.loading
                ? 'bg-[#FFDCF9] border-[#6C0053]/40 text-[#6C0053]'
                : demoLoadState.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              {demoLoadState.loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#6C0053] shrink-0 mt-0.5" />
              ) : demoLoadState.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <p className="font-bold text-sm mb-0.5">
                  {demoLoadState.loading ? 'Firebase Firestore' : demoLoadState.type === 'success' ? 'Plan Modelo Oficial' : 'Aviso de Conexión'}
                </p>
                <p>{demoLoadState.message}</p>
              </div>
              <button
                onClick={() => setDemoLoadState(prev => ({ ...prev, message: null }))}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

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
