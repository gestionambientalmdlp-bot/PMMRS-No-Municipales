import React, { useRef, useState, useEffect } from 'react';
import { 
  FileEdit, 
  CheckSquare, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  AlertTriangle,
  Building2,
  Trash2,
  FolderOpen,
  Upload,
  Clock,
  RotateCcw
} from 'lucide-react';
import { AppView, PMMRSPlan } from '../types';
import { parseDraftPlanFile, getDraftFromLocalStorage } from '../utils/draftStorage';

interface InicioViewProps {
  setCurrentView: (view: AppView) => void;
  activePlan: PMMRSPlan;
  loadDemoData: () => void;
  onLoadDraft?: (plan: PMMRSPlan) => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  setCurrentView,
  activePlan,
  loadDemoData,
  onLoadDraft
}) => {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [localStorageDraft, setLocalStorageDraft] = useState<{ plan: PMMRSPlan; savedAt: string } | null>(null);

  useEffect(() => {
    const backup = getDraftFromLocalStorage();
    if (backup && backup.plan && backup.plan.company && backup.plan.company.razonSocial) {
      setLocalStorageDraft(backup);
    }
  }, []);

  const handleContinuePlanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const restored = await parseDraftPlanFile(file);
      if (onLoadDraft) {
        onLoadDraft(restored);
      }
      setFeedback({
        type: 'success',
        message: `Plan restaurado con éxito para "${restored.company.razonSocial || 'la empresa'}". Redirigiendo a elaboración...`
      });
      setTimeout(() => {
        setCurrentView('elaborar');
      }, 1200);
    } catch (err: any) {
      console.error('Error al cargar archivo JSON:', err);
      setFeedback({
        type: 'error',
        message: 'El archivo seleccionado no es un borrador de plan válido (Continuar_plan_*.json).'
      });
    } finally {
      if (jsonInputRef.current) {
        jsonInputRef.current.value = '';
      }
    }
  };

  const handleRestoreLocalDraft = () => {
    if (localStorageDraft && onLoadDraft) {
      onLoadDraft(localStorageDraft.plan);
      setCurrentView('elaborar');
    }
  };

  const completedChapters = activePlan.capitulos.filter(c => c.completado).length;
  const totalChapters = activePlan.capitulos.length;
  const totalResiduos = activePlan.residuos.length;
  const totalPeligrosos = activePlan.residuos.filter(r => r.tipo === 'Peligroso').length;
  const totalNoPeligrosos = totalResiduos - totalPeligrosos;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hidden JSON Draft input */}
      <input
        type="file"
        ref={jsonInputRef}
        onChange={handleContinuePlanFile}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Draft Notification feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-sm flex items-center justify-between shadow-sm animate-in fade-in ${
          feedback.type === 'success' 
            ? 'bg-green-50 text-green-900 border border-green-300' 
            : 'bg-red-50 text-red-900 border border-red-300'
        }`}>
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="text-xs font-bold text-gray-500 hover:text-gray-800"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* LocalStorage Auto-backup Quick Restore Banner */}
      {localStorageDraft && (
        <div className="bg-[#FFDCF9]/50 border border-[#6C0053]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C0053] text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#70BA74]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6C0053]">
                Borrador guardado automáticamente en este navegador
              </p>
              <p className="text-xs text-gray-700">
                Empresa: <strong>{localStorageDraft.plan.company.razonSocial}</strong> ({new Date(localStorageDraft.savedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreLocalDraft}
              className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#51003d] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#70BA74]" />
              <span>Restaurar y Continuar</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#6C0053] to-[#51003d] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-[#70BA74]/30">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none select-none">
          <ShieldCheck className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#70BA74]/25 text-[#FFDCF9] border border-[#70BA74]/40 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-[#70BA74]" />
            <span>Plataforma Oficial de Gestión Normativa PMMRS</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white">
            Plan de Minimización y Manejo de Residuos Sólidos No Municipales
          </h1>
          <p className="text-base text-[#FFDCF9]/90 mb-6 leading-relaxed">
            Elabore, revise y valide su PMMRS garantizando estricto cumplimiento normativo conforme a la <strong className="text-white">R.M. N.° 089-2023-MINAM</strong>, <strong className="text-white">Decreto Legislativo N.° 1278</strong> y la NTP 900.058:2019 de código de colores.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentView('elaborar')}
              className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FileEdit className="w-5 h-5" />
              <span>Elaborar un PMMRS</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => jsonInputRef.current?.click()}
              className="flex items-center gap-2 bg-[#FFDCF9] hover:bg-[#f3cbe8] text-[#6C0053] px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              title="Cargar un archivo Continuar_plan_*.json guardado previamente"
            >
              <FolderOpen className="w-5 h-5 text-[#6C0053]" />
              <span>Continuar Plan</span>
            </button>
            <button
              onClick={() => setCurrentView('revisar')}
              className="flex items-center gap-2 bg-white text-[#6C0053] hover:bg-[#FFDCF9] px-6 py-3 rounded-xl font-bold shadow-lg transition-all cursor-pointer"
            >
              <CheckSquare className="w-5 h-5 text-[#6C0053]" />
              <span>Revisar un PMMRS</span>
            </button>
            <button
              onClick={loadDemoData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#FFDCF9] border border-[#FFDCF9]/30 px-5 py-3 rounded-xl font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#70BA74]" />
              <span>Cargar Demo Industrial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#424242] uppercase tracking-wider mb-1">Empresa Activa</p>
            <h3 className="text-lg font-bold text-[#6C0053] truncate max-w-[200px]" title={activePlan.company.razonSocial}>
              {activePlan.company.razonSocial || 'Sin registrar'}
            </h3>
            <p className="text-xs text-[#424242] mt-0.5">RUC: {activePlan.company.ruc || '--------'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFDCF9] flex items-center justify-center text-[#6C0053]">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#424242] uppercase tracking-wider mb-1">Avance del Plan</p>
            <h3 className="text-2xl font-extrabold text-[#424242]">
              {completedChapters} <span className="text-sm font-normal text-[#424242]">/ {totalChapters} Cap.</span>
            </h3>
            <p className="text-xs text-[#70BA74] font-medium mt-0.5">Estado: {activePlan.estado}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#70BA74]/15 flex items-center justify-center text-[#70BA74]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#424242] uppercase tracking-wider mb-1">Residuos Registrados</p>
            <h3 className="text-2xl font-extrabold text-[#424242]">{totalResiduos} <span className="text-sm font-normal text-[#424242]">tipos</span></h3>
            <p className="text-xs text-[#424242] mt-0.5">{totalNoPeligrosos} No Peligrosos | {totalPeligrosos} Peligrosos</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Trash2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#424242] uppercase tracking-wider mb-1">Marco Normativo</p>
            <h3 className="text-2xl font-extrabold text-[#424242]">5 <span className="text-sm font-normal text-[#424242]">Fuentes</span></h3>
            <p className="text-xs text-[#6C0053] font-medium mt-0.5">R.M. 089-2023-MINAM</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#6C0053]/10 flex items-center justify-center text-[#6C0053]">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Elaborar */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#CCCCCC]/40 flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#6C0053] flex items-center justify-center text-white mb-5 shadow">
              <FileEdit className="w-6 h-6 text-[#70BA74]" />
            </div>
            <h3 className="text-xl font-bold text-[#424242] mb-2">1. Elaborar un Plan PMMRS</h3>
            <p className="text-sm text-[#424242] mb-6 leading-relaxed">
              Asistente paso a paso para completar los 7 capítulos obligatorios exigidos por el MINAM: Aspectos generales, diagnóstico situacional, minimización, almacenamiento NTP 900.058, contingencias y presupuesto.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('elaborar')}
            className="w-full flex items-center justify-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white py-3 px-4 rounded-xl font-semibold transition-all"
          >
            <span>Iniciar Asistente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 2: Revisar */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#CCCCCC]/40 flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#70BA74] flex items-center justify-center text-white mb-5 shadow">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#424242] mb-2">2. Revisar un PMMRS</h3>
            <p className="text-sm text-[#424242] mb-6 leading-relaxed">
              Suba su Plan PMMRS en PDF o Word para auditarlo y compararlo contra los requerimientos de la R.M. N.° 089-2023-MINAM. Obtenga el Informe Técnico Oficial con Matriz de Hallazgos, análisis FODA, riesgos OEFA y Plan de Acción DO/DA.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('revisar')}
            className="w-full flex items-center justify-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white py-3 px-4 rounded-xl font-semibold transition-all"
          >
            <span>Subir y Revisar PMMRS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 3: Marco Normativo */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#CCCCCC]/40 flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FFDCF9] flex items-center justify-center text-[#6C0053] mb-5 shadow border border-[#6C0053]/20">
              <BookOpen className="w-6 h-6 text-[#6C0053]" />
            </div>
            <h3 className="text-xl font-bold text-[#424242] mb-2">3. Marco Normativo & NTP</h3>
            <p className="text-sm text-[#424242] mb-6 leading-relaxed">
              Consulte el repositorio legal con enlaces oficiales del SPIJ, MINAM e INACAL. Verifique el código de colores NTP 900.058:2019 y las resoluciones vigentes.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('normativo')}
            className="w-full flex items-center justify-center gap-2 bg-[#424242] hover:bg-[#333333] text-white py-3 px-4 rounded-xl font-semibold transition-all"
          >
            <span>Ver Marco Normativo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="bg-[#FFDCF9]/55 border border-[#6C0053]/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#6C0053] text-[#70BA74] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-[#424242]">Garantía de Fidelidad Normativa</h4>
            <p className="text-xs text-[#424242] mt-0.5">
              Esta aplicación no genera datos inventados: opera bajo la Matriz Maestra derivada de la R.M. N.° 089-2023-MINAM.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('ayuda')}
          className="bg-white text-[#6C0053] border border-[#6C0053]/30 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#6C0053] hover:text-white transition-all shadow-sm shrink-0"
        >
          Consultar Guía Metodológica
        </button>
      </div>
    </div>
  );
};
