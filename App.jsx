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
    appSubtitle:"MONITOR ANTIMONOPOLIO", live:"EN VIVO", alerts:"ALERTA", alertsPlural:"ALERTAS",
    tabs:["📊 Dashboard","📉 Comparativa","🔔 Alertas","⚖️ Dictamen IA"],
    filterTitle:"Filtros de Consulta", worldRegion:"Región del mundo", country:"País",
    territory:"Territorio / Ciudad", market:"Mercado", product:"Producto / Servicio",
    company:"Empresa", dateFrom:"Fecha desde", dateTo:"Fecha hasta",
    hourFrom:"Hora desde", hourTo:"Hora hasta", authority:"AUTORIDAD COMPETENTE",
    legalFrame:"MARCO LEGAL", allCompanies:"Todas",
    riskLevel:"Nivel de riesgo", marketDispersion:"Dispersión mercado",
    avgVariation:"Variación media", maxPrice:"Precio máximo", minPrice:"Precio mínimo",
    avgPrice:"Precio promedio", betweenCompetitors:"entre competidores",
    vsPrevPeriod:"vs período anterior", mostExpensive:"más caro del mercado",
    cheapest:"más barato del mercado", marketAvg:"media del mercado", score:"Score",
    activeAlerts:"Alertas Activas", detection:"detección", detections:"detecciones",
    critical:"CRÍTICAS", high:"ALTAS", medium:"MEDIAS", jurisdiction:"JURISDICCIÓN",
    noAlerts:"No se detectaron prácticas restrictivas en el mercado seleccionado.",
    notifChannels:"Canales de Notificación", emailAlerts:"Correo electrónico",
    active:"Activo", alwaysActive:"Siempre activo", inAppNotif:"Notificación en app",
    inAppDesc:"Las alertas se actualizan automáticamente al cambiar los filtros.",
    noConfigRequired:"Sin configuración requerida", comingSoon:"Próximamente",
    inDevelopment:"En desarrollo", detectionThresholds:"Umbrales de Detección",
    activateEmail:"Activar alertas por email", configured:"✓ Configurado",
    comparison:"Comparativa entre Competidores",
    rankingTitle:"RANKING DE PRECIOS — menor a mayor", average:"Promedio",
    currentVsPrev:"PRECIO ACTUAL vs ANTERIOR",
    deviationVsAvg:"DESVIACIÓN VS PROMEDIO DE MERCADO",
    historicalEvolution:"EVOLUCIÓN HISTÓRICA COMPARADA (7 MESES)",
    riskStats:"Estadísticas de Riesgo Anticompetitivo", seeDetail:"Ver detalle →",
    aiAnalysis:"Dictamen Jurídico con IA",
    aiDesc:"La IA genera un dictamen técnico-jurídico con base legal exacta, probabilidad de infracción y recomendaciones de investigación.",
    generateDictum:"⚖️ Generar Dictamen Legal", analyzing:"Analizando", dictum:"DICTAMEN",
    legalBase:"BASE LEGAL", recommendedAction:"ACCIÓN RECOMENDADA",
    applicableSanctions:"SANCIONES APLICABLES", severity:"SEVERIDAD", probability:"PROBABILIDAD",
    period:"Período", schedule:"Horario", currentPrice:"Precio actual",
    prevPrice:"Precio anterior", variation:"Variación", vsAverage:"vs Promedio",
    marketShare:"Cuota mercado", changes30:"Cambios 30 días",
    priceAdjustments:"ajustes de precio", individualProfile:"Perfil Individual",
    historicalPrice:"EVOLUCIÓN HISTÓRICA DE PRECIO", competitiveScore:"SCORECARD COMPETITIVO",
    higherBetter:"Mayor valor = mejor desempeño relativo", per:"por",
    prevPeriod:"período anterior", marketDeviation:"desviación del mercado", estimated:"estimado",
    regions:{"América Latina":"América Latina","Europa":"Europa","América del Norte":"América del Norte","Asia":"Asia"},
    markets:{"Energía":"Energía","Telecomunicaciones":"Telecomunicaciones","Alimentos":"Alimentos","Seguros":"Seguros","Farmacéutico":"Farmacéutico","Transporte":"Transporte","Banca y Finanzas":"Banca y Finanzas"},
    patternTypes:{"FIJACIÓN DE PRECIOS":"FIJACIÓN DE PRECIOS","ALZA SIMULTÁNEA":"ALZA SIMULTÁNEA","PARALELISMO DE PRECIOS":"PARALELISMO DE PRECIOS","POSICIÓN DOMINANTE":"POSICIÓN DOMINANTE","PRECIOS PREDATORIOS":"PRECIOS PREDATORIOS","CONCENTRACIÓN":"CONCENTRACIÓN"},
    patternDescs:{"FIJACIÓN DE PRECIOS":(v,n)=>`Dispersión de solo ${v}% entre ${n} competidores. Coordinación horizontal altamente probable.`,"ALZA SIMULTÁNEA":(v)=>`Todos los actores incrementaron precios ${v}% simultáneamente. Posible señalización o acuerdo tácito.`,"PARALELISMO DE PRECIOS":(v)=>`Diferencia máxima entre actores: ${v}%. Comportamiento paralelo sin justificación estructural evidente.`,"POSICIÓN DOMINANTE":(c,v)=>`${c} concentra el ${v}% del mercado. Posible abuso si impone condiciones desventajosas.`,"PRECIOS PREDATORIOS":(c,v)=>`${c} vende ${v}% por debajo del promedio. Posible estrategia para excluir rivales.`,"CONCENTRACIÓN":(v)=>`Las 2 empresas más grandes concentran el ${v}% del mercado. Estructura oligopólica con alto riesgo de coordinación.`},
    patternActions:{"FIJACIÓN DE PRECIOS":"Iniciar investigación formal. Solicitar información sobre comunicaciones entre empresas. Revisar actas de gremios.","ALZA SIMULTÁNEA":"Verificar si existieron comunicados de prensa, reuniones gremiales o declaraciones públicas previas al alza.","PARALELISMO DE PRECIOS":"Analizar si la uniformidad obedece a costos homogéneos, regulación tarifaria o factores de mercado legítimos.","POSICIÓN DOMINANTE":"Investigar si impone precios excesivos, condiciona ventas o discrimina clientes sin justificación objetiva.","PRECIOS PREDATORIOS":"Solicitar estructura de costos. Verificar si el precio cubre al menos el costo variable medio.","CONCENTRACIÓN":"Revisar historia de adquisiciones. Evaluar barreras de entrada. Monitorear operaciones de integración futuras."},
    sevLabels:{"CRÍTICA":"CRÍTICA","ALTA":"ALTA","MEDIA":"MEDIA"},
    riskLabels:{critical:"CRÍTICO",high:"ALTO",medium:"MEDIO",low:"BAJO"},
    probLabels:{high80:"Muy Alta (>80%)",high60:"Alta (60-80%)",med40:"Media (40-60%)",med30:"Media-Alta (50-70%)",med35:"Media (35-55%)",med30b:"Media (30-50%)",med30c:"Media (30-45%)"},
    thresholds:["🔴 Fijación de precios — dispersión menor al 0.5%","🟠 Alza simultánea — todos los actores suben más del 10%","🟡 Paralelismo de precios — dispersión entre 0.5% y 2%","🔵 Posición dominante — cuota de mercado superior al 60%","⚡ Precios predatorios — precio menor al 75% del promedio","🔶 Alta concentración — top 2 empresas superan el 80%"],
    tableHeaders:["#","EMPRESA","PRECIO","ANTERIOR","VARIACIÓN","vs PROMEDIO","CUOTA","QUEJAS"],
    prev:"Anterior", current:"Actual", devFromAvg:"Desv. del promedio", complaints:"Quejas", selected:"seleccionada",
    allCompaniesLabel:"Todas las empresas",
    aiPrompt:(product,region,country,unit,data,analysis,lf)=>`Eres un experto en derecho de la competencia. Analiza estos datos bajo el marco legal de ${country}:\n\nJURISDICCIÓN: ${country}\nAUTORIDAD: ${lf.authority}\nMARCO LEGAL: ${lf.law}\nPRODUCTO: ${product} | TERRITORIO: ${region} | UNIDAD: ${unit}\n\nDATOS:\n${data.map(d=>`- ${d.company}: ${d.price.toLocaleString()} (ant: ${d.prevPrice.toLocaleString()}, var: ${(((d.price-d.prevPrice)/d.prevPrice)*100).toFixed(1)}%, cuota: ${d.marketShare}%)`).join("\n")}\n\nESTADÍSTICAS:\n- Dispersión: ${analysis.variancePct?.toFixed(2)}%\n- Variación: ${analysis.changePct?.toFixed(1)}%\n- Riesgo: ${analysis.risk?.level} (${analysis.risk?.score}/100)\n- Alertas: ${analysis.alerts?.map(a=>a.type).join(", ")||"Ninguna"}\n\nGenera un dictamen técnico-jurídico completo con:\n1. DIAGNÓSTICO ECONÓMICO del mercado (2 párrafos)\n2. PRÁCTICAS IDENTIFICADAS con artículos exactos de ${lf.law}\n3. PROBABILIDAD DE INFRACCIÓN por cada práctica detectada\n4. RECOMENDACIONES DE INVESTIGACIÓN priorizadas para ${lf.authority}\n5. SANCIONES APLICABLES con montos específicos según ${lf.law}\n\nSé específico y técnico. Usa terminología jurídica apropiada.`,
  },
  en: {
    appSubtitle:"ANTITRUST MONITOR", live:"LIVE", alerts:"ALERT", alertsPlural:"ALERTS",
    tabs:["📊 Dashboard","📉 Comparison","🔔 Alerts","⚖️ AI Legal Opinion"],
    filterTitle:"Query Filters", worldRegion:"World Region", country:"Country",
    territory:"Territory / City", market:"Market", product:"Product / Service",
    company:"Company", dateFrom:"Date from", dateTo:"Date to",
    hourFrom:"Hour from", hourTo:"Hour to", authority:"COMPETENT AUTHORITY",
    legalFrame:"LEGAL FRAMEWORK", allCompanies:"All",
    riskLevel:"Risk level", marketDispersion:"Market dispersion",
    avgVariation:"Average variation", maxPrice:"Maximum price", minPrice:"Minimum price",
    avgPrice:"Average price", betweenCompetitors:"between competitors",
    vsPrevPeriod:"vs previous period", mostExpensive:"most expensive in market",
    cheapest:"cheapest in market", marketAvg:"market average", score:"Score",
    activeAlerts:"Active Alerts", detection:"detection", detections:"detections",
    critical:"CRITICAL", high:"HIGH", medium:"MEDIUM", jurisdiction:"JURISDICTION",
    noAlerts:"No restrictive practices detected in the selected market.",
    notifChannels:"Notification Channels", emailAlerts:"Email",
    active:"Active", alwaysActive:"Always active", inAppNotif:"In-app notification",
    inAppDesc:"Alerts update automatically when filters change.",
    noConfigRequired:"No configuration required", comingSoon:"Coming soon",
    inDevelopment:"In development", detectionThresholds:"Detection Thresholds",
    activateEmail:"Activate email alerts", configured:"✓ Configured",
    comparison:"Competitor Comparison",
    rankingTitle:"PRICE RANKING — lowest to highest", average:"Average",
    currentVsPrev:"CURRENT vs PREVIOUS PRICE",
    deviationVsAvg:"DEVIATION VS MARKET AVERAGE",
    historicalEvolution:"HISTORICAL COMPARISON (7 MONTHS)",
    riskStats:"Antitrust Risk Statistics", seeDetail:"See detail →",
    aiAnalysis:"AI Legal Opinion",
    aiDesc:"The AI generates a technical-legal opinion with exact legal basis, probability of infringement and investigation recommendations.",
    generateDictum:"⚖️ Generate Legal Opinion", analyzing:"Analyzing", dictum:"LEGAL OPINION",
    legalBase:"LEGAL BASIS", recommendedAction:"RECOMMENDED ACTION",
    applicableSanctions:"APPLICABLE SANCTIONS", severity:"SEVERITY", probability:"PROBABILITY",
    period:"Period", schedule:"Schedule", currentPrice:"Current price",
    prevPrice:"Previous price", variation:"Variation", vsAverage:"vs Average",
    marketShare:"Market share", changes30:"Changes 30 days",
    priceAdjustments:"price adjustments", individualProfile:"Individual Profile",
    historicalPrice:"HISTORICAL PRICE EVOLUTION", competitiveScore:"COMPETITIVE SCORECARD",
    higherBetter:"Higher value = better relative performance", per:"per",
    prevPeriod:"previous period", marketDeviation:"market deviation", estimated:"estimated",
    regions:{"América Latina":"Latin America","Europa":"Europe","América del Norte":"North America","Asia":"Asia"},
    markets:{"Energía":"Energy","Telecomunicaciones":"Telecommunications","Alimentos":"Food","Seguros":"Insurance","Farmacéutico":"Pharmaceutical","Transporte":"Transport","Banca y Finanzas":"Banking & Finance"},
    patternTypes:{"FIJACIÓN DE PRECIOS":"PRICE FIXING","ALZA SIMULTÁNEA":"SIMULTANEOUS PRICE HIKE","PARALELISMO DE PRECIOS":"PRICE PARALLELISM","POSICIÓN DOMINANTE":"DOMINANT POSITION","PRECIOS PREDATORIOS":"PREDATORY PRICING","CONCENTRACIÓN":"MARKET CONCENTRATION"},
    patternDescs:{"FIJACIÓN DE PRECIOS":(v,n)=>`Dispersion of only ${v}% among ${n} competitors. Horizontal coordination highly probable.`,"ALZA SIMULTÁNEA":(v)=>`All actors increased prices ${v}% simultaneously. Possible signaling or tacit agreement.`,"PARALELISMO DE PRECIOS":(v)=>`Maximum difference between actors: ${v}%. Parallel behavior without apparent structural justification.`,"POSICIÓN DOMINANTE":(c,v)=>`${c} holds ${v}% of the market. Possible abuse if imposing disadvantageous conditions.`,"PRECIOS PREDATORIOS":(c,v)=>`${c} sells ${v}% below average. Possible strategy to exclude rivals.`,"CONCENTRACIÓN":(v)=>`Top 2 companies hold ${v}% of the market. Oligopolistic structure with high coordination risk.`},
    patternActions:{"FIJACIÓN DE PRECIOS":"Initiate formal investigation. Request information on communications between companies. Review industry association minutes.","ALZA SIMULTÁNEA":"Check if there were press releases, industry meetings or public statements prior to the price increase.","PARALELISMO DE PRECIOS":"Analyze whether uniformity stems from homogeneous costs, tariff regulation or legitimate market factors.","POSICIÓN DOMINANTE":"Investigate whether the company imposes excessive prices, conditions sales or discriminates without objective justification.","PRECIOS PREDATORIOS":"Request cost structure. Verify whether price at least covers average variable cost.","CONCENTRACIÓN":"Review acquisition history. Assess entry barriers. Monitor future integration operations."},
    sevLabels:{"CRÍTICA":"CRITICAL","ALTA":"HIGH","MEDIA":"MEDIUM"},
    riskLabels:{critical:"CRITICAL",high:"HIGH",medium:"MEDIUM",low:"LOW"},
    probLabels:{high80:"Very High (>80%)",high60:"High (60-80%)",med40:"Medium (40-60%)",med30:"Medium-High (50-70%)",med35:"Medium (35-55%)",med30b:"Medium (30-50%)",med30c:"Medium (30-45%)"},
    thresholds:["🔴 Price fixing — dispersion below 0.5%","🟠 Simultaneous hike — all actors raise prices over 10%","🟡 Price parallelism — dispersion between 0.5% and 2%","🔵 Dominant position — market share above 60%","⚡ Predatory pricing — price below 75% of average","🔶 High concentration — top 2 companies exceed 80%"],
    tableHeaders:["#","COMPANY","PRICE","PREVIOUS","VARIATION","vs AVERAGE","SHARE","COMPLAINTS"],
    prev:"Previous", current:"Current", devFromAvg:"Dev. from avg", complaints:"Complaints", selected:"selected",
    allCompaniesLabel:"All companies",
    products:{
      "Gasolina Regular":"Regular Gasoline","Gasolina Premium":"Premium Gasoline",
      "ACPM / Diésel":"Diesel Fuel","Gas Natural":"Natural Gas",
      "Energía Eléctrica":"Electric Power","Carbón":"Coal","Etanol":"Ethanol",
      "Gas Licuado (GLP)":"LPG Gas","Internet Hogar 100Mbps":"Home Internet 100Mbps",
      "Internet Hogar 300Mbps":"Home Internet 300Mbps","Internet Hogar 1Gbps":"Home Internet 1Gbps",
      "Telefonía Móvil Postpago":"Postpaid Mobile","Telefonía Móvil Prepago":"Prepaid Mobile",
      "TV por Suscripción":"Subscription TV","Telefonía Fija":"Landline Phone",
      "Roaming Internacional":"International Roaming","Pollo Entero":"Whole Chicken",
      "Carne de Res (kg)":"Beef (kg)","Aceite Vegetal 1L":"Vegetable Oil 1L",
      "Leche 1L":"Milk 1L","Arroz 1kg":"Rice 1kg","Pan Tajado":"Sliced Bread",
      "Huevos (docena)":"Eggs (dozen)","Azúcar 1kg":"Sugar 1kg",
      "Harina de Trigo 1kg":"Wheat Flour 1kg","Café Molido 500g":"Ground Coffee 500g",
      "Seguro Auto Básico":"Basic Auto Insurance","Seguro Auto Todo Riesgo":"Full Coverage Auto Insurance",
      "Seguro de Vida":"Life Insurance","SOAT / Seguro Obligatorio":"Mandatory Insurance",
      "Seguro de Hogar":"Home Insurance","Seguro de Salud":"Health Insurance",
      "Seguro Empresarial":"Business Insurance","Seguro de Viaje":"Travel Insurance",
      "Acetaminofén 500mg":"Acetaminophen 500mg","Ibuprofeno 400mg":"Ibuprofen 400mg",
      "Amoxicilina 500mg":"Amoxicillin 500mg","Omeprazol 20mg":"Omeprazole 20mg",
      "Metformina 850mg":"Metformin 850mg","Atorvastatina 20mg":"Atorvastatin 20mg",
      "Losartán 50mg":"Losartan 50mg","Vitamina C 1000mg":"Vitamin C 1000mg",
      "Taxi / Cabify km":"Taxi / Rideshare km","Servicio de Bus":"Bus Service",
      "Vuelo Doméstico":"Domestic Flight","Vuelo Internacional":"International Flight",
      "Peaje Autopista":"Highway Toll","Servicio de Metro":"Metro Service",
      "Transporte de Carga":"Freight Transport","Mensajería Express":"Express Delivery",
      "Cuenta de Ahorros":"Savings Account","Tarjeta de Crédito":"Credit Card",
      "Crédito de Consumo":"Consumer Loan","Crédito Hipotecario":"Mortgage Loan",
      "Comisión Transferencia":"Transfer Fee","CDT / Depósito a Plazo":"Time Deposit",
      "Seguro de Depósitos":"Deposit Insurance","Nómina Empresarial":"Corporate Payroll",
    },
    aiPrompt:(product,region,country,unit,data,analysis,lf)=>`You are an expert in competition law. Analyze the following market data under the legal framework of ${country}:\n\nJURISDICTION: ${country}\nAUTHORITY: ${lf.authority}\nLEGAL FRAMEWORK: ${lf.law}\nPRODUCT: ${product} | TERRITORY: ${region} | UNIT: ${unit}\n\nDATA:\n${data.map(d=>`- ${d.company}: ${d.price.toLocaleString()} (prev: ${d.prevPrice.toLocaleString()}, var: ${(((d.price-d.prevPrice)/d.prevPrice)*100).toFixed(1)}%, share: ${d.marketShare}%)`).join("\n")}\n\nSTATISTICS:\n- Dispersion: ${analysis.variancePct?.toFixed(2)}%\n- Variation: ${analysis.changePct?.toFixed(1)}%\n- Risk: ${analysis.risk?.level} (${analysis.risk?.score}/100)\n- Alerts: ${analysis.alerts?.map(a=>a.type).join(", ")||"None"}\n\nGenerate a complete technical-legal opinion with:\n1. ECONOMIC DIAGNOSIS of the market (2 paragraphs)\n2. IDENTIFIED PRACTICES with exact articles from ${lf.law}\n3. PROBABILITY OF INFRINGEMENT for each detected practice\n4. INVESTIGATION RECOMMENDATIONS prioritized for ${lf.authority}\n5. APPLICABLE SANCTIONS with specific amounts under ${lf.law}\n\nBe specific and technical. Use appropriate legal terminology.`,
  },
};

