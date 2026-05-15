import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const C = {
  bg:"#f0f4f8", surface:"#ffffff", card:"#ffffff",
  border:"#dde3ed", borderHi:"#c2cfe0",
  gold:"#b45309", goldDim:"#92400e", goldGlow:"#b4530922",
  teal:"#0d9488", red:"#dc2626", amber:"#d97706",
  green:"#059669", blue:"#2563eb", purple:"#7c3aed",
  t1:"#0f172a", t2:"#1e3a5f", t3:"#475569", t4:"#94a3b8",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es: {
    appSubtitle: "MONITOR ANTIMONOPOLIO",
    live: "EN VIVO",
    alerts: "ALERTA",
    alertsPlural: "ALERTAS",
    tabs: ["📊 Dashboard","📉 Comparativa","🔔 Alertas","⚖️ Dictamen IA"],
    filterTitle: "Filtros de Consulta",
    worldRegion: "Región del mundo",
    country: "País",
    territory: "Territorio / Ciudad",
    market: "Mercado",
    product: "Producto / Servicio",
    company: "Empresa",
    dateFrom: "Fecha desde",
    dateTo: "Fecha hasta",
    hourFrom: "Hora desde",
    hourTo: "Hora hasta",
    authority: "AUTORIDAD COMPETENTE",
    legalFrame: "MARCO LEGAL",
    allCompanies: "Todas",
    riskLevel: "Nivel de riesgo",
    marketDispersion: "Dispersión mercado",
    avgVariation: "Variación media",
    maxPrice: "Precio máximo",
    minPrice: "Precio mínimo",
    avgPrice: "Precio promedio",
    betweenCompetitors: "entre competidores",
    vsPrevPeriod: "vs período anterior",
    mostExpensive: "más caro del mercado",
    cheapest: "más barato del mercado",
    marketAvg: "media del mercado",
    score: "Score",
    activeAlerts: "Alertas Activas",
    detection: "detección",
    detections: "detecciones",
    critical: "CRÍTICAS",
    high: "ALTAS",
    medium: "MEDIAS",
    jurisdiction: "JURISDICCIÓN",
    noAlerts: "No se detectaron prácticas restrictivas en el mercado seleccionado. El comportamiento de precios es consistente con competencia normal.",
    notifChannels: "Canales de Notificación",
    emailAlerts: "Correo electrónico",
    active: "Activo",
    alwaysActive: "Siempre activo",
    inAppNotif: "Notificación en app",
    inAppDesc: "Las alertas se actualizan automáticamente al cambiar los filtros.",
    noConfigRequired: "Sin configuración requerida",
    comingSoon: "Próximamente",
    inDevelopment: "En desarrollo",
    detectionThresholds: "Umbrales de Detección",
    activateEmail: "Activar alertas por email",
    configured: "✓ Configurado",
    comparison: "Comparativa entre Competidores",
    rankingTitle: "RANKING DE PRECIOS — menor a mayor",
    average: "Promedio",
    currentVsPrev: "PRECIO ACTUAL vs ANTERIOR",
    deviationVsAvg: "DESVIACIÓN VS PROMEDIO DE MERCADO",
    historicalEvolution: "EVOLUCIÓN HISTÓRICA COMPARADA (7 MESES)",
    riskStats: "Estadísticas de Riesgo Anticompetitivo",
    seeDetail: "Ver detalle →",
    aiAnalysis: "Dictamen Jurídico con IA",
    aiDesc: "La IA genera un dictamen técnico-jurídico basado en los datos del mercado seleccionado, aplicando el marco legal de cada jurisdicción.",
    generateDictum: "⚖️ Generar Dictamen Legal",
    analyzing: "Analizando",
    dictum: "DICTAMEN",
    legalBase: "BASE LEGAL",
    recommendedAction: "ACCIÓN RECOMENDADA",
    applicableSanctions: "SANCIONES APLICABLES",
    severity: "SEVERIDAD",
    probability: "PROBABILIDAD",
    period: "Período",
    schedule: "Horario",
    currentPrice: "Precio actual",
    prevPrice: "Precio anterior",
    variation: "Variación",
    vsAverage: "vs Promedio",
    marketShare: "Cuota mercado",
    changes30: "Cambios 30 días",
    priceAdjustments: "ajustes de precio",
    individualProfile: "Perfil Individual",
    historicalPrice: "EVOLUCIÓN HISTÓRICA DE PRECIO",
    competitiveScore: "SCORECARD COMPETITIVO",
    higherBetter: "Mayor valor = mejor desempeño relativo",
    per: "por",
    prevPeriod: "período anterior",
    marketDeviation: "desviación del mercado",
    estimated: "estimado",
    regions: {
      "América Latina": "América Latina",
      "Europa": "Europa",
      "América del Norte": "América del Norte",
      "Asia": "Asia",
    },
    patternTypes: {
      "FIJACIÓN DE PRECIOS": "FIJACIÓN DE PRECIOS",
      "ALZA SIMULTÁNEA": "ALZA SIMULTÁNEA",
      "PARALELISMO DE PRECIOS": "PARALELISMO DE PRECIOS",
      "POSICIÓN DOMINANTE": "POSICIÓN DOMINANTE",
      "PRECIOS PREDATORIOS": "PRECIOS PREDATORIOS",
      "CONCENTRACIÓN": "CONCENTRACIÓN",
    },
    patternDescs: {
      "FIJACIÓN DE PRECIOS": (v,n) => `Dispersión de solo ${v}% entre ${n} competidores. Coordinación horizontal altamente probable.`,
      "ALZA SIMULTÁNEA": (v) => `Todos los actores incrementaron precios ${v}% simultáneamente. Posible señalización o acuerdo tácito.`,
      "PARALELISMO DE PRECIOS": (v) => `Diferencia máxima entre actores: ${v}%. Comportamiento paralelo sin justificación estructural evidente.`,
      "POSICIÓN DOMINANTE": (c,v) => `${c} concentra el ${v}% del mercado. Posible abuso si impone condiciones desventajosas.`,
      "PRECIOS PREDATORIOS": (c,v) => `${c} vende ${v}% por debajo del promedio. Posible estrategia para excluir rivales.`,
      "CONCENTRACIÓN": (v) => `Las 2 empresas más grandes concentran el ${v}% del mercado. Estructura oligopólica con alto riesgo de coordinación.`,
    },
    patternActions: {
      "FIJACIÓN DE PRECIOS": "Iniciar investigación formal. Solicitar información sobre comunicaciones entre empresas. Revisar actas de gremios.",
      "ALZA SIMULTÁNEA": "Verificar si existieron comunicados de prensa, reuniones gremiales o declaraciones públicas previas al alza.",
      "PARALELISMO DE PRECIOS": "Analizar si la uniformidad obedece a costos homogéneos, regulación tarifaria o factores de mercado legítimos.",
      "POSICIÓN DOMINANTE": "Investigar si impone precios excesivos, condiciona ventas o discrimina clientes sin justificación objetiva.",
      "PRECIOS PREDATORIOS": "Solicitar estructura de costos. Verificar si el precio cubre al menos el costo variable medio.",
      "CONCENTRACIÓN": "Revisar historia de adquisiciones. Evaluar barreras de entrada. Monitorear operaciones de integración futuras.",
    },
    sevLabels: { "CRÍTICA":"CRÍTICA", "ALTA":"ALTA", "MEDIA":"MEDIA" },
    probLabels: {
      high80: "Muy Alta (>80%)",
      high60: "Alta (60-80%)",
      med40: "Media (40-60%)",
      med30: "Media-Alta (50-70%)",
      med35: "Media (35-55%)",
      med30b: "Media (30-50%)",
      med30c: "Media (30-45%)",
    },
    thresholds: [
      "🔴 Fijación de precios — dispersión menor al 0.5%",
      "🟠 Alza simultánea — todos los actores suben más del 10%",
      "🟡 Paralelismo de precios — dispersión entre 0.5% y 2%",
      "🔵 Posición dominante — cuota de mercado superior al 60%",
      "⚡ Precios predatorios — precio menor al 75% del promedio",
      "🔶 Alta concentración — top 2 empresas superan el 80%",
    ],
    aiPrompt: (product, region, country, unit, data, analysis, lf) =>
      `Eres un experto en derecho de la competencia. Analiza los siguientes datos bajo el marco legal de ${country}:\n\nJURISDICCIÓN: ${country}\nAUTORIDAD: ${lf.authority}\nMARCO LEGAL: ${lf.law}\nPRODUCTO: ${product} | TERRITORIO: ${region} | UNIDAD: ${unit}\n\nDATOS:\n${data.map(d=>`- ${d.company}: ${d.price.toLocaleString()} (ant: ${d.prevPrice.toLocaleString()}, var: ${(((d.price-d.prevPrice)/d.prevPrice)*100).toFixed(1)}%, cuota: ${d.marketShare}%)`).join("\n")}\n\nESTADÍSTICAS:\n- Dispersión: ${analysis.variancePct?.toFixed(2)}%\n- Variación: ${analysis.changePct?.toFixed(1)}%\n- Riesgo: ${analysis.risk?.level} (${analysis.risk?.score}/100)\n- Alertas: ${analysis.alerts?.map(a=>a.type).join(", ")||"Ninguna"}\n\nGenera un dictamen técnico-jurídico con: 1) Diagnóstico económico, 2) Prácticas identificadas con artículos exactos, 3) Probabilidad de infracción, 4) Recomendaciones, 5) Sanciones aplicables.`,
    tableHeaders: ["#","EMPRESA","PRECIO","ANTERIOR","VARIACIÓN","vs PROMEDIO","CUOTA","QUEJAS"],
    prev: "Anterior",
    current: "Actual",
    devFromAvg: "Desv. del promedio",
    complaints: "Quejas",
    selected: "seleccionada",
  },
  en: {
    appSubtitle: "ANTITRUST MONITOR",
    live: "LIVE",
    alerts: "ALERT",
    alertsPlural: "ALERTS",
    tabs: ["📊 Dashboard","📉 Comparison","🔔 Alerts","⚖️ AI Legal Opinion"],
    filterTitle: "Query Filters",
    worldRegion: "World Region",
    country: "Country",
    territory: "Territory / City",
    market: "Market",
    product: "Product / Service",
    company: "Company",
    dateFrom: "Date from",
    dateTo: "Date to",
    hourFrom: "Hour from",
    hourTo: "Hour to",
    authority: "COMPETENT AUTHORITY",
    legalFrame: "LEGAL FRAMEWORK",
    allCompanies: "All",
    riskLevel: "Risk level",
    marketDispersion: "Market dispersion",
    avgVariation: "Average variation",
    maxPrice: "Maximum price",
    minPrice: "Minimum price",
    avgPrice: "Average price",
    betweenCompetitors: "between competitors",
    vsPrevPeriod: "vs previous period",
    mostExpensive: "most expensive in market",
    cheapest: "cheapest in market",
    marketAvg: "market average",
    score: "Score",
    activeAlerts: "Active Alerts",
    detection: "detection",
    detections: "detections",
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    jurisdiction: "JURISDICTION",
    noAlerts: "No restrictive practices detected in the selected market. Price behavior is consistent with normal competition.",
    notifChannels: "Notification Channels",
    emailAlerts: "Email",
    active: "Active",
    alwaysActive: "Always active",
    inAppNotif: "In-app notification",
    inAppDesc: "Alerts update automatically when filters change.",
    noConfigRequired: "No configuration required",
    comingSoon: "Coming soon",
    inDevelopment: "In development",
    detectionThresholds: "Detection Thresholds",
    activateEmail: "Activate email alerts",
    configured: "✓ Configured",
    comparison: "Competitor Comparison",
    rankingTitle: "PRICE RANKING — lowest to highest",
    average: "Average",
    currentVsPrev: "CURRENT vs PREVIOUS PRICE",
    deviationVsAvg: "DEVIATION VS MARKET AVERAGE",
    historicalEvolution: "HISTORICAL COMPARISON (7 MONTHS)",
    riskStats: "Antitrust Risk Statistics",
    seeDetail: "See detail →",
    aiAnalysis: "AI Legal Opinion",
    aiDesc: "The AI generates a technical-legal opinion based on selected market data, applying the legal framework of each jurisdiction.",
    generateDictum: "⚖️ Generate Legal Opinion",
    analyzing: "Analyzing",
    dictum: "LEGAL OPINION",
    legalBase: "LEGAL BASIS",
    recommendedAction: "RECOMMENDED ACTION",
    applicableSanctions: "APPLICABLE SANCTIONS",
    severity: "SEVERITY",
    probability: "PROBABILITY",
    period: "Period",
    schedule: "Schedule",
    currentPrice: "Current price",
    prevPrice: "Previous price",
    variation: "Variation",
    vsAverage: "vs Average",
    marketShare: "Market share",
    changes30: "Changes 30 days",
    priceAdjustments: "price adjustments",
    individualProfile: "Individual Profile",
    historicalPrice: "HISTORICAL PRICE EVOLUTION",
    competitiveScore: "COMPETITIVE SCORECARD",
    higherBetter: "Higher value = better relative performance",
    per: "per",
    prevPeriod: "previous period",
    marketDeviation: "market deviation",
    estimated: "estimated",
    regions: {
      "América Latina": "Latin America",
      "Europa": "Europe",
      "América del Norte": "North America",
      "Asia": "Asia",
    },
    patternTypes: {
      "FIJACIÓN DE PRECIOS": "PRICE FIXING",
      "ALZA SIMULTÁNEA": "SIMULTANEOUS PRICE HIKE",
      "PARALELISMO DE PRECIOS": "PRICE PARALLELISM",
      "POSICIÓN DOMINANTE": "DOMINANT POSITION",
      "PRECIOS PREDATORIOS": "PREDATORY PRICING",
      "CONCENTRACIÓN": "MARKET CONCENTRATION",
    },
    patternDescs: {
      "FIJACIÓN DE PRECIOS": (v,n) => `Dispersion of only ${v}% among ${n} competitors. Horizontal coordination highly probable.`,
      "ALZA SIMULTÁNEA": (v) => `All actors increased prices ${v}% simultaneously. Possible signaling or tacit agreement.`,
      "PARALELISMO DE PRECIOS": (v) => `Maximum difference between actors: ${v}%. Parallel behavior without apparent structural justification.`,
      "POSICIÓN DOMINANTE": (c,v) => `${c} holds ${v}% of the market. Possible abuse if imposing disadvantageous conditions.`,
      "PRECIOS PREDATORIOS": (c,v) => `${c} sells ${v}% below average. Possible strategy to exclude rivals.`,
      "CONCENTRACIÓN": (v) => `Top 2 companies hold ${v}% of the market. Oligopolistic structure with high coordination risk.`,
    },
    patternActions: {
      "FIJACIÓN DE PRECIOS": "Initiate formal investigation. Request information on communications between companies. Review industry association minutes.",
      "ALZA SIMULTÁNEA": "Check if there were press releases, industry meetings or public statements prior to the price increase.",
      "PARALELISMO DE PRECIOS": "Analyze whether uniformity stems from homogeneous costs, tariff regulation or legitimate market factors.",
      "POSICIÓN DOMINANTE": "Investigate whether the company imposes excessive prices, conditions sales or discriminates without objective justification.",
      "PRECIOS PREDATORIOS": "Request cost structure. Verify whether price at least covers average variable cost.",
      "CONCENTRACIÓN": "Review acquisition history. Assess entry barriers. Monitor future integration operations.",
    },
    sevLabels: { "CRÍTICA":"CRITICAL", "ALTA":"HIGH", "MEDIA":"MEDIUM" },
    probLabels: {
      high80: "Very High (>80%)",
      high60: "High (60-80%)",
      med40: "Medium (40-60%)",
      med30: "Medium-High (50-70%)",
      med35: "Medium (35-55%)",
      med30b: "Medium (30-50%)",
      med30c: "Medium (30-45%)",
    },
    thresholds: [
      "🔴 Price fixing — dispersion below 0.5%",
      "🟠 Simultaneous hike — all actors raise prices over 10%",
      "🟡 Price parallelism — dispersion between 0.5% and 2%",
      "🔵 Dominant position — market share above 60%",
      "⚡ Predatory pricing — price below 75% of average",
      "🔶 High concentration — top 2 companies exceed 80%",
    ],
    aiPrompt: (product, region, country, unit, data, analysis, lf) =>
      `You are an expert in competition law. Analyze the following market data under the legal framework of ${country}:\n\nJURISDICTION: ${country}\nAUTHORITY: ${lf.authority}\nLEGAL FRAMEWORK: ${lf.law}\nPRODUCT: ${product} | TERRITORY: ${region} | UNIT: ${unit}\n\nDATA:\n${data.map(d=>`- ${d.company}: ${d.price.toLocaleString()} (prev: ${d.prevPrice.toLocaleString()}, var: ${(((d.price-d.prevPrice)/d.prevPrice)*100).toFixed(1)}%, share: ${d.marketShare}%)`).join("\n")}\n\nSTATISTICS:\n- Dispersion: ${analysis.variancePct?.toFixed(2)}%\n- Variation: ${analysis.changePct?.toFixed(1)}%\n- Risk: ${analysis.risk?.level} (${analysis.risk?.score}/100)\n- Alerts: ${analysis.alerts?.map(a=>a.type).join(", ")||"None"}\n\nGenerate a technical-legal opinion with: 1) Economic diagnosis, 2) Identified practices with exact legal articles, 3) Probability of infringement, 4) Recommendations for ${lf.authority}, 5) Applicable sanctions under ${lf.law}.`,
    tableHeaders: ["#","COMPANY","PRICE","PREVIOUS","VARIATION","vs AVERAGE","SHARE","COMPLAINTS"],
    prev: "Previous",
    current: "Current",
    devFromAvg: "Dev. from avg",
    complaints: "Complaints",
    selected: "selected",
  },
};

