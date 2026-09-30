import { PlanAnexo } from '../types';

export const OFFICIAL_RM089_ANNEXES: PlanAnexo[] = [
  {
    id: "anexo-1",
    numero: 1,
    codigo: "ANEXO-01",
    titulo: "Anexo N° 1: Diagrama de flujo simplificado y fuentes de generación",
    subtitulo: "Mapeo de entradas, operaciones y generación de residuos en planta textil",
    categoria: "Diagrama de Flujo y Fuentes",
    tipo: "diagrama",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo numeral 4.1",
    descripcion: "Identificación de los puntos de generación a partir de los procesos operativos y auxiliares de la planta textil «Textiles Andina S.A.C.»",
    columnas: ["Área / Proceso", "Entradas / Insumos", "Operación Productiva", "Residuos Principales Generados", "Peligrosidad"],
    filas: [
      {
        area: "Preparación y Teñido",
        entradas: "Tejido crudo, colorantes reactivos, auxiliares, vapor y agua blanda",
        operacion: "Descruce, blanqueo óptico y teñido en autoclaves",
        residuos: "Envases plásticos de químicos, lodos de teñido, trapos impregnados",
        peligrosidad: "Peligroso (Tóxico)"
      },
      {
        area: "Lavado y Enjuague",
        entradas: "Tejido teñido, agua de proceso, agentes fijadores",
        operacion: "Eliminación de colorante no fijado e hidrolavado",
        residuos: "Lodos textiles, envases de fijadores, mangas filtrantes gastadas",
        peligrosidad: "Peligroso / No peligroso"
      },
      {
        area: "Acabado y Secado",
        entradas: "Tejido húmedo, resinas suavizantes biodegradables, calor",
        operacion: "Rama tensora, compactado y secado continuo",
        residuos: "Retazos textiles limpios, mermas de orillos, conos de cartón",
        peligrosidad: "No peligroso (Valorizable)"
      },
      {
        area: "Corte y Confección",
        entradas: "Rollos de tela acabada, patrones CAD/CAM",
        operacion: "Trazado, extendido y corte automatizado",
        residuos: "Mermas de tejido crudo y acabado (Código 04 02 09)",
        peligrosidad: "No peligroso (Valorizable)"
      },
      {
        area: "Mantenimiento Mecánico",
        entradas: "Aceites lubricantes, grasas industriales, solventes desengrasantes, repuestos",
        operacion: "Engrase de telares, cambio de lubricantes, torneado y soldadura",
        residuos: "Aceite lubricante usado (13 02 08), trapos con hidrocarburos (15 02 02), chatarra (12 01 01)",
        peligrosidad: "Peligroso / No peligroso"
      },
      {
        area: "Oficinas Administrativas",
        entradas: "Papel bond, tóneres, útiles de oficina, insumos de aseo",
        operacion: "Gestión comercial, financiera, RR.HH. y diseño textil",
        residuos: "Papel y cartón de oficina (Azul), plástico PET (Blanco), comunes (Negro)",
        peligrosidad: "No peligroso (Similar al municipal)"
      },
      {
        area: "Comedor y Cocina",
        entradas: "Alimentos perecibles y no perecibles, raciones de almuerzo",
        operacion: "Alimentación de 180 trabajadores en doble turno",
        residuos: "Restos de comida y orgánicos (Código 20 03 01), envases y desechables",
        peligrosidad: "No peligroso (Orgánico putrescible)"
      }
    ]
  },
  {
    id: "anexo-2",
    numero: 2,
    codigo: "ANEXO-02",
    titulo: "Anexo N° 2: Diagrama de flujo simplificado por etapas del proyecto",
    subtitulo: "Estructura metodológica de balance de masa y entradas/salidas según R.M. 089-2023-MINAM",
    categoria: "Diagrama de Flujo por Etapas",
    tipo: "diagrama",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo N° 2",
    descripcion: "Diagrama de flujo representativo del balance de materiales, clasificando las salidas en subproductos, materias primas secundarias, material de descarte y residuos sólidos.",
    columnas: ["Etapa del Proyecto", "Entradas al Sistema", "Procesos / Actividades", "Salidas / Corrientes", "Destino Técnico"],
    filas: [
      {
        etapa: "Etapa de Construcción / Habilitación",
        entradas: "Agua, maquinaria, materiales de construcción, energía",
        procesos: "Obras civiles, montaje de naves industriales y cimentación de maquinaria",
        salidas: "Material de descarte (excedente de remoción), Residuos de construcción y demolición (RCD)",
        destino: "Reutilización como relleno / Disposición en escombrera autorizada (D.S. 002-2022-VIVIENDA)"
      },
      {
        etapa: "Etapa de Operación y Mantenimiento",
        entradas: "Fibras de algodón, hilados, colorantes, auxiliares, lubricantes, energía eléctrica, agua",
        procesos: "Tejeduría, tintorería, acabado textil, corte, empaque y mantenimiento preventivo",
        salidas: "Productos terminados, Subproductos (retazos), Residuos no peligrosos valorizables, Residuos peligrosos (RESPEL)",
        destino: "Venta textil, EO-RS valorizadora (80%), EO-RS relleno de seguridad con manifiestos"
      },
      {
        etapa: "Etapa de Cierre / Abandono",
        entradas: "Herramientas de desmantelamiento, equipos de izaje, solventes de descontaminación",
        procesos: "Desmontaje de telares, vaciado de tanques de químicos, saneamiento de suelos",
        salidas: "Chatarra metálica, residuos de descontaminación química, tierras impregnadas",
        destino: "Comercialización siderúrgica / Tratamiento y disposición especializada con EO-RS"
      }
    ]
  },
  {
    id: "anexo-3",
    numero: 3,
    codigo: "ANEXO-03",
    titulo: "Anexo N° 3: Clasificación de los Residuos Sólidos por sus características y ámbito de gestión",
    subtitulo: "Matriz oficial de clasificación por manejo y gestión de acuerdo con D.L. 1278",
    categoria: "Clasificación y Gestión",
    tipo: "tabla",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo N° 3",
    descripcion: "Cuadro oficial de clasificación de los residuos sólidos generados en la planta textil por sus características de peligrosidad, manejo y régimen de gestión.",
    columnas: ["Etapa (1)", "Proceso / Actividad Generadora (2)", "Residuo Sólido (3)", "Característica Peligrosidad (4)", "Por su Manejo (5)", "Por su Gestión (6)"],
    filas: [
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Preparación y Teñido",
        residuo: "Envases plásticos contaminados con colorantes y auxiliares",
        peligrosidad: "Tóxico / Corrosivo",
        manejo: "Peligroso",
        gestion: "No municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Mantenimiento Mecánico",
        residuo: "Aceite lubricante usado de telares y compresores",
        peligrosidad: "Tóxico / Inflamable (Hidrocarburos)",
        manejo: "Peligroso",
        gestion: "No municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Mantenimiento y Lubricación",
        residuo: "Trapos, guaipe y absorbentes contaminados con aceites",
        peligrosidad: "Tóxico / Inflamable",
        manejo: "Peligroso",
        gestion: "No municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Acabado de Tejidos y Confección",
        residuo: "Retazos textiles limpios e hilos de algodón",
        peligrosidad: "No aplica (Inerte)",
        manejo: "No peligroso",
        gestion: "No municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Embalaje y Almacén de Despacho",
        residuo: "Cajas de cartón corrugado y conos de cartón",
        peligrosidad: "No aplica (Inerte)",
        manejo: "No peligroso",
        gestion: "Similar al municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Embalaje y Despacho",
        residuo: "Películas de film transparente (stretch film) y flejes plásticos",
        peligrosidad: "No aplica (Inerte)",
        manejo: "No peligroso",
        gestion: "Similar al municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Taller Mecánico y Repuestos",
        residuo: "Chatarra de acero, repuestos desgastados y virutas metálicas",
        peligrosidad: "No aplica (Inerte)",
        manejo: "No peligroso",
        gestion: "No municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Comedor del Personal",
        residuo: "Restos de alimentos crudos y cocidos (orgánicos)",
        peligrosidad: "Putrescible",
        manejo: "No peligroso",
        gestion: "Similar al municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Servicios Higiénicos y Limpieza",
        residuo: "Papel higiénico, restos de barrido de planta, EPPs no contaminados",
        peligrosidad: "No aplica (Inerte)",
        manejo: "No peligroso",
        gestion: "Similar al municipal / No municipal"
      },
      {
        etapa: "Operación y Mantenimiento",
        proceso: "Oficinas y TI / Montacargas",
        residuo: "Computadoras, monitores, luminarias LED y neumáticos fuera de uso",
        peligrosidad: "Manejo especial / Metales pesados",
        manejo: "Peligroso / Especial",
        gestion: "Bienes Priorizados (RAEE / NFU)"
      }
    ]
  },
  {
    id: "anexo-4",
    numero: 4,
    codigo: "ANEXO-04",
    titulo: "Anexo N° 4: Cuadro estimado de la cantidad de residuos sólidos de bienes priorizados",
    subtitulo: "Regímenes especiales de RAEE (D.S. 009-2019-MINAM) y NFU (D.S. 024-2021-MINAM)",
    categoria: "Bienes Priorizados",
    tipo: "tabla",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo N° 4",
    descripcion: "Inventario y estimación de generación de residuos de bienes priorizados sujetos a Responsabilidad Extendida del Productor (REP) y sistemas de manejo autorizados.",
    columnas: ["Residuo Sólido del Bien Priorizado (1)", "Régimen Especial (2)", "Categoría Oficial (3)", "Unidades Estimadas (4)", "Masa Estimada en kg (5)", "Período (6)", "Sistema de Manejo Previsto"],
    filas: [
      {
        residuo: "Computadoras portátiles y CPUs de oficina",
        regimen: "RAEE",
        categoria: "Categoría 3: Equipos de informática y telecomunicaciones",
        unidades: 4,
        masaKg: 45,
        periodo: "Anual",
        sistema: "Entrega a Sistema Colectivo de RAEE autorizado por PRODUCE/MINAM"
      },
      {
        residuo: "Monitores y pantallas LCD/LED en desuso",
        regimen: "RAEE",
        categoria: "Categoría 4: Aparatos de alumbrado / consumo",
        unidades: 3,
        masaKg: 30,
        periodo: "Anual",
        sistema: "Entrega a Sistema Colectivo de RAEE autorizado"
      },
      {
        residuo: "Luminarias LED y tubos fluorescentes de planta",
        regimen: "RAEE",
        categoria: "Categoría 5: Aparatos de alumbrado",
        unidades: 25,
        masaKg: 45,
        periodo: "Anual",
        sistema: "Entrega en puntos de acopio o sistema colectivo formal"
      },
      {
        residuo: "Neumáticos de montacargas industriales (< 25 pulgadas)",
        regimen: "NFU",
        categoria: "Categoría A: Neumáticos con aro inferior a 25 pulgadas",
        unidades: 2,
        masaKg: 120,
        periodo: "Anual",
        sistema: "Entrega a Sistema Colectivo o Individual de NFU aprobado por PRODUCE"
      },
      {
        residuo: "Paneles solares / fotovoltaicos de emergencia",
        regimen: "RAEE",
        categoria: "Categoría 11: Paneles fotovoltaicos",
        unidades: 0,
        masaKg: 0,
        periodo: "Bienal",
        sistema: "No aplica generación inmediata; previsto en plan de renovación 2028"
      }
    ]
  },
  {
    id: "anexo-5",
    numero: 5,
    codigo: "ANEXO-05",
    titulo: "Anexo N° 5: Clasificación de los residuos sólidos por sus características para su almacenamiento",
    subtitulo: "Código de Colores oficial según NTP 900.058:2019 y D.S. 014-2017-MINAM",
    categoria: "Almacenamiento y Código de Colores",
    tipo: "tabla",
    fuenteNormativa: "NTP 900.058:2019 / R.M. N.° 089-2023-MINAM, Anexo N° 5",
    descripcion: "Especificación técnica de contenedores, colores normalizados, rótulos y directrices de almacenamiento inicial, intermedio y central.",
    columnas: ["Clasificación de Residuos", "Ejemplos en Planta Textil", "Por su Gestión", "Color Normalizado NTP", "Tipo de Recipiente / Almacén"],
    filas: [
      {
        clasificacion: "Papel y Cartón",
        ejemplos: "Papeles de oficina, revistas, folletos, cajas de cartón corrugado, conos de hilo",
        gestion: "Similares a los municipales",
        color: "Azul",
        recipiente: "Contenedores de 120/240 L con tapa basculante y zona de enfardado en Almacén Central"
      },
      {
        clasificacion: "Plástico",
        ejemplos: "Botellas plásticas (PET), empaques, bolsas, películas de film transparente (stretch film)",
        gestion: "Similares a los municipales",
        color: "Blanco",
        recipiente: "Contenedores rotulados de polietileno de alta densidad (PEAD)"
      },
      {
        clasificacion: "Metales",
        ejemplos: "Envases de metal, latas, fierros, alambres, repuestos dados de baja, virutas de acero",
        gestion: "No municipal",
        color: "Amarillo",
        recipiente: "Contenedores metálicos reforzados o cilindros rotulados en Taller de Mantenimiento"
      },
      {
        clasificacion: "Orgánicos",
        ejemplos: "Restos de preparación y consumo de alimentos, restos de frutas, verduras del comedor",
        gestion: "Similares a los municipales",
        color: "Marrón",
        recipiente: "Contenedores herméticos con pedal y bolsa biodegradable compostable"
      },
      {
        clasificacion: "Vidrio",
        ejemplos: "Botellas de vidrio, frascos de reactivos no peligrosos del laboratorio textil",
        gestion: "Similares / No municipal",
        color: "Plomo",
        recipiente: "Contenedor de plástico rígido acolchado internamente para evitar roturas"
      },
      {
        clasificacion: "Peligrosos (RESPEL)",
        ejemplos: "Envases contaminados con colorantes y solventes, trapos con hidrocarburos, aceites usados, baterías",
        gestion: "No municipal",
        color: "Rojo",
        recipiente: "Cilindros metálicos de 55 gal / contenedores herméticos con dique antiderrame en Almacén ATRP"
      },
      {
        clasificacion: "No Aprovechables / Comunes",
        ejemplos: "Papel higiénico, restos de barrido de planta, paños de limpieza sucios, EPPs descartables no contaminados",
        gestion: "Similares a los municipales / No municipal",
        color: "Negro",
        recipiente: "Contenedores de polietileno con tapa a pedal distribuidos en SS.HH. y pasillos"
      },
      {
        clasificacion: "Residuos de Construcción y Demolición (RCD)",
        ejemplos: "Concreto, maderas de encofrado, piezas de acero y drywall por remodelaciones",
        gestion: "No municipal (D.S. 002-2022-VIVIENDA)",
        color: "Zona delimitada RCD",
        recipiente: "Patios de acopio transitorio techados y señalizados sobre solera impermeable"
      }
    ]
  },
  {
    id: "anexo-6",
    numero: 6,
    codigo: "ANEXO-06",
    titulo: "Anexo N° 6: Cuadro estimado del volumen y cantidad de residuos sólidos a generarse resumido por etapas",
    subtitulo: "Proyección mensual consolidada por características y ámbito de gestión",
    categoria: "Estimación Resumida por Etapas",
    tipo: "tabla",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo N° 6",
    descripcion: "Balance cuantitativo proyectado de la generación mensual de residuos sólidos durante las distintas etapas del ciclo de vida de la planta industrial.",
    columnas: ["Etapas del Proyecto", "Características del RRSS", "Por su Gestión", "Volumen / Masa Estimada Mensual", "Unidad de Medida"],
    filas: [
      {
        etapa: "Planificación",
        caracteristicas: "No peligrosos",
        gestion: "No municipal",
        volumen: "0",
        unidad: "kg/mes"
      },
      {
        etapa: "Planificación",
        caracteristicas: "Peligrosos",
        gestion: "No municipal",
        volumen: "0",
        unidad: "kg/mes"
      },
      {
        etapa: "Construcción / Montaje",
        caracteristicas: "No peligrosos",
        gestion: "No municipal (RCD)",
        volumen: "3,500",
        unidad: "kg/mes (evento temporal)"
      },
      {
        etapa: "Construcción / Montaje",
        caracteristicas: "No peligrosos",
        gestion: "Similar al Municipal",
        volumen: "450",
        unidad: "kg/mes"
      },
      {
        etapa: "Construcción / Montaje",
        caracteristicas: "Peligrosos",
        gestion: "No municipal",
        volumen: "120",
        unidad: "kg/mes"
      },
      {
        etapa: "Operación y Mantenimiento",
        caracteristicas: "No peligrosos (Valorizables y aprovechables)",
        gestion: "No municipal",
        volumen: "1,680",
        unidad: "kg/mes"
      },
      {
        etapa: "Operación y Mantenimiento",
        caracteristicas: "No peligrosos (Comedor, empaque y oficinas)",
        gestion: "Similar al Municipal",
        volumen: "2,750",
        unidad: "kg/mes"
      },
      {
        etapa: "Operación y Mantenimiento",
        caracteristicas: "Peligrosos (Sólidos contaminados y envases)",
        gestion: "No municipal",
        volumen: "475",
        unidad: "kg/mes"
      },
      {
        etapa: "Operación y Mantenimiento",
        caracteristicas: "Peligrosos (Líquidos: Aceites usados)",
        gestion: "No municipal",
        volumen: "160",
        unidad: "L/mes"
      },
      {
        etapa: "Cierre / Abandono",
        caracteristicas: "No peligrosos",
        gestion: "No municipal",
        volumen: "5,000",
        unidad: "kg total estimado"
      },
      {
        etapa: "Cierre / Abandono",
        caracteristicas: "Peligrosos",
        gestion: "No municipal",
        volumen: "800",
        unidad: "kg total estimado"
      }
    ]
  },
  {
    id: "anexo-7",
    numero: 7,
    codigo: "ANEXO-07",
    titulo: "Anexo N° 7: Cuadro estimado del volumen y cantidad de residuos sólidos a generarse por actividad generadora",
    subtitulo: "Asignación de Códigos del Convenio de Basilea y Anexos III / V del Reglamento LGIRS",
    categoria: "Estimación Detallada por Actividad",
    tipo: "tabla",
    fuenteNormativa: "Reglamento LGIRS (D.S. 014-2017-MINAM) y R.M. N.° 089-2023-MINAM, Anexo N° 7",
    descripcion: "Detalle técnico de cada corriente de residuo generada en la planta textil, con su código oficial de lista (nacional y Convenio de Basilea), proceso de origen y tasa de generación mensual.",
    columnas: ["Clasificación RRSS", "Residuo Sólido", "Código del Residuo (Reglamento / Basilea)", "Proceso / Actividad Generadora", "Volumen / Masa Mensual Estimada"],
    filas: [
      {
        clasificacion: "No peligroso / Similar al municipal",
        residuo: "Restos de comida y cáscaras",
        codigo: "Código 20 03 01",
        proceso: "Comedor y preparación de alimentos del personal",
        volumen: "1,100 kg/mes"
      },
      {
        clasificacion: "No peligroso / Similar al municipal",
        residuo: "Papel bond, sobres, cajas de cartón corrugado",
        codigo: "Código 20 01 01",
        proceso: "Administración, facturación y almacén de insumos",
        volumen: "850 kg/mes"
      },
      {
        clasificacion: "No peligroso / Similar al municipal",
        residuo: "Botellas plásticas y film de embalaje (PE)",
        codigo: "Código 20 01 39",
        proceso: "Embalaje de rollos de tela y consumo de bebidas",
        volumen: "420 kg/mes"
      },
      {
        clasificacion: "No peligroso / No municipal",
        residuo: "Retazos textiles, mermas de tejido e hilos",
        codigo: "Código 04 02 09 (B3030)",
        proceso: "Línea de extendido, corte automatizado y confección",
        volumen: "1,200 kg/mes"
      },
      {
        clasificacion: "No peligroso / No municipal",
        residuo: "Chatarra de acero y piezas mecánicas",
        codigo: "Código 12 01 01 (B1010)",
        proceso: "Mantenimiento correctivo de telares y compresores",
        volumen: "300 kg/mes"
      },
      {
        clasificacion: "Peligroso / No municipal",
        residuo: "Aceite dieléctrico e hidráulico gastado",
        codigo: "Código 13 02 08 (Y8 / A3020)",
        proceso: "Mantenimiento preventivo y lubricación de maquinaria",
        volumen: "160 L/mes"
      },
      {
        clasificacion: "Peligroso / No municipal",
        residuo: "Trapos, guaipe y absorbentes impregnados",
        codigo: "Código 15 02 02 (A4030)",
        proceso: "Limpieza mecánica y atención de fugas en telares",
        volumen: "90 kg/mes"
      },
      {
        clasificacion: "Peligroso / No municipal",
        residuo: "Envases vacíos con restos de colorantes y auxiliares",
        codigo: "Código 15 01 10* (A4130)",
        proceso: "Dosificación y preparación de baños de tintura",
        volumen: "225 kg/mes"
      },
      {
        clasificacion: "Peligroso / No municipal",
        residuo: "Lodos deshidratados de tratamiento fisicoquímico",
        codigo: "Código 04 02 19* (Y12)",
        proceso: "Planta de tratamiento de efluentes industriales (PTARI)",
        volumen: "140 kg/mes"
      },
      {
        clasificacion: "No peligroso / Similar al municipal",
        residuo: "Residuos de aseo, papel higiénico y barrido",
        codigo: "Código 20 03 99",
        proceso: "Servicios higiénicos, vestuarios y patios de tránsito",
        volumen: "380 kg/mes"
      },
      {
        clasificacion: "Peligroso / Bien Priorizado",
        residuo: "Computadoras, monitores, luminarias y neumáticos",
        codigo: "Código 16 02 14 / 16 01 03",
        proceso: "Sistemas informáticos, recambio de luminarias y transporte interno",
        volumen: "20 kg/mes promedio"
      }
    ]
  },
  {
    id: "anexo-8",
    numero: 8,
    codigo: "ANEXO-08",
    titulo: "Anexo N° 8: Principios de la Jerarquía en la gestión de los residuos sólidos",
    subtitulo: "Marco jerárquico del Decreto Legislativo N.° 1278 y Centro de Basilea",
    categoria: "Jerarquía de Gestión",
    tipo: "jerarquia",
    fuenteNormativa: "Convenio de Basilea (2005) / D.L. 1278, art. 5 / R.M. N.° 089-2023-MINAM, Anexo N° 8",
    descripcion: "Orden de prelación obligatorio en la toma de decisiones ambientales, privilegiando la prevención en origen y minimización de impactos frente a la disposición final.",
    columnas: ["Nivel de Prioridad", "Acción Estratégica", "Descripción Operativa en Planta Textil", "Meta Cuantitativa / Indicador", "Costo / Impacto Económico"],
    filas: [
      {
        nivel: "Nivel 1 (Máxima prioridad)",
        accion: "Prevenir y Minimizar la Generación",
        descripcion: "Optimización de patrones CAD/CAM para reducir mermas textiles en 8%; sustitución de suavizantes y solventes tóxicos por insumos biodegradables; compras de auxiliares en IBCs retornables de 1000 L.",
        meta: "Reducción del 10% en generación de envases de químicos",
        costo: "Menor costo operacional y reducción sustancial de pasivos"
      },
      {
        nivel: "Nivel 2 (Segunda prioridad)",
        accion: "Aprovechamiento y Valorización",
        descripcion: "Valorización material del cartón (90%), plástico limpio (80%), chatarra (95%) y retazos textiles (80%) mediante convenios formales con Empresas Operadoras de Residuos Sólidos (EO-RS). Compostaje de orgánicos.",
        meta: "≥ 80% de residuos no peligrosos aprovechables valorizados",
        costo: "Generación de ingresos por reciclaje y ahorro en tarifas de disposición"
      },
      {
        nivel: "Nivel 3 (Tercera prioridad)",
        accion: "Tratamiento Ambientalmente Adecuado",
        descripcion: "Tratamiento fisicoquímico de efluentes en PTARI y triple lavado de envases antes de su entrega. Incineración controlada o co-procesamiento térmico de aceites usados con EO-RS autorizada.",
        meta: "100% de aceites usados gestionados con operadores acreditados",
        costo: "Costo medio por servicio de tratamiento formal"
      },
      {
        nivel: "Nivel 4 (Última alternativa)",
        accion: "Disposición Final Segura",
        descripcion: "Confinamiento en rellenos sanitarios autorizados para residuos no aprovechables (Código 20 03 99) y celdas de seguridad para residuos peligrosos no valorizables, garantizando manifiestos oficiales MMRP.",
        meta: "Minimizar la masa dispuesta a menos del 20% del total generado",
        costo: "Mayor costo unitario por transporte y tarifa de celda de seguridad"
      }
    ]
  },
  {
    id: "anexo-9",
    numero: 9,
    codigo: "ANEXO-09",
    titulo: "Anexo N° 9: Análisis de alternativas para uso de insumos o materias primas",
    subtitulo: "Matriz comparativa de ecodiseño y minimización en origen según R.M. 089-2023-MINAM",
    categoria: "Análisis de Insumos y Minimización",
    tipo: "matriz",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo N° 9",
    descripcion: "Evaluación técnica, económica y ambiental de insumos alternativos para prevenir la generación de residuos peligrosos en las etapas de teñido, acabado y mantenimiento.",
    columnas: ["Insumo / Proceso Evaluado", "Alternativa Analizada", "Peligroso (SÍ/NO)", "Peligrosidad", "Disponible en Mercado Local", "Costos Manejo Residuo", "Uso Especial Requerido", "Alternativa Seleccionada y Justificación"],
    filas: [
      {
        insumo: "Auxiliar Suavizante Textil (Proceso de acabado)",
        alternativa: "Alternativa 1: Suavizante catiónico convencional en base a sales de amonio cuaternario",
        peligroso: "SÍ",
        peligrosidad: "Tóxico para organismos acuáticos e irritante dérmico severo",
        disponible: "SÍ",
        costos: "Medio - Alto",
        uso: "Suavizado permanente en fibras de algodón",
        decision: "NO SELECCIONADO. Genera efluentes de difícil degradación y residuos de envases peligrosos."
      },
      {
        insumo: "Auxiliar Suavizante Textil (Proceso de acabado)",
        alternativa: "Alternativa 2: Suavizante de base orgánica vegetal biodegradable y no tóxico",
        peligroso: "NO",
        peligrosidad: "No clasificado como peligroso",
        disponible: "SÍ",
        costos: "Bajos",
        uso: "Suavizado textil de alta compatibilidad ecológica",
        decision: "SELECCIONADO. Reduce drásticamente la toxicidad de envases y residuos generados."
      },
      {
        insumo: "Agente Desengrasante (Taller mecánico y telares)",
        alternativa: "Alternativa 1: Desengrasante a base de solventes clorados (tricloroetileno / percloroetileno)",
        peligroso: "SÍ",
        peligrosidad: "Tóxico, inflamable, cancerígeno y generador de vapores peligrosos",
        disponible: "SÍ",
        costos: "Altos",
        uso: "Desengrase profundo en maquinaria pesada",
        decision: "NO SELECCIONADO. Alto riesgo ocupacional y costo elevado de incineración de trapos contaminados."
      },
      {
        insumo: "Agente Desengrasante (Taller mecánico y telares)",
        alternativa: "Alternativa 2: Detergente desengrasante acuoso a base de tensoactivos biodegradables alcalinos",
        peligroso: "NO",
        peligrosidad: "No peligroso / biodegradabilidad superior a 90%",
        disponible: "SÍ",
        costos: "Bajos",
        uso: "Limpieza periódica de telares y equipos",
        decision: "SELECCIONADO. Disminuye en un 70% la peligrosidad de los residuos de limpieza y absorbentes."
      },
      {
        insumo: "Envases de Colorantes y Reactivos Químicos",
        alternativa: "Alternativa 1: Bidones plásticos de 20 L de un solo uso no retornables",
        peligroso: "SÍ",
        peligrosidad: "Residuos de envases impregnados (Código 15 01 10*)",
        disponible: "SÍ",
        costos: "Altos (Disposición en celda de seguridad)",
        uso: "Fraccionamiento de químicos",
        decision: "NO SELECCIONADO. Gran volumen de envases plásticos destinados a disposición final."
      },
      {
        insumo: "Envases de Colorantes y Reactivos Químicos",
        alternativa: "Alternativa 2: Contenedores intermedios para granel (IBCs) retornables de 1000 L con válvula",
        peligroso: "SÍ (reutilizable)",
        peligrosidad: "Controlada bajo sistema de recarga en circuito cerrado",
        disponible: "SÍ",
        costos: "Bajos por logística inversa",
        uso: "Abastecimiento continuo a dosificadores automáticos",
        decision: "SELECCIONADO. Elimina más del 85% de envases pequeños descartados anualmente."
      }
    ]
  },
  {
    id: "anexo-10",
    numero: 10,
    codigo: "ANEXO-10",
    titulo: "Anexo N° 10: Cuadro de incompatibilidad de los residuos sólidos",
    subtitulo: "Matriz de reactividad cruzada y prevención de riesgos según Centro de Basilea (2005)",
    categoria: "Incompatibilidad Química y Seguridad",
    tipo: "matriz",
    fuenteNormativa: "Centro Coordinador Convenio de Basilea (2005) / R.M. N.° 089-2023-MINAM, Anexo N° 10",
    descripcion: "Matriz de referencia técnica que identifica las consecuencias de incompatibilidad entre 12 familias de sustancias y residuos químicos generados en la industria.",
    columnas: ["N° Clase Química", "Grupo Químico", "Incompatibilidad Directa con:", "Consecuencia de Reactividad", "Medida de Control en Planta"],
    filas: [
      {
        clase: "1",
        grupo: "Ácidos Minerales y Oxidantes",
        incompatibleCon: "Cáusticos (2), Metales (5), Sulfuros, Cianuros, Reductores (10)",
        consecuencia: "Generador de calor (C), Fuego (F), Gas Tóxico (GT), Gas Inflamable (GI)",
        control: "Almacenamiento segregado en gabinetes para corrosivos con bandejas independientes"
      },
      {
        clase: "2",
        grupo: "Cáusticos / Bases Fuertes (Soda cáustica)",
        incompatibleCon: "Ácidos minerales (1), Metales reactivos (aluminio, zinc), Halogenados",
        consecuencia: "Reacción violenta exotérmica (C), Gas Inflamable (GI - Hidrógeno)",
        control: "Dique exclusivo separado de ácidos por murete estanco de al menos 15 cm"
      },
      {
        clase: "3",
        grupo: "Hidrocarburos Aromáticos y Solventes",
        incompatibleCon: "Agentes oxidantes fuertes (9), Ácidos concentrados",
        consecuencia: "Fuego (F), Generador de calor (C), Explosivos (E)",
        control: "Almacén ATRP antiexplosivo, conexión a tierra contra estática y ventilación forzada"
      },
      {
        clase: "4",
        grupo: "Orgánicos Halogenados",
        incompatibleCon: "Metales (5), Cáusticos (2), Reductores fuertes (10)",
        consecuencia: "Gas Tóxico (GT), Gas Inflamable (GI), Generador de calor (C)",
        control: "Prohibición de mezclar solventes clorados con aceites usados u otros residuos"
      },
      {
        clase: "5",
        grupo: "Metales y Virutas (Hierro, zinc, aluminio)",
        incompatibleCon: "Ácidos minerales (1), Cáusticos (2), Oxidantes fuertes (9)",
        consecuencia: "Generación de calor (C), Desprendimiento de gas inflamable (GI - H2)",
        control: "Acopio bajo techo en zona seca y libre de derrames químicos"
      },
      {
        clase: "6",
        grupo: "Metales Tóxicos y Compuestos Pesados",
        incompatibleCon: "Ácidos minerales (1), Agua y humedad excesiva",
        consecuencia: "Solubilización de toxinas (S), contaminación de aguas subterráneas",
        control: "Confinamiento hermético y piso con revestimiento epóxico impermeable"
      },
      {
        clase: "7",
        grupo: "Hidrocarburos Alifáticos (Aceites y lubricantes)",
        incompatibleCon: "Agentes oxidantes fuertes (9), Cloro, Peróxidos",
        consecuencia: "Fuego espontáneo (F), Generación violenta de calor (C)",
        control: "Cilindros rotulados con dique de contención del 110% del recipiente mayor"
      },
      {
        clase: "8",
        grupo: "Fenoles y Cresoles",
        incompatibleCon: "Oxidantes fuertes (9), Ácidos nítricos, Halógenos",
        consecuencia: "Fuego (F), Generación de calor (C), emanaciones tóxicas",
        control: "Manejo en recipientes especiales de acero inoxidable / PEAD rotulados"
      },
      {
        clase: "9",
        grupo: "Agentes Oxidantes Fuertes (Peróxido de hidrógeno, hipoclorito)",
        incompatibleCon: "Materia orgánica, Trapos, Metales (5), Reductores (10), Solventes (3)",
        consecuencia: "FUEGO INMEDIATO (F), Explosión (E), Liberación violenta de oxígeno",
        control: "Almacenamiento en módulo exterior aislado, alejado de trapos con aceite o combustibles"
      },
      {
        clase: "10",
        grupo: "Agentes Reductores Fuertes (Hidrosulfito de sodio)",
        incompatibleCon: "Oxidantes (9), Ácidos (1), Humedad ambiental",
        consecuencia: "Autoignición por humedad (F), Emisión de Gas Tóxico (GT - SO2)",
        control: "Tambores herméticos antihumedad con desecante de sílice gel"
      },
      {
        clase: "11",
        grupo: "Agua y Mezclas Acuosas",
        incompatibleCon: "Sustancias reactivas con agua (12), Metales alcalinos, Ácidos concentrados",
        consecuencia: "Reacciones exotérmicas violentas (C, E), salpicaduras corrosivas",
        control: "Asegurar que los reactivos anhidros permanezcan totalmente sellados y techados"
      },
      {
        clase: "12",
        grupo: "Sustancias Reactivas con Agua",
        incompatibleCon: "Agua, humedad ambiente, extintores de agua o espuma",
        consecuencia: "EXTREMADAMENTE REACTIVAS. Desprendimiento explosivo de calor y gases",
        control: "Extintores exclusivos de polvo químico seco (PQS) o CO2 en el almacén químico"
      }
    ]
  },
  {
    id: "anexo-11",
    numero: 11,
    codigo: "ANEXO-11",
    titulo: "Anexo N° 11: Cuadro resumen de medidas ambientales y presupuesto para la implementación del PMMRS",
    subtitulo: "Plan maestro de actividades, plazos, indicadores y costeo anualizado de S/ 139,000.00",
    categoria: "Medidas Ambientales y Presupuesto",
    tipo: "tabla",
    fuenteNormativa: "R.M. N.° 089-2023-MINAM, Anexo N° 11",
    descripcion: "Consolidación de las obligaciones ambientales, actividades preventivas, responsabilidades operativas, frecuencias de ejecución, indicadores de seguimiento y presupuesto asignado para el periodo 2027.",
    columnas: ["Etapa del Proyecto", "Actividad del Plan", "Impacto Ambiental Asociado", "Obligación / Compromiso Ambiental", "Presupuesto Asignado (S/)", "Responsable", "Plazo / Frecuencia", "Indicador de Monitoreo"],
    filas: [
      {
        etapa: "Operación y Mantenimiento",
        actividad: "Segregación en Fuente y Código de Colores",
        impacto: "Mezcla de residuos aprovechables con residuos peligrosos o comunes",
        obligacion: "Implementar y mantener estaciones de segregación con código NTP 900.058:2019 al 100% en todas las naves operativas.",
        presupuesto: 18000,
        responsable: "Jefe de Gestión Ambiental",
        plazo: "Enero - Diciembre 2027 (Mensual)",
        indicador: "% de estaciones de segregación conformes e inspeccionadas (Meta: 100%)"
      },
      {
        etapa: "Operación y Mantenimiento",
        actividad: "Acondicionamiento y Almacenamiento Central ATRP",
        impacto: "Riesgo de derrames de aceites y químicos, contaminación de suelos y red de desagüe",
        obligacion: "Mantenimiento de diques de contención secundaria, impermeabilización de soleras y reposición de kits antiderrames.",
        presupuesto: 25000,
        responsable: "Jefe de Mantenimiento / Jefe Ambiental",
        plazo: "1er Trimestre 2027 (Inspección trimestral)",
        indicador: "% de inspecciones técnicas de almacén conforme sin observaciones (Meta: 100%)"
      },
      {
        etapa: "Operación y Mantenimiento",
        actividad: "Programa de Capacitación y Sensibilización Ambiental",
        impacto: "Prácticas operativas deficientes y riesgo de accidentes por desconocimiento del personal",
        obligacion: "Capacitar a la totalidad de los 180 trabajadores propios y contratistas en segregación, contingencias y manejo seguro de RESPEL.",
        presupuesto: 12000,
        responsable: "Recursos Humanos / Jefe de Gestión Ambiental",
        plazo: "Enero - Diciembre 2027 (Trimestral)",
        indicador: "N.° de horas hombre de capacitación ejecutadas vs programadas (Meta: ≥ 95%)"
      },
      {
        etapa: "Operación y Mantenimiento",
        actividad: "Programa de Valorización Material y Reciclaje",
        impacto: "Sobrecarga de infraestructuras de disposición final y pérdida de recursos reciclables",
        obligacion: "Entregar mermas textiles, cartón, plástico y chatarra metálica a EO-RS valorizadoras autorizadas con certificados oficiales.",
        presupuesto: 36000,
        responsable: "Jefe de Gestión Ambiental / Logística",
        plazo: "Enero - Diciembre 2027 (Mensual)",
        indicador: "Porcentaje de residuos no peligrosos valorizados (Meta: ≥ 80% de generación)"
      },
      {
        etapa: "Operación y Mantenimiento",
        actividad: "Transporte y Disposición Final de RESPEL con EO-RS",
        impacto: "Riesgos a la salud pública y pasivos ambientales por manipulación externa indebida",
        obligacion: "Contratar EO-RS registrada ante MINAM para recolección, transporte y disposición en celda de seguridad con Manifiestos MMRP.",
        presupuesto: 48000,
        responsable: "Jefe de Gestión Ambiental",
        plazo: "Enero - Diciembre 2027 (Por despacho / mensual)",
        indicador: "% de Manifiestos de Manejo de Residuos Peligrosos con custodia conforme (Meta: 100%)"
      }
    ]
  },
  {
    id: "anexo-12",
    numero: 12,
    codigo: "ANEXO-12",
    titulo: "Anexo N° 12: Operaciones de Manejo de Residuos Sólidos",
    subtitulo: "Protocolos operativos normalizados bajo Decreto Legislativo N.° 1278",
    categoria: "Operaciones de Manejo",
    tipo: "documento",
    fuenteNormativa: "D.L. N.° 1278, art. 32 / R.M. N.° 089-2023-MINAM, Anexo N° 12",
    descripcion: "Especificación técnica y condiciones mínimas de las 8 operaciones unitarias que componen el ciclo de manejo de residuos sólidos no municipales en la planta.",
    columnas: ["Operación Unitaria", "Definición Normativa (D.L. 1278)", "Aplicación Práctica en Textiles Andina S.A.C.", "Registros y Evidencias Obligatorias"],
    filas: [
      {
        operacion: "1. Segregación",
        definicion: "Acción de agrupar determinados componentes o elementos físicos de los residuos sólidos para ser manejados en forma especial.",
        aplicacion: "Separación inmediata en la fuente en 7 clases normalizadas con tachos rotulados por código de color NTP 900.058:2019.",
        registros: "Checklist semanal de inspección de puntos ecológicos y estaciones de trabajo"
      },
      {
        operacion: "2. Barrido y Limpieza",
        definicion: "Conjunto de acciones de limpieza en áreas de trabajo, patios y almacenes para eliminar residuos generados.",
        aplicacion: "Barrido en seco en naves de tejeduría para evitar acumulación de pelusa textil; no mezclar pelusa con trapos con aceite.",
        registros: "Bitácora diaria de orden y limpieza 5S en áreas operativas"
      },
      {
        operacion: "3. Recolección Selectiva",
        definicion: "Acción de recoger los residuos de manera diferenciada según sus características y destino posterior.",
        aplicacion: "Rutas internas señalizadas y en horarios fijos usando carros con ruedas de goma diferenciados para aprovechables y peligrosos.",
        registros: "Plano de rutas internas y cronograma de recojo por turno operativo"
      },
      {
        operacion: "4. Transporte Interno y Externo",
        definicion: "Traslado de los residuos desde las fuentes internas hacia los almacenes, y externamente hacia instalaciones autorizadas.",
        aplicacion: "Interno: carros de tracción manual con bandejas estancas. Externo: camiones furgón autorizados de la EO-RS acreditada por MINAM.",
        registros: "Guías de remisión de transportista, Manifiestos MMRP y póliza de seguro ambiental"
      },
      {
        operacion: "5. Almacenamiento",
        definicion: "Operación de retención temporal de los residuos en condiciones técnicas, de seguridad y sanitarias adecuadas.",
        aplicacion: "Almacén Central de Aprovechables (techado e impermeable) y Almacén ATRP de Peligrosos (con contención de 110%, kit antiderrames y ventilación).",
        registros: "Libro de registro de entradas y salidas de almacén; Hojas de Datos de Seguridad (SDS)"
      },
      {
        operacion: "6. Acondicionamiento",
        definicion: "Transformación física que no modifica la naturaleza del residuo para facilitar su valorización o transporte (enfardado, trituración).",
        aplicacion: "Compactación y enfardado de cartón corrugado y retazos limpios en pacas de 80 kg; drenado de cilindros de aceite.",
        registros: "Pesaje por lote de fardos acondicionados y calibración de balanza"
      },
      {
        operacion: "7. Valorización",
        definicion: "Cualquier operación cuyo objetivo sea que el residuo sirva a una finalidad útil sustituyendo a otros materiales.",
        aplicacion: "Recuperación de fibra textil para hilatura de menor título; reciclaje de polietileno; compostaje de residuos orgánicos del comedor.",
        registros: "Certificados de valorización emitidos por plantas autorizadas y convenios de economía circular"
      },
      {
        operacion: "8. Disposición Final",
        definicion: "Procesos u operaciones para aislar y confinar los residuos en forma definitiva en lugares debidamente autorizados.",
        aplicacion: "Entrega a EO-RS autorizada para confinamiento de no aprovechables en Relleno Sanitario Modelo del Callao y de peligrosos en Relleno de Seguridad.",
        registros: "Certificados de disposición final y Manifiestos de Manejo de Residuos Peligrosos sellados"
      }
    ]
  }
];
