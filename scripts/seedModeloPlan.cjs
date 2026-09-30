const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAlJXMUV9xWTcV0rxRlHdAGVaz7uWJUuCo",
  authDomain: "pmmrs-gestion.firebaseapp.com",
  projectId: "pmmrs-gestion",
  storageBucket: "pmmrs-gestion.firebasestorage.app",
  messagingSenderId: "826719278112",
  appId: "1:826719278112:web:16ee80535e573dfb9b5845"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MODELO_PLAN_DATA = {
  id: "pmmrs-textiles-andina-2027",
  titulo: "Plan de Minimización y Manejo de Residuos Sólidos No Municipales - Textiles Andina S.A.C.",
  estado: "Finalizado",
  fechaCreacion: "2027-01-15",
  fechaModificacion: "2027-01-20",
  version: "Periodo de referencia: enero–diciembre 2027",
  esDemo: true,
  company: {
    razonSocial: "Textiles Andina S.A.C.",
    ruc: "20548912341",
    nombreComercial: "Textiles Andina",
    domicilio: "Planta textil Callao",
    departamento: "Callao",
    provincia: "Provincia Constitucional del Callao",
    distrito: "Callao",
    representanteLegal: "Jefe de Gestión Ambiental",
    dniRepresentante: "09876543",
    actividadEconomica: "Fabricación, teñido y acabado de tejidos de algodón y mezclas",
    sector: "Industria Manufacturera / Textil",
    numeroTrabajadores: 180,
    horarioOperacion: "Lunes a Sábado de 07:00 a 17:00 horas (Doble turno)",
    correoContacto: "gestionambiental@textilesandina.com.pe",
    telefonoContacto: "(01) 452-9800"
  },
  header: {
    logoUrl: "",
    razonSocialHeader: "TEXTILES ANDINA S.A.C.",
    tituloDocumento: "PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES",
    version: "Periodo de referencia: enero–diciembre 2027",
    fechaEmision: "Enero 2027",
    elaboradoPor: "Jefe de Gestión Ambiental",
    revisadoPor: "Gerencia de Operaciones Industriales",
    aprobadoPor: "Gerencia General / Directorio"
  },
  residuos: [
    {
      id: "res-1",
      tipo: "No Peligroso",
      categoria: "Orgánicos / Restos de Comida",
      descripcion: "Restos de alimentos crudos y cocidos del comedor del personal (Código 20 03 01)",
      estadoFisico: "Sólido",
      peligrosidad: ["Putrescible", "No peligroso similar al municipal"],
      generacionEstimadaKgMes: 1100,
      almacenamiento: "Contenedores herméticos con pedal en Comedor",
      colorContenedorNtp: "Marrón (Orgánicos)",
      destinoFinal: "Valorización orgánica mediante planta de compostaje autorizada",
      minimizacionAccion: "Campañas de reducción de desperdicio alimentario y dosificación de raciones"
    },
    {
      id: "res-2",
      tipo: "No Peligroso",
      categoria: "Retazos Textiles e Hilos",
      descripcion: "Mermas de tejido crudo, teñido e hilos de corte y confección (Código 04 02 09)",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte valorizable"],
      generacionEstimadaKgMes: 1200,
      almacenamiento: "Almacén Central de Aprovechables / Sacos identificados",
      colorContenedorNtp: "Blanco (Aprovechables)",
      destinoFinal: "Recuperación de fibra y fabricación de paños industriales con EO-RS autorizada",
      minimizacionAccion: "Optimización de trazos y patrones de corte automatizado CAD/CAM"
    },
    {
      id: "res-3",
      tipo: "No Peligroso",
      categoria: "Papel y Cartón de Embalaje",
      descripcion: "Cajas de cartón corrugado, conos de hilo desocupados y papel de empaque",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte valorizable"],
      generacionEstimadaKgMes: 850,
      almacenamiento: "Almacén Central no peligroso / Zona de enfardado",
      colorContenedorNtp: "Azul (Papel y Cartón)",
      destinoFinal: "Valorización material mediante empresas recicladoras de papel autorizadas",
      minimizacionAccion: "Retornabilidad de conos limpios y reutilización interna de cajas de cartón"
    },
    {
      id: "res-4",
      tipo: "No Peligroso",
      categoria: "Plástico y Películas de Film",
      descripcion: "Botellas plásticas y películas de film transparente (stretch film)",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte valorizable"],
      generacionEstimadaKgMes: 420,
      almacenamiento: "Almacén Central no peligroso",
      colorContenedorNtp: "Blanco (Plástico)",
      destinoFinal: "Valorización y reciclaje de polietileno con EO-RS registrada ante MINAM",
      minimizacionAccion: "Sustitución de embalajes de un solo uso por cobertores plásticos reutilizables"
    },
    {
      id: "res-5",
      tipo: "No Peligroso",
      categoria: "Metales / Chatarra",
      descripcion: "Chatarra de acero, virutas metálicas y repuestos dados de baja (Código 12 01 01)",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte"],
      generacionEstimadaKgMes: 300,
      almacenamiento: "Taller de Mantenimiento / Patio de metales",
      colorContenedorNtp: "Amarillo (Metales)",
      destinoFinal: "Comercialización y fundición siderúrgica mediante EO-RS autorizada",
      minimizacionAccion: "Mantenimiento preventivo planificado de telares y equipos para prolongar vida útil"
    },
    {
      id: "res-6",
      tipo: "Peligroso",
      categoria: "Aceites Lubricantes Usados",
      descripcion: "Aceites dieléctricos e hidráulicos gastados de maquinaria textil (Código 13 02 08)",
      estadoFisico: "Semisólido",
      peligrosidad: ["Tóxico", "Inflamable", "Hidrocarburos"],
      generacionEstimadaKgMes: 150,
      almacenamiento: "Cilindros de 55 gal en ATRP con dique de contención estanco",
      colorContenedorNtp: "Rojo (Peligrosos)",
      destinoFinal: "Re-refinación o co-procesamiento energético formal con EO-RS autorizada",
      minimizacionAccion: "Sistemas de micropulverización y control de fugas que reducen 15% los recambios"
    },
    {
      id: "res-7",
      tipo: "Peligroso",
      categoria: "Trapos con Hidrocarburos",
      descripcion: "Trapos, guaipe y absorbentes contaminados con aceites y solventes (Código 15 02 02)",
      estadoFisico: "Sólido",
      peligrosidad: ["Tóxico", "Inflamable"],
      generacionEstimadaKgMes: 90,
      almacenamiento: "Tambores herméticos rotulados en ATRP",
      colorContenedorNtp: "Rojo (Peligrosos)",
      destinoFinal: "Incineración controlada o celda de seguridad autorizada con Manifiesto MMRP",
      minimizacionAccion: "Sustitución de solventes clorados por desengrasantes detergentes biodegradables acuosos"
    },
    {
      id: "res-8",
      tipo: "Peligroso",
      categoria: "Envases de Químicos y Colorantes",
      descripcion: "Envases plásticos y metálicos contaminados con colorantes, auxiliares y reactivos",
      estadoFisico: "Envases",
      peligrosidad: ["Tóxico", "Corrosivo"],
      generacionEstimadaKgMes: 225,
      almacenamiento: "Zona confinada del ATRP sobre parihuelas plásticas antiderrame",
      colorContenedorNtp: "Rojo (Peligrosos)",
      destinoFinal: "Triple lavado y disposición final en relleno de seguridad a través de EO-RS",
      minimizacionAccion: "Adquisición de insumos químicos a granel en IBCs retornables de 1000 L"
    },
    {
      id: "res-9",
      tipo: "No Peligroso",
      categoria: "No Aprovechables / Comunes",
      descripcion: "Papel higiénico, restos de barrido de planta y EPPs sucios no contaminados",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte"],
      generacionEstimadaKgMes: 380,
      almacenamiento: "Contenedores negros distribuidos en servicios higiénicos y patios",
      colorContenedorNtp: "Negro (No aprovechables)",
      destinoFinal: "Disposición final en relleno sanitario autorizado mediante servicio municipal/EO-RS",
      minimizacionAccion: "Sensibilización continua al personal sobre consumo responsable de insumos de higiene"
    },
    {
      id: "res-10",
      tipo: "Peligroso",
      categoria: "Bienes Priorizados (RAEE / NFU)",
      descripcion: "Computadoras (4 und/año), Monitores (3 und/año), Luminarias LED (25 und/año) y Neumáticos de montacargas (2 und/año)",
      estadoFisico: "Sólido",
      peligrosidad: ["Metales pesados", "Manejo especial"],
      generacionEstimadaKgMes: 20,
      almacenamiento: "Almacén de equipos dados de baja techado y seco",
      colorContenedorNtp: "Zona señalizada RAEE / NFU",
      destinoFinal: "Entrega a sistemas de manejo colectivo o individual aprobados por PRODUCE/MINAM",
      minimizacionAccion: "Mantenimiento preventivo y renovación tecnológica por lotes"
    }
  ],
  capitulos: [
    {
      id: "cap-1",
      numero: 1,
      titulo: "1. Presentación / Introducción",
      completado: true,
      contenido: `Textiles Andina S.A.C. desarrolla actividades de preparación, teñido, lavado y acabado de tejidos. Estas operaciones utilizan fibras, colorantes, auxiliares químicos, detergentes, agentes de acabado, aceites lubricantes y materiales de embalaje, generándose residuos sólidos peligrosos y no peligrosos.

El problema de gestión identificado consiste en evitar que los residuos aprovechables se mezclen con residuos no aprovechables o peligrosos, reducir la generación de envases y residuos impregnados con sustancias químicas, asegurar condiciones técnicas de almacenamiento y garantizar que los residuos no valorizables sean entregados a operadores autorizados.

El PMMRS aborda el problema mediante una jerarquía que prioriza prevención y minimización, seguida de valorización, tratamiento cuando corresponda y, como última alternativa, disposición final. Las acciones se integran a los procesos de compra, producción, mantenimiento, almacenamiento y despacho.`
    },
    {
      id: "cap-2",
      numero: 2,
      titulo: "2. Objetivo",
      completado: true,
      contenido: `Objetivo general:
Prevenir y minimizar la generación de residuos sólidos y asegurar su gestión y manejo ambiental y sanitariamente adecuado durante la operación y mantenimiento de la planta.

Objetivos específicos:
• Reducir en 10 % la generación de envases de productos químicos por tonelada de tejido procesado al cierre de 2027, respecto de la línea base 2026.
• Incrementar la valorización de residuos no peligrosos aprovechables hasta 80 % de su generación valorizable.
• Mantener segregados los residuos peligrosos y no peligrosos desde la fuente hasta su entrega al operador correspondiente.
• Reducir en 15 % la generación de trapos y absorbentes contaminados mediante mantenimiento preventivo y control de fugas.
• Capacitar al 100 % del personal involucrado en manejo de residuos al menos una vez al año y al personal nuevo antes de iniciar labores.

Idea central: prevenir la generación en la fuente, aprovechar los residuos con potencial de valorización y controlar los riesgos asociados a los residuos peligrosos mediante segregación, almacenamiento, transporte y disposición adecuados.`
    },
    {
      id: "cap-3",
      numero: 3,
      titulo: "3. Alcance",
      completado: true,
      contenido: `El PMMRS aplica a las áreas productivas, almacenes, laboratorio, mantenimiento, servicios higiénicos, oficinas, comedor, patios, áreas de almacenamiento de residuos y demás instalaciones auxiliares de la planta.

El cumplimiento es obligatorio para trabajadores propios, contratistas, subcontratistas, proveedores y visitantes cuyas actividades puedan generar o involucrar residuos dentro del ámbito de la planta.`
    },
    {
      id: "cap-4",
      numero: 4,
      titulo: "4. Identificación, características y estimación de residuos sólidos",
      completado: true,
      contenido: `4.1 Identificación de las fuentes de generación de residuos sólidos
Diagrama de flujo simplificado del proceso y puntos de generación (Anexo 1)

• Preparación y teñido:
  - Entrada / actividad: Tejido crudo + colorantes + auxiliares + agua
  - Proceso: Preparación y teñido
  - Salida / residuo principal: Envases de químicos; lodos; trapos contaminados; residuos de tamizado

• Lavado y enjuague:
  - Entrada / actividad: Tejido teñido + agua
  - Proceso: Lavado y enjuague
  - Salida / residuo principal: Lodos; envases; material de filtración

• Acabado y secado:
  - Entrada / actividad: Tejido + productos de acabado
  - Proceso: Acabado y secado
  - Salida / residuo principal: Retazos textiles; envases; residuos de producto

• Mantenimiento:
  - Entrada / actividad: Equipos + lubricantes
  - Proceso: Mantenimiento
  - Salida / residuo principal: Aceite usado; filtros; trapos contaminados; chatarra

• Administración:
  - Entrada / actividad: Insumos de oficina
  - Proceso: Administración
  - Salida / residuo principal: Papel/cartón; plástico; no aprovechables

• Comedor:
  - Entrada / actividad: Consumo de alimentos
  - Proceso: Comedor
  - Salida / residuo principal: Orgánicos; envases; no aprovechables

4.2 Características de los residuos sólidos
Cuadro xx - Clasificación de los Residuos Sólidos por sus características y ámbito de gestión (Anexo 3)
- Etapa de operación y mantenimiento | Preparación y Teñido | Residuo: Envases contaminados con colorantes y auxiliares | Característica: Tóxico / Inflamable | Por su manejo: Peligroso | Por su gestión: No municipal
- Etapa de operación y mantenimiento | Mantenimiento mecánico | Residuo: Aceite lubricante usado | Característica: Tóxico / Inflamable | Por su manejo: Peligroso | Por su gestión: No municipal
- Etapa de operación y mantenimiento | Acabado de tejidos | Residuo: Retazos de tela limpios | Característica: No aplica | Por su manejo: No peligroso | Por su gestión: No municipal
- Etapa de operación y mantenimiento | Almacenes y Oficinas | Residuo: Cajas de cartón y papel de embalaje | Característica: No aplica | Por su manejo: No peligroso | Por su gestión: Similar al municipal

4.3 Estimación de la masa, volumen o unidades
Cuadro xx - Estimado del volumen y cantidad de residuos sólidos a generarse resumido por etapas (Anexo 6)
- Operación y Mantenimiento | No peligrosos | Similar al Municipal | 2,750 kg/mes
- Operación y Mantenimiento | No peligrosos | No municipal | 1,680 kg/mes
- Operación y Mantenimiento | Peligrosos | No municipal | 475 kg/mes y 160 l/mes

Cuadro xx - Cuadro estimado del volumen y cantidad de residuos sólidos a generarse por actividad generadora (Anexo 7)
- No peligroso / Similar al municipal | Restos de comida | Código 20 03 01 | Comedor del personal | 1,100 kg/mes
- No peligroso / No municipal | Retazos textiles y hilos | Código 04 02 09 | Línea de corte y acabado | 1,200 kg/mes
- No peligroso / No municipal | Chatarra metálica limpia | Código 12 01 01 | Mantenimiento de telares | 300 kg/mes
- Peligroso / No municipal | Aceite lubricante usado | Código 13 02 08 | Mantenimiento de maquinaria | 160 l/mes
- Peligroso / No municipal | Trapos con hidrocarburos | Código 15 02 02 | Mantenimiento y mecánica | 90 kg/mes`
    },
    {
      id: "cap-5",
      numero: 5,
      titulo: "5. Estrategias para la prevención y/o minimización",
      completado: true,
      contenido: `La estrategia prioriza evitar la generación, reducir cantidad/peligrosidad, aprovechar materiales y optimizar el uso de materias primas, insumos, agua y energía.

5.1 Prevenir y/o minimizar
Cuadro xx - Análisis de alternativas para uso de insumos o materias primas (Anexo 9)

Insumo: Auxiliar suavizante para textiles (Proceso de acabado de tejidos)
• Alternativa 1: Suavizante catiónico convencional en base a amonio cuaternario
  - Peligroso: Sí (Tóxico para la vida acuática e irritante dérmico)
  - Disponible en el mercado local: Sí | Costos para el manejo del residuo: Medio
  - Uso especial: Suavizado permanente en fibras de algodón y mezclas
  - Decisión: No seleccionado por su mayor carga contaminante en efluentes y residuos.
• Alternativa 2: Suavizante biodegradable de origen orgánico (derivado de aceites vegetales)
  - Peligroso: No
  - Disponible en el mercado local: Sí | Costos para el manejo del residuo: Bajos
  - Uso especial: Suavizado de alta eficiencia con menor impacto ambiental
  - Decisión: Alternativa seleccionada (Menor costo de manejo de residuos y alta compatibilidad ambiental).

Insumo: Agente desengrasante para mantenimiento mecánico (Área de teñido y telares)
• Alternativa 1: Desengrasante en base a solventes clorados
  - Peligroso: Sí (Tóxico, inflamable y corrosivo por hidrocarburos)
  - Disponible en el mercado local: Sí | Costos para el manejo del residuo: Altos
  - Uso especial: Limpieza profunda de grasas pesadas en maquinaria
  - Decisión: No seleccionado por el alto costo de gestión de sus residuos peligrosos.
• Alternativa 2: Desengrasante detergente de base acuosa y tensoactivos biodegradables
  - Peligroso: No
  - Disponible en el mercado local: Sí | Costos para el manejo del residuo: Bajos
  - Uso especial: Limpieza de mantenimiento general en equipos textiles
  - Decisión: Alternativa seleccionada (Reduce significativamente la generación de trapos impregnados peligrosos).

5.2 Material de descarte
No se declara material de descarte por el solo hecho de que un material tenga valor económico. Se evaluó como material de descarte únicamente aquel que cumple las condiciones previstas por la normativa y que puede ser directamente aprovechable como insumo en la misma u otra actividad productiva, investigación o desarrollo de nuevas tecnologías/materiales.
- Retazos textiles limpios | Origen: Corte/acabado | Cantidad: 1 200 kg/mes | Temporalidad: Mensual | Alternativa: Recuperación de fibra / fabricación de paños, previa evaluación
- Conos de cartón limpios | Origen: Bobinado | Cantidad: 180 kg/mes | Temporalidad: Mensual | Alternativa: Reutilización interna o valorización

5.3 Régimen especial de gestión de residuos sólidos de bienes priorizados
Cuadro xx - Estimado de la cantidad de residuos sólidos de bienes priorizados (Anexo 4)
- Computadoras de oficina en desuso | Régimen: RAEE | Categoría: 3 | Unidades: 4 unidades | Masa: 45 kg | Período: Anual
- Monitores y pantallas | Régimen: RAEE | Categoría: 4 | Unidades: 3 unidades | Masa: 30 kg | Período: Anual
- Luminarias LED / Tubos fluorescentes | Régimen: RAEE | Categoría: 5 | Unidades: 25 unidades | Masa: 45 kg | Período: Anual
- Neumáticos de montacargas | Régimen: NFU | Categoría: B | Unidades: 2 unidades | Masa: 120 kg | Período: Anual`
    },
    {
      id: "cap-6",
      numero: 6,
      titulo: "6. Gestión y manejo de residuos sólidos",
      completado: true,
      contenido: `Priorización en el manejo de residuos sólidos (Anexo 8):
Prevenir y minimizar la generación -> Aprovechamiento y valorización de residuos sólidos -> Tratamiento -> Disposición final (Fuente: Anexo 8 de la R.M. 089-2023-MINAM).

6.a Segregación
La segregación se realiza en la fuente y se mantienen diferenciados los residuos durante su manejo. Se emplean los colores y categorías aplicables de la NTP 900.058:2019, considerando los residuos efectivamente generados en cada zona.

Cuadro xx: Clasificación de los residuos sólidos por sus características para su almacenamiento (Anexo 5)
- Papel y Cartón: Cajas de cartón de embalaje, conos de hilo | Similares a los municipales | Color Azul
- Plástico: Botellas, películas de film transparente | Similares a los municipales | Color Blanco
- Metales: Chatarra de acero, virutas metálicas | No municipal | Color Amarillo
- Orgánicos: Restos de alimentos del comedor | Similares a los municipales | Color Marrón
- Vidrio: Envases de laboratorio y botellas | Similares a los municipales | Color Plomo
- Peligrosos: Envases con restos de químicos, trapos con hidrocarburos, aceites | No municipal | Color Rojo
- No aprovechables: Papel higiénico, restos de barrido, EPPs sucios | Similares / No municipal | Color Negro

6.b Recolección selectiva
- Ruta 1: Producción → almacén central | Frecuencia: Diaria | Equipo: Carro interno cerrado/identificado | Destino: Almacenamiento central
- Ruta 2: Mantenimiento → almacén central | Frecuencia: Diaria o según generación | Equipo: Carro con bandeja de contención | Destino: Almacenamiento de peligrosos
- Ruta 3: Oficinas/comedor → área correspondiente | Frecuencia: Diaria | Equipo: Carros diferenciados | Destino: Almacenamiento central

6.c Almacenamiento
Se implementan áreas de almacenamiento inicial, intermedio cuando resulte necesario y central. El almacenamiento de residuos peligrosos considera impermeabilización, contención de posibles derrames, protección frente a condiciones climáticas, señalización, acceso restringido, compatibilidad química y disponibilidad de kit para derrames.
- Almacén central no peligroso | Coordenadas UTM WGS84: E 270 150 / N 8 667 420 | Características: Piso impermeable, techado, señalización y áreas diferenciadas
- Almacén central peligroso | Coordenadas UTM WGS84: E 270 180 / N 8 667 405 | Características: Piso impermeable, contención secundaria, techado, ventilación, señalización y kit antiderrames
- Almacenamiento inicial producción | Coordenadas UTM WGS84: E 270 080 / N 8 667 500 | Características: Contenedores diferenciados y señalizados
La ubicación se consigna en el plano georreferenciado del establecimiento (ver anexos). Los residuos peligrosos se mantienen separados de materiales incompatibles y se respetan las condiciones indicadas en las hojas de seguridad de las sustancias involucradas.

6.d Transporte
El transporte externo de residuos no municipales será efectuado por una EO-RS debidamente autorizada, según corresponda. Para residuos peligrosos se utilizarán los documentos y registros exigibles, incluyendo los manifiestos correspondientes.

6.e Acondicionamiento
Cuando sea técnica y ambientalmente viable, se realizarán compactación, embalaje, enfardado u otras operaciones que faciliten la valorización o transporte. No se realizarán operaciones que puedan mezclar residuos incompatibles.

6.f Valorización
- Cartón/papel | Tipo: Material | Destino previsto: Valorizador/EO-RS autorizado según corresponda | Meta: ≥90 %
- Plástico limpio | Tipo: Material | Destino previsto: Valorizador/EO-RS | Meta: ≥80 %
- Retazos textiles | Tipo: Material | Destino previsto: Recuperador/valorizador técnicamente habilitado | Meta: ≥80 %
- Chatarra metálica | Tipo: Material | Destino previsto: Valorizador/EO-RS | Meta: ≥95 %
- Aceite usado | Tipo: Material/gestión especializada | Destino previsto: Operador autorizado según corresponda | Meta: 100 % manejo controlado

6.g Tratamiento
La planta no realiza tratamiento de residuos peligrosos. Cuando se requiera tratamiento, se contratará a una instalación u operador que cuente con las autorizaciones correspondientes y se documentará el tipo de tratamiento y cantidad tratada.

6.h Disposición final
Los residuos no valorizables y aquellos que, por sus características, requieran disposición final serán entregados a la EO-RS correspondiente para su traslado a infraestructura autorizada. Se conservarán los documentos que acrediten la trazabilidad del manejo.`
    },
    {
      id: "cap-7",
      numero: 7,
      titulo: "7. Descripción de las medidas ambientales",
      completado: true,
      contenido: `Las medidas ambientales implementadas en la planta textil «Textiles Andina S.A.C.» están diseñadas para prevenir, mitigar y corregir de manera efectiva los impactos negativos asociados a la generación, manipulación y disposición de los residuos sólidos peligrosos y no peligrosos. Estas acciones responden directamente a las exigencias operativas y a los compromisos asumidos en el Instrumento de Gestión Ambiental (IGA) complementario, salvaguardando componentes críticos como el suelo, el recurso hídrico, la calidad del aire y la salud ocupacional del personal dentro de las instalaciones industriales.

Para garantizar el cumplimiento de los objetivos de control y minimización, la ejecución de estas medidas contempla un enfoque preventivo en las líneas de producción y mantenimiento, respaldado por una asignación presupuestal específica y responsables claramente definidos. Un resumen detallado de las medidas ambientales, los impactos asociados, los plazos de implementación, los indicadores de seguimiento y los costos requeridos para el desarrollo del plan se encuentra consolidado en el cuadro XXA de este documento.

Cuadro XXA - Resumen de medidas ambientales y presupuesto para la implementación del PMMRS (Anexo 11):
• Segregación en fuente:
  - Etapa: Operación y Mantenimiento
  - Impacto: Mezcla de residuos sólidos aprovechables con peligrosos
  - Obligación / Compromiso ambiental: Mantener la segregación al 100% en todas las zonas operativas de la planta
  - Presupuesto: S/ 18,000.00
  - Responsable: Jefe de Gestión Ambiental
  - Plazo: Enero - Diciembre 2027 (Mensual)
  - Indicador: % de puntos de segregación conformes

• Almacenamiento de residuos peligrosos:
  - Etapa: Operación y Mantenimiento
  - Impacto: Riesgo de derrames y contaminación de suelo o agua
  - Obligación / Compromiso ambiental: Implementar y mantener contención secundaria y kit antiderrames
  - Presupuesto: S/ 25,000.00
  - Responsable: Jefe de Mantenimiento
  - Plazo: 1er trimestre de 2027 (Inspección trimestral)
  - Indicador: % de inspecciones de almacén conformes

• Capacitación y sensibilización:
  - Etapa: Operación y Mantenimiento
  - Impacto: Manejo inadecuado por desconocimiento del personal
  - Obligación / Compromiso ambiental: Capacitar al 100% del personal operativo y administrativo en manejo de residuos
  - Presupuesto: S/ 12,000.00
  - Responsable: RR.HH. / Jefe Ambiental
  - Plazo: Enero - Diciembre 2027 (Trimestral)
  - Indicador: % de personal capacitado respecto al total

• Valorización de residuos:
  - Etapa: Operación y Mantenimiento
  - Impacto: Incremento de volumen destinado a disposición final
  - Obligación / Compromiso ambiental: Entregar los residuos aprovechables (cartón, plástico, metales, retazos) a valorizadores autorizados
  - Presupuesto: S/ 36,000.00
  - Responsable: Jefe de Gestión Ambiental
  - Plazo: Enero - Diciembre 2027 (Mensual)
  - Indicador: % de residuos valorizados respecto al total generable

• Gestión externa de peligrosos:
  - Etapa: Operación y Mantenimiento
  - Impacto: Riesgo sanitario y pasivos ambientales
  - Obligación / Compromiso ambiental: Asegurar la recolección, transporte y disposición por EO-RS autorizada con trazabilidad total
  - Presupuesto: S/ 48,000.00
  - Responsable: Jefe de Gestión Ambiental
  - Plazo: Enero - Diciembre 2027 (Según generación / despacho)
  - Indicador: % de manifiestos y trazabilidad completa`
    },
    {
      id: "cap-8",
      numero: 8,
      titulo: "8. Medidas de atención ante emergencias",
      completado: true,
      contenido: `En el desarrollo de las operaciones de la planta textil, la gestión de residuos sólidos —en particular la manipulación, almacenamiento temporal y traslado interno de residuos peligrosos como aceites usados, trapos con hidrocarburos y envases de productos químicos— conlleva riesgos inherentes que podrían desencadenar contingencias operativas o incidentes ambientales. Para mitigar estos escenarios, se han identificado las principales emergencias potenciales, tales como derrames de sustancias o residuos peligrosos, conatos de incendio en las áreas de almacenamiento central, ruptura de envases y incidentes durante el transporte interno.

Las medidas de respuesta correspondientes se estructuran bajo un enfoque secuencial de prevención y control (antes, durante y después del evento), articulándose de manera directa con el Plan de Contingencias del Instrumento de Gestión Ambiental (IGA) de la planta y cumpliendo con lo dispuesto en los artículos 50° y 60° del Reglamento de la Ley de Gestión Integral de Residuos Sólidos (LGIRS). Estas acciones contemplan la disponibilidad permanente de kits antiderrames, equipos de protección personal (EPP), sistemas contra incendios, la capacitación continua del personal brigadista y la correcta trazabilidad y disposición de los residuos generados tras la atención de cualquier eventualidad.

Cuadro xx – Medidas de atención ante emergencias:
• Derrame de aceite/químico:
  - Antes: Kit antiderrames, inspección, capacitación, SDS disponibles
  - Durante: Aislar área, detener fuente si es seguro, contener, recoger material contaminado, usar EPP
  - Después: Gestionar absorbentes como residuo correspondiente, investigar causa y reponer kit

• Incendio en almacenamiento:
  - Antes: Extintores, orden, separación de incompatibles, inspección
  - Durante: Activar emergencia, evacuar, controlar con medios adecuados si corresponde
  - Después: Evaluar residuos generados por incendio, segregar y gestionar conforme a sus características

• Ruptura de envase de químico:
  - Antes: Almacenamiento con contención y compatibilidad
  - Durante: Aislar, consultar SDS, contener y recoger
  - Después: Gestionar residuos contaminados y registrar incidente

• Derrame durante transporte interno:
  - Antes: Rutas definidas y carros adecuados
  - Durante: Aislar, contener y recoger
  - Después: Inspeccionar ruta/equipo y registrar incidente

Estas medidas se articulan con el Plan de Contingencias del IGA. El PMMRS no sustituye dicho instrumento.`
    },
    {
      id: "cap-9",
      numero: 9,
      titulo: "9. Indicadores de seguimiento y control",
      completado: true,
      contenido: `Para verificar el cumplimiento estricto de las obligaciones y compromisos ambientales asumidos en el Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS), la planta textil implementa un sistema continuo de seguimiento operativo y administrativo orientado a evaluar la eficacia de las medidas adoptadas. Este control sistematiza las actividades de supervisión en las diferentes etapas del proceso productivo, permitiendo medir de forma cuantitativa y cualitativa el desempeño ambiental de la gestión de residuos mediante indicadores clave de rendimiento (KPIs).

Estos indicadores evalúan aspectos críticos como el porcentaje de puntos de segregación conformes, la eficiencia en la valorización de residuos aprovechables, la cobertura de capacitación del personal y el cumplimiento de la trazabilidad en la entrega de residuos peligrosos a operadores autorizados (EO-RS). El detalle de las actividades sujetas a control, sus respectivas frecuencias, responsables e indicadores de desempeño se encuentra integrado de manera referencial en el cuadro XXA.

Ver Cuadro XXA (Sección 7 del presente Plan).`
    },
    {
      id: "cap-10",
      numero: 10,
      titulo: "10. Cronograma de implementación",
      completado: true,
      contenido: `La ejecución de las medidas ambientales, compromisos operativos y actividades de control del Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS) se encuentra programada de manera continua y estructurada a lo largo del periodo de referencia anual de la planta textil. Esta programación establece los plazos específicos de implementación —con frecuencias mensuales, trimestrales y anuales— para garantizar que cada actividad preventiva, de segregación, valorización y supervisión se ejecute de manera oportuna.

El despliegue temporal de estas acciones, junto con sus respectivos responsables, indicadores de control y asignación presupuestal, se encuentra consolidado y articulado de forma integral en el cuadro resumen del cuadro XXA de este documento.

Ver Cuadro XXA (Sección 7 del presente Plan).`
    },
    {
      id: "cap-11",
      numero: 11,
      titulo: "11. Presupuesto y recursos necesarios",
      completado: true,
      contenido: `Para garantizar la correcta ejecución de las estrategias, medidas y actividades contempladas en la gestión y manejo integral de los residuos sólidos, la planta textil ha realizado una estimación rigurosa de los recursos económicos, logísticos y humanos necesarios a lo largo del periodo operativo. Esta planificación financiera asegura la disponibilidad de insumos, equipos de contención, programas de capacitación, servicios de recolección externa y labores de supervisión continua.

El desglose de la inversión requerida para cada compromiso ambiental, vinculado directamente a sus respectivos responsables, plazos e indicadores de control, se encuentra consolidado y estructurado en el cuadro resumen del Cuadro XXA de este documento.

Presupuesto Total Anual Consolidado: S/ 139,000.00
- Segregación en fuente: S/ 18,000.00 (Mensual)
- Almacenamiento de residuos peligrosos (ATRP / Contención): S/ 25,000.00 (Trimestral)
- Capacitación y sensibilización: S/ 12,000.00 (Trimestral)
- Valorización de residuos no peligrosos: S/ 36,000.00 (Mensual)
- Gestión externa de residuos peligrosos con EO-RS: S/ 48,000.00 (Por despacho)

Ver Cuadro XXA (Sección 7 del presente Plan).`
    },
    {
      id: "cap-12",
      numero: 12,
      titulo: "12. Funciones del responsable de la gestión y manejo de residuos sólidos",
      completado: true,
      contenido: `Responsable: Jefe de Gestión Ambiental de la planta.

• Implementar, mantener y actualizar el PMMRS y coordinar su integración con el IGA correspondiente.
• Verificar la segregación, almacenamiento y manejo de residuos en las áreas generadoras.
• Mantener el registro interno de generación y consolidar información de cantidades y operaciones de manejo.
• Coordinar la entrega de residuos a operadores autorizados y verificar la documentación correspondiente.
• Supervisar la capacitación y sensibilización del personal, contratistas y proveedores.
• Verificar el cumplimiento de las medidas de prevención, minimización, valorización y control.
• Realizar seguimiento de indicadores y elaborar reportes internos.
• Coordinar la atención de incidentes relacionados con residuos y la aplicación de medidas correctivas.
• Proponer anualmente oportunidades de sustitución de insumos, ecoeficiencia, retornabilidad y valorización.
• Custodiar los documentos de trazabilidad y evidencias de cumplimiento del PMMRS.`
    },
    {
      id: "cap-13",
      numero: 13,
      titulo: "13. Anexos documentales del PMMRS",
      completado: true,
      contenido: `Anexo propuesto | Documento | Finalidad:
• Anexo A: Plano de distribución de la planta con puntos de generación y rutas internas de residuos | Finalidad: Ubicar fuentes, contenedores, almacenes y rutas
• Anexo B: Plano georreferenciado de las áreas de almacenamiento de residuos, con coordenadas UTM WGS84 | Finalidad: Sustentar la ubicación de almacenamiento
• Anexo C: Inventario de residuos sólidos y fichas de caracterización | Finalidad: Respaldar identificación, clasificación y cantidades
• Anexo D: Hojas de Datos de Seguridad (SDS/MSDS) de colorantes, auxiliares químicos, detergentes, solventes, lubricantes y otros insumos relevantes | Finalidad: Sustentar peligrosidad, incompatibilidades, condiciones de almacenamiento y respuesta ante emergencias
• Anexo E: Matriz de incompatibilidad química aplicada a los residuos realmente generados | Finalidad: Facilitar segregación y almacenamiento seguro
• Anexo F: Procedimientos internos de segregación, almacenamiento, derrames y manejo de residuos peligrosos | Finalidad: Demostrar controles operativos
• Anexo G: Registro de capacitación y sensibilización | Finalidad: Evidenciar ejecución del programa
• Anexo H: Documentación de la EO-RS contratada: registro/autorización aplicable y documentos contractuales | Finalidad: Sustentar la gestión externa
• Anexo I: Modelos/ejemplos de registros internos de generación, entrega y trazabilidad | Finalidad: Facilitar seguimiento
• Anexo J: Registros o evidencias de valorización de residuos | Finalidad: Sustentar cumplimiento de metas
• Anexo K: Inventario de bienes priorizados: RAEE, NFU u otros que correspondan | Finalidad: Sustentar el numeral 5.3
• Anexo L: Plan de Contingencias o extracto pertinente del IGA, cuando corresponda | Finalidad: Vincular respuesta ante emergencias
• Anexo M: Fichas técnicas de insumos alternativos evaluados para minimización | Finalidad: Sustentar decisiones de sustitución
• Anexo N: Fotografías referenciales/registro fotográfico de áreas y contenedores | Finalidad: Evidenciar condiciones existentes o implementación

Referencias normativas y documentales:
• Ministerio del Ambiente. Resolución Ministerial N.° 089-2023-MINAM, que aprueba el “Contenido Mínimo del Plan de Minimización y Manejo de Residuos Sólidos No Municipales”, 9 de marzo de 2023. Fuente oficial: https://www.gob.pe/institucion/minam/normas-legales/3980927-089-2023-minam
• Anexo de la RM N.° 089-2023-MINAM: “Contenido Mínimo del Plan de Minimización y Manejo de Residuos Sólidos No Municipales”.
• Decreto Legislativo N.° 1278, Ley de Gestión Integral de Residuos Sólidos, y su Reglamento aprobado por Decreto Supremo N.° 014-2017-MINAM y modificatorias, en cuanto resulten aplicables al caso concreto.
• NTP 900.058:2019, Gestión de residuos. Código de colores para el almacenamiento de residuos sólidos, en los términos considerados por el contenido mínimo.`
    }
  ],
  presupuestoTotal: 139000
};

