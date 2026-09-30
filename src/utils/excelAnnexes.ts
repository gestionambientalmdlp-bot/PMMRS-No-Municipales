import * as XLSX from 'xlsx';

export interface AnnexConfig {
  numeroAnexo: number;
  capituloNumero: number;
  tituloAnexo: string;
  nombreArchivo: string;
  descripcion: string;
  columnas: string[];
  colWidths: number[];
  filasEjemplo: (string | number)[][];
  notas?: string[];
}

export const ANNEXES_RM_089: Record<number, AnnexConfig> = {
  3: {
    numeroAnexo: 3,
    capituloNumero: 4,
    tituloAnexo: 'Anexo N° 3: Clasificación de los Residuos Sólidos por sus características y ámbito de gestión (Ejemplo)',
    nombreArchivo: 'Plantilla_RM089_Anexo_3_Clasificacion_Residuos.xlsx',
    descripcion: 'Inventario oficial de clasificación de residuos sólidos según la R.M. N.° 089-2023-MINAM (Pág. 26). Detalla la etapa, proceso generador, residuo, característica de peligrosidad y doble clasificación: por su manejo (Peligrosos / No peligrosos) y por su gestión (Municipal / No Municipal).',
    columnas: [
      'N°',
      'Etapa',
      'Proceso / Actividad generadora',
      'Residuo',
      'Característica de peligrosidad',
      'Clasificación por su manejo',
      'Clasificación por su gestión'
    ],
    colWidths: [6, 26, 32, 28, 28, 24, 24],
    filasEjemplo: [
      [1, 'Etapa de operación y mantenimiento', 'Urdido, tejeduría y acabado', 'Conos y tubos de cartón prensado', 'No aplica', 'No peligrosos', 'No Municipal'],
      [2, 'Etapa de operación y mantenimiento', 'Corte y confección industrial', 'Retazos de hilado y telares limpios', 'No aplica', 'No peligrosos', 'No Municipal'],
      [3, 'Etapa de operación y mantenimiento', 'Mantenimiento electromecánico de maquinaria', 'Aceite lubricante usado de motores', 'Toxicidad / Inflamabilidad', 'Peligrosos', 'No Municipal'],
      [4, 'Etapa de operación y mantenimiento', 'Línea de tintorería y acabado textil', 'Trapos y paños impregnados con solventes', 'Inflamabilidad / Toxicidad', 'Peligrosos', 'No Municipal'],
      [5, 'Etapa de operación y mantenimiento', 'Embalaje, paletizado y despacho', 'Láminas de plástico stretch film', 'No aplica', 'No peligrosos', 'No Municipal'],
      [6, 'Etapa de operación y mantenimiento', 'Comedor laboral y cafetín', 'Restos de preparación de alimentos y comida', 'No aplica', 'No peligrosos', 'Municipal'],
      [7, 'Etapa de operación y mantenimiento', 'Servicios higiénicos y vestuarios', 'Papel higiénico y residuos sanitarios', 'No aplica', 'No peligrosos', 'Municipal'],
      [8, 'Etapa de construcción', 'Obras civiles e instalaciones complementarias', 'Excedentes de obra y desmonte limpio', 'No aplica', 'No peligrosos', 'No Municipal']
    ],
    notas: [
      '• (1) Etapa: Señalar la etapa en la que se encuentra el proyecto o la actividad en curso: i) Etapa de planificación, ii) Etapa de construcción, iii) Etapa de operación y mantenimiento, iv) Etapa de cierre.',
      '• (2) Proceso / Actividad generadora: En este rubro se describe la actividad o el proceso de los cuales se generan los residuos sólidos (ej. Movimiento de tierras, Construcción de infraestructura vial, Demolición, Mantenimiento, Operación, etc.).',
      '• (3) Residuo: Precisar el residuo que se genera o generará en el proceso o actividad (ej. Excedente de obra, Escombros, Aceites usados, Trapos contaminados, Retazos de cartón/plástico, etc.).',
      '• (4) Característica de peligrosidad: Autocombustibilidad, Explosividad, Corrosividad, Reactividad, Toxicidad, Radioactividad, Patogenicidad (Anexo IV D.S. 014-2017-MINAM). En caso de residuos no peligrosos, indicar "No aplica".',
      '• (5) Clasificación por su manejo: Peligrosos / No peligrosos.',
      '• (6) Clasificación por su gestión: Municipal / No Municipal.'
    ]
  },
  4: {
    numeroAnexo: 4,
    capituloNumero: 5,
    tituloAnexo: 'Anexo N° 4: Cuadro estimado de la cantidad de residuos sólidos de bienes priorizados (Ejemplo)',
    nombreArchivo: 'Plantilla_RM089_Anexo_4_Bienes_Priorizados.xlsx',
    descripcion: 'Cuadro oficial de cuantificación de residuos sólidos de bienes priorizados según la R.M. N.° 089-2023-MINAM (Pág. 27). Especifica régimen especial (RAEE, NFU), categoría asignada, unidades, masa estimada en kilogramos y período de generación.',
    columnas: [
      'N°',
      'Residuos sólidos del bien priorizado',
      'Régimen especial al que pertenece',
      'Categoría',
      'Unidades',
      'Masa (kg)',
      'Período'
    ],
    colWidths: [6, 32, 26, 32, 16, 18, 16],
    filasEjemplo: [
      [1, 'Llantas de camión fuera de uso', 'Régimen Especial de NFU', 'Categoría B (Aro >= 25 pulg.)', 20, 1500.00, 'Mensual'],
      [2, 'Llantas de camioneta y montacargas', 'Régimen Especial de NFU', 'Categoría A (Aro < 25 pulg.)', 10, 534.00, 'Anual'],
      [3, 'Paneles solares fotovoltaicos en desuso', 'Régimen Especial de RAEE', 'Categoría 11 (Paneles fotovoltaicos)', 5, 625.00, 'Semestral'],
      [4, 'Refrigeradoras y equipos de enfriamiento', 'Régimen Especial de RAEE', 'Categoría 1 (Grandes electrodomésticos)', 1, 1253.00, 'Anual'],
      [5, 'Computadoras, laptops y servidores', 'Régimen Especial de RAEE', 'Categoría 3 (Equipos de informática y telecomunicaciones)', 3, 3258.00, 'Anual'],
      [6, 'Luminarias y tubos fluorescentes', 'Régimen Especial de RAEE', 'Categoría 5 (Aparatos de alumbrado)', 40, 15.00, 'Mensual'],
      [7, 'Baterías de plomo-ácido de montacargas', 'Régimen de Bienes Priorizados', 'Baterías industriales y acumuladores', 4, 180.00, 'Semestral']
    ],
    notas: [
      '• (1) Residuos sólidos del bien priorizado: Se detallan los residuos sólidos del bien priorizado.',
      '• (2) Régimen especial: Se debe colocar el Régimen especial al que pertenece, pudiendo seleccionar entre los aprobados (Régimen Especial de RAEE y Régimen Especial de NFU). En caso de aprobarse otros regímenes, considerarlo de acuerdo a su normativa.',
      '• (3) Para el caso del Régimen Especial de RAEE, consignar la categoría correspondiente: Cat 1: Grandes electrodomésticos | Cat 2: Pequeños electrodomésticos | Cat 3: Equipos de informática y telecomunicaciones | Cat 4: Aparatos electrónicos de consumo | Cat 5: Aparatos de alumbrado | Cat 6: Herramientas eléctricas y electrónicas | Cat 7: Juguetes o equipos deportivos y de tiempo libre | Cat 8: Aparatos médicos y equipos de laboratorio clínico | Cat 9: Instrumentos de vigilancia y control | Cat 10: Máquinas expendedoras | Cat 11: Paneles fotovoltaicos.',
      '• (3) Para el caso del Régimen Especial de NFU, consignar la categoría correspondiente: Categoría A: Neumáticos con aro inferior a 25 pulgadas | Categoría B: Neumáticos con aro igual o superior a 25 pulgadas.',
      '• (4) Unidades: Considerar las unidades estimadas de residuos generados, sin considerar las unidades de medida de masa.',
      '• (5) Masa (kg): Considerar la unidad de medida de masa en kilogramos.',
      '• (6) Período: Considerar el período de tiempo en el cual se estima la generación del residuo sólido del bien priorizado (Mensual / Trimestral / Semestral / Anual).'
    ]
  },
  6: {
    numeroAnexo: 6,
    capituloNumero: 6,
    tituloAnexo: 'Anexo N° 6: Cuadro estimado del volumen y cantidad de residuos sólidos a generarse (Resumido por etapas) (Ejemplo)',
    nombreArchivo: 'Plantilla_RM089_Anexo_6_Generacion_Por_Etapas.xlsx',
    descripcion: 'Estimación técnica oficial del volumen y cantidad de residuos sólidos desglosados por etapas del proyecto (R.M. N.° 089-2023-MINAM, Pág. 29).',
    columnas: [
      'N°',
      'Etapas del proyecto',
      'Características del RRSS',
      'Por su Gestión',
      'Volumen (m³, l), unidad o masa (kg, t) / mes'
    ],
    colWidths: [6, 28, 24, 24, 34],
    filasEjemplo: [
      [1, 'Planificación', 'No peligrosos', 'No municipal', '0.2 m³ / mes (20 kg/mes)'],
      [2, 'Planificación', 'Peligrosos', 'No municipal', '0.05 m³ / mes (5 kg/mes)'],
      [3, 'Construcción', 'No peligrosos', 'No municipal', '4.5 m³ / mes (420 kg/mes)'],
      [4, 'Construcción', 'No peligrosos', 'Similar al Municipal', '1.2 m³ / mes (180 kg/mes)'],
      [5, 'Construcción', 'Peligrosos', 'No municipal', '0.3 m³ / mes (50 kg/mes)'],
      [6, 'Operación y Mantenimiento', 'No peligrosos', 'No municipal', '12.5 m³ / mes (1,810 kg/mes)'],
      [7, 'Operación y Mantenimiento', 'No peligrosos', 'Similar al Municipal', '6.0 m³ / mes (810 kg/mes)'],
      [8, 'Operación y Mantenimiento', 'Peligrosos', 'No municipal', '1.5 m³ / mes (240 kg/mes)'],
      [9, 'Cierre / Abandono', 'No peligrosos', 'No municipal', '3.0 m³ / mes (350 kg/mes)'],
      [10, 'Cierre / Abandono', 'Peligrosos', 'No municipal', '0.4 m³ / mes (60 kg/mes)']
    ],
    notas: [
      '• Etapas del proyecto: Planificación, Construcción, Operación y Mantenimiento, Cierre / Abandono.',
      '• Características del RRSS: No peligrosos, Peligrosos.',
      '• Por su Gestión: No municipal, Similar al Municipal.',
      '• Volumen / Masa mensual: Expresar en metros cúbicos (m³), litros (l), unidades o masa (kg, t) por mes.'
    ]
  },
  7: {
    numeroAnexo: 7,
    capituloNumero: 7,
    tituloAnexo: 'Anexo N° 7: Cuadro estimado del volumen y cantidad de residuos sólidos a generarse (Por actividad generadora) (Ejemplo)',
    nombreArchivo: 'Plantilla_RM089_Anexo_7_Generacion_Por_Actividad.xlsx',
    descripcion: 'Cuantificación pormenorizada del volumen y masa por cada actividad generadora específica según la R.M. N.° 089-2023-MINAM (Pág. 30), asociando el código oficial del residuo (Anexos III o V del Reglamento LGIRS - Convenio de Basilea).',
    columnas: [
      'N°',
      'Clasificación de residuos sólidos',
      'Residuos sólidos',
      'Código del residuo sólido',
      'Proceso / Actividad generadora',
      'Volumen (m³, l), unidad o masa (kg, t) / mes'
    ],
    colWidths: [6, 28, 28, 22, 32, 32],
    filasEjemplo: [
      [1, 'No peligroso - Similar al municipal', 'Restos de comida, cáscaras de frutas', 'NA', 'Consumo del personal de obra y comedor', '600 kg / mes'],
      [2, 'No peligroso - Similar al municipal', 'Papel, sobres de papel, cajas de cartón', 'NA', 'Gestión administrativa y oficinas', '850 kg / mes'],
      [3, 'No peligroso - No Municipal', 'Retazos de madera, parihuelas rotas', 'NA', 'Desembalaje y almacenamiento de insumos', '420 kg / mes'],
      [4, 'No peligroso - No Municipal', 'Retazos de tejido, hilados y mermas', 'NA', 'Sala de corte y tejeduría activa', '720 kg / mes'],
      [5, 'No peligroso - No Municipal', 'Envases plásticos y láminas de film stretch', 'NA', 'Embalaje de productos terminados', '240 kg / mes'],
      [6, 'Peligrosos - No Municipal', 'Aceite usado y filtros de aceite', 'B0190', 'Mantenimiento de maquinaria y motores', '150 kg / mes'],
      [7, 'Peligrosos - No Municipal', 'Trapos y guaipe con hidrocarburos/solventes', 'A4140', 'Limpieza y desengrase de piezas', '90 kg / mes'],
      [8, 'Peligrosos - No Municipal', 'Fluorescentes y focos ahorradores', 'A1030', 'Mantenimiento del sistema de iluminación', '15 kg / mes'],
      [9, 'Peligrosos - No Municipal', 'Baterías fuera de uso', 'A1160', 'Operación de vehículos y montacargas', '35 kg / mes']
    ],
    notas: [
      '• Clasificación: No peligroso (Similar al municipal / No Municipal), Peligrosos (No Municipal).',
      '• Residuos sólidos: Denominación técnica precisa del residuo generado.',
      '• Código del residuo sólido: Asignación del código de acuerdo con lo establecido en los Anexos III o V del Reglamento de la LGIRS (D.S. 014-2017-MINAM), recogido del Convenio de Basilea (ej. A4140, B0190, A1030) o "NA" para residuos no peligrosos.',
      '• Proceso/Actividad generadora: Identificar el proceso operativo, taller, línea o servicio de origen.',
      '• Volumen / Cantidad: Expresar en metros cúbicos (m³), litros (l), unidades o masa (kg, t) por mes.'
    ]
  },
  9: {
    numeroAnexo: 9,
    capituloNumero: 9,
    tituloAnexo: 'Anexo N° 9: Análisis de alternativas para uso de insumos o materias primas',
    nombreArchivo: 'Plantilla_RM089_Anexo_9_Analisis_Alternativas_Insumos.xlsx',
    descripcion: 'Matriz comparativa de insumos y materias primas según la R.M. N.° 089-2023-MINAM (Pág. 32). Evalúa peligrosidad, disponibilidad local, costo de manejo, uso especial y selección de la mejor alternativa ecoeficiente.',
    columnas: [
      'N°',
      'Proceso / Actividad / Insumo analizado',
      'Alternativa',
      'Insumo o Materia Prima',
      'Peligroso (SI/NO)',
      'Peligrosidad',
      'Disponible en el mercado local (Si/No)',
      'Costos para el manejo del residuo',
      'Uso especial',
      'Alternativa seleccionada'
    ],
    colWidths: [6, 28, 16, 26, 16, 26, 24, 22, 22, 28],
    filasEjemplo: [
      [1, 'Lavado y mantenimiento mecánico', 'Alternativa 1', 'Solventes clorados derivados de petróleo', 'SI', 'Tóxico, inflamable', 'Si', 'Altos', 'No', 'No, por altos costos y riesgo a la salud'],
      [2, 'Lavado y mantenimiento mecánico', 'Alternativa 2', 'Desengrasante biodegradable de base acuosa', 'NO', 'No peligroso / inocuo', 'Si', 'Bajos', 'No', 'SI, seleccionada por inocuidad y ahorro'],
      [3, 'Línea de devanado y enconado textil', 'Alternativa 1', 'Conos y tubos de cartón desechables', 'NO', 'Inerte (Genera alto volumen)', 'Si', 'Medio', 'No', 'No, genera excesivo volumen de residuo'],
      [4, 'Línea de devanado y enconado textil', 'Alternativa 2', 'Bobinas plásticas rígidas retornables', 'NO', 'Inerte (Reutilizable)', 'Si', 'Bajos', 'Logística inversa', 'SI, seleccionada por economía circular'],
      [5, 'Embalaje y sujeción de carga', 'Alternativa 1', 'Stretch film plástico virgen desechable', 'NO', 'No peligroso', 'Si', 'Medio', 'No', 'No, genera residuo plástico de un solo uso'],
      [6, 'Embalaje y sujeción de carga', 'Alternativa 2', 'Mallas elásticas y zunchos textiles reutilizables', 'NO', 'No peligroso', 'Si', 'Bajos', 'Reutilización 50 ciclos', 'SI, seleccionada por reducción del 45%']
    ],
    notas: [
      '• Peligroso: Indicar SI o NO.',
      '• Peligrosidad: En caso sea peligroso señalar si es: corrosivo, reactivo, explosivo, tóxico, inflamable, infeccioso o radiactivo.',
      '• Disponible en el mercado local: Indicar Si o No.',
      '• Costos para el manejo del residuo: Bajo / Medio / Alto.',
      '• Uso especial: Indicar si el insumo requiere condiciones operativas particulares.',
      '• Alternativa seleccionada: Indicar la justificación técnica, ambiental y económica de la alternativa elegida.'
    ]
  },
  11: {
    numeroAnexo: 11,
    capituloNumero: 11,
    tituloAnexo: 'Anexo N° 11: Cuadro resumen de medidas ambientales y presupuesto para la implementación del PMMRS',
    nombreArchivo: 'Plantilla_RM089_Anexo_11_Medidas_Presupuesto.xlsx',
    descripcion: 'Estructura oficial del cuadro resumen de medidas ambientales y presupuesto según la R.M. N.° 089-2023-MINAM (Pág. 34). Consolida etapa, actividad, impacto ambiental, compromiso, presupuesto (S/), responsable, plazos e indicadores.',
    columnas: [
      'N°',
      'Etapa',
      'Actividad',
      'Impacto',
      'Obligación / Compromiso ambiental',
      'Presupuesto (S/)',
      'Responsable',
      'Plazo de implementación',
      'Fecha o frecuencia',
      'Indicador a ser monitoreado'
    ],
    colWidths: [6, 22, 30, 26, 32, 18, 24, 20, 18, 28],
    filasEjemplo: [
      [1, 'Operación y mantenimiento', 'Recolección, transporte y celda de seguridad de RESPEL', 'Contaminación potencial de suelo y agua', 'Entrega obligatoria exclusiva a EO-RS autorizadas', 12800.00, 'Jefe de HSEQ / EO-RS', '12 meses', 'Trimestral', 'Manifiestos MMRP registrados en SIGERSOL'],
      [2, 'Operación y mantenimiento', 'Recojo, pesaje y valorización de residuos aprovechables', 'Agotamiento de rellenos sanitarios', 'Priorizar valorización material y reciclaje', 8400.00, 'Jefe de HSEQ / Recicla Perú', '12 meses', 'Quincenal', 'Certificados de valorización emitidos'],
      [3, 'Operación y mantenimiento', 'Mantenimiento del ATRP y verificación de diques estancos', 'Fugas y derrames de aceites/solventes', 'Mantenimiento preventivo e impermeabilización', 6500.00, 'Jefe de Mantenimiento', 'Mes 2 y Mes 8', 'Semestral', 'Acta de inspección técnica de ATRP'],
      [4, 'Operación y mantenimiento', 'Reposición de kits antiderrames de 55 gal y extintores', 'Emergencias químicas y amagos de incendio', 'Disponibilidad permanente de insumos de contingencia', 3800.00, 'Brigada de Emergencias', 'Mes 1 y Mes 6', 'Semestral', 'Checklist de inspección mensual de kits'],
      [5, 'Operación y mantenimiento', 'Renovación de estaciones de acopio bajo NTP 900.058:2019', 'Mezcla y contaminación cruzada de residuos', 'Segregación en origen con código de colores', 5100.00, 'Supervisor Ambiental', 'Mes 1', 'Anual', '100% de estaciones conformes auditadas'],
      [6, 'Operación y mantenimiento', 'Programa anual de capacitaciones y simulacros', 'Inadecuada manipulación y accidentes con RESPEL', 'Capacitación al 100% del personal operativo', 4400.00, 'Especialista HSEQ', 'Mes 3, 6, 9 y 11', 'Trimestral', 'Registro de asistencia y evaluaciones >= 85%'],
      [7, 'Operación y mantenimiento', 'Estudio de caracterización anual y balance de masa', 'Desconocimiento de tasas de generación', 'Actualización de línea base y metas de ecoeficiencia', 4000.00, 'Consultor Ambiental CIP', 'Mes 11', 'Anual', 'Informe técnico de caracterización emitido']
    ],
    notas: [
      '• Etapa: Señalar la etapa correspondiente (Planificación, Construcción, Cierre de obra, Operación y mantenimiento, Cierre / Abandono).',
      '• Presupuesto: Consignar montos expresados en moneda nacional Soles (S/).',
      '• Responsable: Cargo del personal asignado para el cumplimiento de la medida.',
      '• Indicador a ser monitoreado: Métrica cuantitativa o evidencia auditable que garantice el cumplimiento del compromiso.'
    ]
  }
};

