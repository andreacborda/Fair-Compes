import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const C = {
  bg:"#060910", surface:"#0c1220", card:"#101928",
  border:"#182030", borderHi:"#1e3050",
  gold:"#c9a84c", goldDim:"#8a6e2f", goldGlow:"#c9a84c22",
  teal:"#2dd4bf", red:"#f43f5e", amber:"#f59e0b",
  green:"#10b981", blue:"#3b82f6", purple:"#a78bfa",
  t1:"#e8edf5", t2:"#8899bb", t3:"#445577", t4:"#1e2d45",
};

// ─── GEO STRUCTURE ────────────────────────────────────────────────────────────
const GEO = {
  "América Latina":{
    flag:"🌎",
    countries:{
      "Colombia":{ flag:"🇨🇴", currency:"COP", symbol:"$", regions:["Nacional","Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Cartagena","Pereira"] },
      "México":{ flag:"🇲🇽", currency:"MXN", symbol:"$", regions:["Nacional","Ciudad de México","Guadalajara","Monterrey","Puebla","Tijuana","Mérida"] },
      "Brasil":{ flag:"🇧🇷", currency:"BRL", symbol:"R$", regions:["Nacional","São Paulo","Rio de Janeiro","Brasília","Salvador","Fortaleza","Manaus"] },
      "Argentina":{ flag:"🇦🇷", currency:"ARS", symbol:"$", regions:["Nacional","Buenos Aires","Córdoba","Rosario","Mendoza","Tucumán","La Plata"] },
      "Chile":{ flag:"🇨🇱", currency:"CLP", symbol:"$", regions:["Nacional","Santiago","Valparaíso","Concepción","Antofagasta","La Serena"] },
      "Perú":{ flag:"🇵🇪", currency:"PEN", symbol:"S/", regions:["Nacional","Lima","Arequipa","Trujillo","Chiclayo","Piura"] },
    },
  },
  "Europa":{
    flag:"🌍",
    countries:{
      "España":{ flag:"🇪🇸", currency:"EUR", symbol:"€", regions:["Nacional","Madrid","Barcelona","Valencia","Sevilla","Bilbao","Zaragoza"] },
      "Francia":{ flag:"🇫🇷", currency:"EUR", symbol:"€", regions:["Nacional","París","Lyon","Marsella","Toulouse","Burdeos","Niza"] },
      "Alemania":{ flag:"🇩🇪", currency:"EUR", symbol:"€", regions:["Nacional","Berlín","Múnich","Hamburgo","Fráncfort","Colonia","Stuttgart"] },
      "Italia":{ flag:"🇮🇹", currency:"EUR", symbol:"€", regions:["Nacional","Roma","Milán","Nápoles","Turín","Palermo","Génova"] },
      "Reino Unido":{ flag:"🇬🇧", currency:"GBP", symbol:"£", regions:["Nacional","Londres","Manchester","Birmingham","Glasgow","Liverpool"] },
    },
  },
  "América del Norte":{
    flag:"🌎",
    countries:{
      "Estados Unidos":{ flag:"🇺🇸", currency:"USD", symbol:"$", regions:["Nacional","Nueva York","Los Ángeles","Chicago","Houston","Miami","Dallas"] },
      "Canadá":{ flag:"🇨🇦", currency:"CAD", symbol:"$", regions:["Nacional","Toronto","Montreal","Vancouver","Calgary","Ottawa","Edmonton"] },
    },
  },
  "Asia":{
    flag:"🌏",
    countries:{
      "Japón":{ flag:"🇯🇵", currency:"JPY", symbol:"¥", regions:["Nacional","Tokio","Osaka","Kioto","Yokohama","Nagoya","Sapporo"] },
      "Corea del Sur":{ flag:"🇰🇷", currency:"KRW", symbol:"₩", regions:["Nacional","Seúl","Busan","Incheon","Daegu","Daejeon"] },
      "India":{ flag:"🇮🇳", currency:"INR", symbol:"₹", regions:["Nacional","Bombay","Delhi","Bangalore","Chennai","Hyderabad","Calcuta"] },
    },
  },
};