// ─── GEO STRUCTURE ────────────────────────────────────────────────────────────
const GEO = {
  "América Latina":{ flag:"🌎", countries:{
    "Colombia":{ flag:"🇨🇴", currency:"COP", symbol:"$", regions:["Nacional","Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Cartagena","Pereira"] },
    "México":{ flag:"🇲🇽", currency:"MXN", symbol:"$", regions:["Nacional","Ciudad de México","Guadalajara","Monterrey","Puebla","Tijuana","Mérida"] },
    "Brasil":{ flag:"🇧🇷", currency:"BRL", symbol:"R$", regions:["Nacional","São Paulo","Rio de Janeiro","Brasília","Salvador","Fortaleza","Manaus"] },
    "Argentina":{ flag:"🇦🇷", currency:"ARS", symbol:"$", regions:["Nacional","Buenos Aires","Córdoba","Rosario","Mendoza","Tucumán","La Plata"] },
    "Chile":{ flag:"🇨🇱", currency:"CLP", symbol:"$", regions:["Nacional","Santiago","Valparaíso","Concepción","Antofagasta","La Serena"] },
    "Perú":{ flag:"🇵🇪", currency:"PEN", symbol:"S/", regions:["Nacional","Lima","Arequipa","Trujillo","Chiclayo","Piura"] },
  }},
  "Europa":{ flag:"🌍", countries:{
    "España":{ flag:"🇪🇸", currency:"EUR", symbol:"€", regions:["Nacional","Madrid","Barcelona","Valencia","Sevilla","Bilbao","Zaragoza"] },
    "Francia":{ flag:"🇫🇷", currency:"EUR", symbol:"€", regions:["Nacional","París","Lyon","Marsella","Toulouse","Burdeos","Niza"] },
    "Alemania":{ flag:"🇩🇪", currency:"EUR", symbol:"€", regions:["Nacional","Berlín","Múnich","Hamburgo","Fráncfort","Colonia","Stuttgart"] },
    "Italia":{ flag:"🇮🇹", currency:"EUR", symbol:"€", regions:["Nacional","Roma","Milán","Nápoles","Turín","Palermo","Génova"] },
    "Reino Unido":{ flag:"🇬🇧", currency:"GBP", symbol:"£", regions:["Nacional","Londres","Manchester","Birmingham","Glasgow","Liverpool"] },
  }},
  "América del Norte":{ flag:"🌎", countries:{
    "Estados Unidos":{ flag:"🇺🇸", currency:"USD", symbol:"$", regions:["Nacional","Nueva York","Los Ángeles","Chicago","Houston","Miami","Dallas"] },
    "Canadá":{ flag:"🇨🇦", currency:"CAD", symbol:"$", regions:["Nacional","Toronto","Montreal","Vancouver","Calgary","Ottawa","Edmonton"] },
  }},
  "Asia":{ flag:"🌏", countries:{
    "Japón":{ flag:"🇯🇵", currency:"JPY", symbol:"¥", regions:["Nacional","Tokio","Osaka","Kioto","Yokohama","Nagoya","Sapporo"] },
    "Corea del Sur":{ flag:"🇰🇷", currency:"KRW", symbol:"₩", regions:["Nacional","Seúl","Busan","Incheon","Daegu","Daejeon"] },
    "India":{ flag:"🇮🇳", currency:"INR", symbol:"₹", regions:["Nacional","Bombay","Delhi","Bangalore","Chennai","Hyderabad","Calcuta"] },
  }},
};

