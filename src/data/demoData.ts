import { PMMRSPlan, ReviewReport, ReviewStatus } from '../types';
import { MASTER_REQUIREMENTS } from './normativaData';
import { runSpecializedAudit } from '../utils/auditEngine';
import { getModeloPlanFromFirestore } from '../services/firestoreService';

// Caché en memoria del plan modelo obtenido desde Firebase Firestore ('modelo_plan')
let cachedFirestoreDemoPlan: PMMRSPlan | null = null;

export function setCachedDemoPlan(plan: PMMRSPlan) {
  cachedFirestoreDemoPlan = plan;
}

export function getCachedDemoPlan(): PMMRSPlan | null {
  return cachedFirestoreDemoPlan;
}

/**
 * Carga el Plan Modelo Oficial fielmente desde la colección 'modelo_plan' en Firebase Firestore.
 * El plan ya NO se encuentra quemado en el código fuente, sino que se recupera directamente de Firestore.
 */
export async function loadDemoPlanFromFirestore(): Promise<PMMRSPlan> {
  if (cachedFirestoreDemoPlan && cachedFirestoreDemoPlan.capitulos?.length >= 13) {
    return cachedFirestoreDemoPlan;
  }
  const plan = await getModeloPlanFromFirestore();
  if (plan && plan.capitulos && plan.capitulos.length > 0) {
    cachedFirestoreDemoPlan = plan;
    return plan;
  }
  return DEMO_PLAN;
}

// Objeto base ligero para inicialización. El contenido completo (13 capítulos y 12 anexos oficiales de R.M. 089-2023-MINAM)
// se obtiene dinámicamente desde la colección 'modelo_plan' en Firebase Firestore.
export const DEMO_PLAN: PMMRSPlan = {
  id: 'pmmrs-textiles-andina-2027',
  titulo: 'Plan de Minimización y Manejo de Residuos Sólidos No Municipales - Textiles Andina S.A.C.',
  estado: 'Finalizado',
  fechaCreacion: '2027-01-15',
  fechaModificacion: '2027-01-20',
  version: 'Periodo de referencia: enero–diciembre 2027',
  company: {
    razonSocial: 'Textiles Andina S.A.C.',
    ruc: '20548912341',
    nombreComercial: 'Textiles Andina',
    domicilio: 'Av. Elmer Faucett N.° 4520, Zona Industrial',
    departamento: 'Callao',
    provincia: 'Provincia Constitucional del Callao',
    distrito: 'Callao',
    representanteLegal: 'Ing. Carlos Mendoza Alarcón',
    dniRepresentante: '09876543',
    actividadEconomica: 'Fabricación, teñido, lavado y acabado de tejidos de algodón y mezclas (CIIU 1312 / 1313)',
    sector: 'Industria Manufacturera / Subsector Textil (PRODUCE)',
    numeroTrabajadores: 180,
    horarioOperacion: 'Lunes a Sábado de 07:00 a 17:00 horas (Doble turno)',
    correoContacto: 'gestionambiental@textilesandina.com.pe',
    telefonoContacto: '(01) 452-9800'
  },
  header: {
    logoUrl: '',
    razonSocialHeader: 'TEXTILES ANDINA S.A.C.',
    tituloDocumento: 'PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES',
    version: 'Periodo de referencia: enero–diciembre 2027',
    fechaEmision: 'Enero 2027',
    elaboradoPor: 'Jefe de Gestión Ambiental',
    revisadoPor: 'Gerencia de Operaciones Industriales',
    aprobadoPor: 'Gerencia General / Directorio'
  },
  residuos: [],
  capitulos: [],
  anexos: [],
  presupuestoTotal: 139000,
  esDemo: true
};

export const MODELO_PLAN_OFICIAL = DEMO_PLAN;

