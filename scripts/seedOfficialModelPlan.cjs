const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, serverTimestamp } = require("firebase/firestore");

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

// Modelo fiel del Plan de Minimización y Manejo de Residuos Sólidos No Municipales
// aprobado según Resolución Ministerial N.° 089-2023-MINAM y D.L. 1278
const MODELO_PLAN_COMPLETO = {
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
    domicilio: "Av. Elmer Faucett N.° 4520, Zona Industrial",
    departamento: "Callao",
    provincia: "Provincia Constitucional del Callao",
    distrito: "Callao",
    representanteLegal: "Ing. Carlos Mendoza Alarcón",
    dniRepresentante: "09876543",
    actividadEconomica: "Fabricación, teñido, lavado y acabado de tejidos de algodón y mezclas (CIIU 1312 / 1313)",
    sector: "Industria Manufacturera / Subsector Textil (PRODUCE)",
    numeroTrabajadores: 180,
    horarioOperacion: "Lunes a Sábado de 07:00 a 17:00 horas (Doble turno operativo)",
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
      descripcion: "Restos de preparación y consumo de alimentos del comedor del personal de planta (Código 20 03 01)",
      estadoFisico: "Sólido",
      peligrosidad: ["Putrescible", "Similar al municipal"],
      generacionEstimadaKgMes: 1100,
      almacenamiento: "Contenedores herméticos de 120 L con tapa a pedal en comedor y cocina",
      colorContenedorNtp: "Marrón (Orgánicos)",
      destinoFinal: "Valorización orgánica mediante planta de compostaje autorizada",
      minimizacionAccion: "Campañas de reducción de desperdicio alimentario y dosificación balanceada de raciones"
    },
    {
      id: "res-2",
      tipo: "No Peligroso",
      categoria: "Retazos Textiles e Hilos",
      descripcion: "Mermas de tejido crudo, teñido e hilos de corte y confección (Código 04 02 09)",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte valorizable"],
      generacionEstimadaKgMes: 1200,
      almacenamiento: "Almacén Central de Aprovechables / Sacos de polipropileno identificados",
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
      almacenamiento: "Almacén Central no peligroso / Zona de enfardado y apilamiento",
      colorContenedorNtp: "Azul (Papel y Cartón)",
      destinoFinal: "Valorización material mediante empresas recicladoras de papel autorizadas",
      minimizacionAccion: "Retornabilidad de conos limpios al proveedor y reutilización interna de cajas de cartón"
    },
    {
      id: "res-4",
      tipo: "No Peligroso",
      categoria: "Plástico y Películas de Film",
      descripcion: "Botellas plásticas PET y películas de film transparente de embalaje (stretch film)",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte valorizable"],
      generacionEstimadaKgMes: 420,
      almacenamiento: "Almacén Central no peligroso / Contenedor rotulado",
      colorContenedorNtp: "Blanco (Plástico)",
      destinoFinal: "Valorización y reciclaje de polietileno con EO-RS registrada ante MINAM",
      minimizacionAccion: "Sustitución de embalajes de un solo uso por cobertores plásticos lavables y reutilizables"
    },
    {
      id: "res-5",
      tipo: "No Peligroso",
      categoria: "Metales / Chatarra",
      descripcion: "Chatarra de acero, virutas metálicas y repuestos dados de baja de telares (Código 12 01 01)",
      estadoFisico: "Sólido",
      peligrosidad: ["Inerte"],
      generacionEstimadaKgMes: 300,
      almacenamiento: "Taller de Mantenimiento / Patio de metales sobre parihuelas",
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
      almacenamiento: "Cilindros metálicos de 55 gal en Almacén ATRP con dique estanco de contención",
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
Diagrama de flujo simplificado del proceso y puntos de generación (Anexo 1 y Anexo 2)

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

### Cuadro 1 - Clasificación de los residuos sólidos por sus características y ámbito de gestión

| N° | Etapa | Proceso / Actividad generadora | Residuo | Característica de peligrosidad | Clasificación por su manejo | Clasificación por su gestión |
|---|---|---|---|---|---|---|
| 1 | Etapa de operación y mantenimiento | Preparación y Teñido | Envases contaminados con colorantes y auxiliares | Tóxico / Inflamable | Peligroso | No municipal |
| 2 | Etapa de operación y mantenimiento | Mantenimiento mecánico | Aceite lubricante usado | Tóxico / Inflamable | Peligroso | No municipal |
| 3 | Etapa de operación y mantenimiento | Acabado de tejidos | Retazos de tela limpios | No aplica | No peligroso | No municipal |
| 4 | Etapa de operación y mantenimiento | Almacenes y Oficinas | Cajas de cartón y papel de embalaje | No aplica | No peligroso | Similar al municipal |

4.3 Estimación de la masa, volumen o unidades

### Cuadro 2 - Estimado del volumen y cantidad de residuos sólidos a generarse resumido por etapas

| N° | Etapas del proyecto | Características del RRSS | Por su Gestión | Volumen (m³, l), unidad o masa (kg, t) / mes |
|---|---|---|---|---|
| 1 | Operación y Mantenimiento | No peligrosos | Similar al Municipal | 2,750 kg/mes |
| 2 | Operación y Mantenimiento | No peligrosos | No municipal | 1,680 kg/mes |
| 3 | Operación y Mantenimiento | Peligrosos | No municipal | 475 kg/mes y 160 l/mes |

### Cuadro 3 - Estimado del volumen y cantidad de residuos sólidos a generarse por actividad generadora

| N° | Clasificación de residuos sólidos | Residuos sólidos | Código del residuo sólido | Proceso / Actividad generadora | Volumen (m³, l), unidad o masa (kg, t) / mes |
|---|---|---|---|---|---|
| 1 | No peligroso / Similar al municipal | Restos de comida | Código 20 03 01 | Comedor del personal | 1,100 kg/mes |
| 2 | No peligroso / No municipal | Retazos textiles y hilos | Código 04 02 09 | Línea de corte y acabado | 1,200 kg/mes |
| 3 | No peligroso / No municipal | Chatarra metálica limpia | Código 12 01 01 | Mantenimiento de telares | 300 kg/mes |
| 4 | Peligroso / No municipal | Aceite lubricante usado | Código 13 02 08 | Mantenimiento de maquinaria | 160 l/mes |
| 5 | Peligroso / No municipal | Trapos con hidrocarburos | Código 15 02 02 | Mantenimiento y mecánica | 90 kg/mes |`
    },
    {
      id: "cap-5",
      numero: 5,
      titulo: "5. Estrategias para la prevención y/o minimización",
      completado: true,
      contenido: `La estrategia prioriza evitar la generación, reducir cantidad/peligrosidad, aprovechar materiales y optimizar el uso de materias primas, insumos, agua y energía.

5.1 Prevenir y/o minimizar

### Cuadro 4 - Análisis de alternativas para uso de insumos o materias primas

| N° | Proceso / Actividad / Insumo analizado | Alternativa | Insumo o Materia Prima | Peligroso (SI/NO) | Peligrosidad | Disponible en el mercado local | Costos para el manejo del residuo | Uso especial | Alternativa seleccionada |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Acabado de tejidos | Alternativa 1 | Suavizante catiónico convencional en base a amonio cuaternario | SI | Tóxico para vida acuática | Sí | Medio | Suavizado permanente | No seleccionado por mayor carga contaminante |
| 2 | Acabado de tejidos | Alternativa 2 | Suavizante biodegradable de origen orgánico | NO | Inocuo | Sí | Bajos | Suavizado alta eficiencia | SI, seleccionada por menor costo y compatibilidad |
| 3 | Mantenimiento mecánico | Alternativa 1 | Desengrasante en base a solventes clorados | SI | Tóxico, inflamable | Sí | Altos | Limpieza profunda grasas | No seleccionado por alto costo de residuos peligrosos |
| 4 | Mantenimiento mecánico | Alternativa 2 | Desengrasante detergente de base acuosa y tensoactivos | NO | Inocuo | Sí | Bajos | Limpieza general | SI, seleccionada por reducir trapos impregnados |

5.2 Material de descarte
No se declara material de descarte por el solo hecho de que un material tenga valor económico. Se evaluó como material de descarte únicamente aquel que cumple las condiciones previstas por la normativa y que puede ser directamente aprovechable como insumo en la misma u otra actividad productiva, investigación o desarrollo de nuevas tecnologías/materiales.
- Retazos textiles limpios | Origen: Corte/acabado | Cantidad: 1 200 kg/mes | Temporalidad: Mensual | Alternativa: Recuperación de fibra / fabricación de paños, previa evaluación
- Conos de cartón limpios | Origen: Bobinado | Cantidad: 180 kg/mes | Temporalidad: Mensual | Alternativa: Reutilización interna o valorización

5.3 Régimen especial de gestión de residuos sólidos de bienes priorizados

### Cuadro 5 - Estimado de la cantidad de residuos sólidos de bienes priorizados

| N° | Residuos sólidos del bien priorizado | Régimen especial al que pertenece | Categoría | Unidades | Masa (kg) | Período |
|---|---|---|---|---|---|---|
| 1 | Computadoras de oficina en desuso | Régimen de RAEE | Categoría 3 | 4 unidades | 45.00 | Anual |
| 2 | Monitores y pantallas | Régimen de RAEE | Categoría 4 | 3 unidades | 30.00 | Anual |
| 3 | Luminarias LED / Tubos fluorescentes | Régimen de RAEE | Categoría 5 | 25 unidades | 45.00 | Anual |
| 4 | Neumáticos de montacargas | Régimen de NFU | Categoría B | 2 unidades | 120.00 | Anual |`
    },
    {
      id: "cap-6",
      numero: 6,
      titulo: "6. Gestión y manejo de residuos sólidos",
      completado: true,
      contenido: `Priorización en el manejo de residuos sólidos:
Prevenir y minimizar la generación -> Aprovechamiento y valorización de residuos sólidos -> Tratamiento -> Disposición final (Fuente: R.M. 089-2023-MINAM).

6.a Segregación
La segregación se realiza en la fuente y se mantienen diferenciados los residuos durante su manejo. Se emplean los colores y categorías aplicables de la NTP 900.058:2019, considerando los residuos efectivamente generados en cada zona.

### Cuadro 6 - Clasificación de los residuos sólidos por sus características para su almacenamiento

| N° | Tipo de Residuo | Ejemplos generados en planta | Ámbito de Gestión | Código de Color (NTP 900.058:2019) | Tipo de Contenedor |
|---|---|---|---|---|---|
| 1 | Papel y Cartón | Cajas de cartón de embalaje, conos de hilo | Similares a los municipales | Color Azul | Cilindros rotulados con bolsa interior |
| 2 | Plástico | Botellas, películas de film transparente | Similares a los municipales | Color Blanco | Cilindros rotulados con bolsa |
| 3 | Metales | Chatarra de acero, virutas metálicas | No municipal | Color Amarillo | Contenedores metálicos de alta resistencia |
| 4 | Orgánicos | Restos de alimentos del comedor | Similares a los municipales | Color Marrón | Contenedores herméticos con tapa a pedal |
| 5 | Vidrio | Envases de laboratorio y botellas | Similares a los municipales | Color Plomo | Contenedores con amortiguación interna |
| 6 | Peligrosos | Envases con químicos, trapos con hidrocarburos, aceites | No municipal | Color Rojo | Cilindros herméticos con dique de contención |
| 7 | No aprovechables | Papel higiénico, restos de barrido, EPPs sucios | Similares / No municipal | Color Negro | Cilindros con tapa vaivén |

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

Para garantizar el cumplimiento de los objetivos de control y minimización, la ejecución de estas medidas contempla un enfoque preventivo en las líneas de producción y mantenimiento, respaldado por una asignación presupuestal específica y responsables claramente definidos. Un resumen detallado de las medidas ambientales, los impactos asociados, los plazos de implementación, los indicadores de seguimiento y los costos requeridos para el desarrollo del plan se encuentra consolidado en el Cuadro 7 de este documento.

### Cuadro 7 - Resumen de medidas ambientales y presupuesto para la implementación del PMMRS

| N° | Etapa | Actividad | Impacto | Obligación / Compromiso ambiental | Presupuesto (S/) | Responsable | Plazo de implementación | Fecha o frecuencia | Indicador a ser monitoreado |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Operación y Mantenimiento | Segregación en fuente | Mezcla de residuos sólidos aprovechables con peligrosos | Mantener la segregación al 100% en todas las zonas operativas de la planta | 18,000.00 | Jefe de Gestión Ambiental | Enero - Diciembre 2027 | Mensual | % de puntos de segregación conformes |
| 2 | Operación y Mantenimiento | Almacenamiento de residuos peligrosos | Riesgo de derrames y contaminación de suelo o agua | Implementar y mantener contención secundaria y kit antiderrames | 25,000.00 | Jefe de Mantenimiento | 1er trimestre de 2027 | Trimestral | % de inspecciones de almacén conformes |
| 3 | Operación y Mantenimiento | Capacitación y sensibilización | Manejo inadecuado por desconocimiento del personal | Capacitar al 100% del personal operativo y administrativo en manejo de residuos | 12,000.00 | RR.HH. / Jefe Ambiental | Enero - Diciembre 2027 | Trimestral | % de personal capacitado respecto al total |
| 4 | Operación y Mantenimiento | Valorización de residuos | Incremento de volumen destinado a disposición final | Entregar los residuos aprovechables (cartón, plástico, metales, retazos) a valorizadores autorizados | 36,000.00 | Jefe de Gestión Ambiental | Enero - Diciembre 2027 | Mensual | % de residuos valorizados respecto al total generable |
| 5 | Operación y Mantenimiento | Gestión externa de peligrosos | Riesgo sanitario y pasivos ambientales | Asegurar la recolección, transporte y disposición por EO-RS autorizada con trazabilidad total | 48,000.00 | Jefe de Gestión Ambiental | Enero - Diciembre 2027 | Según generación / despacho | % de manifiestos y trazabilidad completa |`
    },
    {
      id: "cap-8",
      numero: 8,
      titulo: "8. Medidas de atención ante emergencias",
      completado: true,
      contenido: `En el desarrollo de las operaciones de la planta textil, la gestión de residuos sólidos —en particular la manipulación, almacenamiento temporal y traslado interno de residuos peligrosos como aceites usados, trapos con hidrocarburos y envases de productos químicos— conlleva riesgos inherentes que podrían desencadenar contingencias operativas o incidentes ambientales. Para mitigar estos escenarios, se han identificado las principales emergencias potenciales, tales como derrames de sustancias o residuos peligrosos, conatos de incendio en las áreas de almacenamiento central, ruptura de envases y incidentes durante el transporte interno.

Las medidas de respuesta correspondientes se estructuran bajo un enfoque secuencial de prevención y control (antes, durante y después del evento), articulándose de manera directa con el Plan de Contingencias del Instrumento de Gestión Ambiental (IGA) de la planta y cumpliendo con lo dispuesto en los artículos 50° y 60° del Reglamento de la Ley de Gestión Integral de Residuos Sólidos (LGIRS). Estas acciones contemplan la disponibilidad permanente de kits antiderrames, equipos de protección personal (EPP), sistemas contra incendios, la capacitación continua del personal brigadista y la correcta trazabilidad y disposición de los residuos generados tras la atención de cualquier eventualidad.

### Cuadro 8 - Medidas de atención ante emergencias

| N° | Tipo de Emergencia | Escenario Potencial | Medida Preventiva | Acción Inmediata de Respuesta | Responsable |
|---|---|---|---|---|---|
| 1 | Derrame de aceite/químico | Fuga en almacenamiento de RESPEL o manipulación | Kit antiderrames, inspección periódica, SDS disponibles | Aislar área, detener fuente, contener con absorbente, recoger material contaminado con EPP | Brigada de Emergencias Ambientales |
| 2 | Incendio en almacenamiento | Reacción o fuente de ignición en almacén | Extintores vigentes, orden, separación de incompatibles | Activar alarma, evacuar, cortar energía, combatir con extintor adecuado | Brigada Contra Incendios |
| 3 | Ruptura de envase de químico | Caída o golpe durante traslado | Almacenamiento con contención y compatibilidad | Aislar, consultar SDS, neutralizar, contener y recoger en contenedor hermético | Supervisor HSEQ y Operador |
| 4 | Derrame durante transporte interno | Volcadura de carro en ruta interna | Rutas definidas, velocidad controlada y carros adecuados | Aislar área de tránsito, contener con kit móvil y recoger | Operador y Jefe de Mantenimiento |

Estas medidas se articulan con el Plan de Contingencias del IGA. El PMMRS no sustituye dicho instrumento.`
    },
    {
      id: "cap-9",
      numero: 9,
      titulo: "9. Indicadores de seguimiento y control",
      completado: true,
      contenido: `Para verificar el cumplimiento estricto de las obligaciones y compromisos ambientales asumidos en el Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS), la planta textil implementa un sistema continuo de seguimiento operativo y administrativo orientado a evaluar la eficacia de las medidas adoptadas. Este control sistematiza las actividades de supervisión en las diferentes etapas del proceso productivo, permitiendo medir de forma cuantitativa y cualitativa el desempeño ambiental de la gestión de residuos mediante indicadores clave de rendimiento (KPIs).