async function seed() {
  console.log("Iniciando guardado de colección 'modelo_plan' en Firestore...");
  
  // 1. Guardar documento principal del plan modelo
  const planDocRef = doc(db, "modelo_plan", "pmmrs_textiles_andina_2027");
  await setDoc(planDocRef, {
    ...MODELO_PLAN_DATA,
    updatedAt: serverTimestamp()
  });
  console.log("Documento principal guardado: modelo_plan/pmmrs_textiles_andina_2027");

  // 2. Guardar también cada uno de los 13 capítulos como documento individual dentro de la colección modelo_plan_capitulos
  for (const cap of MODELO_PLAN_DATA.capitulos) {
    const capDocRef = doc(db, "modelo_plan", `capitulo_${cap.numero}`);
    await setDoc(capDocRef, {
      ...cap,
      planId: "pmmrs_textiles_andina_2027",
      updatedAt: serverTimestamp()
    });
    console.log(`Capítulo ${cap.numero} guardado en modelo_plan/capitulo_${cap.numero}`);
  }

  // 3. Guardar documento con información de versión del modelo
  const infoRef = doc(db, "modelo_plan", "info");
  await setDoc(infoRef, {
    id: "info",
    nombre: "Plan Modelo Oficial R.M. 089-2023-MINAM & D.L. 1278",
    empresa: "Textiles Andina S.A.C.",
    periodo: "enero–diciembre 2027",
    totalCapitulos: 13,
    totalResiduos: MODELO_PLAN_DATA.residuos.length,
    presupuestoTotal: MODELO_PLAN_DATA.presupuestoTotal,
    updatedAt: serverTimestamp()
  });

  console.log("¡Colección 'modelo_plan' creada y poblada exitosamente en Firestore!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Error al poblar 'modelo_plan':", err);
  process.exit(1);
});