// ─── GEO ──────────────────────────────────────────────────────────────────────
const GEO = {
  "América Latina":{ flag:"🌎", countries:{
    "Colombia":{ flag:"🇨🇴", currency:"COP", regions:["Nacional","Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Cartagena","Pereira"] },
    "México":{ flag:"🇲🇽", currency:"MXN", regions:["Nacional","Ciudad de México","Guadalajara","Monterrey","Puebla","Tijuana","Mérida"] },
    "Brasil":{ flag:"🇧🇷", currency:"BRL", regions:["Nacional","São Paulo","Rio de Janeiro","Brasília","Salvador","Fortaleza","Manaus"] },
    "Argentina":{ flag:"🇦🇷", currency:"ARS", regions:["Nacional","Buenos Aires","Córdoba","Rosario","Mendoza","Tucumán","La Plata"] },
    "Chile":{ flag:"🇨🇱", currency:"CLP", regions:["Nacional","Santiago","Valparaíso","Concepción","Antofagasta","La Serena"] },
    "Perú":{ flag:"🇵🇪", currency:"PEN", regions:["Nacional","Lima","Arequipa","Trujillo","Chiclayo","Piura"] },
  }},
  "Europa":{ flag:"🌍", countries:{
    "España":{ flag:"🇪🇸", currency:"EUR", regions:["Nacional","Madrid","Barcelona","Valencia","Sevilla","Bilbao","Zaragoza"] },
    "Francia":{ flag:"🇫🇷", currency:"EUR", regions:["Nacional","París","Lyon","Marsella","Toulouse","Burdeos","Niza"] },
    "Alemania":{ flag:"🇩🇪", currency:"EUR", regions:["Nacional","Berlín","Múnich","Hamburgo","Fráncfort","Colonia","Stuttgart"] },
    "Italia":{ flag:"🇮🇹", currency:"EUR", regions:["Nacional","Roma","Milán","Nápoles","Turín","Palermo","Génova"] },
    "Reino Unido":{ flag:"🇬🇧", currency:"GBP", regions:["Nacional","Londres","Manchester","Birmingham","Glasgow","Liverpool"] },
  }},
  "América del Norte":{ flag:"🌎", countries:{
    "Estados Unidos":{ flag:"🇺🇸", currency:"USD", regions:["Nacional","Nueva York","Los Ángeles","Chicago","Houston","Miami","Dallas"] },
    "Canadá":{ flag:"🇨🇦", currency:"CAD", regions:["Nacional","Toronto","Montreal","Vancouver","Calgary","Ottawa","Edmonton"] },
  }},
  "Asia":{ flag:"🌏", countries:{
    "Japón":{ flag:"🇯🇵", currency:"JPY", regions:["Nacional","Tokio","Osaka","Kioto","Yokohama","Nagoya","Sapporo"] },
    "Corea del Sur":{ flag:"🇰🇷", currency:"KRW", regions:["Nacional","Seúl","Busan","Incheon","Daegu","Daejeon"] },
    "India":{ flag:"🇮🇳", currency:"INR", regions:["Nacional","Bombay","Delhi","Bangalore","Chennai","Hyderabad","Calcuta"] },
  }},
};