Estos indicadores evalúan aspectos críticos como el porcentaje de puntos de segregación conformes, la eficiencia en la valorización de residuos aprovechables, la cobertura de capacitación del personal y el cumplimiento de la trazabilidad en la entrega de residuos peligrosos a operadores autorizados (EO-RS). El detalle de las actividades sujetas a control, sus respectivas frecuencias, responsables e indicadores de desempeño se encuentra integrado de manera referencial en el Cuadro 7.

Ver Cuadro 7 (Sección 7 del presente Plan).`
    },
    {
      id: "cap-10",
      numero: 10,
      titulo: "10. Cronograma de implementación",
      completado: true,
      contenido: `La ejecución de las medidas ambientales, compromisos operativos y actividades de control del Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS) se encuentra programada de manera continua y estructurada a lo largo del periodo de referencia anual de la planta textil. Esta programación establece los plazos específicos de implementación —con frecuencias mensuales, trimestrales y anuales— para garantizar que cada actividad preventiva, de segregación, valorización y supervisión se ejecute de manera oportuna.

El despliegue temporal de estas acciones, junto con sus respectivos responsables, indicadores de control y asignación presupuestal, se encuentra consolidado y articulado de forma integral en el cuadro resumen del Cuadro 7 de este documento.

Ver Cuadro 7 (Sección 7 del presente Plan).`
    },
    {
      id: "cap-11",
      numero: 11,
      titulo: "11. Presupuesto y recursos necesarios",
      completado: true,
      contenido: `Para garantizar la correcta ejecución de las estrategias, medidas y actividades contempladas en la gestión y manejo integral de los residuos sólidos, la planta textil ha realizado una estimación rigurosa de los recursos económicos, logísticos y humanos necesarios a lo largo del periodo operativo. Esta planificación financiera asegura la disponibilidad de insumos, equipos de contención, programas de capacitación, servicios de recolección externa y labores de supervisión continua.