const LEGAL_FRAMEWORKS = {
  "Colombia":{ authority:"Superintendencia de Industria y Comercio (SIC)", law:"Decreto 2153/1992 y Ley 1340/2009", rules:{ "FIJACIÓN DE PRECIOS":"Art. 47 núm. 1, Decreto 2153/1992","ALZA SIMULTÁNEA":"Art. 47 núm. 1-2, Decreto 2153/1992","PARALELISMO DE PRECIOS":"Art. 47 núm. 2, Decreto 2153/1992","POSICIÓN DOMINANTE":"Art. 50, Decreto 2153/1992","PRECIOS PREDATORIOS":"Art. 50 núm. 3, Decreto 2153/1992","CONCENTRACIÓN":"Ley 1340/2009 Art. 9" }, sanction:"Multas hasta 100.000 SMMLV o el 150% de la utilidad derivada." },
  "México":{ authority:"Comisión Federal de Competencia Económica (COFECE)", law:"Ley Federal de Competencia Económica (LFCE) 2014", rules:{ "FIJACIÓN DE PRECIOS":"Art. 53 LFCE","ALZA SIMULTÁNEA":"Art. 53 LFCE","PARALELISMO DE PRECIOS":"Art. 56 LFCE","POSICIÓN DOMINANTE":"Art. 56 LFCE","PRECIOS PREDATORIOS":"Art. 56 fracc. VII LFCE","CONCENTRACIÓN":"Art. 61 LFCE" }, sanction:"Multas hasta el 10% de los ingresos anuales." },
  "Brasil":{ authority:"Conselho Administrativo de Defesa Econômica (CADE)", law:"Lei 12.529/2011", rules:{ "FIJACIÓN DE PRECIOS":"Art. 36 §3º I","ALZA SIMULTÁNEA":"Art. 36 §3º","PARALELISMO DE PRECIOS":"Art. 36 II","POSICIÓN DOMINANTE":"Art. 36 §2º","PRECIOS PREDATORIOS":"Art. 36 §3º XV","CONCENTRACIÓN":"Art. 88" }, sanction:"Multa de 0,1% a 20% do faturamento bruto." },
  "Argentina":{ authority:"Comisión Nacional de Defensa de la Competencia (CNDC)", law:"Ley 27.442/2018", rules:{ "FIJACIÓN DE PRECIOS":"Art. 2º a) Ley 27.442","ALZA SIMULTÁNEA":"Art. 2º a) Ley 27.442","PARALELISMO DE PRECIOS":"Art. 3º Ley 27.442","POSICIÓN DOMINANTE":"Art. 3º Ley 27.442","PRECIOS PREDATORIOS":"Art. 3º i) Ley 27.442","CONCENTRACIÓN":"Art. 8º Ley 27.442" }, sanction:"Multas de hasta el 30% de la facturación." },
  "Chile":{ authority:"Fiscalía Nacional Económica (FNE) y TDLC", law:"Decreto Ley 211/1973", rules:{ "FIJACIÓN DE PRECIOS":"Art. 3º a) DL 211","ALZA SIMULTÁNEA":"Art. 3º a) DL 211","PARALELISMO DE PRECIOS":"Art. 3º DL 211","POSICIÓN DOMINANTE":"Art. 3º b) DL 211","PRECIOS PREDATORIOS":"Art. 3º b) DL 211","CONCENTRACIÓN":"Art. 48 DL 211" }, sanction:"Multas hasta 30.000 UTA (~USD 20M)." },
  "Perú":{ authority:"Instituto Nacional de Defensa de la Competencia (INDECOPI)", law:"Decreto Legislativo 1034/2008", rules:{ "FIJACIÓN DE PRECIOS":"Art. 11.1 DL 1034","ALZA SIMULTÁNEA":"Art. 11.1 DL 1034","PARALELISMO DE PRECIOS":"Art. 11 DL 1034","POSICIÓN DOMINANTE":"Art. 10 DL 1034","PRECIOS PREDATORIOS":"Art. 10.2 e) DL 1034","CONCENTRACIÓN":"Ley 31112/2021" }, sanction:"Multas hasta 1.000 UIT o el 12% de ventas anuales." },
  "España":{ authority:"Comisión Nacional de Mercados y la Competencia (CNMC)", law:"Ley 15/2007 + Art. 101-102 TFUE", rules:{ "FIJACIÓN DE PRECIOS":"Art. 1 LDC / Art. 101 TFUE","ALZA SIMULTÁNEA":"Art. 1 LDC","PARALELISMO DE PRECIOS":"Art. 1 LDC","POSICIÓN DOMINANTE":"Art. 2 LDC / Art. 102 TFUE","PRECIOS PREDATORIOS":"Art. 2.2 b) LDC","CONCENTRACIÓN":"Art. 7 LDC" }, sanction:"Multas hasta el 10% del volumen de negocios mundial." },
  "Francia":{ authority:"Autorité de la Concurrence", law:"Code de commerce Art. L420-1 + Art. 101-102 TFUE", rules:{ "FIJACIÓN DE PRECIOS":"Art. L420-1","ALZA SIMULTÁNEA":"Art. L420-1","PARALELISMO DE PRECIOS":"Art. L420-1","POSICIÓN DOMINANTE":"Art. L420-2","PRECIOS PREDATORIOS":"Art. L420-5","CONCENTRACIÓN":"Art. L430-1" }, sanction:"Sanction jusqu'à 10% du chiffre d'affaires mondial." },
  "Alemania":{ authority:"Bundeskartellamt (BKartA)", law:"GWB + Art. 101-102 TFUE", rules:{ "FIJACIÓN DE PRECIOS":"§1 GWB / Art. 101 TFUE","ALZA SIMULTÁNEA":"§1 GWB","PARALELISMO DE PRECIOS":"§1 GWB","POSICIÓN DOMINANTE":"§18-19 GWB","PRECIOS PREDATORIOS":"§19 GWB","CONCENTRACIÓN":"§35 GWB" }, sanction:"Geldbußen bis zu 10% des weltweiten Jahresumsatzes." },
  "Italia":{ authority:"Autorità Garante della Concorrenza e del Mercato (AGCM)", law:"Legge 287/1990 + Art. 101-102 TFUE", rules:{ "FIJACIÓN DE PRECIOS":"Art. 2 L.287/1990","ALZA SIMULTÁNEA":"Art. 2 L.287/1990","PARALELISMO DE PRECIOS":"Art. 2 L.287/1990","POSICIÓN DOMINANTE":"Art. 3 L.287/1990","PRECIOS PREDATORIOS":"Art. 3 L.287/1990","CONCENTRACIÓN":"Art. 16 L.287/1990" }, sanction:"Sanzioni fino al 10% del fatturato." },
  "Reino Unido":{ authority:"Competition and Markets Authority (CMA)", law:"Competition Act 1998 + Enterprise Act 2002", rules:{ "FIJACIÓN DE PRECIOS":"Chapter I, CA 1998","ALZA SIMULTÁNEA":"Chapter I, CA 1998","PARALELISMO DE PRECIOS":"Chapter I, CA 1998","POSICIÓN DOMINANTE":"Chapter II, CA 1998","PRECIOS PREDATORIOS":"Chapter II, CA 1998","CONCENTRACIÓN":"Part 3, EA 2002" }, sanction:"Fines up to 10% of annual worldwide turnover." },
  "Estados Unidos":{ authority:"Federal Trade Commission (FTC) / DOJ", law:"Sherman Act (1890) + Clayton Act (1914)", rules:{ "FIJACIÓN DE PRECIOS":"§1 Sherman Act","ALZA SIMULTÁNEA":"§1 Sherman Act","PARALELISMO DE PRECIOS":"§1 Sherman Act","POSICIÓN DOMINANTE":"§2 Sherman Act","PRECIOS PREDATORIOS":"§2 Sherman Act","CONCENTRACIÓN":"§7 Clayton Act" }, sanction:"Criminal fines up to $100M. Up to 10 years imprisonment." },
  "Canadá":{ authority:"Competition Bureau Canada", law:"Competition Act (R.S.C. 1985)", rules:{ "FIJACIÓN DE PRECIOS":"§45 Competition Act","ALZA SIMULTÁNEA":"§45 Competition Act","PARALELISMO DE PRECIOS":"§90.1 Competition Act","POSICIÓN DOMINANTE":"§78-79 Competition Act","PRECIOS PREDATORIOS":"§78(1)(i) Competition Act","CONCENTRACIÓN":"§92 Competition Act" }, sanction:"Fines up to $25M. Up to 14 years imprisonment." },
  "Japón":{ authority:"Japan Fair Trade Commission (JFTC)", law:"Antimonopoly Act (1947)", rules:{ "FIJACIÓN DE PRECIOS":"Art. 3 AMA","ALZA SIMULTÁNEA":"Art. 3 AMA","PARALELISMO DE PRECIOS":"Art. 3 AMA","POSICIÓN DOMINANTE":"Art. 2(5) AMA","PRECIOS PREDATORIOS":"Art. 2(9) AMA","CONCENTRACIÓN":"Art. 10-16 AMA" }, sanction:"Surcharges up to 10% of sales." },
  "Corea del Sur":{ authority:"Korea Fair Trade Commission (KFTC)", law:"Monopoly Regulation and Fair Trade Act (MRFTA)", rules:{ "FIJACIÓN DE PRECIOS":"Art. 40 MRFTA","ALZA SIMULTÁNEA":"Art. 40 MRFTA","PARALELISMO DE PRECIOS":"Art. 40 MRFTA","POSICIÓN DOMINANTE":"Art. 5 MRFTA","PRECIOS PREDATORIOS":"Art. 5(1)(iii) MRFTA","CONCENTRACIÓN":"Art. 11 MRFTA" }, sanction:"Surcharges up to 20% of related sales." },
  "India":{ authority:"Competition Commission of India (CCI)", law:"Competition Act 2002 (amended 2023)", rules:{ "FIJACIÓN DE PRECIOS":"§3(3)(a)","ALZA SIMULTÁNEA":"§3(3)","PARALELISMO DE PRECIOS":"§3(3)","POSICIÓN DOMINANTE":"§4","PRECIOS PREDATORIOS":"§4(2)(a)(ii)","CONCENTRACIÓN":"§5-6" }, sanction:"Penalty up to 10% of average turnover for 3 years." },
};

