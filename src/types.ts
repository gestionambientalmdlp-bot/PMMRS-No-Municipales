export type AppView = 'inicio' | 'elaborar' | 'revisar' | 'normativo' | 'admin' | 'guardados' | 'ayuda';

export interface CompanyData {
  razonSocial: string;
  ruc: string;
  nombreComercial: string;
  domicilio: string;
  departamento: string;
  provincia: string;
  distrito: string;
  representanteLegal: string;
  dniRepresentante: string;
  actividadEconomica: string;
  sector: string;
  numeroTrabajadores: number;
  horarioOperacion: string;
  correoContacto: string;
  telefonoContacto: string;
}

export interface WasteItem {
  id: string;
  tipo: 'Peligroso' | 'No Peligroso';
  categoria: string;
  descripcion: string;
  estadoFisico: 'Sólido' | 'Semisólido' | 'Polvo' | 'Envases';
  peligrosidad: string[];
  generacionEstimadaKgMes: number;
  almacenamiento: string;
  colorContenedorNtp: string;
  destinoFinal: string;
  minimizacionAccion: string;
}

export interface PlanChapter {
  id: string;
  numero: number;
  titulo: string;
  contenido: string;
  completado: boolean;
}

export interface InstitutionalHeader {
  logoUrl?: string;
  razonSocialHeader: string;
  tituloDocumento: string;
  version: string;
  fechaEmision: string;
  elaboradoPor: string;
  revisadoPor: string;
  aprobadoPor: string;
}

export interface PMMRSPlan {
  id: string;
  titulo: string;
  estado: 'Borrador' | 'En elaboración' | 'Pendiente de información' | 'Validación' | 'Listo para revisión' | 'Finalizado';
  fechaCreacion: string;
  fechaModificacion: string;
  version: string;
  company: CompanyData;
  header: InstitutionalHeader;
  residuos: WasteItem[];
  capitulos: PlanChapter[];
  presupuestoTotal: number;
  esDemo: boolean;
}

export type ReviewStatus = 'Cumple' | 'Cumple parcialmente' | 'No cumple' | 'No corresponde' | 'Información insuficiente' | 'No evaluable';

export interface FindingItem {
  id: string;
  requisitoId: string;
  capitulo: string;
  requisitoTexto: string;
  evidenciaEncontrada: string;
  estado: ReviewStatus;
  hallazgo: string;
  brecha: string;
  recomendacion: string;
  fuente: string;
  tipoHallazgo: 'Conforme' | 'Conformidad acreditada' | 'Error formal' | 'Omisión documental' | 'Deficiencia técnica' | 'Inconsistencia' | 'Información insuficiente' | 'Posible incumplimiento normativo' | 'Incumplimiento acreditado';
}

export interface SWOTItem {
  fortalezas: string[];
  oportunidades: string[];
  debilidades: string[];
  amenazas: string[];
}

export interface StrategicActionItem {
  id: string;
  seccionMinam: string;
  tipoEstrategia: 'DO (Reorientación)' | 'DA (Supervivencia)';
  hallazgoDebilidad: string;
  accionCorrectiva: string;
  indicadorOperacional: string;
  presupuestoCronograma: string;
}

export interface RegulatoryRiskItem {
  id: string;
  seccionMinam: string;
  hallazgoDebilidad: string;
  riesgoRegulatorio: string;
  gravedad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  baseLegal: string;
}

export interface SectionAuditStatus {
  id: string;
  seccionNumero: string;
  seccionTitulo: string;
  estado: 'Aprobada' | 'Observada' | 'Ausente';
  porcentajeCumplimiento: number;
  detalles: string;
}

export interface UploadedPMMRSDocument {
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'word' | 'otro';
  uploadedAt: string;
  detectedRuc?: string;
  detectedRazonSocial?: string;
  detectedSections?: string[];
  totalWords?: number;
  extractedSnippet?: string;
  rawText?: string;
}

export interface EvaluationResult {
  resultado: 'CONFORME' | 'OBSERVADO' | 'NO CONFORME';
  label: string;
  badgeClass: string;
  ribbonClass: string;
  textClass: string;
  borderClass: string;
  bgLightClass: string;
  dictamenTitulo: string;
  dictamenParrafo: string;
  recomendacionInmediata: string;
}

export interface ReviewReport {
  id: string;
  planId?: string;
  tituloPlan: string;
  fechaRevision: string;
  revisor: string;
  documentosRevisados: string[];
  resumenEjecutivo: string;
  hallazgos: FindingItem[];
  swot: SWOTItem;
  conclusiones: string[];
  recomendaciones: string[];
  porcentajeCumplimientoGeneral?: number;
  seccionesAprobadas?: string[];
  seccionesObservadas?: string[];
  auditoriaSecciones?: SectionAuditStatus[];
  riesgosRegulatorios?: RegulatoryRiskItem[];
  planAccionCorrectivo?: StrategicActionItem[];
  prioridadesInmediatas?: string[];
  conclusionParrafo1?: string;
  conclusionParrafo2?: string;
  documentoSubido?: UploadedPMMRSDocument;
  resultadoEvaluacion?: 'CONFORME' | 'OBSERVADO' | 'NO CONFORME';
  etiquetaResultado?: string;
  dictamenTecnico?: string;
}

export interface MasterRequirement {
  id: string;
  capitulo: number;
  capituloNombre: string;
  subcapitulo: string;
  requisito: string;
  fuente: string;
  tipo: 'Requisito normativo' | 'Contenido mínimo' | 'Requisito técnico' | 'Información descriptiva' | 'Evidencia' | 'Cálculo' | 'Recomendación';
  informacionRequerida: string;
  evidenciaEsperada: string;
}

export interface NormativeDocument {
  id: string;
  categoria: 'Leyes y Decretos Legislativos' | 'Reglamentos' | 'Resoluciones Ministeriales' | 'Normas Técnicas' | 'Guías y Documentos Técnicos';
  nombre: string;
  numero: string;
  fecha: string;
  entidad: string;
  descripcion: string;
  enlace: string;
  versionUtilizada: string;
}
