import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { MASTER_REQUIREMENTS, NORMATIVE_DOCUMENTS } from '../data/normativaData';

export interface ContenidoMinimoItem {
  id: string;
  punto: number; // 1 a 13 (Capítulo oficial de R.M. 089-2023-MINAM / D.L. 1278)
  subpunto: string; // "", "1A", "4.1", "6.a.1", "13.1", etc.
  categoria: string; // "Introducción", "Objetivos", "Diagnóstico de residuos sólidos", etc.
  es_determinado_normativa: boolean;
  criterio_redaccion: string; // Columna para ELABORAR el plan
  pregunta_evaluacion: string; // Columna para REVISAR el plan
  // Campos de compatibilidad y gestión:
  codigo: string;
  capitulo: number; // alias de punto
  capituloNombre: string; // alias de categoria
  subcapitulo: string; // alias de subpunto
  requisito: string; // alias de criterio_redaccion
  fuente: string;
  tipo: string;
  informacionRequerida: string; // alias de pregunta_evaluacion
  evidenciaEsperada: string;
  activo: boolean;
  orden?: number;
  updatedAt?: any;
}

export interface MarcoNormativoItem {
  id: string;
  codigo: string;
  nombre: string;
  numero: string;
  categoria: 'Leyes y Decretos Legislativos' | 'Reglamentos' | 'Resoluciones Ministeriales' | 'Normas Técnicas' | 'Guías y Documentos Técnicos' | string;
  fecha?: string;
  entidad: string;
  descripcion: string;
  enlace: string;
  versionUtilizada?: string;
  activo: boolean;
  updatedAt?: any;
}

export const CONTENIDO_MINIMO_COLLECTION = 'contenido_minimo';
export const MARCO_NORMATIVO_COLLECTION = 'marco_normativo';

// Mapeo inicial de Códigos de Marco Normativo
const DEFAULT_NORMA_CODES: Record<string, string> = {
  'norm-1': 'DL-1278',
  'norm-2': 'DS-014-2017-MINAM',
  'norm-3': 'RM-089-2023-MINAM',
  'norm-4': 'NTP-900.058:2019',
  'norm-5': 'DIR-SIGERSOL-SNM'
};

/**
 * Escucha en tiempo real la colección 'contenido_minimo'
 */