const MARKETS = {
  "Energía":{ products:["Gasolina Regular","Gasolina Premium","ACPM / Diésel","Gas Natural"], companiesByCountry:{ "Colombia":{"Gasolina Regular":["Terpel","Biomax","Texaco","Primax","Zeuss"],"Gasolina Premium":["Terpel","Biomax","Texaco","Primax"],"ACPM / Diésel":["Terpel","Biomax","Texaco","EDS Uno"],"Gas Natural":["Gas Natural","Surtigas","Gases de Occidente"]}, "México":{"Gasolina Regular":["PEMEX","BP México","Shell México","Total México"],"Gasolina Premium":["PEMEX","BP México","Shell México"],"ACPM / Diésel":["PEMEX","BP México","Repsol México"],"Gas Natural":["Gas Natural Fenosa","Naturgy México","Sempra"]}, "Brasil":{"Gasolina Regular":["Petrobras","Shell Brasil","BP Castrol","Ipiranga"],"Gasolina Premium":["Petrobras","Shell Brasil","Ipiranga"],"ACPM / Diésel":["Petrobras","Shell Brasil","Raízen"],"Gas Natural":["Comgás","CEG","BR Distribuidora"]}, "España":{"Gasolina Regular":["Repsol","Cepsa","BP España","Galp"],"Gasolina Premium":["Repsol","Cepsa","BP España"],"ACPM / Diésel":["Repsol","Cepsa","Total España"],"Gas Natural":["Naturgy","Endesa Gas","Iberdrola Gas"]}, "Estados Unidos":{"Gasolina Regular":["ExxonMobil","Shell USA","Chevron","BP America"],"Gasolina Premium":["ExxonMobil","Shell USA","Chevron"],"ACPM / Diésel":["ExxonMobil","Shell USA","Valero"],"Gas Natural":["Dominion Energy","Con Edison","Sempra"]}, "default":{"Gasolina Regular":["Company A","Company B","Company C","Company D"],"Gasolina Premium":["Company A","Company B","Company C"],"ACPM / Diésel":["Company A","Company B","Company C"],"Gas Natural":["Company A","Company B","Company C"]} } },
  "Telecomunicaciones":{ products:["Internet Hogar 100Mbps","Telefonía Móvil Postpago","TV por Suscripción"], companiesByCountry:{ "Colombia":{"Internet Hogar 100Mbps":["Claro","Movistar","ETB","Tigo","Une"],"Telefonía Móvil Postpago":["Claro","Movistar","Tigo","WOM"],"TV por Suscripción":["Claro","Movistar","DirecTV","Tigo"]}, "México":{"Internet Hogar 100Mbps":["Telmex","Izzi","Totalplay","Megacable"],"Telefonía Móvil Postpago":["Telcel","AT&T México","Movistar México"],"TV por Suscripción":["Izzi","Totalplay","Sky México","Megacable"]}, "España":{"Internet Hogar 100Mbps":["Movistar España","Orange España","Vodafone España","MásMóvil"],"Telefonía Móvil Postpago":["Movistar España","Orange España","Vodafone España","Yoigo"],"TV por Suscripción":["Movistar+","Orange TV","Vodafone TV","DAZN"]}, "Estados Unidos":{"Internet Hogar 100Mbps":["Comcast Xfinity","AT&T","Verizon","Charter Spectrum"],"Telefonía Móvil Postpago":["Verizon","AT&T","T-Mobile","Dish"],"TV por Suscripción":["Comcast","DirecTV USA","Dish Network","YouTube TV"]}, "default":{"Internet Hogar 100Mbps":["Operator A","Operator B","Operator C","Operator D"],"Telefonía Móvil Postpago":["Operator A","Operator B","Operator C"],"TV por Suscripción":["Operator A","Operator B","Operator C"]} } },
  "Alimentos":{ products:["Pollo Entero","Aceite Vegetal 1L","Leche 1L","Arroz 1kg"], companiesByCountry:{ "Colombia":{"Pollo Entero":["Éxito","Jumbo","Carulla","D1","Ara"],"Aceite Vegetal 1L":["Éxito","Jumbo","D1","Ara"],"Leche 1L":["Éxito","Jumbo","D1","Olímpica"],"Arroz 1kg":["Éxito","Jumbo","D1","La 14"]}, "España":{"Pollo Entero":["Mercadona","Carrefour España","Lidl España","Eroski"],"Aceite Vegetal 1L":["Mercadona","Carrefour España","Lidl España"],"Leche 1L":["Mercadona","Carrefour España","Dia"],"Arroz 1kg":["Mercadona","Carrefour España","Lidl España"]}, "Estados Unidos":{"Pollo Entero":["Walmart USA","Kroger","Costco","Target"],"Aceite Vegetal 1L":["Walmart USA","Kroger","Whole Foods"],"Leche 1L":["Walmart USA","Kroger","Aldi USA"],"Arroz 1kg":["Walmart USA","Kroger","Costco"]}, "default":{"Pollo Entero":["Chain A","Chain B","Chain C","Chain D"],"Aceite Vegetal 1L":["Chain A","Chain B","Chain C"],"Leche 1L":["Chain A","Chain B","Chain C"],"Arroz 1kg":["Chain A","Chain B","Chain C"]} } },
  "Seguros":{ products:["Seguro Auto Básico","Seguro de Vida","SOAT / Seguro Obligatorio"], companiesByCountry:{ "Colombia":{"Seguro Auto Básico":["Sura","Bolívar","Allianz","Mapfre"],"Seguro de Vida":["Sura","Bolívar","MetLife","Suramericana"],"SOAT / Seguro Obligatorio":["Sura","Bolívar","Allianz","Mapfre","Axa"]}, "España":{"Seguro Auto Básico":["Mapfre España","Allianz España","AXA España","Generali España"],"Seguro de Vida":["Mapfre España","AXA España","Catalana Occidente"],"SOAT / Seguro Obligatorio":["Mapfre España","Allianz España","AXA España","Zurich"]}, "Estados Unidos":{"Seguro Auto Básico":["State Farm","Geico","Progressive","Allstate"],"Seguro de Vida":["MetLife USA","Prudential","New York Life"],"SOAT / Seguro Obligatorio":["State Farm","Geico","Progressive","Liberty Mutual"]}, "default":{"Seguro Auto Básico":["Insurer A","Insurer B","Insurer C"],"Seguro de Vida":["Insurer A","Insurer B","Insurer C"],"SOAT / Seguro Obligatorio":["Insurer A","Insurer B","Insurer C"]} } },
};