// ─── LEGAL FRAMEWORKS ─────────────────────────────────────────────────────────
const LEGAL_FRAMEWORKS = {
  "Colombia":{
    authority:"Superintendencia de Industria y Comercio (SIC)",
    law:"Decreto 2153/1992 y Ley 1340/2009",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 47 núm. 1, Decreto 2153/1992 — Acuerdos que fijen directa o indirectamente precios.",
      "ALZA SIMULTÁNEA":"Art. 47 núm. 1-2, Decreto 2153/1992 — Coordinación o señalización de precios entre competidores.",
      "PARALELISMO DE PRECIOS":"Art. 47 núm. 2, Decreto 2153/1992 — Conducta paralela consciente sin justificación estructural.",
      "POSICIÓN DOMINANTE":"Art. 50, Decreto 2153/1992 — Abuso de posición dominante en el mercado relevante.",
      "PRECIOS PREDATORIOS":"Art. 50 núm. 3, Decreto 2153/1992 — Venta por debajo del costo para excluir competidores.",
      "CONCENTRACIÓN":"Ley 1340/2009 Art. 9 — Integraciones empresariales con efectos restrictivos en la competencia.",
    },
    sanction:"Multas hasta 100.000 SMMLV o el 150% de la utilidad derivada de la conducta.",
  },
  "México":{
    authority:"Comisión Federal de Competencia Económica (COFECE)",
    law:"Ley Federal de Competencia Económica (LFCE) 2014",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 53 LFCE — Prácticas monopólicas absolutas: acuerdos de fijación de precios.",
      "ALZA SIMULTÁNEA":"Art. 53 LFCE — Coordinación de precios entre agentes económicos competidores.",
      "PARALELISMO DE PRECIOS":"Art. 56 LFCE — Prácticas monopólicas relativas con efecto anticompetitivo.",
      "POSICIÓN DOMINANTE":"Art. 56 LFCE — Abuso de poder sustancial en el mercado relevante.",
      "PRECIOS PREDATORIOS":"Art. 56 fracc. VII LFCE — Precios predatorios para desplazar competidores.",
      "CONCENTRACIÓN":"Art. 61 LFCE — Concentraciones que disminuyan, dañen o impidan la competencia.",
    },
    sanction:"Multas hasta el 10% de los ingresos anuales del agente económico.",
  },
  "Brasil":{
    authority:"Conselho Administrativo de Defesa Econômica (CADE)",
    law:"Lei 12.529/2011 — Lei de Defesa da Concorrência",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 36 §3º I, Lei 12.529/2011 — Acordos de fixação de preços entre concorrentes.",
      "ALZA SIMULTÁNEA":"Art. 36 §3º, Lei 12.529/2011 — Cartel ou combinação de preços.",
      "PARALELISMO DE PRECIOS":"Art. 36 II, Lei 12.529/2011 — Dominação de mercado com condutas paralelas.",
      "POSICIÓN DOMINANTE":"Art. 36 §2º, Lei 12.529/2011 — Abuso de posição dominante (participação > 20%).",
      "PRECIOS PREDATORIOS":"Art. 36 §3º XV, Lei 12.529/2011 — Venda abaixo do custo com objetivo predatório.",
      "CONCENTRACIÓN":"Art. 88, Lei 12.529/2011 — Controle de atos de concentração econômica.",
    },
    sanction:"Multa de 0,1% a 20% do faturamento bruto no último exercício.",
  },
  "Argentina":{
    authority:"Comisión Nacional de Defensa de la Competencia (CNDC)",
    law:"Ley 27.442/2018 — Ley de Defensa de la Competencia",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 2º a) Ley 27.442 — Acuerdos que fijen, aumenten o distribuyan precios.",
      "ALZA SIMULTÁNEA":"Art. 2º a) Ley 27.442 — Coordinación de precios con efecto anticompetitivo.",
      "PARALELISMO DE PRECIOS":"Art. 3º Ley 27.442 — Actos que limiten o distorsionen la competencia.",
      "POSICIÓN DOMINANTE":"Art. 3º Ley 27.442 — Abuso de posición dominante en el mercado.",
      "PRECIOS PREDATORIOS":"Art. 3º i) Ley 27.442 — Venta a pérdida con fin exclusorio.",
      "CONCENTRACIÓN":"Art. 8º Ley 27.442 — Concentraciones económicas sujetas a control previo.",
    },
    sanction:"Multas de hasta el 30% de la facturación en el año anterior a la conducta.",
  },
  "Chile":{
    authority:"Fiscalía Nacional Económica (FNE) y Tribunal de Defensa de la Libre Competencia (TDLC)",
    law:"Decreto Ley 211/1973 (texto refundido 2005)",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 3º a) DL 211 — Acuerdos expresos o tácitos entre competidores sobre precios.",
      "ALZA SIMULTÁNEA":"Art. 3º a) DL 211 — Coordinación de condiciones comerciales entre competidores.",
      "PARALELISMO DE PRECIOS":"Art. 3º DL 211 — Abuso colectivo con efecto restrictivo en la competencia.",
      "POSICIÓN DOMINANTE":"Art. 3º b) DL 211 — Explotación abusiva de posición dominante.",
      "PRECIOS PREDATORIOS":"Art. 3º b) DL 211 — Fijación de precios predatorios por empresa dominante.",
      "CONCENTRACIÓN":"Art. 48 DL 211 — Control de operaciones de concentración.",
    },
    sanction:"Multas hasta 30.000 UTA (~USD 20 M). Disolución de personas jurídicas.",
  },
  "Perú":{
    authority:"Instituto Nacional de Defensa de la Competencia (INDECOPI)",
    law:"Decreto Legislativo 1034/2008 — Ley de Represión de Conductas Anticompetitivas",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 11.1 DL 1034 — Prácticas colusorias horizontales: fijación de precios.",
      "ALZA SIMULTÁNEA":"Art. 11.1 DL 1034 — Acuerdos sobre precios o condiciones comerciales.",
      "PARALELISMO DE PRECIOS":"Art. 11 DL 1034 — Facilitación de conductas colusorias.",
      "POSICIÓN DOMINANTE":"Art. 10 DL 1034 — Abuso de posición de dominio en el mercado relevante.",
      "PRECIOS PREDATORIOS":"Art. 10.2 e) DL 1034 — Precios predatorios o ventas condicionadas.",
      "CONCENTRACIÓN":"Ley 31112/2021 — Control previo de operaciones de concentración empresarial.",
    },
    sanction:"Multas hasta 1.000 UIT (~USD 1.3 M) o el 12% de las ventas anuales.",
  },
  "España":{
    authority:"Comisión Nacional de Mercados y la Competencia (CNMC)",
    law:"Ley 15/2007 de Defensa de la Competencia + Art. 101-102 TFUE",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 1 LDC / Art. 101 TFUE — Acuerdos colusorios que fijen precios de compra o venta.",
      "ALZA SIMULTÁNEA":"Art. 1 LDC — Prácticas concertadas con objeto o efecto anticompetitivo.",
      "PARALELISMO DE PRECIOS":"Art. 1 LDC — Prácticas conscientemente paralelas entre operadores.",
      "POSICIÓN DOMINANTE":"Art. 2 LDC / Art. 102 TFUE — Explotación abusiva de posición dominante.",
      "PRECIOS PREDATORIOS":"Art. 2.2 b) LDC — Aplicación de precios predatorios o discriminatorios.",
      "CONCENTRACIÓN":"Art. 7 LDC — Control de concentraciones económicas.",
    },
    sanction:"Multas hasta el 10% del volumen de negocios total mundial. Inhabilitación directivos hasta 2 años.",
  },
  "Francia":{
    authority:"Autorité de la Concurrence",
    law:"Code de commerce (Art. L420-1 a L420-7) + Art. 101-102 TFUE",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. L420-1 Code de commerce — Ententes anticoncurrentielles sur les prix.",
      "ALZA SIMULTÁNEA":"Art. L420-1 — Actions concertées, conventions ou coalitions tarifaires.",
      "PARALELISMO DE PRECIOS":"Art. L420-1 — Pratiques concertées à effet anticoncurrentiel.",
      "POSICIÓN DOMINANTE":"Art. L420-2 — Exploitation abusive d'une position dominante.",
      "PRECIOS PREDATORIOS":"Art. L420-5 — Offres de prix abusivement bas.",
      "CONCENTRACIÓN":"Art. L430-1 — Contrôle des opérations de concentration.",
    },
    sanction:"Sanction jusqu'à 10% du chiffre d'affaires mondial hors taxes.",
  },
  "Alemania":{
    authority:"Bundeskartellamt (BKartA)",
    law:"Gesetz gegen Wettbewerbsbeschränkungen (GWB) + Art. 101-102 TFUE",
    rules:{
      "FIJACIÓN DE PRECIOS":"§1 GWB / Art. 101 TFUE — Kartellvereinbarungen zur Preisfestsetzung.",
      "ALZA SIMULTÁNEA":"§1 GWB — Abgestimmte Verhaltensweisen zur Preiskoordination.",
      "PARALELISMO DE PRECIOS":"§1 GWB — Bewusstes Parallelverhalten mit wettbewerbsbeschränkender Wirkung.",
      "POSICIÓN DOMINANTE":"§18-19 GWB / Art. 102 TFUE — Missbrauch einer marktbeherrschenden Stellung.",
      "PRECIOS PREDATORIOS":"§19 GWB — Behinderungsmissbrauch durch Kampfpreise.",
      "CONCENTRACIÓN":"§35 GWB — Fusionskontrolle bei Zusammenschlüssen.",
    },
    sanction:"Geldbußen bis zu 10% des weltweiten Jahresumsatzes.",
  },
  "Italia":{
    authority:"Autorità Garante della Concorrenza e del Mercato (AGCM)",
    law:"Legge 287/1990 + Art. 101-102 TFUE",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 2 L.287/1990 — Intese restrittive della concorrenza sui prezzi.",
      "ALZA SIMULTÁNEA":"Art. 2 L.287/1990 — Pratiche concordate con effetto anticoncorrenziale.",
      "PARALELISMO DE PRECIOS":"Art. 2 L.287/1990 — Comportamento parallelo consapevole.",
      "POSICIÓN DOMINANTE":"Art. 3 L.287/1990 — Abuso di posizione dominante.",
      "PRECIOS PREDATORIOS":"Art. 3 L.287/1990 — Prezzi predatori per escludere concorrenti.",
      "CONCENTRACIÓN":"Art. 16 L.287/1990 — Controllo delle concentrazioni tra imprese.",
    },
    sanction:"Sanzioni fino al 10% del fatturato realizzato nell'ultimo esercizio chiuso.",
  },
  "Reino Unido":{
    authority:"Competition and Markets Authority (CMA)",
    law:"Competition Act 1998 + Enterprise Act 2002",
    rules:{
      "FIJACIÓN DE PRECIOS":"Chapter I Prohibition, CA 1998 — Price-fixing agreements between competitors.",
      "ALZA SIMULTÁNEA":"Chapter I, CA 1998 — Concerted practices on pricing.",
      "PARALELISMO DE PRECIOS":"Chapter I, CA 1998 — Conscious parallelism with anticompetitive effect.",
      "POSICIÓN DOMINANTE":"Chapter II Prohibition, CA 1998 — Abuse of dominant position.",
      "PRECIOS PREDATORIOS":"Chapter II, CA 1998 — Predatory pricing to eliminate competition.",
      "CONCENTRACIÓN":"Part 3, EA 2002 — Merger control and substantial lessening of competition.",
    },
    sanction:"Fines up to 10% of annual worldwide turnover. Director disqualification up to 15 years.",
  },
  "Estados Unidos":{
    authority:"Federal Trade Commission (FTC) / Department of Justice (DOJ)",
    law:"Sherman Antitrust Act (1890) + Clayton Act (1914) + FTC Act (1914)",
    rules:{
      "FIJACIÓN DE PRECIOS":"§1 Sherman Act — Per se illegal price-fixing agreements among competitors.",
      "ALZA SIMULTÁNEA":"§1 Sherman Act — Concerted action and conscious parallelism on pricing.",
      "PARALELISMO DE PRECIOS":"§1 Sherman Act — Plus factors indicating anticompetitive coordination.",
      "POSICIÓN DOMINANTE":"§2 Sherman Act — Monopolization or attempted monopolization.",
      "PRECIOS PREDATORIOS":"§2 Sherman Act — Predatory pricing below cost to eliminate competition.",
      "CONCENTRACIÓN":"§7 Clayton Act — Mergers and acquisitions substantially lessening competition.",
    },
    sanction:"Criminal fines up to $100M (corporations) or $1M (individuals). Up to 10 years imprisonment.",
  },
  "Canadá":{
    authority:"Competition Bureau Canada",
    law:"Competition Act (R.S.C. 1985, c. C-34)",
    rules:{
      "FIJACIÓN DE PRECIOS":"§45 Competition Act — Conspiracy to fix, maintain, or control prices.",
      "ALZA SIMULTÁNEA":"§45 Competition Act — Agreement among competitors on pricing.",
      "PARALELISMO DE PRECIOS":"§90.1 Competition Act — Civil agreements lessening competition substantially.",
      "POSICIÓN DOMINANTE":"§78-79 Competition Act — Abuse of dominant position.",
      "PRECIOS PREDATORIOS":"§78(1)(i) Competition Act — Selling articles at unreasonably low prices.",
      "CONCENTRACIÓN":"§92 Competition Act — Mergers substantially preventing or lessening competition.",
    },
    sanction:"Fines up to $25M per count. Up to 14 years imprisonment for criminal conspiracies.",
  },
  "Japón":{
    authority:"Japan Fair Trade Commission (JFTC)",
    law:"Antimonopoly Act (Act No. 54 of 1947)",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 3 AMA — Unreasonable restraint of trade through price agreements.",
      "ALZA SIMULTÁNEA":"Art. 3 AMA — Concerted pricing actions among enterprises.",
      "PARALELISMO DE PRECIOS":"Art. 3 AMA — Mutual restraint of business activities.",
      "POSICIÓN DOMINANTE":"Art. 2(5) AMA — Private monopolization through exclusion or control.",
      "PRECIOS PREDATORIOS":"Art. 2(9) AMA — Unfair trade practices including below-cost selling.",
      "CONCENTRACIÓN":"Art. 10-16 AMA — Business combination regulations.",
    },
    sanction:"Surcharges up to 10% of sales. Criminal fines up to ¥500M.",
  },
  "Corea del Sur":{
    authority:"Korea Fair Trade Commission (KFTC)",
    law:"Monopoly Regulation and Fair Trade Act (MRFTA)",
    rules:{
      "FIJACIÓN DE PRECIOS":"Art. 40 MRFTA — Cartel agreements on prices among competitors.",
      "ALZA SIMULTÁNEA":"Art. 40 MRFTA — Concerted acts restricting competition.",
      "PARALELISMO DE PRECIOS":"Art. 40 MRFTA — Presumed concerted acts with parallel behavior.",
      "POSICIÓN DOMINANTE":"Art. 5 MRFTA — Abuse of market-dominant position.",
      "PRECIOS PREDATORIOS":"Art. 5(1)(iii) MRFTA — Substantially low pricing for exclusionary purposes.",
      "CONCENTRACIÓN":"Art. 11 MRFTA — Reporting and review of business combinations.",
    },
    sanction:"Surcharges up to 20% of related sales. Criminal penalties up to KRW 200M.",
  },
  "India":{
    authority:"Competition Commission of India (CCI)",
    law:"Competition Act 2002 (amended 2023)",
    rules:{
      "FIJACIÓN DE PRECIOS":"§3(3)(a) Competition Act — Anti-competitive agreements on prices.",
      "ALZA SIMULTÁNEA":"§3(3) Competition Act — Horizontal agreements presumed to have AAEC.",
      "PARALELISMO DE PRECIOS":"§3(3) Competition Act — Concerted practices with appreciable adverse effect.",
      "POSICIÓN DOMINANTE":"§4 Competition Act — Abuse of dominant position in relevant market.",
      "PRECIOS PREDATORIOS":"§4(2)(a)(ii) Competition Act — Predatory pricing to reduce competition.",
      "CONCENTRACIÓN":"§5-6 Competition Act — Combinations requiring prior approval of CCI.",
    },
    sanction:"Penalty up to 10% of average turnover for 3 preceding years.",
  },
};

