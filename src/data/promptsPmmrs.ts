/**
 * Prompts Oficiales y Estructura Técnica Mínima para PMMRSNM
 * Conforme a la Resolución Ministerial N.° 089-2023-MINAM, Decreto Legislativo N.° 1278
 * y Decreto Supremo N.° 014-2017-MINAM.
 */

export interface ChapterGuideline {
  numero: number;
  titulo: string;
  subtitulos: string[];
  descripcionNormativa: string;
  criteriosClave: string[];
  ejemploTexto: string;
}

export const OFFICIAL_13_CHAPTERS: ChapterGuideline[] = [
  {
    numero: 1,
    titulo: '1. Introducción',
    subtitulos: ['1.1 Planteamiento del problema', '1.2 Abordaje del problema con el Plan'],
    descripcionNormativa: 'Presentación del problema ambiental o la necesidad de gestión de residuos en el marco de las actividades del proyecto, y explicación de la estrategia general con la cual el Plan abordará el problema identificado mediante acciones de minimización y manejo seguro conforme a la R.M. 089-2023-MINAM y el D.L. 1278.',
    criteriosClave: [
      'Planteamiento claro y caracterización del problema ambiental de generación de residuos',
      'Explicación de cómo el Plan abordará el problema mediante acciones de prevención y manejo seguro',
      'Sustento técnico bajo la jerarquía de residuos del D.L. 1278 y R.M. 089-2023-MINAM'
    ],
    ejemploTexto: `1. Introducción

1.1 Planteamiento del Problema
En el desarrollo de las actividades operativas y procesos auxiliares de la organización se generan de forma continua diversas corrientes de residuos sólidos no municipales, tanto peligrosos (derivados del mantenimiento electromecánico de maquinarias, lubricantes, solventes y elementos contaminados) como no peligrosos (mermas de materias primas, plásticos, cartón de embalaje y residuos orgánicos). La ausencia de una gestión integral y preventiva en la fuente expone a la instalación a riesgos potenciales de acumulación, sobrecostos operativos por pérdidas de materiales, impactos negativos sobre el suelo y el entorno ambiental, así como riesgos ante contingencias o derrames. Por consiguiente, surge la necesidad técnica y ambiental impostergable de implementar un instrumento operativo que ordene, cuantifique y supervise el ciclo completo de los residuos sólidos generados, garantizando la prevención de la contaminación y la sostenibilidad de las operaciones.

1.2 Abordaje del Problema con el Plan de Minimización y Manejo de Residuos Sólidos No Municipales
El presente Plan de Minimización y Manejo de Residuos Sólidos No Municipales aborda la problemática identificada mediante la aplicación sistemática de los principios y jerarquías establecidos en el Decreto Legislativo N.° 1278 (Ley de Gestión Integral de Residuos Sólidos) y su Reglamento aprobado por D.S. N.° 014-2017-MINAM, estructurándose bajo los lineamientos obligatorios de la Resolución Ministerial N.° 089-2023-MINAM.

La estrategia de abordaje del Plan se estructura en tres ejes de acción:
1) Prevención y Minimización en Origen: Adopción de buenas prácticas de ecodiseño, sustitución de insumos críticos y optimización de rendimientos para evitar la generación de descartes.
2) Valorización y Economía Circular: Segregación rigurosa en la fuente según la NTP 900.058:2019, priorizando el reaprovechamiento material y energético a través de Empresas Operadoras de Residuos Sólidos (EO-RS) autorizadas.
3) Manejo Seguro y Control Ambiental: Acondicionamiento en áreas autorizadas y Almacén Temporal de Residuos Peligrosos (ATRP) dotado de dique de contención estanco, señalización normalizada, respuesta rápida ante emergencias y disposición final exclusiva en celdas autorizadas por el MINAM.`
  },
  {
    numero: 2,
    titulo: '2. Objetivos',
    subtitulos: ['2.1 Acciones para prevenir y minimizar en la fuente', '2.2 Acciones para gestión y manejo de ya generados', '2.3 Propósito central del Plan'],
    descripcionNormativa: 'Definición de metas orientadas a prevenir y minimizar la generación de residuos sólidos en la fuente, acciones para la gestión y manejo seguro de los residuos generados, y enunciado sucinto del propósito central del Plan.',
    criteriosClave: [
      'Acciones orientadas a prevenir y minimizar la generación en la fuente',
      'Acciones de gestión y manejo integral de los residuos ya generados',
      'Propósito central del Plan enunciado en forma sucinta apuntando a los logros esperados'
    ],
    ejemploTexto: `2. Objetivos

2.1 Acciones orientadas a prevenir y minimizar la generación de residuos sólidos
- Optimizar el consumo de insumos y materias primas en las líneas de proceso para reducir mermas y descartes en origen.
- Implementar embalajes retornables en circuito cerrado con proveedores, reduciendo la generación de residuos de empaque.
- Fomentar la ecoeficiencia y las buenas prácticas operativas en todos los puestos de trabajo.

2.2 Acciones para la gestión y manejo de residuos sólidos ya generados
- Implementar y sostener la segregación al 100% en la fuente conforme al código de colores de la NTP 900.058:2019.
- Acondicionar y custodiar los residuos peligrosos en el Almacén Temporal de Residuos Peligrosos (ATRP) con dique estanco al 110%.
- Garantizar que el transporte, valorización y disposición final sean efectuados por Empresas Operadoras (EO-RS) registradas ante el MINAM, emitiendo Manifiestos MMRP.

2.3 Propósito Central del Plan
Garantizar la gestión integral, eficiente y ambientalmente segura de los residuos sólidos no municipales de la actividad, promoviendo el aprovechamiento de recursos bajo el Principio de Economía Circular y previniendo cualquier riesgo de contaminación hacia el personal y el entorno.`
  },
  {
    numero: 3,
    titulo: '3. Alcance',
    subtitulos: ['3.1 Ámbito geográfico e instalaciones (operativas y administrativas)', '3.2 Etapas del proyecto consideradas', '3.3 Obligatoriedad para personal, contratistas y visitantes'],
    descripcionNormativa: 'Delimitación del ámbito físico y operativo donde se aplican las acciones del Plan (áreas administrativa y operativa), etapas del proyecto consideradas y declaración explícita de obligatoriedad.',
    criteriosClave: [
      'Delimitación del ámbito físico (instalaciones operativas, talleres, almacenes y oficinas)',
      'Etapas del ciclo de vida consideradas (planificación, construcción, operación, mantenimiento, cierre)',
      'Aplicación obligatoria vinculante para trabajadores propios, contratistas y visitantes'
    ],
    ejemploTexto: `3. Alcance

3.1 Ámbito de Aplicación
El presente Plan aplica a la totalidad de las instalaciones de la sede, abarcando las áreas operativas (salas de proceso, líneas de ensamblaje, talleres de mantenimiento electromecánico, almacén de materias primas y Almacén Temporal de Residuos Peligrosos - ATRP) y las áreas administrativas (oficinas de gerencia, comedores, vestuarios y garita de control).

3.2 Etapas del Proyecto Consideradas
Las disposiciones de este Plan aplican a la fase de Operación continua y a las actividades periódicas de Mantenimiento mayor de maquinarias e instalaciones, previendo los lineamientos para futuras ampliaciones o eventual etapa de Cierre/Abandono.

3.3 Obligatoriedad y Cumplimiento
El cumplimiento de las directrices de este Plan tiene carácter estrictamente obligatorio para todo el personal permanente y temporal de la empresa, así como para proveedores, contratistas de servicios y visitantes.`
  },
  {
    numero: 4,
    titulo: '4. Diagnóstico de residuos sólidos',
    subtitulos: ['4.1 Identificación de fuentes de generación', '4.2 Caracterización de residuos sólidos', '4.3 Estimación de la generación de residuos'],
    descripcionNormativa: 'Diagnóstico integral de la generación de residuos sólidos: diagrama de flujo de procesos con puntos de generación (4.1), caracterización física, química y de peligrosidad diferenciando ámbito municipal y no municipal (4.2), y estimación cuantitativa de masa y volumen por etapas (4.3).',
    criteriosClave: [
      'Diagrama de flujo simplificado con entradas, salidas y puntos de generación',
      'Caracterización agrupada por peligrosidad (peligrosos y no peligrosos) y ámbito (no municipal y municipal)',
      'Estimación cuantitativa de masa (kg/día, t/año) y volumen (L, m³) por tipo de residuo'
    ],
    ejemploTexto: `4. Diagnóstico de residuos sólidos

4.1 Identificación de fuentes de generación
Se identifican las fuentes de generación a partir del mapeo del proceso productivo mediante un diagrama de flujo simplificado:
- Proceso 1 (Recepción y Almacenamiento): Generación de cartón, zunchos plásticos y parihuelas de madera.
- Proceso 2 (Manufactura / Operación): Generación de recortes, mermas de proceso y descartes.
- Proceso 3 (Mantenimiento Mecánico y Eléctrico): Generación de aceites lubricantes usados, trapos con solventes y filtros contaminados.
- Proceso 4 (Áreas Administrativas y Comedor): Generación de papel de oficina, envases plásticos y restos de alimentos.

4.2 Caracterización de residuos sólidos
Los residuos generados se clasifican en:
a) Residuos No Peligrosos (Gestión No Municipal y Municipal asimilable): Papel y cartón, plásticos valorizables, restos orgánicos de alimentación y residuos de barrido general.
b) Residuos Peligrosos (RESPEL): Aceites usados (B0190), paños contaminados con hidrocarburos (A4140), baterías agotadas y envases de reactivos químicos.

4.3 Estimación cuantitativa de generación
Con base en registros históricos y pesajes de línea base, se proyecta una generación de 2,260.00 kg/mes (27.12 t/año), desglosada en 2,020.00 kg/mes de no peligrosos y 240.00 kg/mes de peligrosos, registrados en cuadros de masa y volumen.`
  },
  {
    numero: 5,
    titulo: '5. Medidas de prevención y minimización',
    subtitulos: ['5.1 Prevención y minimización en la fuente', '5.2 Alternativas de material de descarte', '5.3 Bienes priorizados'],
    descripcionNormativa: 'Procedimientos y técnicas de prevención en la fuente (5.1), evaluación de reaprovechamiento de material de descarte bajo economía circular y su ficha técnica (5.2), y gestión de bienes priorizados sujetos a regímenes especiales (5.3).',
    criteriosClave: [
      'Técnicas de prevención en la fuente (sustitución de insumos, ecodiseño, optimización)',
      'Evaluación de material de descarte bajo enfoque de economía circular con ficha descriptiva',
      'Identificación y manejo de bienes priorizados (RAEE, neumáticos fuera de uso, envases especiales)'
    ],
    ejemploTexto: `5. Medidas de prevención y minimización

5.1 Prevención y minimización en la fuente
Se aplican procedimientos técnicos orientados a reducir la generación de residuos en origen:
- Optimización digital de procesos de corte y patronaje para reducir mermas en 8.5%.
- Sustitución progresiva de solventes clorados por desengrasantes acuosos biodegradables.
- Implementación de lubricación por micropulverización para extender la vida útil de lubricantes.

5.2 Alternativas de material de descarte (Economía Circular)
Se evalúa el aprovechamiento de materiales de descarte como subproductos e insumos secundarios para otras cadenas productivas, registrando en ficha técnica: actividad de origen, características físicas, volumen estimado y logística de entrega en circuito cerrado.

5.3 Bienes priorizados
Se identifican los bienes priorizados sujetos a metas de recolección y valorización (RAEE proveniente de equipos de cómputo y Neumáticos Fuera de Uso - NFU de vehículos utilitarios), los cuales se acopian por separado para su entrega a sistemas colectivos o individuales autorizados.`
  },
  {
    numero: 6,
    titulo: '6. Operaciones de manejo',
    subtitulos: [
      '6.a Segregación',
      '6.b Recolección',
      '6.c Almacenamiento',
      '6.d Transporte',
      '6.e Acondicionamiento',
      '6.f Valorización',
      '6.g Tratamiento',
      '6.h Disposición final'
    ],
    descripcionNormativa: 'Desarrollo técnico y secuencial de las 8 operaciones obligatorias de manejo de residuos sólidos conforme a la R.M. 089-2023-MINAM, el D.L. 1278 y la NTP 900.058:2019.',
    criteriosClave: [
      '6.a Segregación en origen según código de colores NTP 900.058:2019',
      '6.b Recolección interna con frecuencias, rutas y equipos adecuados',
      '6.c Almacenamiento primario y Almacén Temporal de Residuos Peligrosos (ATRP) con dique estanco',
      '6.d Transporte externo mediante Empresas Operadoras (EO-RS) autorizadas',
      '6.e Acondicionamiento (compactado, triturado, enfardado si aplica)',
      '6.f Opciones de valorización material o energética',
      '6.g Tratamiento previo (si aplica)',
      '6.h Disposición final en rellenos sanitarios o de seguridad autorizados por MINAM'
    ],
    ejemploTexto: `6. Operaciones de manejo

6.a Segregación: Se efectúa en el punto de generación en estaciones de residuos rotuladas bajo la NTP 900.058:2019 (Azul, Blanco, Marrón, Plomo y Rojo para peligrosos).
6.b Recolección: Recolección interna en rutas señalizadas en horarios preestablecidos, empleando carritos de transporte herméticos.
6.c Almacenamiento: Los residuos no peligrosos se custodian en el almacén central de aprovechables; los peligrosos en el Almacén Temporal de Residuos Peligrosos (ATRP) de 35 m², techado, con piso epóxico impermeable, dique de contención estanco al 110% de capacidad, extintor PQS, kit antiderrames y Hojas FDS.
6.d Transporte: El transporte externo es contratado exclusivamente con Empresas Operadoras de Residuos Sólidos (EO-RS) registradas ante el MINAM, con vehículos autorizados y guías de remisión.
6.e Acondicionamiento: Se realiza compactación de cajas de cartón y enfardado de plásticos para optimizar el volumen acopiado.
6.f Valorización: Entrega de residuos aprovechables segregados a plantas de reciclaje y valorización agronómica autorizadas.
6.g Tratamiento: Los residuos peligrosos no aprovechables reciben tratamiento de estabilización previo cuando así lo exija su naturaleza por parte de la EO-RS.
6.h Disposición final: Los residuos no aprovechables se disponen en rellenos sanitarios y los peligrosos en celdas de seguridad de infraestructuras autorizadas por el MINAM, con emisión de Manifiestos de Manejo de Residuos Peligrosos (MMRP).`
  },
  {
    numero: 7,
    titulo: '7. Medidas preventivas, mitigadoras y/o correctivas',
    subtitulos: ['7.1 Control de lixiviados y derrames', '7.2 Control de olores y vectores', '7.3 Limpieza y mantenimiento de instalaciones'],
    descripcionNormativa: 'Resumen estructurado de las medidas ambientales para prevenir, mitigar y corregir impactos por derrames, lixiviados, malos olores y proliferación de vectores en las áreas de manejo de residuos.',
    criteriosClave: [
      'Medidas para evitar infiltraciones al suelo y cuerpos de agua',
      'Control de olores molestos y programa de desinfección/desratización',
      'Protocolos de limpieza periódica de contenedores y almacenes'
    ],
    ejemploTexto: `7. Medidas preventivas, mitigadoras y/o correctivas

Se implementan las siguientes medidas ambientales:
- Pisos impermeables y dique de contención en el ATRP para impedir derrames o filtraciones al subsuelo.
- Retiro interdiario de residuos orgánicos y limpieza con desinfectantes biodegradables para prevenir olores y proliferación de vectores.
- Programa trimestral de fumigación y control de plagas en todas las áreas de almacenamiento de residuos.
- Mantenimiento e inspección semanal de contenedores para asegurar su hermeticidad.`
  },
  {
    numero: 8,
    titulo: '8. Plan de contingencias',
    subtitulos: ['8.1 Identificación de escenarios de riesgo', '8.2 Medidas antes, durante y después del incidente', '8.3 Equipamiento, brigadas y comunicación'],
    descripcionNormativa: 'Protocolo de respuesta ante emergencias ambientales vinculadas al manejo de residuos (derrames de RESPEL, amagos de incendio, volcaduras), detallando acciones en tres fases: Antes (prevención), Durante (intervención) y Después (remediación).',
    criteriosClave: [
      'Identificación y caracterización de escenarios de riesgo de incidentes con residuos',
      'Procedimientos detallados: Antes (preventivo), Durante (respuesta) y Después (saneamiento)',
      'Equipamiento de respuesta (kits antiderrames, extintores) y comunicación a OEFA dentro de 24 h'
    ],
    ejemploTexto: `8. Plan de contingencias

8.1 Identificación de Escenarios de Emergencia
Se identifican como principales riesgos: derrames de aceites lubricantes o reactivos en almacén/transporte interno, e incendios en almacenes de cartón/plásticos.

8.2 Medidas de Atención
- Antes (Prevención): Inspecciones diarias de envases, verificación de extintores y kit antiderrames de 55 galones, y capacitaciones semestrales a la brigada.
- Durante (Intervención): Corte inmediato de la fuente de fuga, confinamiento perimetral con cordones absorbentes, uso de EPP y reporte a la jefatura de seguridad.
- Después (Remediación): Recojo de material contaminado en bolsas rojas para su custodia en ATRP, saneamiento de la zona afectada y notificación formal a OEFA dentro de las 24 horas.`
  },
  {
    numero: 9,
    titulo: '9. Programa de monitoreo y control',
    subtitulos: ['9.1 Actividades de inspección y auditorías internas', '9.2 Indicadores clave de desempeño (KPI)', '9.3 Reporte y registro en SIGERSOL No Municipal'],
    descripcionNormativa: 'Sistema de seguimiento, inspecciones periódicas y definición de indicadores clave de desempeño (KPI) para verificar el cumplimiento del Plan y sustentar la declaración en SIGERSOL-SNM.',
    criteriosClave: [
      'Programa de inspecciones periódicas y verificación de compromisos asumidos',
      'Indicadores cuantitativos: % de valorización, generación per cápita, ratio de peligrosidad',
      'Bitácora de registro diario y reporte en plataforma SIGERSOL'
    ],
    ejemploTexto: `9. Programa de monitoreo y control

9.1 Actividades Periódicas de Verificación
- Inspecciones semanales del estado operativo de contenedores y ATRP.
- Auditorías internas semestrales de cumplimiento de compromisos del PMMRS.

9.2 Indicadores Clave de Desempeño (KPI)
1) Ratio de Generación Específica: Rg = (kg residuos generados / unidad de producción).
2) Porcentaje de Valorización Material: %V = (kg valorizados / kg no peligrosos generados) * 100 (Meta >= 60%).
3) Ratio de Residuos Peligrosos: %RP = (kg RESPEL / kg totales generados) * 100 (Meta <= 11%).
4) N° de incidentes o derrames registrados por año (Meta = 0).

9.3 Reporte y Registro
Registro diario en bitácora de pesaje para alimentar la Declaración Anual de Manejo de Residuos en la plataforma SIGERSOL-SNM del MINAM.`
  },
  {
    numero: 10,
    titulo: '10. Cronograma',
    subtitulos: ['10.1 Programación mensual de actividades', '10.2 Frecuencia de retiros por EO-RS', '10.3 Hitos de reporte oficial'],
    descripcionNormativa: 'Programación temporal de implementación de las medidas y actividades ambientales del Plan (diagrama de Gantt mensual o trimestral).',
    criteriosClave: [
      'Cronograma mensualizado de todas las actividades ambientales',
      'Frecuencias de inspección, mantenimiento y capacitaciones programadas',
      'Hitos de reporte ante la autoridad ambiental sectorial'
    ],
    ejemploTexto: `10. Cronograma

Se establece el cronograma de ejecución de actividades:
- Segregación en origen y pesaje diario: Meses 1 al 12 (Continuo).
- Retiro y valorización de residuos aprovechables por EO-RS: Quincenal (Meses 1 al 12).
- Retiro de residuos peligrosos por EO-RS autorizada: Trimestral (Marzo, Junio, Septiembre, Diciembre).
- Capacitaciones y simulacros de contingencias: Trimestral (Meses 3, 6, 9 y 11).
- Mantenimiento e inspección técnica de ATRP: Mensual.
- Presentación de Declaración Anual en SIGERSOL-SNM: Primeros quince días hábiles de abril.`
  },
  {
    numero: 11,
    titulo: '11. Presupuesto',
    subtitulos: ['11.1 Estimación presupuestal desglosada', '11.2 Partidas de equipamiento y EO-RS', '11.3 Viabilidad financiera'],
    descripcionNormativa: 'Estimación del presupuesto financiero y recursos necesarios (económicos, humanos, materiales) para ejecutar la implementación íntegra del Plan.',
    criteriosClave: [
      'Presupuesto económico desglosado por partidas en soles (S/)',
      'Costos de transporte y disposición con EO-RS, contenedores, EPPs y monitoreo',
      'Asignación formal de recursos por la gerencia'
    ],
    ejemploTexto: `11. Presupuesto

Presupuesto estimado anual de S/ 45,000.00 asignado para la implementación del Plan:
1) Servicios de EO-RS autorizadas (transporte, valorización y celda de seguridad): S/ 22,500.00.
2) Mantenimiento, señalética e insumos de contención para ATRP: S/ 8,500.00.
3) Adquisición y renovación de contenedores bajo NTP 900.058:2019: S/ 6,000.00.
4) Equipos de protección personal (EPP) y reposición de kits antiderrames: S/ 4,000.00.
5) Capacitaciones y auditorías de control ambiental: S/ 4,000.00.`
  },
  {
    numero: 12,
    titulo: '12. Responsable de la gestión de los residuos',
    subtitulos: ['12.1 Designación formal del responsable', '12.2 Funciones y facultades operativas', '12.3 Coordinación intersectorial y reporte'],
    descripcionNormativa: 'Asignación formal y descripción clara de las funciones del responsable o área técnica encargada de la gestión y manejo de residuos sólidos del proyecto.',
    criteriosClave: [
      'Designación de cargo y área responsable (Jefatura de Seguridad / Medio Ambiente)',
      'Funciones operativas, supervisión en planta y custodia de manifiestos MMRP',
      'Facultades para coordinar retiros con EO-RS y reportar ante la autoridad'
    ],
    ejemploTexto: `12. Responsable de la gestión de los residuos

Se designa al Jefe de Medio Ambiente y Seguridad (HSEQ) como el Responsable Oficial de la Gestión de Residuos Sólidos del proyecto, con las siguientes funciones:
- Supervisar la segregación en planta conforme a la NTP 900.058:2019.
- Inspeccionar el almacenamiento seguro en el ATRP y verificar el buen estado del dique estanco y kits.
- Coordinar y supervisar los retiros con las Empresas Operadoras (EO-RS) autorizadas.
- Custodiar las bitácoras de pesaje y los Manifiestos de Manejo de Residuos Peligrosos (MMRP).
- Elaborar y reportar oportunamente la Declaración Anual en el aplicativo SIGERSOL-SNM del MINAM.`
  },
  {
    numero: 13,
    titulo: '13. Anexos',
    subtitulos: [
      '13.1 Glosario de términos',
      '13.2 Cuadro de incompatibilidad de los residuos sólidos',
      '13.3 Operaciones de Manejo de Residuos Sólidos (Fichas, planos y certificados)'
    ],
    descripcionNormativa: 'Documentación obligatoria adjunta: Anexo 1 Glosario de términos técnicos (13.1), Anexo 2 Cuadro de incompatibilidad química de residuos (13.2), y Anexo 3 Documentos de operaciones de manejo, planos de almacenes y autorizaciones de EO-RS (13.3).',
    criteriosClave: [
      'Anexo 1: Glosario de términos técnicos conforme a la normativa de residuos',
      'Anexo 2: Cuadro/Matriz de incompatibilidad química para almacenamiento seguro',
      'Anexo 3: Operaciones de manejo de residuos sólidos (planos, FDS, registros EO-RS)'
    ],
    ejemploTexto: `13. Anexos

13.1 Anexo 1: Glosario de Términos
Definiciones oficiales de: Acondicionamiento, Almacenamiento, Aprovechamiento, Bienes Priorizados, Celda de Seguridad, Disposición Final, Empresa Operadora de Residuos Sólidos (EO-RS), Manifiesto de Residuos Peligrosos (MMRP), Minimización, Residuo Peligroso (RESPEL), Segregación, SIGERSOL y Valorización.

13.2 Anexo 2: Cuadro de Incompatibilidad de Residuos Sólidos
Tabla y matriz de incompatibilidad química para el almacenamiento seguro en el ATRP (sustancias inflamables, corrosivas, reactivas y tóxicas), determinando distancias y barreras físicas de separación.

13.3 Anexo 3: Operaciones de Manejo de Residuos Sólidos
- Plano de planta con ubicación de estaciones de segregación y Almacén Temporal de Residuos Peligrosos (ATRP).
- Hojas de Datos de Seguridad (FDS/MSDS) de aceites y solventes.
- Registros de autorización de Empresas Operadoras de Residuos Sólidos (EO-RS) emitidos por el MINAM.
- Modelo de Bitácora de Registro Diario de Residuos y formato de Manifiesto MMRP.`
  }
];