const BASE_PRICES = { "Gasolina Regular":9600,"Gasolina Premium":11200,"ACPM / Diésel":9100,"Gas Natural":3200,"Internet Hogar 100Mbps":87000,"Telefonía Móvil Postpago":65000,"TV por Suscripción":72000,"Pollo Entero":9200,"Aceite Vegetal 1L":8900,"Leche 1L":3400,"Arroz 1kg":4100,"Seguro Auto Básico":1820000,"Seguro de Vida":980000,"SOAT / Seguro Obligatorio":580000 };
const UNITS = { "Gasolina Regular":"litro","Gasolina Premium":"litro","ACPM / Diésel":"litro","Gas Natural":"m³","Internet Hogar 100Mbps":"mes","Telefonía Móvil Postpago":"mes","TV por Suscripción":"mes","Pollo Entero":"kg","Aceite Vegetal 1L":"und","Leche 1L":"und","Arroz 1kg":"und","Seguro Auto Básico":"año","Seguro de Vida":"año","SOAT / Seguro Obligatorio":"año" };
const PRICE_MULT = { "Colombia":1,"México":1.2,"Brasil":1.3,"Argentina":0.9,"Chile":1.1,"Perú":0.85,"España":1.8,"Francia":1.9,"Alemania":1.85,"Italia":1.75,"Reino Unido":2.1,"Estados Unidos":2.2,"Canadá":2.0,"Japón":2.5,"Corea del Sur":1.7,"India":0.4 };

function seeded(seed){ let s=seed; return ()=>{ s=(s*1664525+1013904223)&0xffffffff; return Math.abs(s)/0x7fffffff; }; }

function getCompanies(market,product,country){
  const byCountry=MARKETS[market]?.companiesByCountry;
  return byCountry?.[country]?.[product]||byCountry?.["default"]?.[product]||["Company A","Company B","Company C"];
}

function generateData(product,companies,country,region){
  const base=(BASE_PRICES[product]||10000)*(PRICE_MULT[country]||1);
  const seed=product.length*31+(country||"X").length*17+(region||"Y").length*13+companies.length*7;
  const rng=seeded(seed);
  const cartel=seed%3===0;
  const refPrice=base*(1+(rng()-0.5)*0.06);
  const MONTHS=["Nov","Dec","Jan","Feb","Mar","Apr","May"];
  return companies.map((company,i)=>{
    const r=seeded(seed+i*100+company.charCodeAt(0));
    const prevBase=base*(0.82+r()*0.1);
    const price=cartel?refPrice*(1+(r()-0.5)*0.004):base*(0.9+r()*0.2);
    const history=MONTHS.map((m,mi)=>{ const hr=seeded(seed+i*100+mi*13); const p=cartel?base*(0.85+mi*0.025)*(1+(hr()-0.5)*0.005):base*(0.82+mi*0.02+(hr()-0.5)*0.05); return {month:m,price:Math.round(p)}; });
    return {company,price:Math.round(price),prevPrice:Math.round(prevBase),history,marketShare:Math.round(8+r()*25),complaints:Math.round(r()*40),changeFreq:Math.round(1+r()*8)};
  });
}