El desglose de la inversión requerida para cada compromiso ambiental, vinculado directamente a sus respectivos responsables, plazos e indicadores de control, se encuentra consolidado y estructurado en el cuadro resumen del Cuadro 7 de este documento.

Presupuesto Total Anual Consolidado: S/ 139,000.00
- Segregación en fuente: S/ 18,000.00 (Mensual)
- Almacenamiento de residuos peligrosos (ATRP / Contención): S/ 25,000.00 (Trimestral)
- Capacitación y sensibilización: S/ 12,000.00 (Trimestral)
- Valorización de residuos no peligrosos: S/ 36,000.00 (Mensual)
- Gestión externa de residuos peligrosos con EO-RS: S/ 48,000.00 (Por despacho)

Ver Cuadro 7 (Sección 7 del presente Plan).`
    },
    {
      id: "cap-12",
      numero: 12,
      titulo: "12. Funciones del responsable de la gestión y manejo de residuos sólidos",
      completado: true,
      contenido: `Responsable: Jefe de Gestión Ambiental de la planta textil.

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
      contenido: `El presente Plan de Minimización y Manejo de Residuos Sólidos No Municipales incorpora de manera fiel e integral todos los anexos oficiales previstos en la Resolución Ministerial N.° 089-2023-MINAM:

• Anexo 1: Diagrama de flujo simplificado y fuentes de generación
• Anexo 2: Diagrama de flujo simplificado por etapas del proyecto (Construcción, Operación, Cierre)
• Anexo 3: Clasificación de los Residuos Sólidos por sus características y ámbito de gestión
• Anexo 4: Cuadro estimado de la cantidad de residuos sólidos de bienes priorizados (RAEE y NFU)
• Anexo 5: Clasificación de los residuos sólidos por sus características para su almacenamiento (NTP 900.058:2019)
• Anexo 6: Cuadro estimado del volumen y cantidad de residuos sólidos a generarse resumido por etapas
• Anexo 7: Cuadro estimado del volumen y cantidad de residuos sólidos a generarse por actividad generadora
• Anexo 8: Principios de la Jerarquía en la gestión de los residuos sólidos
• Anexo 9: Análisis de alternativas para uso de insumos o materias primas (Minimización en origen)
• Anexo 10: Cuadro de incompatibilidad química de los residuos sólidos
• Anexo 11: Cuadro resumen de medidas ambientales y presupuesto para la implementación del PMMRS
• Anexo 12: Operaciones de Manejo de Residuos Sólidos

Referencias normativas y documentales:
• Ministerio del Ambiente. Resolución Ministerial N.° 089-2023-MINAM, que aprueba el “Contenido Mínimo del Plan de Minimización y Manejo de Residuos Sólidos No Municipales”, 9 de marzo de 2023. Fuente oficial: https://www.gob.pe/institucion/minam/normas-legales/3980927-089-2023-minam
• Decreto Legislativo N.° 1278, Ley de Gestión Integral de Residuos Sólidos, y su Reglamento aprobado por D.S. N.° 014-2017-MINAM y modificatorias.
• NTP 900.058:2019, Gestión de residuos. Código de colores para el almacenamiento de residuos sólidos.`
    }
  ],
  // TODOS LOS ANEXOS INDICADOS EN LA RESOLUCIÓN MINISTERIAL N.° 089-2023-MINAM
  anexos: [
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
  ],
  presupuestoTotal: 139000
};

