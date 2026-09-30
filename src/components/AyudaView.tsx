import React from 'react';
import { HelpCircle, ShieldCheck, BookOpen, Layers, CheckSquare, Sparkles } from 'lucide-react';

export const AyudaView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCCCCC]/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#6C0053] flex items-center justify-center text-white shadow">
            <HelpCircle className="w-6 h-6 text-[#70BA74]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#424242]">Guía y Metodología del Sistema PMMRS</h2>
            <p className="text-xs text-[#424242] mt-0.5">
              Instrucciones técnicas, jerarquía de fuentes y principios normativos para la correcta elaboración y revisión de planes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#6C0053]">
            <ShieldCheck className="w-5 h-5 text-[#70BA74]" />
            <h3 className="font-bold text-base">Principio Fundamental de Fidelidad</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            La aplicación es estrictamente fidedigna a las fuentes normativas y técnicas proporcionadas. No inventa requisitos, obligaciones, artículos ni datos de empresas. Cuando falte información necesaria, el sistema solicita su ingreso o emplea los datos de demostración explícitamente etiquetados.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#6C0053]">
            <Layers className="w-5 h-5 text-[#70BA74]" />
            <h3 className="font-bold text-base">Estructura por Contenido Mínimo (R.M. 089-2023-MINAM)</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            El sistema se basa en los 7 capítulos oficiales aprobados por el Ministerio del Ambiente para actividades productivas, extractivas y de servicios, asegurando que cada requisito guarde trazabilidad completa.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#6C0053]">
            <CheckSquare className="w-5 h-5 text-[#70BA74]" />
            <h3 className="font-bold text-base">Módulo de Revisión y Brechas</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Permite contrastar un Plan existente contra la Matriz Maestra de Requisitos. Clasifica los hallazgos en cumplimiento, omisión documental, deficiencia técnica y genera automáticamente un Informe Técnico con análisis FODA.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#CCCCCC]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#6C0053]">
            <Sparkles className="w-5 h-5 text-[#70BA74]" />
            <h3 className="font-bold text-base">Datos de Demostración</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Puede cargar instantáneamente los datos de demostración de una empresa textil industrial en el Callao para probar todas las funcionalidades del asistente, tablas de residuos y generación de reportes A4.
          </p>
        </div>
      </div>
    </div>
  );
};
