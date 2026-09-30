import { PMMRSPlan, ReviewReport } from '../types';
import { jsPDF } from 'jspdf';
import { getEvaluationResult } from './auditEngine';
import { CASA_ALTAIR_LOGO_BASE64 } from '../assets/casaAltairLogo';
import { parseMarkdownTableStrings } from './excelAnnexes';
import { processPlanCuadros } from './cuadrosProcessor';

const COPYRIGHT_TEXT = `Elaborado y diseñado por Casa Altair - Equilibria (<a href="mailto:casa_altair@equilibria360.com" style="color: #6C0053; text-decoration: underline;">casa_altair@equilibria360.com</a>). Lima, Perú — Setiembre de 2026`;

export function formatChapterForPrintHtml(content: string): string {
  if (!content || !content.trim()) {
    return '<p style="text-align: justify; line-height: 1.5; font-size: 11pt; color: #9ca3af; font-style: italic; margin: 0;">[Contenido pendiente de completar]</p>';
  }

  const segments = parseMarkdownTableStrings(content);
  return segments.map(seg => {
    if (seg.type === 'table' && seg.headers && seg.headers.length > 0) {
      const thead = `<tr>${seg.headers.map(h => `<th style="background-color: #6C0053; color: #ffffff; border: 1px solid #6C0053; padding: 6px 7px; font-size: 8pt; font-family: Arial, sans-serif; text-align: left;">${h}</th>`).join('')}</tr>`;
      const tbody = (seg.rows || []).map((row, rIdx) => 
        `<tr style="background-color: ${rIdx % 2 === 0 ? '#ffffff' : '#f9fafb'};">${row.map(cell => `<td style="border: 1px solid #d1d5db; padding: 5px 7px; font-size: 8pt; font-family: Arial, sans-serif; color: #1f2937;">${cell}</td>`).join('')}</tr>`
      ).join('');
      return `<table style="width: 100%; border-collapse: collapse; margin: 12px 0 16px 0; page-break-inside: avoid;"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    }

    const paragraphs = seg.content.split('\n');
    return paragraphs.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('### ')) {
        return `<h4 style="font-family: Arial, sans-serif; font-size: 10.5pt; color: #6C0053; margin: 14px 0 6px 0; font-weight: bold; border-bottom: 1px solid #fbcfe8; padding-bottom: 3px;">${trimmed.replace('### ', '')}</h4>`;
      }
      if (trimmed.startsWith('> *') && trimmed.endsWith('*')) {
        return '';
      }
      return `<p style="text-align: justify; line-height: 1.5; font-size: 10.5pt; color: #1f2937; margin: 0 0 8px 0;">${trimmed}</p>`;
    }).join('');
  }).join('');
}

export function generatePlanHtml(rawPlan: PMMRSPlan): string {
  const plan = processPlanCuadros(rawPlan);
  const totalResiduosKg = plan.residuos.reduce((acc, curr) => acc + (Number(curr.generacionEstimadaKgMes) || 0), 0);
  const totalPeligrososKg = plan.residuos.filter(r => r.tipo === 'Peligroso').reduce((acc, curr) => acc + (Number(curr.generacionEstimadaKgMes) || 0), 0);
  const totalNoPeligrososKg = totalResiduosKg - totalPeligrososKg;

  const rowsHtml = plan.residuos.map((res, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
      <td style="border: 1px solid #d1d5db; padding: 6px 8px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid #d1d5db; padding: 6px 8px; font-weight: bold; color: ${res.tipo === 'Peligroso' ? '#b91c1c' : '#15803d'};">${res.tipo}</td>
      <td style="border: 1px solid #d1d5db; padding: 6px 8px;"><strong>${res.categoria}</strong>: ${res.descripcion}</td>
      <td style="border: 1px solid #d1d5db; padding: 6px 8px; text-align: right; font-weight: bold;">${res.generacionEstimadaKgMes} kg/mes</td>
      <td style="border: 1px solid #d1d5db; padding: 6px 8px;">${res.colorContenedorNtp}</td>
      <td style="border: 1px solid #d1d5db; padding: 6px 8px;">${res.destinoFinal}</td>
    </tr>
  `).join('');

  const chaptersHtml = plan.capitulos.map(cap => `
    <div style="margin-bottom: 22px; page-break-inside: avoid;">
      <h3 style="color: #6C0053; border-bottom: 1.5px solid #6C0053; padding-bottom: 4px; font-size: 13pt; margin-bottom: 8px; text-transform: uppercase; font-family: Arial, sans-serif;">
        ${cap.titulo}
      </h3>
      <div>
        ${formatChapterForPrintHtml(cap.contenido)}
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PMMRS - ${plan.company.razonSocial || 'Plan Oficial'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 20mm;
    }
    body {
      font-family: "Times New Roman", Times, serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.4;
    }
    .no-print-bar {
      background: #6C0053;
      color: white;
      padding: 12px 20px;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 10pt;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .btn-print {
      background: #70BA74;
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 14px;
      font-size: 10.5pt;
    }
    .section-title {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      font-weight: bold;
      color: #6C0053;
      border-bottom: 1.5px solid #6C0053;
      padding-bottom: 4px;
      margin-top: 15px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      margin-bottom: 20px;
      background: #fdf2f8;
      padding: 14px;
      border-radius: 6px;
      border: 1px solid #fbcfe8;
    }
    .data-grid p {
      margin: 0;
      color: #374151;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      font-size: 9pt;
      margin: 14px 0 20px 0;
    }
    th {
      background-color: #6C0053;
      color: #ffffff;
      border: 1px solid #6C0053;
      padding: 7px 8px;
      text-align: left;
    }
    .page-cover {
      box-sizing: border-box;
      min-height: 250mm;
      padding: 15mm 10mm 15mm 10mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      page-break-after: always;
      break-after: page;
    }
    .page-company {
      box-sizing: border-box;
      min-height: 250mm;
      padding-top: 10mm;
      page-break-before: always;
      break-before: page;
      page-break-after: always;
      break-after: page;
    }
    .page-chapters {
      box-sizing: border-box;
      padding-top: 10mm;
      page-break-before: always;
      break-before: page;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 50px;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    .signature-line {
      border-top: 1.5px solid #4b5563;
      width: 200px;
      margin: 40px auto 6px auto;
    }
    .footer-copyright {
      margin-top: 40px;
      padding-top: 10px;
      border-top: 1px solid #d1d5db;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 8.5pt;
      color: #6b7280;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0 !important;
      }
      .page-cover {
        height: 270mm;
      }
      .page-company {
        height: 270mm;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>Documento preparado para formato oficial A4 (R.M. N.° 089-2023-MINAM). Secuencia: Hoja 1 Carátula, Hoja 2 Datos Empresa, Hoja 3 Capítulos.</span>
    <button class="btn-print" onclick="window.print()">Imprimir / Guardar como PDF (Ctrl+P)</button>
  </div>

  <!-- ==================== HOJA 1: CARÁTULA ==================== -->
  <div class="page-cover">
    <div>
      <div style="border-bottom: 3px solid #6C0053; padding-bottom: 12px; margin-bottom: 24px;">
        ${plan.header?.logoUrl ? `<img src="${plan.header.logoUrl}" style="max-height: 65px; max-width: 140px; object-fit: contain; margin-bottom: 8px;" alt="Logotipo Institucional" />` : ''}
        <h2 style="font-family: Arial, sans-serif; font-size: 13pt; color: #4b5563; margin: 0; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">
          ${plan.header.razonSocialHeader || plan.company.razonSocial || 'EMPRESA TITULAR'}
        </h2>
      </div>

      <div style="margin: 45px 0 35px 0;">
        <p style="font-family: Arial, sans-serif; font-size: 10pt; color: #70BA74; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
          INSTRUMENTO TÉCNICO DE GESTIÓN AMBIENTAL
        </p>
        <h1 style="font-family: Arial, sans-serif; font-size: 20pt; color: #6C0053; margin: 0 0 16px 0; text-transform: uppercase; font-weight: 900; line-height: 1.35;">
          ${plan.header.tituloDocumento || 'PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES'}
        </h1>
        <div style="width: 70px; height: 3.5px; background: #6C0053; margin: 18px auto;"></div>
        <p style="font-family: Arial, sans-serif; font-size: 10pt; color: #4b5563; line-height: 1.5; max-width: 580px; margin: 0 auto;">
          Formulado conforme al contenido mínimo aprobado por la <strong>Resolución Ministerial N.° 089-2023-MINAM</strong>, en concordancia con el Decreto Legislativo N.° 1278 (Ley de Gestión Integral de Residuos Sólidos) y su Reglamento D.S. N.° 014-2017-MINAM.
        </p>
      </div>

      <div style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 8px; padding: 18px 24px; max-width: 540px; margin: 0 auto; text-align: left; font-family: Arial, sans-serif; font-size: 9.5pt; line-height: 1.6;">
        <p style="margin: 4px 0;"><strong>Empresa / Titular:</strong> ${plan.company.razonSocial}</p>
        <p style="margin: 4px 0;"><strong>R.U.C.:</strong> ${plan.company.ruc}</p>
        <p style="margin: 4px 0;"><strong>Establecimiento:</strong> ${plan.company.domicilio}</p>
        <p style="margin: 4px 0;"><strong>Ubicación:</strong> ${plan.company.distrito}, ${plan.company.provincia}, ${plan.company.departamento}</p>
        <p style="margin: 4px 0;"><strong>Actividad Económica:</strong> ${plan.company.actividadEconomica || plan.company.sector}</p>
      </div>
    </div>

    <div style="font-family: Arial, sans-serif; font-size: 9pt; color: #4b5563; line-height: 1.8; margin-top: 30px;">
      <p style="margin: 3px 0;"><strong>Elaborado por:</strong> ${plan.header.elaboradoPor || 'Responsable Técnico Ambiental'}</p>
      <p style="margin: 3px 0;"><strong>Aprobado por:</strong> ${plan.header.aprobadoPor || plan.company.representanteLegal || 'Gerencia General'}</p>
      <p style="margin: 3px 0;"><strong>Periodo / Versión:</strong> ${plan.header.version || '2026-2027'} | <strong>Fecha de Emisión:</strong> ${plan.header.fechaEmision || new Date().toLocaleDateString('es-PE')}</p>
      <p style="margin: 6px 0 0 0; font-weight: bold; color: #111827; letter-spacing: 0.5px;">Lima, Perú</p>
    </div>
  </div>

  <!-- ==================== HOJA 2: DATOS DE LA EMPRESA ==================== -->
  <div class="page-company">
    <div style="border-bottom: 2px solid #6C0053; padding-bottom: 6px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; color: #6C0053; text-transform: uppercase;">
        ${plan.company.razonSocial || 'PMMRS'} — HOJA DE DATOS GENERALES (R.M. N.° 089-2023-MINAM)
      </span>
      <span style="font-family: Arial, sans-serif; font-size: 8pt; color: #6b7280;">Página 2</span>
    </div>

    <div class="section-title">I. Datos Generales de la Empresa y del Establecimiento</div>
    <div class="data-grid">
      <p><strong>Razón Social:</strong> ${plan.company.razonSocial || 'No especificado'}</p>
      <p><strong>RUC:</strong> ${plan.company.ruc || 'No especificado'}</p>
      <p><strong>Nombre Comercial:</strong> ${plan.company.nombreComercial || 'No especificado'}</p>
      <p><strong>Domicilio Legal:</strong> ${plan.company.domicilio || 'No especificado'}</p>
      <p><strong>Ubicación Geográfica:</strong> ${plan.company.distrito}, ${plan.company.provincia}, ${plan.company.departamento}</p>
      <p><strong>Representante Legal:</strong> ${plan.company.representanteLegal} (DNI: ${plan.company.dniRepresentante})</p>
      <p><strong>Sector / Actividad:</strong> ${plan.company.sector} — ${plan.company.actividadEconomica}</p>
      <p><strong>Personal y Turnos:</strong> ${plan.company.numeroTrabajadores} trabajadores | ${plan.company.horarioOperacion}</p>
      <p><strong>Teléfono de Contacto:</strong> ${plan.company.telefonoContacto || 'No especificado'}</p>
      <p><strong>Correo Electrónico:</strong> ${plan.company.correoContacto || 'No especificado'}</p>
    </div>

    <h3 style="font-family: Arial, sans-serif; font-size: 10.5pt; color: #6C0053; margin: 18px 0 6px 0; font-weight: bold; text-transform: uppercase;">
      Resumen de Generación y Almacenamiento de Residuos Sólidos (NTP 900.058:2019)
    </h3>
    <p style="font-family: Arial, sans-serif; font-size: 8.5pt; color: #4b5563; margin-bottom: 8px;">
      Generación Total Estimada: <strong>${totalResiduosKg} kg/mes</strong> (No Peligrosos: <strong>${totalNoPeligrososKg} kg/mes</strong> | Peligrosos: <strong>${totalPeligrososKg} kg/mes</strong>).
    </p>
    <table>
      <thead>
        <tr>
          <th style="width: 5%;">N.°</th>
          <th style="width: 14%;">Tipo</th>
          <th style="width: 33%;">Categoría / Descripción</th>
          <th style="width: 15%;">Gen. Estimada</th>
          <th style="width: 16%;">Color NTP 900.058</th>
          <th style="width: 17%;">Destino Final / EO-RS</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="6" style="text-align: center; padding: 12px;">No se registraron residuos</td></tr>'}
      </tbody>
    </table>
  </div>

  <!-- ==================== HOJA 3 EN ADELANTE: CAPÍTULOS ==================== -->
  <div class="page-chapters">
    <div style="border-bottom: 2px solid #6C0053; padding-bottom: 6px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; color: #6C0053; text-transform: uppercase;">
        ${plan.company.razonSocial || 'PMMRS'} — PLAN TÉCNICO OPERATIVO (CAPÍTULOS 1 AL 13)
      </span>
      <span style="font-family: Arial, sans-serif; font-size: 8pt; color: #6b7280;">Página 3 en adelante</span>
    </div>

    <div class="section-title">II. Capítulos del Plan de Minimización y Manejo</div>
    ${chaptersHtml}

    ${(plan.anexos && plan.anexos.length > 0) ? `
    <div class="section-title" style="page-break-before: always;">III. Anexos Oficiales de la R.M. N.° 089-2023-MINAM (12 Anexos)</div>
    ${plan.anexos.map(anexo => `
      <div style="margin-bottom: 25px; page-break-inside: avoid;">
        <h3 style="font-family: Arial, sans-serif; font-size: 11pt; color: #6C0053; margin: 14px 0 4px 0; border-bottom: 1.5px solid #FFDCF9; padding-bottom: 4px;">
          ${anexo.codigo}: ${anexo.titulo}
        </h3>
        ${anexo.subtitulo ? `<p style="font-family: Arial, sans-serif; font-size: 8.5pt; color: #047857; margin: 2px 0 6px 0;"><strong>${anexo.subtitulo}</strong></p>` : ''}
        <p style="font-family: Georgia, serif; font-size: 9.5pt; color: #374151; margin-bottom: 8px;">${anexo.descripcion}</p>
        ${anexo.columnas && anexo.filas && anexo.filas.length > 0 ? `
          <table>
            <thead>
              <tr>
                ${anexo.columnas.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${anexo.filas.map((fila, fIdx) => `
                <tr style="background-color: ${fIdx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                  ${Object.values(fila).map((val: any) => `<td>${typeof val === 'number' && val > 1000 ? 'S/ ' + val.toLocaleString('es-PE') : String(val)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </div>
    `).join('')}
    ` : ''}

    <div class="signatures">
      <div>
        <div class="signature-line"></div>
        <strong>${plan.header.elaboradoPor || 'Especialista Ambiental'}</strong>
        <div style="font-size: 8.5pt; color: #6b7280;">Elaborado por (Responsable Técnico)</div>
      </div>
      <div>
        <div class="signature-line"></div>
        <strong>${plan.header.aprobadoPor || plan.company.representanteLegal || 'Gerencia General'}</strong>
        <div style="font-size: 8.5pt; color: #6b7280;">Aprobado por (Representante Legal)</div>
      </div>
    </div>

    <div class="footer-copyright">
      ${COPYRIGHT_TEXT}
    </div>
  </div>
</body>
</html>`;
}

export function generateReviewReportHtml(report: ReviewReport, plan: PMMRSPlan): string {
  const pct = report.porcentajeCumplimientoGeneral !== undefined 
    ? report.porcentajeCumplimientoGeneral 
    : Math.round(((report.hallazgos.filter(h => h.estado === 'Cumple').length + (report.hallazgos.filter(h => h.estado === 'Cumple parcialmente').length * 0.5)) / (report.hallazgos.length || 1)) * 100);

  const approvedList = report.seccionesAprobadas && report.seccionesAprobadas.length > 0 
    ? report.seccionesAprobadas 
    : ['I. Datos Generales de la Empresa / Titular', 'II. Descripción de Procesos', 'V. Gestión y Manejo Operativo'];

  const observedList = report.seccionesObservadas && report.seccionesObservadas.length > 0
    ? report.seccionesObservadas
    : ['VI. Indicadores de Seguimiento (Observada)', 'VII. Cronograma y Presupuesto (Observada)'];

  // Table 2: Mapeo Regulatorio FODA & Riesgos OEFA / Sector
  const risks = report.riesgosRegulatorios && report.riesgosRegulatorios.length > 0
    ? report.riesgosRegulatorios
    : (report.swot?.debilidades || []).map((deb, idx) => ({
        id: `rr-fallback-${idx}`,
        seccionMinam: idx % 2 === 0 ? 'V. Gestión y Manejo Operativo' : 'VI. Indicadores de Seguimiento',
        hallazgoDebilidad: deb,
        riesgoRegulatorio: idx % 2 === 0 
          ? 'Posible observación o sanción por OEFA / Sector según D.L. 1278 y D.S. 014-2017-MINAM.' 
          : 'Requerimiento de subsanación de información por la autoridad ambiental competente.',
        gravedad: idx % 2 === 0 ? 'Crítica' as const : 'Media' as const,
        baseLegal: 'D.S. N.° 014-2017-MINAM'
      }));

  const fodaRows = risks.map((r, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
      <td style="border: 1px solid #d1d5db; padding: 7px 9px; font-weight: bold; color: #6C0053; vertical-align: top;">
        ${r.seccionMinam}
      </td>
      <td style="border: 1px solid #d1d5db; padding: 7px 9px; vertical-align: top; color: #1f2937;">
        ${r.hallazgoDebilidad}
      </td>
      <td style="border: 1px solid #d1d5db; padding: 7px 9px; vertical-align: top; color: #991b1b; font-size: 8.5pt;">
        <strong>[Riesgo Regulatorio]:</strong> ${r.riesgoRegulatorio}
      </td>
    </tr>
  `).join('');

  // Table 3: Plan de Acción Correctivo (Matriz Estratégica DO / DA)
  const actionPlan = report.planAccionCorrectivo && report.planAccionCorrectivo.length > 0
    ? report.planAccionCorrectivo
    : [
        {
          id: 'ca-f1',
          seccionMinam: 'V. Almacenamiento y Manejo',
          tipoEstrategia: 'DA (Supervivencia)' as const,
          hallazgoDebilidad: 'Almacén central temporal de RESPEL sin acreditación de contención.',
          accionCorrectiva: 'Implementar almacén central de RESPEL con dique de contención (>= 110% del contenedor mayor), rotulado CTI/NFPA 704 y kit antiderrames.',
          indicadorOperacional: '(N° de adecuaciones de almacén ejecutadas / N° programadas) * 100',
          presupuestoCronograma: 'Asignar en Sección VII / Meses 1-2'
        },
        {
          id: 'ca-f2',
          seccionMinam: 'IV. Minimización y Valorización',
          tipoEstrategia: 'DO (Reorientación)' as const,
          hallazgoDebilidad: 'Oportunidad de valorización de residuos aprovechables no articulada.',
          accionCorrectiva: 'Establecer convenio con EO-RS autorizada para valorización o reciclaje de residuos no peligrosos (cartón, plásticos).',
          indicadorOperacional: '(Tn de residuos valorizados / Tn total residuos generados) * 100',
          presupuestoCronograma: 'Costo neutro o ingreso por venta / Mes 3'
        }
      ];

  const actionPlanRows = actionPlan.map((act, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
      <td style="border: 1px solid #d1d5db; padding: 7px 8px; font-weight: bold; color: #6C0053; vertical-align: top;">
        ${act.seccionMinam}
      </td>
      <td style="border: 1px solid #d1d5db; padding: 7px 8px; text-align: center; vertical-align: top;">
        <span style="display: inline-block; padding: 3px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; background-color: ${act.tipoEstrategia.includes('DA') ? '#fee2e2' : '#dbeafe'}; color: ${act.tipoEstrategia.includes('DA') ? '#991b1b' : '#1e40af'};">
          ${act.tipoEstrategia}
        </span>
      </td>
      <td style="border: 1px solid #d1d5db; padding: 7px 8px; vertical-align: top; color: #1f2937;">
        ${act.accionCorrectiva}
      </td>
      <td style="border: 1px solid #d1d5db; padding: 7px 8px; vertical-align: top; font-family: monospace; font-size: 8pt; color: #065f46; background-color: #f0fdf4;">
        ${act.indicadorOperacional}
      </td>
      <td style="border: 1px solid #d1d5db; padding: 7px 8px; vertical-align: top; font-size: 8.5pt; font-weight: 600; color: #4b5563;">
        ${act.presupuestoCronograma}
      </td>
    </tr>
  `).join('');

  // 4. Conclusión Final y Recomendaciones (2 párrafos ejecutivos)
  const totalSections = (report.auditoriaSecciones && report.auditoriaSecciones.length > 0)
    ? report.auditoriaSecciones.length
    : Math.max(13, approvedList.length + observedList.length);

  const paragraph1 = report.conclusionParrafo1 || 
    `El Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRSNM) presentado por ${plan.company.razonSocial || 'la empresa titular'} presenta un nivel de cumplimiento estructural del ${pct}% respecto a los estándares de la Resolución Ministerial N.° 089-2023-MINAM y el Decreto Legislativo N.° 1278. Se han validado satisfactoriamente ${approvedList.length} de las ${totalSections} secciones obligatorias, evidenciándose una base técnica adecuada en la delimitación de actividades operativas. Sin embargo, persisten ${observedList.length} sección(es) con observaciones técnicas y omisiones que impiden emitir una conformidad plena sin subsanación previa.`;

  const paragraph2 = report.conclusionParrafo2 || 
    `Como prioridades inmediatas antes de su ingreso formal ante la autoridad sectorial y SIGERSOL-SNM, es indispensable: 1) Ejecutar las adecuaciones críticas de supervivencia (Estrategias DA) en el Almacén Central de RESPEL mediante la instalación de contención estanca (110%) y rotulado NFPA/CTI para blindar al titular ante multas de OEFA; y 2) Formalizar la matriz de indicadores operacionales con metas de valorización (Estrategias DO) y aprobación presupuestal formal en la Sección VII, garantizando así la aprobación técnica y la exoneración de requerimientos dilatorios.`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Técnico de Evaluación - PMMRSNM</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 15mm 18mm 18mm 18mm;
      font-size: 9.5pt;
      line-height: 1.45;
    }
    .header-box {
      text-align: center;
      border-bottom: 3px solid #6C0053;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header-box h2 {
      font-size: 9.5pt;
      color: #4b5563;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header-box h1 {
      font-size: 13.5pt;
      color: #6C0053;
      margin: 4px 0;
      text-transform: uppercase;
      font-weight: 800;
    }
    .header-box p {
      font-size: 8.5pt;
      color: #6b7280;
      margin: 2px 0 0 0;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #6C0053;
      border-bottom: 1.5px solid #d1d5db;
      padding-bottom: 3px;
      margin-top: 18px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .info-card {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
      font-size: 9pt;
    }
    .info-card p {
      margin: 0 0 6px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin: 10px 0 18px 0;
    }
    th {
      background-color: #6C0053;
      color: #ffffff;
      border: 1px solid #6C0053;
      padding: 6px 8px;
      text-align: left;
      font-size: 8.5pt;
    }
    .conclusion-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px 14px;
      margin-top: 8px;
      margin-bottom: 18px;
      font-size: 9pt;
      text-align: justify;
      line-height: 1.5;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 36px;
      text-align: center;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }
    .signature-line {
      border-top: 1.5px solid #4b5563;
      width: 200px;
      margin: 35px auto 6px auto;
    }
    .footer-copyright {
      margin-top: 32px;
      padding-top: 10px;
      border-top: 1px solid #d1d5db;
      text-align: center;
      font-size: 8pt;
      color: #6b7280;
    }
    .no-print-bar {
      background: #6C0053;
      color: white;
      padding: 10px 18px;
      text-align: center;
      font-size: 9.5pt;
      margin-bottom: 18px;
      border-radius: 8px;
    }
    .btn-print {
      background: #70BA74;
      color: white;
      border: none;
      padding: 7px 18px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 14px;
      font-size: 9.5pt;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>Informe Técnico Oficial conforme a la R.M. N.° 089-2023-MINAM y D.L. N.° 1278.</span>
    <button class="btn-print" onclick="window.print()">Guardar como PDF (Ctrl+P)</button>
  </div>

  <div class="header-box">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <div style="width: 75px; text-align: left;">
        <img src="${CASA_ALTAIR_LOGO_BASE64}" style="max-height: 55px; max-width: 75px; object-fit: contain; border-radius: 6px;" alt="Casa Altair" />
      </div>
      <div style="flex: 1; text-align: center;">
        <h2 style="font-size: 13pt; color: #4b5563; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">CASA ALTAIR</h2>
      </div>
      <div style="width: 75px;"></div>
    </div>
    <h1>INFORME TÉCNICO DE EVALUACIÓN - PMMRSNM</h1>
    <p>Auditoría Especializada bajo la R.M. N.° 089-2023-MINAM, D.L. N.° 1278, D.S. N.° 014-2017-MINAM y NTP 900.058:2019</p>
    <p>Fecha de Evaluación: ${report.fechaRevision} | Evaluador: ${report.revisor}</p>
  </div>

  <!-- 1. RESUMEN DE CUMPLIMIENTO ESTRUCTURAL (R.M. 089-2023-MINAM) -->
  <div class="section-title">1. Resumen de Cumplimiento Estructural (R.M. 089-2023-MINAM)</div>
  <div class="info-card">
    <p><strong>Titular / Establecimiento:</strong> ${plan.company.razonSocial || (report.documentoSubido?.detectedRazonSocial) || 'No especificado'} (RUC: ${plan.company.ruc || (report.documentoSubido?.detectedRuc) || 'No especificado'})</p>
    <p><strong>Documento Auditado:</strong> ${report.tituloPlan}</p>
    ${report.documentoSubido ? `<p><strong>Archivo Evaluado:</strong> ${report.documentoSubido.fileName} (${report.documentoSubido.fileSize}, Formato ${report.documentoSubido.fileType.toUpperCase()}) — Subido: ${report.documentoSubido.uploadedAt}</p>` : ''}
    <p>
      <strong>Estado de Cumplimiento General:</strong> 
      <strong style="color: ${pct >= 80 ? '#15803d' : pct >= 50 ? '#b45309' : '#b91c1c'}; font-size: 11pt;">
        ${pct}%
      </strong>
      <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 4px; font-size: 8.5pt; font-weight: bold; background-color: ${pct >= 80 ? '#dcfce7' : pct >= 50 ? '#fef3c7' : '#fee2e2'}; color: ${pct >= 80 ? '#166534' : pct >= 50 ? '#92400e' : '#991b1b'};">
        ${(report.etiquetaResultado) || (pct >= 80 ? 'CONFORME — PROCEDE APROBACIÓN' : pct >= 50 ? 'OBSERVADO — REQUIERE SUBSANACIÓN' : 'NO CONFORME — DESFAVORABLE')}
      </span>
    </p>
    <div style="margin-top: 6px;">
      <strong style="color: #166534;">Secciones Aprobadas (${approvedList.length} de ${totalSections} obligatorias):</strong>
      <ul style="margin: 3px 0 6px 18px; padding: 0; color: #166534;">
        ${approvedList.map(s => `<li>✓ ${s}</li>`).join('')}
      </ul>
    </div>
    <div style="margin-top: 4px;">
      <strong style="color: #991b1b;">Secciones Observadas o Ausentes (${observedList.length} de ${totalSections} obligatorias):</strong>
      <ul style="margin: 3px 0 0 18px; padding: 0; color: #991b1b;">
        ${observedList.map(s => `<li>⚠ ${s}</li>`).join('')}
      </ul>
    </div>
  </div>

  <!-- 2. AUDITORÍA DETALLADA Y MATRIZ FODA MAPEADA -->
  <div class="section-title">2. Auditoría Detallada y Matriz FODA Mapeada</div>
  <p style="font-size: 8.5pt; color: #4b5563; margin: 4px 0 6px 0;">
    Mapeo regulatorio obligatorio de Debilidades (D) y Amenazas (A) a las secciones de la R.M. N.° 089-2023-MINAM y evaluación del Riesgo Regulatorio (OEFA / Sector).
  </p>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Sección MINAM Afectada</th>
        <th style="width: 38%;">Hallazgo / Debilidad Detectada</th>
        <th style="width: 37%;">Riesgo Regulatorio (OEFA / Sector)</th>
      </tr>
    </thead>
    <tbody>
      ${fodaRows}
    </tbody>
  </table>

  <!-- 3. PLAN DE ACCIÓN CORRECTIVO (MATRIZ ESTRATÉGICA DO / DA) -->
  <div class="section-title" style="page-break-before: auto;">3. Plan de Acción Correctivo (Matriz Estratégica DO / DA)</div>
  <p style="font-size: 8.5pt; color: #4b5563; margin: 4px 0 6px 0;">
    Motor de Reglas Cruzadas: <strong>Estrategias DO</strong> (Reorientación para aprovechar oportunidades normativas y valorización) y <strong>Estrategias DA</strong> (Supervivencia para corregir faltas técnicas críticas y evitar multas).
  </p>
  <table>
    <thead>
      <tr>
        <th style="width: 17%;">Sección MINAM</th>
        <th style="width: 14%;">Tipo Estrategia (DO/DA)</th>
        <th style="width: 33%;">Acción Correctiva / Medida de Mitigación</th>
        <th style="width: 21%;">Indicador Operacional Muestral</th>
        <th style="width: 15%;">Presupuesto y Cronograma Sugerido</th>
      </tr>
    </thead>
    <tbody>
      ${actionPlanRows}
    </tbody>
  </table>

  <!-- 4. CONCLUSIÓN FINAL Y RECOMENDACIONES DE PRESENTACIÓN -->
  <div class="section-title">4. Conclusión Final y Recomendaciones de Presentación</div>
  <div class="conclusion-box">
    <p style="margin: 0 0 10px 0;">
      <strong>Dictamen Técnico y Estado de Cumplimiento:</strong><br />
      ${paragraph1}
    </p>
    <p style="margin: 0;">
      <strong>Prioridades Inmediatas antes del envío al Sector:</strong><br />
      ${paragraph2}
    </p>
  </div>

  <div class="signatures">
    <div>
      <div class="signature-line"></div>
      <strong>${report.revisor || 'Auditor Especialista Ambiental'}</strong>
      <div style="font-size: 8pt; color: #6b7280;">Auditor Especialista en Gestión de Residuos No Municipales</div>
    </div>
    <div>
      <div class="signature-line"></div>
      <strong>Dirección de Fiscalización y Control Ambiental</strong>
      <div style="font-size: 8pt; color: #6b7280;">Visto Bueno Técnico Institucional</div>
    </div>
  </div>

  <div class="footer-copyright">
    ${COPYRIGHT_TEXT}
  </div>
</body>
</html>`;
}

export function openPrintWindow(htmlContent: string, filename: string): void {
  // Create blob and download/open URL
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  // Attempt window.open first
  const newWin = window.open(blobUrl, '_blank');

  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
    // If popups are blocked by the iframe, download directly as an HTML file ready to print
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  }
}

export function downloadPrintableHtml(htmlContent: string, filename: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

export function downloadJsonFile(data: object, filename: string): boolean {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    return true;
  } catch (error) {
    console.error('Error al descargar archivo JSON:', error);
    return false;
  }
}

function drawPdfTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  startX: number,
  startY: number,
  totalWidth: number,
  checkPageBreak: (needed: number) => void
): number {
  if (!headers || headers.length === 0) return startY;

  let y = startY;
  const colCount = headers.length;
  const colWidths: number[] = [];
  const defaultColWidth = totalWidth / colCount;

  for (let c = 0; c < colCount; c++) {
    const h = (headers[c] || '').toLowerCase();
    if (h === 'n°' || h === 'no.' || h === 'n.' || h === 'n') {
      colWidths.push(Math.min(10, defaultColWidth));
    } else if (h.includes('código') || h.includes('periodo') || h.includes('categoría') || h.includes('unidades')) {
      colWidths.push(Math.max(16, defaultColWidth * 0.75));
    } else {
      colWidths.push(defaultColWidth);
    }
  }

  const currentTotal = colWidths.reduce((a, b) => a + b, 0);
  const scale = totalWidth / currentTotal;
  for (let c = 0; c < colCount; c++) {
    colWidths[c] = colWidths[c] * scale;
  }

  // Draw Header
  checkPageBreak(8);
  doc.setFillColor(108, 0, 83); // #6C0053
  doc.rect(startX, y, totalWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);

  let currentX = startX;
  for (let c = 0; c < colCount; c++) {
    const headerText = doc.splitTextToSize(headers[c] || '', colWidths[c] - 2);
    doc.text(headerText[0] || headers[c] || '', currentX + 1.5, y + 4.2);
    currentX += colWidths[c];
  }
  y += 6;

  // Draw Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 30, 30);

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    let maxLines = 1;
    for (let c = 0; c < colCount; c++) {
      const cellText = row[c] !== undefined && row[c] !== null ? String(row[c]) : '';
      const lines = doc.splitTextToSize(cellText, colWidths[c] - 2);
      if (lines.length > maxLines) maxLines = Math.min(3, lines.length);
    }
    const rowHeight = Math.max(5.5, maxLines * 3.2 + 2);

    checkPageBreak(rowHeight + 2);

    if (r % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(249, 250, 251); // #f9fafb
    }
    doc.rect(startX, y, totalWidth, rowHeight, 'F');

    doc.setDrawColor(220, 220, 220);
    doc.line(startX, y + rowHeight, startX + totalWidth, y + rowHeight);

    currentX = startX;
    for (let c = 0; c < colCount; c++) {
      const cellText = row[c] !== undefined && row[c] !== null ? String(row[c]) : '';
      const lines = doc.splitTextToSize(cellText, colWidths[c] - 2);
      for (let l = 0; l < Math.min(lines.length, maxLines); l++) {
        doc.text(lines[l], currentX + 1.5, y + 3.5 + (l * 3));
      }
      currentX += colWidths[c];
    }
    y += rowHeight;
  }

  return y;
}

export function downloadPlanPdf(rawPlan: PMMRSPlan, customFilename?: string): void {
  const plan = processPlanCuadros(rawPlan);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const safeName = (plan.company.razonSocial || 'Plan').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = customFilename || `PMMRS_${safeName}_2026.pdf`;
  
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  let pageNumber = 1;

  const addHeaderAndFooter = (page: number, customTitle?: string) => {
    // Header top bar
    doc.setFillColor(108, 0, 83); // #6C0053
    doc.rect(margin, 10, contentWidth, 1.2, 'F');
    
    // Top running text (pages 2+)
    if (page > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(108, 0, 83);
      doc.text(customTitle || (plan.company.razonSocial || 'PMMRS').toUpperCase(), margin, 8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('R.M. N.° 089-2023-MINAM', pageWidth - margin, 8.5, { align: 'right' });
    }

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      'Elaborado y diseñado por Casa Altair - Equilibria (casa_altair@equilibria360.com). Lima, Perú — Setiembre de 2026',
      margin,
      pageHeight - 8
    );
    doc.text(
      `Página ${page}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      addHeaderAndFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      y = margin + 5;
    }
  };

  // =========================================================================
  // HOJA 1: CARÁTULA OFICIAL
  // =========================================================================
  addHeaderAndFooter(1, 'Carátula');
  y = 25;

  if (plan.header?.logoUrl) {
    try {
      const format = (plan.header.logoUrl.includes('image/jpeg') || plan.header.logoUrl.includes('image/jpg')) ? 'JPEG' : 'PNG';
      doc.addImage(plan.header.logoUrl, format, (pageWidth / 2) - 12, y, 24, 24);
      y += 28;
    } catch {
      y += 10;
    }
  } else {
    y += 15;
  }

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99);
  doc.text((plan.header.razonSocialHeader || plan.company.razonSocial || 'EMPRESA TITULAR').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Subtitle category
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(112, 186, 116); // #70BA74
  doc.text('INSTRUMENTO TÉCNICO DE GESTIÓN AMBIENTAL', pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Big Document Title
  doc.setFontSize(15);
  doc.setTextColor(108, 0, 83);
  const titleLines = doc.splitTextToSize(plan.header.tituloDocumento || 'PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES', contentWidth - 20);
  for (const tLine of titleLines) {
    doc.text(tLine, pageWidth / 2, y, { align: 'center' });
    y += 6.5;
  }

  // Accent divider
  doc.setFillColor(108, 0, 83);
  doc.rect((pageWidth / 2) - 20, y + 2, 40, 1.2, 'F');
  y += 12;

  // Regulatory reference paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  const regLines = doc.splitTextToSize('Formulado conforme al contenido mínimo aprobado por la Resolución Ministerial N.° 089-2023-MINAM, en concordancia con el Decreto Legislativo N.° 1278 (Ley de Gestión Integral de Residuos Sólidos) y su Reglamento D.S. N.° 014-2017-MINAM.', contentWidth - 30);
  for (const rLine of regLines) {
    doc.text(rLine, pageWidth / 2, y, { align: 'center' });
    y += 4.5;
  }
  y += 8;

  // Company Summary Card
  doc.setFillColor(253, 242, 248); // #fdf2f8
  doc.setDrawColor(251, 207, 232); // #fbcfe8
  doc.roundedRect(margin + 5, y, contentWidth - 10, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(108, 0, 83);
  doc.text('DATOS DE IDENTIFICACIÓN DEL TITULAR', margin + 10, y + 6);

  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  let cardY = y + 13;
  doc.setFont('helvetica', 'bold'); doc.text('Empresa / Razón Social:', margin + 10, cardY);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.razonSocial || 'No especificado', margin + 46, cardY);
  cardY += 5.5;
  doc.setFont('helvetica', 'bold'); doc.text('R.U.C.:', margin + 10, cardY);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.ruc || 'No especificado', margin + 46, cardY);
  cardY += 5.5;
  doc.setFont('helvetica', 'bold'); doc.text('Establecimiento:', margin + 10, cardY);
  doc.setFont('helvetica', 'normal'); doc.text((plan.company.domicilio || 'No especificado').slice(0, 50), margin + 46, cardY);
  cardY += 5.5;
  doc.setFont('helvetica', 'bold'); doc.text('Ubicación:', margin + 10, cardY);
  doc.setFont('helvetica', 'normal'); doc.text(`${plan.company.distrito || ''}, ${plan.company.provincia || ''}, ${plan.company.departamento || ''}`, margin + 46, cardY);
  cardY += 5.5;
  doc.setFont('helvetica', 'bold'); doc.text('Actividad Económica:', margin + 10, cardY);
  doc.setFont('helvetica', 'normal'); doc.text((plan.company.actividadEconomica || plan.company.sector || 'Industrial').slice(0, 48), margin + 46, cardY);

  y += 56;

  // Metadata block at bottom of Cover Page
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  doc.text(`Elaborado por: ${plan.header.elaboradoPor || 'Responsable Técnico Ambiental'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(`Aprobado por: ${plan.header.aprobadoPor || plan.company.representanteLegal || 'Gerencia General'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Periodo: ${plan.header.version || '2026-2027'} | Fecha: ${plan.header.fechaEmision || new Date().toLocaleDateString('es-PE')}`, pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Lima, Perú', pageWidth / 2, y, { align: 'center' });

  // END OF PAGE 1 -> MOVE TO PAGE 2
  doc.addPage();
  pageNumber++;
  addHeaderAndFooter(pageNumber, 'PMMRS - DATOS GENERALES');
  y = margin + 5;

  // =========================================================================
  // HOJA 2: DATOS GENERALES DE LA EMPRESA Y RESUMEN NTP 900.058
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(108, 0, 83);
  doc.text('I. DATOS GENERALES DE LA EMPRESA Y DEL ESTABLECIMIENTO', margin, y);
  doc.setDrawColor(108, 0, 83);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 8;

  doc.setFillColor(248, 248, 250);
  doc.setDrawColor(215, 215, 225);
  doc.roundedRect(margin, y, contentWidth, 48, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  
  const col1 = margin + 4;
  const col2 = margin + (contentWidth / 2) + 2;
  let dy = y + 7;

  doc.setFont('helvetica', 'bold'); doc.text('Razón Social:', col1, dy);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.razonSocial || 'No especificado', col1 + 22, dy);
  doc.setFont('helvetica', 'bold'); doc.text('RUC:', col2, dy);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.ruc || 'No especificado', col2 + 10, dy);

  dy += 6;
  doc.setFont('helvetica', 'bold'); doc.text('Nombre Com.:', col1, dy);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.nombreComercial || 'No especificado', col1 + 22, dy);
  doc.setFont('helvetica', 'bold'); doc.text('Domicilio:', col2, dy);
  doc.setFont('helvetica', 'normal'); doc.text((plan.company.domicilio || 'No especificado').slice(0, 42), col2 + 16, dy);

  dy += 6;
  doc.setFont('helvetica', 'bold'); doc.text('Ubicación:', col1, dy);
  doc.setFont('helvetica', 'normal'); doc.text(`${plan.company.distrito || ''}, ${plan.company.provincia || ''}, ${plan.company.departamento || ''}`, col1 + 18, dy);
  doc.setFont('helvetica', 'bold'); doc.text('Representante:', col2, dy);
  doc.setFont('helvetica', 'normal'); doc.text(`${plan.company.representanteLegal || 'No especificado'} (DNI: ${plan.company.dniRepresentante || 'N/A'})`, col2 + 22, dy);

  dy += 6;
  doc.setFont('helvetica', 'bold'); doc.text('Actividad/CIIU:', col1, dy);
  doc.setFont('helvetica', 'normal'); doc.text((plan.company.actividadEconomica || 'Manufactura').slice(0, 38), col1 + 22, dy);
  doc.setFont('helvetica', 'bold'); doc.text('Personal / Turno:', col2, dy);
  doc.setFont('helvetica', 'normal'); doc.text(`${plan.company.numeroTrabajadores || 0} trab. | ${plan.company.horarioOperacion || 'Doble turno'}`, col2 + 25, dy);

  dy += 6;
  doc.setFont('helvetica', 'bold'); doc.text('Teléfono:', col1, dy);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.telefonoContacto || 'No especificado', col1 + 18, dy);
  doc.setFont('helvetica', 'bold'); doc.text('Correo:', col2, dy);
  doc.setFont('helvetica', 'normal'); doc.text(plan.company.correoContacto || 'No especificado', col2 + 16, dy);

  y += 58;

  // Waste Inventory Summary Table on Page 2
  const totalResiduosKg = plan.residuos.reduce((acc, curr) => acc + (Number(curr.generacionEstimadaKgMes) || 0), 0);
  const totalPeligrososKg = plan.residuos.filter(r => r.tipo === 'Peligroso').reduce((acc, curr) => acc + (Number(curr.generacionEstimadaKgMes) || 0), 0);
  const totalNoPeligrososKg = totalResiduosKg - totalPeligrososKg;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(108, 0, 83);
  doc.text('RESUMEN DE GENERACIÓN Y ALMACENAMIENTO DE RESIDUOS (NTP 900.058:2019)', margin, y);
  doc.setDrawColor(108, 0, 83);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  doc.text(`Generación Total Estimada: ${totalResiduosKg} kg/mes (No Peligrosos: ${totalNoPeligrososKg} kg/mes | Peligrosos: ${totalPeligrososKg} kg/mes)`, margin, y);
  y += 5;

  const wasteHeaders = ['N°', 'Tipo', 'Categoría / Descripción', 'Gen. Estimada', 'Color NTP 900.058', 'Destino Final / EO-RS'];
  const wasteRows = plan.residuos.map((res, i) => [
    String(i + 1),
    res.tipo,
    `${res.categoria}: ${res.descripcion}`.slice(0, 42),
    `${res.generacionEstimadaKgMes} kg/mes`,
    res.colorContenedorNtp.slice(0, 20),
    res.destinoFinal.slice(0, 24)
  ]);

  y = drawPdfTable(doc, wasteHeaders, wasteRows, margin, y, contentWidth, checkPageBreak);

  // END OF PAGE 2 -> MOVE TO PAGE 3
  doc.addPage();
  pageNumber++;
  addHeaderAndFooter(pageNumber, 'PMMRS - CAPÍTULOS TÉCNICOS');
  y = margin + 5;

  // =========================================================================
  // HOJA 3 EN ADELANTE: CAPÍTULOS TÉCNICOS (1 AL 13)
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(108, 0, 83);
  doc.text('II. CAPÍTULOS DEL PLAN DE MINIMIZACIÓN Y MANEJO (R.M. 089-2023-MINAM)', margin, y);
  doc.setDrawColor(108, 0, 83);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 8;

  for (const cap of plan.capitulos) {
    checkPageBreak(25);

    // Chapter Header
    doc.setFillColor(253, 242, 248); // #fdf2f8
    doc.rect(margin, y - 4, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(108, 0, 83);
    doc.text(cap.titulo.toUpperCase(), margin + 2, y + 0.8);
    y += 6.5;

    // Parse chapter content into text segments and tables
    const segments = parseMarkdownTableStrings(cap.contenido || '[Contenido pendiente de formulación]');

    for (const seg of segments) {
      if (seg.type === 'table' && seg.headers && seg.headers.length > 0) {
        y = drawPdfTable(doc, seg.headers, seg.rows || [], margin, y + 1, contentWidth, checkPageBreak);
        y += 4;
      } else {
        const paragraphs = seg.content.split('\n');
        for (const para of paragraphs) {
          const trimmed = para.trim();
          if (!trimmed) {
            y += 2;
            continue;
          }

          if (trimmed.startsWith('### ')) {
            // Cuadro title heading
            checkPageBreak(12);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(108, 0, 83);
            doc.text(trimmed.replace('### ', ''), margin, y);
            y += 4.5;
            continue;
          }

          if (trimmed.startsWith('> *') && trimmed.endsWith('*')) {
            // Skip redundant badge line
            continue;
          }

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.8);
          doc.setTextColor(30, 30, 30);

          const lines = doc.splitTextToSize(trimmed, contentWidth);
          for (const line of lines) {
            checkPageBreak(4.5);
            doc.text(line, margin, y);
            y += 3.8;
          }
          y += 1.5;
        }
      }
    }
    y += 4;
  }

  // Signatures block at end
  checkPageBreak(32);
  y += 8;
  const sigCol1 = margin + 20;
  const sigCol2 = margin + contentWidth - 65;

  doc.setDrawColor(120, 120, 120);
  doc.line(sigCol1, y, sigCol1 + 45, y);
  doc.line(sigCol2, y, sigCol2 + 45, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text(plan.header.elaboradoPor || 'Especialista Ambiental', sigCol1 + 22.5, y + 4, { align: 'center' });
  doc.text(plan.header.aprobadoPor || plan.company.representanteLegal || 'Gerencia General', sigCol2 + 22.5, y + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Elaborado por (Responsable Técnico)', sigCol1 + 22.5, y + 8, { align: 'center' });
  doc.text('Aprobado por (Representante Legal)', sigCol2 + 22.5, y + 8, { align: 'center' });

  addHeaderAndFooter(pageNumber);

  doc.save(filename);
}

export function downloadReviewReportPdf(report: ReviewReport, plan: PMMRSPlan, customFilename?: string): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const safeName = (report.documentoSubido?.detectedRazonSocial || plan.company.razonSocial || 'Plan').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = customFilename || `Informe_Tecnico_PMMRS_${safeName}_2026.pdf`;

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  let pageNumber = 1;

  const addHeaderAndFooter = () => {
    doc.setFillColor(108, 0, 83);
    doc.rect(margin, 10, contentWidth, 1.2, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      'Informe Técnico Oficial conforme a la R.M. N.° 089-2023-MINAM y D.L. N.° 1278',
      margin,
      pageHeight - 8
    );
    doc.text(
      `Página ${pageNumber}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      addHeaderAndFooter();
      doc.addPage();
      pageNumber++;
      y = margin + 5;
    }
  };

  addHeaderAndFooter();
  y = 18;

  // Header Box
  try {
    doc.addImage(CASA_ALTAIR_LOGO_BASE64, 'PNG', margin, y, 16, 16);
  } catch (err) {
    console.warn('Could not add Casa Altair logo to PDF:', err);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(80, 80, 80);
  doc.text('CASA ALTAIR', pageWidth / 2, y + 6, { align: 'center' });
  y += 7;

  doc.setFontSize(12.5);
  doc.setTextColor(108, 0, 83);
  doc.text('INFORME TÉCNICO DE EVALUACIÓN - PMMRSNM', pageWidth / 2, y + 5, { align: 'center' });
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Auditoría Especializada bajo la R.M. N.° 089-2023-MINAM, D.L. N.° 1278 y NTP 900.058:2019', pageWidth / 2, y + 4, { align: 'center' });
  y += 4;
  doc.text(`Fecha de Evaluación: ${report.fechaRevision || new Date().toISOString().split('T')[0]} | Evaluador: ${report.revisor || 'Auditor Especialista Ambiental'}`, pageWidth / 2, y + 4, { align: 'center' });
  y += 10;

  // --- 1. RESUMEN DE CUMPLIMIENTO ESTRUCTURAL ---
  const pct = report.porcentajeCumplimientoGeneral !== undefined 
    ? report.porcentajeCumplimientoGeneral 
    : Math.round(((report.hallazgos.filter(h => h.estado === 'Cumple').length + (report.hallazgos.filter(h => h.estado === 'Cumple parcialmente').length * 0.5)) / (report.hallazgos.length || 1)) * 100);

  const approvedList = report.seccionesAprobadas || [];
  const observedList = report.seccionesObservadas || [];
  const totalSections = (report.auditoriaSecciones && report.auditoriaSecciones.length > 0)
    ? report.auditoriaSecciones.length
    : Math.max(13, approvedList.length + observedList.length);

  doc.setFillColor(253, 242, 248);
  doc.setDrawColor(240, 200, 225);
  doc.roundedRect(margin, y, contentWidth, 36 + Math.min(20, (approvedList.length + observedList.length) * 3), 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(108, 0, 83);
  doc.text('1. RESUMEN DE CUMPLIMIENTO ESTRUCTURAL (R.M. 089-2023-MINAM)', margin + 4, y + 6);

  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  let ry = y + 12;

  const docRazon = report.documentoSubido?.detectedRazonSocial || plan.company.razonSocial || 'No especificado';
  const docRuc = report.documentoSubido?.detectedRuc || plan.company.ruc || 'No especificado';
  
  doc.setFont('helvetica', 'bold'); doc.text('Titular / Establecimiento:', margin + 4, ry);
  doc.setFont('helvetica', 'normal'); doc.text(`${docRazon} (RUC: ${docRuc})`, margin + 45, ry);

  ry += 4.5;
  doc.setFont('helvetica', 'bold'); doc.text('Plan Auditado:', margin + 4, ry);
  doc.setFont('helvetica', 'normal'); doc.text(report.tituloPlan || 'Plan de Minimización y Manejo de Residuos No Municipales', margin + 30, ry);

  const evalRes = getEvaluationResult(pct);

  ry += 4.5;
  doc.setFont('helvetica', 'bold'); doc.text('Estado de Cumplimiento:', margin + 4, ry);
  doc.setFont('helvetica', 'bold');
  if (evalRes.resultado === 'CONFORME') doc.setTextColor(21, 128, 61);
  else if (evalRes.resultado === 'OBSERVADO') doc.setTextColor(180, 83, 9);
  else doc.setTextColor(185, 28, 28);
  doc.text(`${pct}% de Cumplimiento — [${evalRes.label}]`, margin + 42, ry);

  ry += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text(`Secciones Aprobadas (${approvedList.length} de ${totalSections} obligatorias):`, margin + 4, ry);
  
  ry += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(30, 30, 30);
  const approvedSnippet = approvedList.slice(0, 4).join(', ') + (approvedList.length > 4 ? ` y ${approvedList.length - 4} más...` : '');
  doc.text(approvedSnippet || 'Ninguna', margin + 6, ry);

  ry += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text(`Secciones Observadas o Ausentes (${observedList.length} de ${totalSections} obligatorias):`, margin + 4, ry);

  ry += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(30, 30, 30);
  const observedSnippet = observedList.length > 0 ? (observedList.slice(0, 4).join(', ') + (observedList.length > 4 ? ` y ${observedList.length - 4} más...` : '')) : 'Ninguna (Cumplimiento Total)';
  doc.text(observedSnippet, margin + 6, ry);

  y += 42 + Math.min(20, (approvedList.length + observedList.length) * 3);

  // --- 2. AUDITORÍA DETALLADA Y MATRIZ FODA MAPEADA ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(108, 0, 83);
  doc.text('2. AUDITORÍA DETALLADA Y MATRIZ FODA MAPEADA (Riesgos OEFA / Sector)', margin, y);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 6;

  // Risk Table Header
  doc.setFillColor(108, 0, 83);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('Sección MINAM Afectada', margin + 2, y + 3.8);
  doc.text('Hallazgo / Debilidad Detectada', margin + 45, y + 3.8);
  doc.text('Riesgo Regulatorio (OEFA / Sector)', margin + 115, y + 3.8);
  y += 5.5;

  const risks = (report.riesgosRegulatorios && report.riesgosRegulatorios.length > 0) ? report.riesgosRegulatorios : [];
  risks.slice(0, 10).forEach((r, idx) => {
    checkPageBreak(9);
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, contentWidth, 8, 'F');
    }
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(108, 0, 83);
    doc.text(r.seccionMinam.slice(0, 22), margin + 2, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    const debLines = doc.splitTextToSize(r.hallazgoDebilidad, 66);
    doc.text(debLines.slice(0, 2), margin + 45, y + 3.2);

    doc.setTextColor(185, 28, 28);
    const riskLines = doc.splitTextToSize(`[Riesgo]: ${r.riesgoRegulatorio}`, 56);
    doc.text(riskLines.slice(0, 2), margin + 115, y + 3.2);

    y += 8;
  });
  y += 5;

  // --- 3. PLAN DE ACCIÓN CORRECTIVO (MATRIZ DO / DA) ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(108, 0, 83);
  doc.text('3. PLAN DE ACCIÓN CORRECTIVO (MATRIZ ESTRATÉGICA DO / DA)', margin, y);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 6;

  // Action Table Header
  doc.setFillColor(108, 0, 83);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('Sección MINAM', margin + 2, y + 3.8);
  doc.text('Estrategia', margin + 40, y + 3.8);
  doc.text('Acción Correctiva / Mitigación', margin + 65, y + 3.8);
  doc.text('Presupuesto / Cronograma', margin + 135, y + 3.8);
  y += 5.5;

  const actions = (report.planAccionCorrectivo && report.planAccionCorrectivo.length > 0) ? report.planAccionCorrectivo : [];
  actions.slice(0, 8).forEach((act, idx) => {
    checkPageBreak(9);
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, contentWidth, 8, 'F');
    }
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(108, 0, 83);
    doc.text(act.seccionMinam.slice(0, 20), margin + 2, y + 3.5);

    if (act.tipoEstrategia.includes('DA')) {
      doc.setTextColor(185, 28, 28);
    } else {
      doc.setTextColor(30, 64, 175);
    }
    doc.text(act.tipoEstrategia.slice(0, 16), margin + 40, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    const actLines = doc.splitTextToSize(act.accionCorrectiva, 66);
    doc.text(actLines.slice(0, 2), margin + 65, y + 3.2);

    doc.setTextColor(80, 80, 80);
    doc.text(act.presupuestoCronograma.slice(0, 25), margin + 135, y + 3.5);

    y += 8;
  });
  y += 5;

  // --- 4. CONCLUSIONES Y DICTAMEN ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(108, 0, 83);
  doc.text('4. CONCLUSIÓN FINAL Y RECOMENDACIONES DE PRESENTACIÓN', margin, y);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);

  const p1Text = report.conclusionParrafo1 || `El Plan de Minimización y Manejo de Residuos Sólidos No Municipales presentado por ${docRazon} presenta un nivel de cumplimiento del ${pct}% respecto a los estándares de la R.M. N.° 089-2023-MINAM y D.L. N.° 1278. Se han validado satisfactoriamente ${approvedList.length} de las ${totalSections} secciones obligatorias.`;
  const p1Lines = doc.splitTextToSize(p1Text, contentWidth);
  doc.text(p1Lines, margin, y);
  y += (p1Lines.length * 3.6) + 3;

  const p2Text = report.conclusionParrafo2 || 'Dictamen Técnico: Cumplimiento conforme de las secciones normativas evaluadas. Se recomienda formalizar la presentación ante la plataforma oficial SIGERSOL-SNM del MINAM.';
  const p2Lines = doc.splitTextToSize(p2Text, contentWidth);
  doc.text(p2Lines, margin, y);
  y += (p2Lines.length * 3.6) + 8;

  // Signatures
  checkPageBreak(25);
  const sigCol1 = margin + 20;
  const sigCol2 = margin + contentWidth - 65;

  doc.setDrawColor(120, 120, 120);
  doc.line(sigCol1, y, sigCol1 + 45, y);
  doc.line(sigCol2, y, sigCol2 + 45, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text(report.revisor || 'Auditor Especialista Ambiental', sigCol1 + 22.5, y + 4, { align: 'center' });
  doc.text('Dirección de Fiscalización y Control', sigCol2 + 22.5, y + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Auditor Especialista en Gestión de Residuos', sigCol1 + 22.5, y + 8, { align: 'center' });
  doc.text('Visto Bueno Técnico Institucional', sigCol2 + 22.5, y + 8, { align: 'center' });

  addHeaderAndFooter();

  doc.save(filename);
}
