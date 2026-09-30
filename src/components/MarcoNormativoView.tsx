import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X, 
  Save, 
  Database,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { useFirestore } from '../context/FirestoreContext';
import { MarcoNormativoItem } from '../services/firestoreService';

export const MarcoNormativoView: React.FC = () => {
  const { 
    marcoNormativo, 
    isFirestoreConnected, 
    saveNorma, 
    toggleNorma, 
    deleteNorma 
  } = useFirestore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNorma, setEditingNorma] = useState<Partial<MarcoNormativoItem> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const categories = [
    'Todas', 
    'Leyes y Decretos Legislativos', 
    'Reglamentos', 
    'Resoluciones Ministeriales', 
    'Normas Técnicas', 
    'Guías y Documentos Técnicos'
  ];

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredDocs = marcoNormativo.filter((doc) => {
    const matchesSearch = 
      doc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todas' || doc.categoria === selectedCategory;
    const matchesStatus = 
      statusFilter === 'todos' || 
      (statusFilter === 'activos' && doc.activo) ||
      (statusFilter === 'inactivos' && !doc.activo);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenNew = () => {
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (norma: MarcoNormativoItem) => {
    setEditingNorma({ ...norma });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNorma || !editingNorma.nombre?.trim() || !editingNorma.codigo?.trim()) {
      showNotification('El código y el nombre de la norma son obligatorios', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await saveNorma(editingNorma);
      setIsModalOpen(false);
      setEditingNorma(null);
      showNotification('Norma jurídica actualizada con éxito en Firestore');
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleNorma(id, !currentStatus);
      showNotification(`Norma ${!currentStatus ? 'activada' : 'desactivada (derogada)'} en Firestore`);
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id: string, codigo: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente la norma ${codigo}?`)) return;
    try {
      await deleteNorma(id);
      showNotification(`Norma ${codigo} eliminada de Firestore`);
    } catch (err: any) {
      showNotification(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#CCCCCC]/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6C0053] flex items-center justify-center text-white shadow">
              <BookOpen className="w-6 h-6 text-[#70BA74]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#424242]">Marco Normativo e Institucional PMMRS</h2>
              <p className="text-xs text-[#424242] mt-0.5">
                Repositorio oficial y sincronizado con Firestore para sustentar las citas legales en la elaboración y auditoría de planes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Firestore status pill */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800">
              <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Database className="w-3.5 h-3.5 text-[#6C0053]" />
              <span>Firestore: pmmrs-gestion</span>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 bg-[#6C0053] hover:bg-[#52003f] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#70BA74]" />
              <span>Agregar Nueva Norma</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por código, norma, número o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-[#CCCCCC] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-gray-50 border border-[#CCCCCC] rounded-xl px-3 py-2 text-xs text-[#424242] font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C0053]"
            >
              <option value="todos">Todos los Estados</option>
              <option value="activos">Solo Vigentes</option>
              <option value="inactivos">Solo Derogadas</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#6C0053] text-white shadow-xs'
                  : 'bg-gray-100 text-[#424242] hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Normas Table (Requirement: Código, Nombre, Enlace, Descripción y Estado Activo/Inactivo) */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#CCCCCC]/40 overflow-hidden">
        <div className="p-4 bg-[#fcf9fc] border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6C0053]">
            <BookOpen className="w-4 h-4 text-[#70BA74]" />
            <span>Catálogo Oficial de Normas Jurídicas ({filteredDocs.length} registradas)</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Actualización en tiempo real vía Firebase Firestore
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#424242]">
            <thead className="bg-[#6C0053] text-white text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4 w-32">Código</th>
                <th className="py-3 px-4 w-60">Nombre</th>
                <th className="py-3 px-4 w-36">Enlace</th>
                <th className="py-3 px-6">Descripción</th>
                <th className="py-3 px-4 w-28 text-center">Estado</th>
                <th className="py-3 px-4 w-28 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No se encontraron normas con los criterios de búsqueda aplicados.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((norma) => (
                  <tr 
                    key={norma.id} 
                    className={`transition-colors hover:bg-[#fcf9fc] ${!norma.activo ? 'bg-gray-50/70 opacity-60' : ''}`}
                  >
                    {/* Código */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6C0053]">
                      {norma.codigo}
                      <span className="block text-[10px] text-gray-500 font-normal mt-0.5">{norma.numero}</span>
                    </td>

                    {/* Nombre */}
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

                    {/* Enlace */}
                    <td className="py-3.5 px-4">
                      {norma.enlace ? (
                        <a
                          href={norma.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C0053] hover:underline bg-[#FFDCF9]/50 hover:bg-[#FFDCF9] px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <span>Acceder a Fuente</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Sin enlace</span>
                      )}
                    </td>

                    {/* Descripción */}
                    <td className="py-3.5 px-6 space-y-1">
                      <p className="text-gray-700 leading-relaxed">{norma.descripcion}</p>
                      {norma.versionUtilizada && (
                        <span className="text-[10px] text-emerald-800 font-semibold block">
                          Versión aplicada: {norma.versionUtilizada}
                        </span>
                      )}
                    </td>

                    {/* Estado: Activo / Inactivo */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(norma.id, norma.activo)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          norma.activo 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title={norma.activo ? 'Clic para marcar como Derogada / Inactiva' : 'Clic para marcar como Activa'}
                      >
                        {norma.activo ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-red-600" />}
                        <span>{norma.activo ? 'Activa' : 'Derogada'}</span>
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(norma)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                          title="Editar norma"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(norma.id, norma.codigo)}
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

      {/* NTP 900.058:2019 Color Code Reference */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#424242]">Norma Técnica Peruana NTP 900.058:2019 — Código de Colores</h3>
          <p className="text-xs text-[#424242] mt-1">
            Dispositivos obligatorios de almacenamiento temporal para la segregación en la fuente conforme al marco normativo vigente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 block mb-2"></span>
            <h4 className="font-bold text-xs text-blue-900">Color Azul</h4>
            <p className="text-[11px] text-blue-800">Papel y Cartón (Revistas, diarios, cajas, folletos)</p>
          </div>

          <div className="p-4 rounded-xl border border-gray-300 bg-gray-50 space-y-1">
            <span className="w-4 h-4 rounded-full bg-white border border-gray-400 block mb-2"></span>
            <h4 className="font-bold text-xs text-gray-800">Color Blanco</h4>
            <p className="text-[11px] text-gray-700">Plásticos (Botellas PET, envases, film, bolsas)</p>
          </div>

          <div className="p-4 rounded-xl border border-yellow-300 bg-yellow-50/50 space-y-1">
            <span className="w-4 h-4 rounded-full bg-yellow-500 block mb-2"></span>
            <h4 className="font-bold text-xs text-yellow-900">Color Amarillo</h4>
            <p className="text-[11px] text-yellow-800">Metales (Latas de aluminio, conservas, fierro)</p>
          </div>

          <div className="p-4 rounded-xl border border-green-300 bg-green-50/50 space-y-1">
            <span className="w-4 h-4 rounded-full bg-green-600 block mb-2"></span>
            <h4 className="font-bold text-xs text-green-900">Color Verde</h4>
            <p className="text-[11px] text-green-800">Vidrio (Botellas, envases de bebidas, frascos)</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <span className="w-4 h-4 rounded-full bg-amber-800 block mb-2"></span>
            <h4 className="font-bold text-xs text-amber-950">Color Marrón</h4>
            <p className="text-[11px] text-amber-900">Orgánicos (Restos de alimentos, jardinería)</p>
          </div>

          <div className="p-4 rounded-xl border border-gray-400 bg-gray-200/50 space-y-1">
            <span className="w-4 h-4 rounded-full bg-gray-500 block mb-2"></span>
            <h4 className="font-bold text-xs text-gray-800">Color Plomo</h4>
            <p className="text-[11px] text-gray-700">No aprovechables (Cerámicos, colillas, restos sanitarios)</p>
          </div>

          <div className="p-4 rounded-xl border border-red-300 bg-red-50/50 space-y-1 sm:col-span-2">
            <span className="w-4 h-4 rounded-full bg-red-600 block mb-2"></span>
            <h4 className="font-bold text-xs text-red-900">Color Rojo (Residuos Peligrosos)</h4>
            <p className="text-[11px] text-red-800">Pilas, baterías, aceites usados, paños con hidrocarburos, envases de reactivos químicos.</p>
          </div>
        </div>
      </div>

      {/* Modal: Editar o Crear Norma */}
      {isModalOpen && editingNorma && (
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
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#424242] block mb-1">Código de la Norma</label>
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
                    value={editingNorma.categoria || 'Resoluciones Ministeriales'}
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
                  <label className="font-bold text-[#424242] block mb-1">Fecha de Emisión</label>
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
                  placeholder="Descripción de la norma y sus implicancias en la gestión de residuos no municipales..."
                />
              </div>

              <div>
                <label className="font-bold text-[#424242] block mb-1">Versión / Modificatorias</label>
                <input
                  type="text"
                  value={editingNorma.versionUtilizada || ''}
                  onChange={(e) => setEditingNorma({ ...editingNorma, versionUtilizada: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#424242]"
                  placeholder="Ej. Versión oficial vigente con modificatorias"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="normaActivaModal"
                  checked={editingNorma.activo !== false}
                  onChange={(e) => setEditingNorma({ ...editingNorma, activo: e.target.checked })}
                  className="w-4 h-4 text-[#6C0053] rounded"
                />
                <label htmlFor="normaActivaModal" className="font-bold text-gray-700 cursor-pointer">
                  Norma Vigente y Activa (Desmarcar si está derogada)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