function detectPatterns(data,country,t){
  if(!data||data.length<2) return {alerts:[],risk:{level:"N/A",score:0,color:C.t3},variancePct:0,changePct:0,avg:0,max:0,min:0};
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  const prices=data.map(d=>d.price),prevs=data.map(d=>d.prevPrice);
  const avg=prices.reduce((a,b)=>a+b,0)/prices.length;
  const avgPrev=prevs.reduce((a,b)=>a+b,0)/prevs.length;
  const max=Math.max(...prices),min=Math.min(...prices);
  const variancePct=((max-min)/avg)*100;
  const changePct=((avg-avgPrev)/avgPrev)*100;
  const allUp=data.every(d=>d.price>d.prevPrice);
  const maxShare=Math.max(...data.map(d=>d.marketShare));
  const top2=[...data.map(d=>d.marketShare)].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);
  const alerts=[];let score=0;
  const mk=(type,sev,icon,color,desc,prob,action)=>({ type:t.patternTypes[type], sev:t.sevLabels[sev], icon, color, desc, legal:lf.rules?.[type]||"", action:t.patternActions[type], probability:prob, sanction:lf.sanction||"" });

  if(variancePct<0.5&&data.length>=3){ alerts.push(mk("FIJACIÓN DE PRECIOS","CRÍTICA","🔴",C.red,t.patternDescs["FIJACIÓN DE PRECIOS"](variancePct.toFixed(2),data.length),t.probLabels.high80,"")); score+=45; }
  if(allUp&&changePct>10){ alerts.push(mk("ALZA SIMULTÁNEA",changePct>20?"CRÍTICA":"ALTA","🟠",changePct>20?C.red:C.amber,t.patternDescs["ALZA SIMULTÁNEA"](changePct.toFixed(1)),changePct>20?t.probLabels.high60:t.probLabels.med40,"")); score+=changePct>20?35:20; }
  if(variancePct>=0.5&&variancePct<2&&data.length>=3){ alerts.push(mk("PARALELISMO DE PRECIOS","MEDIA","🟡",C.amber,t.patternDescs["PARALELISMO DE PRECIOS"](variancePct.toFixed(2)),t.probLabels.med30b,"")); score+=12; }
  if(maxShare>60){ const dom=data.find(d=>d.marketShare===maxShare); alerts.push(mk("POSICIÓN DOMINANTE","ALTA","🔵",C.blue,t.patternDescs["POSICIÓN DOMINANTE"](dom.company,maxShare),t.probLabels.med30,"")); score+=18; }
  data.filter(d=>d.price<avg*0.75).forEach(d=>{ alerts.push(mk("PRECIOS PREDATORIOS","ALTA","⚡",C.purple,t.patternDescs["PRECIOS PREDATORIOS"](d.company,(((avg-d.price)/avg)*100).toFixed(1)),t.probLabels.med35,"")); score+=20; });
  if(top2>80&&data.length>=3){ alerts.push(mk("CONCENTRACIÓN","MEDIA","🔶","#f97316",t.patternDescs["CONCENTRACIÓN"](top2),t.probLabels.med30c,"")); score+=10; }

  let level,color;
  if(score>=55){level="CRÍTICO";color=C.red;}
  else if(score>=35){level="ALTO";color=C.amber;}
  else if(score>=15){level="MEDIO";color="#f59e0b";}
  else{level="BAJO";color=C.green;}
  return {alerts,risk:{level,score,color},variancePct,changePct,avg,max,min};
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
const Badge=({label,color})=>(<span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:.8,fontFamily:"monospace",whiteSpace:"nowrap"}}>{label}</span>);
const SectionTitle=({children})=>(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><div style={{height:1,flex:1,background:`linear-gradient(90deg,${C.gold}55,transparent)`}}/><span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span><div style={{height:1,flex:1,background:`linear-gradient(270deg,${C.gold}55,transparent)`}}/></div>);
function StatCard({icon,label,value,sub,color,delay=0}){return(<div style={{background:C.card,border:`1px solid ${color}33`,borderRadius:12,padding:"16px 18px",animation:`fadeUp .5s ease ${delay}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><span style={{fontSize:10,color:C.t3,letterSpacing:.8,textTransform:"uppercase"}}>{label}</span><span style={{fontSize:18}}>{icon}</span></div><div style={{fontSize:22,fontWeight:800,color,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{value}</div>{sub&&<div style={{fontSize:11,color:C.t3}}>{sub}</div>}</div>);}
function CTip({children,color}){const col=color||C.gold;return <div style={{background:col+"11",border:`1px solid ${col}33`,borderRadius:8,padding:"10px 14px",fontSize:12,color:col,lineHeight:1.6,marginBottom:12}}>{children}</div>;}
function CTooltip({active,payload,label,unit}){if(!active||!payload?.length)return null;return(<div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",fontSize:12}}><div style={{color:C.t2,marginBottom:6,fontWeight:600}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||C.gold,marginBottom:2}}>{p.name}: <b>{p.value?.toLocaleString()}</b>{unit&&` / ${unit}`}</div>)}</div>);}

function AlertCard({a,expanded,onToggle,t}){
  return(<div style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,marginBottom:10,overflow:"hidden"}}>
    <div onClick={onToggle} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12}}>
      <span style={{fontSize:20,marginTop:1}}>{a.icon}</span>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
          <span style={{color:a.color,fontWeight:700,fontSize:13}}>{a.type}</span>
          <Badge label={`${t.severity}: ${a.sev}`} color={a.color}/>
          <Badge label={`${t.probability}: ${a.probability}`} color={a.color}/>
        </div>
        <p style={{color:C.t2,fontSize:12,margin:0,lineHeight:1.6}}>{a.desc}</p>
      </div>
      <span style={{color:C.t3,fontSize:14,marginTop:2,userSelect:"none",flexShrink:0}}>{expanded?"▲":"▼"}</span>
    </div>
    {expanded&&(<div style={{borderTop:`1px solid ${a.color}22`,padding:"16px 18px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
      <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>⚖️ {t.legalBase}</div><div style={{fontSize:12,color:a.color,lineHeight:1.7}}>{a.legal}</div></div>
      <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>🔍 {t.recommendedAction}</div><div style={{fontSize:12,color:C.t2,lineHeight:1.7}}>{a.action}</div></div>
      <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>💰 {t.applicableSanctions}</div><div style={{fontSize:12,color:C.t2,lineHeight:1.7}}>{a.sanction}</div></div>
    </div>)}
  </div>);
}

function AlertsPanel({alerts,country,emailConfig,onEmailConfig,t}){
  const [expanded,setExpanded]=useState(null);
  const [emailInput,setEmailInput]=useState(emailConfig.email||"");
  const [saved,setSaved]=useState(false);
  const [thresholds,setThresholds]=useState({a:true,b:true,c:true,d:true,e:true,f:false});
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  const crit=alerts.filter(a=>a.sev===t.sevLabels["CRÍTICA"]),high=alerts.filter(a=>a.sev===t.sevLabels["ALTA"]),med=alerts.filter(a=>a.sev===t.sevLabels["MEDIA"]);
  const save=()=>{onEmailConfig({email:emailInput});setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const thresholdKeys=["a","b","c","d","e","f"];
  const thresholdColors=[C.red,C.amber,C.amber,C.blue,C.purple,"#f97316"];
  const Toggle=({label,k,color})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{fontSize:12,color:C.t2}}>{label}</span><div onClick={()=>setThresholds(p=>({...p,[k]:!p[k]}))} style={{width:40,height:22,borderRadius:11,cursor:"pointer",transition:"all .2s",background:thresholds[k]?color+"44":C.t4,border:`1px solid ${thresholds[k]?color:C.borderHi}`,position:"relative"}}><div style={{width:16,height:16,borderRadius:"50%",position:"absolute",top:2,left:thresholds[k]?20:2,transition:"left .2s",background:thresholds[k]?color:C.t3}}/></div></div>);
  return(<div>
    {alerts.length>0?(<div style={{marginBottom:28}}>
      <SectionTitle>{t.activeAlerts} — {alerts.length} {alerts.length!==1?t.detections:t.detection}</SectionTitle>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[{label:t.critical,count:crit.length,color:C.red},{label:t.high,count:high.length,color:C.amber},{label:t.medium,count:med.length,color:"#f59e0b"}].map(s=>(<div key={s.label} style={{background:s.color+"11",border:`1px solid ${s.color}33`,borderRadius:10,padding:"12px 20px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:26,fontWeight:800,color:s.color}}>{s.count}</span><span style={{fontSize:10,color:s.color,fontWeight:700,letterSpacing:.8}}>{s.label}</span></div>))}
        <div style={{background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:10,padding:"12px 20px"}}><div style={{fontSize:9,color:C.t3,letterSpacing:.8,marginBottom:2}}>{t.jurisdiction}</div><div style={{fontSize:11,color:C.teal,fontWeight:700}}>{lf.authority}</div></div>
      </div>
      {alerts.map((a,i)=><AlertCard key={i} a={a} expanded={expanded===i} onToggle={()=>setExpanded(expanded===i?null:i)} t={t}/>)}
    </div>):(<CTip color={C.green}>✅ {t.noAlerts}</CTip>)}
    <SectionTitle>{t.notifChannels}</SectionTitle>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>📧</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{t.emailAlerts}</span><Badge label={t.active} color={C.teal}/></div>
        <input value={emailInput} onChange={e=>{setEmailInput(e.target.value);setSaved(false);}} placeholder="email@example.com" type="email" style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",marginBottom:10}}/>
        <button onClick={save} style={{width:"100%",background:saved?C.green+"22":C.gold+"22",border:`1px solid ${saved?C.green:C.gold}`,borderRadius:8,padding:"9px",color:saved?C.green:C.gold,fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:700}}>{saved?t.configured:t.activateEmail}</button>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.teal}33`,borderRadius:12,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>🔔</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{t.inAppNotif}</span><Badge label={t.alwaysActive} color={C.teal}/></div>
        <p style={{fontSize:12,color:C.t3,lineHeight:1.7,margin:"0 0 10px"}}>{t.inAppDesc}</p>
        <div style={{background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.teal}}>✓ {t.noConfigRequired}</div>
      </div>
      {[{icon:"💬",name:"WhatsApp"},{icon:"✈️",name:"Telegram"}].map(ch=>(<div key={ch.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>{ch.icon}</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{ch.name}</span><Badge label={t.comingSoon} color={C.t3}/></div><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.t4,fontSize:12,marginBottom:10}}>v2.0</div><button disabled style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px",color:C.t4,fontSize:12,fontFamily:"inherit",cursor:"not-allowed"}}>{t.inDevelopment}</button></div>))}
    </div>
    <SectionTitle>{t.detectionThresholds}</SectionTitle>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
      {t.thresholds.map((label,i)=><Toggle key={i} label={label} k={thresholdKeys[i]} color={thresholdColors[i]}/>)}
    </div>
  </div>);
}

function FilterPanel({filters,onChange,t,lang}){
  const {region_group,country,region,market,product,company,dateFrom,dateTo,hourFrom,hourTo}=filters;
  const countryData=GEO[region_group]?.countries[country];
  const regions=countryData?.regions||["Nacional"];
  const flag=countryData?.flag||"🌍";
  const products=MARKETS[market]?.products||[];
  const companies=getCompanies(market,product,country);
  const sel=(key,val)=>{const n={...filters,[key]:val};if(key==="region_group"){const firstC=Object.keys(GEO[val]?.countries||{})[0];n.country=firstC||"";n.region="Nacional";n.company=t.allCompanies;}if(key==="country"){n.region="Nacional";n.company=t.allCompanies;}if(key==="market"){n.product=MARKETS[val]?.products[0]||"";n.company=t.allCompanies;}if(key==="product"){n.company=t.allCompanies;}onChange(n);};
  const L=({c})=><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:5,textTransform:"uppercase"}}>{c}</div>;
  const Sel=({value,opts,k})=>(<select value={value} onChange={e=>sel(k,e.target.value)} style={{width:"100%",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>);
  const DI=({label,val,k})=>(<div style={{flex:1}}><L c={label}/><input type="date" value={val} onChange={e=>sel(k,e.target.value)} style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none"}}/></div>);
  const TI=({label,val,k})=>(<div style={{flex:1}}><L c={label}/><input type="time" value={val} onChange={e=>sel(k,e.target.value)} style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none"}}/></div>);
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:26}}>
    <SectionTitle>{t.filterTitle}</SectionTitle>
    <div style={{marginBottom:16}}><L c={t.worldRegion}/><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{Object.entries(GEO).map(([rg,v])=>(<button key={rg} onClick={()=>sel("region_group",rg)} style={{background:region_group===rg?C.gold+"22":"transparent",border:`1px solid ${region_group===rg?C.gold:C.borderHi}`,borderRadius:8,padding:"7px 14px",color:region_group===rg?C.gold:C.t3,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all .2s",fontWeight:region_group===rg?700:400}}>{v.flag} {t.regions[rg]||rg}</button>))}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:16}}>
      <div><L c={t.country}/><select value={country} onChange={e=>sel("country",e.target.value)} style={{width:"100%",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{Object.keys(GEO[region_group]?.countries||{}).map(c=>(<option key={c} value={c}>{GEO[region_group].countries[c].flag} {c}</option>))}</select></div>
      <div><L c={t.territory}/><Sel value={region} opts={regions} k="region"/></div>
      <div><L c={t.market}/><Sel value={market} opts={Object.keys(MARKETS)} k="market"/></div>
      <div><L c={t.product}/><Sel value={product} opts={products} k="product"/></div>
      <div><L c={t.company}/><Sel value={company} opts={[t.allCompanies,...companies]} k="company"/></div>
    </div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <DI label={t.dateFrom} val={dateFrom} k="dateFrom"/>
      <DI label={t.dateTo} val={dateTo} k="dateTo"/>
      <TI label={t.hourFrom} val={hourFrom} k="hourFrom"/>
      <TI label={t.hourTo} val={hourTo} k="hourTo"/>
    </div>
    {LEGAL_FRAMEWORKS[country]&&(<div style={{marginTop:14,background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{fontSize:16}}>{flag}</span><div><span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{LEGAL_FRAMEWORKS[country].authority}</span></div><div style={{marginLeft:"auto"}}><span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>{t.legalFrame}: </span><span style={{fontSize:11,color:C.gold,fontWeight:600}}>{LEGAL_FRAMEWORKS[country].law}</span></div></div>)}
  </div>);
}

function ComparisonStats({data,selectedCompany,analysis,unit,t}){
  if(!data.length) return null;
  const avg=analysis.avg||0;
  const sorted=[...data].sort((a,b)=>a.price-b.price);
  const PALETTE=[C.gold,C.teal,C.red,C.blue,C.purple,"#f97316"];
  const barData=data.map(d=>({name:d.company,price:d.price,prevPrice:d.prevPrice,diff:+(((d.price-avg)/avg)*100).toFixed(1)}));
  const histData=(data[0]?.history||[]).map((h,i)=>({month:h.month,...Object.fromEntries(data.map(d=>[d.company,d.history[i]?.price]))}));
  return(<div style={{animation:"fadeUp .5s ease .15s both"}}>
    <SectionTitle>{t.comparison}</SectionTitle>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:20}}>
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>{t.rankingTitle}</span><span style={{fontSize:10,color:C.t4}}>{t.average}: {Math.round(avg).toLocaleString()} / {unit}</span></div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{t.tableHeaders.map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:C.t3,fontWeight:700,letterSpacing:.8}}>{h}</th>)}</tr></thead>
        <tbody>{sorted.map((row,i)=>{const chg=((row.price-row.prevPrice)/row.prevPrice)*100,dAvg=((row.price-avg)/avg)*100,isSel=row.company===selectedCompany;return(<tr key={row.company} style={{borderBottom:`1px solid ${C.border}22`,background:isSel?C.goldGlow:"transparent"}}><td style={{padding:"10px 14px",fontSize:13,color:C.t3,fontWeight:700}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</td><td style={{padding:"10px 14px",fontSize:13,fontWeight:700,color:isSel?C.gold:C.t1}}>{row.company}{isSel&&<span style={{fontSize:9,color:C.gold}}> ◀</span>}</td><td style={{padding:"10px 14px",fontSize:13,color:C.teal,fontWeight:700}}>{row.price.toLocaleString()}</td><td style={{padding:"10px 14px",fontSize:12,color:C.t3}}>{row.prevPrice.toLocaleString()}</td><td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(chg)>15?C.red:Math.abs(chg)>5?C.amber:C.green}}>{chg>0?"+":""}{chg.toFixed(1)}%</td><td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(dAvg)>5?C.amber:C.green}}>{dAvg>0?"+":""}{dAvg.toFixed(1)}%</td><td style={{padding:"10px 14px"}}><Badge label={`${row.marketShare}%`} color={C.blue}/></td><td style={{padding:"10px 14px"}}><Badge label={row.complaints} color={row.complaints>25?C.red:row.complaints>10?C.amber:C.green}/></td></tr>);})}</tbody>
      </table>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.currentVsPrev}</div><ResponsiveContainer width="100%" height={190}><BarChart data={barData} barGap={3}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/><Bar dataKey="prevPrice" fill={C.t4} name={t.prev} radius={[3,3,0,0]}/><Bar dataKey="price" fill={C.gold} name={t.current} radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.deviationVsAvg}</div><ResponsiveContainer width="100%" height={190}><BarChart data={barData}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/><Tooltip formatter={v=>[`${v}%`,t.devFromAvg]}/><ReferenceLine y={0} stroke={C.t3} strokeDasharray="4 4"/><Bar dataKey="diff" fill={C.teal} name={t.devFromAvg} radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:18}}>
      <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.historicalEvolution}</div>
      <ResponsiveContainer width="100%" height={200}><LineChart data={histData}><CartesianGrid stroke={C.border} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:C.t3,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/>{data.map((d,i)=><Line key={d.company} type="monotone" dataKey={d.company} stroke={PALETTE[i%PALETTE.length]} strokeWidth={d.company===selectedCompany?3:1.5} strokeDasharray={d.company===selectedCompany?"":"5 3"} dot={false} name={d.company}/>)}</LineChart></ResponsiveContainer>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:10}}>{data.map((d,i)=><div key={d.company} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:18,height:2,background:PALETTE[i%PALETTE.length],borderRadius:2,opacity:d.company===selectedCompany?1:.5}}/><span style={{fontSize:10,color:d.company===selectedCompany?C.gold:C.t3}}>{d.company}{d.company===selectedCompany?" ◀":""}</span></div>)}</div>
    </div>
  </div>);
}