// ─── MARKETS ──────────────────────────────────────────────────────────────────
const MARKETS = {
  "Energía":{
    products:["Gasolina Regular","Gasolina Premium","ACPM / Diésel","Gas Natural"],
    companiesByCountry:{
      "Colombia":{ "Gasolina Regular":["Terpel","Biomax","Texaco","Primax","Zeuss"], "Gasolina Premium":["Terpel","Biomax","Texaco","Primax"], "ACPM / Diésel":["Terpel","Biomax","Texaco","EDS Uno"], "Gas Natural":["Gas Natural","Surtigas","Gases de Occidente"] },
      "México":{ "Gasolina Regular":["PEMEX","BP México","Shell México","Total México"], "Gasolina Premium":["PEMEX","BP México","Shell México"], "ACPM / Diésel":["PEMEX","BP México","Repsol México"], "Gas Natural":["Gas Natural Fenosa","Naturgy México","Sempra"] },
      "Brasil":{ "Gasolina Regular":["Petrobras","Shell Brasil","BP Castrol","Ipiranga"], "Gasolina Premium":["Petrobras","Shell Brasil","Ipiranga"], "ACPM / Diésel":["Petrobras","Shell Brasil","Raízen"], "Gas Natural":["Comgás","CEG","BR Distribuidora"] },
      "Argentina":{ "Gasolina Regular":["YPF","Shell Argentina","Axion Energy","Puma Energy"], "Gasolina Premium":["YPF","Shell Argentina","Axion Energy"], "ACPM / Diésel":["YPF","Shell Argentina","Axion Energy"], "Gas Natural":["Metrogas","Camuzzi Gas","Litoral Gas"] },
      "Chile":{ "Gasolina Regular":["COPEC","Shell Chile","Petrobras Chile","Terpel Chile"], "Gasolina Premium":["COPEC","Shell Chile","Petrobras Chile"], "ACPM / Diésel":["COPEC","Shell Chile","Enex"], "Gas Natural":["GasValpo","Metrogas","GasSur"] },
      "España":{ "Gasolina Regular":["Repsol","Cepsa","BP España","Galp"], "Gasolina Premium":["Repsol","Cepsa","BP España"], "ACPM / Diésel":["Repsol","Cepsa","Total España"], "Gas Natural":["Naturgy","Endesa Gas","Iberdrola Gas"] },
      "Estados Unidos":{ "Gasolina Regular":["ExxonMobil","Shell USA","Chevron","BP America"], "Gasolina Premium":["ExxonMobil","Shell USA","Chevron"], "ACPM / Diésel":["ExxonMobil","Shell USA","Valero"], "Gas Natural":["Dominion Energy","Con Edison","Sempra"] },
      "default":{ "Gasolina Regular":["Empresa A","Empresa B","Empresa C","Empresa D"], "Gasolina Premium":["Empresa A","Empresa B","Empresa C"], "ACPM / Diésel":["Empresa A","Empresa B","Empresa C"], "Gas Natural":["Empresa A","Empresa B","Empresa C"] },
    },
  },
  "Telecomunicaciones":{
    products:["Internet Hogar 100Mbps","Telefonía Móvil Postpago","TV por Suscripción"],
    companiesByCountry:{
      "Colombia":{ "Internet Hogar 100Mbps":["Claro","Movistar","ETB","Tigo","Une"], "Telefonía Móvil Postpago":["Claro","Movistar","Tigo","WOM"], "TV por Suscripción":["Claro","Movistar","DirecTV","Tigo"] },
      "México":{ "Internet Hogar 100Mbps":["Telmex","Izzi","Totalplay","Megacable"], "Telefonía Móvil Postpago":["Telcel","AT&T México","Movistar México"], "TV por Suscripción":["Izzi","Totalplay","Sky México","Megacable"] },
      "Brasil":{ "Internet Hogar 100Mbps":["Claro Brasil","Vivo","NET","Oi"], "Telefonía Móvil Postpago":["Vivo","Claro Brasil","TIM","Oi"], "TV por Suscripción":["Sky Brasil","Claro TV","Vivo TV","NET"] },
      "Argentina":{ "Internet Hogar 100Mbps":["Telecom","Fibertel","Personal","Movistar Argentina"], "Telefonía Móvil Postpago":["Claro Argentina","Personal","Movistar Argentina"], "TV por Suscripción":["DirecTV Argentina","Cablevisión","Telecentro"] },
      "España":{ "Internet Hogar 100Mbps":["Movistar España","Orange España","Vodafone España","MásMóvil"], "Telefonía Móvil Postpago":["Movistar España","Orange España","Vodafone España","Yoigo"], "TV por Suscripción":["Movistar+","Orange TV","Vodafone TV","DAZN"] },
      "Estados Unidos":{ "Internet Hogar 100Mbps":["Comcast Xfinity","AT&T","Verizon","Charter Spectrum"], "Telefonía Móvil Postpago":["Verizon","AT&T","T-Mobile","Dish"], "TV por Suscripción":["Comcast","DirecTV USA","Dish Network","YouTube TV"] },
      "default":{ "Internet Hogar 100Mbps":["Operador A","Operador B","Operador C","Operador D"], "Telefonía Móvil Postpago":["Operador A","Operador B","Operador C"], "TV por Suscripción":["Operador A","Operador B","Operador C"] },
    },
  },
  "Alimentos":{
    products:["Pollo Entero","Aceite Vegetal 1L","Leche 1L","Arroz 1kg"],
    companiesByCountry:{
      "Colombia":{ "Pollo Entero":["Éxito","Jumbo","Carulla","D1","Ara"], "Aceite Vegetal 1L":["Éxito","Jumbo","D1","Ara"], "Leche 1L":["Éxito","Jumbo","D1","Olímpica"], "Arroz 1kg":["Éxito","Jumbo","D1","La 14"] },
      "México":{ "Pollo Entero":["Walmart México","Soriana","Chedraui","La Comer"], "Aceite Vegetal 1L":["Walmart México","Soriana","Chedraui"], "Leche 1L":["Walmart México","Soriana","Oxxo"], "Arroz 1kg":["Walmart México","Soriana","Chedraui"] },
      "Brasil":{ "Pollo Entero":["Carrefour Brasil","GPA","Assaí","Atacadão"], "Aceite Vegetal 1L":["Carrefour Brasil","GPA","Sonda"], "Leche 1L":["Carrefour Brasil","GPA","Assaí"], "Arroz 1kg":["Carrefour Brasil","GPA","Atacadão"] },
      "España":{ "Pollo Entero":["Mercadona","Carrefour España","Lidl España","Eroski"], "Aceite Vegetal 1L":["Mercadona","Carrefour España","Lidl España"], "Leche 1L":["Mercadona","Carrefour España","Dia"], "Arroz 1kg":["Mercadona","Carrefour España","Lidl España"] },
      "Estados Unidos":{ "Pollo Entero":["Walmart USA","Kroger","Costco","Target"], "Aceite Vegetal 1L":["Walmart USA","Kroger","Whole Foods"], "Leche 1L":["Walmart USA","Kroger","Aldi USA"], "Arroz 1kg":["Walmart USA","Kroger","Costco"] },
      "default":{ "Pollo Entero":["Cadena A","Cadena B","Cadena C","Cadena D"], "Aceite Vegetal 1L":["Cadena A","Cadena B","Cadena C"], "Leche 1L":["Cadena A","Cadena B","Cadena C"], "Arroz 1kg":["Cadena A","Cadena B","Cadena C"] },
    },
  },
  "Seguros":{
    products:["Seguro Auto Básico","Seguro de Vida","SOAT / Seguro Obligatorio"],
    companiesByCountry:{
      "Colombia":{ "Seguro Auto Básico":["Sura","Bolívar","Allianz","Mapfre"], "Seguro de Vida":["Sura","Bolívar","MetLife","Suramericana"], "SOAT / Seguro Obligatorio":["Sura","Bolívar","Allianz","Mapfre","Axa"] },
      "México":{ "Seguro Auto Básico":["GNP","AXA México","Qualitas","HDI Seguros"], "Seguro de Vida":["MetLife México","GNP","Banamex Seguros"], "SOAT / Seguro Obligatorio":["GNP","Qualitas","HDI Seguros","Mapfre México"] },
      "Brasil":{ "Seguro Auto Básico":["Porto Seguro","Bradesco Seguros","Itaú Seguros","Allianz Brasil"], "Seguro de Vida":["Bradesco Seguros","Itaú Seguros","SulAmérica"], "SOAT / Seguro Obligatorio":["Porto Seguro","Mapfre Brasil","Allianz Brasil"] },
      "España":{ "Seguro Auto Básico":["Mapfre España","Allianz España","AXA España","Generali España"], "Seguro de Vida":["Mapfre España","AXA España","Catalana Occidente"], "SOAT / Seguro Obligatorio":["Mapfre España","Allianz España","AXA España","Zurich"] },
      "Estados Unidos":{ "Seguro Auto Básico":["State Farm","Geico","Progressive","Allstate"], "Seguro de Vida":["MetLife USA","Prudential","New York Life"], "SOAT / Seguro Obligatorio":["State Farm","Geico","Progressive","Liberty Mutual"] },
      "default":{ "Seguro Auto Básico":["Aseguradora A","Aseguradora B","Aseguradora C"], "Seguro de Vida":["Aseguradora A","Aseguradora B","Aseguradora C"], "SOAT / Seguro Obligatorio":["Aseguradora A","Aseguradora B","Aseguradora C"] },
    },
  },
};

