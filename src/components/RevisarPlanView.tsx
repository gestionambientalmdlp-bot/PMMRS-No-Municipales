import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Award,
  Download,
  Plus,
  Trash2,
  ShieldAlert,
  ArrowRightLeft,
  Calendar,
  DollarSign,
  Activity,
  Layers,
  UploadCloud,
  FileUp,
  FileCheck,
  RefreshCw,
  BookOpen,
  Copy,
  Check,
  X
} from 'lucide-react';
import { 
  PMMRSPlan, 
  ReviewReport, 
  FindingItem, 
  ReviewStatus, 
  StrategicActionItem, 
  RegulatoryRiskItem,
  UploadedPMMRSDocument
} from '../types';
import { runSpecializedAudit } from '../utils/auditEngine';
import { generateReviewReportHtml, openPrintWindow, downloadPrintableHtml, downloadReviewReportPdf } from '../utils/printReport';
import { CASA_ALTAIR_LOGO_BASE64 } from '../assets/casaAltairLogo';
import { parseUploadedDocument, createSamplePMMRSDocument } from '../utils/documentParser';
import { OFFICIAL_13_CHAPTERS } from '../data/promptsPmmrs';
import { useFirestore } from '../context/FirestoreContext';

interface RevisarPlanViewProps {
  activePlan: PMMRSPlan;
  reviewReport: ReviewReport;
  setReviewReport: React.Dispatch<React.SetStateAction<ReviewReport>>;
}