/**
 * Generates and triggers download of an official Excel template for the specified Annex
 */
export function generateAnnexExcelTemplate(anexoNumero: number, razonSocial?: string): boolean {
  const config = ANNEXES_RM_089[anexoNumero];
  if (!config) {
    console.error(`Anexo ${anexoNumero} no configurado.`);
    return false;
  }

  try {
    const wb = XLSX.utils.book_new();

    // Prepare sheet data:
    // Row 0: Title banner
    // Row 1: Subtitle / Normative Reference
    // Row 2: Company info
    // Row 3: Blank separator
    // Row 4: Column Headers
    // Row 5+: Sample Rows
    const companyName = (razonSocial || 'EMPRESA TITULAR').toUpperCase();
    const sheetData: any[][] = [
      [config.tituloAnexo.toUpperCase()],
      ['Resolución Ministerial N.° 089-2023-MINAM | Decreto Legislativo N.° 1278'],
      [`TITULAR / EMPRESA: ${companyName} | FECHA: ${new Date().toLocaleDateString('es-PE')}`],
      [], // blank line
      config.columnas,
      ...config.filasEjemplo
    ];

    // If official notes exist, append them as guide at the bottom
    if (config.notas && config.notas.length > 0) {
      sheetData.push([]);
      sheetData.push(['NOTAS Y GUÍA DE LLENADO OFICIAL (R.M. N.° 089-2023-MINAM):']);
      for (const nota of config.notas) {
        sheetData.push([nota]);
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths
    ws['!cols'] = config.colWidths.map(w => ({ wch: w }));

    // Set merge for the top header rows to look professional
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: config.columnas.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: config.columnas.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: config.columnas.length - 1 } }
    ];

    const sheetName = `Anexo ${config.numeroAnexo}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, config.nombreArchivo);
    return true;
  } catch (err) {
    console.error('Error al generar plantilla Excel:', err);
    return false;
  }
}

export interface ParsedExcelResult {
  headers: string[];
  rows: string[][];
  rowCount: number;
  columnCount: number;
  markdownTable: string;
  sheetName: string;
  fileName: string;
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) file into exact rows, columns, and a clean Markdown table.
 * Crucial: Does NOT summarize or convert to narrative text.
 */
export async function parseExcelToMarkdownTable(file: File): Promise<ParsedExcelResult> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('El archivo Excel no contiene hojas de cálculo.');
  }

  const ws = wb.Sheets[firstSheetName];
  // Read as 2D array of strings or raw values
  const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: '' });

  if (!rawData || rawData.length === 0) {
    throw new Error('La hoja de cálculo está vacía.');
  }

  // Find the header row:
  // Usually rows 0-3 may have titles, metadata or notes (e.g. "TITULAR / EMPRESA: ...", "Nota: ...").
  // The header row is identified as the row with the most non-empty columns, or the first row with >= 3 non-empty cells
  // that does not start with phrases like 'RESOLUCIÓN', 'TITULAR', 'NOTA', or 'PLAN DE'.
  let headerIndex = 0;
  let maxColsFound = 0;

  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    const row = rawData[i] || [];
    const firstCell = String(row[0] || '').trim().toUpperCase();
    // Skip banner/metadata/note rows if they occupy a single merged cell
    if (firstCell.startsWith('RESOLUCIÓN') || firstCell.startsWith('RESOLUCION') || firstCell.startsWith('TITULAR') || firstCell.startsWith('NOTA:') || firstCell.startsWith('GUÍA:')) {
      continue;
    }

    const nonEmpties = row.filter((cell: any) => String(cell || '').trim() !== '').length;
    if (nonEmpties >= 3 && nonEmpties > maxColsFound) {
      maxColsFound = nonEmpties;
      headerIndex = i;
    }
  }

  const rawHeaders = rawData[headerIndex] || [];
  // Find maximum column index that has a non-empty header or cell
  let maxCol = rawHeaders.length;
  while (maxCol > 0 && String(rawHeaders[maxCol - 1] || '').trim() === '') {
    maxCol--;
  }
  if (maxCol === 0) maxCol = rawHeaders.length || 1;

  const headers = rawHeaders.slice(0, maxCol).map((h: any, idx: number) => {
    const val = String(h || '').trim();
    return val || `Columna ${idx + 1}`;
  });

  const rawRows = rawData.slice(headerIndex + 1);
  const rows: string[][] = [];

  for (const r of rawRows) {
    // Check if row has any non-empty data
    const nonEmpties = r.filter((cell: any) => String(cell || '').trim() !== '').length;
    if (nonEmpties === 0) continue;

    // Check if row is a trailing note, comment, or guidance text added at the bottom
    const firstCell = String(r[0] || '').trim().toUpperCase();
    if (
      firstCell.startsWith('NOTA') || 
      firstCell.startsWith('OBSERVACIÓN') || 
      firstCell.startsWith('OBSERVACION') ||
      firstCell.startsWith('GUÍA') ||
      firstCell.startsWith('GUIA') ||
      firstCell.startsWith('FUENTE') ||
      firstCell.startsWith('•') ||
      firstCell.startsWith('*') ||
      (nonEmpties === 1 && headers.length > 2 && (firstCell.includes('NOTA') || firstCell.includes('GUÍA') || firstCell.includes('ETAPA') || firstCell.includes('RÉGIMEN') || firstCell.includes('REGIMEN') || firstCell.includes('MINAM')))
    ) {
      continue;
    }

    const rowCells: string[] = [];
    for (let c = 0; c < headers.length; c++) {
      const cellVal = r[c] !== undefined && r[c] !== null ? String(r[c]).trim() : '';
      // Clean up internal newlines or pipes to preserve markdown formatting
      const sanitized = cellVal.replace(/\r?\n/g, ' ').replace(/\|/g, '/');
      rowCells.push(sanitized);
    }
    rows.push(rowCells);
  }

  // Build strict Markdown table string
  const mdHeader = `| ${headers.join(' | ')} |`;
  const mdDivider = `| ${headers.map(() => '---').join(' | ')} |`;
  const mdRows = rows.map(r => `| ${r.join(' | ')} |`).join('\n');
  const markdownTable = `${mdHeader}\n${mdDivider}\n${mdRows}`;

  return {
    headers,
    rows,
    rowCount: rows.length,
    columnCount: headers.length,
    markdownTable,
    sheetName: firstSheetName,
    fileName: file.name
  };
}

/**
 * Merges existing chapter narrative text with the exact uploaded Excel table.
 * Conforms strictly to R.M. N.° 089-2023-MINAM format: "Cuadro XX - {Título limpio}"
 * without "Cuadro Oficial", "Anexo N°", "(Ejemplo)" or "Datos cargados desde...".
 */
export function mergeChapterNarrativeWithTable(
  existingContent: string,
  anexoNumero: number,
  markdownTable: string,
  _fileName: string
): string {
  const anexoConfig = ANNEXES_RM_089[anexoNumero];
  const rawTitle = anexoConfig?.tituloAnexo || `Estimación técnica de Anexo ${anexoNumero}`;
  const cleanTitle = rawTitle
    .replace(/^Anexo\s+N[°ºo]?\s*\d+\s*[:–-]\s*/i, '')
    .replace(/^Cuadro\s+Oficial\s*[—–-]\s*/i, '')
    .replace(/^Cuadro\s+(?:estimado|oficial)\s+de\s+/i, 'Estimado de ')
    .replace(/\s*\(Ejemplo\)/gi, '')
    .replace(/\s*\(R\.M\.?\s*N\.?[°ºo]?\s*089-2023-MINAM\)/gi, '')
    .trim();

  const tableTitleHeader = `### Cuadro xx - ${cleanTitle}`;
  const newTableBlock = `${tableTitleHeader}\n\n${markdownTable}`;

  if (!existingContent || existingContent.trim() === '') {
    return newTableBlock;
  }

  // Check if an existing version of this table or chapter cuadro already exists
  const regex = new RegExp(`(?:###\\s*)?Cuadro\\s+(?:xxa?|\\d+|[A-Z0-9_-]+)\\s*[:–-][\\s\\S]*?Anexo\\s*${anexoNumero}[\\s\\S]*?(?=\\n###|$)`, 'i');
  if (regex.test(existingContent)) {
    return existingContent.replace(regex, newTableBlock).trim();
  }

  // Also check if there's already a table matching clean title keywords
  const titleKeywords = cleanTitle.split(' ').slice(0, 3).join('\\s+');
  const keywordRegex = new RegExp(`(?:###\\s*)?Cuadro[\\s\\S]*?${titleKeywords}[\\s\\S]*?(?=\\n###|$)`, 'i');
  if (keywordRegex.test(existingContent)) {
    return existingContent.replace(keywordRegex, newTableBlock).trim();
  }

  // Otherwise, maintain narrative text and append table directly below
  const cleanNarrative = existingContent.trim();
  return `${cleanNarrative}\n\n${newTableBlock}`;
}

