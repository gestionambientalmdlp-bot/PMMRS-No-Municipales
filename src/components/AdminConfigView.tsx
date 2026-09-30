import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Layers, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  X, 
  Save, 
  FileText,
  Filter,
  Check
} from 'lucide-react';
import { useFirestore } from '../context/FirestoreContext';
import { ContenidoMinimoItem, MarcoNormativoItem } from '../services/firestoreService';

export const AdminConfigView: React.FC = () => {
  const {
    contenidoMinimo,
    marcoNormativo,
    isFirestoreConnected,
    saveCriterion,
    toggleCriterion,
    deleteCriterion,
    seedCriteria,
    saveNorma,
    toggleNorma,
    deleteNorma,
    seedNormas
  } = useFirestore();

  const [activeTab, setActiveTab] = useState<'criterios' | 'normas'>('criterios');
  
  // Search & Filter state - Criterios
  const [searchCriterion, setSearchCriterion] = useState('');
  const [filterChapter, setFilterChapter] = useState<number | 'todos'>('todos');
  const [filterCriterionStatus, setFilterCriterionStatus] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  // Search & Filter state - Normas
  const [searchNorma, setSearchNorma] = useState('');
  const [filterNormaCat, setFilterNormaCat] = useState<string>('todas');
  const [filterNormaStatus, setFilterNormaStatus] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  // Modal State for Criterio
  const [isCriterionModalOpen, setIsCriterionModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Partial<ContenidoMinimoItem> | null>(null);

  // Modal State for Norma
  const [isNormaModalOpen, setIsNormaModalOpen] = useState(false);
  const [editingNorma, setEditingNorma] = useState<Partial<MarcoNormativoItem> | null>(null);

  // Operation notifications
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filtered criteria list
  const filteredCriteria = contenidoMinimo.filter((item) => {
    const q = searchCriterion.toLowerCase();
    const matchesSearch = 
      (item.criterio_redaccion || '').toLowerCase().includes(q) ||
      (item.pregunta_evaluacion || '').toLowerCase().includes(q) ||
      (item.codigo || '').toLowerCase().includes(q) ||
      (item.requisito || '').toLowerCase().includes(q) ||
      (item.categoria || '').toLowerCase().includes(q) ||
      (item.capituloNombre || '').toLowerCase().includes(q) ||
      (item.subpunto || '').toLowerCase().includes(q);

    const puntoVal = item.punto !== undefined ? item.punto : item.capitulo;
    const matchesChapter = filterChapter === 'todos' || puntoVal === filterChapter;
    const matchesStatus = 
      filterCriterionStatus === 'todos' || 
      (filterCriterionStatus === 'activos' && item.activo) ||
      (filterCriterionStatus === 'inactivos' && !item.activo);

    return matchesSearch && matchesChapter && matchesStatus;
  });

  // Filtered normas list
  const filteredNormas = marcoNormativo.filter((item) => {
    const matchesSearch = 
      item.codigo.toLowerCase().includes(searchNorma.toLowerCase()) ||
      item.nombre.toLowerCase().includes(searchNorma.toLowerCase()) ||
      item.numero.toLowerCase().includes(searchNorma.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchNorma.toLowerCase());

    const matchesCat = filterNormaCat === 'todas' || item.categoria === filterNormaCat;
    const matchesStatus = 
      filterNormaStatus === 'todos' || 
      (filterNormaStatus === 'activos' && item.activo) ||
      (filterNormaStatus === 'inactivos' && !item.activo);

    return matchesSearch && matchesCat && matchesStatus;
  });

  const CHAPTER_CATEGORIES: Record<number, string> = {
    1: 'Introducción',
    2: 'Objetivos',
    3: 'Alcance',
    4: 'Diagnóstico de residuos sólidos',
    5: 'Medidas de prevención y minimización',
    6: 'Operaciones de manejo',
    7: 'Medidas preventivas, mitigadoras y/o correctivas',
    8: 'Plan de contingencias',
    9: 'Programa de monitoreo y control',
    10: 'Cronograma',
    11: 'Presupuesto',
    12: 'Responsable de la gestión de los residuos',
    13: 'Anexos'
  };

  // Handlers for Criterios
  const handleOpenNewCriterion = () => {
    setEditingCriterion({
      punto: 1,
      subpunto: '',
      categoria: 'Introducción',
      criterio_redaccion: '',
      pregunta_evaluacion: '',
      es_determinado_normativa: true,
      fuente: 'R.M. N.° 089-2023-MINAM & D.L. 1278',
      tipo: 'Contenido mínimo',
      activo: true
    });
    setIsCriterionModalOpen(true);
  };

  const handleOpenEditCriterion = (item: ContenidoMinimoItem) => {
    setEditingCriterion({
      ...item,
      punto: item.punto !== undefined ? item.punto : item.capitulo,
      categoria: item.categoria || item.capituloNombre || CHAPTER_CATEGORIES[item.punto || 1],
      criterio_redaccion: item.criterio_redaccion || item.requisito || '',
      pregunta_evaluacion: item.pregunta_evaluacion || item.informacionRequerida || '',
      es_determinado_normativa: item.es_determinado_normativa !== undefined ? item.es_determinado_normativa : true
    });
    setIsCriterionModalOpen(true);
  };

  const handleSaveCriterionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const critText = editingCriterion?.criterio_redaccion || editingCriterion?.requisito;
    if (!editingCriterion || !critText?.trim()) {
      showNotification('El "Criterio de Redacción" es obligatorio', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const puntoVal = Number(editingCriterion.punto || editingCriterion.capitulo || 1);
      const catVal = editingCriterion.categoria || CHAPTER_CATEGORIES[puntoVal] || `Capítulo ${puntoVal}`;
      const payload: Partial<ContenidoMinimoItem> = {
        ...editingCriterion,
        punto: puntoVal,
        capitulo: puntoVal,
        categoria: catVal,
        capituloNombre: catVal,
        criterio_redaccion: critText.trim(),
        requisito: critText.trim(),
        pregunta_evaluacion: (editingCriterion.pregunta_evaluacion || editingCriterion.informacionRequerida || '').trim(),
        informacionRequerida: (editingCriterion.pregunta_evaluacion || editingCriterion.informacionRequerida || '').trim(),
        subpunto: editingCriterion.subpunto !== undefined ? String(editingCriterion.subpunto).trim() : '',
        subcapitulo: editingCriterion.subpunto !== undefined ? String(editingCriterion.subpunto).trim() : '',
        es_determinado_normativa: editingCriterion.es_determinado_normativa !== false
      };

      await saveCriterion(payload);
      setIsCriterionModalOpen(false);
      setEditingCriterion(null);
      showNotification('Criterio guardado con éxito en Firestore (colección contenido_minimo)');
    } catch (err: any) {
      showNotification(`Error al guardar criterio: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCriterionAction = async (id: string, currentStatus: boolean) => {
    try {
      await toggleCriterion(id, !currentStatus);
      showNotification(`Criterio ${!currentStatus ? 'activado' : 'desactivado'} en tiempo real`);
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteCriterionAction = async (id: string, codigo: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente el criterio ${codigo}?`)) return;
    try {
      await deleteCriterion(id);
      showNotification(`Criterio ${codigo} eliminado de Firestore`);
    } catch (err: any) {
      showNotification(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  // Handlers for Normas
  const handleOpenNewNorma = () => {
    setEditingNorma({
      codigo: '',
      nombre: '',
      numero: '',
      categoria: 'Resoluciones Ministeriales',
      entidad: 'MINAM',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      enlace: '',
      versionUtilizada: 'Vigente',
      activo: true
    });
    setIsNormaModalOpen(true);
  };

  const handleOpenEditNorma = (item: MarcoNormativoItem) => {
    setEditingNorma({ ...item });
    setIsNormaModalOpen(true);
  };

  const handleSaveNormaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNorma || !editingNorma.nombre?.trim() || !editingNorma.codigo?.trim()) {
      showNotification('El código y nombre de la norma son obligatorios', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await saveNorma(editingNorma);
      setIsNormaModalOpen(false);
      setEditingNorma(null);
      showNotification('Norma jurídica registrada y actualizada en Firestore');
    } catch (err: any) {
      showNotification(`Error al guardar norma: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleNormaAction = async (id: string, currentStatus: boolean) => {
    try {
      await toggleNorma(id, !currentStatus);
      showNotification(`Norma ${!currentStatus ? 'habilitada' : 'desactivada (derogada)'} en Firestore`);
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteNormaAction = async (id: string, codigo: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente la norma ${codigo}?`)) return;
    try {
      await deleteNorma(id);
      showNotification(`Norma ${codigo} eliminada de Firestore`);
    } catch (err: any) {
      showNotification(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  const handleSyncCriteria = async () => {
    if (!window.confirm('¿Deseas sincronizar / sembrar los 13 capítulos oficiales de la R.M. 089-2023-MINAM en Firestore?')) return;
    setIsSubmitting(true);
    try {
      const count = await seedCriteria(true);
      showNotification(`Se sincronizaron ${count} criterios oficiales en Firestore`);
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncNormas = async () => {
    if (!window.confirm('¿Deseas sincronizar el Marco Normativo oficial (D.L. 1278, D.S. 014-2017, R.M. 089-2023, NTP 900.058) en Firestore?')) return;
    setIsSubmitting(true);
    try {
      const count = await seedNormas(true);
      showNotification(`Se sincronizaron ${count} normas legales en Firestore`);
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header and Connection Status Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#CCCCCC]/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6C0053] flex items-center justify-center text-white shadow">
              <Settings className="w-6 h-6 text-[#70BA74]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#424242]">Configuración y Administración</h2>
              <p className="text-xs text-[#424242] mt-0.5">
                Gestión en tiempo real de criterios del Contenido Mínimo (R.M. 089-2023-MINAM) y Marco Normativo en Firebase Firestore.
              </p>
            </div>
          </div>

          {/* Firestore Live Badge */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isFirestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Database className="w-4 h-4 text-[#6C0053]" />
              <div className="text-left">
                <span className="font-bold text-[#424242]">Firebase Firestore: </span>
                <span className="text-[#6C0053] font-semibold">pmmrs-gestion</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400">|</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">
              {isFirestoreConnected ? 'En vivo' : 'Conectando'}
            </span>
          </div>
        </div>

        {/* Global Feedback message */}
        {feedback && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pt-2">
          <button
            onClick={() => setActiveTab('criterios')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'criterios'
                ? 'border-[#6C0053] text-[#6C0053] bg-[#FFDCF9]/30 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Colección: Contenido Mínimo (R.M. 089-2023)</span>
            <span className="bg-[#6C0053] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {contenidoMinimo.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('normas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'normas'
                ? 'border-[#6C0053] text-[#6C0053] bg-[#FFDCF9]/30 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Colección: Marco Normativo</span>
            <span className="bg-[#70BA74] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {marcoNormativo.length}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CONTENIDO MÍNIMO (CRITERIOS DE EVALUACIÓN)        */}
      {/* ======================================================== */}
      {activeTab === 'criterios' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#CCCCCC]/40 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar criterio por código, texto o capítulo..."
                  value={searchCriterion}
                  onChange={(e) => setSearchCriterion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
                />
              </div>

              {/* Filter by Chapter */}
              <select
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              >
                <option value="todos">Todos los Capítulos (1-13)</option>
                {Array.from({ length: 13 }, (_, i) => i + 1).map((cap) => (
                  <option key={cap} value={cap}>Capítulo {cap}</option>
                ))}
              </select>

              {/* Filter by status */}
              <select
                value={filterCriterionStatus}
                onChange={(e) => setFilterCriterionStatus(e.target.value as any)}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              >
                <option value="todos">Todos los Estados</option>
                <option value="activos">Solo Activos</option>
                <option value="inactivos">Solo Desactivados</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleSyncCriteria}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#424242] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Sincronizar requisitos oficiales de la R.M. 089-2023 en Firestore"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#6C0053]" />
                <span>Restaurar Base</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewCriterion}
                className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#52003f] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#70BA74]" />
                <span>Nuevo Criterio</span>
              </button>
            </div>
          </div>

          {/* Criteria Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#CCCCCC]/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#424242]">
                <thead className="bg-[#6C0053] text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-3 w-24">Punto / Subpunto</th>
                    <th className="py-3 px-3 w-36">Capítulo / Categoría</th>
                    <th className="py-3 px-4 min-w-[260px]">
                      <div className="flex items-center gap-1.5 text-[#FFDCF9]">
                        <span>Criterio de Redacción</span>
                        <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-normal">Para Elaborar Plan</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 min-w-[260px]">
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <span>Pregunta de Evaluación</span>
                        <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-normal">Para Revisar Plan</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 w-28 text-center">Normativa</th>
                    <th className="py-3 px-3 w-24 text-center">Estado</th>
                    <th className="py-3 px-3 w-24 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCriteria.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        No se encontraron criterios de evaluación con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredCriteria.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`transition-colors hover:bg-[#fcf9fc] ${!item.activo ? 'bg-gray-50/70 opacity-60' : ''}`}
                      >
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-[#6C0053] block text-xs">
                            Punto {item.punto !== undefined ? item.punto : item.capitulo}
                          </span>
                          {item.subpunto ? (
                            <span className="inline-block bg-[#FFDCF9] text-[#6C0053] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">
                              {item.subpunto}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">General</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-[#424242] block text-xs">
                            {item.categoria || item.capituloNombre || `Capítulo ${item.punto}`}
                          </span>
                          <span className="text-[10px] text-gray-500 block truncate max-w-[140px]">
                            Cap. {item.punto !== undefined ? item.punto : item.capitulo}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 space-y-1">
                          <p className="font-medium text-gray-900 leading-relaxed">
                            {item.criterio_redaccion || item.requisito || <span className="text-gray-400 italic">Sin criterio de redacción</span>}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="text-[#6C0053] font-semibold bg-[#FFDCF9]/60 px-1.5 py-0.2 rounded">
                              Fuente: {item.fuente || 'R.M. N.° 089-2023-MINAM & D.L. 1278'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 space-y-1">
                          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60">
                            <p className="font-semibold text-emerald-950 leading-relaxed text-[11px]">
                              {item.pregunta_evaluacion || item.informacionRequerida || <span className="text-gray-400 italic">Sin pregunta de evaluación</span>}
                            </p>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.es_determinado_normativa !== false
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {item.es_determinado_normativa !== false ? 'Obligatorio' : 'Criterio técnico'}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCriterionAction(item.id, item.activo)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              item.activo 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title={item.activo ? 'Clic para desactivar criterio en Firestore' : 'Clic para activar criterio'}
                          >
                            {item.activo ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-gray-500" />}
                            <span>{item.activo ? 'Activo' : 'Inactivo'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCriterion(item)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                              title="Editar criterio y preguntas"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCriterionAction(item.id, item.codigo)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Eliminar de Firestore"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MARCO NORMATIVO (LEYES, REGLAMENTOS, DIRECTIVAS)  */}
      {/* ======================================================== */}
      {activeTab === 'normas' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#CCCCCC]/40 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar norma por código, nombre o descripción..."
                  value={searchNorma}
                  onChange={(e) => setSearchNorma(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterNormaCat}
                onChange={(e) => setFilterNormaCat(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              >
                <option value="todas">Todas las Categorías</option>
                <option value="Leyes y Decretos Legislativos">Leyes y Decretos</option>
                <option value="Reglamentos">Reglamentos</option>
                <option value="Resoluciones Ministeriales">Resoluciones Ministeriales</option>
                <option value="Normas Técnicas">Normas Técnicas</option>
                <option value="Guías y Documentos Técnicos">Guías y Documentos</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterNormaStatus}
                onChange={(e) => setFilterNormaStatus(e.target.value as any)}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
              >
                <option value="todos">Todos los Estados</option>
                <option value="activos">Vigentes / Activas</option>
                <option value="inactivos">Derogadas / Desactivadas</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleSyncNormas}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#424242] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Sincronizar catálogo normativo base en Firestore"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#70BA74]" />
                <span>Restaurar Normas Base</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewNorma}
                className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#52003f] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#70BA74]" />
                <span>Nueva Norma</span>
              </button>
            </div>
          </div>

          {/* Normas Table (Direct requirement from user) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#CCCCCC]/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#424242]">
                <thead className="bg-[#6C0053] text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4 w-32">Código</th>
                    <th className="py-3 px-4 w-60">Nombre de la Norma</th>
                    <th className="py-3 px-4 w-36">Enlace Oficial</th>
                    <th className="py-3 px-6">Descripción y Alcance</th>
                    <th className="py-3 px-4 w-28 text-center">Estado</th>
                    <th className="py-3 px-4 w-28 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredNormas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        No se encontraron normas jurídicas con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredNormas.map((norma) => (
                      <tr 
                        key={norma.id} 
                        className={`transition-colors hover:bg-[#fcf9fc] ${!norma.activo ? 'bg-gray-50/70 opacity-60' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#6C0053]">
                          {norma.codigo}
                          <span className="block text-[10px] text-gray-500 font-normal mt-0.5">{norma.numero}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#424242] leading-snug">{norma.nombre}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                            <span className="bg-[#FFDCF9] text-[#6C0053] font-bold px-2 py-0.5 rounded">
                              {norma.categoria}
                            </span>
                            <span>•</span>
                            <span>{norma.entidad}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {norma.enlace ? (
                            <a
                              href={norma.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C0053] hover:underline bg-[#FFDCF9]/50 hover:bg-[#FFDCF9] px-2.5 py-1 rounded-lg transition-all"
                            >
                              <span>Ver Norma</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Sin enlace</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6">
                          <p className="text-gray-700 leading-relaxed">{norma.descripcion}</p>
                          {norma.versionUtilizada && (
                            <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
                              Versión: {norma.versionUtilizada}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleNormaAction(norma.id, norma.activo)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              norma.activo 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title={norma.activo ? 'Clic para marcar como Derogada / Inactiva' : 'Clic para reactivar norma'}
                          >
                            {norma.activo ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-red-600" />}
                            <span>{norma.activo ? 'Activa' : 'Derogada'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditNorma(norma)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                              title="Editar norma"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNormaAction(norma.id, norma.codigo)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Eliminar de Firestore"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDITAR / CREAR CRITERIO DE CONTENIDO MÍNIMO       */}
      {/* ======================================================== */}
      {isCriterionModalOpen && editingCriterion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#6C0053]" />
                <h3 className="font-bold text-base text-[#424242]">
                  {editingCriterion.id ? `Editar Criterio: ${editingCriterion.codigo}` : 'Nuevo Criterio de Evaluación (R.M. 089-2023)'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCriterionModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCriterionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#424242] block mb-1">Capítulo / Punto (1 al 13)</label>
                  <select
                    value={editingCriterion.punto || editingCriterion.capitulo || 1}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setEditingCriterion({ 
                        ...editingCriterion, 
                        punto: p,
                        capitulo: p,
                        categoria: CHAPTER_CATEGORIES[p] || `Capítulo ${p}`,
                        capituloNombre: CHAPTER_CATEGORIES[p] || `Capítulo ${p}`
                      });
                    }}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#424242]"
                  >
                    {Array.from({ length: 13 }, (_, i) => i + 1).map((c) => (
                      <option key={c} value={c}>Punto {c}: {CHAPTER_CATEGORIES[c]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#424242] block mb-1">Subpunto / Numeral</label>
                  <input
                    type="text"
                    value={editingCriterion.subpunto || ''}
                    onChange={(e) => setEditingCriterion({ ...editingCriterion, subpunto: e.target.value, subcapitulo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#6C0053]"
                    placeholder="Ej. 1A, 4.1, 6.a.1, 13.1 (vacío si es general)"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#424242] block mb-1">Categoría Oficial</label>
                  <input
                    type="text"
                    value={editingCriterion.categoria || editingCriterion.capituloNombre || ''}
                    onChange={(e) => setEditingCriterion({ ...editingCriterion, categoria: e.target.value, capituloNombre: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#424242]"
                    placeholder="Ej. Introducción, Objetivos..."
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6C0053] flex items-center justify-between mb-1">
                  <span>1. Criterio de Redacción (Directriz oficial para ELABORAR el Plan) *</span>
                  <span className="text-[10px] bg-[#FFDCF9] text-[#6C0053] px-2 py-0.5 rounded font-mono">Columna: criterio_redaccion</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingCriterion.criterio_redaccion || editingCriterion.requisito || ''}
                  onChange={(e) => setEditingCriterion({ 
                    ...editingCriterion, 
                    criterio_redaccion: e.target.value,
                    requisito: e.target.value 
                  })}
                  className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-xs text-[#424242] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
                  placeholder="Redacte la instrucción técnica obligatoria que el usuario debe desarrollar al elaborar este capítulo..."
                />
              </div>

              <div>
                <label className="font-bold text-emerald-800 flex items-center justify-between mb-1">
                  <span>2. Pregunta de Evaluación (Interrogante oficial para REVISAR / AUDITAR el Plan)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">Columna: pregunta_evaluacion</span>
                </label>
                <textarea
                  rows={3}
                  value={editingCriterion.pregunta_evaluacion || editingCriterion.informacionRequerida || ''}
                  onChange={(e) => setEditingCriterion({ 
                    ...editingCriterion, 
                    pregunta_evaluacion: e.target.value,
                    informacionRequerida: e.target.value 
                  })}
                  className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl p-3 text-xs text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="¿Se ha planteado adecuadamente...? Pregunta con la que el motor de auditoría verificará el cumplimiento."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="esDeterminadoNormativa"
                    checked={editingCriterion.es_determinado_normativa !== false}
                    onChange={(e) => setEditingCriterion({ ...editingCriterion, es_determinado_normativa: e.target.checked })}
                    className="w-4 h-4 text-[#6C0053] rounded"
                  />
                  <label htmlFor="esDeterminadoNormativa" className="font-bold text-gray-700 cursor-pointer">
                    Determinado por R.M. 089-2023 / D.L. 1278 (Obligatorio)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="criterionActivo"
                    checked={editingCriterion.activo !== false}
                    onChange={(e) => setEditingCriterion({ ...editingCriterion, activo: e.target.checked })}
                    className="w-4 h-4 text-[#6C0053] rounded"
                  />
                  <label htmlFor="criterionActivo" className="font-bold text-gray-700 cursor-pointer">
                    Criterio Activo en el Sistema
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCriterionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#52003f] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#70BA74]" />
                  <span>{isSubmitting ? 'Guardando en Firestore...' : 'Guardar Criterio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDITAR / CREAR NORMA DEL MARCO NORMATIVO          */}
      {/* ======================================================== */}
      {isNormaModalOpen && editingNorma && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#6C0053]" />
                <h3 className="font-bold text-base text-[#424242]">
                  {editingNorma.id ? `Editar Norma: ${editingNorma.codigo}` : 'Registrar Nueva Norma Jurídica'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsNormaModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNormaSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#424242] block mb-1">Código de Referencia</label>
                  <input
                    type="text"
                    required
                    value={editingNorma.codigo || ''}
                    onChange={(e) => setEditingNorma({ ...editingNorma, codigo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#6C0053]"
                    placeholder="Ej. DL-1278 o RM-089-2023"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#424242] block mb-1">Número Oficial</label>
                  <input
                    type="text"
                    required
                    value={editingNorma.numero || ''}
                    onChange={(e) => setEditingNorma({ ...editingNorma, numero: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242]"
                    placeholder="Ej. Decreto Supremo N.° 014-2017-MINAM"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#424242] block mb-1">Nombre Completo de la Norma</label>
                <input
                  type="text"
                  required
                  value={editingNorma.nombre || ''}
                  onChange={(e) => setEditingNorma({ ...editingNorma, nombre: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#424242]"
                  placeholder="Ej. Ley de Gestión Integral de Residuos Sólidos"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#424242] block mb-1">Categoría</label>
                  <select
                    value={editingNorma.categoria || 'Leyes y Decretos Legislativos'}
                    onChange={(e) => setEditingNorma({ ...editingNorma, categoria: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242]"
                  >
                    <option value="Leyes y Decretos Legislativos">Leyes y Decretos Legislativos</option>
                    <option value="Reglamentos">Reglamentos</option>
                    <option value="Resoluciones Ministeriales">Resoluciones Ministeriales</option>
                    <option value="Normas Técnicas">Normas Técnicas</option>
                    <option value="Guías y Documentos Técnicos">Guías y Documentos Técnicos</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#424242] block mb-1">Entidad Emisora</label>
                  <input
                    type="text"
                    value={editingNorma.entidad || ''}
                    onChange={(e) => setEditingNorma({ ...editingNorma, entidad: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242]"
                    placeholder="MINAM, OEFA, INACAL..."
                  />
                </div>

                <div>
                  <label className="font-bold text-[#424242] block mb-1">Fecha Emisión</label>
                  <input
                    type="date"
                    value={editingNorma.fecha || ''}
                    onChange={(e) => setEditingNorma({ ...editingNorma, fecha: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#424242] block mb-1">Enlace Oficial de la Norma (URL)</label>
                <input
                  type="url"
                  value={editingNorma.enlace || ''}
                  onChange={(e) => setEditingNorma({ ...editingNorma, enlace: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-blue-700"
                  placeholder="https://spij.minjus.gob.pe/... o https://www.gob.pe/..."
                />
              </div>

              <div>
                <label className="font-bold text-[#424242] block mb-1">Descripción y Alcance Jurídico</label>
                <textarea
                  rows={3}
                  value={editingNorma.descripcion || ''}
                  onChange={(e) => setEditingNorma({ ...editingNorma, descripcion: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-[#424242] leading-relaxed"
                  placeholder="Resumen del alcance regulatorio y obligaciones técnicas aplicables al PMMRS..."
                />
              </div>

              <div>
                <label className="font-bold text-[#424242] block mb-1">Versión / Modificatorias Utilizadas</label>
                <input
                  type="text"
                  value={editingNorma.versionUtilizada || ''}
                  onChange={(e) => setEditingNorma({ ...editingNorma, versionUtilizada: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242]"
                  placeholder="Ej. Texto único ordenado con D.L. 1501"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="normaActiva"
                  checked={editingNorma.activo !== false}
                  onChange={(e) => setEditingNorma({ ...editingNorma, activo: e.target.checked })}
                  className="w-4 h-4 text-[#6C0053] rounded"
                />
                <label htmlFor="normaActiva" className="font-bold text-gray-700 cursor-pointer">
                  Norma Vigente y Activa (Desmarcar si está derogada o descontinuada)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNormaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#52003f] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#70BA74]" />
                  <span>{isSubmitting ? 'Guardando en Firestore...' : 'Guardar Norma'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
