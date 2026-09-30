import { PMMRSPlan, ReviewReport, ReviewStatus } from '../types';
import { MASTER_REQUIREMENTS } from './normativaData';
import { runSpecializedAudit } from '../utils/auditEngine';

export const DEMO_PLAN: PMMRSPlan = {
  id: 'demo-plan-001',
  titulo: 'Plan de Minimización y Manejo de Residuos Sólidos No Municipales 2026 - Planta Callao',
  estado: 'Listo para revisión',
  fechaCreacion: '2026-02-10',
  fechaModificacion: '2026-09-20',
  version: '1.0',
  company: {
    razonSocial: 'Industrial Textil Andina S.A.C.',
    ruc: '20548912341',
    nombreComercial: 'Textil Andina',
    domicilio: 'Av. Elmer Faucett N.° 3420, Urb. Industrial Colonial',
    departamento: 'Callao',
    provincia: 'Callao',
    distrito: 'Callao',
    representanteLegal: 'Carlos Mendoza Alarcón',
    dniRepresentante: '09876543',
    actividadEconomica: 'Fabricación de tejidos y acabado de productos textiles',
    sector: 'Manufactura e Industrial',
    numeroTrabajadores: 120,
    horarioOperacion: 'Lunes a Sábado de 07:00 a 17:00 horas (Doble turno)',
    correoContacto: 'gestion.ambiental@textilandina.pe',
    telefonoContacto: '(01) 567-8910'
  },
  header: {
    logoUrl: '',
    razonSocialHeader: 'INDUSTRIAL TEXTIL ANDINA S.A.C.',
    tituloDocumento: 'PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES (PMMRS)',
    version: 'Versión 1.0 - 2026',
    fechaEmision: 'Marzo de 2026',
    elaboradoPor: 'Ing. María Elena Rengifo (CIP 145230)',
    revisadoPor: 'Lic. Roberto Silva (Jefe de HSEQ)',
    aprobadoPor: 'Carlos Mendoza Alarcón (Gerente General)'
  },
  residuos: [
    {
      id: 'res-1',
      tipo: 'No Peligroso',
      categoria: 'Papel y Cartón',
      descripcion: 'Recortes de embalaje, cajas de cartón y papeles de oficina',
      estadoFisico: 'Sólido',
      peligrosidad: ['Inerte'],
      generacionEstimadaKgMes: 850,
      almacenamiento: 'Almacén Central de Reciclaje',
      colorContenedorNtp: 'Azul (Papel y Cartón)',
      destinoFinal: 'Empresa EO-RS Recicla Perú S.A.C. para valorización',
      minimizacionAccion: 'Reducción de empaques y reutilización de cajas de cartón'
    },
    {
      id: 'res-2',
      tipo: 'No Peligroso',
      categoria: 'Plásticos',
      descripcion: 'Film de polietileno, stretch film y bidones vacíos de insumos inocuos',
      estadoFisico: 'Sólido',
      peligrosidad: ['Inerte'],
      generacionEstimadaKgMes: 420,
      almacenamiento: 'Almacén Central de Reciclaje',
      colorContenedorNtp: 'Blanco (Plástico)',
      destinoFinal: 'Valorización mediante recicladores autorizados',
      minimizacionAccion: 'Sustitución progresiva de film por fajado mecanizado'
    },
    {
      id: 'res-3',
      tipo: 'No Peligroso',
      categoria: 'Orgánicos',
      descripcion: 'Residuos de alimentos del comedor institucional',
      estadoFisico: 'Semisólido',
      peligrosidad: ['Putrescible'],
      generacionEstimadaKgMes: 600,
      almacenamiento: 'Contenedores herméticos en zona de cocina',
      colorContenedorNtp: 'Marrón (Orgánicos)',
      destinoFinal: 'Planta autorizada de compostaje o alimentación animal',
      minimizacionAccion: 'Campañas de concientización para evitar desperdicio de alimentos'
    },
    {
      id: 'res-4',
      tipo: 'Peligroso',
      categoria: 'Aceites y Grasas Usadas',
      descripcion: 'Aceites lubricantes residuales de maquinaria de tejeduría',
      estadoFisico: 'Sólido',
      peligrosidad: ['Inflamable', 'Tóxico acuático'],
      generacionEstimadaKgMes: 150,
      almacenamiento: 'Almacén Temporal de Residuos Peligrosos (ATRP)',
      colorContenedorNtp: 'Rojo (Peligrosos)',
      destinoFinal: 'Disposición y tratamiento por EO-RS EcoSafe Perú',
      minimizacionAccion: 'Optimización de periodos de lubricación preventiva'
    },
    {
      id: 'res-5',
      tipo: 'Peligroso',
      categoria: 'Paños y Materiales Contaminados',
      descripcion: 'Traperos, guaipe y envases con trazas de tintes y solventes',
      estadoFisico: 'Sólido',
      peligrosidad: ['Tóxico', 'Inflamable'],
      generacionEstimadaKgMes: 90,
      almacenamiento: 'Almacén Temporal de Residuos Peligrosos (ATRP)',
      colorContenedorNtp: 'Rojo (Peligrosos)',
      destinoFinal: 'Celda de seguridad de relleno autorizado',
      minimizacionAccion: 'Uso de dosificadores para evitar impregnación excesiva'
    },
    {
      id: 'res-6',
      tipo: 'No Peligroso',
      categoria: 'Retazos Textiles',
      descripcion: 'Mermas y orillos de corte de tela de algodón y fibras sintéticas',
      estadoFisico: 'Sólido',
      peligrosidad: ['Inerte'],
      generacionEstimadaKgMes: 150,
      almacenamiento: 'Almacén Central de Reciclaje',
      colorContenedorNtp: 'Blanco (Plástico/Textil)',
      destinoFinal: 'Valorización material mediante hilanderías recicladoras autorizadas',
      minimizacionAccion: 'Optimización de trazos mediante software CAD/CAM de corte'
    }
  ],
  capitulos: [
    {
      id: 'cap-1',
      numero: 1,
      titulo: '1. Introducción',
      contenido: '1.1 Planteamiento del Problema:\nEl presente Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS) responde a la necesidad técnica y ambiental de gestionar de manera integral y segura los residuos sólidos generados en las operaciones continuas de manufactura textil. Durante los procesos productivos de hilatura, tejeduría circular, tintorería industrial, acabado textil y corte automatizado, así como en las actividades auxiliares de mantenimiento electromecánico y áreas comunes, se genera un volumen mensual estimado de 2,260.00 kg de residuos sólidos. De este total, 2,020.00 kg/mes corresponden a residuos no peligrosos (mermas textiles, bobinas, cartón corrugado, plásticos de empaque y orgánicos de comedor) y 240.00 kg/mes corresponden a residuos sólidos peligrosos - RESPEL (aceites lubricantes usados, trapos impregnados con hidrocarburos y envases de productos químicos). La ausencia de una gestión sistematizada generaría riesgos significativos de afectación ambiental, riesgos laborales en planta y contingencias sancionatorias ante las autoridades fiscalizadoras competentes.\n\n1.2 Abordaje del Problema con el Plan:\nFrente a dicha problemática, el presente Plan aborda la gestión de residuos bajo un enfoque preventivo y de economía circular, conforme a los mandatos del Decreto Legislativo N.° 1278 (Ley de Gestión Integral de Residuos Sólidos), su Reglamento aprobado por D.S. N.° 014-2017-MINAM y la Resolución Ministerial N.° 089-2023-MINAM. La estrategia se sustenta en tres ejes fundamentales: 1) Prevención y minimización en la fuente mediante optimización tecnológica de patrones de corte con software CAD/CAM e implementación de bobinas retornables; 2) Segregación estandarizada en 18 estaciones bajo el código de colores de la NTP 900.058:2019 y acondicionamiento seguro en un Almacén Temporal de Residuos Peligrosos (ATRP) dotado de dique de contención estanco al 110%; y 3) Articulación formal con Empresas Operadoras de Residuos Sólidos (EO-RS) registradas ante el MINAM para la valorización material del 64.35% de los residuos aprovechables y la disposición final controlada de los residuos peligrosos, garantizando trazabilidad documentaria mediante manifiestos (MMRP) y declaración oficial en SIGERSOL-SNM.',
      completado: true
    },
    {
      id: 'cap-2',
      numero: 2,
      titulo: '2. Objetivos',
      contenido: '2.1 Objetivo General: Garantizar el aprovechamiento sostenible de recursos e insumos textiles, optimizar las operaciones de manufactura en planta y asegurar la gestión integral, segura y ambientalmente adecuada de los residuos sólidos no municipales generados en las instalaciones de la planta Callao, priorizando la prevención y minimización en la fuente bajo el Principio de Economía Circular.\n\n2.2 Objetivos Específicos:\n- Reducir en 8.5% anual la generación de mermas textiles y desechos de corte en las líneas de tejeduría y confección.\n- Alcanzar y sostener una tasa de valorización material superior al 60% mensual respecto al total de residuos no peligrosos generados.\n- Implementar y mantener al 100% el sistema de segregación estandarizada en la fuente conforme al código de colores de la NTP 900.058:2019.\n- Acondicionar y custodiar al 100% los residuos sólidos peligrosos (RESPEL) dentro del Almacén Temporal (ATRP) dotado de dique de contención estanco al 110%.\n- Garantizar que el 100% del transporte externo, valorización y disposición final sea ejecutado por Empresas Operadoras de Residuos Sólidos (EO-RS) registradas ante el MINAM, emitiendo los Manifiestos de Manejo de Residuos Peligrosos (MMRP).',
      completado: true
    },
    {
      id: 'cap-3',
      numero: 3,
      titulo: '3. Alcance',
      contenido: 'El presente Plan de Minimización y Manejo de Residuos Sólidos No Municipales tiene alcance vinculante sobre la totalidad del predio industrial de 8,500 m² de la planta Callao de Industrial Textil Andina S.A.C., abarcando de manera integral:\n\n1) Áreas Productivas: Naves de Urdido y Enconado, Sala de Telares Circulares y Rectilíneos, Sección de Tintorería y Fijación Térmica, Sala de Corte Automatizado y Ensamble.\n2) Áreas Auxiliares y Soporte: Taller de Mantenimiento Electromecánico, Calderas y Tratamiento de Agua, Almacén Central de Materias Primas, Almacén de Químicos y Colorantes, y Almacén de Producto Terminado.\n3) Áreas de Acondicionamiento de Residuos: 18 Estaciones de Segregación Primaria distribuidas en planta, Almacén Central de Aprovechables de 50 m², y Almacén Temporal de Residuos Peligrosos (ATRP) de 35 m².\n4) Áreas Administrativas y de Servicios al Personal: Oficinas de Gerencia y Administración, Comedor Laboral, Vestuarios y Garita de Control.\n\nAplica a una dotación permanente de 120 trabajadores bajo régimen laboral de doble turno (Lunes a Sábado de 07:00 a 17:00 horas), así como a contratistas y visitantes temporales.',
      completado: true
    },
    {
      id: 'cap-4',
      numero: 4,
      titulo: '4. Identificación, características y estimación de residuos sólidos',
      contenido: 'Conforme al Estudio de Caracterización de Residuos Sólidos No Municipales realizado en planta en condiciones normales de operación, la generación promedio mensual asciende a 2,260.00 kg/mes (equivalente a 27.12 t/año), desglosada técnicamente en:\n\na) Residuos No Peligrosos (2,020.00 kg/mes - 89.38% del total):\n- Papel y Cartón (850.00 kg/mes): Cajas de embalaje corrugado, bobinas desocupadas y material de empaque (Inerte, no peligroso).\n- Plásticos (420.00 kg/mes): Stretch film, zunchos de polipropileno y envolturas de polietileno de baja densidad (Inerte valorizable).\n- Residuos Orgánicos (600.00 kg/mes): Restos de alimentos crudos y cocidos provenientes del comedor laboral (Putrescible).\n- Retazos Textiles (150.00 kg/mes): Retazos limpios de algodón pima y mezclas sintéticas (Inerte valorizable).\n\nb) Residuos Peligrosos - RESPEL (240.00 kg/mes - 10.62% del total):\n- Aceites lubricantes usados de maquinaria (150.00 kg/mes - Código B0190 Anexo III D.S. 014-2017-MINAM, Líquido inflamable/tóxico).\n- Paños, guaipe y envases con restos de solventes y colorantes (90.00 kg/mes - Código A4140, Sólido inflamable/tóxico).\n\nBalance de Materia y Entradas/Salidas: Por cada 1,000 kg de hilo procesado, se generan 75 kg de residuos totales (67 kg no peligrosos y 8 kg RESPEL). Cada corriente cuenta con registro diario en bitácora de pesaje con balanza industrial calibrada para sustentar la Declaración Anual en SIGERSOL-SNM del MINAM.',
      completado: true
    },
    {
      id: 'cap-5',
      numero: 5,
      titulo: '5. Estrategias para la prevención y/o minimización',
      contenido: 'En cumplimiento del Principio de Economía Circular y la Jerarquía de Gestión de Residuos del D.L. N.° 1278 (Art. 19), se han implementado estrategias operativas medibles:\n\n1) Medidas de Minimización en Origen:\n- Optimización de patrones de corte mediante software CAD/CAM que reduce el desperdicio textil en 8.5% anual.\n- Sustitución de conos desechables de un solo uso por bobinas plásticas retornables con hilanderías proveedoras en circuito cerrado (evitando 3.6 t/año de residuos de empaque).\n- Implementación de lubricación automática por micropulverización para alargar los ciclos de recambio de aceite de telares en un 25%.\n- Sustitución progresiva de solventes clorados por desengrasantes acuosos biodegradables en mantenimiento.\n\n2) Medidas de Valorización Material:\n- Segregación estandarizada en origen que permite la entrega del 100% de cartón corrugado, stretch film y retazos textiles a Empresas Operadoras de Residuos Sólidos (EO-RS) debidamente autorizadas para reciclaje industrial y regeneración de fibras, alcanzando una tasa de valorización global de residuos no peligrosos del 64.35% mensual (1,300 kg/mes valorizados sobre 2,020 kg generados).\n\n3) Valorización Orgánica:\n- Convenio de entrega de 600 kg/mes de residuos orgánicos del comedor a planta de compostaje autorizada para la producción de enmiendas agronómicas.',
      completado: true
    },
    {
      id: 'cap-6',
      numero: 6,
      titulo: '6. Gestión y manejo de residuos sólidos',
      contenido: 'El manejo físico de residuos comprende las siguientes etapas operativas:\n\n1) Segregación en la Fuente: Estaciones de segregación con código de colores según NTP 900.058:2019 (Azul: Papel/Cartón, Blanco: Plásticos, Marrón: Orgánicos, Rojo: Peligrosos).\n\n2) Almacenamiento Central de No Peligrosos: Área de 50 m², techada, ventilada, delimitada y señalizada con piso de concreto pulido.\n\n3) Almacén Temporal de Residuos Peligrosos (ATRP): Recinto confinado e impermeabilizado de 35 m², piso con recubrimiento epóxico de alta resistencia química, dique de contención estanco perimetral con capacidad para 1,200 litros (superando el 110% del contenedor mayor de 200 litros), señalética de seguridad conforme a NFPA 704 y CTI, kit antiderrames homologado de 55 galones (cordones absorbentes, almohadillas y pala antichispas), extintor PQS de 12 kg y Hojas de Datos de Seguridad (FDS/MSDS) en idioma castellano.\n\n4) Recolección y Transporte Interno: Rutas internas señalizadas y horarios de traslado que evitan la interferencia con materias primas y productos limpios.\n\n5) Recolección Externa, Transporte y Disposición Final: Ejecutado exclusivamente por Empresas Operadoras de Residuos Sólidos (EO-RS) registradas y autorizadas ante el MINAM: EcoSafe Perú S.A.C. (Registro MINAM N.° EO-RS-0024-20) para el transporte y disposición final de RESPEL en celda de seguridad autorizada con emisión de Manifiestos de Manejo de Residuos Peligrosos (MMRP), y Recicla Perú S.A.C. para valorización de reciclables.',
      completado: true
    },
    {
      id: 'cap-7',
      numero: 7,
      titulo: '7. Descripción de las medidas ambientales',
      contenido: 'Se ejecutan medidas de prevención, control y mitigación ambiental en todas las fases del manejo de residuos sólidos:\n\n1) Control de Lixiviados y Efluentes: Pisos impermeabilizados con resina epóxica en almacenes centrales y dique estanco en el ATRP, impidiendo cualquier infiltración de hidrocarburos o sustancias químicas al suelo o red de alcantarillado.\n2) Control de Vectores y Plagas: Retiro de residuos orgánicos del comedor cada 48 horas en contenedores herméticos de polietileno de alta densidad (HDPE) con pedal, y fumigación/desinfección técnica semanal a cargo de empresa de saneamiento ambiental acreditada por MINSA/DIGESA.\n3) Control de Olores y Emisiones de Vapores: Almacén de residuos orgánicos confinado con extracción de aire; y ATRP con sistema de ventilación cruzada natural y extracción forzada a prueba de chispas (antiexplosiva) para evitar la acumulación de Compuestos Orgánicos Volátiles (COVs).\n4) Control de Ruido y Emisiones de Unidades de Transporte: Mantenimiento electromecánico preventivo mensual de transpaletas y vehículos de acarreo interno para cumplir con el D.S. N.° 085-2003-PCM.',
      completado: true
    },
    {
      id: 'cap-8',
      numero: 8,
      titulo: '8. Medidas de atención ante emergencias',
      contenido: 'El Plan de Contingencia y Respuesta ante Emergencias de Residuos Sólidos establece Procedimientos Operativos Estandarizados (POE):\n\n1) POE-01: Respuesta Rápida ante Derrames de Sustancias Químicas y Aceites Usados:\n- Fase 1 (Detección y Evacuación): Detener la fuente si es seguro, aislar el área en un radio de 5 metros y alertar al Jefe de Brigada.\n- Fase 2 (Contención): Desplegar cordones absorbentes oleofílicos del kit antiderrames de 55 galones alrededor del derrame para confinar el fluido.\n- Fase 3 (Absorción y Neutralización): Colocar almohadillas absorbentes y material absorbente particulado (turba o vermiculita).\n- Fase 4 (Recojo y Disposición): Recoger el material saturado con palas antichispas y confinarlo en tambores rojos rotulados como RESPEL.\n\n2) POE-02: Respuesta ante Amagos de Incendio en Almacenes:\n- Uso inmediato de extintores PQS de 12 kg (Polvo Químico Seco ABC) y CO2 de 10 lbs instalados junto a las puertas de acceso.\n\n3) Recursos y Brigadas: Brigada de emergencias ambientales de 12 trabajadores capacitados y equipados con EPPs nivel C (guantes de nitrilo, botas de neopreno, gafas de seguridad y respiradores con cartuchos para vapores orgánicos). Notificación inmediata a la Gerencia y reporte a OEFA dentro del plazo improrrogable de 24 horas.',
      completado: true
    },
    {
      id: 'cap-9',
      numero: 9,
      titulo: '9. Indicadores de seguimiento y control',
      contenido: 'Tablero de Control de Indicadores de Ecoeficiencia y Desempeño Ambiental (R.M. 089-2023-MINAM):\n\n1) Ratio de Generación Específica (Rg): Rg = (kg total residuos generados / kg producto acabado fabricado) = Meta mensual < 0.075 kg/kg.\n2) Porcentaje de Valorización Material (%V): %V = (kg residuos no peligrosos valorizados / kg residuos no peligrosos totales) * 100 = Meta mensual >= 60.00% (Actual: 64.35%).\n3) Ratio de Generación de Peligrosos (Rpel): Rpel = (kg RESPEL generados / kg producto fabricado) * 100 = Meta mensual < 1.10% (Actual: 0.80%).\n4) Índice de Segregación Correcta (%S): %S = (N.° inspecciones conformes en estaciones NTP 900.058 / N.° total de inspecciones) * 100 = Meta >= 95.00%.\n5) Tasa de Cumplimiento de Cronograma (%TC): (Actividades ejecutadas / programadas) * 100 = Meta 100%.\n\nMonitoreo y Reporte: Control semanal en bitácora foliada, consolidación mensual en informe de HSEQ y carga oficial en la plataforma SIGERSOL No Municipal del MINAM.',
      completado: true
    },
    {
      id: 'cap-10',
      numero: 10,
      titulo: '10. Cronograma de implementación',
      contenido: 'Cronograma Anual de Implementación y Operación (Gantt 12 meses - 2026):\n\n- Meses 1 a 12 (Continuo): Pesaje diario y segregación en las 18 estaciones de planta según NTP 900.058:2019.\n- Quincenal (24 retiros/año): Recolección externa de residuos aprovechables (cartón, film, retazos) por EO-RS Recicla Perú S.A.C.\n- Trimestral (Meses 3, 6, 9 y 12): Retiro y transporte de residuos peligrosos (aceites y solventes) por EO-RS EcoSafe Perú S.A.C. con Manifiestos MMRP.\n- Trimestral (Meses 2, 5, 8 y 11): Mantenimiento preventivo del ATRP, verificación de diques y reposición de insumos de kits antiderrames.\n- Trimestral (Meses 3, 6, 9 y 11): Ejecución de módulos del Programa Anual de Capacitación y simulacros de emergencia ambiental.\n- Mes 3 (Marzo 2026): Elaboración y presentación de la Declaración Anual de Manejo de Residuos Sólidos en el portal SIGERSOL-SNM del MINAM.\n- Mes 6 y 12 (Junio y Diciembre): Auditorías internas de seguimiento ambiental y balance de KPIs.',
      completado: true
    },
    {
      id: 'cap-11',
      numero: 11,
      titulo: '11. Presupuesto y recursos necesarios',
      contenido: 'Presupuesto Anual Formal Aprobado por la Gerencia General (Total: S/ 45,000.00 anuales):\n\n- Partida 1: Servicios de recolección, transporte y disposición final/valorización con EO-RS autorizadas: S/ 22,500.00 anuales.\n- Partida 2: Mantenimiento, impermeabilización y señalización del Almacén Central y ATRP (incluye inspección de dique): S/ 8,500.00 anuales.\n- Partida 3: Renovación de contenedores normalizados bajo NTP 900.058:2019, rotulado y dotación de EPPs específicos: S/ 6,000.00 anuales.\n- Partida 4: Programa anual de capacitaciones, materiales didácticos y simulacros de contingencia con kit antiderrames: S/ 4,000.00 anuales.\n- Partida 5: Estudio de caracterización técnica anual, pesaje calibrado y auditoría de seguimiento ambiental: S/ 4,000.00 anuales.\n\nRecursos Humanos Asignados: 1 Ingeniero Ambiental / Jefe HSEQ dedicado a la supervisión técnica, 2 operarios líderes de segregación y 12 brigadistas de emergencia.',
      completado: true
    },
    {
      id: 'cap-12',
      numero: 12,
      titulo: '12. Funciones del responsable de la gestión y manejo de residuos sólidos',
      contenido: 'Se designa formalmente al Ingeniero Ambiental / Jefe de HSEQ (Ing. Miguel Ángel Torres, CIP N.° 184520) como Responsable Oficial de la Gestión y Manejo de Residuos Sólidos No Municipales de Industrial Textil Andina S.A.C., con las siguientes funciones y responsabilidades:\n\n1) Supervisión Técnica y Operativa: Supervisar diariamente el cumplimiento de la segregación en origen bajo la NTP 900.058:2019 y el estado del ATRP.\n2) Control Documentario y Trazabilidad: Custodiar el libro de bitácora de pesaje diario y los Manifiestos de Manejo de Residuos Sólidos Peligrosos (MMRP) firmados por las EO-RS.\n3) Coordinación con EO-RS: Coordinar las órdenes de recojo con las empresas operadoras y verificar semestralmente la vigencia de sus autorizaciones ante MINAM.\n4) Reporte Oficial ante el Estado: Elaborar, suscribir y presentar la Declaración Anual de Manejo de Residuos Sólidos en la plataforma SIGERSOL No Municipal.\n5) Capacitación Continua: Planificar y ejecutar el Programa Anual de Capacitación Ambiental para el personal operativo y administrativo.\n6) Liderazgo en Contingencias: Dirigir las acciones de contención inmediata ante cualquier derrame o incidente ambiental con RESPEL.',
      completado: true
    },
    {
      id: 'cap-13',
      numero: 13,
      titulo: '13. Anexos',
      contenido: 'El presente Plan incluye los siguientes anexos técnicos y administrativos que forman parte indivisible del documento:\n\n- Anexo 1: Plano General de Planta (Escala 1:500) con zonificación de naves productivas, ubicación geográfica de las 18 estaciones de segregación y localización del ATRP y Almacén Central.\n- Anexo 2: Diagrama de Flujo de Procesos de Manufactura Textil con balance de materia y mapeo de fuentes de generación de residuos sólidos.\n- Anexo 3: Hojas de Datos de Seguridad (FDS / MSDS) de los insumos químicos, tintes y aceites lubricantes utilizados en planta.\n- Anexo 4: Resoluciones Directorales y Constancias de Registro Vigente ante el MINAM de las EO-RS contratadas (EcoSafe Perú S.A.C. y Recicla Perú S.A.C.).\n- Anexo 5: Formato Oficial de Bitácora de Registro Diario de Pesaje y Modelo de Manifiesto de Manejo de Residuos Sólidos Peligrosos (MMRP).\n- Anexo 6: Programa Anual de Capacitación y Sensibilización en Gestión Integral de Residuos Sólidos 2026.',
      completado: true
    }
  ],
  presupuestoTotal: 45000,
  esDemo: true
};

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