export const RevisarPlanView: React.FC<RevisarPlanViewProps> = ({
  activePlan,
  reviewReport,
  setReviewReport
}) => {
  const { activeCriterios, activeNormas, isFirestoreConnected } = useFirestore();
  const [activeTab, setActiveTab] = useState<'estructural' | 'foda_riesgos' | 'matriz_doda' | 'informe'>('estructural');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [auditNotification, setAuditNotification] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedPMMRSDocument | null>(reviewReport.documentoSubido || null);

  // Filters for findings checklist
  const [findingChapterFilter, setFindingChapterFilter] = useState<'todos' | number>('todos');
  const [findingStatusFilter, setFindingStatusFilter] = useState<string>('todos');
  const [findingSearchQuery, setFindingSearchQuery] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-audit with active Firestore criteria as soon as they load if not audited yet
  const hasAutoSyncedRef = useRef(false);
  useEffect(() => {
    if (activeCriterios.length > 0 && !hasAutoSyncedRef.current) {
      hasAutoSyncedRef.current = true;
      const auditedReport = runSpecializedAudit(
        activePlan, 
        reviewReport.revisor || 'Auditor Especialista Ambiental', 
        uploadedDoc || undefined, 
        activeCriterios, 
        activeNormas
      );
      setReviewReport(auditedReport);
    }
  }, [activeCriterios, activeNormas, activePlan, uploadedDoc]);

  // New action modal / inline states
  const [newActionSection, setNewActionSection] = useState('V. Gestión y Manejo Operativo');
  const [newActionType, setNewActionType] = useState<'DO (Reorientación)' | 'DA (Supervivencia)'>('DA (Supervivencia)');
  const [newActionDeficiency, setNewActionDeficiency] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
  const [newActionIndicator, setNewActionIndicator] = useState('(N° de inspecciones ejecutadas / N° programadas) * 100');
  const [newActionBudget, setNewActionBudget] = useState('S/ 2,500 / Mes 1-2');
  const [showAddActionForm, setShowAddActionForm] = useState(false);

  // Trigger file dialog
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Process uploaded PDF or Word document
  const handleFileProcess = async (file: File) => {
    setIsUploading(true);
    setAuditNotification(`Procesando archivo "${file.name}"...`);
    try {
      const parsed = await parseUploadedDocument(file);
      setUploadedDoc(parsed);
      setIsUploading(false);
      setAuditNotification(`¡Documento "${parsed.fileName}" subido con éxito! Ejecutando auditoría técnica contra R.M. 089-2023-MINAM...`);

      // Immediately run the audit on the uploaded document
      setTimeout(() => {
        handleExecuteAudit(parsed);
      }, 300);
    } catch (err) {
      console.error('Error procesando archivo:', err);
      setIsUploading(false);
      setAuditNotification('Error al procesar el archivo. Por favor verifique que sea un archivo PDF o Word (.docx) válido.');
      setTimeout(() => setAuditNotification(null), 5000);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
    // reset input so the same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Load sample file for testing
  const handleLoadSample = (type: 'word' | 'pdf') => {
    const sample = createSamplePMMRSDocument(type);
    setUploadedDoc(sample);
    setAuditNotification(`Documento de demostración "${sample.fileName}" cargado. Auditando contra R.M. 089-2023-MINAM...`);
    setTimeout(() => {
      handleExecuteAudit(sample);
    }, 300);
  };

  const handleRemoveUploadedDoc = () => {
    setUploadedDoc(null);
    const auditedReport = runSpecializedAudit(activePlan, reviewReport.revisor || 'Auditor Especialista Ambiental', undefined, activeCriterios, activeNormas);
    setReviewReport(auditedReport);
    setAuditNotification('Documento removido. Se ha restaurado la evaluación del plan activo en el sistema.');
    setTimeout(() => setAuditNotification(null), 3000);
  };

  // Execute specialized audit
  const handleExecuteAudit = (docToAudit?: UploadedPMMRSDocument) => {
    setIsAuditing(true);
    const doc = docToAudit || uploadedDoc || undefined;
    setTimeout(() => {
      const auditedReport = runSpecializedAudit(activePlan, reviewReport.revisor || 'Auditor Especialista Ambiental', doc, activeCriterios, activeNormas);
      setReviewReport(auditedReport);
      setIsAuditing(false);
      if (doc) {
        setAuditNotification(`¡Auditoría completada! Documento "${doc.fileName}" contrastado contra los ${activeCriterios.length} criterios activos en Firestore (R.M. 089-2023).`);
      } else {
        setAuditNotification(`¡Auditoría técnica ejecutada con éxito! Contrastada en tiempo real contra la colección contenido_minimo de Firestore.`);
      }
      setTimeout(() => setAuditNotification(null), 4000);
    }, 450);
  };

  const updateFindingStatus = (findingId: string, status: ReviewStatus) => {
    setReviewReport(prev => ({
      ...prev,
      hallazgos: prev.hallazgos.map(h => h.id === findingId ? { ...h, estado: status } : h)
    }));
  };

  const updateFindingRecommendation = (findingId: string, recomendacion: string) => {
    setReviewReport(prev => ({
      ...prev,
      hallazgos: prev.hallazgos.map(h => h.id === findingId ? { ...h, recomendacion } : h)
    }));
  };

  const handleAddStrategicAction = () => {
    if (!newActionDescription.trim()) return;
    const newAction: StrategicActionItem = {
      id: `act-${Date.now()}`,
      seccionMinam: newActionSection,
      tipoEstrategia: newActionType,
      hallazgoDebilidad: newActionDeficiency || 'Deficiencia identificada en auditoría de cumplimiento',
      accionCorrectiva: newActionDescription,
      indicadorOperacional: newActionIndicator,
      presupuestoCronograma: newActionBudget
    };

    setReviewReport(prev => ({
      ...prev,
      planAccionCorrectivo: [...(prev.planAccionCorrectivo || []), newAction]
    }));

    setNewActionDeficiency('');
    setNewActionDescription('');
    setShowAddActionForm(false);
  };

  const handleDeleteAction = (actionId: string) => {
    setReviewReport(prev => ({
      ...prev,
      planAccionCorrectivo: (prev.planAccionCorrectivo || []).filter(a => a.id !== actionId)
    }));
  };

  const handlePrint = () => {
    try {
      const html = generateReviewReportHtml(reviewReport, activePlan);
      const filename = `Informe_Tecnico_PMMRS_${(uploadedDoc?.detectedRazonSocial || activePlan.company.razonSocial || 'Plan').replace(/[^a-zA-Z0-9]/g, '_')}_2026.html`;
      openPrintWindow(html, filename);
    } catch {
      window.print();
    }
  };

  const handleDownloadPdfDirect = () => {
    downloadReviewReportPdf(reviewReport, activePlan);
  };

  const handleDownloadHtml = () => {
    const html = generateReviewReportHtml(reviewReport, activePlan);
    const filename = `Informe_Tecnico_PMMRS_${(uploadedDoc?.detectedRazonSocial || activePlan.company.razonSocial || 'Plan').replace(/[^a-zA-Z0-9]/g, '_')}_Oficial_A4.html`;
    downloadPrintableHtml(html, filename);
  };

  // Metrics
  const pct = reviewReport.porcentajeCumplimientoGeneral !== undefined 
    ? reviewReport.porcentajeCumplimientoGeneral
    : Math.round(((reviewReport.hallazgos.filter(h => h.estado === 'Cumple').length + (reviewReport.hallazgos.filter(h => h.estado === 'Cumple parcialmente').length * 0.5)) / (reviewReport.hallazgos.length || 1)) * 100);

  const approvedSections = reviewReport.seccionesAprobadas || [];
  const observedSections = reviewReport.seccionesObservadas || [];
  const strategicActions = reviewReport.planAccionCorrectivo || [];
  const regulatoryRisks = reviewReport.riesgosRegulatorios || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner: Auditor Specialist Banner & Action Bar */}
      <div className="bg-gradient-to-r from-[#6C0053] via-[#850a68] to-[#51003d] rounded-2xl p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#70BA74] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Auditor Especialista R.M. 089-2023-MINAM
              </span>
              <span className="text-xs text-pink-200">
                D.L. N.° 1278 • D.S. N.° 014-2017-MINAM • NTP 900.058:2019
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Auditoría Técnica y Plan de Acción Correctivo (DO / DA)
            </h2>
            <p className="text-xs text-pink-100 max-w-3xl">
              Evaluación automatizada de las 13 secciones obligatorias de la R.M. N.° 089-2023-MINAM, mapeo de debilidades a riesgos regulatorios ante OEFA/Sector y formulación de la Matriz de Confrontación estratégica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleExecuteAudit(uploadedDoc || undefined)}
              disabled={isAuditing}
              className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5fa863] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Auditar el plan contra los criterios activos de contenido_minimo en Firestore"
            >
              <Sparkles className={`w-4 h-4 text-white ${isAuditing ? 'animate-spin' : ''}`} />
              <span>Auditar con Criterios de Firestore ({activeCriterios.length > 0 ? activeCriterios.length : '63'})</span>
            </button>

            {/* Input de archivo oculto para PDF / Word */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
            />
          </div>
        </div>

        {/* Audit Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/15">
          <div className="bg-black/20 rounded-xl p-3">
            <span className="text-[10px] text-pink-200 uppercase font-semibold block">Cumplimiento Global</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-white">{pct}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pct >= 80 ? 'bg-green-500/30 text-green-200' : pct >= 50 ? 'bg-amber-500/30 text-amber-200' : 'bg-red-500/30 text-red-200'}`}>
                {pct >= 80 ? 'Aceptable' : pct >= 50 ? 'Observado' : 'Crítico'}
              </span>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3">
            <span className="text-[10px] text-pink-200 uppercase font-semibold block">Secciones Aprobadas</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#70BA74]">{approvedSections.length}</span>
              <span className="text-[10px] text-pink-200">de 13 secciones</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3">
            <span className="text-[10px] text-pink-200 uppercase font-semibold block">Riesgos Regulatorios</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-amber-300">{regulatoryRisks.length}</span>
              <span className="text-[10px] text-pink-200">OEFA / Sector</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3">
            <span className="text-[10px] text-pink-200 uppercase font-semibold block">Acciones Correctivas</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-blue-200">{strategicActions.length}</span>
              <span className="text-[10px] text-pink-200">Matriz DO / DA</span>
            </div>
          </div>
        </div>

        {auditNotification && (
          <div className="bg-green-500/20 border border-green-400 text-green-100 text-xs px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#70BA74] shrink-0" />
            <span>{auditNotification}</span>
          </div>
        )}
      </div>

      {/* Módulo de Solicitud de Carga de Plan PMMRS (PDF / Word) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C0053]/10 text-[#6C0053] flex items-center justify-center shrink-0 mt-0.5">
              <UploadCloud className="w-5 h-5 text-[#6C0053]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#424242]">
                  Subir Plan PMMRS (PDF o Word) para Revisión Técnica
                </h3>
                <span className="text-[10px] font-bold bg-[#70BA74]/15 text-[#1b5e20] px-2 py-0.5 rounded-full">
                  R.M. 089-2023-MINAM
                </span>
              </div>
              <p className="text-xs text-[#616161] mt-0.5 leading-relaxed max-w-3xl">
                Para auditar su Plan de Minimización y Manejo de Residuos Sólidos No Municipales, por favor suba su documento en formato <strong>PDF (.pdf)</strong> o <strong>Microsoft Word (.docx / .doc)</strong>. La plataforma analizará los contenidos de las 13 secciones obligatorias, identificará riesgos de tipificación de infracciones ante OEFA y formulará la Matriz de Confrontación DO/DA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={handleTriggerUpload}
              className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-[#70BA74]" />
              <span>Subir Archivo</span>
            </button>
          </div>
        </div>

        {/* Estado del Archivo: Si hay un archivo cargado */}
        {uploadedDoc ? (
          <div className="bg-[#fcf8fb] border-2 border-[#6C0053]/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                uploadedDoc.fileType === 'word' 
                  ? 'bg-blue-600 text-white' 
                  : uploadedDoc.fileType === 'pdf'
                  ? 'bg-red-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {uploadedDoc.fileType.toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#424242]">{uploadedDoc.fileName}</span>
                  <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-700" />
                    Cargado para revisión
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-3 flex-wrap">
                  <span>Tamaño: <strong className="text-gray-700">{uploadedDoc.fileSize}</strong></span>
                  <span>•</span>
                  <span>Subido el: <strong className="text-gray-700">{uploadedDoc.uploadedAt}</strong></span>
                  {uploadedDoc.totalWords && (
                    <>
                      <span>•</span>
                      <span>Palabras extraídas: <strong className="text-gray-700">{uploadedDoc.totalWords.toLocaleString()}</strong></span>
                    </>
                  )}
                  {uploadedDoc.detectedRuc && (
                    <>
                      <span>•</span>
                      <span>RUC detectado: <strong className="text-emerald-700 font-mono">{uploadedDoc.detectedRuc}</strong></span>
                    </>
                  )}
                </div>
                {uploadedDoc.detectedRazonSocial && (
                  <div className="text-xs text-gray-600">
                    Titular / Razón Social: <strong className="text-[#6C0053]">{uploadedDoc.detectedRazonSocial}</strong>
                  </div>
                )}
                {uploadedDoc.detectedSections && uploadedDoc.detectedSections.length > 0 && (
                  <div className="text-[11px] text-gray-600 flex items-center gap-1 flex-wrap pt-0.5">
                    <span className="font-medium text-gray-700">Secciones identificadas en el texto:</span>
                    <span className="font-bold text-emerald-700">{uploadedDoc.detectedSections.length} de 13</span>
                    <span className="text-gray-400">({uploadedDoc.detectedSections.join(', ')})</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExecuteAudit(uploadedDoc)}
                disabled={isAuditing}
                className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Revisar Este Plan</span>
              </button>
            </div>
          </div>
        ) : (
          /* Zona de Arrastre cuando NO hay archivo cargado */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleTriggerUpload}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#70BA74] bg-green-50 scale-[1.01]'
                : 'border-gray-300 hover:border-[#6C0053] hover:bg-pink-50/20'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFDCF9] text-[#6C0053] mx-auto flex items-center justify-center shadow-inner">
                <UploadCloud className="w-7 h-7 text-[#6C0053]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#424242]">
                  Haga clic para subir su Plan o arrástrelo y suéltelo aquí
                </p>
                <p className="text-xs text-gray-500">
                  Admite archivos de texto enriquecido en formato <strong>PDF (.pdf)</strong> o <strong>Word (.docx, .doc)</strong>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[11px] font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-lg">
                  PDF (.pdf)
                </span>
                <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg">
                  Word (.docx / .doc)
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTriggerUpload();
                  }}
                  className="bg-[#70BA74] hover:bg-[#5da761] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Subir Archivo</span>
                </button>
                <span className="text-xs text-gray-400">o probar con:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample('word');
                  }}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Demo Word (.docx)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample('pdf');
                  }}
                  className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Demo PDF (.pdf)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#CCCCCC]/40 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('estructural')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'estructural'
              ? 'bg-[#6C0053] text-white shadow'
              : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Cumplimiento Estructural (13 Secciones R.M. 089-2023-MINAM)</span>
        </button>

        <button
          onClick={() => setActiveTab('foda_riesgos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'foda_riesgos'
              ? 'bg-[#6C0053] text-white shadow'
              : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>2. Mapeo FODA & Riesgos OEFA / Sector</span>
        </button>

        <button
          onClick={() => setActiveTab('matriz_doda')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'matriz_doda'
              ? 'bg-[#6C0053] text-white shadow'
              : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>3. Plan de Acción Correctivo (Matriz DO / DA)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('informe');
            handlePrint();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ml-auto cursor-pointer ${
            activeTab === 'informe'
              ? 'bg-[#70BA74] text-white shadow'
              : 'bg-[#FFDCF9] text-[#6C0053] hover:bg-[#f3cbe8]'
          }`}
          title="Generar y descargar Informe Técnico en PDF"
        >
          <FileText className="w-4 h-4" />
          <span>Informe Técnico</span>
        </button>
      </div>

      {/* TAB 1: CUMPLIMIENTO ESTRUCTURAL (7 SECCIONES MINAM) */}
      {activeTab === 'estructural' && (
        <div className="space-y-6">
          {/* Section Summary Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#424242] flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#6C0053]" />
                <span>Auditoría de las 13 Secciones del Contenido Mínimo (R.M. 089-2023-MINAM)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Verificación sistemática de requisitos obligatorios del Plan de Minimización y Manejo de Residuos No Municipales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(reviewReport.auditoriaSecciones || [
                { id: 'SEC-1', seccionNumero: '1', seccionTitulo: '1. Introducción', estado: 'Aprobada', porcentajeCumplimiento: 100, detalles: 'Planteamiento del problema de residuos de la actividad y abordaje técnico con el Plan conforme a R.M. 089-2023-MINAM.' },
                { id: 'SEC-2', seccionNumero: '2', seccionTitulo: '2. Objetivos Generales y Específicos', estado: 'Aprobada', porcentajeCumplimiento: 98, detalles: 'Metas cuantificables de minimización en origen y valorización.' },
                { id: 'SEC-3', seccionNumero: '3', seccionTitulo: '3. Alcance Operacional y Delimitación', estado: 'Aprobada', porcentajeCumplimiento: 96, detalles: 'Delimitación territorial, áreas de proceso y dotación de personal.' },
                { id: 'SEC-4', seccionNumero: '4', seccionTitulo: '4. Identificación y Estimación de Residuos', estado: 'Aprobada', porcentajeCumplimiento: 98, detalles: 'Balance de materia, inventario cuantificado y códigos de peligrosidad.' },
                { id: 'SEC-5', seccionNumero: '5', seccionTitulo: '5. Estrategias de Prevención y Minimización', estado: 'Aprobada', porcentajeCumplimiento: 95, detalles: 'Ecoeficiencia, economía circular y reducción en la fuente.' },
                { id: 'SEC-6', seccionNumero: '6', seccionTitulo: '6. Gestión y Manejo Operativo', estado: 'Aprobada', porcentajeCumplimiento: 98, detalles: 'Segregación NTP 900.058:2019, ATRP con dique al 110% y EO-RS autorizadas.' },
                { id: 'SEC-7', seccionNumero: '7', seccionTitulo: '7. Descripción de Medidas Ambientales', estado: 'Aprobada', porcentajeCumplimiento: 95, detalles: 'Mitigación de lixiviados, olores, vectores, ruido y protección del suelo.' },
                { id: 'SEC-8', seccionNumero: '8', seccionTitulo: '8. Medidas de Atención ante Emergencias', estado: 'Aprobada', porcentajeCumplimiento: 96, detalles: 'POE ante derrames de RESPEL, kits antiderrames, extintores y brigadas.' },
                { id: 'SEC-9', seccionNumero: '9', seccionTitulo: '9. Indicadores de Seguimiento y Control', estado: 'Aprobada', porcentajeCumplimiento: 98, detalles: 'Batería cuantitativa (Rg, %V, %RP, %S) y reporte anual en SIGERSOL.' },
                { id: 'SEC-10', seccionNumero: '10', seccionTitulo: '10. Cronograma de Implementación', estado: 'Aprobada', porcentajeCumplimiento: 98, detalles: 'Cronograma Gantt de 12 meses con frecuencias de retiro y capacitaciones.' },
                { id: 'SEC-11', seccionNumero: '11', seccionTitulo: '11. Presupuesto y Recursos Necesarios', estado: 'Aprobada', porcentajeCumplimiento: 98, detalles: 'Presupuesto anual detallado en soles (S/) con respaldo financiero.' },
                { id: 'SEC-12', seccionNumero: '12', seccionTitulo: '12. Funciones del Responsable HSEQ', estado: 'Aprobada', porcentajeCumplimiento: 100, detalles: 'Designación de responsable técnico, facultades de supervisión y reporte.' },
                { id: 'SEC-13', seccionNumero: '13', seccionTitulo: '13. Anexos Técnicos y Documentarios', estado: 'Aprobada', porcentajeCumplimiento: 95, detalles: 'Planos de distribución, diagramas de flujo, autorizaciones de EO-RS y bitácoras.' },
              ]).map(sec => (
                <div 
                  key={sec.id}
                  className={`p-4 rounded-xl border transition-all ${
                    sec.estado === 'Aprobada'
                      ? 'bg-green-50/50 border-green-200'
                      : sec.estado === 'Observada'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#6C0053]">{sec.seccionNumero}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      sec.estado === 'Aprobada'
                        ? 'bg-green-100 text-green-800'
                        : sec.estado === 'Observada'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sec.estado} ({sec.porcentajeCumplimiento}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#424242] mt-2 line-clamp-1">{sec.seccionTitulo}</h4>
                  <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-tight">{sec.detalles}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Findings Checklist */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#424242] flex items-center gap-2">
                  <span>Matriz Detallada de Hallazgos y Criterios Oficiales</span>
                  <span className="text-xs bg-[#6C0053] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                    {reviewReport.hallazgos.length} {reviewReport.hallazgos.length === 1 ? 'criterio' : 'criterios'}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Evaluación basada en la columna <strong>Pregunta de Evaluación</strong> y subsanación guiada con el <strong>Criterio de Redacción</strong> oficial.
                </p>
              </div>

              {/* Filters toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar hallazgo..."
                  value={findingSearchQuery}
                  onChange={(e) => setFindingSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-[#424242] focus:outline-none focus:ring-1 focus:ring-[#6C0053]"
                />

                <select
                  value={findingChapterFilter}
                  onChange={(e) => setFindingChapterFilter(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-1 focus:ring-[#6C0053]"
                >
                  <option value="todos">Todos los Capítulos</option>
                  {Array.from({ length: 13 }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c}>Capítulo {c}</option>
                  ))}
                </select>

                <select
                  value={findingStatusFilter}
                  onChange={(e) => setFindingStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-1 focus:ring-[#6C0053]"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="Cumple">Solo Cumple</option>
                  <option value="Cumple parcialmente">Cumple parcialmente</option>
                  <option value="No cumple">No cumple</option>
                </select>
              </div>
            </div>

            {/* Findings list */}
            {(() => {
              const filteredHallazgos = reviewReport.hallazgos.filter(h => {
                if (findingChapterFilter !== 'todos') {
                  const capNumMatch = h.capitulo.match(/^(\d+)/);
                  const capNum = capNumMatch ? Number(capNumMatch[1]) : 0;
                  if (capNum !== findingChapterFilter) return false;
                }
                if (findingStatusFilter !== 'todos') {
                  if (h.estado !== findingStatusFilter) return false;
                }
                if (findingSearchQuery.trim()) {
                  const q = findingSearchQuery.toLowerCase();
                  const inReq = (h.requisitoTexto || '').toLowerCase().includes(q);
                  const inCap = (h.capitulo || '').toLowerCase().includes(q);
                  const inRec = (h.recomendacion || '').toLowerCase().includes(q);
                  const inEvi = (h.evidenciaEncontrada || '').toLowerCase().includes(q);
                  if (!inReq && !inCap && !inRec && !inEvi) return false;
                }
                return true;
              });

              if (filteredHallazgos.length === 0) {
                return (
                  <div className="py-8 text-center text-gray-500 text-xs bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    No se encontraron criterios con los filtros seleccionados.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredHallazgos.map((item, idx) => (
                    <div key={item.id} className="bg-gray-50/80 rounded-xl p-4 sm:p-5 border border-gray-200 space-y-3 transition-colors hover:border-[#6C0053]/40">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-[#6C0053] bg-[#FFDCF9] px-2.5 py-0.5 rounded-md">
                              {item.capitulo}
                            </span>
                            {item.requisitoId && (
                              <span className="text-[10px] font-mono text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-md font-semibold">
                                {item.requisitoId}
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              {item.fuente || 'R.M. 089-2023-MINAM & D.L. 1278'}
                            </span>
                          </div>

                          <div className="pt-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wide block">
                              🔍 Pregunta de Evaluación (Para Revisar Plan):
                            </span>
                            <h4 className="font-bold text-xs text-[#424242] leading-snug">
                              {item.requisitoTexto}
                            </h4>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <select
                            value={item.estado}
                            onChange={e => updateFindingStatus(item.id, e.target.value as ReviewStatus)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-xs cursor-pointer ${
                              item.estado === 'Cumple'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : item.estado === 'Cumple parcialmente'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="Cumple">Cumple</option>
                            <option value="Cumple parcialmente">Cumple parcialmente</option>
                            <option value="No cumple">No cumple</option>
                            <option value="No corresponde">No corresponde</option>
                            <option value="Información insuficiente">Información insuficiente</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                          <span className="font-bold text-gray-500 uppercase text-[9px] block">Evidencia en el Plan:</span>
                          <p className="text-gray-800 text-[11px] leading-relaxed">{item.evidenciaEncontrada}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                          <span className="font-bold text-amber-700 uppercase text-[9px] block">Hallazgo / Brecha Normativa:</span>
                          <p className="text-amber-950 text-[11px] leading-relaxed">{item.brecha || item.hallazgo}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                        <label className="block text-[10px] font-bold text-[#6C0053] uppercase flex items-center justify-between">
                          <span>✍ Recomendación / Criterio Oficial de Redacción (Para Elaborar / Subsanar):</span>
                        </label>
                        <textarea
                          rows={2}
                          value={item.recomendacion}
                          onChange={e => updateFindingRecommendation(item.id, e.target.value)}
                          className="w-full bg-gray-50/60 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#6C0053] resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('foda_riesgos')}
                className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow cursor-pointer transition-all"
              >
                <span>Siguiente: Mapeo FODA & Riesgos OEFA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAPEO FODA & RIESGOS REGULATORIOS (OEFA / SECTOR) */}
      {activeTab === 'foda_riesgos' && (
        <div className="space-y-6">
          {/* Regulatory Risk Table (Gemini Prompt Section 2) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Fiscalización Ambiental
                </span>
                <h3 className="text-lg font-bold text-[#424242]">
                  2. Auditoría Detallada y Matriz FODA Mapeada a Riesgos OEFA / Sector
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cada debilidad u omisión identificada en el documento se vincula directamente a su tipificación de infracción y riesgo sancionador según el D.L. 1278 y D.S. 014-2017-MINAM.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-xs text-left">
                <thead>
                  <tr className="bg-[#6C0053] text-white">
                    <th className="border border-[#6C0053] p-3 w-1/4">Sección MINAM Afectada</th>
                    <th className="border border-[#6C0053] p-3 w-2/5">Hallazgo / Debilidad Detectada</th>
                    <th className="border border-[#6C0053] p-3 w-1/3">Riesgo Regulatorio (OEFA / Sector)</th>
                  </tr>
                </thead>
                <tbody>
                  {regulatoryRisks.map((risk, idx) => (
                    <tr key={risk.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3 font-bold text-[#6C0053] align-top">
                        {risk.seccionMinam}
                        <span className={`block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded w-max ${
                          risk.gravedad === 'Crítica' ? 'bg-red-100 text-red-800' : risk.gravedad === 'Alta' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          Gravedad {risk.gravedad}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-800 align-top">
                        {risk.hallazgoDebilidad}
                      </td>
                      <td className="border border-gray-200 p-3 text-red-800 font-medium align-top bg-red-50/30">
                        <strong>[Riesgo Regulatorio]:</strong> {risk.riesgoRegulatorio}
                        {risk.baseLegal && (
                          <span className="block mt-1 text-[10px] text-gray-500 font-normal">
                            Base legal: {risk.baseLegal}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Standard 4-Quadrant SWOT */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-4">
            <h3 className="text-base font-bold text-[#424242] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#6C0053]" />
              <span>Matriz de Diagnóstico FODA</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fortalezas */}
              <div className="bg-green-50/70 border border-green-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-green-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                  <span>FORTALEZAS (Factores Internos Favorables)</span>
                </h4>
                <ul className="space-y-1.5">
                  {(reviewReport.swot?.fortalezas || []).map((item, i) => (
                    <li key={i} className="text-xs text-green-950 bg-white p-2.5 rounded-lg border border-green-100 flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Oportunidades */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-blue-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>OPORTUNIDADES (Factores Externos Positivos)</span>
                </h4>
                <ul className="space-y-1.5">
                  {(reviewReport.swot?.oportunidades || []).map((item, i) => (
                    <li key={i} className="text-xs text-blue-950 bg-white p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Debilidades */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-amber-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>DEBILIDADES (Fallas Técnicas y Omisiones Internas)</span>
                </h4>
                <ul className="space-y-1.5">
                  {(reviewReport.swot?.debilidades || []).map((item, i) => (
                    <li key={i} className="text-xs text-amber-950 bg-white p-2.5 rounded-lg border border-amber-100 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amenazas */}
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-red-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>AMENAZAS (Riesgos de PAS, Multas y Clausura)</span>
                </h4>
                <ul className="space-y-1.5">
                  {(reviewReport.swot?.amenazas || []).map((item, i) => (
                    <li key={i} className="text-xs text-red-950 bg-white p-2.5 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setActiveTab('estructural')}
                className="bg-gray-100 text-[#424242] hover:bg-gray-200 px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Anterior
              </button>
              <button
                onClick={() => setActiveTab('matriz_doda')}
                className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow"
              >
                <span>Siguiente: Plan de Acción DO / DA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLAN DE ACCIÓN CORRECTIVO (MATRIZ ESTRATÉGICA DO / DA) */}
      {activeTab === 'matriz_doda' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#70BA74] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Motor de Reglas Cruzadas
                  </span>
                  <h3 className="text-lg font-bold text-[#424242]">
                    3. Plan de Acción Correctivo (Matriz Estratégica DO / DA)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                  <strong>Regla DO:</strong> Aprovechar oportunidades del entorno para reorientar debilidades en cumplimiento y valorización. <br />
                  <strong>Regla DA:</strong> Medidas de supervivencia técnica para eliminar debilidades críticas antes de fiscalizaciones de OEFA.
                </p>
              </div>

              <button
                onClick={() => setShowAddActionForm(!showAddActionForm)}
                className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm self-start md:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#70BA74]" />
                <span>{showAddActionForm ? 'Cancelar' : 'Agregar Acción Correctiva'}</span>
              </button>
            </div>

            {/* Form to add action item */}
            {showAddActionForm && (
              <div className="bg-[#FFDCF9]/30 border border-[#6C0053]/20 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-[#6C0053]">Nueva Medida del Plan de Acción Correctivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Sección MINAM</label>
                    <select
                      value={newActionSection}
                      onChange={e => setNewActionSection(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800"
                    >
                      <option value="I. Datos Generales">I. Datos Generales de la Empresa</option>
                      <option value="II. Descripción de Procesos">II. Descripción de Procesos</option>
                      <option value="III. Identificación y Estimación">III. Identificación y Estimación de Residuos</option>
                      <option value="IV. Estrategias de Minimización">IV. Estrategias de Minimización y Valorización</option>
                      <option value="V. Gestión y Manejo Operativo">V. Gestión y Manejo Operativo (Almacén / EO-RS)</option>
                      <option value="VI. Indicadores de Seguimiento">VI. Indicadores de Seguimiento</option>
                      <option value="VII. Cronograma y Presupuesto">VII. Cronograma y Presupuesto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Tipo de Estrategia</label>
                    <select
                      value={newActionType}
                      onChange={e => setNewActionType(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-bold text-gray-800"
                    >
                      <option value="DA (Supervivencia)">DA (Supervivencia - Mitigación Crítica / Anti-Multas)</option>
                      <option value="DO (Reorientación)">DO (Reorientación - Aprovechar Oportunidades y Valorización)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Presupuesto y Cronograma</label>
                    <input
                      type="text"
                      placeholder="Ej. S/ 3,500 / Meses 1-2"
                      value={newActionBudget}
                      onChange={e => setNewActionBudget(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Hallazgo o Debilidad</label>
                    <input
                      type="text"
                      placeholder="Describa la deficiencia técnica observada..."
                      value={newActionDeficiency}
                      onChange={e => setNewActionDeficiency(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Indicador Operacional Muestral (Fórmula)</label>
                    <input
                      type="text"
                      value={newActionIndicator}
                      onChange={e => setNewActionIndicator(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Acción Correctiva / Medida de Mitigación</label>
                  <textarea
                    rows={2}
                    placeholder="Detalle la medida técnica específica a implementar..."
                    value={newActionDescription}
                    onChange={e => setNewActionDescription(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddActionForm(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={handleAddStrategicAction}
                    className="px-4 py-1.5 rounded-lg bg-[#70BA74] hover:bg-[#5da761] text-white text-xs font-bold shadow"
                  >
                    Guardar Acción en la Matriz
                  </button>
                </div>
              </div>
            )}

            {/* Strategic Action Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-xs text-left">
                <thead>
                  <tr className="bg-[#6C0053] text-white">
                    <th className="border border-[#6C0053] p-2.5 w-1/6">Sección MINAM</th>
                    <th className="border border-[#6C0053] p-2.5 w-1/6 text-center">Tipo Estrategia</th>
                    <th className="border border-[#6C0053] p-2.5 w-2/6">Acción Correctiva / Medida de Mitigación</th>
                    <th className="border border-[#6C0053] p-2.5 w-1/5">Indicador Operacional Muestral</th>
                    <th className="border border-[#6C0053] p-2.5 w-1/6">Presupuesto y Cronograma</th>
                    <th className="border border-[#6C0053] p-2.5 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {strategicActions.map((item, idx) => (
                    <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-2.5 font-bold text-[#6C0053] align-top">
                        {item.seccionMinam}
                        <span className="block mt-1 text-[10px] text-gray-500 font-normal">
                          Debilidad: {item.hallazgoDebilidad}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-2.5 text-center align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black ${
                          item.tipoEstrategia.includes('DA')
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.tipoEstrategia}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-2.5 text-gray-800 align-top">
                        <p className="font-medium">{item.accionCorrectiva}</p>
                      </td>
                      <td className="border border-gray-200 p-2.5 align-top bg-green-50/30">
                        <code className="text-[10px] text-emerald-800 font-mono block bg-white p-1.5 rounded border border-emerald-100">
                          {item.indicadorOperacional}
                        </code>
                      </td>
                      <td className="border border-gray-200 p-2.5 font-bold text-gray-700 align-top">
                        {item.presupuestoCronograma}
                      </td>
                      <td className="border border-gray-200 p-2.5 text-center align-top">
                        <button
                          onClick={() => handleDeleteAction(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          title="Eliminar acción"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setActiveTab('foda_riesgos')}
                className="bg-gray-100 text-[#424242] hover:bg-gray-200 px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  setActiveTab('informe');
                  handlePrint();
                }}
                className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow cursor-pointer"
              >
                <span>Generar Informe Técnico (PDF)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INFORME TÉCNICO OFICIAL A4 */}
      {activeTab === 'informe' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-[#CCCCCC]/40 gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#424242]">Informe Técnico de Evaluación - PMMRSNM (Formato Oficial A4)</h3>
              <p className="text-xs text-gray-500 mt-0.5">Estructurado según el rol de Auditor Especialista y requerimientos de la R.M. N.° 089-2023-MINAM.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadPdfDirect}
                className="flex items-center gap-2 bg-[#6C0053] hover:bg-[#51003d] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                title="Descargar archivo PDF directo"
              >
                <Download className="w-4 h-4 text-[#70BA74]" />
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                title="Abrir diálogo de impresión / guardar PDF"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Imprimir / Guardar como PDF</span>
              </button>
              <button
                onClick={handleDownloadHtml}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#424242] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Descargar archivo HTML oficial"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Descargar Archivo Oficial A4</span>
              </button>
            </div>
          </div>

          {/* Printable A4 Report View */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#CCCCCC] max-w-4xl mx-auto p-8 sm:p-12 space-y-8 font-serif text-[#222222]">
            {/* Header Box */}
            <div className="border-b-2 border-[#6C0053] pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-16 flex items-center justify-start">
                  <img 
                    src={CASA_ALTAIR_LOGO_BASE64} 
                    alt="Casa Altair" 
                    className="h-14 w-14 object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1 text-center">
                  <h2 className="text-base sm:text-lg font-sans uppercase tracking-widest text-[#424242] font-black">
                    CASA ALTAIR
                  </h2>
                </div>
                <div className="w-16"></div>
              </div>
              <h1 className="text-xl font-extrabold uppercase text-[#6C0053] tracking-wide text-center">
                INFORME TÉCNICO DE EVALUACIÓN - PMMRSNM
              </h1>
              <p className="text-xs font-sans text-gray-600 text-center">
                Auditoría Especializada conforme a la R.M. N.° 089-2023-MINAM, D.L. N.° 1278 y NTP 900.058:2019
              </p>
              <p className="text-xs font-sans text-gray-500 text-center">
                Fecha de Evaluación: {reviewReport.fechaRevision} | Evaluador: {reviewReport.revisor}
              </p>
            </div>

            <div className="space-y-6 text-sm leading-relaxed font-serif">
              {/* 1. RESUMEN DE CUMPLIMIENTO ESTRUCTURAL */}
              <div className="space-y-3 font-sans text-xs">
                <h3 className="font-bold uppercase tracking-wide text-sm text-[#6C0053] border-b border-gray-200 pb-1">
                  1. Resumen de Cumplimiento Estructural (R.M. 089-2023-MINAM)
                </h3>
                <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 space-y-2">
                  <p><strong>Titular / Establecimiento:</strong> {activePlan.company.razonSocial || 'No especificado'} (RUC: {activePlan.company.ruc || 'No especificado'})</p>
                  <p><strong>Plan Auditado:</strong> {reviewReport.tituloPlan}</p>
                  <p>
                    <strong>Estado de Cumplimiento General:</strong>{' '}
                    <span className="font-black text-sm text-[#6C0053]">{pct}% de Cumplimiento</span>
                  </p>
                  <div className="pt-1">
                    <strong className="text-green-800">Secciones Aprobadas ({approvedSections.length} de 7 obligatorias):</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-green-900">
                      {approvedSections.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-1">
                    <strong className="text-red-800">Secciones Observadas o Ausentes ({observedSections.length} de 7 obligatorias):</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-red-900">
                      {observedSections.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. AUDITORÍA DETALLADA Y MATRIZ FODA MAPEADA */}
              <div className="space-y-3 font-sans text-xs">
                <h3 className="font-bold uppercase tracking-wide text-sm text-[#6C0053] border-b border-gray-200 pb-1">
                  2. Auditoría Detallada y Matriz FODA Mapeada (Riesgos OEFA / Sector)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-left text-[11px]">
                    <thead>
                      <tr className="bg-[#6C0053] text-white">
                        <th className="border border-gray-300 p-2.5 w-1/4">Sección MINAM Afectada</th>
                        <th className="border border-gray-300 p-2.5 w-2/5">Hallazgo / Debilidad Detectada</th>
                        <th className="border border-gray-300 p-2.5 w-1/3">Riesgo Regulatorio (OEFA / Sector)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regulatoryRisks.map((risk, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2 font-bold text-[#6C0053] align-top">{risk.seccionMinam}</td>
                          <td className="border border-gray-300 p-2 align-top">{risk.hallazgoDebilidad}</td>
                          <td className="border border-gray-300 p-2 text-red-800 align-top">
                            <strong>[Riesgo Regulatorio]:</strong> {risk.riesgoRegulatorio}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. PLAN DE ACCIÓN CORRECTIVO (MATRIZ ESTRATÉGICA DO / DA) */}
              <div className="space-y-3 font-sans text-xs">
                <h3 className="font-bold uppercase tracking-wide text-sm text-[#6C0053] border-b border-gray-200 pb-1">
                  3. Plan de Acción Correctivo (Matriz Estratégica DO / DA)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-left text-[11px]">
                    <thead>
                      <tr className="bg-[#6C0053] text-white">
                        <th className="border border-gray-300 p-2 w-1/6">Sección MINAM</th>
                        <th className="border border-gray-300 p-2 w-1/6 text-center">Tipo Estrategia</th>
                        <th className="border border-gray-300 p-2 w-2/6">Acción Correctiva / Mitigación</th>
                        <th className="border border-gray-300 p-2 w-1/5">Indicador Operacional Muestral</th>
                        <th className="border border-gray-300 p-2 w-1/6">Presupuesto y Cronograma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strategicActions.map((item, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2 font-bold text-[#6C0053] align-top">{item.seccionMinam}</td>
                          <td className="border border-gray-300 p-2 text-center align-top font-bold">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              item.tipoEstrategia.includes('DA') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.tipoEstrategia}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-2 align-top">{item.accionCorrectiva}</td>
                          <td className="border border-gray-300 p-2 font-mono text-[10px] text-emerald-800 bg-green-50/50 align-top">
                            {item.indicadorOperacional}
                          </td>
                          <td className="border border-gray-300 p-2 font-semibold text-gray-700 align-top">
                            {item.presupuestoCronograma}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. CONCLUSIÓN FINAL Y RECOMENDACIONES DE PRESENTACIÓN */}
              <div className="space-y-3 font-sans text-xs">
                <h3 className="font-bold uppercase tracking-wide text-sm text-[#6C0053] border-b border-gray-200 pb-1">
                  4. Conclusión Final y Recomendaciones de Presentación
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-justify leading-relaxed">
                  <p>
                    <strong>Dictamen Técnico de Conformidad:</strong><br />
                    {reviewReport.conclusionParrafo1 || reviewReport.resumenEjecutivo}
                  </p>
                  <p>
                    <strong>Prioridades Inmediatas antes del envío al Sector:</strong><br />
                    {reviewReport.conclusionParrafo2 || (
                      reviewReport.recomendaciones && reviewReport.recomendaciones[0]
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-12 grid grid-cols-2 gap-12 font-sans text-xs text-center">
              <div className="space-y-8">
                <div className="border-b border-gray-400 w-48 mx-auto"></div>
                <p className="font-bold text-[#424242]">{reviewReport.revisor}</p>
                <p className="text-gray-500">Auditor Especialista en Gestión de Residuos No Municipales</p>
              </div>
              <div className="space-y-8">
                <div className="border-b border-gray-400 w-48 mx-auto"></div>
                <p className="font-bold text-[#424242]">Dirección de Fiscalización y Control</p>
                <p className="text-gray-500">Visto Bueno Técnico Institucional</p>
              </div>
            </div>

            {/* Document Bottom Copyright */}
            <div className="pt-10 border-t border-gray-300 text-center font-sans text-xs text-gray-500 space-y-1">
              <p className="font-bold text-[#424242]">
                Elaborado y diseñado por Casa Altair - Equilibria (<a href="mailto:casa_altair@equilibria360.com" className="text-[#6C0053] underline hover:text-[#51003d]">casa_altair@equilibria360.com</a>). Lima, Perú — Setiembre de 2026
              </p>
              <p className="text-[11px] text-gray-400">
                Informe Técnico de Evaluación conforme a la R.M. N.° 089-2023-MINAM y D.L. N.° 1278
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