const LEGAL = {
  "Colombia":{ authority:"Superintendencia de Industria y Comercio (SIC)", law:"Decreto 2153/1992 y Ley 1340/2009", rules:{"FIJACIÓN DE PRECIOS":"Art. 47 núm. 1, Decreto 2153/1992","ALZA SIMULTÁNEA":"Art. 47 núm. 1-2, Decreto 2153/1992","PARALELISMO DE PRECIOS":"Art. 47 núm. 2, Decreto 2153/1992","POSICIÓN DOMINANTE":"Art. 50, Decreto 2153/1992","PRECIOS PREDATORIOS":"Art. 50 núm. 3, Decreto 2153/1992","CONCENTRACIÓN":"Ley 1340/2009 Art. 9"}, sanction:"Multas hasta 100.000 SMMLV o el 150% de la utilidad derivada." },
  "México":{ authority:"Comisión Federal de Competencia Económica (COFECE)", law:"Ley Federal de Competencia Económica (LFCE) 2014", rules:{"FIJACIÓN DE PRECIOS":"Art. 53 LFCE","ALZA SIMULTÁNEA":"Art. 53 LFCE","PARALELISMO DE PRECIOS":"Art. 56 LFCE","POSICIÓN DOMINANTE":"Art. 56 LFCE","PRECIOS PREDATORIOS":"Art. 56 fracc. VII LFCE","CONCENTRACIÓN":"Art. 61 LFCE"}, sanction:"Multas hasta el 10% de los ingresos anuales." },
  "Brasil":{ authority:"Conselho Administrativo de Defesa Econômica (CADE)", law:"Lei 12.529/2011", rules:{"FIJACIÓN DE PRECIOS":"Art. 36 §3º I","ALZA SIMULTÁNEA":"Art. 36 §3º","PARALELISMO DE PRECIOS":"Art. 36 II","POSICIÓN DOMINANTE":"Art. 36 §2º","PRECIOS PREDATORIOS":"Art. 36 §3º XV","CONCENTRACIÓN":"Art. 88"}, sanction:"Multa de 0,1% a 20% do faturamento bruto." },
  "Argentina":{ authority:"Comisión Nacional de Defensa de la Competencia (CNDC)", law:"Ley 27.442/2018", rules:{"FIJACIÓN DE PRECIOS":"Art. 2º a)","ALZA SIMULTÁNEA":"Art. 2º a)","PARALELISMO DE PRECIOS":"Art. 3º","POSICIÓN DOMINANTE":"Art. 3º","PRECIOS PREDATORIOS":"Art. 3º i)","CONCENTRACIÓN":"Art. 8º"}, sanction:"Multas de hasta el 30% de la facturación." },
  "Chile":{ authority:"Fiscalía Nacional Económica (FNE) y TDLC", law:"Decreto Ley 211/1973", rules:{"FIJACIÓN DE PRECIOS":"Art. 3º a) DL 211","ALZA SIMULTÁNEA":"Art. 3º a) DL 211","PARALELISMO DE PRECIOS":"Art. 3º DL 211","POSICIÓN DOMINANTE":"Art. 3º b) DL 211","PRECIOS PREDATORIOS":"Art. 3º b) DL 211","CONCENTRACIÓN":"Art. 48 DL 211"}, sanction:"Multas hasta 30.000 UTA (~USD 20M)." },
  "Perú":{ authority:"Instituto Nacional de Defensa de la Competencia (INDECOPI)", law:"Decreto Legislativo 1034/2008", rules:{"FIJACIÓN DE PRECIOS":"Art. 11.1 DL 1034","ALZA SIMULTÁNEA":"Art. 11.1 DL 1034","PARALELISMO DE PRECIOS":"Art. 11 DL 1034","POSICIÓN DOMINANTE":"Art. 10 DL 1034","PRECIOS PREDATORIOS":"Art. 10.2 e) DL 1034","CONCENTRACIÓN":"Ley 31112/2021"}, sanction:"Multas hasta 1.000 UIT o el 12% de ventas anuales." },
  "España":{ authority:"Comisión Nacional de Mercados y la Competencia (CNMC)", law:"Ley 15/2007 + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. 1 LDC / Art. 101 TFUE","ALZA SIMULTÁNEA":"Art. 1 LDC","PARALELISMO DE PRECIOS":"Art. 1 LDC","POSICIÓN DOMINANTE":"Art. 2 LDC / Art. 102 TFUE","PRECIOS PREDATORIOS":"Art. 2.2 b) LDC","CONCENTRACIÓN":"Art. 7 LDC"}, sanction:"Multas hasta el 10% del volumen de negocios mundial." },
  "Francia":{ authority:"Autorité de la Concurrence", law:"Code de commerce Art. L420-1 + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. L420-1","ALZA SIMULTÁNEA":"Art. L420-1","PARALELISMO DE PRECIOS":"Art. L420-1","POSICIÓN DOMINANTE":"Art. L420-2","PRECIOS PREDATORIOS":"Art. L420-5","CONCENTRACIÓN":"Art. L430-1"}, sanction:"Sanction jusqu'à 10% du chiffre d'affaires mondial." },
  "Alemania":{ authority:"Bundeskartellamt (BKartA)", law:"GWB + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"§1 GWB / Art. 101 TFUE","ALZA SIMULTÁNEA":"§1 GWB","PARALELISMO DE PRECIOS":"§1 GWB","POSICIÓN DOMINANTE":"§18-19 GWB","PRECIOS PREDATORIOS":"§19 GWB","CONCENTRACIÓN":"§35 GWB"}, sanction:"Geldbußen bis zu 10% des weltweiten Jahresumsatzes." },
  "Italia":{ authority:"Autorità Garante della Concorrenza e del Mercato (AGCM)", law:"Legge 287/1990 + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. 2 L.287/1990","ALZA SIMULTÁNEA":"Art. 2 L.287/1990","PARALELISMO DE PRECIOS":"Art. 2 L.287/1990","POSICIÓN DOMINANTE":"Art. 3 L.287/1990","PRECIOS PREDATORIOS":"Art. 3 L.287/1990","CONCENTRACIÓN":"Art. 16 L.287/1990"}, sanction:"Sanzioni fino al 10% del fatturato." },
  "Reino Unido":{ authority:"Competition and Markets Authority (CMA)", law:"Competition Act 1998 + Enterprise Act 2002", rules:{"FIJACIÓN DE PRECIOS":"Chapter I, CA 1998","ALZA SIMULTÁNEA":"Chapter I, CA 1998","PARALELISMO DE PRECIOS":"Chapter I, CA 1998","POSICIÓN DOMINANTE":"Chapter II, CA 1998","PRECIOS PREDATORIOS":"Chapter II, CA 1998","CONCENTRACIÓN":"Part 3, EA 2002"}, sanction:"Fines up to 10% of annual worldwide turnover." },
  "Estados Unidos":{ authority:"Federal Trade Commission (FTC) / DOJ", law:"Sherman Act (1890) + Clayton Act (1914)", rules:{"FIJACIÓN DE PRECIOS":"§1 Sherman Act","ALZA SIMULTÁNEA":"§1 Sherman Act","PARALELISMO DE PRECIOS":"§1 Sherman Act","POSICIÓN DOMINANTE":"§2 Sherman Act","PRECIOS PREDATORIOS":"§2 Sherman Act","CONCENTRACIÓN":"§7 Clayton Act"}, sanction:"Criminal fines up to $100M. Up to 10 years imprisonment." },
  "Canadá":{ authority:"Competition Bureau Canada", law:"Competition Act (R.S.C. 1985)", rules:{"FIJACIÓN DE PRECIOS":"§45 Competition Act","ALZA SIMULTÁNEA":"§45 Competition Act","PARALELISMO DE PRECIOS":"§90.1 Competition Act","POSICIÓN DOMINANTE":"§78-79 Competition Act","PRECIOS PREDATORIOS":"§78(1)(i) Competition Act","CONCENTRACIÓN":"§92 Competition Act"}, sanction:"Fines up to $25M. Up to 14 years imprisonment." },
  "Japón":{ authority:"Japan Fair Trade Commission (JFTC)", law:"Antimonopoly Act (1947)", rules:{"FIJACIÓN DE PRECIOS":"Art. 3 AMA","ALZA SIMULTÁNEA":"Art. 3 AMA","PARALELISMO DE PRECIOS":"Art. 3 AMA","POSICIÓN DOMINANTE":"Art. 2(5) AMA","PRECIOS PREDATORIOS":"Art. 2(9) AMA","CONCENTRACIÓN":"Art. 10-16 AMA"}, sanction:"Surcharges up to 10% of sales." },
  "Corea del Sur":{ authority:"Korea Fair Trade Commission (KFTC)", law:"Monopoly Regulation and Fair Trade Act (MRFTA)", rules:{"FIJACIÓN DE PRECIOS":"Art. 40 MRFTA","ALZA SIMULTÁNEA":"Art. 40 MRFTA","PARALELISMO DE PRECIOS":"Art. 40 MRFTA","POSICIÓN DOMINANTE":"Art. 5 MRFTA","PRECIOS PREDATORIOS":"Art. 5(1)(iii) MRFTA","CONCENTRACIÓN":"Art. 11 MRFTA"}, sanction:"Surcharges up to 20% of related sales." },
  "India":{ authority:"Competition Commission of India (CCI)", law:"Competition Act 2002 (amended 2023)", rules:{"FIJACIÓN DE PRECIOS":"§3(3)(a)","ALZA SIMULTÁNEA":"§3(3)","PARALELISMO DE PRECIOS":"§3(3)","POSICIÓN DOMINANTE":"§4","PRECIOS PREDATORIOS":"§4(2)(a)(ii)","CONCENTRACIÓN":"§5-6"}, sanction:"Penalty up to 10% of average turnover for 3 years." },
};