// Price multipliers by country (relative to base)
const PRICE_MULT = {
  "Colombia":1,"México":1.2,"Brasil":1.3,"Argentina":0.9,"Chile":1.1,"Perú":0.85,
  "España":1.8,"Francia":1.9,"Alemania":1.85,"Italia":1.75,"Reino Unido":2.1,
  "Estados Unidos":2.2,"Canadá":2.0,"Japón":2.5,"Corea del Sur":1.7,"India":0.4,
};

const BASE_PRICES = {
  "Gasolina Regular":9600,"Gasolina Premium":11200,"ACPM / Diésel":9100,"Gas Natural":3200,
  "Internet Hogar 100Mbps":87000,"Telefonía Móvil Postpago":65000,"TV por Suscripción":72000,
  "Pollo Entero":9200,"Aceite Vegetal 1L":8900,"Leche 1L":3400,"Arroz 1kg":4100,
  "Seguro Auto Básico":1820000,"Seguro de Vida":980000,"SOAT / Seguro Obligatorio":580000,
};

const UNITS = {
  "Gasolina Regular":"litro","Gasolina Premium":"litro","ACPM / Diésel":"litro","Gas Natural":"m³",
  "Internet Hogar 100Mbps":"mes","Telefonía Móvil Postpago":"mes","TV por Suscripción":"mes",
  "Pollo Entero":"kg","Aceite Vegetal 1L":"und","Leche 1L":"und","Arroz 1kg":"und",
  "Seguro Auto Básico":"año","Seguro de Vida":"año","SOAT / Seguro Obligatorio":"año",
};

// ─── DATA GENERATION ──────────────────────────────────────────────────────────
function seeded(seed){ let s=seed; return ()=>{ s=(s*1664525+1013904223)&0xffffffff; return Math.abs(s)/0x7fffffff; }; }

function getCompanies(market, product, country){
  const byCountry = MARKETS[market]?.companiesByCountry;
  return (byCountry?.[country]?.[product] || byCountry?.["default"]?.[product] || ["Empresa A","Empresa B","Empresa C"]);
}

function generateData(product, companies, country, region){
  const base = (BASE_PRICES[product]||10000) * (PRICE_MULT[country]||1);
  const seed = product.length*31 + (country||"X").length*17 + (region||"Y").length*13 + companies.length*7;
  const rng  = seeded(seed);
  const cartel = seed%3===0;
  const refPrice = base*(1+(rng()-0.5)*0.06);
  const MONTHS = ["Nov","Dic","Ene","Feb","Mar","Abr","May"];
  return companies.map((company,i)=>{
    const r = seeded(seed+i*100+company.charCodeAt(0));
    const prevBase = base*(0.82+r()*0.1);
    const price = cartel ? refPrice*(1+(r()-0.5)*0.004) : base*(0.9+r()*0.2);
    const history = MONTHS.map((m,mi)=>{
      const hr = seeded(seed+i*100+mi*13);
      const p = cartel ? base*(0.85+mi*0.025)*(1+(hr()-0.5)*0.005) : base*(0.82+mi*0.02+(hr()-0.5)*0.05);
      return { month:m, price:Math.round(p) };
    });
    return { company, price:Math.round(price), prevPrice:Math.round(prevBase),
      history, marketShare:Math.round(8+r()*25), complaints:Math.round(r()*40), changeFreq:Math.round(1+r()*8) };
  });
}

