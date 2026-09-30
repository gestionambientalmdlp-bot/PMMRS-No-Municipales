import React, { useRef, useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Table, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  AnnexConfig, 
  generateAnnexExcelTemplate, 
  parseExcelToMarkdownTable, 
  mergeChapterNarrativeWithTable,
  parseMarkdownTableStrings
} from '../utils/excelAnnexes';

interface AnnexExcelUploadCardProps {
  annexConfig: AnnexConfig;
  chapterTitle: string;
  chapterContent: string;
  companyName: string;
  onUpdateContent: (newContent: string) => void;
}

export const AnnexExcelUploadCard: React.FC<AnnexExcelUploadCardProps> = ({
  annexConfig,
  chapterTitle,
  chapterContent,
  companyName,
  onUpdateContent
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showNotas, setShowNotas] = useState(false);

  // Check if content already contains an Annex table
  const segments = parseMarkdownTableStrings(chapterContent);
  const existingTable = segments.find(s => s.type === 'table');

  const handleDownloadTemplate = () => {
    try {
      const ok = generateAnnexExcelTemplate(annexConfig.numeroAnexo, companyName);
      if (ok) {
        setFeedback({
          type: 'success',
          message: `Plantilla "${annexConfig.nombreArchivo}" descargada. Complete los datos en Excel y súbalos a continuación.`
        });
        setTimeout(() => setFeedback(null), 6000);
      } else {
        setFeedback({ type: 'error', message: 'No se pudo generar la plantilla Excel.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Error al generar plantilla Excel.' });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFeedback(null);

    try {
      const result = await parseExcelToMarkdownTable(file);

      if (result.rowCount === 0) {
        setFeedback({
          type: 'error',
          message: 'El archivo Excel no contiene filas de datos válidas debajo de los encabezados.'
        });
        setIsProcessing(false);
        return;
      }

      // Merge narrative text + exact formatted table
      const updatedContent = mergeChapterNarrativeWithTable(
        chapterContent,
        annexConfig.numeroAnexo,
        result.markdownTable,
        file.name
      );

      onUpdateContent(updatedContent);

      setFeedback({
        type: 'success',
        message: `¡Excel importado correctamente! Se insertó la cuadrícula exacta con ${result.rowCount} filas y ${result.columnCount} columnas (sin resumir).`
      });
      setShowPreview(true);

      setTimeout(() => setFeedback(null), 8000);
    } catch (err: any) {
      console.error('Error al procesar archivo Excel:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Error al procesar el archivo Excel. Asegúrese de que sea un archivo .xlsx válido.'
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#fbf5fa] to-[#f4fbf5] rounded-2xl p-5 border border-[#6C0053]/25 shadow-sm space-y-4 my-4">
      {/* Hidden Excel File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#6C0053]/15 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C0053] text-white flex items-center justify-center shrink-0 shadow-sm">
            <FileSpreadsheet className="w-5 h-5 text-[#70BA74]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#6C0053] text-white px-2 py-0.5 rounded-full">
                Anexo {annexConfig.numeroAnexo} Oficial
              </span>
              <span className="text-[10px] font-bold text-[#6C0053] bg-[#FFDCF9] px-2 py-0.5 rounded-full">
                R.M. N.° 089-2023-MINAM
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#424242] mt-1">
              {annexConfig.tituloAnexo}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {annexConfig.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download Template & Upload Excel */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#6C0053] border-2 border-[#6C0053]/30 hover:border-[#6C0053] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Descargar plantilla Excel pre-formateada con las columnas oficiales"
        >
          <Download className="w-4 h-4 text-[#70BA74]" />
          <span>Descargar Plantilla Excel</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-[#70BA74] hover:bg-[#5da761] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          title="Subir archivo Excel llenado para insertar la tabla completa en el capítulo"
        >
          <Upload className="w-4 h-4 text-white" />
          <span>{isProcessing ? 'Procesando Excel...' : 'Cargar Datos Excel'}</span>
        </button>

        {annexConfig.notas && annexConfig.notas.length > 0 && (
          <button
            type="button"
            onClick={() => setShowNotas(!showNotas)}
            className="flex items-center gap-1.5 bg-[#FFDCF9]/60 hover:bg-[#FFDCF9] text-[#6C0053] border border-[#6C0053]/25 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Ver notas oficiales de llenado según R.M. N.° 089-2023-MINAM"
          >
            <Info className="w-3.5 h-3.5 text-[#6C0053]" />
            <span>{showNotas ? 'Ocultar Guía Oficial' : 'Ver Guía y Notas Oficiales'}</span>
            {showNotas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}

        {existingTable && (
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#6C0053] ml-auto px-2 py-1 rounded-lg hover:bg-white/80 transition-all cursor-pointer"
          >
            <Table className="w-3.5 h-3.5 text-[#6C0053]" />
            <span>{showPreview ? 'Ocultar Cuadrícula' : 'Ver Cuadrícula Cargada'}</span>
            {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
          feedback.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Official Guidance & Notes Panel (R.M. N.° 089-2023-MINAM) */}
      {showNotas && annexConfig.notas && annexConfig.notas.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-[#6C0053]/20 shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6C0053]">
            <Info className="w-4 h-4 text-[#70BA74]" />
            <span>Notas Oficiales y Criterios Técnicos de Llenado (R.M. N.° 089-2023-MINAM):</span>
          </div>
          <ul className="text-xs text-gray-700 space-y-1.5 pl-2">
            {annexConfig.notas.map((nota, idx) => (
              <li key={idx} className="leading-relaxed border-l-2 border-[#70BA74] pl-2.5 py-0.5 bg-[#fcf9fc] rounded-r-md">
                {nota}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mandatory Instruction Reminder */}
      <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-gray-200/80 text-[11px] text-gray-600">
        <Info className="w-4 h-4 text-[#6C0053] shrink-0 mt-0.5" />
        <span>
          <strong>Procesamiento fiel:</strong> La carga mantiene intacta la redacción introductoria y narrativa de su capítulo, insertando a continuación la tabla completa con todas las columnas y filas exactas de su archivo Excel.
        </span>
      </div>

      {/* Table Preview (if exists in chapter content) */}
      {existingTable && showPreview && existingTable.headers && (
        <div className="space-y-2 pt-2 border-t border-[#6C0053]/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6C0053] flex items-center gap-1.5">
              <Table className="w-4 h-4 text-[#70BA74]" />
              <span>Cuadro del Anexo {annexConfig.numeroAnexo} incluido en la redacción ({existingTable.rows?.length || 0} filas registradas):</span>
            </span>
            <span className="text-[10px] text-gray-500 italic">
              Formateado según R.M. 089-2023-MINAM
            </span>
          </div>

          <div className="overflow-x-auto max-h-72 border border-gray-300 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#6C0053] text-white">
                  {existingTable.headers.map((h, i) => (
                    <th key={i} className="p-2.5 border border-[#51003d] font-bold text-[11px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(existingTable.rows || []).map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/80 hover:bg-pink-50/40'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 border border-gray-200 text-gray-700 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