const MARKETS = {
  "Energía":{
    products:["Gasolina Regular","Gasolina Premium","ACPM / Diésel","Gas Natural","Energía Eléctrica","Carbón","Etanol","Gas Licuado (GLP)"],
    companiesByCountry:{
      "Colombia":{"Gasolina Regular":["Terpel","Biomax","Texaco","Primax","Zeuss"],"Gasolina Premium":["Terpel","Biomax","Texaco","Primax"],"ACPM / Diésel":["Terpel","Biomax","Texaco","EDS Uno"],"Gas Natural":["Gas Natural","Surtigas","Gases de Occidente"],"Energía Eléctrica":["EPM","Codensa","Celsia","Emcali","CHEC"],"Carbón":["Drummond","Cerrejón","Prodeco","CNR"],"Etanol":["Incauca","Manuelita","Providencia","Mayagüez"],"Gas Licuado (GLP)":["Terpel GLP","Biomax GLP","Zeta Gas","Surtigas"]},
      "México":{"Gasolina Regular":["PEMEX","BP México","Shell México","Total México"],"Gasolina Premium":["PEMEX","BP México","Shell México"],"ACPM / Diésel":["PEMEX","BP México","Repsol México"],"Gas Natural":["Gas Natural Fenosa","Naturgy México","Sempra"],"Energía Eléctrica":["CFE","Iberdrola México","EDF México","Total Energies"],"Carbón":["Minera Carbonífera Río Escondido","Altos Hornos de México"],"Etanol":["DICONSA","Beta San Miguel","Zucarmex"],"Gas Licuado (GLP)":["Zeta Gas","Gas Express","Tomza","Repsol GLP"]},
      "Brasil":{"Gasolina Regular":["Petrobras","Shell Brasil","BP Castrol","Ipiranga"],"Gasolina Premium":["Petrobras","Shell Brasil","Ipiranga"],"ACPM / Diésel":["Petrobras","Shell Brasil","Raízen"],"Gas Natural":["Comgás","CEG","BR Distribuidora"],"Energía Eléctrica":["Eletrobras","Cemig","Copel","CPFL","Enel Brasil"],"Carbón":["Vale","CSN","Gerdau"],"Etanol":["Raízen","São Martinho","Biosev","Usaçúcar"],"Gas Licuado (GLP)":["Petrobras GLP","Liquigás","SHV Gas","Supergasbrás"]},
      "Argentina":{"Gasolina Regular":["YPF","Shell Argentina","Axion Energy","Puma Energy"],"Gasolina Premium":["YPF","Shell Argentina","Axion Energy"],"ACPM / Diésel":["YPF","Shell Argentina","Axion Energy"],"Gas Natural":["Metrogas","Camuzzi Gas","Litoral Gas"],"Energía Eléctrica":["Edenor","Edesur","Endesa Argentina","AES Argentina"],"Carbón":["YPF","Pan American Energy"],"Etanol":["Bio4","Promaíz","ACA Bio"],"Gas Licuado (GLP)":["YPF GLP","Shell GLP","Repsol GLP","Total GLP"]},
      "Chile":{"Gasolina Regular":["COPEC","Shell Chile","Petrobras Chile","Terpel Chile"],"Gasolina Premium":["COPEC","Shell Chile","Petrobras Chile"],"ACPM / Diésel":["COPEC","Shell Chile","Enex"],"Gas Natural":["GasValpo","Metrogas","GasSur"],"Energía Eléctrica":["Enel Chile","Colbún","AES Gener","CGE"],"Carbón":["COPEC","Engie Chile"],"Etanol":["ENAP","COPEC"],"Gas Licuado (GLP)":["ABASTIBLE","GASCO","Lipigas","Copec GLP"]},
      "Perú":{"Gasolina Regular":["Petroperú","Repsol Perú","PECSA","Primax Perú"],"Gasolina Premium":["Petroperú","Repsol Perú","PECSA"],"ACPM / Diésel":["Petroperú","Repsol Perú","Primax Perú"],"Gas Natural":["Cálidda","Contugas","Quavii"],"Energía Eléctrica":["Enel Perú","Luz del Sur","Edelnor","Enosa"],"Carbón":["Southern Perú","Glencore Perú"],"Etanol":["Maple Etanol","Caña Brava"],"Gas Licuado (GLP)":["Repsol GLP","ZETA GAS","Lima Gas","Llamagas"]},
      "Francia":{"Gasolina Regular":["Total Energies","BP Francia","Shell Francia","Esso Francia"],"Gasolina Premium":["Total Energies","BP Francia","Shell Francia"],"ACPM / Diésel":["Total Energies","BP Francia","Esso Francia"],"Gas Natural":["Engie","Total Energies","EDF","Eni Francia"],"Energía Eléctrica":["EDF","Engie","Total Energies","Vattenfall"],"Carbón":["EDF","Engie"],"Etanol":["Cristanol","Tereos","Lillebonne"],"Gas Licuado (GLP)":["Butagaz","Totalgaz","Antargaz","Primagaz"]},
      "Alemania":{"Gasolina Regular":["Aral","Shell Alemania","Esso Alemania","Total Alemania"],"Gasolina Premium":["Aral","Shell Alemania","Esso Alemania"],"ACPM / Diésel":["Aral","Shell Alemania","Total Alemania"],"Gas Natural":["E.ON","RWE","EnBW","Vattenfall"],"Energía Eléctrica":["E.ON","RWE","EnBW","Vattenfall","Innogy"],"Carbón":["RWE","Leag","Mibrag"],"Etanol":["Südzucker","CropEnergies","Verbio"],"Gas Licuado (GLP)":["Primagas","Progas","Flaga","Shell Gas"]},
      "Italia":{"Gasolina Regular":["ENI","Q8","IP","TotalEnergies Italia"],"Gasolina Premium":["ENI","Q8","IP"],"ACPM / Diésel":["ENI","Q8","TotalEnergies Italia"],"Gas Natural":["ENI Gas","Edison","A2A","Enel Gas"],"Energía Eléctrica":["Enel Italia","A2A","Iren","Edison"],"Carbón":["Enel Italia","A2A"],"Etanol":["Novaol","Ital-Bi-Oil"],"Gas Licuado (GLP)":["ENI GPL","Liquigas Italia","Supergasitalia","Butangas"]},
      "Reino Unido":{"Gasolina Regular":["BP UK","Shell UK","Esso UK","Texaco UK"],"Gasolina Premium":["BP UK","Shell UK","Esso UK"],"ACPM / Diésel":["BP UK","Shell UK","Texaco UK"],"Gas Natural":["British Gas","EDF UK","E.ON UK","SSE"],"Energía Eléctrica":["British Gas","EDF UK","E.ON UK","SSE","Octopus"],"Carbón":["UK Coal","RWE UK"],"Etanol":["Vivergo","Ensus","ABF"],"Gas Licuado (GLP)":["Calor Gas","Flogas","AvantiGas","Primagas UK"]},
      "Canadá":{"Gasolina Regular":["Petro-Canada","Esso Canadá","Shell Canadá","Husky"],"Gasolina Premium":["Petro-Canada","Esso Canadá","Shell Canadá"],"ACPM / Diésel":["Petro-Canada","Esso Canadá","Husky"],"Gas Natural":["Enbridge","TC Energy","ATCO Gas","FortisBC"],"Energía Eléctrica":["Hydro-Québec","BC Hydro","Ontario Power","ATCO Electric"],"Carbón":["Teck Resources","Fording Coal"],"Etanol":["GreenField Ethanol","Husky Energy","The Sask Wheat Pool"],"Gas Licuado (GLP)":["Superior Plus","Parkland","McLeod Propane"]},
      "Japón":{"Gasolina Regular":["ENEOS","Idemitsu","Cosmo Oil","Showa Shell"],"Gasolina Premium":["ENEOS","Idemitsu","Cosmo Oil"],"ACPM / Diésel":["ENEOS","Idemitsu","Cosmo Oil"],"Gas Natural":["Tokyo Gas","Osaka Gas","Toho Gas","Saibu Gas"],"Energía Eléctrica":["TEPCO","Kansai Electric","Chubu Electric","Kyushu Electric"],"Carbón":["Mitsubishi","Mitsui","Marubeni"],"Etanol":["Japan Alcohol Trading","Daicel"],"Gas Licuado (GLP)":["Iwatani","Nippon Gas","Showa Shell LPG","ENEOS LPG"]},
      "Corea del Sur":{"Gasolina Regular":["SK Energy","GS Caltex","S-Oil","Hyundai Oilbank"],"Gasolina Premium":["SK Energy","GS Caltex","S-Oil"],"ACPM / Diésel":["SK Energy","GS Caltex","S-Oil"],"Gas Natural":["KOGAS","SK E&S","GS Energy","Posco Energy"],"Energía Eléctrica":["KEPCO","Korea Western Power","Korea South Power","Korea Midland Power"],"Carbón":["KEPCO","Posco","Korea Coal"],"Etanol":["CJ BIO","Lotte Chemical"],"Gas Licuado (GLP)":["SK Gas","E1","S-Oil LPG","Elim LPG"]},
      "India":{"Gasolina Regular":["Indian Oil","Bharat Petroleum","Hindustan Petroleum","Reliance"],"Gasolina Premium":["Indian Oil","Bharat Petroleum","Hindustan Petroleum"],"ACPM / Diésel":["Indian Oil","Bharat Petroleum","Hindustan Petroleum"],"Gas Natural":["GAIL","Indraprastha Gas","Mahanagar Gas","Gujarat Gas"],"Energía Eléctrica":["NTPC","Power Grid","Adani Power","Tata Power"],"Carbón":["Coal India","SCCL","Adani Enterprises"],"Etanol":["Indian Oil","Bharat Petroleum","Manaksia"],"Gas Licuado (GLP)":["Indian Oil LPG","Bharat Gas","HP Gas","Reliance Gas"]},
      "España":{"Gasolina Regular":["Repsol","Cepsa","BP España","Galp"],"Gasolina Premium":["Repsol","Cepsa","BP España"],"ACPM / Diésel":["Repsol","Cepsa","Total España"],"Gas Natural":["Naturgy","Endesa Gas","Iberdrola Gas"],"Energía Eléctrica":["Endesa","Iberdrola","Naturgy","EDP España","Acciona"],"Carbón":["Endesa Generación","Naturgy Carbón"],"Etanol":["Abengoa","Ebro Foods","Ence"],"Gas Licuado (GLP)":["Repsol Butano","Cepsa GLP","Primagas","Disa"]},
      "Estados Unidos":{"Gasolina Regular":["ExxonMobil","Shell USA","Chevron","BP America"],"Gasolina Premium":["ExxonMobil","Shell USA","Chevron"],"ACPM / Diésel":["ExxonMobil","Shell USA","Valero"],"Gas Natural":["Dominion Energy","Con Edison","Sempra"],"Energía Eléctrica":["Duke Energy","NextEra","Southern Company","Exelon","AES"],"Carbón":["Arch Resources","CONSOL Energy","Alpha Natural"],"Etanol":["POET","ADM","Green Plains","Valero Renewables"],"Gas Licuado (GLP)":["AmeriGas","Ferrellgas","Suburban Propane","NGL Energy"]},
      "default":{"Gasolina Regular":["Company A","Company B","Company C","Company D"],"Gasolina Premium":["Company A","Company B","Company C"],"ACPM / Diésel":["Company A","Company B","Company C"],"Gas Natural":["Company A","Company B","Company C"],"Energía Eléctrica":["Utility A","Utility B","Utility C"],"Carbón":["Mining A","Mining B","Mining C"],"Etanol":["Ethanol A","Ethanol B","Ethanol C"],"Gas Licuado (GLP)":["GLP A","GLP B","GLP C"]},
    }
  },
  "Telecomunicaciones":{
    products:["Internet Hogar 100Mbps","Internet Hogar 300Mbps","Internet Hogar 1Gbps","Telefonía Móvil Postpago","Telefonía Móvil Prepago","TV por Suscripción","Telefonía Fija","Roaming Internacional"],
    companiesByCountry:{
      "Colombia":{"Internet Hogar 100Mbps":["Claro","Movistar","ETB","Tigo","Une"],"Internet Hogar 300Mbps":["Claro","Movistar","Tigo","Une"],"Internet Hogar 1Gbps":["Claro","ETB","Tigo","Une"],"Telefonía Móvil Postpago":["Claro","Movistar","Tigo","WOM"],"Telefonía Móvil Prepago":["Claro","Movistar","Tigo","WOM","Virgin"],"TV por Suscripción":["Claro","Movistar","DirecTV","Tigo"],"Telefonía Fija":["ETB","Claro","Movistar","Tigo"],"Roaming Internacional":["Claro","Movistar","Tigo","WOM"]},
      "México":{"Internet Hogar 100Mbps":["Telmex","Izzi","Totalplay","Megacable"],"Internet Hogar 300Mbps":["Telmex","Izzi","Totalplay","Megacable"],"Internet Hogar 1Gbps":["Telmex","Totalplay","Izzi"],"Telefonía Móvil Postpago":["Telcel","AT&T México","Movistar México"],"Telefonía Móvil Prepago":["Telcel","AT&T México","Movistar México","Oui"],"TV por Suscripción":["Izzi","Totalplay","Sky México","Megacable"],"Telefonía Fija":["Telmex","Izzi","Megacable"],"Roaming Internacional":["Telcel","AT&T México","Movistar México"]},
      "Brasil":{"Internet Hogar 100Mbps":["Claro Brasil","Vivo","NET","Oi"],"Internet Hogar 300Mbps":["Claro Brasil","Vivo","TIM","Oi"],"Internet Hogar 1Gbps":["Claro Brasil","Vivo","NET"],"Telefonía Móvil Postpago":["Vivo","Claro Brasil","TIM","Oi"],"Telefonía Móvil Prepago":["Vivo","Claro Brasil","TIM","Oi"],"TV por Suscripción":["Sky Brasil","Claro TV","Vivo TV","NET"],"Telefonía Fija":["Oi","Claro Brasil","Vivo","TIM"],"Roaming Internacional":["Vivo","Claro Brasil","TIM","Oi"]},
      "Argentina":{"Internet Hogar 100Mbps":["Telecom","Fibertel","Personal","Movistar Argentina"],"Internet Hogar 300Mbps":["Telecom","Fibertel","Personal"],"Internet Hogar 1Gbps":["Telecom","Fibertel","Claro Argentina"],"Telefonía Móvil Postpago":["Claro Argentina","Personal","Movistar Argentina"],"Telefonía Móvil Prepago":["Claro Argentina","Personal","Movistar Argentina","Tuenti"],"TV por Suscripción":["DirecTV Argentina","Cablevisión","Telecentro","Flow"],"Telefonía Fija":["Telecom","Movistar Argentina","Claro Argentina"],"Roaming Internacional":["Claro Argentina","Personal","Movistar Argentina"]},
      "Chile":{"Internet Hogar 100Mbps":["Entel","Movistar Chile","WOM Chile","VTR"],"Internet Hogar 300Mbps":["Entel","Movistar Chile","VTR"],"Internet Hogar 1Gbps":["Entel","Movistar Chile","VTR","GTD"],"Telefonía Móvil Postpago":["Entel","Movistar Chile","Claro Chile","WOM Chile"],"Telefonía Móvil Prepago":["Entel","Movistar Chile","WOM Chile","Virgin Mobile"],"TV por Suscripción":["DirecTV Chile","VTR","Entel","Movistar Chile"],"Telefonía Fija":["Entel","Movistar Chile","VTR","GTD"],"Roaming Internacional":["Entel","Movistar Chile","Claro Chile","WOM Chile"]},
      "Perú":{"Internet Hogar 100Mbps":["Movistar Perú","Claro Perú","Entel Perú","Bitel"],"Internet Hogar 300Mbps":["Movistar Perú","Claro Perú","Entel Perú"],"Internet Hogar 1Gbps":["Movistar Perú","Claro Perú"],"Telefonía Móvil Postpago":["Movistar Perú","Claro Perú","Entel Perú","Bitel"],"Telefonía Móvil Prepago":["Movistar Perú","Claro Perú","Entel Perú","Bitel"],"TV por Suscripción":["DirecTV Perú","Movistar TV","Claro TV","Best Cable"],"Telefonía Fija":["Movistar Perú","Claro Perú","Entel Perú"],"Roaming Internacional":["Movistar Perú","Claro Perú","Entel Perú","Bitel"]},
      "España":{"Internet Hogar 100Mbps":["Movistar España","Orange España","Vodafone España","MásMóvil"],"Internet Hogar 300Mbps":["Movistar España","Orange España","Vodafone España"],"Internet Hogar 1Gbps":["Movistar España","Orange España","Digi"],"Telefonía Móvil Postpago":["Movistar España","Orange España","Vodafone España","Yoigo"],"Telefonía Móvil Prepago":["Movistar España","Orange España","Digi","Lebara"],"TV por Suscripción":["Movistar+","Orange TV","Vodafone TV","DAZN"],"Telefonía Fija":["Movistar España","Orange España","Vodafone España"],"Roaming Internacional":["Movistar España","Orange España","Vodafone España","Yoigo"]},
      "Francia":{"Internet Hogar 100Mbps":["Orange Francia","SFR","Bouygues","Free"],"Internet Hogar 300Mbps":["Orange Francia","SFR","Bouygues","Free"],"Internet Hogar 1Gbps":["Orange Francia","SFR","Free","Bouygues"],"Telefonía Móvil Postpago":["Orange Francia","SFR","Bouygues","Free Mobile"],"Telefonía Móvil Prepago":["Orange Francia","SFR","Free Mobile","La Poste Mobile"],"TV por Suscripción":["Canal+","SFR TV","Orange TV","Free TV"],"Telefonía Fija":["Orange Francia","SFR","Bouygues","Free"],"Roaming Internacional":["Orange Francia","SFR","Bouygues","Free Mobile"]},
      "Alemania":{"Internet Hogar 100Mbps":["Deutsche Telekom","Vodafone Alemania","O2 Alemania","1&1"],"Internet Hogar 300Mbps":["Deutsche Telekom","Vodafone Alemania","O2 Alemania"],"Internet Hogar 1Gbps":["Deutsche Telekom","Vodafone Alemania","1&1"],"Telefonía Móvil Postpago":["Deutsche Telekom","Vodafone Alemania","O2 Alemania","1&1"],"Telefonía Móvil Prepago":["Deutsche Telekom","O2 Alemania","Aldi Talk","Lidl Connect"],"TV por Suscripción":["Sky Alemania","MagentaTV","Vodafone TV","Amazon Prime"],"Telefonía Fija":["Deutsche Telekom","Vodafone Alemania","O2 Alemania","1&1"],"Roaming Internacional":["Deutsche Telekom","Vodafone Alemania","O2 Alemania"]},
      "Italia":{"Internet Hogar 100Mbps":["TIM","Vodafone Italia","Wind Tre","Fastweb"],"Internet Hogar 300Mbps":["TIM","Vodafone Italia","Wind Tre","Fastweb"],"Internet Hogar 1Gbps":["TIM","Fastweb","Wind Tre"],"Telefonía Móvil Postpago":["TIM","Vodafone Italia","Wind Tre","Iliad"],"Telefonía Móvil Prepago":["TIM","Vodafone Italia","Wind Tre","Iliad"],"TV por Suscripción":["Sky Italia","TIM TV","Mediaset","DAZN Italia"],"Telefonía Fija":["TIM","Vodafone Italia","Wind Tre","Fastweb"],"Roaming Internacional":["TIM","Vodafone Italia","Wind Tre","Iliad"]},
      "Reino Unido":{"Internet Hogar 100Mbps":["BT","Virgin Media","Sky UK","TalkTalk"],"Internet Hogar 300Mbps":["BT","Virgin Media","Sky UK","Hyperoptic"],"Internet Hogar 1Gbps":["BT","Virgin Media","Hyperoptic","Gigaclear"],"Telefonía Móvil Postpago":["EE","O2 UK","Vodafone UK","Three UK"],"Telefonía Móvil Prepago":["EE","O2 UK","Vodafone UK","giffgaff"],"TV por Suscripción":["Sky UK","BT Sport","Virgin Media TV","NOW TV"],"Telefonía Fija":["BT","Virgin Media","Sky UK","TalkTalk"],"Roaming Internacional":["EE","O2 UK","Vodafone UK","Three UK"]},
      "Estados Unidos":{"Internet Hogar 100Mbps":["Comcast Xfinity","AT&T","Verizon","Charter Spectrum"],"Internet Hogar 300Mbps":["Comcast Xfinity","AT&T","Verizon","Charter Spectrum"],"Internet Hogar 1Gbps":["Comcast Xfinity","AT&T Fiber","Verizon Fios","Google Fiber"],"Telefonía Móvil Postpago":["Verizon","AT&T","T-Mobile","Dish"],"Telefonía Móvil Prepago":["T-Mobile","Cricket","Metro","Boost"],"TV por Suscripción":["Comcast","DirecTV USA","Dish Network","YouTube TV"],"Telefonía Fija":["AT&T","Verizon","Lumen","Frontier"],"Roaming Internacional":["Verizon","AT&T","T-Mobile","US Cellular"]},
      "Canadá":{"Internet Hogar 100Mbps":["Bell Canadá","Rogers","Telus","Shaw"],"Internet Hogar 300Mbps":["Bell Canadá","Rogers","Telus","Shaw"],"Internet Hogar 1Gbps":["Bell Canadá","Rogers","Telus"],"Telefonía Móvil Postpago":["Bell Canadá","Rogers","Telus","Freedom"],"Telefonía Móvil Prepago":["Bell Canadá","Rogers","Telus","Chatr"],"TV por Suscripción":["Bell Canadá","Rogers","Shaw","Cogeco"],"Telefonía Fija":["Bell Canadá","Rogers","Telus","Videotron"],"Roaming Internacional":["Bell Canadá","Rogers","Telus","Freedom"]},
      "Japón":{"Internet Hogar 100Mbps":["NTT Docomo","SoftBank","KDDI","Rakuten"],"Internet Hogar 300Mbps":["NTT Docomo","SoftBank","KDDI"],"Internet Hogar 1Gbps":["NTT Docomo","SoftBank","KDDI","Rakuten"],"Telefonía Móvil Postpago":["NTT Docomo","SoftBank","KDDI","Rakuten"],"Telefonía Móvil Prepago":["NTT Docomo","SoftBank","KDDI","IIJmio"],"TV por Suscripción":["SoftBank TV","KDDI","NTT","Rakuten TV"],"Telefonía Fija":["NTT Docomo","SoftBank","KDDI","Optage"],"Roaming Internacional":["NTT Docomo","SoftBank","KDDI","Rakuten"]},
      "Corea del Sur":{"Internet Hogar 100Mbps":["KT","SKT","LG U+","SK Broadband"],"Internet Hogar 300Mbps":["KT","SKT","LG U+","SK Broadband"],"Internet Hogar 1Gbps":["KT","SKT","LG U+"],"Telefonía Móvil Postpago":["KT","SKT","LG U+"],"Telefonía Móvil Prepago":["KT","SKT","LG U+","CJ Hellovision"],"TV por Suscripción":["SKT","KT","LG U+","CJ ENM"],"Telefonía Fija":["KT","SKT","LG U+"],"Roaming Internacional":["KT","SKT","LG U+"]},
      "India":{"Internet Hogar 100Mbps":["Jio","Airtel","BSNL","ACT Fibernet"],"Internet Hogar 300Mbps":["Jio","Airtel","ACT Fibernet"],"Internet Hogar 1Gbps":["Jio","Airtel","ACT Fibernet"],"Telefonía Móvil Postpago":["Jio","Airtel","Vi","BSNL"],"Telefonía Móvil Prepago":["Jio","Airtel","Vi","BSNL"],"TV por Suscripción":["Tata Sky","Airtel Digital TV","Dish TV","Sun Direct"],"Telefonía Fija":["BSNL","MTNL","Airtel","Jio"],"Roaming Internacional":["Jio","Airtel","Vi","BSNL"]},
      "default":{"Internet Hogar 100Mbps":["Operator A","Operator B","Operator C","Operator D"],"Internet Hogar 300Mbps":["Operator A","Operator B","Operator C"],"Internet Hogar 1Gbps":["Operator A","Operator B","Operator C"],"Telefonía Móvil Postpago":["Operator A","Operator B","Operator C"],"Telefonía Móvil Prepago":["Operator A","Operator B","Operator C"],"TV por Suscripción":["Operator A","Operator B","Operator C"],"Telefonía Fija":["Operator A","Operator B","Operator C"],"Roaming Internacional":["Operator A","Operator B","Operator C"]},
    }
  },
  "Alimentos":{
    products:["Pollo Entero","Carne de Res (kg)","Aceite Vegetal 1L","Leche 1L","Arroz 1kg","Pan Tajado","Huevos (docena)","Azúcar 1kg","Harina de Trigo 1kg","Café Molido 500g"],
    companiesByCountry:{
      "Colombia":{"Pollo Entero":["Éxito","Jumbo","Carulla","D1","Ara"],"Carne de Res (kg)":["Éxito","Jumbo","Carulla","La Cabaña","Pricesmart"],"Aceite Vegetal 1L":["Éxito","Jumbo","D1","Ara"],"Leche 1L":["Éxito","Jumbo","D1","Olímpica"],"Arroz 1kg":["Éxito","Jumbo","D1","La 14"],"Pan Tajado":["Éxito","Jumbo","D1","Ara","Olímpica"],"Huevos (docena)":["Éxito","Jumbo","D1","Ara","Colanta"],"Azúcar 1kg":["Éxito","Jumbo","D1","Ara","Olímpica"],"Harina de Trigo 1kg":["Éxito","Jumbo","D1","Ara"],"Café Molido 500g":["Éxito","Jumbo","Carulla","D1","Juan Valdez"]},
      "México":{"Pollo Entero":["Walmart México","Soriana","Chedraui","La Comer"],"Carne de Res (kg)":["Walmart México","Soriana","Chedraui","Costco México"],"Aceite Vegetal 1L":["Walmart México","Soriana","Chedraui"],"Leche 1L":["Walmart México","Soriana","Oxxo"],"Arroz 1kg":["Walmart México","Soriana","Chedraui"],"Pan Tajado":["Walmart México","Soriana","Bimbo","Oxxo"],"Huevos (docena)":["Walmart México","Soriana","Chedraui","La Comer"],"Azúcar 1kg":["Walmart México","Soriana","Chedraui"],"Harina de Trigo 1kg":["Walmart México","Soriana","Maseca"],"Café Molido 500g":["Walmart México","Soriana","Oxxo","Sanborns"]},
      "España":{"Pollo Entero":["Mercadona","Carrefour España","Lidl España","Eroski"],"Carne de Res (kg)":["Mercadona","Carrefour España","Alcampo","El Corte Inglés"],"Aceite Vegetal 1L":["Mercadona","Carrefour España","Lidl España"],"Leche 1L":["Mercadona","Carrefour España","Dia"],"Arroz 1kg":["Mercadona","Carrefour España","Lidl España"],"Pan Tajado":["Mercadona","Carrefour España","Dia","Lidl España"],"Huevos (docena)":["Mercadona","Carrefour España","Lidl España","Dia"],"Azúcar 1kg":["Mercadona","Carrefour España","Lidl España"],"Harina de Trigo 1kg":["Mercadona","Carrefour España","Dia"],"Café Molido 500g":["Mercadona","Carrefour España","El Corte Inglés","Lidl España"]},
      "Estados Unidos":{"Pollo Entero":["Walmart USA","Kroger","Costco","Target"],"Carne de Res (kg)":["Walmart USA","Kroger","Costco","Whole Foods"],"Aceite Vegetal 1L":["Walmart USA","Kroger","Whole Foods"],"Leche 1L":["Walmart USA","Kroger","Aldi USA"],"Arroz 1kg":["Walmart USA","Kroger","Costco"],"Pan Tajado":["Walmart USA","Kroger","Target","Aldi USA"],"Huevos (docena)":["Walmart USA","Kroger","Costco","Target"],"Azúcar 1kg":["Walmart USA","Kroger","Costco","Aldi USA"],"Harina de Trigo 1kg":["Walmart USA","Kroger","Costco"],"Café Molido 500g":["Walmart USA","Kroger","Costco","Whole Foods"]},
      "default":{"Pollo Entero":["Chain A","Chain B","Chain C","Chain D"],"Carne de Res (kg)":["Chain A","Chain B","Chain C"],"Aceite Vegetal 1L":["Chain A","Chain B","Chain C"],"Leche 1L":["Chain A","Chain B","Chain C"],"Arroz 1kg":["Chain A","Chain B","Chain C"],"Pan Tajado":["Chain A","Chain B","Chain C"],"Huevos (docena)":["Chain A","Chain B","Chain C"],"Azúcar 1kg":["Chain A","Chain B","Chain C"],"Harina de Trigo 1kg":["Chain A","Chain B","Chain C"],"Café Molido 500g":["Chain A","Chain B","Chain C"]},
    }
  },
  "Seguros":{
    products:["Seguro Auto Básico","Seguro Auto Todo Riesgo","Seguro de Vida","SOAT / Seguro Obligatorio","Seguro de Hogar","Seguro de Salud","Seguro Empresarial","Seguro de Viaje"],
    companiesByCountry:{
      "Colombia":{"Seguro Auto Básico":["Sura","Bolívar","Allianz","Mapfre","Axa"],"Seguro Auto Todo Riesgo":["Sura","Bolívar","Allianz","Mapfre"],"Seguro de Vida":["Sura","Bolívar","MetLife","Suramericana"],"SOAT / Seguro Obligatorio":["Sura","Bolívar","Allianz","Mapfre","Axa"],"Seguro de Hogar":["Sura","Bolívar","Allianz","Liberty"],"Seguro de Salud":["Sura","Colsanitas","Compensar","Coomeva"],"Seguro Empresarial":["Sura","Bolívar","Allianz","AIG Colombia"],"Seguro de Viaje":["Sura","Assist Card","Allianz Travel","AXA Assistance"]},
      "España":{"Seguro Auto Básico":["Mapfre España","Allianz España","AXA España","Generali España"],"Seguro Auto Todo Riesgo":["Mapfre España","Allianz España","AXA España","Mutua Madrileña"],"Seguro de Vida":["Mapfre España","AXA España","Catalana Occidente","Caser"],"SOAT / Seguro Obligatorio":["Mapfre España","Allianz España","AXA España","Zurich"],"Seguro de Hogar":["Mapfre España","AXA España","Mutua Madrileña","Generali España"],"Seguro de Salud":["Sanitas","Adeslas","Asisa","DKV"],"Seguro Empresarial":["Mapfre España","AXA España","Zurich","Allianz España"],"Seguro de Viaje":["Mapfre España","AXA Assistance","Intermundial","Coverontrip"]},
      "Estados Unidos":{"Seguro Auto Básico":["State Farm","Geico","Progressive","Allstate"],"Seguro Auto Todo Riesgo":["State Farm","Geico","Progressive","USAA"],"Seguro de Vida":["MetLife USA","Prudential","New York Life","Northwestern Mutual"],"SOAT / Seguro Obligatorio":["State Farm","Geico","Progressive","Liberty Mutual"],"Seguro de Hogar":["State Farm","Allstate","USAA","Liberty Mutual"],"Seguro de Salud":["UnitedHealth","Anthem","Aetna","Cigna"],"Seguro Empresarial":["Chubb","AIG USA","Hartford","Travelers"],"Seguro de Viaje":["Allianz Travel","Travel Guard","World Nomads","AXA Travel"]},
      "default":{"Seguro Auto Básico":["Insurer A","Insurer B","Insurer C"],"Seguro Auto Todo Riesgo":["Insurer A","Insurer B","Insurer C"],"Seguro de Vida":["Insurer A","Insurer B","Insurer C"],"SOAT / Seguro Obligatorio":["Insurer A","Insurer B","Insurer C"],"Seguro de Hogar":["Insurer A","Insurer B","Insurer C"],"Seguro de Salud":["Insurer A","Insurer B","Insurer C"],"Seguro Empresarial":["Insurer A","Insurer B","Insurer C"],"Seguro de Viaje":["Insurer A","Insurer B","Insurer C"]},
    }
  },
  "Farmacéutico":{
    products:["Acetaminofén 500mg","Ibuprofeno 400mg","Amoxicilina 500mg","Omeprazol 20mg","Metformina 850mg","Atorvastatina 20mg","Losartán 50mg","Vitamina C 1000mg"],
    companiesByCountry:{
      "Colombia":{"Acetaminofén 500mg":["Colfarma","Tecnoquímicas","Lafrancol","Procaps","Bayer Colombia"],"Ibuprofeno 400mg":["Tecnoquímicas","Lafrancol","Pfizer Colombia","Abbott Colombia"],"Amoxicilina 500mg":["Lafrancol","Tecnoquímicas","GlaxoSmithKline","Colfarma"],"Omeprazol 20mg":["Tecnoquímicas","Lafrancol","AstraZeneca","Colfarma"],"Metformina 850mg":["Tecnoquímicas","Lafrancol","Sanofi Colombia","Novartis"],"Atorvastatina 20mg":["Pfizer Colombia","Tecnoquímicas","Lafrancol","MSD Colombia"],"Losartán 50mg":["MSD Colombia","Tecnoquímicas","Lafrancol","Novartis"],"Vitamina C 1000mg":["Procaps","Bayer Colombia","Lafrancol","Tecnoquímicas"]},
      "default":{"Acetaminofén 500mg":["Pharma A","Pharma B","Pharma C","Pharma D"],"Ibuprofeno 400mg":["Pharma A","Pharma B","Pharma C"],"Amoxicilina 500mg":["Pharma A","Pharma B","Pharma C"],"Omeprazol 20mg":["Pharma A","Pharma B","Pharma C"],"Metformina 850mg":["Pharma A","Pharma B","Pharma C"],"Atorvastatina 20mg":["Pharma A","Pharma B","Pharma C"],"Losartán 50mg":["Pharma A","Pharma B","Pharma C"],"Vitamina C 1000mg":["Pharma A","Pharma B","Pharma C"]},
    }
  },
  "Transporte":{
    products:["Taxi / Cabify km","Servicio de Bus","Vuelo Doméstico","Vuelo Internacional","Peaje Autopista","Servicio de Metro","Transporte de Carga","Mensajería Express"],
    companiesByCountry:{
      "Colombia":{"Taxi / Cabify km":["Uber","Cabify","InDriver","Beat","Tappsi"],"Servicio de Bus":["Transmilenio","MIO","Metro Medellín","Megabús","Metrolínea"],"Vuelo Doméstico":["Avianca","LATAM Colombia","Wingo","EasyFly","Satena"],"Vuelo Internacional":["Avianca","LATAM","American Airlines","Copa Airlines","Air France"],"Peaje Autopista":["ANI","Concesiones viales","Devimed","Autopistas del Café"],"Servicio de Metro":["Metro Medellín","TransMilenio BRT","Metro Bogotá"],"Transporte de Carga":["Deprisa","Envía","Coordinadora","TCC","Servientrega"],"Mensajería Express":["Rappi","DomiBici","Picap","Mensajero Urbano"]},
      "Estados Unidos":{"Taxi / Cabify km":["Uber","Lyft","Via","Curb"],"Servicio de Bus":["Greyhound","FlixBus","BoltBus","Megabus"],"Vuelo Doméstico":["Delta","United","American","Southwest","JetBlue"],"Vuelo Internacional":["Delta","United","American","Emirates","Lufthansa"],"Peaje Autopista":["E-ZPass","SunPass","FasTrak","TxTag"],"Servicio de Metro":["MTA NYC","BART","Chicago L","WMATA","MBTA"],"Transporte de Carga":["FedEx","UPS","DHL USA","USPS"],"Mensajería Express":["DoorDash","Uber Eats","Instacart","Amazon Flex"]},
      "default":{"Taxi / Cabify km":["Transport A","Transport B","Transport C"],"Servicio de Bus":["Bus A","Bus B","Bus C"],"Vuelo Doméstico":["Airline A","Airline B","Airline C"],"Vuelo Internacional":["Airline A","Airline B","Airline C"],"Peaje Autopista":["Toll A","Toll B","Toll C"],"Servicio de Metro":["Metro A","Metro B","Metro C"],"Transporte de Carga":["Cargo A","Cargo B","Cargo C"],"Mensajería Express":["Express A","Express B","Express C"]},
    }
  },
  "Banca y Finanzas":{
    products:["Cuenta de Ahorros","Tarjeta de Crédito","Crédito de Consumo","Crédito Hipotecario","Comisión Transferencia","CDT / Depósito a Plazo","Seguro de Depósitos","Nómina Empresarial"],
    companiesByCountry:{
      "Colombia":{"Cuenta de Ahorros":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Nu Colombia"],"Tarjeta de Crédito":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Falabella"],"Crédito de Consumo":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Fincomercio"],"Crédito Hipotecario":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","AV Villas"],"Comisión Transferencia":["Bancolombia","Davivienda","BBVA Colombia","Nequi","Daviplata"],"CDT / Depósito a Plazo":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Coltefinanciera"],"Seguro de Depósitos":["Bancolombia","Davivienda","BBVA Colombia","Banco Popular"],"Nómina Empresarial":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá"]},
      "Estados Unidos":{"Cuenta de Ahorros":["JPMorgan Chase","Bank of America","Wells Fargo","Citibank","Capital One"],"Tarjeta de Crédito":["Chase","American Express","Bank of America","Citi","Capital One"],"Crédito de Consumo":["JPMorgan Chase","Bank of America","Wells Fargo","SoFi","Marcus"],"Crédito Hipotecario":["Wells Fargo","JPMorgan Chase","Bank of America","Rocket Mortgage","United Wholesale"],"Comisión Transferencia":["JPMorgan Chase","Bank of America","Wells Fargo","Zelle","PayPal"],"CDT / Depósito a Plazo":["JPMorgan Chase","Bank of America","Wells Fargo","Ally Bank","Marcus"],"Seguro de Depósitos":["JPMorgan Chase","Bank of America","Wells Fargo","FDIC insured"],"Nómina Empresarial":["ADP","Paychex","Gusto","JPMorgan Chase","Bank of America"]},
      "default":{"Cuenta de Ahorros":["Bank A","Bank B","Bank C","Bank D"],"Tarjeta de Crédito":["Bank A","Bank B","Bank C"],"Crédito de Consumo":["Bank A","Bank B","Bank C"],"Crédito Hipotecario":["Bank A","Bank B","Bank C"],"Comisión Transferencia":["Bank A","Bank B","Bank C"],"CDT / Depósito a Plazo":["Bank A","Bank B","Bank C"],"Seguro de Depósitos":["Bank A","Bank B","Bank C"],"Nómina Empresarial":["Bank A","Bank B","Bank C"]},
    }
  },
};

