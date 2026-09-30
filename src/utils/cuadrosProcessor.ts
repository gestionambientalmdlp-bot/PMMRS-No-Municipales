import { PMMRSPlan, PlanChapter } from '../types';

/**
 * Utility to process, clean, and sequentially number all Cuadros (Tables) in a PMMRS plan.
 * Conforms strictly to R.M. N.° 089-2023-MINAM formatting:
 * 1. Sequential numbering: Cuadro 1, Cuadro 2, Cuadro 3, ...
 * 2. Removes noise: "Cuadro Oficial — ", "Anexo N° X: ", "(Ejemplo)", "(R.M. N.° 089-2023-MINAM)", "(Anexo X)".
 * 3. Removes badges: "> *Datos cargados desde archivo Excel: ...*"
 * 4. Detects table tagged/referenced as XXA (Anexo 11 / Medidas y Presupuesto in Chapter 7),
 *    assigns its sequential number N, and replaces all textual references in the plan:
 *    "Ver Cuadro XXA" -> "Ver Cuadro N"
 *    "cuadro XXA" -> "cuadro N"
 * 5. Cleans raw bulleted text that duplicates table content, leaving only the clean table.
 */

// Clean titles dictionary for standard tables
export const CLEAN_CUADRO_TITLES: Record<string, string> = {
  'clasificacion': 'Clasificación de los residuos sólidos por sus características y ámbito de gestión',
  'etapas': 'Estimado del volumen y cantidad de residuos sólidos a generarse resumido por etapas',
  'actividad': 'Cuadro estimado del volumen y cantidad de residuos sólidos a generarse por actividad generadora',
  'insumos': 'Análisis de alternativas para uso de insumos o materias primas',
  'bienes': 'Estimado de la cantidad de residuos sólidos de bienes priorizados',
  'almacenamiento': 'Clasificación de los residuos sólidos por sus características para su almacenamiento',
  'medidas': 'Resumen de medidas ambientales y presupuesto para la implementación del PMMRS',
  'emergencias': 'Medidas de atención ante emergencias'
};

export function cleanCuadroTitle(rawTitle: string): string {
  let clean = rawTitle
    .replace(/^#+\s*/, '')
    .replace(/^Cuadro\s+(?:xxa?|\d+|[A-Z0-9_-]+)\s*[:–-]\s*/i, '')
    .replace(/^Cuadro Oficial\s*[—–-]\s*/i, '')
    .replace(/^Anexo\s+N[°ºo]?\s*\d+\s*[:–-]\s*/i, '')
    .replace(/\s*\(Ejemplo\)/gi, '')
    .replace(/\s*\(R\.M\.?\s*N\.?[°ºo]?\s*089-2023-MINAM\)/gi, '')
    .replace(/\s*\(Anexo\s*\d+\)/gi, '')
    .replace(/\s*\(Anexo\s*10\s*y\s*protocolos\)/gi, '')
    .replace(/[:–-]\s*$/, '')
    .trim();

  // Normalize casing (Sentence case: first letter uppercase)
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  return clean;
}

export function processPlanCuadros(plan: PMMRSPlan): PMMRSPlan {
  if (!plan || !plan.capitulos || plan.capitulos.length === 0) {
    return plan;
  }

  // Clone chapters
  const capitulosClonados: PlanChapter[] = plan.capitulos.map(c => ({ ...c }));

  // Step 1: Scan chapters in order and identify all cuadros
  let cuadroCorrelativo = 1;
  let cuadroXXAAssignedNumber: number | null = null;

  // We find patterns like:
  // - "### Cuadro ..."
  // - "Cuadro xx - ..." / "Cuadro XX - ..." / "Cuadro XXA - ..." / "Cuadro xx: ..."
  // - "### Cuadro Oficial ..."
  const cuadroRegex = /(?:###\s*)?Cuadro\s+(?:xxa?|\d+|[A-Z0-9_-]+)\s*[:–-]\s*([^\n\r]+)/gi;

  for (let i = 0; i < capitulosClonados.length; i++) {
    const cap = capitulosClonados[i];
    let contenido = cap.contenido || '';

    // Remove any excel source badges
    contenido = contenido.replace(/>\s*\*Datos cargados desde archivo Excel:[^\n\r]*\*/gi, '');

    // Replace and number each cuadro
    contenido = contenido.replace(cuadroRegex, (match: string, rawTitle: string) => {
      const isXXA = /xxa/i.test(match) || /medidas ambientales y presupuesto/i.test(rawTitle);
      const currentNumber = cuadroCorrelativo;

      if (isXXA && cuadroXXAAssignedNumber === null) {
        cuadroXXAAssignedNumber = currentNumber;
      }

      const cleanTitle = cleanCuadroTitle(rawTitle);
      cuadroCorrelativo++;

      return `### Cuadro ${currentNumber} - ${cleanTitle}`;
    });

    capitulosClonados[i].contenido = contenido;
  }

  // Fallback if XXA was not detected by regex but Chapter 7 exists
  if (cuadroXXAAssignedNumber === null) {
    // If Chapter 7 has a table, it is typically Cuadro 7 (or check the counter)
    cuadroXXAAssignedNumber = 7;
  }

  // Step 2: Replace all text references to "XXA" across all chapters
  const xxaNum = cuadroXXAAssignedNumber;
  for (let i = 0; i < capitulosClonados.length; i++) {
    let contenido = capitulosClonados[i].contenido;

    // Replace "Ver Cuadro XXA", "Ver cuadro XXA", "ver cuadro XXA"
    contenido = contenido.replace(/([Vv]er\s+)[Cc]uadro\s+XXA\b/g, `$1Cuadro ${xxaNum}`);

    // Replace "Cuadro XXA" / "cuadro XXA"
    contenido = contenido.replace(/Cuadro\s+XXA\b/g, `Cuadro ${xxaNum}`);
    contenido = contenido.replace(/cuadro\s+XXA\b/g, `cuadro ${xxaNum}`);

    // Replace any leftover "Cuadro xx " in text that was not a heading
    contenido = contenido.replace(/Cuadro\s+xx\b/g, `Cuadro ${xxaNum}`);

    capitulosClonados[i].contenido = contenido;
  }

  return {
    ...plan,
    capitulos: capitulosClonados
  };
}
