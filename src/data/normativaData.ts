import { NormativeDocument, MasterRequirement } from '../types';

export const NORMATIVE_DOCUMENTS: NormativeDocument[] = [
  {
    id: 'norm-1',
    categoria: 'Leyes y Decretos Legislativos',
    nombre: 'Ley de Gestión Integral de Residuos Sólidos',
    numero: 'Decreto Legislativo N.° 1278',
    fecha: '2016-12-23',
    entidad: 'Ministerio del Ambiente (MINAM)',
    descripcion: 'Establece la política nacional de gestión integral de residuos sólidos orientada a la prevención o minimización de la generación en origen.',
    enlace: 'https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H1170361',
    versionUtilizada: 'Texto vigencia actual con modificatorias D.L. N.° 1501'
  },
  {
    id: 'norm-2',
    categoria: 'Reglamentos',
    nombre: 'Reglamento del Decreto Legislativo N.° 1278',
    numero: 'Decreto Supremo N.° 014-2017-MINAM',
    fecha: '2017-12-21',
    entidad: 'Ministerio del Ambiente (MINAM)',
    descripcion: 'Reglamento que regula la gestión y manejo de residuos sólidos a nivel nacional, incluyendo las obligaciones para generadores de residuos no municipales.',
    enlace: 'https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H1196437',
    versionUtilizada: 'Actualizado con D.S. N.° 001-2022-MINAM'
  },
  {
    id: 'norm-3',
    categoria: 'Resoluciones Ministeriales',
    nombre: 'Contenido Mínimo del Plan de Minimización y Manejo de Residuos Sólidos No Municipales',
    numero: 'Resolución Ministerial N.° 089-2023-MINAM',
    fecha: '2023-03-24',
    entidad: 'Ministerio del Ambiente (MINAM)',
    descripcion: 'Aprueba el formato y contenido mínimo oficial para la elaboración y presentación del PMMRS para actividades productivas, extractivas y de servicios.',
    enlace: 'https://www.gob.pe/institucion/minam/normas-legales/3980927-089-2023-minam',
    versionUtilizada: 'Versión vigente oficial MINAM'
  },
  {
    id: 'norm-4',
    categoria: 'Normas Técnicas',
    nombre: 'Gestión de residuos. Código de colores para el almacenamiento de residuos sólidos',
    numero: 'NTP 900.058:2019',
    fecha: '2019-03-28',
    entidad: 'INACAL',
    descripcion: 'Establece los colores obligatorios para los dispositivos de almacenamiento de residuos sólidos (Verde, Azul, Amarillo, Blanco, Marrón, Plomo, Rojo).',
    enlace: 'https://servicios.inacal.gob.pe/cidalerta/biblioteca-detalle.aspx?id=28586',
    versionUtilizada: '2da Edición'
  },
  {
    id: 'norm-5',
    categoria: 'Guías y Documentos Técnicos',
    nombre: 'Plataforma y Lineamientos Oficiales PMMRS - SNM',
    numero: 'Portal Web Oficial MINAM',
    fecha: '2023-2026',
    entidad: 'Dirección General de Gestión de Residuos Sólidos - MINAM',
    descripcion: 'Guías técnicas metodológicas para la estimación de generación, caracterización y presentación a través de SIGERSOL.',
    enlace: 'https://site2.minam.gob.pe/pmmrs_snm',
    versionUtilizada: 'Versión institucional actualizada'
  }
];