const BASE_PRICES = {
  "Gasolina Regular":9600,"Gasolina Premium":11200,"ACPM / Diésel":9100,"Gas Natural":3200,
  "Energía Eléctrica":450,"Carbón":85000,"Etanol":3100,"Gas Licuado (GLP)":2800,
  "Internet Hogar 100Mbps":87000,"Internet Hogar 300Mbps":115000,"Internet Hogar 1Gbps":160000,
  "Telefonía Móvil Postpago":65000,"Telefonía Móvil Prepago":25000,"TV por Suscripción":72000,
  "Telefonía Fija":28000,"Roaming Internacional":45000,
  "Pollo Entero":9200,"Carne de Res (kg)":28000,"Aceite Vegetal 1L":8900,"Leche 1L":3400,
  "Arroz 1kg":4100,"Pan Tajado":5200,"Huevos (docena)":14500,"Azúcar 1kg":3800,
  "Harina de Trigo 1kg":4200,"Café Molido 500g":18000,
  "Seguro Auto Básico":1820000,"Seguro Auto Todo Riesgo":3400000,"Seguro de Vida":980000,
  "SOAT / Seguro Obligatorio":580000,"Seguro de Hogar":720000,"Seguro de Salud":250000,
  "Seguro Empresarial":2800000,"Seguro de Viaje":180000,
  "Acetaminofén 500mg":8500,"Ibuprofeno 400mg":12000,"Amoxicilina 500mg":32000,
  "Omeprazol 20mg":18000,"Metformina 850mg":22000,"Atorvastatina 20mg":45000,
  "Losartán 50mg":38000,"Vitamina C 1000mg":25000,
  "Taxi / Cabify km":2800,"Servicio de Bus":2950,"Vuelo Doméstico":280000,
  "Vuelo Internacional":1800000,"Peaje Autopista":12500,"Servicio de Metro":2950,
  "Transporte de Carga":180000,"Mensajería Express":8500,
  "Cuenta de Ahorros":0,"Tarjeta de Crédito":38000,"Crédito de Consumo":1800000,
  "Crédito Hipotecario":180000000,"Comisión Transferencia":8500,"CDT / Depósito a Plazo":5000000,
  "Seguro de Depósitos":12000,"Nómina Empresarial":85000,
};