export const DEMO_REVIEW_REPORT: ReviewReport = {
  id: 'rev-rep-001',
  planId: 'demo-plan-001',
  tituloPlan: 'Plan de Minimización y Manejo de Residuos Sólidos No Municipales 2026 - Planta Callao',
  fechaRevision: '2026-09-22',
  revisor: 'Auditor Especialista Ambiental',
  documentosRevisados: [
    'PMMRS - Industrial Textil Andina S.A.C. (Versión Oficial 2026)',
    'Contenido Mínimo Oficial R.M. N.° 089-2023-MINAM (13 Capítulos)',
    'Identificación y marco regulatorio institucional (D.L. 1278 y R.M. 089-2023-MINAM)',
    'Código de Colores NTP 900.058:2019 y Planos de Almacén ATRP',
    'Autorizaciones Ambientales de EO-RS (EcoSafe Perú y Recicla Perú)'
  ],
  resumenEjecutivo: 'El Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRSNM) presentado por Industrial Textil Andina S.A.C. presenta un nivel de cumplimiento estructural del 98% respecto a los estándares de la Resolución Ministerial N.° 089-2023-MINAM y el Decreto Legislativo N.° 1278. Se han validado satisfactoriamente las 13 secciones obligatorias, evidenciándose una base técnica rigurosa en el planteamiento del problema, delimitación de procesos, estimación de residuos y acondicionamiento operativo.',
  hallazgos: [
    {
      id: 'hall-1',
      requisitoId: 'REQ-01',
      capitulo: '1. Introducción',
      requisitoTexto: '¿El documento incluye una sección estructurada de Introducción donde se plantee adecuadamente el problema ambiental de generación de residuos y la estrategia de abordaje con el Plan? (Puntos 1, 1A y 1B)',
      evidenciaEncontrada: 'Sección de Introducción desarrollada con diagnóstico preliminar, caracterización de la problemática de generación textil (1A) y estrategia de abordaje mediante economía circular, segregación y disposición autorizada (1B).',
      estado: 'Cumple',
      hallazgo: 'Introducción y diagnóstico de problemática plenamente conformes con los términos de referencia de la R.M. 089-2023-MINAM y D.L. 1278.',
      brecha: 'Ninguna',
      recomendacion: 'Mantener actualizado el planteamiento ante eventuales ampliaciones o incorporaciones de líneas de producto.',
      fuente: 'R.M. N.° 089-2023-MINAM & D.L. 1278 — Punto 1',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-2',
      requisitoId: 'REQ-02',
      capitulo: '2. Objetivos',
      requisitoTexto: 'Definición de objetivo general y objetivos específicos cuantificables de minimización y valorización.',
      evidenciaEncontrada: 'Objetivo general alineado a economía circular; metas cuantitativas de 8.5% en reducción y >60% en valorización con EO-RS.',
      estado: 'Cumple',
      hallazgo: 'Objetivos claros, medibles, temporales y consistentes con la jerarquía de residuos del D.L. 1278.',
      brecha: 'Ninguna',
      recomendacion: 'Evaluar semestralmente el cumplimiento de las metas porcentuales.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 2',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-3',
      requisitoId: 'REQ-03',
      capitulo: '3. Alcance',
      requisitoTexto: 'Delimitación física y operativa de instalaciones, áreas productivas, auxiliares, dotación de personal y turnos.',
      evidenciaEncontrada: 'Predio de 8,500 m², identificación de naves de tejeduría, tintorería, corte, almacenes, 120 trabajadores y doble turno.',
      estado: 'Cumple',
      hallazgo: 'Delimitación exhaustiva del ámbito de aplicación técnico y geográfico.',
      brecha: 'Ninguna',
      recomendacion: 'Actualizar ante cualquier ampliación física o nuevo turno de operación.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 3',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-4',
      requisitoId: 'REQ-04',
      capitulo: '4. Identificación, características y estimación de residuos sólidos',
      requisitoTexto: 'Inventario cuantificado de residuos sólidos peligrosos y no peligrosos sustentado técnicamente con balance de masa.',
      evidenciaEncontrada: 'Inventario con 6 corrientes cuantificadas (2,260 kg/mes) con códigos Anexo III D.S. 014-2017-MINAM y balance de materia.',
      estado: 'Cumple',
      hallazgo: 'Cuantificación y clasificación técnica rigurosa de residuos peligrosos (RESPEL) y no peligrosos.',
      brecha: 'Ninguna',
      recomendacion: 'Mantener el pesaje diario en bitácora foliada para la declaración SIGERSOL.',
      fuente: 'D.S. N.° 014-2017-MINAM Art. 34 / R.M. 089-2023-MINAM Sección 4',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-5',
      requisitoId: 'REQ-05',
      capitulo: '5. Estrategias para la prevención y/o minimización',
      requisitoTexto: 'Medidas concretas de minimización en origen y valorización material/energética con metas periódicas.',
      evidenciaEncontrada: 'Software CAD/CAM (reducción 8.5%), bobinas retornables en circuito cerrado (evita 3.6 t/año) y lubricación por micropulverización.',
      estado: 'Cumple',
      hallazgo: 'Alineamiento ejemplar con el Principio de Economía Circular y jerarquía de gestión del Art. 19 del D.L. 1278.',
      brecha: 'Ninguna',
      recomendacion: 'Monitorear semestralmente el ratio de valorización material reportado por la EO-RS.',
      fuente: 'D.L. N.° 1278 Art. 19 / R.M. 089-2023-MINAM Sección 5',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-6',
      requisitoId: 'REQ-06',
      capitulo: '6. Gestión y manejo de residuos sólidos',
      requisitoTexto: 'Segregación bajo NTP 900.058:2019, almacenamiento ATRP con contención estanca (110%) y EO-RS autorizadas con MMRP.',
      evidenciaEncontrada: '18 estaciones NTP 900.058, ATRP de 35 m² con dique de 1,200 L, kit antiderrames de 55 galones y EO-RS autorizadas (EcoSafe y Recicla Perú).',
      estado: 'Cumple',
      hallazgo: 'Cumplimiento exhaustivo de requerimientos técnicos de seguridad para almacenamiento y manejo.',
      brecha: 'Ninguna',
      recomendacion: 'Inspeccionar trimestralmente la válvula de drenaje del dique de contención.',
      fuente: 'D.S. N.° 014-2017-MINAM Arts. 52-54 / R.M. 089-2023-MINAM Sección 6',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-7',
      requisitoId: 'REQ-07',
      capitulo: '7. Descripción de las medidas ambientales',
      requisitoTexto: 'Medidas de mitigación y prevención de impactos ambientales (lixiviados, olores, vectores, suelo, ruido).',
      evidenciaEncontrada: 'Pisos epóxicos impermeables, retiro de orgánicos cada 48h, desinfección semanal acreditada y ventilación forzada antiexplosiva.',
      estado: 'Cumple',
      hallazgo: 'Medidas de mitigación y control de impactos ambientales integrales y operativamente viables.',
      brecha: 'Ninguna',
      recomendacion: 'Conservar los certificados de fumigación y saneamiento ambiental en el legajo técnico.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 7',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-8',
      requisitoId: 'REQ-08',
      capitulo: '8. Medidas de atención ante emergencias',
      requisitoTexto: 'Procedimientos operativos ante derrames de RESPEL, amagos de incendio, brigadas y flujograma de notificación a OEFA.',
      evidenciaEncontrada: 'POE-01 para derrames con kit de 55 galones, POE-02 con extintores PQS/CO2, brigada de 12 operarios y reporte a OEFA en 24h.',
      estado: 'Cumple',
      hallazgo: 'Protocolos de respuesta inmediata y equipamiento homologado plenamente acreditado.',
      brecha: 'Ninguna',
      recomendacion: 'Realizar simulacro anual de derrame de hidrocarburos con registro fotográfico.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 8',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-9',
      requisitoId: 'REQ-09',
      capitulo: '9. Indicadores de seguimiento y control',
      requisitoTexto: 'Batería de indicadores cuantitativos (Rg, %V, %RP, %S) y periodicidad de reporte ante el MINAM.',
      evidenciaEncontrada: 'Tablero mensual con 5 KPIs ambientales, metas matemáticas delimitadas y reporte en SIGERSOL No Municipal.',
      estado: 'Cumple',
      hallazgo: 'Indicadores matemáticos operacionales bien definidos y cronograma de control estructurado.',
      brecha: 'Ninguna',
      recomendacion: 'Presentar los reportes de KPIs en las sesiones ordinarias del Comité de SST.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 9',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-10',
      requisitoId: 'REQ-10',
      capitulo: '10. Cronograma de implementación',
      requisitoTexto: 'Cronograma anual estructurado con hitos mensuales de segregación, retiros de EO-RS y reporte en SIGERSOL.',
      evidenciaEncontrada: 'Gantt de 12 meses con retiros quincenales de reciclables, retiros trimestrales de RESPEL y declaración en marzo.',
      estado: 'Cumple',
      hallazgo: 'Planificación temporal realista y sincronizada con los plazos legales del MINAM.',
      brecha: 'Ninguna',
      recomendacion: 'Monitorear mensualmente el cumplimiento de hitos del cronograma.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 10',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-11',
      requisitoId: 'REQ-11',
      capitulo: '11. Presupuesto y recursos necesarios',
      requisitoTexto: 'Presupuesto desglosado en soles (S/) y asignación de recursos humanos y materiales para el PMMRS.',
      evidenciaEncontrada: 'Presupuesto formal de S/ 45,000 anuales desglosado en 5 partidas operativas y asignación de personal HSEQ.',
      estado: 'Cumple',
      hallazgo: 'Respaldo presupuestal y viabilidad económica plenamente garantizada.',
      brecha: 'Ninguna',
      recomendacion: 'Emitir orden de servicio preventiva para los contratos anuales de las EO-RS.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 11',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-12',
      requisitoId: 'REQ-12',
      capitulo: '12. Funciones del responsable de la gestión de residuos sólidos',
      requisitoTexto: 'Designación formal del profesional responsable y definición clara de sus funciones de supervisión y reporte.',
      evidenciaEncontrada: 'Designación del Ing. Miguel Ángel Torres (CIP 184520) con 6 funciones específicas de supervisión, bitácoras y SIGERSOL.',
      estado: 'Cumple',
      hallazgo: 'Asignación formal de responsabilidades directas y liderazgo técnico calificado.',
      brecha: 'Ninguna',
      recomendacion: 'Mantener actualizada la colegiatura y habilitación profesional del responsable.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 12',
      tipoHallazgo: 'Conforme'
    },
    {
      id: 'hall-13',
      requisitoId: 'REQ-13',
      capitulo: '13. Anexos',
      requisitoTexto: 'Inclusión de planos de distribución, flujogramas, hojas FDS/MSDS, autorizaciones EO-RS y modelos de bitácoras y manifiestos.',
      evidenciaEncontrada: '6 anexos técnicos detallados: Plano general, balance de masa, FDS de químicos, constancias EO-RS, bitácora y plan de capacitación.',
      estado: 'Cumple',
      hallazgo: 'Soporte documental técnico y legal exhaustivo y verificable.',
      brecha: 'Ninguna',
      recomendacion: 'Adjuntar copias impresas de los anexos en el expediente final del PMMRS.',
      fuente: 'R.M. N.° 089-2023-MINAM Sección 13',
      tipoHallazgo: 'Conforme'
    }
  ],
  swot: {
    fortalezas: [
      'Acreditación institucional completa de la empresa titular (Industrial Textil Andina S.A.C.) y personería legal.',
      'Definición de objetivos cuantificables alineados con la jerarquía de residuos y economía circular.',
      'Delimitación integral del alcance territorial, procesos productivos y dotación de 120 trabajadores.',
      'Inventario exhaustivo de 6 corrientes de residuos cuantificadas (2,260 kg/mes) con caracterización técnica y balance de materia.',
      'Estrategias de minimización en origen (CAD/CAM, reducción de 8.5%) y valorización con EO-RS superando el 64%.',
      'Almacén Temporal de Residuos Peligrosos (ATRP) acondicionado con piso epóxico, dique de contención para el 110% y kit antiderrames de 55 galones.',
      'Medidas ambientales de mitigación contra lixiviados, olores y vectores con cronograma de saneamiento.',
      'Plan de contingencias operativo con brigada de 12 miembros y procedimientos ante derrames e incendios.',
      'Batería de 5 indicadores de desempeño ambiental cuantificables y sincronización con SIGERSOL No Municipal.',
      'Cronograma Gantt de 12 meses y presupuesto formal aprobado de S/ 45,000 con desglose en 5 partidas.',
      'Designación formal del responsable técnico colegiado (Ing. CIP) y anexos documentales completos.'
    ],
    oportunidades: [
      'Postular a certificaciones de Producción Más Limpia y reconocimientos ambientales del MINAM y PRODUCE.',
      'Explorar nuevas alianzas estratégicas para la valorización energética o material de mermas sintéticas.',
      'Optimización de costos logísticos consolidando retiros periódicos con EO-RS autorizadas.'
    ],
    debilidades: [
      'Digitalizar el registro diario de pesaje mediante software en la nube para sincronización directa con SIGERSOL.'
    ],
    amenazas: [
      'Fiscalizaciones inopinadas de OEFA ante modificaciones no reportadas en las líneas de tejeduría.',
      'Fluctuaciones en los precios de mercado de materiales reciclables acopiados.'
    ]
  },
  conclusiones: [
    'El Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRSNM) presentado por Industrial Textil Andina S.A.C. presenta un nivel de cumplimiento estructural del 98% respecto a los estándares de la Resolución Ministerial N.° 089-2023-MINAM y el Decreto Legislativo N.° 1278. Se han validado satisfactoriamente las 13 secciones obligatorias del contenido mínimo oficial.',
    'Se verificó la adopción integral del código de colores NTP 900.058:2019, acondicionamiento de contención estanca (110%) en el ATRP, procedimientos de contingencia y plena articulación con Empresas Operadoras de Residuos Sólidos (EO-RS) autorizadas ante el MINAM.',
    'Dictamen Técnico: PROCEDE LA APROBACIÓN Y PRESENTACIÓN ANTE LA AUTORIDAD SECTORIAL Y PLATAFORMA SIGERSOL-SNM.'
  ],
  recomendaciones: [
    'Aprobar formalmente el PMMRS mediante resolución interna de gerencia.',
    'Presentar el PMMRS a través de la plataforma SIGERSOL-SNM del MINAM en el plazo correspondiente.',
    'Efectuar auditorías semestrales de seguimiento ambiental para verificar el cumplimiento del porcentaje de valorización y las metas de minimización.'
  ],
  porcentajeCumplimientoGeneral: 98,
  seccionesAprobadas: [
    '1. Introducción (Planteamiento del Problema y Abordaje)',
    '2. Objetivos Generales y Específicos',
    '3. Alcance Operacional y Delimitación de Instalaciones',
    '4. Identificación, Características y Estimación de Residuos Sólidos',
    '5. Estrategias para la Prevención y/o Minimización',
    '6. Gestión y Manejo de Residuos Sólidos (NTP 900.058, ATRP, EO-RS)',
    '7. Descripción de las Medidas Ambientales',
    '8. Medidas de Atención ante Emergencias (Plan de Contingencia)',
    '9. Indicadores de Seguimiento y Control',
    '10. Cronograma de Implementación',
    '11. Presupuesto y Recursos Necesarios',
    '12. Funciones del Responsable de la Gestión de Residuos',
    '13. Anexos Técnicos y Documentarios'
  ],
  seccionesObservadas: [],
  riesgosRegulatorios: [
    {
      id: 'rr-demo-1',
      seccionMinam: '6. Gestión y Manejo Operativo',
      hallazgoDebilidad: 'Inspección de rutina del dique de contención estanco del ATRP para verificar ausencia de fisuras.',
      riesgoRegulatorio: 'Preventivo: Asegurar la estanqueidad continua conforme al D.S. 014-2017-MINAM Art. 54.',
      gravedad: 'Baja',
      baseLegal: 'D.S. N.° 014-2017-MINAM Arts. 52-54'
    },
    {
      id: 'rr-demo-2',
      seccionMinam: '9. Indicadores de Seguimiento',
      hallazgoDebilidad: 'Monitoreo de asistencia del personal a los 4 módulos del programa de formación ambiental.',
      riesgoRegulatorio: 'Preventivo: Mantener registros foliados para supervisión ambiental ordinaria de OEFA/PRODUCE.',
      gravedad: 'Baja',
      baseLegal: 'R.M. N.° 089-2023-MINAM'
    }
  ],
  planAccionCorrectivo: [
    {
      id: 'ca-demo-1',
      seccionMinam: '5. Estrategias de Minimización',
      tipoEstrategia: 'DO (Reorientación)',
      hallazgoDebilidad: 'Corrientes de residuos no peligrosos con potencial de valorización económica y economía circular.',
      accionCorrectiva: 'Consolidar convenio con EO-RS Recicla Perú S.A.C. para valorización material de 1.4 Tn/mes de cartón, film y retazos.',
      indicadorOperacional: '(Tn de residuos valorizados / Tn total residuos generados) * 100',
      presupuestoCronograma: 'Costo neutro / Ingreso operativo por reciclables / Meses 1 a 12'
    },
    {
      id: 'ca-demo-2',
      seccionMinam: '9. Indicadores de Seguimiento',
      tipoEstrategia: 'DO (Reorientación)',
      hallazgoDebilidad: 'Integración y digitalización del tablero de control de métricas de residuos en tiempo real.',
      accionCorrectiva: 'Instituir tablero mensual de KPIs ambientales (Rg < 0.075 kg/kg, %V >= 60%) y reporte trimestral a Gerencia.',
      indicadorOperacional: '(N° reportes mensuales emitidos / 12) * 100',
      presupuestoCronograma: 'S/ 500 / Mes 1 en adelante'
    },
    {
      id: 'ca-demo-3',
      seccionMinam: '6. Gestión y Manejo Operativo',
      tipoEstrategia: 'DA (Supervivencia)',
      hallazgoDebilidad: 'Mantenimiento preventivo anual del recubrimiento epóxico del Almacén Central y ATRP.',
      accionCorrectiva: 'Ejecutar plan de mantenimiento preventivo y verificación de kits antiderrames de 55 galones.',
      indicadorOperacional: '(N° de inspecciones de seguridad conformes / N° programadas) * 100',
      presupuestoCronograma: 'S/ 8,500 en Sección 11 / Meses 1 y 7'
    }
  ],
  prioridadesInmediatas: [
    'Aprobar el PMMRS mediante resolución gerencial interna de la empresa titular.',
    'Ingresar formalmente el PMMRS a través de la plataforma SIGERSOL-SNM del MINAM.',
    'Iniciar la ejecución del cronograma anual y las 4 jornadas del Programa de Capacitación.'
  ],
  conclusionParrafo1: 'El Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRSNM) presentado por Industrial Textil Andina S.A.C. presenta un nivel de cumplimiento estructural del 98% respecto a los requisitos mínimos de la R.M. N.° 089-2023-MINAM y el D.L. N.° 1278. Se han validado satisfactoriamente las 13 secciones obligatorias del contenido mínimo oficial, demostrando una sólida estructuración técnica, identificación cuantitativa de flujos y plena articulación con empresas operadoras autorizadas (EO-RS).',
  conclusionParrafo2: 'Dictamen Técnico: PROCEDE LA APROBACIÓN Y PRESENTACIÓN ANTE LA AUTORIDAD SECTORIAL Y PLATAFORMA SIGERSOL-SNM. Se recomienda al titular formalizar el inicio del cronograma de actividades operativas con el presupuesto aprobado de S/ 45,000.00 y continuar con el monitoreo mensual de indicadores de valorización material.'
};

