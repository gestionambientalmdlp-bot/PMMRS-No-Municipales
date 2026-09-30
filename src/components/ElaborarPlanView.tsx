import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Trash, 
  Printer, 
  Download, 
  AlertTriangle, 
  Sparkles, 
  Layers,
  Save,
  Check,
  ChevronRight,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  X,
  Copy,
  BookOpen,
  Wand2,
  Info,
  FolderOpen,
  FileSpreadsheet,
  Clock,
  RotateCcw
} from 'lucide-react';
import { PMMRSPlan, WasteItem, PlanChapter } from '../types';
import { downloadPlanPdf, generatePlanHtml, openPrintWindow } from '../utils/printReport';
import { OFFICIAL_13_CHAPTERS } from '../data/promptsPmmrs';
import { exportDraftPlanJson, parseDraftPlanFile, saveDraftToLocalStorage, getDraftFromLocalStorage } from '../utils/draftStorage';
import { getAnnexForChapter } from '../utils/excelAnnexes';
import { AnnexExcelUploadCard } from './AnnexExcelUploadCard';
import { FormattedChapterContent } from './FormattedChapterContent';
import { useFirestore } from '../context/FirestoreContext';

interface ElaborarPlanViewProps {
  activePlan: PMMRSPlan;
  setActivePlan: React.Dispatch<React.SetStateAction<PMMRSPlan>>;
  loadDemoData: () => void;
}