const UNITS = {
  "Gasolina Regular":"litro","Gasolina Premium":"litro","ACPM / Diésel":"litro","Gas Natural":"m³",
  "Energía Eléctrica":"kWh","Carbón":"tonelada","Etanol":"litro","Gas Licuado (GLP)":"kg",
  "Internet Hogar 100Mbps":"mes","Internet Hogar 300Mbps":"mes","Internet Hogar 1Gbps":"mes",
  "Telefonía Móvil Postpago":"mes","Telefonía Móvil Prepago":"plan","TV por Suscripción":"mes",
  "Telefonía Fija":"mes","Roaming Internacional":"plan",
  "Pollo Entero":"kg","Carne de Res (kg)":"kg","Aceite Vegetal 1L":"und","Leche 1L":"und",
  "Arroz 1kg":"kg","Pan Tajado":"und","Huevos (docena)":"docena","Azúcar 1kg":"kg",
  "Harina de Trigo 1kg":"kg","Café Molido 500g":"und",
  "Seguro Auto Básico":"año","Seguro Auto Todo Riesgo":"año","Seguro de Vida":"año",
  "SOAT / Seguro Obligatorio":"año","Seguro de Hogar":"año","Seguro de Salud":"mes",
  "Seguro Empresarial":"año","Seguro de Viaje":"viaje",
  "Acetaminofén 500mg":"caja","Ibuprofeno 400mg":"caja","Amoxicilina 500mg":"caja",
  "Omeprazol 20mg":"caja","Metformina 850mg":"caja","Atorvastatina 20mg":"caja",
  "Losartán 50mg":"caja","Vitamina C 1000mg":"caja",
  "Taxi / Cabify km":"km","Servicio de Bus":"pasaje","Vuelo Doméstico":"tiquete",
  "Vuelo Internacional":"tiquete","Peaje Autopista":"paso","Servicio de Metro":"pasaje",
  "Transporte de Carga":"envío","Mensajería Express":"envío",
  "Cuenta de Ahorros":"cuota/mes","Tarjeta de Crédito":"cuota anual","Crédito de Consumo":"crédito",
  "Crédito Hipotecario":"crédito","Comisión Transferencia":"transacción","CDT / Depósito a Plazo":"inversión",
  "Seguro de Depósitos":"mes","Nómina Empresarial":"mes",
};
const PRICE_MULT = {"Colombia":1,"México":1.2,"Brasil":1.3,"Argentina":0.9,"Chile":1.1,"Perú":0.85,"España":1.8,"Francia":1.9,"Alemania":1.85,"Italia":1.75,"Reino Unido":2.1,"Estados Unidos":2.2,"Canadá":2.0,"Japón":2.5,"Corea del Sur":1.7,"India":0.4};

function seeded(seed){let s=seed;return()=>{s=(s*1664525+1013904223)&0xffffffff;return Math.abs(s)/0x7fffffff;};}

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
    const history=MONTHS.map((m,mi)=>{const hr=seeded(seed+i*100+mi*13);const p=cartel?base*(0.85+mi*0.025)*(1+(hr()-0.5)*0.005):base*(0.82+mi*0.02+(hr()-0.5)*0.05);return{month:m,price:Math.round(p)};});
    return{company,price:Math.round(price),prevPrice:Math.round(prevBase),history,marketShare:Math.round(8+r()*25),complaints:Math.round(r()*40),changeFreq:Math.round(1+r()*8)};
  });
}