export function createBlankPlan(): PMMRSPlan {
  return {
    id: `plan-${Date.now()}`,
    titulo: 'Plan de Minimización y Manejo de Residuos Sólidos No Municipales',
    estado: 'Borrador',
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaModificacion: new Date().toISOString().split('T')[0],
    version: '1.0',
    company: {
      razonSocial: '',
      ruc: '',
      nombreComercial: '',
      domicilio: '',
      departamento: '',
      provincia: '',
      distrito: '',
      representanteLegal: '',
      dniRepresentante: '',
      actividadEconomica: '',
      sector: '',
      numeroTrabajadores: 0,
      horarioOperacion: '',
      correoContacto: '',
      telefonoContacto: ''
    },
    header: {
      logoUrl: '',
      razonSocialHeader: '',
      tituloDocumento: 'PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES (PMMRS)',
      version: 'Versión 1.0 - 2026',
      fechaEmision: new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }),
      elaboradoPor: '',
      revisadoPor: '',
      aprobadoPor: ''
    },
    residuos: [],
    capitulos: [
      { id: 'cap-1', numero: 1, titulo: '1. Introducción', contenido: '', completado: false },
      { id: 'cap-2', numero: 2, titulo: '2. Objetivos', contenido: '', completado: false },
      { id: 'cap-3', numero: 3, titulo: '3. Alcance', contenido: '', completado: false },
      { id: 'cap-4', numero: 4, titulo: '4. Identificación, características y estimación de residuos sólidos', contenido: '', completado: false },
      { id: 'cap-5', numero: 5, titulo: '5. Estrategias para la prevención y/o minimización', contenido: '', completado: false },
      { id: 'cap-6', numero: 6, titulo: '6. Gestión y manejo de residuos sólidos', contenido: '', completado: false },
      { id: 'cap-7', numero: 7, titulo: '7. Descripción de las medidas ambientales', contenido: '', completado: false },
      { id: 'cap-8', numero: 8, titulo: '8. Medidas de atención ante emergencias', contenido: '', completado: false },
      { id: 'cap-9', numero: 9, titulo: '9. Indicadores de seguimiento y control', contenido: '', completado: false },
      { id: 'cap-10', numero: 10, titulo: '10. Cronograma de implementación', contenido: '', completado: false },
      { id: 'cap-11', numero: 11, titulo: '11. Presupuesto y recursos necesarios', contenido: '', completado: false },
      { id: 'cap-12', numero: 12, titulo: '12. Funciones del responsable de la gestión y manejo de residuos sólidos', contenido: '', completado: false },
      { id: 'cap-13', numero: 13, titulo: '13. Anexos', contenido: '', completado: false }
    ],
    presupuestoTotal: 0,
    esDemo: false
  };
}

export function createBlankReviewReport(plan?: PMMRSPlan): ReviewReport {
  if (plan) {
    return runSpecializedAudit(plan, plan.header?.elaboradoPor || 'Auditor Especialista Ambiental');
  }
  const blankPlan = createBlankPlan();
  return runSpecializedAudit(blankPlan, 'Auditor Especialista Ambiental');
}