export const MASTER_REQUIREMENTS: MasterRequirement[] = [
  {
    id: 'REQ-01',
    capitulo: 1,
    capituloNombre: '1. Introducción',
    subcapitulo: '1.1 Planteamiento y Abordaje del Problema',
    requisito: 'Presentar la introducción general del Plan de Minimización y Manejo de Residuos Sólidos No Municipales, describiendo el planteamiento del problema y la estrategia de abordaje con el Plan.',
    fuente: 'R.M. N.° 089-2023-MINAM & D.L. 1278 — Punto 1',
    tipo: 'Contenido mínimo',
    informacionRequerida: 'Planteamiento del problema ambiental de generación de residuos y estrategia integral de abordaje con el Plan.',
    evidenciaEsperada: 'Descripción clara de la problemática de residuos en las actividades y el enfoque técnico de abordaje con el Plan.'
  },
  {
    id: 'REQ-02',
    capitulo: 2,
    capituloNombre: '2. Objetivos',
    subcapitulo: '2.1 Objetivos Generales y Específicos',
    requisito: 'Objetivo general orientado a la economía circular y objetivos específicos con metas cuantitativas medibles (% reducción y % valorización).',
    fuente: 'R.M. N.° 089-2023-MINAM Sección 2 / D.L. 1278 Art. 19',
    tipo: 'Contenido mínimo',
    informacionRequerida: 'Objetivos cuantitativos y horizonte temporal del plan.',
    evidenciaEsperada: 'Metas porcentuales de reducción y valorización material.'
  },
  {
    id: 'REQ-03',
    capitulo: 3,
    capituloNombre: '3. Alcance',
    subcapitulo: '3.1 Delimitación Operativa y Geográfica',
    requisito: 'Delimitación del área de influencia directa, predios (m²), áreas productivas, talleres, almacenes, dotación de trabajadores y régimen de turnos.',
    fuente: 'R.M. N.° 089-2023-MINAM Sección 3',
    tipo: 'Información descriptiva',
    informacionRequerida: 'Áreas operativas, cantidad de trabajadores y horarios laborales.',
    evidenciaEsperada: 'Delimitación espacial y operacional detallada en el Capítulo 3.'
  },
  {
    id: 'REQ-04',
    capitulo: 4,
    capituloNombre: '4. Identificación, características y estimación de residuos sólidos',
    subcapitulo: '4.1 Caracterización y Estimación Cuantitativa',
    requisito: 'Inventario cuantificado de residuos peligrosos (códigos Anexo III D.S. 014-2017-MINAM) y no peligrosos en kg/mes y t/año, con balance de materia por proceso.',
    fuente: 'R.M. N.° 089-2023-MINAM Sección 4 / D.S. 014-2017-MINAM Art. 34',
    tipo: 'Cálculo',
    informacionRequerida: 'Cuadro de generación detallado por tipo, código de peligrosidad y balance de masa.',
    evidenciaEsperada: 'Matriz de generación de residuos sólidos y resultados de caracterización.'
  },
  {
    id: 'REQ-05',
    capitulo: 5,
    capituloNombre: '5. Estrategias para la prevención y/o minimización',
    subcapitulo: '5.1 Medidas en Origen y Economía Circular',
    requisito: 'Acciones concretas para reducir la generación de residuos en origen y valorización con metas periódicas sustentadas en el Art. 19 del D.L. 1278.',
    fuente: 'D.L. 1278 Art. 19 / R.M. 089-2023-MINAM Sección 5',
    tipo: 'Requisito normativo',
    informacionRequerida: 'Programas de minimización, ecoeficiencia, sustitución de insumos y metas de reducción.',
    evidenciaEsperada: 'Programas de minimización en origen y convenios de valorización.'
  },
  {
    id: 'REQ-06',
    capitulo: 6,
    capituloNombre: '6. Gestión y manejo de residuos sólidos',
    subcapitulo: '6.1 Segregación, Almacenamiento, Transporte y EO-RS',
    requisito: 'Segregación bajo NTP 900.058:2019, ATRP con dique estanco al 110%, kit antiderrames, rutas internas y entrega exclusiva a EO-RS autorizadas con MMRP.',
    fuente: 'NTP 900.058:2019 / D.S. 014-2017-MINAM Arts. 52-54 / R.M. 089-2023-MINAM Sección 6',
    tipo: 'Requisito técnico',
    informacionRequerida: 'Descripción de contenedores NTP, planos de ATRP, diques, contratos de EO-RS y manifiestos.',
    evidenciaEsperada: 'Planos de ATRP, diques de contención y registros de EO-RS autorizadas.'
  },
  {
    id: 'REQ-07',
    capitulo: 7,
    capituloNombre: '7. Descripción de las medidas ambientales',
    subcapitulo: '7.1 Mitigación y Prevención de Impactos',
    requisito: 'Medidas para el control de lixiviados, vectores, olores, emisiones de vapores, ruido y protección del suelo.',
    fuente: 'R.M. 089-2023-MINAM Sección 7',
    tipo: 'Requisito técnico',
    informacionRequerida: 'Protocolos de saneamiento ambiental, impermeabilización y ventilación cruzada/forzada.',
    evidenciaEsperada: 'Capítulo de medidas ambientales preventivas y de mitigación.'
  },
  {
    id: 'REQ-08',
    capitulo: 8,
    capituloNombre: '8. Medidas de atención ante emergencias',
    subcapitulo: '8.1 Plan de Contingencia y Respuesta a Emergencias',
    requisito: 'Procedimientos operativos estandarizados (POE) ante derrames de RESPEL, amagos de incendio, sismos, kit antiderrames de 55 galones, brigadas y reporte a OEFA en 24h.',
    fuente: 'R.M. 089-2023-MINAM Sección 8 / Ley 29783',
    tipo: 'Requisito técnico',
    informacionRequerida: 'Protocolos de respuesta, kits antiderrames, EPPs de brigada y flujograma de notificación.',
    evidenciaEsperada: 'Procedimientos POE de contingencia y flujograma de notificación oficial.'
  },
  {
    id: 'REQ-09',
    capitulo: 9,
    capituloNombre: '9. Indicadores de seguimiento y control',
    subcapitulo: '9.1 Tablero de Control de KPIs y SIGERSOL',
    requisito: 'Definición de fórmulas matemáticas y metas para ratios de generación (Rg), porcentaje de valorización (%V), porcentaje de RESPEL (%RP), índice de segregación (%S) y reporte en SIGERSOL.',
    fuente: 'R.M. 089-2023-MINAM Sección 9',
    tipo: 'Cálculo',
    informacionRequerida: 'Fórmulas de KPIs, valores meta, frecuencia de cálculo y sustento SIGERSOL-SNM.',
    evidenciaEsperada: 'Tablero de control de KPIs ambientales del PMMRS.'
  },
  {
    id: 'REQ-10',
    capitulo: 10,
    capituloNombre: '10. Cronograma de implementación',
    subcapitulo: '10.1 Cronograma Gantt de 12 Meses',
    requisito: 'Programación mes a mes de pesaje continuo, retiros de reciclables y RESPEL por EO-RS, mantenimiento preventivo de ATRP y presentación anual en SIGERSOL.',
    fuente: 'R.M. 089-2023-MINAM Sección 10',
    tipo: 'Contenido mínimo',
    informacionRequerida: 'Gantt anual con hitos operacionales y plazos legales.',
    evidenciaEsperada: 'Cronograma anual de actividades operativas del PMMRS.'
  },
  {
    id: 'REQ-11',
    capitulo: 11,
    capituloNombre: '11. Presupuesto y recursos necesarios',
    subcapitulo: '11.1 Partidas Presupuestales en Soles (S/)',
    requisito: 'Presupuesto económico anual formalmente aprobado desglosado en partidas (EO-RS, infraestructura de ATRP, contenedores NTP 900.058, EPPs, capacitación).',
    fuente: 'R.M. 089-2023-MINAM Sección 11',
    tipo: 'Cálculo',
    informacionRequerida: 'Desglose de costos anuales y sustento de viabilidad presupuestal.',
    evidenciaEsperada: 'Cuadro presupuestal con partidas y monto total en soles.'
  },
  {
    id: 'REQ-12',
    capitulo: 12,
    capituloNombre: '12. Funciones del responsable de la gestión de residuos sólidos',
    subcapitulo: '12.1 Perfil y Responsabilidades del Encargado',
    requisito: 'Designación formal del profesional a cargo de los residuos (colegiatura/CIP), con facultades de supervisión operativa, custodia de bitácoras/manifiestos y reporte en SIGERSOL.',
    fuente: 'R.M. 089-2023-MINAM Sección 12',
    tipo: 'Requisito normativo',
    informacionRequerida: 'Identificación formal del responsable técnico y detalle de sus funciones legales.',
    evidenciaEsperada: 'Carta o designación formal con detalle de funciones asignadas.'
  },
  {
    id: 'REQ-13',
    capitulo: 13,
    capituloNombre: '13. Anexos',
    subcapitulo: '13.1 Documentación Técnica y Legal de Soporte',
    requisito: 'Inclusión de planos de zonificación y estaciones, diagramas de flujo de proceso con balance, hojas FDS/MSDS, autorizaciones vigentes de EO-RS ante MINAM y modelos de bitácora y MMRP.',
    fuente: 'R.M. 089-2023-MINAM Sección 13',
    tipo: 'Evidencia',
    informacionRequerida: 'Planos, diagramas, certificados y formatos operativos de respaldo.',
    evidenciaEsperada: 'Anexos completos numerados del 1 al 6.'
  }
];