// ─── PATTERN DETECTION ────────────────────────────────────────────────────────
function detectPatterns(data, country){
  if(!data||data.length<2) return { alerts:[], risk:{level:"N/A",score:0,color:C.t3}, variancePct:0, changePct:0, avg:0, max:0, min:0 };
  const lf = LEGAL_FRAMEWORKS[country] || LEGAL_FRAMEWORKS["Colombia"];
  const prices=data.map(d=>d.price), prevs=data.map(d=>d.prevPrice);
  const avg=prices.reduce((a,b)=>a+b,0)/prices.length;
  const avgPrev=prevs.reduce((a,b)=>a+b,0)/prevs.length;
  const max=Math.max(...prices), min=Math.min(...prices);
  const variancePct=((max-min)/avg)*100;
  const changePct=((avg-avgPrev)/avgPrev)*100;
  const allUp=data.every(d=>d.price>d.prevPrice);
  const maxShare=Math.max(...data.map(d=>d.marketShare));
  const top2=[...data.map(d=>d.marketShare)].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);
  const alerts=[]; let score=0;

  if(variancePct<0.5&&data.length>=3){ alerts.push({ type:"FIJACIÓN DE PRECIOS",sev:"CRÍTICA",icon:"🔴",color:C.red, desc:`Dispersión de solo ${variancePct.toFixed(2)}% entre ${data.length} competidores. Coordinación horizontal altamente probable.`, legal:lf.rules?.["FIJACIÓN DE PRECIOS"]||"", action:"Iniciar investigación formal. Solicitar información sobre comunicaciones entre empresas. Revisar actas de gremios.", probability:"Muy Alta (>80%)", sanction:lf.sanction||"Consultar marco legal local." }); score+=45; }
  if(allUp&&changePct>10){ alerts.push({ type:"ALZA SIMULTÁNEA",sev:changePct>20?"CRÍTICA":"ALTA",icon:"🟠",color:changePct>20?C.red:C.amber, desc:`Todos los actores incrementaron precios ${changePct.toFixed(1)}% simultáneamente. Posible señalización o acuerdo tácito.`, legal:lf.rules?.["ALZA SIMULTÁNEA"]||"", action:"Verificar si existieron comunicados de prensa, reuniones gremiales o declaraciones públicas previas al alza.", probability:changePct>20?"Alta (60-80%)":"Media (40-60%)", sanction:lf.sanction||"Consultar marco legal local." }); score+=changePct>20?35:20; }
  if(variancePct>=0.5&&variancePct<2&&data.length>=3){ alerts.push({ type:"PARALELISMO DE PRECIOS",sev:"MEDIA",icon:"🟡",color:C.amber, desc:`Diferencia máxima entre actores: ${variancePct.toFixed(2)}%. Comportamiento paralelo sin justificación estructural evidente.`, legal:lf.rules?.["PARALELISMO DE PRECIOS"]||"", action:"Analizar si la uniformidad obedece a costos homogéneos, regulación tarifaria o factores de mercado legítimos.", probability:"Media (30-50%)", sanction:lf.sanction||"Consultar marco legal local." }); score+=12; }
  if(maxShare>60){ const dom=data.find(d=>d.marketShare===maxShare); alerts.push({ type:"POSICIÓN DOMINANTE",sev:"ALTA",icon:"🔵",color:C.blue, desc:`${dom.company} concentra el ${maxShare}% del mercado. Posible abuso si impone condiciones desventajosas.`, legal:lf.rules?.["POSICIÓN DOMINANTE"]||"", action:"Investigar si impone precios excesivos, condiciona ventas o discrimina clientes sin justificación objetiva.", probability:"Media-Alta (50-70%)", sanction:lf.sanction||"Consultar marco legal local." }); score+=18; }
  data.filter(d=>d.price<avg*0.75).forEach(d=>{ alerts.push({ type:"PRECIOS PREDATORIOS",sev:"ALTA",icon:"⚡",color:C.purple, desc:`${d.company} vende ${(((avg-d.price)/avg)*100).toFixed(1)}% por debajo del promedio. Posible estrategia para excluir rivales.`, legal:lf.rules?.["PRECIOS PREDATORIOS"]||"", action:"Solicitar estructura de costos. Verificar si el precio cubre al menos el costo variable medio.", probability:"Media (35-55%)", sanction:lf.sanction||"Consultar marco legal local." }); score+=20; });
  if(top2>80&&data.length>=3){ alerts.push({ type:"CONCENTRACIÓN",sev:"MEDIA",icon:"🔶",color:"#f97316", desc:`Las 2 empresas más grandes concentran el ${top2}% del mercado. Estructura oligopólica con alto riesgo de coordinación.`, legal:lf.rules?.["CONCENTRACIÓN"]||"", action:"Revisar historia de adquisiciones. Evaluar barreras de entrada. Monitorear operaciones de integración futuras.", probability:"Media (30-45%)", sanction:lf.sanction||"Consultar marco legal local." }); score+=10; }

  let level,color;
  if(score>=55){level="CRÍTICO";color=C.red;}
  else if(score>=35){level="ALTO";color=C.amber;}
  else if(score>=15){level="MEDIO";color:"#f59e0b";color="#f59e0b";}
  else{level="BAJO";color=C.green;}
  return { alerts,risk:{level,score,color},variancePct,changePct,avg,max,min };
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Badge=({label,color})=>(
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,
    padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:.8,fontFamily:"monospace",whiteSpace:"nowrap"}}>{label}</span>
);
const SectionTitle=({children})=>(
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
    <div style={{height:1,flex:1,background:`linear-gradient(90deg,${C.gold}55,transparent)`}}/>
    <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span>
    <div style={{height:1,flex:1,background:`linear-gradient(270deg,${C.gold}55,transparent)`}}/>
  </div>
);
function StatCard({icon,label,value,sub,color,delay=0}){
  return(
    <div style={{background:C.card,border:`1px solid ${color}33`,borderRadius:12,padding:"16px 18px",animation:`fadeUp .5s ease ${delay}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <span style={{fontSize:10,color:C.t3,letterSpacing:.8,textTransform:"uppercase"}}>{label}</span>
        <span style={{fontSize:18}}>{icon}</span>
      </div>
      <div style={{fontSize:22,fontWeight:800,color,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.t3}}>{sub}</div>}
    </div>
  );
}
function CTip({children,color}){
  const col=color||C.gold;
  return <div style={{background:col+"11",border:`1px solid ${col}33`,borderRadius:8,padding:"10px 14px",fontSize:12,color:col,lineHeight:1.6,marginBottom:12}}>{children}</div>;
}
function CTooltip({active,payload,label,unit}){
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",fontSize:12}}>
      <div style={{color:C.t2,marginBottom:6,fontWeight:600}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{color:p.color||C.gold,marginBottom:2}}>{p.name}: <b>{p.value?.toLocaleString()}</b>{unit&&` / ${unit}`}</div>)}
    </div>
  );
}

function AlertCard({a,expanded,onToggle}){
  return(
    <div style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,marginBottom:10,overflow:"hidden"}}>
      <div onClick={onToggle} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12}}>
        <span style={{fontSize:20,marginTop:1}}>{a.icon}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
            <span style={{color:a.color,fontWeight:700,fontSize:13}}>{a.type}</span>
            <Badge label={`SEVERIDAD: ${a.sev}`} color={a.color}/>
            <Badge label={`PROBABILIDAD: ${a.probability}`} color={a.color}/>
          </div>
          <p style={{color:C.t2,fontSize:12,margin:0,lineHeight:1.6}}>{a.desc}</p>
        </div>
        <span style={{color:C.t3,fontSize:14,marginTop:2,userSelect:"none",flexShrink:0}}>{expanded?"▲":"▼"}</span>
      </div>
      {expanded&&(
        <div style={{borderTop:`1px solid ${a.color}22`,padding:"16px 18px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>⚖️ BASE LEGAL</div><div style={{fontSize:12,color:a.color,lineHeight:1.7}}>{a.legal}</div></div>
          <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>🔍 ACCIÓN RECOMENDADA</div><div style={{fontSize:12,color:C.t2,lineHeight:1.7}}>{a.action}</div></div>
          <div><div style={{fontSize:9,color:C.t3,letterSpacing:1,marginBottom:6,fontWeight:700}}>💰 SANCIONES APLICABLES</div><div style={{fontSize:12,color:C.t2,lineHeight:1.7}}>{a.sanction}</div></div>
        </div>
      )}
    </div>
  );
}

// ─── GEO FILTER PANEL ─────────────────────────────────────────────────────────
function FilterPanel({filters,onChange}){
  const {region_group,country,region,market,product,company,dateFrom,dateTo,hourFrom,hourTo}=filters;
  const countryData=GEO[region_group]?.countries[country];
  const regions=countryData?.regions||["Nacional"];
  const currency=countryData?.currency||"USD";
  const flag=countryData?.flag||"🌍";
  const products=MARKETS[market]?.products||[];
  const companies=getCompanies(market,product,country);

  const sel=(key,val)=>{
    const n={...filters,[key]:val};
    if(key==="region_group"){ const firstC=Object.keys(GEO[val]?.countries||{})[0]; n.country=firstC||""; n.region="Nacional"; n.company="Todas"; }
    if(key==="country"){ n.region="Nacional"; n.company="Todas"; }
    if(key==="market"){ n.product=MARKETS[val]?.products[0]||""; n.company="Todas"; }
    if(key==="product"){ n.company="Todas"; }
    onChange(n);
  };

  const L=({c})=><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:5,textTransform:"uppercase"}}>{c}</div>;
  const Sel=({value,opts,k,renderOpt})=>(
    <select value={value} onChange={e=>sel(k,e.target.value)}
      style={{width:"100%",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
      {opts.map(o=><option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value}>{renderOpt?renderOpt(o):o}</option>)}
    </select>
  );
  const DI=({label,val,k})=>(<div style={{flex:1}}><L c={label}/><input type="date" value={val} onChange={e=>sel(k,e.target.value)} style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none"}}/></div>);
  const TI=({label,val,k})=>(<div style={{flex:1}}><L c={label}/><input type="time" value={val} onChange={e=>sel(k,e.target.value)} style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none"}}/></div>);

  const allCountries=Object.entries(GEO).flatMap(([rg,v])=>Object.keys(v.countries).map(c=>({rg,c,flag:v.countries[c].flag})));

  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:26}}>
      <SectionTitle>Filtros de Consulta</SectionTitle>

      {/* Region group tabs */}
      <div style={{marginBottom:16}}>
        <L c="Región del mundo"/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(GEO).map(([rg,v])=>(
            <button key={rg} onClick={()=>sel("region_group",rg)}
              style={{background:region_group===rg?C.gold+"22":"transparent",border:`1px solid ${region_group===rg?C.gold:C.borderHi}`,
                borderRadius:8,padding:"7px 14px",color:region_group===rg?C.gold:C.t3,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all .2s",fontWeight:region_group===rg?700:400}}>
              {v.flag} {rg}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:16}}>
        <div>
          <L c="País"/>
          <select value={country} onChange={e=>{
            const found=allCountries.find(x=>x.c===e.target.value);
            if(found&&found.rg!==region_group) sel("region_group",found.rg);
            sel("country",e.target.value);
          }} style={{width:"100%",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
            {Object.keys(GEO[region_group]?.countries||{}).map(c=>(
              <option key={c} value={c}>{GEO[region_group].countries[c].flag} {c}</option>
            ))}
          </select>
        </div>
        <div><L c="Territorio / Ciudad"/><Sel value={region} opts={regions} k="region"/></div>
        <div><L c="Mercado"/><Sel value={market} opts={Object.keys(MARKETS)} k="market"/></div>
        <div><L c="Producto / Servicio"/><Sel value={product} opts={products} k="product"/></div>
        <div><L c="Empresa"/><Sel value={company} opts={["Todas",...companies]} k="company"/></div>
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <DI label="Fecha desde" val={dateFrom} k="dateFrom"/>
        <DI label="Fecha hasta" val={dateTo} k="dateTo"/>
        <TI label="Hora desde" val={hourFrom} k="hourFrom"/>
        <TI label="Hora hasta" val={hourTo} k="hourTo"/>
      </div>

      {/* Authority info */}
      {LEGAL_FRAMEWORKS[country]&&(
        <div style={{marginTop:14,background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",
          display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:16}}>{flag}</span>
          <div>
            <span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>AUTORIDAD COMPETENTE: </span>
            <span style={{fontSize:11,color:C.teal,fontWeight:700}}>{LEGAL_FRAMEWORKS[country].authority}</span>
          </div>
          <div style={{marginLeft:"auto"}}>
            <span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>MARCO LEGAL: </span>
            <span style={{fontSize:11,color:C.gold,fontWeight:700}}>{LEGAL_FRAMEWORKS[country].law}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ALERTS PANEL ─────────────────────────────────────────────────────────────
function AlertsPanel({alerts,country,emailConfig,onEmailConfig}){
  const [expanded,setExpanded]=useState(null);
  const [emailInput,setEmailInput]=useState(emailConfig.email||"");
  const [saved,setSaved]=useState(false);
  const [thresholds,setThresholds]=useState({fijacion:true,alza:true,paralelismo:true,dominancia:true,predatorio:true,concentracion:false});
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  const crit=alerts.filter(a=>a.sev==="CRÍTICA"),high=alerts.filter(a=>a.sev==="ALTA"),med=alerts.filter(a=>a.sev==="MEDIA");
  const save=()=>{onEmailConfig({email:emailInput});setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const Toggle=({label,k,color=C.teal})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.border}22`}}>
      <span style={{fontSize:12,color:C.t2}}>{label}</span>
      <div onClick={()=>setThresholds(p=>({...p,[k]:!p[k]}))} style={{width:40,height:22,borderRadius:11,cursor:"pointer",transition:"all .2s",background:thresholds[k]?color+"44":C.t4,border:`1px solid ${thresholds[k]?color:C.borderHi}`,position:"relative"}}>
        <div style={{width:16,height:16,borderRadius:"50%",position:"absolute",top:2,left:thresholds[k]?20:2,transition:"left .2s",background:thresholds[k]?color:C.t3}}/>
      </div>
    </div>
  );
  return(
    <div>
      {alerts.length>0?(
        <div style={{marginBottom:28}}>
          <SectionTitle>Alertas Activas — {alerts.length} detección{alerts.length!==1?"es":""}</SectionTitle>
          <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            {[{label:"CRÍTICAS",count:crit.length,color:C.red},{label:"ALTAS",count:high.length,color:C.amber},{label:"MEDIAS",count:med.length,color:"#f59e0b"}].map(s=>(
              <div key={s.label} style={{background:s.color+"11",border:`1px solid ${s.color}33`,borderRadius:10,padding:"12px 20px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:26,fontWeight:800,color:s.color}}>{s.count}</span>
                <span style={{fontSize:10,color:s.color,fontWeight:700,letterSpacing:.8}}>{s.label}</span>
              </div>
            ))}
            <div style={{background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:10,padding:"12px 20px"}}>
              <div style={{fontSize:9,color:C.t3,letterSpacing:.8,marginBottom:2}}>JURISDICCIÓN</div>
              <div style={{fontSize:11,color:C.teal,fontWeight:700}}>{lf.authority}</div>
            </div>
          </div>
          {alerts.map((a,i)=><AlertCard key={i} a={a} expanded={expanded===i} onToggle={()=>setExpanded(expanded===i?null:i)}/>)}
        </div>
      ):(
        <CTip color={C.green}>✅ No se detectaron prácticas restrictivas en el mercado seleccionado. El comportamiento de precios es consistente con competencia normal.</CTip>
      )}

      <SectionTitle>Canales de Notificación</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>📧</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>Correo electrónico</span><Badge label="Activo" color={C.teal}/></div>
          <input value={emailInput} onChange={e=>{setEmailInput(e.target.value);setSaved(false);}} placeholder="tu@correo.com" type="email" style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",marginBottom:10}}/>
          <button onClick={save} style={{width:"100%",background:saved?C.green+"22":C.gold+"22",border:`1px solid ${saved?C.green:C.gold}`,borderRadius:8,padding:"9px",color:saved?C.green:C.gold,fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:700}}>{saved?"✓ Configurado":"Activar alertas por email"}</button>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.teal}33`,borderRadius:12,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>🔔</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>Notificación en app</span><Badge label="Siempre activo" color={C.teal}/></div>
          <p style={{fontSize:12,color:C.t3,lineHeight:1.7,margin:"0 0 10px"}}>Las alertas se actualizan automáticamente al cambiar los filtros. El indicador en el header refleja el estado en tiempo real.</p>
          <div style={{background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.teal}}>✓ Sin configuración requerida</div>
        </div>
        {[{icon:"💬",name:"WhatsApp"},{icon:"✈️",name:"Telegram"}].map(ch=>(
          <div key={ch.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>{ch.icon}</span><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{ch.name}</span><Badge label="Próximamente" color={C.t3}/></div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.t4,fontSize:12,marginBottom:10}}>Disponible en v2.0</div>
            <button disabled style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px",color:C.t4,fontSize:12,fontFamily:"inherit",cursor:"not-allowed"}}>En desarrollo</button>
          </div>
        ))}
      </div>

      <SectionTitle>Umbrales de Detección</SectionTitle>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <Toggle label="🔴 Fijación de precios — dispersión menor al 0.5%" k="fijacion" color={C.red}/>
        <Toggle label="🟠 Alza simultánea — todos los actores suben más del 10%" k="alza" color={C.amber}/>
        <Toggle label="🟡 Paralelismo de precios — dispersión entre 0.5% y 2%" k="paralelismo" color={C.amber}/>
        <Toggle label="🔵 Posición dominante — cuota de mercado superior al 60%" k="dominancia" color={C.blue}/>
        <Toggle label="⚡ Precios predatorios — precio menor al 75% del promedio" k="predatorio" color={C.purple}/>
        <Toggle label="🔶 Alta concentración — top 2 empresas superan el 80%" k="concentracion" color="#f97316"/>
      </div>
    </div>
  );
}

// ─── COMPARISON STATS ─────────────────────────────────────────────────────────
function ComparisonStats({data,selectedCompany,analysis,unit}){
  if(!data.length) return null;
  const avg=analysis.avg||0;
  const sorted=[...data].sort((a,b)=>a.price-b.price);
  const PALETTE=[C.gold,C.teal,C.red,C.blue,C.purple,"#f97316"];
  const barData=data.map(d=>({name:d.company,price:d.price,prevPrice:d.prevPrice,diff:+(((d.price-avg)/avg)*100).toFixed(1)}));
  const histData=(data[0]?.history||[]).map((h,i)=>({month:h.month,...Object.fromEntries(data.map(d=>[d.company,d.history[i]?.price]))}));
  return(
    <div style={{animation:"fadeUp .5s ease .15s both"}}>
      <SectionTitle>Comparativa entre Competidores</SectionTitle>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:20}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:10,color:C.t3,letterSpacing:.8}}>RANKING DE PRECIOS — menor a mayor</span>
          <span style={{fontSize:10,color:C.t4}}>Promedio: {Math.round(avg).toLocaleString()} / {unit}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["#","EMPRESA","PRECIO","ANTERIOR","VARIACIÓN","vs PROMEDIO","CUOTA","QUEJAS"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:C.t3,fontWeight:700,letterSpacing:.8}}>{h}</th>)}</tr></thead>
          <tbody>
            {sorted.map((row,i)=>{
              const chg=((row.price-row.prevPrice)/row.prevPrice)*100,dAvg=((row.price-avg)/avg)*100,isSel=row.company===selectedCompany;
              return(<tr key={row.company} style={{borderBottom:`1px solid ${C.border}22`,background:isSel?C.goldGlow:"transparent"}}>
                <td style={{padding:"10px 14px",fontSize:13,color:C.t3,fontWeight:700}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</td>
                <td style={{padding:"10px 14px",fontSize:13,fontWeight:700,color:isSel?C.gold:C.t1}}>{row.company}{isSel&&<span style={{fontSize:9,color:C.gold}}> ◀</span>}</td>
                <td style={{padding:"10px 14px",fontSize:13,color:C.teal,fontWeight:700}}>{row.price.toLocaleString()}</td>
                <td style={{padding:"10px 14px",fontSize:12,color:C.t3}}>{row.prevPrice.toLocaleString()}</td>
                <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(chg)>15?C.red:Math.abs(chg)>5?C.amber:C.green}}>{chg>0?"+":""}{chg.toFixed(1)}%</td>
                <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(dAvg)>5?C.amber:C.green}}>{dAvg>0?"+":""}{dAvg.toFixed(1)}%</td>
                <td style={{padding:"10px 14px"}}><Badge label={`${row.marketShare}%`} color={C.blue}/></td>
                <td style={{padding:"10px 14px"}}><Badge label={row.complaints} color={row.complaints>25?C.red:row.complaints>10?C.amber:C.green}/></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
          <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>PRECIO ACTUAL vs ANTERIOR</div>
          <ResponsiveContainer width="100%" height={190}><BarChart data={barData} barGap={3}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/><Bar dataKey="prevPrice" fill={C.t4} name="Anterior" radius={[3,3,0,0]}/><Bar dataKey="price" fill={C.gold} name="Actual" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
          <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>DESVIACIÓN VS PROMEDIO DE MERCADO</div>
          <ResponsiveContainer width="100%" height={190}><BarChart data={barData}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/><Tooltip formatter={v=>[`${v}%`,"Desv. del promedio"]}/><ReferenceLine y={0} stroke={C.t3} strokeDasharray="4 4"/><Bar dataKey="diff" fill={C.teal} name="Desviación %" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:18}}>
        <div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>EVOLUCIÓN HISTÓRICA COMPARADA (7 MESES)</div>
        <ResponsiveContainer width="100%" height={200}><LineChart data={histData}><CartesianGrid stroke={C.border} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:C.t3,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/>{data.map((d,i)=><Line key={d.company} type="monotone" dataKey={d.company} stroke={PALETTE[i%PALETTE.length]} strokeWidth={d.company===selectedCompany?3:1.5} strokeDasharray={d.company===selectedCompany?"":"5 3"} dot={false} name={d.company}/>)}</LineChart></ResponsiveContainer>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:10}}>
          {data.map((d,i)=><div key={d.company} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:18,height:2,background:PALETTE[i%PALETTE.length],borderRadius:2,opacity:d.company===selectedCompany?1:.5}}/><span style={{fontSize:10,color:d.company===selectedCompany?C.gold:C.t3}}>{d.company}{d.company===selectedCompany?" ◀":""}</span></div>)}
        </div>
      </div>
    </div>
  );
}

// ─── RISK PANEL ───────────────────────────────────────────────────────────────
function RiskPanel({analysis,onGoToAlerts,country}){
  if(!analysis) return null;
  const {alerts,risk,variancePct,changePct,avg,max,min}=analysis;
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  return(
    <div style={{animation:"fadeUp .5s ease both"}}>
      <SectionTitle>Estadísticas de Riesgo Anticompetitivo</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:14,marginBottom:22}}>
        <StatCard icon="🎯" label="Nivel de riesgo" value={risk.level} sub={`Score: ${risk.score}/100`} color={risk.color}/>
        <StatCard icon="📐" label="Dispersión mercado" value={`${variancePct?.toFixed(2)||"—"}%`} sub="entre competidores" color={variancePct<1?C.red:variancePct<3?C.amber:C.green} delay={.05}/>
        <StatCard icon="📈" label="Variación media" value={`${changePct>0?"+":""}${changePct?.toFixed(1)||"—"}%`} sub="vs período anterior" color={Math.abs(changePct)>15?C.red:Math.abs(changePct)>5?C.amber:C.green} delay={.1}/>
        <StatCard icon="⬆️" label="Precio máximo" value={max?.toLocaleString()||"—"} sub="más caro del mercado" color={C.red} delay={.15}/>
        <StatCard icon="⬇️" label="Precio mínimo" value={min?.toLocaleString()||"—"} sub="más barato del mercado" color={C.green} delay={.2}/>
        <StatCard icon="➗" label="Precio promedio" value={Math.round(avg||0).toLocaleString()} sub="media del mercado" color={C.blue} delay={.25}/>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:10,padding:"12px 16px",marginBottom:18,display:"flex",gap:16,flexWrap:"wrap"}}>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>AUTORIDAD: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{lf.authority}</span></div>
        <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>LEY: </span><span style={{fontSize:11,color:C.gold,fontWeight:600}}>{lf.law}</span></div>
      </div>
      {alerts.length>0?(
        <div>
          {alerts.map((a,i)=>(
            <div key={i} style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,padding:"13px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>{a.icon}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{color:a.color,fontWeight:700,fontSize:13}}>{a.type}</span>
                  <Badge label={a.sev} color={a.color}/>
                  <Badge label={a.probability} color={a.color}/>
                </div>
                <p style={{color:C.t2,fontSize:12,margin:0,lineHeight:1.5}}>{a.desc}</p>
              </div>
              <button onClick={onGoToAlerts} style={{background:"transparent",border:`1px solid ${a.color}44`,borderRadius:7,padding:"6px 12px",color:a.color,fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>Ver detalle →</button>
            </div>
          ))}
        </div>
      ):(
        <CTip color={C.green}>✅ No se detectaron patrones restrictivos en los datos actuales del mercado seleccionado.</CTip>
      )}
    </div>
  );
}

// ─── AI ANALYSIS ──────────────────────────────────────────────────────────────
function AIAnalysis({data,analysis,product,country,region,unit}){
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  const lf=LEGAL_FRAMEWORKS[country]||LEGAL_FRAMEWORKS["Colombia"];
  const Dot=({delay})=><span style={{width:7,height:7,borderRadius:"50%",background:C.gold,display:"inline-block",animation:`pulse 1.2s ease-in-out ${delay}s infinite`}}/>;
  const run=async()=>{
    if(!data.length) return;
    setLoading(true);setText("");
    const prompt=`Eres un experto en derecho de la competencia internacional. Analiza los siguientes datos de mercado bajo el marco legal de ${country}:

JURISDICCIÓN: ${country}
AUTORIDAD COMPETENTE: ${lf.authority}
MARCO LEGAL: ${lf.law}
PRODUCTO: ${product} | TERRITORIO: ${region} | UNIDAD: ${unit}

DATOS POR EMPRESA:
${data.map(d=>`- ${d.company}: precio ${d.price.toLocaleString()} (ant: ${d.prevPrice.toLocaleString()}, var: ${(((d.price-d.prevPrice)/d.prevPrice)*100).toFixed(1)}%, cuota: ${d.marketShare}%, quejas: ${d.complaints})`).join("\n")}

ESTADÍSTICAS:
- Dispersión entre competidores: ${analysis.variancePct?.toFixed(2)}%
- Variación promedio de precios: ${analysis.changePct?.toFixed(1)}%
- Nivel de riesgo: ${analysis.risk?.level} (score ${analysis.risk?.score}/100)
- Alertas detectadas: ${analysis.alerts?.map(a=>a.type).join(", ")||"Ninguna"}

ARTÍCULOS APLICABLES:
${Object.entries(lf.rules||{}).map(([k,v])=>`- ${k}: ${v}`).join("\n")}

Genera un dictamen técnico-jurídico con:
1. Diagnóstico económico del mercado en ${country} (2 párrafos)
2. Prácticas restrictivas identificadas con artículos exactos de ${lf.law}
3. Probabilidad de infracción por cada práctica detectada
4. Recomendaciones de investigación priorizadas para ${lf.authority}
5. Sanciones aplicables según ${lf.law}

Usa terminología jurídica precisa del sistema legal de ${country}.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();
      setText(d.content?.map(b=>b.text||"").join("")||"Error al obtener análisis.");
    }catch{setText("Error de conexión con la API.");}
    finally{setLoading(false);}
  };
  return(
    <div>
      <SectionTitle>Dictamen Jurídico con IA</SectionTitle>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:20}}>
        <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:16,flexWrap:"wrap"}}>
          <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>JURISDICCIÓN: </span><span style={{fontSize:11,color:C.teal,fontWeight:700}}>{country}</span></div>
          <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>AUTORIDAD: </span><span style={{fontSize:11,color:C.gold,fontWeight:700}}>{lf.authority}</span></div>
          <div><span style={{fontSize:9,color:C.t3,letterSpacing:.8}}>LEY: </span><span style={{fontSize:11,color:C.t2}}>{lf.law}</span></div>
        </div>
        <p style={{color:C.t2,fontSize:13,lineHeight:1.7,margin:"0 0 18px"}}>La IA genera un dictamen adaptado al marco legal específico de <b style={{color:C.gold}}>{country}</b>, aplicando los artículos correspondientes de <b style={{color:C.teal}}>{lf.law}</b>.</p>
        <button onClick={run} disabled={loading} style={{background:loading?C.t4:C.gold,border:"none",borderRadius:8,padding:"12px 26px",color:loading?C.t3:"#000",fontSize:13,fontWeight:800,fontFamily:"inherit",cursor:loading?"wait":"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
          {loading?<><span style={{display:"flex",gap:4}}><Dot delay={0}/><Dot delay={.2}/><Dot delay={.4}/></span>Analizando bajo {lf.law}…</>:`⚖️ Generar Dictamen Legal — ${country}`}
        </button>
      </div>
      {text&&(
        <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:12,padding:22,animation:"fadeUp .4s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:18}}>⚖️</span>
            <span style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1}}>DICTAMEN — {product} / {region}, {country}</span>
          </div>
          <div style={{color:C.t2,fontSize:13,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{text}</div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [emailConfig,setEmailConfig]=useState({email:""});
  const [filters,setFilters]=useState({
    region_group:"América Latina",country:"Colombia",region:"Bogotá",
    market:"Energía",product:"Gasolina Regular",company:"Todas",
    dateFrom:"2026-04-01",dateTo:"2026-05-13",hourFrom:"00:00",hourTo:"23:59",
  });

  const companies=useMemo(()=>getCompanies(filters.market,filters.product,filters.country),[filters.market,filters.product,filters.country]);
  const allData=useMemo(()=>generateData(filters.product,companies,filters.country,filters.region),[filters.product,companies,filters.country,filters.region]);
  const displayData=useMemo(()=>filters.company==="Todas"?allData:allData.filter(d=>d.company===filters.company),[allData,filters.company]);
  const analysis=useMemo(()=>detectPatterns(allData,filters.country),[allData,filters.country]);
  const unit=UNITS[filters.product]||"und";
  const alertCount=analysis.alerts.length;
  const countryInfo=GEO[filters.region_group]?.countries[filters.country];

  const TABS=[{id:"dashboard",label:"📊 Dashboard"},{id:"comparison",label:"📉 Comparativa"},{id:"alerts",label:`🔔 Alertas${alertCount>0?` (${alertCount})`:""}`},{id:"ai",label:"⚖️ Dictamen IA"}];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:C.t1}}>
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
            <div style={{fontSize:9,color:C.t4,letterSpacing:1.5}}>MONITOR ANTIMONOPOLIO · {filters.region_group.toUpperCase()}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {countryInfo&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{countryInfo.flag}</span>
              <div>
                <div style={{fontSize:11,color:C.t1,fontWeight:700}}>{filters.country}</div>
                <div style={{fontSize:9,color:C.t4}}>{countryInfo.currency} · {filters.region}</div>
              </div>
            </div>
          )}
          {alertCount>0&&(
            <div onClick={()=>setTab("alerts")} style={{background:analysis.risk.color+"22",border:`1px solid ${analysis.risk.color}44`,borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:analysis.risk.color,boxShadow:`0 0 8px ${analysis.risk.color}`,display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>
              <span style={{fontSize:11,color:analysis.risk.color,fontWeight:700}}>{alertCount} ALERTA{alertCount!==1?"S":""} — {analysis.risk.level}</span>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:`0 0 8px ${C.green}`,display:"inline-block"}}/>
            <span style={{fontSize:10,color:C.t3}}>EN VIVO</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 28px",display:"flex",gap:0}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{background:"transparent",border:"none",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent",color:tab===t.id?C.gold:C.t3,padding:"12px 20px",fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:tab===t.id?700:400,transition:"all .2s",whiteSpace:"nowrap"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{maxWidth:1020,margin:"0 auto",padding:"26px 28px"}}>
        <FilterPanel filters={filters} onChange={setFilters}/>

        {/* Context pills */}
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          {[{k:"País",v:`${countryInfo?.flag||""} ${filters.country}`},{k:"Ciudad",v:filters.region},{k:"Mercado",v:filters.market},{k:"Producto",v:filters.product},{k:"Empresa",v:filters.company},{k:"Período",v:`${filters.dateFrom} → ${filters.dateTo}`},{k:"Horario",v:`${filters.hourFrom} – ${filters.hourTo}`}].map(x=>(
            <div key={x.k} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 12px",fontSize:11}}>
              <span style={{color:C.t4}}>{x.k}: </span><span style={{color:C.teal,fontWeight:700}}>{x.v}</span>
            </div>
          ))}
        </div>

        {tab==="dashboard"&&<><RiskPanel analysis={analysis} onGoToAlerts={()=>setTab("alerts")} country={filters.country}/><div style={{marginTop:28}}><ComparisonStats data={displayData} selectedCompany={filters.company} analysis={analysis} unit={unit}/></div></>}
        {tab==="comparison"&&<ComparisonStats data={allData} selectedCompany={filters.company} analysis={analysis} unit={unit}/>}
        {tab==="alerts"&&<AlertsPanel alerts={analysis.alerts} country={filters.country} emailConfig={emailConfig} onEmailConfig={setEmailConfig}/>}
        {tab==="ai"&&<AIAnalysis data={allData} analysis={analysis} product={filters.product} country={filters.country} region={filters.region} unit={unit}/>}
      </div>
    </div>
  );
}