function RiskPanel({analysis,onGoToAlerts,country,t}){
  if(!analysis) return null;
  const {alerts,risk,variancePct,changePct,avg,max,min}=analysis;
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  return(<div style={{animation:"fadeUp .5s ease both"}}>
    <SectionTitle>{t.riskStats}</SectionTitle>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:14,marginBottom:22}}>
      <StatCard icon="🎯" label={t.riskLevel} value={risk.level} sub={`${t.score}: ${risk.score}/100`} color={risk.color}/>
      <StatCard icon="📐" label={t.marketDispersion} value={`${variancePct?.toFixed(2)||"—"}%`} sub={t.betweenCompetitors} color={variancePct<1?C.red:variancePct<3?C.amber:C.green} delay={.05}/>
      <StatCard icon="📈" label={t.avgVariation} value={`${changePct>0?"+":""}${changePct?.toFixed(1)||"—"}%`} sub={t.vsPrevPeriod} color={Math.abs(changePct)>15?C.red:Math.abs(changePct)>5?C.amber:C.green} delay={.1}/>
      <StatCard icon="⬆️" label={t.maxPrice} value={max?.toLocaleString()||"—"} sub={t.mostExpensive} color={C.red} delay={.15}/>
      <StatCard icon="⬇️" label={t.minPrice} value={min?.toLocaleString()||"—"} sub={t.cheapest} color={C.green} delay={.2}/>
      <StatCard icon="➗" label={t.avgPrice} value={Math.round(avg||0).toLocaleString()} sub={t.marketAvg} color={C.blue} delay={.25}/>
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:10,padding:"12px 16px",marginBottom:18,display:"flex",gap:16,flexWrap:"wrap"}}>
      <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{lf.authority}</span></div>
      <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.legalFrame}: </span><span style={{fontSize:11,color:C.gold,fontWeight:600}}>{lf.law}</span></div>
    </div>
    {alerts.length>0?(<div>{alerts.map((a,i)=>(<div key={i} style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,padding:"13px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>{a.icon}</span><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{color:a.color,fontWeight:700,fontSize:13}}>{a.type}</span><Badge label={a.sev} color={a.color}/><Badge label={a.probability} color={a.color}/></div><p style={{color:C.t2,fontSize:12,margin:0,lineHeight:1.5}}>{a.desc}</p></div><button onClick={onGoToAlerts} style={{background:"transparent",border:`1px solid ${a.color}44`,borderRadius:7,padding:"6px 12px",color:a.color,fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>{t.seeDetail}</button></div>))}</div>):(<CTip color={C.green}>✅ {t.noAlerts}</CTip>)}
  </div>);
}

function AIAnalysis({data,analysis,product,country,region,unit,t}){
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  const Dot=({delay})=><span style={{width:7,height:7,borderRadius:"50%",background:C.gold,display:"inline-block",animation:`pulse 1.2s ease-in-out ${delay}s infinite`}}/>;
  const run=async()=>{
    if(!data.length) return;
    setLoading(true);setText("");
    const prompt=t.aiPrompt(product,region,country,unit,data,analysis,lf);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();
      setText(d.content?.map(b=>b.text||"").join("")||"Error.");
    }catch{setText("Connection error.");}
    finally{setLoading(false);}
  };
  return(<div>
    <SectionTitle>{t.aiAnalysis}</SectionTitle>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:16,flexWrap:"wrap"}}>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.jurisdiction}: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{country}</span></div>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11,color:C.gold,fontWeight:700}}>{lf.authority}</span></div>
      </div>
      <p style={{color:C.t2,fontSize:13,lineHeight:1.7,margin:"0 0 18px"}}>{t.aiDesc}</p>
      <button onClick={run} disabled={loading} style={{background:loading?C.t4:C.gold,border:"none",borderRadius:8,padding:"12px 26px",color:loading?C.t3:"#000",fontSize:13,fontWeight:800,fontFamily:"inherit",cursor:loading?"wait":"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
        {loading?<><span style={{display:"flex",gap:4}}><Dot delay={0}/><Dot delay={.2}/><Dot delay={.4}/></span>{t.analyzing}…</>:t.generateDictum}
      </button>
    </div>
    {text&&(<div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:12,padding:22,animation:"fadeUp .4s ease"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:18}}>⚖️</span><span style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1}}>{t.dictum} — {product} / {region}, {country}</span></div><div style={{color:C.t2,fontSize:13,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{text}</div></div>)}
  </div>);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("es");
  const t=T[lang];
  const [tab,setTab]=useState("dashboard");
  const [emailConfig,setEmailConfig]=useState({email:""});
  const [filters,setFilters]=useState({region_group:"América Latina",country:"Colombia",region:"Bogotá",market:"Energía",product:"Gasolina Regular",company:"Todas",dateFrom:"2026-04-01",dateTo:"2026-05-13",hourFrom:"00:00",hourTo:"23:59"});

  const companies=useMemo(()=>getCompanies(filters.market,filters.product,filters.country),[filters.market,filters.product,filters.country]);
  const allData=useMemo(()=>generateData(filters.product,companies,filters.country,filters.region),[filters.product,companies,filters.country,filters.region]);
  const displayData=useMemo(()=>filters.company===t.allCompanies||filters.company==="Todas"?allData:allData.filter(d=>d.company===filters.company),[allData,filters.company,t.allCompanies]);
  const analysis=useMemo(()=>detectPatterns(allData,filters.country,t),[allData,filters.country,t]);
  const unit=UNITS[filters.product]||"und";
  const alertCount=analysis.alerts.length;
  const countryInfo=GEO[filters.region_group]?.countries[filters.country];

  return(<div style={{minHeight:"100vh",background:C.bg,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:C.t1}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Syne:wght@700;800&display=swap');
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#060910}::-webkit-scrollbar-thumb{background:#182030;border-radius:2px}
      select option{background:#0c1220;color:#e8edf5}
    `}</style>

    {/* Header */}
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${C.gold}33,${C.goldDim}22)`,border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>⚖️</div>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:C.gold,letterSpacing:.5}}>FAIR COMPES</div>
          <div style={{fontSize:9,color:C.t4,letterSpacing:1.5}}>{t.appSubtitle}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {/* Language Toggle */}
        <div style={{display:"flex",background:C.card,border:`1px solid ${C.borderHi}`,borderRadius:8,overflow:"hidden"}}>
          {["es","en"].map(l=>(<button key={l} onClick={()=>setLang(l)} style={{background:lang===l?C.gold+"33":"transparent",border:"none",borderRight:l==="es"?`1px solid ${C.borderHi}`:"none",padding:"6px 12px",color:lang===l?C.gold:C.t3,fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:lang===l?700:400,transition:"all .2s"}}>{l==="es"?"🇪🇸 ES":"🇬🇧 EN"}</button>))}
        </div>
        {countryInfo&&(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{countryInfo.flag}</span><div><div style={{fontSize:11,color:C.t1,fontWeight:700}}>{filters.country}</div><div style={{fontSize:9,color:C.t4}}>{countryInfo.currency}</div></div></div>)}
        {alertCount>0&&(<div onClick={()=>setTab("alerts")} style={{background:analysis.risk.color+"22",border:`1px solid ${analysis.risk.color}44`,borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><span style={{width:7,height:7,borderRadius:"50%",background:analysis.risk.color,boxShadow:`0 0 8px ${analysis.risk.color}`,display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/><span style={{fontSize:11,color:analysis.risk.color,fontWeight:700}}>{alertCount} {alertCount!==1?t.alertsPlural:t.alerts}</span></div>)}
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:`0 0 8px ${C.green}`,display:"inline-block"}}/><span style={{fontSize:10,color:C.t3}}>{t.live}</span></div>
      </div>
    </div>

    {/* Tabs */}
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 28px",display:"flex",gap:0}}>
      {t.tabs.map((label,i)=>{const ids=["dashboard","comparison","alerts","ai"];return(<button key={ids[i]} onClick={()=>setTab(ids[i])} style={{background:"transparent",border:"none",borderBottom:tab===ids[i]?`2px solid ${C.gold}`:"2px solid transparent",color:tab===ids[i]?C.gold:C.t3,padding:"12px 20px",fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:tab===ids[i]?700:400,transition:"all .2s",whiteSpace:"nowrap"}}>{label}</button>);})}
    </div>

    {/* Body */}
    <div style={{maxWidth:1020,margin:"0 auto",padding:"26px 28px"}}>
      <FilterPanel filters={filters} onChange={setFilters} t={t} lang={lang}/>
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {[{k:t.country,v:`${countryInfo?.flag||""} ${filters.country}`},{k:t.territory,v:filters.region},{k:t.market,v:filters.market},{k:t.product,v:filters.product},{k:t.company,v:filters.company},{k:t.period,v:`${filters.dateFrom} → ${filters.dateTo}`},{k:t.schedule,v:`${filters.hourFrom} – ${filters.hourTo}`}].map(x=>(<div key={x.k} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 12px",fontSize:11}}><span style={{color:C.t4}}>{x.k}: </span><span style={{color:C.teal,fontWeight:700}}>{x.v}</span></div>))}
      </div>
      {tab==="dashboard"&&<><RiskPanel analysis={analysis} onGoToAlerts={()=>setTab("alerts")} country={filters.country} t={t}/><div style={{marginTop:28}}><ComparisonStats data={displayData} selectedCompany={filters.company} analysis={analysis} unit={unit} t={t}/></div></>}
      {tab==="comparison"&&<ComparisonStats data={allData} selectedCompany={filters.company} analysis={analysis} unit={unit} t={t}/>}
      {tab==="alerts"&&<AlertsPanel alerts={analysis.alerts} country={filters.country} emailConfig={emailConfig} onEmailConfig={setEmailConfig} t={t}/>}
      {tab==="ai"&&<AIAnalysis data={allData} analysis={analysis} product={filters.product} country={filters.country} region={filters.region} unit={unit} t={t}/>}
    </div>
  </div>);
}