function detectPatterns(data,country,t){
  if(!data||data.length<2)return{alerts:[],risk:{level:"N/A",score:0,color:C.t4},variancePct:0,changePct:0,avg:0,max:0,min:0};
  const lf=LEGAL[country]||LEGAL["Colombia"];
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
  const mk=(type,sev,icon,color,desc,prob)=>({type:t.patternTypes[type],sev:t.sevLabels[sev],icon,color,desc,legal:lf.rules?.[type]||"",action:t.patternActions[type],probability:prob,sanction:lf.sanction||""});
  if(variancePct<0.5&&data.length>=3){alerts.push(mk("FIJACIÓN DE PRECIOS","CRÍTICA","🔴",C.red,t.patternDescs["FIJACIÓN DE PRECIOS"](variancePct.toFixed(2),data.length),t.probLabels.high80));score+=45;}
  if(allUp&&changePct>10){alerts.push(mk("ALZA SIMULTÁNEA",changePct>20?"CRÍTICA":"ALTA","🟠",changePct>20?C.red:C.amber,t.patternDescs["ALZA SIMULTÁNEA"](changePct.toFixed(1)),changePct>20?t.probLabels.high60:t.probLabels.med40));score+=changePct>20?35:20;}
  if(variancePct>=0.5&&variancePct<2&&data.length>=3){alerts.push(mk("PARALELISMO DE PRECIOS","MEDIA","🟡",C.amber,t.patternDescs["PARALELISMO DE PRECIOS"](variancePct.toFixed(2)),t.probLabels.med30b));score+=12;}
  if(maxShare>60){const dom=data.find(d=>d.marketShare===maxShare);alerts.push(mk("POSICIÓN DOMINANTE","ALTA","🔵",C.blue,t.patternDescs["POSICIÓN DOMINANTE"](dom.company,maxShare),t.probLabels.med30));score+=18;}
  data.filter(d=>d.price<avg*0.75).forEach(d=>{alerts.push(mk("PRECIOS PREDATORIOS","ALTA","⚡",C.purple,t.patternDescs["PRECIOS PREDATORIOS"](d.company,(((avg-d.price)/avg)*100).toFixed(1)),t.probLabels.med35));score+=20;});
  if(top2>80&&data.length>=3){alerts.push(mk("CONCENTRACIÓN","MEDIA","🔶","#f97316",t.patternDescs["CONCENTRACIÓN"](top2),t.probLabels.med30c));score+=10;}
  let level,color;
  if(score>=55){level=t.riskLabels?.critical||"CRÍTICO";color=C.red;}
  else if(score>=35){level=t.riskLabels?.high||"ALTO";color=C.amber;}
  else if(score>=15){level=t.riskLabels?.medium||"MEDIO";color="#d97706";}
  else{level=t.riskLabels?.low||"BAJO";color=C.green;}
  return{alerts,risk:{level,score,color},variancePct,changePct,avg,max,min};
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Badge=({label,color})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:.8,fontFamily:"monospace",whiteSpace:"nowrap"}}>{label}</span>;
const SectionTitle=({children})=><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><div style={{height:1,flex:1,background:`linear-gradient(90deg,${C.gold}55,transparent)`}}/><span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span><div style={{height:1,flex:1,background:`linear-gradient(270deg,${C.gold}55,transparent)`}}/></div>;
function StatCard({icon,label,value,sub,color,delay=0}){return<div style={{background:C.card,border:`1px solid ${color}33`,borderRadius:12,padding:"16px 18px",boxShadow:"0 1px 4px #0001",animation:`fadeUp .5s ease ${delay}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><span style={{fontSize:10,color:C.t3,letterSpacing:.8,textTransform:"uppercase"}}>{label}</span><span style={{fontSize:18}}>{icon}</span></div><div style={{fontSize:22,fontWeight:800,color,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{value}</div>{sub&&<div style={{fontSize:11,color:C.t3}}>{sub}</div>}</div>;}
function CTip({children,color}){const col=color||C.gold;return<div style={{background:col+"11",border:`1px solid ${col}33`,borderRadius:8,padding:"10px 14px",fontSize:12,color:col,lineHeight:1.6,marginBottom:12}}>{children}</div>;}
function CTooltip({active,payload,label,unit}){if(!active||!payload?.length)return null;return<div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",fontSize:12,boxShadow:"0 4px 12px #0002"}}><div style={{color:C.t2,marginBottom:6,fontWeight:600}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||C.gold,marginBottom:2}}>{p.name}: <b>{p.value?.toLocaleString()}</b>{unit&&` / ${unit}`}</div>)}</div>;}

function AlertCard({a,expanded,onToggle,t}){
  return<div style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,marginBottom:10,overflow:"hidden"}}>
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
    {expanded&&<div style={{borderTop:`1px solid ${a.color}22`,padding:"16px 18px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
      <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>⚖️ {t.legalBase}</div><div style={{fontSize:12,color:a.color,lineHeight:1.7}}>{a.legal}</div></div>
      <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>🔍 {t.recommendedAction}</div><div style={{fontSize:12,color:C.t2,lineHeight:1.7}}>{a.action}</div></div>
      <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>💰 {t.applicableSanctions}</div><div style={{fontSize:12,color:C.t2,lineHeight:1.7}}>{a.sanction}</div></div>
    </div>}
  </div>;
}

function AlertsPanel({alerts,country,emailConfig,onEmailConfig,t}){
  const [expanded,setExpanded]=useState(null);
  const [emailInput,setEmailInput]=useState(emailConfig.email||"");
  const [saved,setSaved]=useState(false);
  const [thresholds,setThresholds]=useState({a:true,b:true,c:true,d:true,e:true,f:false});
  const lf=LEGAL[country]||LEGAL["Colombia"];
  const crit=alerts.filter(a=>a.sev===t.sevLabels["CRÍTICA"]);
  const high=alerts.filter(a=>a.sev===t.sevLabels["ALTA"]);
  const med=alerts.filter(a=>a.sev===t.sevLabels["MEDIA"]);
  const save=()=>{onEmailConfig({email:emailInput});setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const thresholdKeys=["a","b","c","d","e","f"];
  const thresholdColors=[C.red,C.amber,C.amber,C.blue,C.purple,"#f97316"];
  const Toggle=({label,k,color})=><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.border}22`}}>
    <span style={{fontSize:12,color:C.t2}}>{label}</span>
    <div onClick={()=>setThresholds(p=>({...p,[k]:!p[k]}))} style={{width:40,height:22,borderRadius:11,cursor:"pointer",transition:"all .2s",background:thresholds[k]?color+"44":C.border,border:`1px solid ${thresholds[k]?color:C.borderHi}`,position:"relative"}}>
      <div style={{width:16,height:16,borderRadius:"50%",position:"absolute",top:2,left:thresholds[k]?20:2,transition:"left .2s",background:thresholds[k]?color:C.t4}}/>
    </div>
  </div>;
  return<div>
    {alerts.length>0?<div style={{marginBottom:28}}>
      <SectionTitle>{t.activeAlerts} — {alerts.length} {alerts.length!==1?t.detections:t.detection}</SectionTitle>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[{label:t.critical,count:crit.length,color:C.red},{label:t.high,count:high.length,color:C.amber},{label:t.medium,count:med.length,color:"#d97706"}].map(s=><div key={s.label} style={{background:s.color+"11",border:`1px solid ${s.color}33`,borderRadius:10,padding:"12px 20px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:26,fontWeight:800,color:s.color}}>{s.count}</span><span style={{fontSize:10,color:s.color,fontWeight:700,letterSpacing:.8}}>{s.label}</span></div>)}
        <div style={{background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:10,padding:"12px 20px"}}><div style={{fontSize:9,color:C.t3,letterSpacing:.8,marginBottom:2}}>{t.jurisdiction}</div><div style={{fontSize:11,color:C.teal,fontWeight:700}}>{lf.authority}</div></div>
      </div>
      {alerts.map((a,i)=><AlertCard key={i} a={a} expanded={expanded===i} onToggle={()=>setExpanded(expanded===i?null:i)} t={t}/>)}
    </div>:<CTip color={C.green}>✅ {t.noAlerts}</CTip>}
    <SectionTitle>{t.notifChannels}</SectionTitle>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,boxShadow:"0 1px 4px #0001"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>📧</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{t.emailAlerts}</span><Badge label={t.active} color={C.teal}/></div>
        <input value={emailInput} onChange={e=>{setEmailInput(e.target.value);setSaved(false);}} placeholder="email@example.com" type="email" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",marginBottom:10}}/>
        <button onClick={save} style={{width:"100%",background:saved?C.green+"22":C.gold+"22",border:`1px solid ${saved?C.green:C.gold}`,borderRadius:8,padding:"9px",color:saved?C.green:C.gold,fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:700}}>{saved?t.configured:t.activateEmail}</button>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.teal}33`,borderRadius:12,padding:20,boxShadow:"0 1px 4px #0001"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>🔔</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{t.inAppNotif}</span><Badge label={t.alwaysActive} color={C.teal}/></div>
        <p style={{fontSize:12,color:C.t3,lineHeight:1.7,margin:"0 0 10px"}}>{t.inAppDesc}</p>
        <div style={{background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.teal}}>✓ {t.noConfigRequired}</div>
      </div>
      {[{icon:"💬",name:"WhatsApp"},{icon:"✈️",name:"Telegram"}].map(ch=><div key={ch.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,boxShadow:"0 1px 4px #0001"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>{ch.icon}</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{ch.name}</span><Badge label={t.comingSoon} color={C.t4}/></div>
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.t4,fontSize:12,marginBottom:10}}>v2.0</div>
        <button disabled style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px",color:C.t4,fontSize:12,fontFamily:"inherit",cursor:"not-allowed"}}>{t.inDevelopment}</button>
      </div>)}
    </div>
    <SectionTitle>{t.detectionThresholds}</SectionTitle>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,boxShadow:"0 1px 4px #0001"}}>
      {t.thresholds.map((label,i)=><Toggle key={i} label={label} k={thresholdKeys[i]} color={thresholdColors[i]}/>)}
    </div>
  </div>;
}

function FilterPanel({filters,onChange,t}){
  const {region_group,country,region,market,product,company,dateFrom,dateTo,hourFrom,hourTo}=filters;
  const countryData=GEO[region_group]?.countries[country];
  const regions=countryData?.regions||["Nacional"];
  const flag=countryData?.flag||"🌍";
  const products=MARKETS[market]?.products||[];
  const companies=getCompanies(market,product,country);
  const sel=(key,val)=>{
    const n={...filters,[key]:val};
    if(key==="region_group"){const firstC=Object.keys(GEO[val]?.countries||{})[0];n.country=firstC||"";n.region="Nacional";n.company=t.allCompanies;}
    if(key==="country"){n.region="Nacional";n.company=t.allCompanies;}
    if(key==="market"){n.product=MARKETS[val]?.products[0]||"";n.company=t.allCompanies;}
    if(key==="product"){n.company=t.allCompanies;}
    onChange(n);
  };
  const L=({c})=><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:5,textTransform:"uppercase"}}>{c}</div>;
  const Sel=({value,opts,k,renderLabel})=><select value={value} onChange={e=>sel(k,e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{opts.map(o=><option key={o} value={o}>{renderLabel?renderLabel(o):o}</option>)}</select>;
  const DI=({label,val,k})=><div style={{flex:1}}><L c={label}/><input type="date" value={val} onChange={e=>sel(k,e.target.value)} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none"}}/></div>;
  const hours=Array.from({length:24},(_,i)=>String(i).padStart(2,"0"));
  const mins=["00","15","30","45"];
  const TI=({label,val,k})=>{
    const [h,m]=(val||"00:00").split(":");
    return<div style={{flex:1}}>
      <L c={label}/>
      <div style={{display:"flex",gap:4}}>
        <select value={h} onChange={e=>sel(k,`${e.target.value}:${m||"00"}`)}
          style={{flex:1,background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 8px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          {hours.map(hh=><option key={hh} value={hh}>{hh}h</option>)}
        </select>
        <select value={m||"00"} onChange={e=>sel(k,`${h||"00"}:${e.target.value}`)}
          style={{flex:1,background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 8px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          {mins.map(mm=><option key={mm} value={mm}>{mm}m</option>)}
        </select>
      </div>
    </div>;
  };
  return<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:26,boxShadow:"0 1px 4px #0001"}}>
    <SectionTitle>{t.filterTitle}</SectionTitle>
    <div style={{marginBottom:16}}>
      <L c={t.worldRegion}/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {Object.entries(GEO).map(([rg,v])=><button key={rg} onClick={()=>sel("region_group",rg)} style={{background:region_group===rg?C.gold+"22":"transparent",border:`1px solid ${region_group===rg?C.gold:C.borderHi}`,borderRadius:8,padding:"7px 14px",color:region_group===rg?C.gold:C.t3,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all .2s",fontWeight:region_group===rg?700:400}}>{v.flag} {t.regions[rg]||rg}</button>)}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:16}}>
      <div>
        <L c={t.country}/>
        <select value={country} onChange={e=>sel("country",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          {Object.keys(GEO[region_group]?.countries||{}).map(c=><option key={c} value={c}>{GEO[region_group].countries[c].flag} {c}</option>)}
        </select>
      </div>
      <div><L c={t.territory}/><Sel value={region} opts={regions} k="region"/></div>
      {/* FIX #2: Market dropdown shows translated label but uses Spanish key */}
      <div>
        <L c={t.market}/>
        <select value={market} onChange={e=>sel("market",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          {Object.keys(MARKETS).map(m=><option key={m} value={m}>{t.markets[m]||m}</option>)}
        </select>
      </div>
      <div><L c={t.product}/><select value={product} onChange={e=>sel("product",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{products.map(p=><option key={p} value={p}>{t.products?.[p]||p}</option>)}</select></div>
      {/* FIX #2: Company dropdown always uses real company names */}
      <div>
        <L c={t.company}/>
        <select value={company} onChange={e=>sel("company",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          <option value={t.allCompanies}>{t.allCompaniesLabel}</option>
          {companies.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <DI label={t.dateFrom} val={dateFrom} k="dateFrom"/>
      <DI label={t.dateTo} val={dateTo} k="dateTo"/>
      <TI label={t.hourFrom} val={hourFrom} k="hourFrom"/>
      <TI label={t.hourTo} val={hourTo} k="hourTo"/>
    </div>
    {LEGAL[country]&&<div style={{marginTop:14,background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <span style={{fontSize:16}}>{flag}</span>
      <div><span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{LEGAL[country].authority}</span></div>
      <div style={{marginLeft:"auto"}}><span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>{t.legalFrame}: </span><span style={{fontSize:11,color:C.gold,fontWeight:600}}>{LEGAL[country].law}</span></div>
    </div>}
  </div>;
}

function ComparisonStats({data,selectedCompany,analysis,unit,t}){
  if(!data.length)return null;
  const avg=analysis.avg||0;
  const sorted=[...data].sort((a,b)=>a.price-b.price);
  const PALETTE=[C.gold,C.teal,C.red,C.blue,C.purple,"#f97316"];
  const barData=data.map(d=>({name:d.company,price:d.price,prevPrice:d.prevPrice,diff:+(((d.price-avg)/avg)*100).toFixed(1)}));
  const histData=(data[0]?.history||[]).map((h,i)=>({month:h.month,...Object.fromEntries(data.map(d=>[d.company,d.history[i]?.price]))}));
  return<div style={{animation:"fadeUp .5s ease .15s both"}}>
    <SectionTitle>{t.comparison}</SectionTitle>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:20,boxShadow:"0 1px 4px #0001"}}>
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",background:C.bg}}>
        <span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>{t.rankingTitle}</span>
        <span style={{fontSize:10,color:C.t4}}>{t.average}: {Math.round(avg).toLocaleString()} / {unit}</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{borderBottom:`1px solid ${C.border}`,background:C.bg}}>{t.tableHeaders.map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:C.t3,fontWeight:700,letterSpacing:.8}}>{h}</th>)}</tr></thead>
        <tbody>{sorted.map((row,i)=>{
          const chg=((row.price-row.prevPrice)/row.prevPrice)*100;
          const dAvg=((row.price-avg)/avg)*100;
          const isSel=row.company===selectedCompany;
          return<tr key={row.company} style={{borderBottom:`1px solid ${C.border}22`,background:isSel?C.goldGlow:"transparent"}}>
            <td style={{padding:"10px 14px",fontSize:13,color:C.t3,fontWeight:700}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</td>
            <td style={{padding:"10px 14px",fontSize:13,fontWeight:700,color:isSel?C.gold:C.t1}}>{row.company}{isSel&&<span style={{fontSize:9,color:C.gold}}> ◀</span>}</td>
            <td style={{padding:"10px 14px",fontSize:13,color:C.teal,fontWeight:700}}>{row.price.toLocaleString()}</td>
            <td style={{padding:"10px 14px",fontSize:12,color:C.t3}}>{row.prevPrice.toLocaleString()}</td>
            <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(chg)>15?C.red:Math.abs(chg)>5?C.amber:C.green}}>{chg>0?"+":""}{chg.toFixed(1)}%</td>
            <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(dAvg)>5?C.amber:C.green}}>{dAvg>0?"+":""}{dAvg.toFixed(1)}%</td>
            <td style={{padding:"10px 14px"}}><Badge label={`${row.marketShare}%`} color={C.blue}/></td>
            <td style={{padding:"10px 14px"}}><Badge label={row.complaints} color={row.complaints>25?C.red:row.complaints>10?C.amber:C.green}/></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:"0 1px 4px #0001"}}>
        <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.currentVsPrev}</div>
        <ResponsiveContainer width="100%" height={190}><BarChart data={barData} barGap={3}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/><Bar dataKey="prevPrice" fill={C.border} name={t.prev} radius={[3,3,0,0]}/><Bar dataKey="price" fill={C.gold} name={t.current} radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:"0 1px 4px #0001"}}>
        <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.deviationVsAvg}</div>
        <ResponsiveContainer width="100%" height={190}><BarChart data={barData}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/><Tooltip formatter={v=>[`${v}%`,t.devFromAvg]}/><ReferenceLine y={0} stroke={C.t3} strokeDasharray="4 4"/><Bar dataKey="diff" fill={C.teal} name={t.devFromAvg} radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
      </div>
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:18,boxShadow:"0 1px 4px #0001"}}>
      <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.historicalEvolution}</div>
      <ResponsiveContainer width="100%" height={200}><LineChart data={histData}><CartesianGrid stroke={C.border} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:C.t3,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/>{data.map((d,i)=><Line key={d.company} type="monotone" dataKey={d.company} stroke={PALETTE[i%PALETTE.length]} strokeWidth={d.company===selectedCompany?3:1.5} strokeDasharray={d.company===selectedCompany?"":"5 3"} dot={false} name={d.company}/>)}</LineChart></ResponsiveContainer>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:10}}>{data.map((d,i)=><div key={d.company} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:18,height:2,background:PALETTE[i%PALETTE.length],borderRadius:2,opacity:d.company===selectedCompany?1:.5}}/><span style={{fontSize:10,color:d.company===selectedCompany?C.gold:C.t3}}>{d.company}{d.company===selectedCompany?" ◀":""}</span></div>)}</div>
    </div>
  </div>;
}

function RiskPanel({analysis,onGoToAlerts,country,t}){
  if(!analysis)return null;
  const {alerts,risk,variancePct,changePct,avg,max,min}=analysis;
  const lf=LEGAL[country]||LEGAL["Colombia"];
  return<div style={{animation:"fadeUp .5s ease both"}}>
    <SectionTitle>{t.riskStats}</SectionTitle>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:14,marginBottom:22}}>
      <StatCard icon="🎯" label={t.riskLevel} value={risk.level} sub={`${t.score}: ${risk.score}/100`} color={risk.color}/>
      <StatCard icon="📐" label={t.marketDispersion} value={`${variancePct?.toFixed(2)||"—"}%`} sub={t.betweenCompetitors} color={variancePct<1?C.red:variancePct<3?C.amber:C.green} delay={.05}/>
      <StatCard icon="📈" label={t.avgVariation} value={`${changePct>0?"+":""}${changePct?.toFixed(1)||"—"}%`} sub={t.vsPrevPeriod} color={Math.abs(changePct)>15?C.red:Math.abs(changePct)>5?C.amber:C.green} delay={.1}/>
      <StatCard icon="⬆️" label={t.maxPrice} value={max?.toLocaleString()||"—"} sub={t.mostExpensive} color={C.red} delay={.15}/>
      <StatCard icon="⬇️" label={t.minPrice} value={min?.toLocaleString()||"—"} sub={t.cheapest} color={C.green} delay={.2}/>
      <StatCard icon="➗" label={t.avgPrice} value={Math.round(avg||0).toLocaleString()} sub={t.marketAvg} color={C.blue} delay={.25}/>
    </div>
    <div style={{background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:10,padding:"12px 16px",marginBottom:18,display:"flex",gap:16,flexWrap:"wrap"}}>
      <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{lf.authority}</span></div>
      <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.legalFrame}: </span><span style={{fontSize:11,color:C.gold,fontWeight:600}}>{lf.law}</span></div>
    </div>
    {alerts.length>0?<div>{alerts.map((a,i)=><div key={i} style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,padding:"13px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:20}}>{a.icon}</span>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{color:a.color,fontWeight:700,fontSize:13}}>{a.type}</span><Badge label={a.sev} color={a.color}/><Badge label={a.probability} color={a.color}/></div>
        <p style={{color:C.t2,fontSize:12,margin:0,lineHeight:1.5}}>{a.desc}</p>
      </div>
      <button onClick={onGoToAlerts} style={{background:"transparent",border:`1px solid ${a.color}44`,borderRadius:7,padding:"6px 12px",color:a.color,fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>{t.seeDetail}</button>
    </div>)}</div>:<CTip color={C.green}>✅ {t.noAlerts}</CTip>}
  </div>;
}

// AI Analysis - using correct API approach for deployed apps
function AIAnalysis({data,analysis,product,country,region,unit,t}){
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const lf=LEGAL[country]||LEGAL["Colombia"];
  const displayProduct=t.products?.[product]||product;
  const Dot=({delay})=><span style={{width:7,height:7,borderRadius:"50%",background:C.gold,display:"inline-block",animation:`pulse 1.2s ease-in-out ${delay}s infinite`}}/>;

  const run=async()=>{
    if(!data.length)return;
    setLoading(true);setText("");setError("");
    const prompt=t.aiPrompt(product,region,country,unit,data,analysis,lf);
    try{
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),30000);
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        signal:controller.signal,
        headers:{
          "Content-Type":"application/json",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          messages:[{role:"user",content:prompt}]
        })
      });
      clearTimeout(timeout);
      const d=await res.json();
      if(d.error){throw new Error(d.error.message||"API error");}
      const fullText=d.content?.map(b=>b.text||"").join("")||"";
      if(!fullText){throw new Error("No response received");}
      setText(fullText);
    }catch(e){
      if(e.name==="AbortError"){setError("Request timed out. Please try again.");}
      else if(e.message?.includes("fetch")||e.message?.includes("network")){
        setError("Network error. Please check your connection and try again.");
      }else{
        setError(e.message||"Error generating opinion. Please try again.");
      }
    }finally{setLoading(false);}
  };

  return<div>
    <SectionTitle>{t.aiAnalysis}</SectionTitle>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:20,boxShadow:"0 1px 4px #0001"}}>
      <div style={{background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:16,flexWrap:"wrap"}}>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.jurisdiction}: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{country}</span></div>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11,color:C.gold,fontWeight:700}}>{lf.authority}</span></div>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>{t.legalFrame}: </span><span style={{fontSize:11,color:C.t2}}>{lf.law}</span></div>
      </div>
      <p style={{color:C.t2,fontSize:13,lineHeight:1.7,margin:"0 0 18px"}}>{t.aiDesc}</p>
      <button onClick={run} disabled={loading} style={{background:loading?C.border:C.gold,border:"none",borderRadius:8,padding:"12px 26px",color:loading?C.t3:"#fff",fontSize:13,fontWeight:800,fontFamily:"inherit",cursor:loading?"wait":"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
        {loading?<><span style={{display:"flex",gap:4}}><Dot delay={0}/><Dot delay={.2}/><Dot delay={.4}/></span>{t.analyzing}…</>:t.generateDictum}
      </button>
    </div>
    {error&&<div style={{background:C.red+"11",border:`1px solid ${C.red}33`,borderLeft:`3px solid ${C.red}`,borderRadius:10,padding:"14px 18px",marginBottom:16,color:C.red,fontSize:13,lineHeight:1.6}}>
      ⚠️ {error}
    </div>}
    {text&&<div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:12,padding:22,animation:"fadeUp .4s ease",boxShadow:"0 1px 4px #0001"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontSize:18}}>⚖️</span>
        <span style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1}}>{t.dictum} — {displayProduct} / {region}, {country}</span>
      </div>
      <div style={{color:C.t1,fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{text}</div>
    </div>}
  </div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("es");
  const t=T[lang];
  const [tab,setTab]=useState("dashboard");
  const [emailConfig,setEmailConfig]=useState({email:""});
  const [filters,setFilters]=useState({
    region_group:"América Latina",country:"Colombia",region:"Bogotá",
    market:"Energía",product:"Gasolina Regular",company:"Todas",
    dateFrom:"2026-04-01",dateTo:"2026-05-20",hourFrom:"00:00",hourTo:"23:59",
  });

  const companies=useMemo(()=>getCompanies(filters.market,filters.product,filters.country),[filters.market,filters.product,filters.country]);
  const allData=useMemo(()=>generateData(filters.product,companies,filters.country,filters.region),[filters.product,companies,filters.country,filters.region]);

  // FIX #2: Compare against both ES and EN allCompanies value
  const displayData=useMemo(()=>{
    const isAll=filters.company===t.allCompanies||filters.company==="Todas"||filters.company==="All";
    return isAll?allData:allData.filter(d=>d.company===filters.company);
  },[allData,filters.company,t.allCompanies]);

  const analysis=useMemo(()=>detectPatterns(allData,filters.country,t),[allData,filters.country,t]);
  const unit=UNITS[filters.product]||"und";
  const alertCount=analysis.alerts.length;
  const countryInfo=GEO[filters.region_group]?.countries[filters.country];

  // FIX #1: When language changes, reset company filter to new language's "All" value
  const handleLangChange=(newLang)=>{
    const newT=T[newLang];
    setFilters(f=>({...f,company:newT.allCompanies}));
    setLang(newLang);
  };

  return<div style={{minHeight:"100vh",background:C.bg,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:C.t1}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Syne:wght@700;800&display=swap');
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#f0f4f8}::-webkit-scrollbar-thumb{background:#c2cfe0;border-radius:2px}
      select option{background:#ffffff;color:#0f172a}
      button:hover{opacity:.9}
    `}</style>

    {/* Header */}
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 6px #0001"}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${C.gold}22,${C.goldDim}11)`,border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>⚖️</div>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:C.gold,letterSpacing:.5}}>FAIR COMPES</div>
          <div style={{fontSize:9,color:C.t4,letterSpacing:1.5}}>{t.appSubtitle}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {/* FIX #1: Language toggle now resets company filter */}
        <div style={{display:"flex",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,overflow:"hidden"}}>
          {["es","en"].map(l=><button key={l} onClick={()=>handleLangChange(l)} style={{background:lang===l?C.gold+"22":"transparent",border:"none",borderRight:l==="es"?`1px solid ${C.borderHi}`:"none",padding:"6px 12px",color:lang===l?C.gold:C.t3,fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:lang===l?700:400,transition:"all .2s"}}>{l==="es"?"🇪🇸 ES":"🇬🇧 EN"}</button>)}
        </div>
        {countryInfo&&<div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{countryInfo.flag}</span><div><div style={{fontSize:11,color:C.t1,fontWeight:700}}>{filters.country}</div><div style={{fontSize:9,color:C.t4}}>{countryInfo.currency}</div></div></div>}
        {alertCount>0&&<div onClick={()=>setTab("alerts")} style={{background:analysis.risk.color+"15",border:`1px solid ${analysis.risk.color}44`,borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:analysis.risk.color,boxShadow:`0 0 8px ${analysis.risk.color}`,display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>
          <span style={{fontSize:11,color:analysis.risk.color,fontWeight:700}}>{alertCount} {alertCount!==1?t.alertsPlural:t.alerts}</span>
        </div>}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:`0 0 8px ${C.green}44`,display:"inline-block"}}/>
          <span style={{fontSize:10,color:C.t3}}>{t.live}</span>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 28px",display:"flex",gap:0}}>
      {t.tabs.map((label,i)=>{const ids=["dashboard","comparison","alerts","ai"];return<button key={ids[i]} onClick={()=>setTab(ids[i])} style={{background:"transparent",border:"none",borderBottom:tab===ids[i]?`2px solid ${C.gold}`:"2px solid transparent",color:tab===ids[i]?C.gold:C.t3,padding:"12px 20px",fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:tab===ids[i]?700:400,transition:"all .2s",whiteSpace:"nowrap"}}>{label}</button>;})}
    </div>

    {/* Body */}
    <div style={{maxWidth:1020,margin:"0 auto",padding:"26px 28px"}}>
      <FilterPanel filters={filters} onChange={setFilters} t={t}/>

      {/* Context pills */}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {[{k:t.country,v:`${countryInfo?.flag||""} ${filters.country}`},{k:t.territory,v:filters.region},{k:t.market,v:t.markets[filters.market]||filters.market},{k:t.product,v:filters.product},{k:t.company,v:filters.company},{k:t.period,v:`${filters.dateFrom} → ${filters.dateTo}`},{k:t.schedule,v:`${filters.hourFrom} – ${filters.hourTo}`}].map(x=><div key={x.k} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 12px",fontSize:11,boxShadow:"0 1px 2px #0001"}}><span style={{color:C.t4}}>{x.k}: </span><span style={{color:C.teal,fontWeight:700}}>{x.v}</span></div>)}
      </div>

      {tab==="dashboard"&&<><RiskPanel analysis={analysis} onGoToAlerts={()=>setTab("alerts")} country={filters.country} t={t}/><div style={{marginTop:28}}><ComparisonStats data={displayData} selectedCompany={filters.company} analysis={analysis} unit={unit} t={t}/></div></>}
      {tab==="comparison"&&<ComparisonStats data={allData} selectedCompany={filters.company} analysis={analysis} unit={unit} t={t}/>}
      {tab==="alerts"&&<AlertsPanel alerts={analysis.alerts} country={filters.country} emailConfig={emailConfig} onEmailConfig={setEmailConfig} t={t}/>}
      {tab==="ai"&&<AIAnalysis data={allData} analysis={analysis} product={filters.product} country={filters.country} region={filters.region} unit={unit} t={t}/>}
    </div>
  </div>;
    }