export const PROMPT_ELABORAR_PMMRS = `### PROMPT OFICIAL DE INGENIERÍA AMBIENTAL: ELABORACIÓN DE PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES (PMMRSNM)
Marco Normativo Vigente: Resolución Ministerial N.° 089-2023-MINAM | Decreto Legislativo N.° 1278 | Decreto Supremo N.° 014-2017-MINAM | NTP 900.058:2019.

ROL Y OBJETIVO:
Actúas como Especialista Senior en Gestión Ambiental y Residuos Sólidos Industriales del Perú. Tu objetivo es formular y redactar de forma rigurosa, completa y sin omisiones el "Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRSNM)" para la actividad indicada, garantizando la aprobación directa ante la autoridad sectorial competente y el cumplimiento estricto del contenido mínimo oficial de la R.M. N.° 089-2023-MINAM y D.L. 1278.

ESTRUCTURA TÉCNICA OFICIAL (13 CAPÍTULOS NORMATIVOS):
1. Introducción: Planteamiento del problema ambiental o necesidad de gestión de residuos en el proyecto (1A) y estrategia con la cual el Plan abordará el problema identificado mediante acciones de minimización y manejo seguro (1B). (Los datos generales de la empresa se consignan en la carátula y membrete administrativo, no en la redacción de este capítulo).
2. Objetivos: Acciones orientadas a prevenir y minimizar en la fuente (2A), acciones para gestión y manejo de ya generados (2B), y propósito central del Plan (2C).
3. Alcance: Ámbito delimitado administrativo y operativo (3A), etapas del proyecto consideradas (3B), y obligatoriedad para personal, contratistas y visitantes (3C).
4. Diagnóstico de residuos sólidos: Fuentes de generación con diagrama de flujo (4.1), caracterización y clasificación por peligrosidad y ámbito (4.2), y estimación cuantitativa de masa y volumen por etapas (4.3).
5. Medidas de prevención y minimización: Prevención en la fuente (5.1), alternativas de material de descarte bajo economía circular y ficha técnica (5.2), y gestión de bienes priorizados (5.3).
6. Operaciones de manejo: Desarrollo de las 8 operaciones (6.a Segregación, 6.b Recolección, 6.c Almacenamiento con ATRP y dique, 6.d Transporte externo con EO-RS, 6.e Acondicionamiento, 6.f Valorización, 6.g Tratamiento si aplica, 6.h Disposición final en celda autorizada).
7. Medidas preventivas, mitigadoras y/o correctivas: Medidas estructuradas para controlar lixiviados, olores, vectores y derrames (7A).
8. Plan de contingencias: Identificación de emergencias por residuos (8A) y medidas de respuesta antes, durante y después del incidente (8B).
9. Programa de monitoreo y control: Inspecciones periódicas (9A) e indicadores clave de desempeño ambiental KPI (9B).
10. Cronograma: Cronograma temporal de implementación mensual/trimestral de actividades (10A).
11. Presupuesto: Estimación presupuestal desglosada en soles (S/) y recursos necesarios (11A).
12. Responsable de la gestión de los residuos: Funciones y facultades del responsable o área técnica asignada (12A).
13. Anexos: 13.1 Glosario de términos, 13.2 Cuadro de incompatibilidad de residuos, 13.3 Operaciones de manejo de residuos sólidos (planos, FDS, registros EO-RS).`;

