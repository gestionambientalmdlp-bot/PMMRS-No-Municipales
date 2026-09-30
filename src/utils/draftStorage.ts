import { PMMRSPlan } from '../types';
import { createBlankPlan } from '../data/demoData';

export const LOCAL_STORAGE_DRAFT_KEY = 'pmmrs_continuar_plan_draft_v1';
export const LOCAL_STORAGE_DRAFT_TIME_KEY = 'pmmrs_continuar_plan_draft_time_v1';

/**
 * Downloads the current draft as a Continuar_plan_[NombreEmpresa].json file
 */
export function exportDraftPlanJson(plan: PMMRSPlan): { filename: string; success: boolean } {
  try {
    const rawName = (plan.company.razonSocial || 'Borrador').trim();
    const safeCompanyName = rawName
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_\-\s]/g, '')
      .replace(/\s+/g, '_') || 'Borrador';

    const filename = `Continuar_plan_${safeCompanyName}.json`;

    const draftPayload = {
      tipoArchivo: 'PMMRS_BORRADOR_CONTINUACION',
      versionAplicacion: '2026.1',
      normativa: 'Resolución Ministerial N.° 089-2023-MINAM / D.L. 1278',
      fechaGuardado: new Date().toISOString(),
      nombreEmpresa: plan.company.razonSocial || 'Sin Razón Social',
      ruc: plan.company.ruc || '',
      estadoPlan: plan.estado || 'En elaboración',
      datosCompletosPlan: plan
    };

    const jsonStr = JSON.stringify(draftPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    // Save also to local storage backup
    saveDraftToLocalStorage(plan);

    return { filename, success: true };
  } catch (err) {
    console.error('Error al exportar borrador JSON:', err);
    return { filename: '', success: false };
  }
}

/**
 * Parses and validates an uploaded Continuar_plan_*.json file
 */
export async function parseDraftPlanFile(file: File): Promise<PMMRSPlan> {
  const text = await file.text();
  const parsed = JSON.parse(text);

  // Check if it's the wrapped format or direct plan format
  const rawPlan: Partial<PMMRSPlan> = parsed.datosCompletosPlan || parsed;

  const defaultBlank = createBlankPlan();

  // Merge deeply with blank defaults to guarantee type safety and missing fields
  const restoredPlan: PMMRSPlan = {
    ...defaultBlank,
    ...rawPlan,
    id: rawPlan.id || `plan-${Date.now()}`,
    titulo: rawPlan.titulo || defaultBlank.titulo,
    estado: rawPlan.estado || 'En elaboración',
    fechaModificacion: new Date().toISOString().split('T')[0],
    company: {
      ...defaultBlank.company,
      ...(rawPlan.company || {})
    },
    header: {
      ...defaultBlank.header,
      ...(rawPlan.header || {})
    },
    residuos: Array.isArray(rawPlan.residuos) ? rawPlan.residuos : defaultBlank.residuos,
    capitulos: defaultBlank.capitulos.map((defCap) => {
      const existing = (rawPlan.capitulos || []).find(c => c.numero === defCap.numero);
      if (existing) {
        return {
          ...defCap,
          ...existing,
          contenido: existing.contenido !== undefined ? existing.contenido : defCap.contenido,
          completado: existing.completado !== undefined ? existing.completado : Boolean(existing.contenido && existing.contenido.length > 30)
        };
      }
      return defCap;
    })
  };

  // Sync header razon social if company has it
  if (restoredPlan.company.razonSocial && (!restoredPlan.header.razonSocialHeader || restoredPlan.header.razonSocialHeader === 'EMPRESA TITULAR')) {
    restoredPlan.header.razonSocialHeader = restoredPlan.company.razonSocial;
  }

  // Backup immediately in LocalStorage
  saveDraftToLocalStorage(restoredPlan);

  return restoredPlan;
}

/**
 * Saves plan state to LocalStorage as safety backup
 */
export function saveDraftToLocalStorage(plan: PMMRSPlan): void {
  try {
    if (!plan || !plan.company) return;
    localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(plan));
    localStorage.setItem(LOCAL_STORAGE_DRAFT_TIME_KEY, new Date().toISOString());
  } catch (err) {
    console.warn('No se pudo guardar en LocalStorage (posible cuota excedida o modo privado):', err);
  }
}

/**
 * Retrieves draft state from LocalStorage if available
 */
export function getDraftFromLocalStorage(): { plan: PMMRSPlan; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
    const time = localStorage.getItem(LOCAL_STORAGE_DRAFT_TIME_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const defaultBlank = createBlankPlan();

    const plan: PMMRSPlan = {
      ...defaultBlank,
      ...parsed,
      company: { ...defaultBlank.company, ...(parsed.company || {}) },
      header: { ...defaultBlank.header, ...(parsed.header || {}) },
      residuos: Array.isArray(parsed.residuos) ? parsed.residuos : defaultBlank.residuos,
      capitulos: defaultBlank.capitulos.map(defCap => {
        const existing = (parsed.capitulos || []).find((c: any) => c.numero === defCap.numero);
        return existing ? { ...defCap, ...existing } : defCap;
      })
    };

    return { plan, savedAt: time || new Date().toISOString() };
  } catch (err) {
    console.warn('Error al leer borrador de LocalStorage:', err);
    return null;
  }
}

/**
 * Clears the backup draft from LocalStorage
 */
export function clearLocalStorageDraft(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_TIME_KEY);
  } catch (err) {
    console.warn('Error al limpiar LocalStorage:', err);
  }
}