export const ElaborarPlanView: React.FC<ElaborarPlanViewProps> = ({
  activePlan,
  setActivePlan,
  loadDemoData
}) => {
  const { contenidoMinimo, activeNormas, isFirestoreConnected } = useFirestore();
  const [activeTab, setActiveTab] = useState<'empresa' | 'header' | 'residuos' | 'capitulos' | 'preview'>('empresa');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(activePlan.capitulos[0]?.id || 'cap-1');
  
  // Draft Continuation & Persistence State
  const jsonDraftInputRef = useRef<HTMLInputElement>(null);
  const [draftFeedback, setDraftFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [localBackupDraft, setLocalBackupDraft] = useState<{ plan: PMMRSPlan; savedAt: string } | null>(null);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);

  // Check on mount for existing LocalStorage backup
  useEffect(() => {
    const backup = getDraftFromLocalStorage();
    if (backup && backup.plan && backup.plan.company && backup.plan.company.razonSocial) {
      // If current plan is blank or has no company name, offer to restore or detect
      if (!activePlan.company.razonSocial) {
        setLocalBackupDraft(backup);
      }
    }
  }, []);

  // Auto-save backup copy to LocalStorage on activePlan changes
  useEffect(() => {
    if (activePlan && activePlan.company && (activePlan.company.razonSocial || activePlan.residuos.length > 0)) {
      saveDraftToLocalStorage(activePlan);
      setLastAutoSaveTime(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [activePlan]);

  const handleSaveAdvanceDraft = () => {
    const result = exportDraftPlanJson(activePlan);
    if (result.success) {
      setDraftFeedback({
        type: 'success',
        message: `¡Avance guardado con éxito! Se ha descargado el archivo "${result.filename}" con el estado completo del formulario, capítulos y tablas.`
      });
      setTimeout(() => setDraftFeedback(null), 8000);
    } else {
      setDraftFeedback({
        type: 'error',
        message: 'No se pudo generar el archivo JSON de guardado.'
      });
    }
  };

  const handleContinueDraftFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const restored = await parseDraftPlanFile(file);
      setActivePlan(restored);
      setLocalBackupDraft(null);
      setDraftFeedback({
        type: 'success',
        message: `¡Plan restaurado exitosamente desde "${file.name}"! Se cargaron los datos de "${restored.company.razonSocial || 'la empresa'}", sus ${restored.capitulos.length} capítulos y ${restored.residuos.length} residuos.`
      });
      setTimeout(() => setDraftFeedback(null), 8000);
    } catch (err: any) {
      console.error('Error al continuar plan desde JSON:', err);
      setDraftFeedback({
        type: 'error',
        message: 'El archivo seleccionado no es un archivo de borrador válido (Continuar_plan_*.json).'
      });
    } finally {
      if (jsonDraftInputRef.current) {
        jsonDraftInputRef.current.value = '';
      }
    }
  };

  const handleRestoreLocalStorageDraft = () => {
    if (localBackupDraft) {
      setActivePlan(localBackupDraft.plan);
      setDraftFeedback({
        type: 'success',
        message: `Borrador de respaldo restaurado para "${localBackupDraft.plan.company.razonSocial}".`
      });
      setLocalBackupDraft(null);
      setTimeout(() => setDraftFeedback(null), 6000);
    }
  };

  const applyStandardGuideline = (chapterNum: number) => {
    const guideline = OFFICIAL_13_CHAPTERS.find(g => g.numero === chapterNum);
    if (!guideline) return;
    const currentCap = activePlan.capitulos.find(c => c.numero === chapterNum);
    if (!currentCap) return;
    handleChapterContentChange(currentCap.id, guideline.ejemploTexto);
  };

  const handleCompanyChange = (field: keyof PMMRSPlan['company'], value: string | number) => {
    setActivePlan(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value },
      fechaModificacion: new Date().toISOString().split('T')[0]
    }));
  };

  const handleHeaderChange = (field: keyof PMMRSPlan['header'], value: string) => {
    setActivePlan(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value },
      fechaModificacion: new Date().toISOString().split('T')[0]
    }));
  };

  const handleChapterContentChange = (id: string, contenido: string) => {
    setActivePlan(prev => ({
      ...prev,
      capitulos: prev.capitulos.map(c => c.id === id ? { ...c, contenido, completado: contenido.length > 30 } : c),
      fechaModificacion: new Date().toISOString().split('T')[0]
    }));
  };

  const addWasteItem = () => {
    const newItem: WasteItem = {
      id: `res-${Date.now()}`,
      tipo: 'No Peligroso',
      categoria: 'Nuevo Residuo',
      descripcion: 'Descripción del residuo',
      estadoFisico: 'Sólido',
      peligrosidad: ['Inerte'],
      generacionEstimadaKgMes: 50,
      almacenamiento: 'Almacén Temporal',
      colorContenedorNtp: 'Azul (Papel y Cartón)',
      destinoFinal: 'EO-RS Autorizada',
      minimizacionAccion: 'Segregación en origen'
    };
    setActivePlan(prev => ({
      ...prev,
      residuos: [...prev.residuos, newItem],
      fechaModificacion: new Date().toISOString().split('T')[0]
    }));
  };

  const updateWasteItem = (id: string, field: keyof WasteItem, value: any) => {
    setActivePlan(prev => ({
      ...prev,
      residuos: prev.residuos.map(w => w.id === id ? { ...w, [field]: value } : w),
      fechaModificacion: new Date().toISOString().split('T')[0]
    }));
  };

  const removeWasteItem = (id: string) => {
    setActivePlan(prev => ({
      ...prev,
      residuos: prev.residuos.filter(w => w.id !== id),
      fechaModificacion: new Date().toISOString().split('T')[0]
    }));
  };

  const handleSavePdf = () => {
    downloadPlanPdf(activePlan);
  };

  const handlePrint = () => {
    try {
      const html = generatePlanHtml(activePlan);
      const filename = `PMMRS_${(activePlan.company.razonSocial || 'Plan').replace(/[^a-zA-Z0-9]/g, '_')}_2026.html`;
      openPrintWindow(html, filename);
    } catch {
      window.print();
    }
  };

  const totalResiduosKg = activePlan.residuos.reduce((acc, curr) => acc + (Number(curr.generacionEstimadaKgMes) || 0), 0);
  const totalPeligrososKg = activePlan.residuos.filter(r => r.tipo === 'Peligroso').reduce((acc, curr) => acc + (Number(curr.generacionEstimadaKgMes) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Navigation for Wizard (Fixed overlapping, regular flow) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#CCCCCC]/40 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('empresa')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'empresa'
                ? 'bg-[#6C0053] text-white shadow'
                : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
            }`}
          >
            Paso 1: Datos Empresa (Carátula)
          </button>
          <button
            onClick={() => setActiveTab('header')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'header'
                ? 'bg-[#6C0053] text-white shadow'
                : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
            }`}
          >
            Paso 2: Membrete & Logo
          </button>
          <button
            onClick={() => setActiveTab('residuos')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'residuos'
                ? 'bg-[#6C0053] text-white shadow'
                : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
            }`}
          >
            Paso 3: Inventario Residuos ({activePlan.residuos.length})
          </button>
          <button
            onClick={() => setActiveTab('capitulos')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'capitulos'
                ? 'bg-[#6C0053] text-white shadow'
                : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
            }`}
          >
            Paso 4: Redacción Capítulos (1 al 13)
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-[#70BA74] text-white shadow'
                : 'bg-[#FFDCF9] text-[#6C0053] hover:bg-[#f3cbe8]'
            }`}
          >
            Paso 5: Vista Previa & Reporte PDF
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center">
          {/* Hidden JSON Draft file input */}
          <input
            type="file"
            ref={jsonDraftInputRef}
            onChange={handleContinueDraftFile}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => jsonDraftInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#FFDCF9] hover:bg-[#f3cbe8] text-[#6C0053] px-3.5 py-2 rounded-xl text-xs font-bold border border-[#6C0053]/30 shadow-xs transition-all cursor-pointer"
            title="Subir archivo Continuar_plan_*.json para continuar con su borrador"
          >
            <FolderOpen className="w-4 h-4 text-[#6C0053]" />
            <span>Continuar Plan</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAdvanceDraft}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Descargar archivo Continuar_plan_[Empresa].json con todos los campos y tablas"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Guardar Avance</span>
          </button>

          <button
            type="button"
            onClick={loadDemoData}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-[#424242] border border-gray-300 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Cargar datos de demostración"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#70BA74]" />
            <span>Cargar Demo</span>
          </button>
        </div>
      </div>

      {/* Auto-backup LocalStorage Indicator / Banner */}
      {localBackupDraft && (
        <div className="bg-[#FFDCF9]/40 border border-[#6C0053]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C0053] text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#70BA74]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6C0053]">
                Se detectó una copia de respaldo guardada en este navegador
              </p>
              <p className="text-xs text-gray-700">
                Empresa: <strong>{localBackupDraft.plan.company.razonSocial}</strong> ({new Date(localBackupDraft.savedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreLocalStorageDraft}
              className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#51003d] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#70BA74]" />
              <span>Restaurar Copia</span>
            </button>
            <button
              onClick={() => setLocalBackupDraft(null)}
              className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 font-semibold"
            >
              Ignorar
            </button>
          </div>
        </div>
      )}

      {/* Draft Feedback Message */}
      {draftFeedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-in fade-in ${
          draftFeedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' 
            : 'bg-red-50 text-red-900 border border-red-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {draftFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="font-semibold leading-relaxed">{draftFeedback.message}</span>
          </div>
          <button 
            onClick={() => setDraftFeedback(null)}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 ml-3"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* TAB 1: EMPRESA */}
      {activeTab === 'empresa' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-[#424242] flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#6C0053]" />
              <span>Datos Generales de la Empresa y Establecimiento</span>
            </h3>
            <p className="text-xs text-[#424242] mt-1">
              Información del generador de residuos sólidos no municipales exigida por la R.M. N.° 089-2023-MINAM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Razón Social</label>
              <input
                type="text"
                value={activePlan.company.razonSocial}
                onChange={e => handleCompanyChange('razonSocial', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">RUC (11 dígitos)</label>
              <input
                type="text"
                value={activePlan.company.ruc}
                onChange={e => handleCompanyChange('ruc', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Nombre Comercial</label>
              <input
                type="text"
                value={activePlan.company.nombreComercial}
                onChange={e => handleCompanyChange('nombreComercial', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Domicilio Legal / Planta</label>
              <input
                type="text"
                value={activePlan.company.domicilio}
                onChange={e => handleCompanyChange('domicilio', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Departamento / Provincia / Distrito</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Dpto"
                  value={activePlan.company.departamento}
                  onChange={e => handleCompanyChange('departamento', e.target.value)}
                  className="bg-gray-50 border border-[#CCCCCC] rounded-xl px-3 py-2.5 text-xs text-[#424242]"
                />
                <input
                  type="text"
                  placeholder="Prov"
                  value={activePlan.company.provincia}
                  onChange={e => handleCompanyChange('provincia', e.target.value)}
                  className="bg-gray-50 border border-[#CCCCCC] rounded-xl px-3 py-2.5 text-xs text-[#424242]"
                />
                <input
                  type="text"
                  placeholder="Dist"
                  value={activePlan.company.distrito}
                  onChange={e => handleCompanyChange('distrito', e.target.value)}
                  className="bg-gray-50 border border-[#CCCCCC] rounded-xl px-3 py-2.5 text-xs text-[#424242]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Representante Legal</label>
              <input
                type="text"
                value={activePlan.company.representanteLegal}
                onChange={e => handleCompanyChange('representanteLegal', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">DNI / Documento Rep.</label>
              <input
                type="text"
                value={activePlan.company.dniRepresentante}
                onChange={e => handleCompanyChange('dniRepresentante', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Sector Económico</label>
              <input
                type="text"
                value={activePlan.company.sector}
                onChange={e => handleCompanyChange('sector', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Actividad Económica Principal</label>
              <input
                type="text"
                value={activePlan.company.actividadEconomica}
                onChange={e => handleCompanyChange('actividadEconomica', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Número de Trabajadores</label>
              <input
                type="number"
                value={activePlan.company.numeroTrabajadores}
                onChange={e => handleCompanyChange('numeroTrabajadores', Number(e.target.value))}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Horario de Operación</label>
              <input
                type="text"
                value={activePlan.company.horarioOperacion}
                onChange={e => handleCompanyChange('horarioOperacion', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Correo de Contacto</label>
              <input
                type="email"
                value={activePlan.company.correoContacto}
                onChange={e => handleCompanyChange('correoContacto', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Teléfono</label>
              <input
                type="text"
                value={activePlan.company.telefonoContacto}
                onChange={e => handleCompanyChange('telefonoContacto', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('header')}
              className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-6 py-3 rounded-xl font-bold text-sm shadow"
            >
              <span>Siguiente: Membrete & Institución</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: HEADER INSTITUCIONAL */}
      {activeTab === 'header' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-[#424242] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#6C0053]" />
              <span>Membrete y Datos del Documento Institucional</span>
            </h3>
            <p className="text-xs text-[#424242] mt-1">
              Configure la carátula, el logotipo, encabezados y firmantes del informe final conforme a los estándares oficiales A4.
            </p>
          </div>

          {/* Logo Upload Section */}
          <div className="bg-gray-50 border-2 border-dashed border-[#CCCCCC] hover:border-[#6C0053] rounded-2xl p-6 transition-all">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {activePlan.header.logoUrl ? (
                <div className="relative group shrink-0 bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex items-center justify-center">
                  <img
                    src={activePlan.header.logoUrl}
                    alt="Logo institucional cargado"
                    className="h-20 max-w-[200px] object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleHeaderChange('logoUrl', '')}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-all"
                    title="Eliminar logotipo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[#FFDCF9] border border-[#6C0053]/20 flex flex-col items-center justify-center text-[#6C0053] shrink-0">
                  <ImageIcon className="w-8 h-8 text-[#6C0053]" />
                </div>
              )}

              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="text-sm font-bold text-[#424242] flex items-center justify-center sm:justify-start gap-2">
                  <Upload className="w-4 h-4 text-[#6C0053]" />
                  <span>Logotipo Institucional / Empresarial</span>
                </h4>
                <p className="text-xs text-gray-500">
                  Cargue la imagen del logotipo de su empresa (PNG, JPG, SVG o WebP). Se integrará automáticamente en la carátula y el membrete del Plan oficial A4 y en los reportes técnicos.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{activePlan.header.logoUrl ? 'Cambiar Logotipo' : 'Cargar Imagen de Logotipo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (!file.type.startsWith('image/')) {
                            alert('Por favor seleccione un archivo de imagen válido.');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (uploadEvent) => {
                            const result = uploadEvent.target?.result as string;
                            if (result) {
                              handleHeaderChange('logoUrl', result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {activePlan.header.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleHeaderChange('logoUrl', '')}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-all"
                    >
                      Quitar Logotipo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Título del Documento en Carátula</label>
              <input
                type="text"
                value={activePlan.header.tituloDocumento}
                onChange={e => handleHeaderChange('tituloDocumento', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Razón Social en Membrete</label>
              <input
                type="text"
                value={activePlan.header.razonSocialHeader}
                onChange={e => handleHeaderChange('razonSocialHeader', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Versión y Año</label>
              <input
                type="text"
                value={activePlan.header.version}
                onChange={e => handleHeaderChange('version', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Fecha de Emisión</label>
              <input
                type="text"
                value={activePlan.header.fechaEmision}
                onChange={e => handleHeaderChange('fechaEmision', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Elaborado Por (Especialista / CIP)</label>
              <input
                type="text"
                value={activePlan.header.elaboradoPor}
                onChange={e => handleHeaderChange('elaboradoPor', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Revisado Por (Jefe HSEQ)</label>
              <input
                type="text"
                value={activePlan.header.revisadoPor}
                onChange={e => handleHeaderChange('revisadoPor', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#424242] uppercase tracking-wider mb-2">Aprobado Por (Gerencia / Dirección)</label>
              <input
                type="text"
                value={activePlan.header.aprobadoPor}
                onChange={e => handleHeaderChange('aprobadoPor', e.target.value)}
                className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl px-4 py-2.5 text-sm text-[#424242]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('empresa')}
              className="bg-gray-100 text-[#424242] hover:bg-gray-200 px-6 py-3 rounded-xl font-bold text-sm"
            >
              Anterior
            </button>
            <button
              onClick={() => setActiveTab('residuos')}
              className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-6 py-3 rounded-xl font-bold text-sm shadow"
            >
              <span>Siguiente: Inventario de Residuos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTARIO DE RESIDUOS */}
      {activeTab === 'residuos' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#424242] flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-[#6C0053]" />
                <span>Inventario y Caracterización de Residuos Sólidos</span>
              </h3>
              <p className="text-xs text-[#424242] mt-1">
                Registro cuantificado de residuos peligrosos y no peligrosos con almacenamiento conforme a la NTP 900.058:2019.
              </p>
            </div>
            <button
              onClick={addWasteItem}
              className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Residuo</span>
            </button>
          </div>

          {/* Metrics summary banner */}
          <div className="bg-[#FFDCF9]/40 border border-[#6C0053]/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#424242] block">Generación Total Estimada:</span>
              <span className="text-xl font-extrabold text-[#6C0053]">{totalResiduosKg} kg / mes</span>
            </div>
            <div>
              <span className="text-xs text-[#424242] block">Residuos Peligrosos:</span>
              <span className="text-xl font-extrabold text-amber-700">{totalPeligrososKg} kg / mes</span>
            </div>
            <div>
              <span className="text-xs text-[#424242] block">Residuos No Peligrosos:</span>
              <span className="text-xl font-extrabold text-[#70BA74]">{totalResiduosKg - totalPeligrososKg} kg / mes</span>
            </div>
          </div>

          <div className="space-y-4">
            {activePlan.residuos.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-6 space-y-3">
                <Trash2 className="w-10 h-10 text-gray-400 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-[#424242]">Sin residuos registrados en el inventario</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    El Plan está en blanco. Registre los residuos sólidos peligrosos y no peligrosos de su empresa o cargue los datos de demostración para ver un ejemplo completo.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={addWasteItem}
                    className="inline-flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Primer Residuo</span>
                  </button>
                  <button
                    onClick={loadDemoData}
                    className="inline-flex items-center gap-2 bg-[#FFDCF9] hover:bg-[#f3cbe8] text-[#6C0053] px-4 py-2 rounded-xl text-xs font-bold border border-[#6C0053]/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Cargar Datos Demostración</span>
                  </button>
                </div>
              </div>
            )}

            {activePlan.residuos.map((item, idx) => (
              <div key={item.id} className="bg-gray-50 rounded-2xl p-5 border border-[#CCCCCC]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#6C0053] text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.categoria}
                      onChange={e => updateWasteItem(item.id, 'categoria', e.target.value)}
                      className="font-bold text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#6C0053] px-1 py-0.5"
                      placeholder="Categoría (Ej. Papel y Cartón)"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.tipo}
                      onChange={e => updateWasteItem(item.id, 'tipo', e.target.value)}
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        item.tipo === 'Peligroso'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      <option value="No Peligroso">No Peligroso</option>
                      <option value="Peligroso">Peligroso</option>
                    </select>
                    <button
                      onClick={() => removeWasteItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white"
                      title="Eliminar residuo"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Descripción del Residuo / Proceso</label>
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={e => updateWasteItem(item.id, 'descripcion', e.target.value)}
                      className="w-full bg-white border border-[#CCCCCC] rounded-xl px-3 py-2 text-xs text-[#424242]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Gen. Estimada (kg/mes)</label>
                    <input
                      type="number"
                      value={item.generacionEstimadaKgMes}
                      onChange={e => updateWasteItem(item.id, 'generacionEstimadaKgMes', Number(e.target.value))}
                      className="w-full bg-white border border-[#CCCCCC] rounded-xl px-3 py-2 text-xs text-[#424242]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Código de Color NTP 900.058</label>
                    <select
                      value={item.colorContenedorNtp}
                      onChange={e => updateWasteItem(item.id, 'colorContenedorNtp', e.target.value)}
                      className="w-full bg-white border border-[#CCCCCC] rounded-xl px-3 py-2 text-xs text-[#424242]"
                    >
                      <option value="Azul (Papel y Cartón)">Azul (Papel y Cartón)</option>
                      <option value="Blanco (Plásticos)">Blanco (Plásticos)</option>
                      <option value="Amarillo (Metales)">Amarillo (Metales)</option>
                      <option value="Verde (Vidrio)">Verde (Vidrio)</option>
                      <option value="Marrón (Orgánicos)">Marrón (Orgánicos)</option>
                      <option value="Plomo (No aprovechables)">Plomo (No aprovechables)</option>
                      <option value="Rojo (Peligrosos)">Rojo (Peligrosos)</option>
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Almacenamiento Temporal</label>
                    <input
                      type="text"
                      value={item.almacenamiento}
                      onChange={e => updateWasteItem(item.id, 'almacenamiento', e.target.value)}
                      className="w-full bg-white border border-[#CCCCCC] rounded-xl px-3 py-2 text-xs text-[#424242]"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Destino Final / EO-RS Autorizada</label>
                    <input
                      type="text"
                      value={item.destinoFinal}
                      onChange={e => updateWasteItem(item.id, 'destinoFinal', e.target.value)}
                      className="w-full bg-white border border-[#CCCCCC] rounded-xl px-3 py-2 text-xs text-[#424242]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('header')}
              className="bg-gray-100 text-[#424242] hover:bg-gray-200 px-6 py-3 rounded-xl font-bold text-sm"
            >
              Anterior
            </button>
            <button
              onClick={() => setActiveTab('capitulos')}
              className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-6 py-3 rounded-xl font-bold text-sm shadow"
            >
              <span>Siguiente: Capítulos R.M. 089</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CAPÍTULOS R.M. 089-2023-MINAM (13 SECCIONES OBLIGATORIAS) */}
      {activeTab === 'capitulos' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#424242] flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#6C0053]" />
                <span>Redacción de Capítulos (13 Secciones R.M. N.° 089-2023-MINAM)</span>
              </h3>
              <p className="text-xs text-[#424242] mt-1">
                Estructura oficial y contenido mínimo obligatorio para el Plan de Minimización y Manejo de Residuos Sólidos No Municipales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chapters navigation (13 chapters) */}
            <div className="space-y-1.5 lg:col-span-1 max-h-[700px] overflow-y-auto pr-1">
              {activePlan.capitulos.map((cap) => {
                const isSelected = selectedChapterId === cap.id;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setSelectedChapterId(cap.id)}
                    className={`
                      w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between
                      ${isSelected 
                        ? 'bg-[#6C0053] text-white shadow' 
                        : 'bg-gray-50 text-[#424242] hover:bg-gray-100 border border-[#CCCCCC]/40'
                      }
                    `}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block font-bold">Capítulo {cap.numero}</span>
                      <span className="text-[11px] opacity-90 truncate block max-w-[190px]">{cap.titulo}</span>
                    </div>
                    {cap.completado ? (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#70BA74]' : 'text-green-600'}`} />
                    ) : (
                      <span className="w-2 h-2 shrink-0 rounded-full bg-amber-400"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Chapter editor area */}
            <div className="lg:col-span-3 space-y-4">
              {(() => {
                const currentCap = activePlan.capitulos.find(c => c.id === selectedChapterId) || activePlan.capitulos[0];
                const currentGuideline = OFFICIAL_13_CHAPTERS.find(g => g.numero === currentCap.numero);
                
                return (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-[#CCCCCC]/60 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-[#6C0053] uppercase tracking-wider block">
                          Capítulo {currentCap.numero} de 13
                        </span>
                        <h4 className="font-bold text-base text-[#424242]">{currentCap.titulo}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentGuideline && (
                          <button
                            type="button"
                            onClick={() => applyStandardGuideline(currentCap.numero)}
                            className="flex items-center gap-1.5 bg-white hover:bg-purple-50 text-[#6C0053] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#6C0053]/40 shadow-xs transition-all"
                            title="Insertar modelo técnico redactado conforme al estándar MINAM"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-[#6C0053]" />
                            <span>Cargar Redacción Estándar MINAM</span>
                          </button>
                        )}
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                          currentCap.completado 
                            ? 'bg-[#70BA74]/20 text-[#2e7d32]' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentCap.completado ? 'Completado' : 'Pendiente / En revisión'}
                        </span>
                      </div>
                    </div>

                    {/* Chapter Normative Guideline Box */}
                    {currentGuideline && (
                      <div className="bg-[#FFDCF9]/30 border border-[#6C0053]/20 rounded-xl p-4 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-[#6C0053]">
                            <Info className="w-4 h-4" />
                            <span>Exigencias Normativas Oficiales (R.M. N.° 089-2023-MINAM)</span>
                          </div>
                          {isFirestoreConnected && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Firestore pmmrs-gestion sincronizado
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {currentGuideline.descripcionNormativa}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="font-semibold text-gray-800 block mb-1">Subcapítulos Requeridos:</span>
                            <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                              {currentGuideline.subtitulos.map((sub, sIdx) => (
                                <li key={sIdx}>{sub}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 block mb-1">Criterios de Aprobación Clave:</span>
                            <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                              {currentGuideline.criteriosClave.map((crit, cIdx) => (
                                <li key={cIdx}>{crit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Chapter 1 Specific Clarification */}
                        {currentCap.numero === 1 && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-bold">Estructura del Capítulo 1 (R.M. 089-2023-MINAM & D.L. 1278):</strong>
                              <span>
                                Este capítulo corresponde estrictamente a la <strong>Introducción</strong> (1A: Planteamiento del problema ambiental de residuos en la actividad y 1B: Estrategia de abordaje con el Plan). Los datos de identificación de la empresa (Razón Social, RUC, Dirección) corresponden al <strong>Paso 1</strong> para la carátula y membrete formal.
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Live Criteria from Firestore (Colección: contenido_minimo) */}
                        {(() => {
                          const liveCriteria = contenidoMinimo.filter(c => (c.punto === currentCap.numero || c.capitulo === currentCap.numero) && c.activo);
                          if (liveCriteria.length === 0) return null;
                          return (
                            <div className="pt-2 border-t border-[#6C0053]/20 mt-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#6C0053] text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                                  <span>Criterios Oficiales de Redacción y Evaluación (contenido_minimo):</span>
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {liveCriteria.length} {liveCriteria.length === 1 ? 'criterio' : 'criterios'} en Firestore
                                </span>
                              </div>
                              <div className="space-y-2">
                                {liveCriteria.map(crit => (
                                  <div key={crit.id} className="bg-white rounded-xl p-3 border border-[#6C0053]/20 shadow-2xs space-y-2 text-[11px]">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono bg-[#FFDCF9] text-[#6C0053] font-bold px-2 py-0.5 rounded text-[10px]">
                                        Punto {crit.punto !== undefined ? crit.punto : crit.capitulo}{crit.subpunto ? ` - ${crit.subpunto}` : ''}
                                      </span>
                                      <span className="font-bold text-gray-800">
                                        {crit.categoria || crit.capituloNombre}
                                      </span>
                                      <span className="text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 rounded font-semibold ml-auto">
                                        {crit.es_determinado_normativa !== false ? 'Obligatorio por norma' : 'Criterio técnico'}
                                      </span>
                                    </div>

                                    {/* 1. Criterio de Redacción (Para Elaborar) */}
                                    <div className="bg-gray-50/80 p-2.5 rounded-lg border border-gray-200">
                                      <span className="font-bold text-[#6C0053] text-[10px] uppercase block mb-0.5">
                                        ✍ Criterio de Redacción (Guía para elaborar este capítulo):
                                      </span>
                                      <p className="text-gray-900 font-medium leading-relaxed">
                                        {crit.criterio_redaccion || crit.requisito}
                                      </p>
                                    </div>

                                    {/* 2. Pregunta de Evaluación (Para Revisar) */}
                                    {(crit.pregunta_evaluacion || crit.informacionRequerida) && (
                                      <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/70 text-emerald-950">
                                        <span className="font-bold text-emerald-800 text-[10px] uppercase block mb-0.5">
                                          🔍 Pregunta con la que será evaluado al auditar:
                                        </span>
                                        <p className="font-semibold text-[11px] leading-relaxed">
                                          {crit.pregunta_evaluacion || crit.informacionRequerida}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Live Legal Citations from Firestore (Colección: marco_normativo) */}
                        {activeNormas.length > 0 && (
                          <div className="pt-2 border-t border-[#6C0053]/15 mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-gray-700 text-[10px] uppercase">
                              Citas Legales Vigentes:
                            </span>
                            {activeNormas.map(norma => (
                              <a
                                key={norma.id}
                                href={norma.enlace || '#'}
                                target={norma.enlace ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-white hover:bg-[#FFDCF9] text-[#6C0053] px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200 transition-all"
                                title={`${norma.nombre} — ${norma.descripcion}`}
                              >
                                <span>{norma.codigo}</span>
                                {norma.enlace && <ExternalLink className="w-2.5 h-2.5" />}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Official Annex Excel Module for Chapters 4, 5, 6, 7, 9, 11 (Anexos 3, 4, 6, 7, 9, 11) */}
                    {(() => {
                      const annexConfig = getAnnexForChapter(currentCap.numero);
                      if (!annexConfig) return null;
                      return (
                        <AnnexExcelUploadCard
                          key={`annex-card-${currentCap.numero}`}
                          annexConfig={annexConfig}
                          chapterTitle={currentCap.titulo}
                          chapterContent={currentCap.contenido}
                          companyName={activePlan.company.razonSocial}
                          onUpdateContent={(newContent) => handleChapterContentChange(currentCap.id, newContent)}
                        />
                      );
                    })()}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-gray-600 uppercase">
                          Contenido Técnico del Capítulo
                        </label>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {currentCap.contenido.length} caracteres
                        </span>
                      </div>
                      <textarea
                        rows={13}
                        value={currentCap.contenido}
                        onChange={e => handleChapterContentChange(currentCap.id, e.target.value)}
                        className="w-full bg-white border border-[#CCCCCC] rounded-xl p-4 text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053] leading-relaxed shadow-xs"
                        placeholder="Redacte aquí el contenido técnico correspondiente a este capítulo conforme a la R.M. 089-2023-MINAM..."
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                      <span>Mínimo recomendado para aprobación: 150 caracteres con datos técnicos específicos.</span>
                      <button
                        onClick={() => setActiveTab('preview')}
                        className="text-[#6C0053] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Ver Vista Previa General</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('residuos')}
              className="bg-gray-100 text-[#424242] hover:bg-gray-200 px-6 py-3 rounded-xl font-bold text-sm"
            >
              Anterior: Inventario de Residuos
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-6 py-3 rounded-xl font-bold text-sm shadow"
            >
              <span>Siguiente: Vista Previa & PDF</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: VISTA PREVIA & PDF A4 */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-[#CCCCCC]/40 gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#424242]">Vista Previa Oficial (Formato A4)</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Estructura oficial conforme al Contenido Mínimo de la R.M. N.° 089-2023-MINAM.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSavePdf}
                className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                title="Generar y guardar el Plan PMMRS oficial directamente en formato PDF (A4)"
              >
                <Download className="w-4 h-4 text-[#70BA74]" />
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                title="Abrir diálogo de impresión o guardar como PDF"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Imprimir / Guardar como PDF</span>
              </button>
            </div>
          </div>

          {/* A4 Document Preview Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#CCCCCC] max-w-4xl mx-auto p-8 sm:p-12 space-y-8 font-serif text-[#222222] print-container">
            {/* Institutional Header */}
            <div className="border-b-2 border-[#6C0053] pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-20 flex items-center justify-start">
                  {activePlan.header.logoUrl ? (
                    <img
                      src={activePlan.header.logoUrl}
                      alt="Logotipo institucional"
                      className="max-h-16 max-w-[80px] object-contain rounded"
                    />
                  ) : (
                    <div className="w-16"></div>
                  )}
                </div>
                <div className="flex-1 text-center">
                  <p className="text-sm font-sans uppercase tracking-widest text-gray-700 font-bold">
                    {activePlan.header.razonSocialHeader || activePlan.company.razonSocial || 'EMPRESA TITULAR'}
                  </p>
                </div>
                <div className="w-20"></div>
              </div>
              <h1 className="text-xl font-extrabold uppercase text-[#6C0053] text-center">
                {activePlan.header.tituloDocumento}
              </h1>
              <p className="text-xs font-sans text-gray-600 text-center">
                {activePlan.header.version} | Fecha: {activePlan.header.fechaEmision}
              </p>
            </div>

            {/* Section 1: General Data */}
            <div className="space-y-3 font-sans text-xs">
              <h3 className="font-bold uppercase tracking-wide text-sm text-[#6C0053] border-b border-gray-200 pb-1">
                I. Datos Generales de la Empresa y Establecimiento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[#424242] bg-pink-50/40 p-4 rounded-xl border border-pink-100">
                <p><strong>Razón Social:</strong> {activePlan.company.razonSocial}</p>
                <p><strong>RUC:</strong> {activePlan.company.ruc}</p>
                <p><strong>Nombre Comercial:</strong> {activePlan.company.nombreComercial}</p>
                <p><strong>Domicilio Legal:</strong> {activePlan.company.domicilio}</p>
                <p><strong>Ubicación:</strong> {activePlan.company.distrito}, {activePlan.company.provincia}, {activePlan.company.departamento}</p>
                <p><strong>Representante Legal:</strong> {activePlan.company.representanteLegal} (DNI: {activePlan.company.dniRepresentante})</p>
                <p><strong>Sector:</strong> {activePlan.company.sector}</p>
                <p><strong>Número de Trabajadores:</strong> {activePlan.company.numeroTrabajadores}</p>
              </div>
            </div>

            {/* Chapters printed */}
            <div className="space-y-6 pt-4 font-serif text-sm leading-relaxed">
              {activePlan.capitulos.map((cap) => (
                <div key={cap.id} className="space-y-2">
                  <h3 className="font-sans font-bold text-base text-[#6C0053] uppercase border-b border-gray-200 pb-1">
                    {cap.titulo}
                  </h3>
                  <div className="pt-1">
                    <FormattedChapterContent content={cap.contenido} />
                  </div>
                </div>
              ))}
            </div>

            {/* Waste Inventory Table */}
            <div className="space-y-3 pt-4 font-sans text-xs">
              <h3 className="font-bold uppercase tracking-wide text-sm text-[#6C0053] border-b border-gray-200 pb-1">
                Cuadro Resumen de Generación y Almacenamiento (NTP 900.058:2019)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-[#6C0053] text-white">
                      <th className="border border-gray-300 p-2">N.°</th>
                      <th className="border border-gray-300 p-2">Tipo</th>
                      <th className="border border-gray-300 p-2">Categoría / Descripción</th>
                      <th className="border border-gray-300 p-2">Gen. (kg/mes)</th>
                      <th className="border border-gray-300 p-2">Color NTP</th>
                      <th className="border border-gray-300 p-2">Destino Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePlan.residuos.map((res, i) => (
                      <tr key={res.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-2 text-center">{i + 1}</td>
                        <td className="border border-gray-300 p-2 font-semibold">{res.tipo}</td>
                        <td className="border border-gray-300 p-2">{res.categoria}: {res.descripcion}</td>
                        <td className="border border-gray-300 p-2 text-right">{res.generacionEstimadaKgMes} kg</td>
                        <td className="border border-gray-300 p-2">{res.colorContenedorNtp}</td>
                        <td className="border border-gray-300 p-2">{res.destinoFinal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures block */}
            <div className="pt-16 grid grid-cols-2 gap-12 font-sans text-xs text-center">
              <div className="space-y-8">
                <div className="border-b border-gray-400 w-48 mx-auto"></div>
                <p className="font-bold text-[#424242]">{activePlan.header.elaboradoPor}</p>
                <p className="text-gray-500">Especialista Ambiental / Consultor</p>
              </div>
              <div className="space-y-8">
                <div className="border-b border-gray-400 w-48 mx-auto"></div>
                <p className="font-bold text-[#424242]">{activePlan.header.aprobadoPor}</p>
                <p className="text-gray-500">Representante Legal / Gerencia</p>
              </div>
            </div>

            {/* Document Bottom Copyright */}
            <div className="pt-10 border-t border-gray-300 text-center font-sans text-xs text-gray-500 space-y-1">
              <p className="font-bold text-[#424242]">
                Elaborado y diseñado por Casa Altair - Equilibria (<a href="mailto:casa_altair@equilibria360.com" className="text-[#6C0053] underline hover:text-[#51003d]">casa_altair@equilibria360.com</a>). Lima, Perú — Setiembre de 2026
              </p>
              <p className="text-[11px] text-gray-400">
                Conforme a la R.M. N.° 089-2023-MINAM, Decreto Legislativo N.° 1278 y NTP 900.058:2019
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