export const PROMPT_REVISAR_PMMRS = `### PROMPT OFICIAL DE AUDITORÍA Y EVALUACIÓN DE PMMRSNM (63 CRITERIOS R.M. 089-2023-MINAM & D.L. 1278)
Marco Normativo Vigente: Resolución Ministerial N.° 089-2023-MINAM | Decreto Legislativo N.° 1278 | Decreto Supremo N.° 014-2017-MINAM | NTP 900.058:2019.

ROL Y OBJETIVO:
Actúas como Auditor Líder y Fiscalizador Técnico Especialista en Gestión Ambiental de Residuos Sólidos No Municipales. Tu objetivo es realizar una auditoría técnica exhaustiva e imparcial sobre el "Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRSNM)" presentado por el titular, evaluando rigurosamente cada uno de los 63 requisitos normativos de la colección de Firestore contenido_minimo correspondientes a los 13 capítulos oficiales de la R.M. N.° 089-2023-MINAM.

PROTOCOLO DE REVISIÓN EN 13 CAPÍTULOS:
1. Capítulo 1 (Introducción): ¿El documento incluye sección de Introducción? ¿Se ha planteado adecuadamente el problema? ¿Se ha descrito cómo se abordará el problema con el Plan?
2. Capítulo 2 (Objetivos): ¿Se han definido acciones para prevenir y minimizar? ¿Se han establecido acciones para residuos ya generados? ¿Se enuncia el propósito central del Plan?
3. Capítulo 3 (Alcance): ¿Se delimita el ámbito operativo y administrativo? ¿Se especifican las etapas del proyecto? ¿Se establece obligatoriedad para personal y contratistas?
4. Capítulo 4 (Diagnóstico de residuos sólidos): ¿Se identifican fuentes con diagrama de flujo? ¿Se caracterizan por peligrosidad y ámbito? ¿Se presenta estimación de masa y volumen por etapas?
5. Capítulo 5 (Medidas de prevención y minimización): ¿Se describen técnicas de prevención en la fuente? ¿Se contemplan alternativas de material de descarte bajo economía circular? ¿Se gestionan bienes priorizados?
6. Capítulo 6 (Operaciones de manejo): ¿Se auditan las 8 operaciones (segregación NTP 900.058, recolección, almacenamiento con ATRP y dique, transporte con EO-RS autorizadas, acondicionamiento, valorización, tratamiento y disposición final autorizada)?
7. Capítulo 7 (Medidas preventivas, mitigadoras y/o correctivas): ¿Se resumen las medidas ambientales necesarias para mitigar impactos de los residuos?
8. Capítulo 8 (Plan de contingencias): ¿Se identifican emergencias y se detallan acciones antes, durante y después?
9. Capítulo 9 (Programa de monitoreo y control): ¿Se detallan actividades periódicas de verificación e indicadores KPI?
10. Capítulo 10 (Cronograma): ¿Se presenta el cronograma de implementación de actividades ambientales?
11. Capítulo 11 (Presupuesto): ¿Se incluye la estimación de presupuesto y recursos necesarios en soles (S/)?
12. Capítulo 12 (Responsable de la gestión de los residuos): ¿Se describen claramente las funciones del responsable o área designada?
13. Capítulo 13 (Anexos): ¿Se incluye Glosario de términos (13.1), Cuadro de incompatibilidad (13.2) y Operaciones de manejo con planos/autorizaciones (13.3)?`;