/**
 * Parses markdown table inside chapter text into structured HTML or React renderable elements
 */
export function parseMarkdownTableStrings(text: string): { type: 'text' | 'table'; content: string; headers?: string[]; rows?: string[][] }[] {
  if (!text) return [];

  const lines = text.split('\n');
  const segments: { type: 'text' | 'table'; content: string; headers?: string[]; rows?: string[][] }[] = [];

  let currentTextBuffer: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  const flushText = () => {
    if (currentTextBuffer.length > 0) {
      segments.push({ type: 'text', content: currentTextBuffer.join('\n') });
      currentTextBuffer = [];
    }
  };

  const flushTable = () => {
    if (tableLines.length >= 2) {
      // First line is header, second is separator
      const headerLine = tableLines[0];
      const headers = headerLine
        .split('|')
        .map(h => h.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      const rowLines = tableLines.slice(2);
      const rows = rowLines.map(r => 
        r.split('|')
          .map(cell => cell.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
      );

      segments.push({
        type: 'table',
        content: tableLines.join('\n'),
        headers,
        rows
      });
    } else {
      // Not a real table, push as text
      currentTextBuffer.push(...tableLines);
    }
    tableLines = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');

    if (isTableLine) {
      if (!inTable) {
        flushText();
        inTable = true;
      }
      tableLines.push(line);
    } else {
      if (inTable) {
        flushTable();
      }
      currentTextBuffer.push(line);
    }
  }

  if (inTable) {
    flushTable();
  }
  flushText();

  return segments;
}

/**
 * Returns the Annex number corresponding to a chapter number, or undefined if no annex is mapped
 */
export function getAnnexForChapter(chapterNum: number): AnnexConfig | undefined {
  const mapping: Record<number, number> = {
    4: 3,  // Cap 4 -> Anexo 3
    5: 4,  // Cap 5 -> Anexo 4
    6: 6,  // Cap 6 -> Anexo 6
    7: 7,  // Cap 7 -> Anexo 7
    9: 9,  // Cap 9 -> Anexo 9
    11: 11 // Cap 11 -> Anexo 11
  };

  const annexNum = mapping[chapterNum];
  return annexNum ? ANNEXES_RM_089[annexNum] : undefined;
}
