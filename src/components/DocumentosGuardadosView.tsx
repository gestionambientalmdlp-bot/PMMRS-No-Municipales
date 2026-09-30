import React, { useState } from 'react';
import { FolderArchive, FileText, CheckCircle2, Download, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { PMMRSPlan, ReviewReport } from '../types';
import { downloadJsonFile } from '../utils/printReport';

interface DocumentosGuardadosViewProps {
  activePlan: PMMRSPlan;
  setActivePlan: React.Dispatch<React.SetStateAction<PMMRSPlan>>;
  reviewReport: ReviewReport;
  setReviewReport: React.Dispatch<React.SetStateAction<ReviewReport>>;
  loadDemoData: () => void;
}

export const DocumentosGuardadosView: React.FC<DocumentosGuardadosViewProps> = ({
  activePlan,
  setActivePlan,
  reviewReport,
  setReviewReport,
  loadDemoData
}) => {
  const savedPlans = [activePlan];
  const savedReports = [reviewReport];

  const handleSelectPlan = (plan: PMMRSPlan) => {
    setActivePlan(plan);
  };

  const exportPlanJson = (plan: PMMRSPlan) => {
    const safeName = plan.company.razonSocial ? plan.company.razonSocial.replace(/[^a-zA-Z0-9]/g, '_') : 'Plan';
    const filename = `PMMRS_${safeName}_2026.json`;
    downloadJsonFile(plan, filename);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6C0053] flex items-center justify-center text-white shadow">
              <FolderArchive className="w-6 h-6 text-[#70BA74]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#424242]">Planes y Informes Guardados</h2>
              <p className="text-xs text-[#424242] mt-0.5">
                Gestione, exporte y recupere sus Planes de Minimización y Manejo de Residuos Sólidos elaborados o revisados.
              </p>
            </div>
          </div>
          <button
            onClick={loadDemoData}
            className="flex items-center gap-2 bg-[#FFDCF9] text-[#6C0053] hover:bg-[#f3cbe8] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cargar Demo Industrial</span>
          </button>
        </div>
      </div>

      {/* Plans Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#424242] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#6C0053]" />
          <span>Planes PMMRS Registrados</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedPlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#70BA74] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    {plan.estado}
                  </span>
                  <span className="text-xs text-gray-400">Modificado: {plan.fechaModificacion}</span>
                </div>
                <h4 className="font-bold text-base text-[#424242]" title={plan.titulo}>{plan.titulo}</h4>
                <p className="text-xs font-semibold text-[#6C0053]">
                  {plan.company.razonSocial} (RUC: {plan.company.ruc})
                </p>
                <p className="text-xs text-gray-500">
                  Residuos registrados: {plan.residuos.length} tipos | Capítulos completados: {plan.capitulos.filter(c => c.completado).length}/7
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    activePlan.id === plan.id
                      ? 'bg-[#70BA74] text-white'
                      : 'bg-[#6C0053] text-white hover:bg-[#51003d]'
                  }`}
                >
                  <span>{activePlan.id === plan.id ? 'Plan Activo Actual' : 'Seleccionar Plan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => exportPlanJson(plan)}
                  className="p-2 text-gray-500 hover:text-[#6C0053] hover:bg-gray-100 rounded-xl transition-all"
                  title="Exportar archivo JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