async function seed() {
  console.log("==================================================================");
  console.log("Iniciando guardado de colección 'modelo_plan' en Firebase Firestore...");
  console.log("==================================================================");

  // 1. Guardar documento principal 'pmmrs_textiles_andina_2027' en colección 'modelo_plan'
  const planDocRef = doc(db, "modelo_plan", "pmmrs_textiles_andina_2027");
  await setDoc(planDocRef, {
    ...MODELO_PLAN_COMPLETO,
    updatedAt: serverTimestamp()
  });
  console.log("✓ Documento principal guardado con éxito: modelo_plan/pmmrs_textiles_andina_2027");

  // 1.b Guardar también alias 'demo_plan_actual' en colección 'modelo_plan' para acceso universal
  const aliasDocRef = doc(db, "modelo_plan", "demo_plan_actual");
  await setDoc(aliasDocRef, {
    ...MODELO_PLAN_COMPLETO,
    id: "demo_plan_actual",
    updatedAt: serverTimestamp()
  });
  console.log("✓ Documento alias guardado: modelo_plan/demo_plan_actual");

  // 1.c Guardar en colección 'plan_modelo' como respaldo exacto
  const planModeloRef = doc(db, "plan_modelo", "pmmrs_textiles_andina_2027");
  await setDoc(planModeloRef, {
    ...MODELO_PLAN_COMPLETO,
    updatedAt: serverTimestamp()
  });
  console.log("✓ Documento guardado en colección alternativa: plan_modelo/pmmrs_textiles_andina_2027");

  // 2. Guardar cada uno de los 13 capítulos como documento individual en 'modelo_plan'
  for (const cap of MODELO_PLAN_COMPLETO.capitulos) {
    const capDocRef = doc(db, "modelo_plan", `capitulo_${cap.numero}`);
    await setDoc(capDocRef, {
      ...cap,
      planId: "pmmrs_textiles_andina_2027",
      updatedAt: serverTimestamp()
    });
  }
  console.log(`✓ 13 Capítulos guardados individualmente en modelo_plan/capitulo_1 a capitulo_13`);

  // 3. Guardar cada uno de los 12 anexos como documento individual en 'modelo_plan'
  for (const anexo of MODELO_PLAN_COMPLETO.anexos) {
    const anexoDocRef = doc(db, "modelo_plan", `anexo_${anexo.numero}`);
    await setDoc(anexoDocRef, {
      ...anexo,
      planId: "pmmrs_textiles_andina_2027",
      updatedAt: serverTimestamp()
    });
  }
  console.log(`✓ 12 Anexos oficiales guardados individualmente en modelo_plan/anexo_1 a anexo_12`);

  // 4. Guardar documento 'info' con metadatos del modelo
  const infoRef = doc(db, "modelo_plan", "info");
  await setDoc(infoRef, {
    id: "info",
    nombre: "Plan Modelo Oficial R.M. 089-2023-MINAM & D.L. 1278",
    resolucionMinisterial: "Resolución Ministerial N.° 089-2023-MINAM",
    leyBase: "Decreto Legislativo N.° 1278",
    empresa: MODELO_PLAN_COMPLETO.company.razonSocial,
    ruc: MODELO_PLAN_COMPLETO.company.ruc,
    periodo: "enero–diciembre 2027",
    totalCapitulos: MODELO_PLAN_COMPLETO.capitulos.length,
    totalAnexos: MODELO_PLAN_COMPLETO.anexos.length,
    totalResiduos: MODELO_PLAN_COMPLETO.residuos.length,
    presupuestoTotal: MODELO_PLAN_COMPLETO.presupuestoTotal,
    updatedAt: serverTimestamp()
  });
  console.log("✓ Documento info de metadatos guardado: modelo_plan/info");

  console.log("==================================================================");
  console.log("¡Colección 'modelo_plan' y 'plan_modelo' creadas fielmente en Firebase con todos los 12 anexos!");
  console.log("==================================================================");
  process.exit(0);
}

seed().catch(err => {
  console.error("Error al poblar Firebase Firestore:", err);
  process.exit(1);
});