export function subscribeContenidoMinimo(
  onData: (items: ContenidoMinimoItem[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, CONTENIDO_MINIMO_COLLECTION);

    return onSnapshot(colRef, (snapshot) => {
      const items: ContenidoMinimoItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const puntoNum = Number(data.punto !== undefined ? data.punto : data.capitulo) || 1;
        const categoriaStr = data.categoria || data.capituloNombre || `Capítulo ${puntoNum}`;
        const subpuntoStr = data.subpunto !== undefined ? String(data.subpunto) : '';
        const criterioRedaccion = data.criterio_redaccion || data.requisito || '';
        const preguntaEvaluacion = data.pregunta_evaluacion || data.informacionRequerida || '';
        const esDeterminado = data.es_determinado_normativa !== undefined ? Boolean(data.es_determinado_normativa) : true;
        const activo = data.activo !== false;

        items.push({
          id: docSnap.id,
          punto: puntoNum,
          subpunto: subpuntoStr,
          categoria: categoriaStr,
          es_determinado_normativa: esDeterminado,
          criterio_redaccion: criterioRedaccion,
          pregunta_evaluacion: preguntaEvaluacion,
          codigo: data.codigo || (subpuntoStr ? `REQ-${puntoNum}.${subpuntoStr}` : `REQ-${puntoNum}`),
          capitulo: puntoNum,
          capituloNombre: categoriaStr,
          subcapitulo: subpuntoStr,
          requisito: criterioRedaccion,
          fuente: data.fuente || 'R.M. N.° 089-2023-MINAM & D.L. 1278',
          tipo: data.tipo || (esDeterminado ? 'Contenido mínimo' : 'Criterio técnico'),
          informacionRequerida: preguntaEvaluacion,
          evidenciaEsperada: data.evidenciaEsperada || '',
          activo,
          orden: data.orden !== undefined ? data.orden : Number(docSnap.id) || 0,
          updatedAt: data.updatedAt
        });
      });

      // Ordenar rigurosamente por punto (Capítulo 1 a 13) y luego por id/subpunto
      items.sort((a, b) => {
        if (a.punto !== b.punto) return a.punto - b.punto;
        const numIdA = Number(a.id);
        const numIdB = Number(b.id);
        if (!isNaN(numIdA) && !isNaN(numIdB)) return numIdA - numIdB;
        return a.subpunto.localeCompare(b.subpunto);
      });

      onData(items);
    }, (err) => {
      console.warn('Error suscribiendo a contenido_minimo en Firestore:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    console.error('Error inicializando suscripción a contenido_minimo:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Escucha en tiempo real la colección 'marco_normativo'
 */
export function subscribeMarcoNormativo(
  onData: (items: MarcoNormativoItem[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, MARCO_NORMATIVO_COLLECTION);
    const q = query(colRef, orderBy('codigo', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const items: MarcoNormativoItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          codigo: data.codigo || docSnap.id,
          nombre: data.nombre || '',
          numero: data.numero || '',
          categoria: data.categoria || 'Leyes y Decretos Legislativos',
          fecha: data.fecha || '',
          entidad: data.entidad || '',
          descripcion: data.descripcion || '',
          enlace: data.enlace || '',
          versionUtilizada: data.versionUtilizada || '',
          activo: data.activo !== false,
          updatedAt: data.updatedAt
        });
      });
      onData(items);
    }, (err) => {
      console.warn('Error suscribiendo a marco_normativo en Firestore:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    console.error('Error inicializando suscripción a marco_normativo:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Guarda o actualiza un criterio en 'contenido_minimo'
 */
export async function saveContenidoMinimoItem(item: Partial<ContenidoMinimoItem>): Promise<string> {
  const colRef = collection(db, CONTENIDO_MINIMO_COLLECTION);
  const puntoNum = Number(item.punto !== undefined ? item.punto : item.capitulo) || 1;
  const subpuntoStr = item.subpunto !== undefined ? String(item.subpunto) : '';
  const categoriaStr = item.categoria || item.capituloNombre || `Capítulo ${puntoNum}`;
  const criterioRedaccion = item.criterio_redaccion || item.requisito || '';
  const preguntaEvaluacion = item.pregunta_evaluacion || item.informacionRequerida || '';
  const esDeterminado = item.es_determinado_normativa !== undefined ? Boolean(item.es_determinado_normativa) : true;

  const dataToSave = {
    punto: puntoNum,
    subpunto: subpuntoStr,
    categoria: categoriaStr,
    es_determinado_normativa: esDeterminado,
    criterio_redaccion: criterioRedaccion,
    pregunta_evaluacion: preguntaEvaluacion,
    codigo: item.codigo || (subpuntoStr ? `REQ-${puntoNum}.${subpuntoStr}` : `REQ-${puntoNum}`),
    capitulo: puntoNum,
    capituloNombre: categoriaStr,
    subcapitulo: subpuntoStr,
    requisito: criterioRedaccion,
    fuente: item.fuente || 'R.M. N.° 089-2023-MINAM & D.L. 1278',
    tipo: item.tipo || (esDeterminado ? 'Contenido mínimo' : 'Criterio técnico'),
    informacionRequerida: preguntaEvaluacion,
    evidenciaEsperada: item.evidenciaEsperada || '',
    activo: item.activo !== false,
    orden: item.orden !== undefined ? item.orden : (item.id ? Number(item.id) || 0 : 0),
    updatedAt: serverTimestamp()
  };

  if (item.id) {
    const docRef = doc(db, CONTENIDO_MINIMO_COLLECTION, String(item.id));
    await setDoc(docRef, dataToSave, { merge: true });
    return String(item.id);
  } else {
    const docRef = await addDoc(colRef, dataToSave);
    return docRef.id;
  }
}

/**
 * Cambia el estado activo/inactivo de un criterio en 'contenido_minimo'
 */
export async function toggleContenidoMinimoActive(id: string, activo: boolean): Promise<void> {
  const docRef = doc(db, CONTENIDO_MINIMO_COLLECTION, id);
  await updateDoc(docRef, { 
    activo, 
    updatedAt: serverTimestamp() 
  });
}

/**
 * Elimina un criterio de 'contenido_minimo'
 */
export async function deleteContenidoMinimoItem(id: string): Promise<void> {
  const docRef = doc(db, CONTENIDO_MINIMO_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Guarda o actualiza una norma en 'marco_normativo'
 */
export async function saveMarcoNormativoItem(item: Partial<MarcoNormativoItem>): Promise<string> {
  const colRef = collection(db, MARCO_NORMATIVO_COLLECTION);
  const dataToSave = {
    codigo: item.codigo?.trim() || 'NORMA-GEN',
    nombre: item.nombre?.trim() || '',
    numero: item.numero?.trim() || '',
    categoria: item.categoria || 'Leyes y Decretos Legislativos',
    fecha: item.fecha || new Date().toISOString().split('T')[0],
    entidad: item.entidad || 'MINAM',
    descripcion: item.descripcion || '',
    enlace: item.enlace?.trim() || '',
    versionUtilizada: item.versionUtilizada || 'Versión vigente',
    activo: item.activo !== false,
    updatedAt: serverTimestamp()
  };

  if (item.id) {
    const docRef = doc(db, MARCO_NORMATIVO_COLLECTION, item.id);
    await setDoc(docRef, dataToSave, { merge: true });
    return item.id;
  } else {
    const docRef = await addDoc(colRef, dataToSave);
    return docRef.id;
  }
}

/**
 * Cambia el estado activo/inactivo de una norma en 'marco_normativo'
 */
export async function toggleMarcoNormativoActive(id: string, activo: boolean): Promise<void> {
  const docRef = doc(db, MARCO_NORMATIVO_COLLECTION, id);
  await updateDoc(docRef, { 
    activo, 
    updatedAt: serverTimestamp() 
  });
}

/**
 * Elimina una norma de 'marco_normativo'
 */
export async function deleteMarcoNormativoItem(id: string): Promise<void> {
  const docRef = doc(db, MARCO_NORMATIVO_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Inicializa / Siembra 'contenido_minimo' en Firestore a partir de MASTER_REQUIREMENTS si está vacía o a solicitud
 */
export async function seedContenidoMinimo(forceOverwrite = false): Promise<number> {
  const colRef = collection(db, CONTENIDO_MINIMO_COLLECTION);
  const snapshot = await getDocs(colRef);
  
  if (!forceOverwrite && !snapshot.empty) {
    return snapshot.size;
  }

  let count = 0;
  for (let idx = 0; idx < MASTER_REQUIREMENTS.length; idx++) {
    const req = MASTER_REQUIREMENTS[idx];
    const docId = req.id || `REQ-${String(req.capitulo).padStart(2, '0')}`;
    const docRef = doc(db, CONTENIDO_MINIMO_COLLECTION, docId);
    
    await setDoc(docRef, {
      codigo: req.id,
      capitulo: req.capitulo,
      capituloNombre: req.capituloNombre,
      subcapitulo: req.subcapitulo,
      requisito: req.requisito,
      fuente: req.fuente,
      tipo: req.tipo,
      informacionRequerida: req.informacionRequerida,
      evidenciaEsperada: req.evidenciaEsperada,
      activo: true,
      orden: idx + 1,
      updatedAt: serverTimestamp()
    });
    count++;
  }

  return count;
}

/**
 * Inicializa / Siembra 'marco_normativo' en Firestore a partir de NORMATIVE_DOCUMENTS si está vacía o a solicitud
 */
export async function seedMarcoNormativo(forceOverwrite = false): Promise<number> {
  const colRef = collection(db, MARCO_NORMATIVO_COLLECTION);
  const snapshot = await getDocs(colRef);

  if (!forceOverwrite && !snapshot.empty) {
    return snapshot.size;
  }

  let count = 0;
  for (const docItem of NORMATIVE_DOCUMENTS) {
    const codigo = DEFAULT_NORMA_CODES[docItem.id] || docItem.id;
    const docRef = doc(db, MARCO_NORMATIVO_COLLECTION, docItem.id);

    await setDoc(docRef, {
      codigo,
      nombre: docItem.nombre,
      numero: docItem.numero,
      categoria: docItem.categoria,
      fecha: docItem.fecha,
      entidad: docItem.entidad,
      descripcion: docItem.descripcion,
      enlace: docItem.enlace,
      versionUtilizada: docItem.versionUtilizada,
      activo: true,
      updatedAt: serverTimestamp()
    });
    count++;
  }

  return count;
}
