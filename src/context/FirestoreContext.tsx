import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  ContenidoMinimoItem, 
  MarcoNormativoItem,
  subscribeContenidoMinimo, 
  subscribeMarcoNormativo, 
  saveContenidoMinimoItem, 
  toggleContenidoMinimoActive, 
  deleteContenidoMinimoItem, 
  saveMarcoNormativoItem, 
  toggleMarcoNormativoActive, 
  deleteMarcoNormativoItem,
  seedContenidoMinimo,
  seedMarcoNormativo,
  subscribeModeloPlan,
  getModeloPlanFromFirestore
} from '../services/firestoreService';
import { MASTER_REQUIREMENTS, NORMATIVE_DOCUMENTS } from '../data/normativaData';
import { PMMRSPlan } from '../types';

interface FirestoreContextType {
  contenidoMinimo: ContenidoMinimoItem[];
  activeCriterios: ContenidoMinimoItem[];
  marcoNormativo: MarcoNormativoItem[];
  activeNormas: MarcoNormativoItem[];
  modeloPlan: PMMRSPlan | null;
  loading: boolean;
  error: string | null;
  isFirestoreConnected: boolean;
  fetchModeloPlan: () => Promise<PMMRSPlan | null>;
  // CRUD Contenido Mínimo
  saveCriterion: (item: Partial<ContenidoMinimoItem>) => Promise<string>;
  toggleCriterion: (id: string, activo: boolean) => Promise<void>;
  deleteCriterion: (id: string) => Promise<void>;
  seedCriteria: (force?: boolean) => Promise<number>;
  // CRUD Marco Normativo
  saveNorma: (item: Partial<MarcoNormativoItem>) => Promise<string>;
  toggleNorma: (id: string, activo: boolean) => Promise<void>;
  deleteNorma: (id: string) => Promise<void>;
  seedNormas: (force?: boolean) => Promise<number>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

// Fallbacks locales inmediatos
const FALLBACK_CRITERIA: ContenidoMinimoItem[] = MASTER_REQUIREMENTS.map((r, i) => ({
  id: r.id,
  punto: r.capitulo,
  subpunto: r.subcapitulo || '',
  categoria: r.capituloNombre || `Capítulo ${r.capitulo}`,
  criterio_redaccion: r.requisito,
  pregunta_evaluacion: r.informacionRequerida || r.requisito,
  es_determinado_normativa: true,
  codigo: r.id,
  capitulo: r.capitulo,
  capituloNombre: r.capituloNombre,
  subcapitulo: r.subcapitulo,
  requisito: r.requisito,
  fuente: r.fuente,
  tipo: r.tipo,
  informacionRequerida: r.informacionRequerida,
  evidenciaEsperada: r.evidenciaEsperada,
  activo: true,
  orden: i + 1
}));

const FALLBACK_NORMAS: MarcoNormativoItem[] = NORMATIVE_DOCUMENTS.map((d) => ({
  id: d.id,
  codigo: d.id === 'norm-1' ? 'DL-1278' :
          d.id === 'norm-2' ? 'DS-014-2017-MINAM' :
          d.id === 'norm-3' ? 'RM-089-2023-MINAM' :
          d.id === 'norm-4' ? 'NTP-900.058:2019' : 'DIR-SIGERSOL-SNM',
  nombre: d.nombre,
  numero: d.numero,
  categoria: d.categoria,
  fecha: d.fecha,
  entidad: d.entidad,
  descripcion: d.descripcion,
  enlace: d.enlace,
  versionUtilizada: d.versionUtilizada,
  activo: true
}));

export const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contenidoMinimo, setContenidoMinimo] = useState<ContenidoMinimoItem[]>(FALLBACK_CRITERIA);
  const [marcoNormativo, setMarcoNormativo] = useState<MarcoNormativoItem[]>(FALLBACK_NORMAS);
  const [modeloPlan, setModeloPlan] = useState<PMMRSPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  useEffect(() => {
    let unsubscribeContenido: (() => void) | undefined;
    let unsubscribeNormas: (() => void) | undefined;
    let unsubscribeModelo: (() => void) | undefined;
    let mounted = true;

    // Suscribir a 'contenido_minimo'
    unsubscribeContenido = subscribeContenidoMinimo(
      (items) => {
        if (!mounted) return;
        if (items.length > 0) {
          setContenidoMinimo(items);
        } else {
          // Si la colección está vacía en Firestore, auto-sembrar la estructura de R.M. 089-2023
          seedContenidoMinimo(false).catch((e) => console.warn('Auto-seed contenido_minimo:', e));
        }
        setIsFirestoreConnected(true);
        setError(null);
      },
      (err) => {
        if (!mounted) return;
        console.warn('Conexión Firestore contenido_minimo en modo de respaldo:', err.message);
        setError('Operando con réplica local (Firestore pmmrs-gestion en reconexión)');
      }
    );

    // Suscribir a 'marco_normativo'
    unsubscribeNormas = subscribeMarcoNormativo(
      (items) => {
        if (!mounted) return;
        if (items.length > 0) {
          setMarcoNormativo(items);
        } else {
          // Si la colección está vacía en Firestore, auto-sembrar las normas base
          seedMarcoNormativo(false).catch((e) => console.warn('Auto-seed marco_normativo:', e));
        }
        setIsFirestoreConnected(true);
        setLoading(false);
      },
      (err) => {
        if (!mounted) return;
        console.warn('Conexión Firestore marco_normativo en modo de respaldo:', err.message);
        setLoading(false);
      }
    );

    // Suscribir al plan modelo oficial ('modelo_plan')
    unsubscribeModelo = subscribeModeloPlan(
      (plan) => {
        if (!mounted) return;
        if (plan) {
          setModeloPlan(plan);
        }
      },
      (err) => {
        if (!mounted) return;
        console.warn('Conexión Firestore modelo_plan en modo de respaldo:', err.message);
      }
    );

    return () => {
      mounted = false;
      if (unsubscribeContenido) unsubscribeContenido();
      if (unsubscribeNormas) unsubscribeNormas();
      if (unsubscribeModelo) unsubscribeModelo();
    };
  }, []);

  const activeCriterios = useMemo(
    () => contenidoMinimo.filter((c) => c.activo),
    [contenidoMinimo]
  );

  const activeNormas = useMemo(
    () => marcoNormativo.filter((n) => n.activo),
    [marcoNormativo]
  );

  // CRUD Actions
  const handleSaveCriterion = async (item: Partial<ContenidoMinimoItem>): Promise<string> => {
    const id = await saveContenidoMinimoItem(item);
    return id;
  };

  const handleToggleCriterion = async (id: string, activo: boolean): Promise<void> => {
    await toggleContenidoMinimoActive(id, activo);
  };

  const handleDeleteCriterion = async (id: string): Promise<void> => {
    await deleteContenidoMinimoItem(id);
  };

  const handleSeedCriteria = async (force = false): Promise<number> => {
    return await seedContenidoMinimo(force);
  };

  const handleSaveNorma = async (item: Partial<MarcoNormativoItem>): Promise<string> => {
    const id = await saveMarcoNormativoItem(item);
    return id;
  };

  const handleToggleNorma = async (id: string, activo: boolean): Promise<void> => {
    await toggleMarcoNormativoActive(id, activo);
  };

  const handleDeleteNorma = async (id: string): Promise<void> => {
    await deleteMarcoNormativoItem(id);
  };

  const handleSeedNormas = async (force = false): Promise<number> => {
    return await seedMarcoNormativo(force);
  };

  return (
    <FirestoreContext.Provider
      value={{
        contenidoMinimo,
        activeCriterios,
        marcoNormativo,
        activeNormas,
        modeloPlan,
        loading,
        error,
        isFirestoreConnected,
        fetchModeloPlan: getModeloPlanFromFirestore,
        saveCriterion: handleSaveCriterion,
        toggleCriterion: handleToggleCriterion,
        deleteCriterion: handleDeleteCriterion,
        seedCriteria: handleSeedCriteria,
        saveNorma: handleSaveNorma,
        toggleNorma: handleToggleNorma,
        deleteNorma: handleDeleteNorma,
        seedNormas: handleSeedNormas
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = (): FirestoreContextType => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error('useFirestore debe ser utilizado dentro de un FirestoreProvider');
  }
  return context;
};
