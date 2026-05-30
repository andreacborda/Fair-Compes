import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const C = {
  bg:"#f0f4f8", surface:"#ffffff", card:"#ffffff",
  border:"#dde3ed", borderHi:"#c2cfe0",
  gold:"#b45309", goldDim:"#92400e", goldGlow:"#b4530922",
  teal:"#0d9488", red:"#dc2626", amber:"#d97706",
  green:"#059669", blue:"#2563eb", purple:"#7c3aed",
  t1:"#0f172a", t2:"#1e3a5f", t3:"#475569", t4:"#94a3b8",
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
    "Ecuador":{ flag:"🇪🇨", currency:"USD", regions:["Nacional","Quito","Guayaquil","Cuenca","Ambato","Manta"] },
    "Bolivia":{ flag:"🇧🇴", currency:"BOB", regions:["Nacional","La Paz","Santa Cruz","Cochabamba","Oruro","Sucre"] },
    "Paraguay":{ flag:"🇵🇾", currency:"PYG", regions:["Nacional","Asunción","Ciudad del Este","Encarnación","San Lorenzo"] },
    "Uruguay":{ flag:"🇺🇾", currency:"UYU", regions:["Nacional","Montevideo","Salto","Paysandú","Las Piedras"] },
  }},
  "Europa":{ flag:"🌍", countries:{
    "España":{ flag:"🇪🇸", currency:"EUR", regions:["Nacional","Madrid","Barcelona","Valencia","Sevilla","Bilbao","Zaragoza"] },
    "Francia":{ flag:"🇫🇷", currency:"EUR", regions:["Nacional","París","Lyon","Marsella","Toulouse","Burdeos","Niza"] },
    "Alemania":{ flag:"🇩🇪", currency:"EUR", regions:["Nacional","Berlín","Múnich","Hamburgo","Fráncfort","Colonia","Stuttgart"] },
    "Italia":{ flag:"🇮🇹", currency:"EUR", regions:["Nacional","Roma","Milán","Nápoles","Turín","Palermo","Génova"] },
    "Reino Unido":{ flag:"🇬🇧", currency:"GBP", regions:["Nacional","Londres","Manchester","Birmingham","Glasgow","Liverpool"] },
    "Portugal":{ flag:"🇵🇹", currency:"EUR", regions:["Nacional","Lisboa","Porto","Braga","Coimbra","Setúbal"] },
    "Países Bajos":{ flag:"🇳🇱", currency:"EUR", regions:["Nacional","Ámsterdam","Rotterdam","La Haya","Utrecht","Eindhoven"] },
    "Suecia":{ flag:"🇸🇪", currency:"SEK", regions:["Nacional","Estocolmo","Gotemburgo","Malmö","Uppsala","Västerås"] },
    "Polonia":{ flag:"🇵🇱", currency:"PLN", regions:["Nacional","Varsovia","Cracovia","Lodz","Wroclaw","Poznan"] },
  }},
  "América del Norte":{ flag:"🌎", countries:{
    "Estados Unidos":{ flag:"🇺🇸", currency:"USD", regions:["Nacional","Nueva York","Los Ángeles","Chicago","Houston","Miami","Dallas"] },
    "Canadá":{ flag:"🇨🇦", currency:"CAD", regions:["Nacional","Toronto","Montreal","Vancouver","Calgary","Ottawa","Edmonton"] },
  }},
  "Asia":{ flag:"🌏", countries:{
    "China":{ flag:"🇨🇳", currency:"CNY", regions:["Nacional","Pekín","Shanghái","Shenzhen","Guangzhou","Chengdu","Wuhan"] },
    "Japón":{ flag:"🇯🇵", currency:"JPY", regions:["Nacional","Tokio","Osaka","Kioto","Yokohama","Nagoya","Sapporo"] },
    "Corea del Sur":{ flag:"🇰🇷", currency:"KRW", regions:["Nacional","Seúl","Busan","Incheon","Daegu","Daejeon"] },
    "India":{ flag:"🇮🇳", currency:"INR", regions:["Nacional","Bombay","Delhi","Bangalore","Chennai","Hyderabad","Calcuta"] },
  }},
};

const LEGAL = {
  "Colombia":{ authority:"Superintendencia de Industria y Comercio (SIC)", law:"Decreto 2153/1992 y Ley 1340/2009", rules:{"FIJACIÓN DE PRECIOS":"Art. 47 núm. 1, Decreto 2153/1992","ALZA SIMULTÁNEA":"Art. 47 núm. 1-2, Decreto 2153/1992","PARALELISMO DE PRECIOS":"Art. 47 núm. 2, Decreto 2153/1992","POSICIÓN DOMINANTE":"Art. 50, Decreto 2153/1992","PRECIOS PREDATORIOS":"Art. 50 núm. 3, Decreto 2153/1992","CONCENTRACIÓN":"Ley 1340/2009 Art. 9"}, sanction:"Multas hasta 100.000 SMMLV o el 150% de la utilidad derivada." },
  "México":{ authority:"COFECE", law:"Ley Federal de Competencia Económica (LFCE) 2014", rules:{"FIJACIÓN DE PRECIOS":"Art. 53 LFCE","ALZA SIMULTÁNEA":"Art. 53 LFCE","PARALELISMO DE PRECIOS":"Art. 56 LFCE","POSICIÓN DOMINANTE":"Art. 56 LFCE","PRECIOS PREDATORIOS":"Art. 56 fracc. VII LFCE","CONCENTRACIÓN":"Art. 61 LFCE"}, sanction:"Multas hasta el 10% de los ingresos anuales." },
  "Brasil":{ authority:"CADE", law:"Lei 12.529/2011", rules:{"FIJACIÓN DE PRECIOS":"Art. 36 §3º I","ALZA SIMULTÁNEA":"Art. 36 §3º","PARALELISMO DE PRECIOS":"Art. 36 II","POSICIÓN DOMINANTE":"Art. 36 §2º","PRECIOS PREDATORIOS":"Art. 36 §3º XV","CONCENTRACIÓN":"Art. 88"}, sanction:"Multa de 0,1% a 20% do faturamento bruto." },
  "Argentina":{ authority:"CNDC", law:"Ley 27.442/2018", rules:{"FIJACIÓN DE PRECIOS":"Art. 2º a)","ALZA SIMULTÁNEA":"Art. 2º a)","PARALELISMO DE PRECIOS":"Art. 3º","POSICIÓN DOMINANTE":"Art. 3º","PRECIOS PREDATORIOS":"Art. 3º i)","CONCENTRACIÓN":"Art. 8º"}, sanction:"Multas de hasta el 30% de la facturación." },
  "Chile":{ authority:"FNE y TDLC", law:"Decreto Ley 211/1973", rules:{"FIJACIÓN DE PRECIOS":"Art. 3º a) DL 211","ALZA SIMULTÁNEA":"Art. 3º a) DL 211","PARALELISMO DE PRECIOS":"Art. 3º DL 211","POSICIÓN DOMINANTE":"Art. 3º b) DL 211","PRECIOS PREDATORIOS":"Art. 3º b) DL 211","CONCENTRACIÓN":"Art. 48 DL 211"}, sanction:"Multas hasta 30.000 UTA (~USD 20M)." },
  "Perú":{ authority:"INDECOPI", law:"Decreto Legislativo 1034/2008", rules:{"FIJACIÓN DE PRECIOS":"Art. 11.1 DL 1034","ALZA SIMULTÁNEA":"Art. 11.1 DL 1034","PARALELISMO DE PRECIOS":"Art. 11 DL 1034","POSICIÓN DOMINANTE":"Art. 10 DL 1034","PRECIOS PREDATORIOS":"Art. 10.2 e) DL 1034","CONCENTRACIÓN":"Ley 31112/2021"}, sanction:"Multas hasta 1.000 UIT o el 12% de ventas anuales." },
  "Ecuador":{ authority:"Superintendencia de Control del Poder de Mercado (SCPM)", law:"Ley Orgánica de Regulación y Control del Poder de Mercado (LORCPM)", rules:{"FIJACIÓN DE PRECIOS":"Art. 11 LORCPM","ALZA SIMULTÁNEA":"Art. 11 LORCPM","PARALELISMO DE PRECIOS":"Art. 11 LORCPM","POSICIÓN DOMINANTE":"Art. 9 LORCPM","PRECIOS PREDATORIOS":"Art. 9 lit. b) LORCPM","CONCENTRACIÓN":"Art. 14 LORCPM"}, sanction:"Multas hasta el 12% de los ingresos totales del año anterior." },
  "Bolivia":{ authority:"Autoridad de Fiscalización y Control Social de Empresas (AEMP)", law:"Decreto Supremo 29519/2008 y Ley 516/2014", rules:{"FIJACIÓN DE PRECIOS":"Art. 10 DS 29519","ALZA SIMULTÁNEA":"Art. 10 DS 29519","PARALELISMO DE PRECIOS":"Art. 10 DS 29519","POSICIÓN DOMINANTE":"Art. 9 DS 29519","PRECIOS PREDATORIOS":"Art. 9 DS 29519","CONCENTRACIÓN":"Art. 15 DS 29519"}, sanction:"Multas de hasta el 10% de los ingresos anuales." },
  "Paraguay":{ authority:"Comisión Nacional de la Competencia (CNC)", law:"Ley 4956/2013 de Defensa de la Competencia", rules:{"FIJACIÓN DE PRECIOS":"Art. 6 Ley 4956","ALZA SIMULTÁNEA":"Art. 6 Ley 4956","PARALELISMO DE PRECIOS":"Art. 6 Ley 4956","POSICIÓN DOMINANTE":"Art. 7 Ley 4956","PRECIOS PREDATORIOS":"Art. 7 Ley 4956","CONCENTRACIÓN":"Art. 12 Ley 4956"}, sanction:"Multas de hasta 20.000 salarios mínimos." },
  "Uruguay":{ authority:"Comisión de Promoción y Defensa de la Competencia (CPDC)", law:"Ley 18.159/2007 de Promoción y Defensa de la Competencia", rules:{"FIJACIÓN DE PRECIOS":"Art. 4 Ley 18.159","ALZA SIMULTÁNEA":"Art. 4 Ley 18.159","PARALELISMO DE PRECIOS":"Art. 4 Ley 18.159","POSICIÓN DOMINANTE":"Art. 5 Ley 18.159","PRECIOS PREDATORIOS":"Art. 5 Ley 18.159","CONCENTRACIÓN":"Art. 7 Ley 18.159"}, sanction:"Multas de hasta 20.000 UR (Unidades Reajustables)." },
  "España":{ authority:"CNMC", law:"Ley 15/2007 + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. 1 LDC / Art. 101 TFUE","ALZA SIMULTÁNEA":"Art. 1 LDC","PARALELISMO DE PRECIOS":"Art. 1 LDC","POSICIÓN DOMINANTE":"Art. 2 LDC / Art. 102 TFUE","PRECIOS PREDATORIOS":"Art. 2.2 b) LDC","CONCENTRACIÓN":"Art. 7 LDC"}, sanction:"Multas hasta el 10% del volumen de negocios mundial." },
  "Francia":{ authority:"Autorité de la Concurrence", law:"Code de commerce Art. L420-1 + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. L420-1","ALZA SIMULTÁNEA":"Art. L420-1","PARALELISMO DE PRECIOS":"Art. L420-1","POSICIÓN DOMINANTE":"Art. L420-2","PRECIOS PREDATORIOS":"Art. L420-5","CONCENTRACIÓN":"Art. L430-1"}, sanction:"Sanction jusqu'à 10% du chiffre d'affaires mondial." },
  "Alemania":{ authority:"Bundeskartellamt (BKartA)", law:"GWB + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"§1 GWB / Art. 101 TFUE","ALZA SIMULTÁNEA":"§1 GWB","PARALELISMO DE PRECIOS":"§1 GWB","POSICIÓN DOMINANTE":"§18-19 GWB","PRECIOS PREDATORIOS":"§19 GWB","CONCENTRACIÓN":"§35 GWB"}, sanction:"Geldbußen bis zu 10% des weltweiten Jahresumsatzes." },
  "Italia":{ authority:"AGCM", law:"Legge 287/1990 + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. 2 L.287/1990","ALZA SIMULTÁNEA":"Art. 2 L.287/1990","PARALELISMO DE PRECIOS":"Art. 2 L.287/1990","POSICIÓN DOMINANTE":"Art. 3 L.287/1990","PRECIOS PREDATORIOS":"Art. 3 L.287/1990","CONCENTRACIÓN":"Art. 16 L.287/1990"}, sanction:"Sanzioni fino al 10% del fatturato." },
  "Reino Unido":{ authority:"Competition and Markets Authority (CMA)", law:"Competition Act 1998 + Enterprise Act 2002", rules:{"FIJACIÓN DE PRECIOS":"Chapter I, CA 1998","ALZA SIMULTÁNEA":"Chapter I, CA 1998","PARALELISMO DE PRECIOS":"Chapter I, CA 1998","POSICIÓN DOMINANTE":"Chapter II, CA 1998","PRECIOS PREDATORIOS":"Chapter II, CA 1998","CONCENTRACIÓN":"Part 3, EA 2002"}, sanction:"Fines up to 10% of annual worldwide turnover." },
  "Portugal":{ authority:"Autoridade da Concorrência (AdC)", law:"Lei 19/2012 — Lei da Concorrência", rules:{"FIJACIÓN DE PRECIOS":"Art. 11 Lei 19/2012","ALZA SIMULTÁNEA":"Art. 11 Lei 19/2012","PARALELISMO DE PRECIOS":"Art. 11 Lei 19/2012","POSICIÓN DOMINANTE":"Art. 12 Lei 19/2012","PRECIOS PREDATORIOS":"Art. 12 Lei 19/2012","CONCENTRACIÓN":"Art. 37 Lei 19/2012"}, sanction:"Coima até 10% do volume de negócios total." },
  "Países Bajos":{ authority:"Autoriteit Consument en Markt (ACM)", law:"Mededingingswet (Mw) + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. 6 Mw / Art. 101 TFUE","ALZA SIMULTÁNEA":"Art. 6 Mw","PARALELISMO DE PRECIOS":"Art. 6 Mw","POSICIÓN DOMINANTE":"Art. 24 Mw / Art. 102 TFUE","PRECIOS PREDATORIOS":"Art. 24 Mw","CONCENTRACIÓN":"Art. 34 Mw"}, sanction:"Boetes tot 10% van de wereldwijde jaaromzet." },
  "Suecia":{ authority:"Konkurrensverket (KKV)", law:"Konkurrenslag (2008:579) + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"2 kap. 1 § KL / Art. 101 TFUE","ALZA SIMULTÁNEA":"2 kap. 1 § KL","PARALELISMO DE PRECIOS":"2 kap. 1 § KL","POSICIÓN DOMINANTE":"2 kap. 7 § KL / Art. 102 TFUE","PRECIOS PREDATORIOS":"2 kap. 7 § KL","CONCENTRACIÓN":"4 kap. 1 § KL"}, sanction:"Konkurrensskadeavgift upp till 10% av omsättningen." },
  "Polonia":{ authority:"Urząd Ochrony Konkurencji i Konsumentów (UOKiK)", law:"Ustawa o ochronie konkurencji i konsumentów (2007) + Art. 101-102 TFUE", rules:{"FIJACIÓN DE PRECIOS":"Art. 6 UOKiK / Art. 101 TFUE","ALZA SIMULTÁNEA":"Art. 6 UOKiK","PARALELISMO DE PRECIOS":"Art. 6 UOKiK","POSICIÓN DOMINANTE":"Art. 9 UOKiK / Art. 102 TFUE","PRECIOS PREDATORIOS":"Art. 9 UOKiK","CONCENTRACIÓN":"Art. 13 UOKiK"}, sanction:"Kara pieniężna do 10% obrotu osiągniętego w roku poprzedzającym." },
  "Estados Unidos":{ authority:"FTC / DOJ", law:"Sherman Act (1890) + Clayton Act (1914)", rules:{"FIJACIÓN DE PRECIOS":"§1 Sherman Act","ALZA SIMULTÁNEA":"§1 Sherman Act","PARALELISMO DE PRECIOS":"§1 Sherman Act","POSICIÓN DOMINANTE":"§2 Sherman Act","PRECIOS PREDATORIOS":"§2 Sherman Act","CONCENTRACIÓN":"§7 Clayton Act"}, sanction:"Criminal fines up to $100M. Up to 10 years imprisonment." },
  "Canadá":{ authority:"Competition Bureau Canada", law:"Competition Act (R.S.C. 1985)", rules:{"FIJACIÓN DE PRECIOS":"§45 Competition Act","ALZA SIMULTÁNEA":"§45 Competition Act","PARALELISMO DE PRECIOS":"§90.1 Competition Act","POSICIÓN DOMINANTE":"§78-79 Competition Act","PRECIOS PREDATORIOS":"§78(1)(i) Competition Act","CONCENTRACIÓN":"§92 Competition Act"}, sanction:"Fines up to $25M. Up to 14 years imprisonment." },
  "China":{ authority:"Administración Estatal para la Regulación del Mercado (SAMR)", law:"Ley Antimonopolio de China (AML) 2022", rules:{"FIJACIÓN DE PRECIOS":"Art. 17 AML — Acuerdos monopolísticos sobre precios","ALZA SIMULTÁNEA":"Art. 17 AML — Coordinación de precios entre operadores","PARALELISMO DE PRECIOS":"Art. 17 AML — Conducta paralela con efecto anticompetitivo","POSICIÓN DOMINANTE":"Art. 22 AML — Abuso de posición dominante en el mercado","PRECIOS PREDATORIOS":"Art. 22(1) AML — Venta por debajo del costo con fin exclusorio","CONCENTRACIÓN":"Art. 28 AML — Concentraciones con efecto de eliminación o restricción de la competencia"}, sanction:"Multas de 1% a 10% de las ventas del año anterior. Hasta 5 millones de RMB para conductas no implementadas." },
  "Japón":{ authority:"Japan Fair Trade Commission (JFTC)", law:"Antimonopoly Act (1947)", rules:{"FIJACIÓN DE PRECIOS":"Art. 3 AMA","ALZA SIMULTÁNEA":"Art. 3 AMA","PARALELISMO DE PRECIOS":"Art. 3 AMA","POSICIÓN DOMINANTE":"Art. 2(5) AMA","PRECIOS PREDATORIOS":"Art. 2(9) AMA","CONCENTRACIÓN":"Art. 10-16 AMA"}, sanction:"Surcharges up to 10% of sales." },
  "Corea del Sur":{ authority:"Korea Fair Trade Commission (KFTC)", law:"Monopoly Regulation and Fair Trade Act (MRFTA)", rules:{"FIJACIÓN DE PRECIOS":"Art. 40 MRFTA","ALZA SIMULTÁNEA":"Art. 40 MRFTA","PARALELISMO DE PRECIOS":"Art. 40 MRFTA","POSICIÓN DOMINANTE":"Art. 5 MRFTA","PRECIOS PREDATORIOS":"Art. 5(1)(iii) MRFTA","CONCENTRACIÓN":"Art. 11 MRFTA"}, sanction:"Surcharges up to 20% of related sales." },
  "India":{ authority:"Competition Commission of India (CCI)", law:"Competition Act 2002 (amended 2023)", rules:{"FIJACIÓN DE PRECIOS":"§3(3)(a)","ALZA SIMULTÁNEA":"§3(3)","PARALELISMO DE PRECIOS":"§3(3)","POSICIÓN DOMINANTE":"§4","PRECIOS PREDATORIOS":"§4(2)(a)(ii)","CONCENTRACIÓN":"§5-6"}, sanction:"Penalty up to 10% of average turnover for 3 years." },
};

// ─── MARKETS ──────────────────────────────────────────────────────────────────
const MARKETS = {
  "Energía":{ products:["Gasolina Regular","Gasolina Premium","ACPM / Diésel","Gas Natural","Energía Eléctrica","Gas Licuado (GLP)","Carbón","Energía Solar"],
    companiesByCountry:{
      "Colombia":{"Gasolina Regular":["Terpel","Biomax","Texaco","Primax","Zeuss"],"Gasolina Premium":["Terpel","Biomax","Texaco","Primax"],"ACPM / Diésel":["Terpel","Biomax","Texaco","EDS Uno"],"Gas Natural":["Gas Natural","Surtigas","Gases de Occidente"],"Energía Eléctrica":["EPM","Codensa","Celsia","Emcali","CHEC"],"Gas Licuado (GLP)":["Terpel GLP","Biomax GLP","Zeta Gas","Surtigas"],"Carbón":["Drummond","Cerrejón","Prodeco","CNR"],"Energía Solar":["Celsia Solar","EPM Solar","Enel Green Power","Isagen"]},
      "China":{"Gasolina Regular":["Sinopec","PetroChina","CNOOC","Sinoil"],"Gasolina Premium":["Sinopec","PetroChina","CNOOC"],"ACPM / Diésel":["Sinopec","PetroChina","CNOOC"],"Gas Natural":["PetroChina Gas","Sinopec Gas","ENN Energy","China Gas"],"Energía Eléctrica":["State Grid","China Southern Power","China Datang","Huaneng"],"Gas Licuado (GLP)":["Sinopec LPG","PetroChina LPG","China Resources Gas","ENN Energy"],"Carbón":["China Shenhua","China Coal Energy","Datong Coal","Yanzhou Coal"],"Energía Solar":["LONGi Solar","JA Solar","Trina Solar","Canadian Solar"]},
      "Ecuador":{"Gasolina Regular":["Petroecuador","Primax Ecuador","Terpel Ecuador","Repsol Ecuador"],"Gasolina Premium":["Petroecuador","Primax Ecuador","Terpel Ecuador"],"ACPM / Diésel":["Petroecuador","Primax Ecuador","Terpel Ecuador"],"Gas Natural":["Petroecuador Gas","City Gas","Gas del Litoral"],"Energía Eléctrica":["CELEC","EEQ","CNEL","Emelnorte"],"Gas Licuado (GLP)":["Petroecuador GLP","Duragas","Congas","Agip Gas"],"Carbón":["Petroecuador"],"Energía Solar":["Elecaustro","CELEC Solar"]},
      "Bolivia":{"Gasolina Regular":["YPFB","Petrobras Bolivia","Repsol Bolivia"],"Gasolina Premium":["YPFB","Petrobras Bolivia"],"ACPM / Diésel":["YPFB","Petrobras Bolivia","Repsol Bolivia"],"Gas Natural":["YPFB Gas","TBG","Transredes"],"Energía Eléctrica":["ENDE","Corani","Valle Hermoso","Guaracachi"],"Gas Licuado (GLP)":["YPFB GLP","Embol","Trafigura Bolivia"],"Carbón":["YPFB"],"Energía Solar":["ENDE Solar","Bolivia Solar"]},
      "Portugal":{"Gasolina Regular":["Galp","BP Portugal","Repsol Portugal","Shell Portugal"],"Gasolina Premium":["Galp","BP Portugal","Repsol Portugal"],"ACPM / Diésel":["Galp","BP Portugal","Total Portugal"],"Gas Natural":["Galp Gás","EDP Gás","Iberdrola Portugal"],"Energía Eléctrica":["EDP","Galp Energia","Endesa Portugal","Iberdrola Portugal"],"Gas Licuado (GLP)":["Galp GPL","Repsol GPL","Rubis Portugal"],"Carbón":["EDP Produção"],"Energía Solar":["EDP Renewables","Galp Solar","Iberdrola Solar"]},
      "Países Bajos":{"Gasolina Regular":["Shell NL","BP Netherlands","TotalEnergies NL","Esso NL"],"Gasolina Premium":["Shell NL","BP Netherlands","TotalEnergies NL"],"ACPM / Diésel":["Shell NL","BP Netherlands","TotalEnergies NL"],"Gas Natural":["Vattenfall NL","Eneco","Nuon","Budget Energie"],"Energía Eléctrica":["Vattenfall NL","Eneco","Nuon","Greenchoice"],"Gas Licuado (GLP)":["SHV Gas NL","Primagas NL","Calor NL"],"Carbón":["Vattenfall NL","RWE NL"],"Energía Solar":["Eneco Solar","Vattenfall Solar","Nuon Solar"]},
      "default":{"Gasolina Regular":["Company A","Company B","Company C","Company D"],"Gasolina Premium":["Company A","Company B","Company C"],"ACPM / Diésel":["Company A","Company B","Company C"],"Gas Natural":["Company A","Company B","Company C"],"Energía Eléctrica":["Utility A","Utility B","Utility C"],"Gas Licuado (GLP)":["GLP A","GLP B","GLP C"],"Carbón":["Mining A","Mining B","Mining C"],"Energía Solar":["Solar A","Solar B","Solar C"]},
    }
  },
  "Telecomunicaciones":{ products:["Internet Hogar 100Mbps","Internet Hogar 300Mbps","Internet Hogar 1Gbps","Telefonía Móvil Postpago","Telefonía Móvil Prepago","TV por Suscripción","Telefonía Fija","Roaming Internacional","Streaming Música","Streaming Video"],
    companiesByCountry:{
      "Colombia":{"Internet Hogar 100Mbps":["Claro","Movistar","ETB","Tigo","Une"],"Internet Hogar 300Mbps":["Claro","Movistar","Tigo","Une"],"Internet Hogar 1Gbps":["Claro","ETB","Tigo","Une"],"Telefonía Móvil Postpago":["Claro","Movistar","Tigo","WOM"],"Telefonía Móvil Prepago":["Claro","Movistar","Tigo","WOM","Virgin"],"TV por Suscripción":["Claro","Movistar","DirecTV","Tigo"],"Telefonía Fija":["ETB","Claro","Movistar","Tigo"],"Roaming Internacional":["Claro","Movistar","Tigo","WOM"],"Streaming Música":["Spotify","Apple Music","Deezer","YouTube Music"],"Streaming Video":["Netflix","Disney+","Amazon Prime","HBO Max"]},
      "China":{"Internet Hogar 100Mbps":["China Telecom","China Unicom","China Mobile","iiNet"],"Internet Hogar 300Mbps":["China Telecom","China Unicom","China Mobile"],"Internet Hogar 1Gbps":["China Telecom","China Unicom","China Mobile"],"Telefonía Móvil Postpago":["China Mobile","China Unicom","China Telecom"],"Telefonía Móvil Prepago":["China Mobile","China Unicom","China Telecom"],"TV por Suscripción":["iQiyi","Youku","Tencent Video","Migu"],"Telefonía Fija":["China Telecom","China Unicom","China Mobile"],"Roaming Internacional":["China Mobile","China Unicom","China Telecom"],"Streaming Música":["NetEase Music","QQ Music","Kugou","Kuwo"],"Streaming Video":["iQiyi","Youku","Tencent Video","Bilibili"]},
      "Ecuador":{"Internet Hogar 100Mbps":["CNT","Claro Ecuador","Movistar Ecuador","Netlife"],"Internet Hogar 300Mbps":["CNT","Claro Ecuador","Netlife"],"Internet Hogar 1Gbps":["CNT","Claro Ecuador","Netlife"],"Telefonía Móvil Postpago":["Claro Ecuador","Movistar Ecuador","CNT"],"Telefonía Móvil Prepago":["Claro Ecuador","Movistar Ecuador","CNT","Tuenti"],"TV por Suscripción":["CNT TV","DirecTV Ecuador","Claro TV","Netflim"],"Telefonía Fija":["CNT","Claro Ecuador","Etapa"],"Roaming Internacional":["Claro Ecuador","Movistar Ecuador","CNT"],"Streaming Música":["Spotify","Apple Music","Deezer"],"Streaming Video":["Netflix","Disney+","Amazon Prime"]},
      "default":{"Internet Hogar 100Mbps":["Operator A","Operator B","Operator C","Operator D"],"Internet Hogar 300Mbps":["Operator A","Operator B","Operator C"],"Internet Hogar 1Gbps":["Operator A","Operator B","Operator C"],"Telefonía Móvil Postpago":["Operator A","Operator B","Operator C"],"Telefonía Móvil Prepago":["Operator A","Operator B","Operator C"],"TV por Suscripción":["Operator A","Operator B","Operator C"],"Telefonía Fija":["Operator A","Operator B","Operator C"],"Roaming Internacional":["Operator A","Operator B","Operator C"],"Streaming Música":["Platform A","Platform B","Platform C"],"Streaming Video":["Platform A","Platform B","Platform C"]},
    }
  },
  "Alimentos":{ products:["Pollo Entero","Carne de Res (kg)","Aceite Vegetal 1L","Leche 1L","Arroz 1kg","Pan Tajado","Huevos (docena)","Azúcar 1kg","Harina de Trigo 1kg","Café Molido 500g","Agua Embotellada 1.5L","Atún en lata"],
    companiesByCountry:{
      "Colombia":{"Pollo Entero":["Éxito","Jumbo","Carulla","D1","Ara"],"Carne de Res (kg)":["Éxito","Jumbo","Carulla","La Cabaña","Pricesmart"],"Aceite Vegetal 1L":["Éxito","Jumbo","D1","Ara"],"Leche 1L":["Éxito","Jumbo","D1","Olímpica"],"Arroz 1kg":["Éxito","Jumbo","D1","La 14"],"Pan Tajado":["Éxito","Jumbo","D1","Ara"],"Huevos (docena)":["Éxito","Jumbo","D1","Colanta"],"Azúcar 1kg":["Éxito","Jumbo","D1","Ara"],"Harina de Trigo 1kg":["Éxito","Jumbo","D1","Ara"],"Café Molido 500g":["Éxito","Jumbo","Carulla","Juan Valdez"],"Agua Embotellada 1.5L":["Éxito","Jumbo","D1","Ara"],"Atún en lata":["Éxito","Jumbo","D1","Carulla"]},
      "China":{"Pollo Entero":["JD Supermarket","Tmall","RT-Mart","Carrefour China"],"Carne de Res (kg)":["JD Supermarket","Tmall","Walmart China","Metro China"],"Aceite Vegetal 1L":["JD Supermarket","Tmall","RT-Mart","Sun Art"],"Leche 1L":["JD Supermarket","Mengniu","Yili","Bright Dairy"],"Arroz 1kg":["JD Supermarket","Tmall","RT-Mart","Hema"],"Pan Tajado":["JD Supermarket","Tmall","Breadtalk","85°C"],"Huevos (docena)":["JD Supermarket","Tmall","RT-Mart","Hema"],"Azúcar 1kg":["JD Supermarket","Tmall","RT-Mart"],"Harina de Trigo 1kg":["JD Supermarket","Tmall","RT-Mart","Sun Art"],"Café Molido 500g":["Luckin Coffee","Starbucks China","Manner","Tim Hortons China"],"Agua Embotellada 1.5L":["Nongfu Spring","Master Kong","C'estbon","Wahaha"],"Atún en lata":["JD Supermarket","Tmall","RT-Mart"]},
      "default":{"Pollo Entero":["Chain A","Chain B","Chain C","Chain D"],"Carne de Res (kg)":["Chain A","Chain B","Chain C"],"Aceite Vegetal 1L":["Chain A","Chain B","Chain C"],"Leche 1L":["Chain A","Chain B","Chain C"],"Arroz 1kg":["Chain A","Chain B","Chain C"],"Pan Tajado":["Chain A","Chain B","Chain C"],"Huevos (docena)":["Chain A","Chain B","Chain C"],"Azúcar 1kg":["Chain A","Chain B","Chain C"],"Harina de Trigo 1kg":["Chain A","Chain B","Chain C"],"Café Molido 500g":["Chain A","Chain B","Chain C"],"Agua Embotellada 1.5L":["Chain A","Chain B","Chain C"],"Atún en lata":["Chain A","Chain B","Chain C"]},
    }
  },
  "Seguros":{ products:["Seguro Auto Básico","Seguro Auto Todo Riesgo","Seguro de Vida","SOAT / Seguro Obligatorio","Seguro de Hogar","Seguro de Salud","Seguro Empresarial","Seguro de Viaje"],
    companiesByCountry:{
      "Colombia":{"Seguro Auto Básico":["Sura","Bolívar","Allianz","Mapfre","Axa"],"Seguro Auto Todo Riesgo":["Sura","Bolívar","Allianz","Mapfre"],"Seguro de Vida":["Sura","Bolívar","MetLife","Suramericana"],"SOAT / Seguro Obligatorio":["Sura","Bolívar","Allianz","Mapfre","Axa"],"Seguro de Hogar":["Sura","Bolívar","Allianz","Liberty"],"Seguro de Salud":["Sura","Colsanitas","Compensar","Coomeva"],"Seguro Empresarial":["Sura","Bolívar","Allianz","AIG Colombia"],"Seguro de Viaje":["Sura","Assist Card","Allianz Travel","AXA Assistance"]},
      "China":{"Seguro Auto Básico":["PICC","Ping An","China Life","China Pacific"],"Seguro Auto Todo Riesgo":["PICC","Ping An","China Pacific","Sinosafe"],"Seguro de Vida":["China Life","Ping An Life","PICC Life","New China Life"],"SOAT / Seguro Obligatorio":["PICC","Ping An","China Pacific","China Life P&C"],"Seguro de Hogar":["PICC","Ping An","China Pacific","Taikang"],"Seguro de Salud":["China Life","Ping An Health","PICC Health","Sunshine Insurance"],"Seguro Empresarial":["PICC","Ping An","China Pacific","AIG China"],"Seguro de Viaje":["PICC","Ping An","AIG China","Allianz China"]},
      "default":{"Seguro Auto Básico":["Insurer A","Insurer B","Insurer C"],"Seguro Auto Todo Riesgo":["Insurer A","Insurer B","Insurer C"],"Seguro de Vida":["Insurer A","Insurer B","Insurer C"],"SOAT / Seguro Obligatorio":["Insurer A","Insurer B","Insurer C"],"Seguro de Hogar":["Insurer A","Insurer B","Insurer C"],"Seguro de Salud":["Insurer A","Insurer B","Insurer C"],"Seguro Empresarial":["Insurer A","Insurer B","Insurer C"],"Seguro de Viaje":["Insurer A","Insurer B","Insurer C"]},
    }
  },
  "Farmacéutico":{ products:["Acetaminofén 500mg","Ibuprofeno 400mg","Amoxicilina 500mg","Omeprazol 20mg","Metformina 850mg","Atorvastatina 20mg","Losartán 50mg","Vitamina C 1000mg","Vitamina D 1000UI","Anticonceptivos orales"],
    companiesByCountry:{
      "Colombia":{"Acetaminofén 500mg":["Colfarma","Tecnoquímicas","Lafrancol","Procaps"],"Ibuprofeno 400mg":["Tecnoquímicas","Lafrancol","Pfizer Colombia","Abbott"],"Amoxicilina 500mg":["Lafrancol","Tecnoquímicas","GlaxoSmithKline","Colfarma"],"Omeprazol 20mg":["Tecnoquímicas","Lafrancol","AstraZeneca","Colfarma"],"Metformina 850mg":["Tecnoquímicas","Lafrancol","Sanofi","Novartis"],"Atorvastatina 20mg":["Pfizer Colombia","Tecnoquímicas","Lafrancol","MSD"],"Losartán 50mg":["MSD","Tecnoquímicas","Lafrancol","Novartis"],"Vitamina C 1000mg":["Procaps","Bayer Colombia","Lafrancol","Tecnoquímicas"],"Vitamina D 1000UI":["Procaps","Bayer Colombia","Lafrancol"],"Anticonceptivos orales":["Bayer Colombia","Pfizer Colombia","Laboratorios Legrand","Lafrancol"]},
      "China":{"Acetaminofén 500mg":["Sinopharm","China Resources Pharma","Jointown","Shanghai Pharma"],"Ibuprofeno 400mg":["Sinopharm","Shanghai Pharma","China Resources","CSPC"],"Amoxicilina 500mg":["Sinopharm","CSPC","North China Pharma","Harbin Pharma"],"Omeprazol 20mg":["AstraZeneca China","Sinopharm","CSPC","Chiatai Tianqing"],"Metformina 850mg":["Sino Biopharm","Sinopharm","CSPC","Jumpcan Pharma"],"Atorvastatina 20mg":["Pfizer China","Sinopharm","CSPC","Zhejiang Hisun"],"Losartán 50mg":["MSD China","Sinopharm","CSPC","North China Pharma"],"Vitamina C 1000mg":["Sinopharm","Northeast Pharma","DSM China","CSPC"],"Vitamina D 1000UI":["Sinopharm","China Resources Pharma","DSM China"],"Anticonceptivos orales":["Bayer China","Pfizer China","Sino Pharma","Zizhu Pharma"]},
      "default":{"Acetaminofén 500mg":["Pharma A","Pharma B","Pharma C"],"Ibuprofeno 400mg":["Pharma A","Pharma B","Pharma C"],"Amoxicilina 500mg":["Pharma A","Pharma B","Pharma C"],"Omeprazol 20mg":["Pharma A","Pharma B","Pharma C"],"Metformina 850mg":["Pharma A","Pharma B","Pharma C"],"Atorvastatina 20mg":["Pharma A","Pharma B","Pharma C"],"Losartán 50mg":["Pharma A","Pharma B","Pharma C"],"Vitamina C 1000mg":["Pharma A","Pharma B","Pharma C"],"Vitamina D 1000UI":["Pharma A","Pharma B","Pharma C"],"Anticonceptivos orales":["Pharma A","Pharma B","Pharma C"]},
    }
  },
  "Transporte":{ products:["Taxi / Rideshare km","Servicio de Bus","Vuelo Doméstico","Vuelo Internacional","Peaje Autopista","Servicio de Metro","Transporte de Carga","Mensajería Express","Bicicletas Compartidas","Patinetas Eléctricas"],
    companiesByCountry:{
      "Colombia":{"Taxi / Rideshare km":["Uber","Cabify","InDriver","Beat","Tappsi"],"Servicio de Bus":["Transmilenio","MIO","Metro Medellín","Megabús"],"Vuelo Doméstico":["Avianca","LATAM Colombia","Wingo","EasyFly"],"Vuelo Internacional":["Avianca","LATAM","American Airlines","Copa Airlines"],"Peaje Autopista":["ANI","Devimed","Autopistas del Café","Concesiones"],"Servicio de Metro":["Metro Medellín","Metro Bogotá","TransMilenio BRT"],"Transporte de Carga":["Deprisa","Envía","Coordinadora","TCC"],"Mensajería Express":["Rappi","DomiBici","Mensajero Urbano","Lalamove"],"Bicicletas Compartidas":["EnCicla","Biciletas Públicas","Tembici Colombia"],"Patinetas Eléctricas":["Grin","Lime Colombia","Bird Colombia"]},
      "China":{"Taxi / Rideshare km":["DiDi","Meituan","Caocao","T3"],"Servicio de Bus":["公交集团 Beijing","上海公交","广州公交","深圳公交"],"Vuelo Doméstico":["Air China","China Eastern","China Southern","Hainan Airlines"],"Vuelo Internacional":["Air China","China Eastern","China Southern","Cathay Pacific"],"Peaje Autopista":["Guotou Zhangzidao","China Merchants","CCI","Jiangsu Expressway"],"Servicio de Metro":["Beijing Metro","Shanghai Metro","Guangzhou Metro","Shenzhen Metro"],"Transporte de Carga":["SF Express","JD Logistics","ZTO Express","Cainiao"],"Mensajería Express":["Meituan","Ele.me","DiDi Food","SF Express"],"Bicicletas Compartidas":["Meituan Bike","Hello Bike","DiDi Bike"],"Patinetas Eléctricas":["Meituan Ebike","Hello Ebike","DiDi Ebike"]},
      "default":{"Taxi / Rideshare km":["Transport A","Transport B","Transport C"],"Servicio de Bus":["Bus A","Bus B","Bus C"],"Vuelo Doméstico":["Airline A","Airline B","Airline C"],"Vuelo Internacional":["Airline A","Airline B","Airline C"],"Peaje Autopista":["Toll A","Toll B","Toll C"],"Servicio de Metro":["Metro A","Metro B","Metro C"],"Transporte de Carga":["Cargo A","Cargo B","Cargo C"],"Mensajería Express":["Express A","Express B","Express C"],"Bicicletas Compartidas":["Bike A","Bike B","Bike C"],"Patinetas Eléctricas":["Scooter A","Scooter B","Scooter C"]},
    }
  },
  "Banca y Finanzas":{ products:["Cuenta de Ahorros","Tarjeta de Crédito","Crédito de Consumo","Crédito Hipotecario","Comisión Transferencia","CDT / Depósito a Plazo","Nómina Empresarial","Billetera Digital"],
    companiesByCountry:{
      "Colombia":{"Cuenta de Ahorros":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Nu"],"Tarjeta de Crédito":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Falabella"],"Crédito de Consumo":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Fincomercio"],"Crédito Hipotecario":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","AV Villas"],"Comisión Transferencia":["Bancolombia","Davivienda","BBVA Colombia","Nequi","Daviplata"],"CDT / Depósito a Plazo":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá","Coltefinanciera"],"Nómina Empresarial":["Bancolombia","Davivienda","BBVA Colombia","Banco de Bogotá"],"Billetera Digital":["Nequi","Daviplata","Movii","Rappipay"]},
      "China":{"Cuenta de Ahorros":["ICBC","China Construction Bank","Bank of China","Agricultural Bank"],"Tarjeta de Crédito":["ICBC","China Construction Bank","Bank of China","China Merchants Bank"],"Crédito de Consumo":["ICBC","Ant Financial","WeBank","JD Finance"],"Crédito Hipotecario":["ICBC","China Construction Bank","Bank of China","Agricultural Bank"],"Comisión Transferencia":["Alipay","WeChat Pay","UnionPay","ICBC"],"CDT / Depósito a Plazo":["ICBC","China Construction Bank","Bank of China","Agricultural Bank"],"Nómina Empresarial":["ICBC","China Construction Bank","Bank of China","China Merchants Bank"],"Billetera Digital":["Alipay","WeChat Pay","UnionPay","JD Pay"]},
      "default":{"Cuenta de Ahorros":["Bank A","Bank B","Bank C","Bank D"],"Tarjeta de Crédito":["Bank A","Bank B","Bank C"],"Crédito de Consumo":["Bank A","Bank B","Bank C"],"Crédito Hipotecario":["Bank A","Bank B","Bank C"],"Comisión Transferencia":["Bank A","Bank B","Bank C"],"CDT / Depósito a Plazo":["Bank A","Bank B","Bank C"],"Nómina Empresarial":["Bank A","Bank B","Bank C"],"Billetera Digital":["Wallet A","Wallet B","Wallet C"]},
    }
  },
  "Tecnología":{ products:["Smartphone Gama Media","Smartphone Gama Alta","Laptop 14 pulgadas","Tablet 10 pulgadas","Smart TV 55 pulgadas","Auriculares Bluetooth","Licencia Software Ofimática","Servicio Cloud Básico"],
    companiesByCountry:{
      "Colombia":{"Smartphone Gama Media":["Éxito","Falabella","Alkosto","Ktronix"],"Smartphone Gama Alta":["iShop","Samsung Store","Falabella","Éxito"],"Laptop 14 pulgadas":["Ktronix","Alkosto","Falabella","Éxito"],"Tablet 10 pulgadas":["Ktronix","Alkosto","Falabella","Éxito"],"Smart TV 55 pulgadas":["Ktronix","Alkosto","Falabella","Samsung Store"],"Auriculares Bluetooth":["Ktronix","Alkosto","Falabella","Éxito"],"Licencia Software Ofimática":["Microsoft Colombia","Google Colombia","Apple Colombia","Oficina Softnet"],"Servicio Cloud Básico":["AWS Colombia","Google Cloud Colombia","Microsoft Azure","Claro Cloud"]},
      "China":{"Smartphone Gama Media":["JD.com","Tmall","Suning","Xiaomi Store"],"Smartphone Gama Alta":["Apple China","Samsung China","Huawei Store","JD.com"],"Laptop 14 pulgadas":["JD.com","Tmall","Lenovo Store","Dell China"],"Tablet 10 pulgadas":["JD.com","Tmall","Huawei Store","Xiaomi Store"],"Smart TV 55 pulgadas":["JD.com","Tmall","TCL Store","Xiaomi Store"],"Auriculares Bluetooth":["JD.com","Tmall","Xiaomi Store","Huawei Store"],"Licencia Software Ofimática":["Microsoft China","WPS Office","DingTalk","Feishu"],"Servicio Cloud Básico":["Alibaba Cloud","Tencent Cloud","Huawei Cloud","Baidu Cloud"]},
      "default":{"Smartphone Gama Media":["Retailer A","Retailer B","Retailer C"],"Smartphone Gama Alta":["Retailer A","Retailer B","Retailer C"],"Laptop 14 pulgadas":["Retailer A","Retailer B","Retailer C"],"Tablet 10 pulgadas":["Retailer A","Retailer B","Retailer C"],"Smart TV 55 pulgadas":["Retailer A","Retailer B","Retailer C"],"Auriculares Bluetooth":["Retailer A","Retailer B","Retailer C"],"Licencia Software Ofimática":["Software A","Software B","Software C"],"Servicio Cloud Básico":["Cloud A","Cloud B","Cloud C"]},
    }
  },
  "Salud":{ products:["Consulta Médica General","Consulta Médica Especialista","Examen de Laboratorio","Radiografía","Resonancia Magnética","Cirugía Ambulatoria","Fisioterapia Sesión","Plan de Salud Prepagada"],
    companiesByCountry:{
      "Colombia":{"Consulta Médica General":["Sura","Colsanitas","Coomeva","Compensar","Sanitas"],"Consulta Médica Especialista":["Sura","Colsanitas","Coomeva","Compensar","Sanitas"],"Examen de Laboratorio":["Clínica del Country","Fundación Santa Fe","Pablo Tobón Uribe","Clínica Medellín"],"Radiografía":["Clínica del Country","Fundación Santa Fe","Pablo Tobón Uribe","ImagCorp"],"Resonancia Magnética":["Clínica del Country","Fundación Santa Fe","Clínica Medellín","ImagCorp"],"Cirugía Ambulatoria":["Clínica del Country","Fundación Santa Fe","Pablo Tobón Uribe","Clínica Medellín"],"Fisioterapia Sesión":["Compensar","Colsubsidio","Colsanitas","IPS privadas"],"Plan de Salud Prepagada":["Sura","Colsanitas","Coomeva","Compensar","Sanitas"]},
      "default":{"Consulta Médica General":["Clinic A","Clinic B","Clinic C"],"Consulta Médica Especialista":["Clinic A","Clinic B","Clinic C"],"Examen de Laboratorio":["Lab A","Lab B","Lab C"],"Radiografía":["Clinic A","Clinic B","Clinic C"],"Resonancia Magnética":["Clinic A","Clinic B","Clinic C"],"Cirugía Ambulatoria":["Hospital A","Hospital B","Hospital C"],"Fisioterapia Sesión":["Clinic A","Clinic B","Clinic C"],"Plan de Salud Prepagada":["Insurer A","Insurer B","Insurer C"]},
    }
  },
};

const BASE_PRICES = {
  "Gasolina Regular":9600,"Gasolina Premium":11200,"ACPM / Diésel":9100,"Gas Natural":3200,"Energía Eléctrica":450,"Gas Licuado (GLP)":2800,"Carbón":85000,"Energía Solar":3500,
  "Internet Hogar 100Mbps":87000,"Internet Hogar 300Mbps":115000,"Internet Hogar 1Gbps":160000,"Telefonía Móvil Postpago":65000,"Telefonía Móvil Prepago":25000,"TV por Suscripción":72000,"Telefonía Fija":28000,"Roaming Internacional":45000,"Streaming Música":18000,"Streaming Video":32000,
  "Pollo Entero":9200,"Carne de Res (kg)":28000,"Aceite Vegetal 1L":8900,"Leche 1L":3400,"Arroz 1kg":4100,"Pan Tajado":5200,"Huevos (docena)":14500,"Azúcar 1kg":3800,"Harina de Trigo 1kg":4200,"Café Molido 500g":18000,"Agua Embotellada 1.5L":2800,"Atún en lata":8500,
  "Seguro Auto Básico":1820000,"Seguro Auto Todo Riesgo":3400000,"Seguro de Vida":980000,"SOAT / Seguro Obligatorio":580000,"Seguro de Hogar":720000,"Seguro de Salud":250000,"Seguro Empresarial":2800000,"Seguro de Viaje":180000,
  "Acetaminofén 500mg":8500,"Ibuprofeno 400mg":12000,"Amoxicilina 500mg":32000,"Omeprazol 20mg":18000,"Metformina 850mg":22000,"Atorvastatina 20mg":45000,"Losartán 50mg":38000,"Vitamina C 1000mg":25000,"Vitamina D 1000UI":28000,"Anticonceptivos orales":35000,
  "Taxi / Rideshare km":2800,"Servicio de Bus":2950,"Vuelo Doméstico":280000,"Vuelo Internacional":1800000,"Peaje Autopista":12500,"Servicio de Metro":2950,"Transporte de Carga":180000,"Mensajería Express":8500,"Bicicletas Compartidas":2500,"Patinetas Eléctricas":3200,
  "Cuenta de Ahorros":0,"Tarjeta de Crédito":38000,"Crédito de Consumo":1800000,"Crédito Hipotecario":180000000,"Comisión Transferencia":8500,"CDT / Depósito a Plazo":5000000,"Nómina Empresarial":85000,"Billetera Digital":0,
  "Smartphone Gama Media":850000,"Smartphone Gama Alta":3200000,"Laptop 14 pulgadas":2800000,"Tablet 10 pulgadas":1200000,"Smart TV 55 pulgadas":1800000,"Auriculares Bluetooth":280000,"Licencia Software Ofimática":180000,"Servicio Cloud Básico":85000,
  "Consulta Médica General":85000,"Consulta Médica Especialista":180000,"Examen de Laboratorio":45000,"Radiografía":85000,"Resonancia Magnética":580000,"Cirugía Ambulatoria":2800000,"Fisioterapia Sesión":65000,"Plan de Salud Prepagada":320000,
};

const UNITS = {
  "Gasolina Regular":"litro","Gasolina Premium":"litro","ACPM / Diésel":"litro","Gas Natural":"m³","Energía Eléctrica":"kWh","Gas Licuado (GLP)":"kg","Carbón":"tonelada","Energía Solar":"kWp",
  "Internet Hogar 100Mbps":"mes","Internet Hogar 300Mbps":"mes","Internet Hogar 1Gbps":"mes","Telefonía Móvil Postpago":"mes","Telefonía Móvil Prepago":"plan","TV por Suscripción":"mes","Telefonía Fija":"mes","Roaming Internacional":"plan","Streaming Música":"mes","Streaming Video":"mes",
  "Pollo Entero":"kg","Carne de Res (kg)":"kg","Aceite Vegetal 1L":"und","Leche 1L":"und","Arroz 1kg":"kg","Pan Tajado":"und","Huevos (docena)":"docena","Azúcar 1kg":"kg","Harina de Trigo 1kg":"kg","Café Molido 500g":"und","Agua Embotellada 1.5L":"und","Atún en lata":"und",
  "Seguro Auto Básico":"año","Seguro Auto Todo Riesgo":"año","Seguro de Vida":"año","SOAT / Seguro Obligatorio":"año","Seguro de Hogar":"año","Seguro de Salud":"mes","Seguro Empresarial":"año","Seguro de Viaje":"viaje",
  "Acetaminofén 500mg":"caja","Ibuprofeno 400mg":"caja","Amoxicilina 500mg":"caja","Omeprazol 20mg":"caja","Metformina 850mg":"caja","Atorvastatina 20mg":"caja","Losartán 50mg":"caja","Vitamina C 1000mg":"caja","Vitamina D 1000UI":"caja","Anticonceptivos orales":"caja",
  "Taxi / Rideshare km":"km","Servicio de Bus":"pasaje","Vuelo Doméstico":"tiquete","Vuelo Internacional":"tiquete","Peaje Autopista":"paso","Servicio de Metro":"pasaje","Transporte de Carga":"envío","Mensajería Express":"envío","Bicicletas Compartidas":"viaje","Patinetas Eléctricas":"viaje",
  "Cuenta de Ahorros":"mes","Tarjeta de Crédito":"año","Crédito de Consumo":"crédito","Crédito Hipotecario":"crédito","Comisión Transferencia":"transacción","CDT / Depósito a Plazo":"inversión","Nómina Empresarial":"mes","Billetera Digital":"mes",
  "Smartphone Gama Media":"und","Smartphone Gama Alta":"und","Laptop 14 pulgadas":"und","Tablet 10 pulgadas":"und","Smart TV 55 pulgadas":"und","Auriculares Bluetooth":"und","Licencia Software Ofimática":"año","Servicio Cloud Básico":"mes",
  "Consulta Médica General":"consulta","Consulta Médica Especialista":"consulta","Examen de Laboratorio":"examen","Radiografía":"und","Resonancia Magnética":"und","Cirugía Ambulatoria":"procedimiento","Fisioterapia Sesión":"sesión","Plan de Salud Prepagada":"mes",
};

const PRICE_MULT = {"Colombia":1,"México":1.2,"Brasil":1.3,"Argentina":0.9,"Chile":1.1,"Perú":0.85,"Ecuador":0.95,"Bolivia":0.7,"Paraguay":0.65,"Uruguay":1.15,"España":1.8,"Francia":1.9,"Alemania":1.85,"Italia":1.75,"Reino Unido":2.1,"Portugal":1.6,"Países Bajos":1.95,"Suecia":2.0,"Polonia":1.3,"Estados Unidos":2.2,"Canadá":2.0,"China":0.8,"Japón":2.5,"Corea del Sur":1.7,"India":0.4};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es:{
    appSubtitle:"MONITOR ANTIMONOPOLIO",live:"EN VIVO",alerts:"ALERTA",alertsPlural:"ALERTAS",
    tabs:["📊 Dashboard","📉 Comparativa","🔔 Alertas","⚖️ Dictamen IA"],
    filterTitle:"Filtros de Consulta",worldRegion:"Región del mundo",country:"País",
    territory:"Territorio / Ciudad",market:"Mercado",product:"Producto / Servicio",
    company:"Empresa",dateFrom:"Fecha desde",dateTo:"Fecha hasta",
    hourFrom:"Hora desde",hourTo:"Hora hasta",authority:"AUTORIDAD COMPETENTE",
    legalFrame:"MARCO LEGAL",allCompanies:"Todas",allCompaniesLabel:"Todas las empresas",
    riskLevel:"Nivel de riesgo",marketDispersion:"Dispersión mercado",
    avgVariation:"Variación media",maxPrice:"Precio máximo",minPrice:"Precio mínimo",
    avgPrice:"Precio promedio",betweenCompetitors:"entre competidores",
    vsPrevPeriod:"vs período anterior",mostExpensive:"más caro del mercado",
    cheapest:"más barato del mercado",marketAvg:"media del mercado",score:"Score",
    activeAlerts:"Alertas Activas",detection:"detección",detections:"detecciones",
    critical:"CRÍTICAS",high:"ALTAS",medium:"MEDIAS",jurisdiction:"JURISDICCIÓN",
    noAlerts:"No se detectaron prácticas restrictivas en el mercado seleccionado.",
    notifChannels:"Canales de Notificación",emailAlerts:"Correo electrónico",
    active:"Activo",alwaysActive:"Siempre activo",inAppNotif:"Notificación en app",
    inAppDesc:"Las alertas se actualizan automáticamente al cambiar los filtros.",
    noConfigRequired:"Sin configuración requerida",comingSoon:"Próximamente",
    inDevelopment:"En desarrollo",detectionThresholds:"Umbrales de Detección",
    activateEmail:"Activar alertas por email",configured:"✓ Configurado",
    comparison:"Comparativa entre Competidores",
    rankingTitle:"RANKING DE PRECIOS — menor a mayor",average:"Promedio",
    currentVsPrev:"PRECIO ACTUAL vs ANTERIOR",
    deviationVsAvg:"DESVIACIÓN VS PROMEDIO DE MERCADO",
    historicalEvolution:"EVOLUCIÓN HISTÓRICA COMPARADA (7 MESES)",
    riskStats:"Estadísticas de Riesgo Anticompetitivo",seeDetail:"Ver detalle →",
    aiAnalysis:"Dictamen Jurídico con IA",
    aiDesc:"La IA genera un dictamen técnico-jurídico con base legal exacta, probabilidad de infracción y recomendaciones de investigación.",
    generateDictum:"⚖️ Generar Dictamen Legal",analyzing:"Analizando",dictum:"DICTAMEN",
    legalBase:"BASE LEGAL",recommendedAction:"ACCIÓN RECOMENDADA",
    applicableSanctions:"SANCIONES APLICABLES",severity:"SEVERIDAD",probability:"PROBABILIDAD",
    period:"Período",schedule:"Horario",currentPrice:"Precio actual",
    prevPrice:"Precio anterior",variation:"Variación",vsAverage:"vs Promedio",
    marketShare:"Cuota mercado",changes30:"Cambios 30 días",priceAdjustments:"ajustes de precio",
    individualProfile:"Perfil Individual",historicalPrice:"EVOLUCIÓN HISTÓRICA DE PRECIO",
    competitiveScore:"SCORECARD COMPETITIVO",higherBetter:"Mayor valor = mejor desempeño relativo",
    per:"por",prevPeriod:"período anterior",marketDeviation:"desviación del mercado",estimated:"estimado",
    prev:"Anterior",current:"Actual",devFromAvg:"Desv. del promedio",complaints:"Quejas",selected:"seleccionada",
    sevLabels:{"CRÍTICA":"CRÍTICA","ALTA":"ALTA","MEDIA":"MEDIA"},
    riskLabels:{critical:"CRÍTICO",high:"ALTO",medium:"MEDIO",low:"BAJO"},
    regions:{"América Latina":"América Latina","Europa":"Europa","América del Norte":"América del Norte","Asia":"Asia"},
    markets:{"Energía":"Energía","Telecomunicaciones":"Telecomunicaciones","Alimentos":"Alimentos","Seguros":"Seguros","Farmacéutico":"Farmacéutico","Transporte":"Transporte","Banca y Finanzas":"Banca y Finanzas","Tecnología":"Tecnología","Salud":"Salud"},
    patternTypes:{"FIJACIÓN DE PRECIOS":"FIJACIÓN DE PRECIOS","ALZA SIMULTÁNEA":"ALZA SIMULTÁNEA","PARALELISMO DE PRECIOS":"PARALELISMO DE PRECIOS","POSICIÓN DOMINANTE":"POSICIÓN DOMINANTE","PRECIOS PREDATORIOS":"PRECIOS PREDATORIOS","CONCENTRACIÓN":"CONCENTRACIÓN"},
    patternDescs:{"FIJACIÓN DE PRECIOS":(v,n)=>`Dispersión de solo ${v}% entre ${n} competidores. Coordinación horizontal altamente probable.`,"ALZA SIMULTÁNEA":(v)=>`Todos los actores incrementaron precios ${v}% simultáneamente.`,"PARALELISMO DE PRECIOS":(v)=>`Diferencia máxima entre actores: ${v}%. Comportamiento paralelo sospechoso.`,"POSICIÓN DOMINANTE":(c,v)=>`${c} concentra el ${v}% del mercado.`,"PRECIOS PREDATORIOS":(c,v)=>`${c} vende ${v}% por debajo del promedio.`,"CONCENTRACIÓN":(v)=>`Top 2 empresas concentran el ${v}% del mercado.`},
    patternActions:{"FIJACIÓN DE PRECIOS":"Iniciar investigación formal. Solicitar información sobre comunicaciones entre empresas.","ALZA SIMULTÁNEA":"Verificar si existieron comunicados o reuniones previas al alza.","PARALELISMO DE PRECIOS":"Analizar si la uniformidad obedece a factores estructurales legítimos.","POSICIÓN DOMINANTE":"Investigar si impone precios excesivos o condiciona ventas.","PRECIOS PREDATORIOS":"Solicitar estructura de costos. Verificar costo variable medio.","CONCENTRACIÓN":"Revisar historia de adquisiciones. Evaluar barreras de entrada."},
    probLabels:{high80:"Muy Alta (>80%)",high60:"Alta (60-80%)",med40:"Media (40-60%)",med30:"Media-Alta (50-70%)",med35:"Media (35-55%)",med30b:"Media (30-50%)",med30c:"Media (30-45%)"},
    thresholds:["🔴 Fijación de precios — dispersión menor al 0.5%","🟠 Alza simultánea — todos suben más del 10%","🟡 Paralelismo — dispersión entre 0.5% y 2%","🔵 Posición dominante — cuota superior al 60%","⚡ Precios predatorios — precio menor al 75% del promedio","🔶 Alta concentración — top 2 empresas superan el 80%"],
    tableHeaders:["#","EMPRESA","PRECIO","ANTERIOR","VARIACIÓN","vs PROMEDIO","CUOTA","QUEJAS"],
    searchBtn:"🔍 Consultar",freeSearches:"Consultas gratuitas restantes",
    loginTitle:"Inicia sesión para continuar",loginDesc:"Has usado tus 2 consultas gratuitas. Inicia sesión para continuar usando Fair Compes.",
    emailPlaceholder:"tu@correo.com",loginBtn:"Continuar con correo",
    paywallTitle:"Suscríbete para acceso ilimitado",
    paywallDesc:"Accede a todos los mercados, países y dictámenes jurídicos sin límite.",
    paywallFeatures:["✅ Acceso ilimitado a 23 países","✅ 9 mercados y +80 productos","✅ Alertas antimonopolio automáticas","✅ Dictamen jurídico ilimitado","✅ Español e inglés"],
    paywallPrice:"$49 USD / mes",boldBtn:"💳 Pagar con Bold",paypalBtn:"🅿️ Pagar con PayPal",gumroadBtn:"🛒 Pagar con Gumroad",
    backBtn:"Volver a la app",alreadyHave:"¿Ya tienes acceso? Escríbenos a",
    tutorialTitle:"¡Bienvenido a Fair Compes!",tutorialSubtitle:"Tutorial rápido — 4 pasos",
    tutorialSteps:[{icon:"🔍",title:"Selecciona filtros",desc:"Elige el país, mercado, producto y territorio que quieres analizar."},{icon:"📊",title:"Analiza el Dashboard",desc:"Ve el nivel de riesgo, dispersión de precios y alertas anticompetitivas detectadas automáticamente."},{icon:"🔔",title:"Revisa las Alertas",desc:"Cada alerta muestra la base legal exacta, la acción recomendada y las sanciones aplicables."},{icon:"⚖️",title:"Genera el Dictamen",desc:"Obtén un dictamen jurídico completo basado en los datos del mercado seleccionado."}],
    tutorialBtn:"¡Empezar a usar Fair Compes!",
    disclaimer:"⚠️ AVISO IMPORTANTE: El dictamen generado es una orientación preliminar de carácter informativo. Bajo ninguna circunstancia constituye asesoría jurídica formal ni genera efectos jurídicos en procesos administrativos, judiciales o de cualquier otra naturaleza en curso. Para efectos legales, consulte a un abogado especializado en derecho de la competencia.",
    products:{"Gasolina Regular":"Gasolina Regular","Gasolina Premium":"Gasolina Premium","ACPM / Diésel":"ACPM / Diésel","Gas Natural":"Gas Natural","Energía Eléctrica":"Energía Eléctrica","Gas Licuado (GLP)":"Gas Licuado (GLP)","Carbón":"Carbón","Energía Solar":"Energía Solar","Internet Hogar 100Mbps":"Internet Hogar 100Mbps","Internet Hogar 300Mbps":"Internet Hogar 300Mbps","Internet Hogar 1Gbps":"Internet Hogar 1Gbps","Telefonía Móvil Postpago":"Telefonía Móvil Postpago","Telefonía Móvil Prepago":"Telefonía Móvil Prepago","TV por Suscripción":"TV por Suscripción","Telefonía Fija":"Telefonía Fija","Roaming Internacional":"Roaming Internacional","Streaming Música":"Streaming Música","Streaming Video":"Streaming Video","Pollo Entero":"Pollo Entero","Carne de Res (kg)":"Carne de Res (kg)","Aceite Vegetal 1L":"Aceite Vegetal 1L","Leche 1L":"Leche 1L","Arroz 1kg":"Arroz 1kg","Pan Tajado":"Pan Tajado","Huevos (docena)":"Huevos (docena)","Azúcar 1kg":"Azúcar 1kg","Harina de Trigo 1kg":"Harina de Trigo 1kg","Café Molido 500g":"Café Molido 500g","Agua Embotellada 1.5L":"Agua Embotellada 1.5L","Atún en lata":"Atún en lata","Seguro Auto Básico":"Seguro Auto Básico","Seguro Auto Todo Riesgo":"Seguro Auto Todo Riesgo","Seguro de Vida":"Seguro de Vida","SOAT / Seguro Obligatorio":"SOAT / Seguro Obligatorio","Seguro de Hogar":"Seguro de Hogar","Seguro de Salud":"Seguro de Salud","Seguro Empresarial":"Seguro Empresarial","Seguro de Viaje":"Seguro de Viaje","Acetaminofén 500mg":"Acetaminofén 500mg","Ibuprofeno 400mg":"Ibuprofeno 400mg","Amoxicilina 500mg":"Amoxicilina 500mg","Omeprazol 20mg":"Omeprazol 20mg","Metformina 850mg":"Metformina 850mg","Atorvastatina 20mg":"Atorvastatina 20mg","Losartán 50mg":"Losartán 50mg","Vitamina C 1000mg":"Vitamina C 1000mg","Vitamina D 1000UI":"Vitamina D 1000UI","Anticonceptivos orales":"Anticonceptivos orales","Taxi / Rideshare km":"Taxi / Rideshare km","Servicio de Bus":"Servicio de Bus","Vuelo Doméstico":"Vuelo Doméstico","Vuelo Internacional":"Vuelo Internacional","Peaje Autopista":"Peaje Autopista","Servicio de Metro":"Servicio de Metro","Transporte de Carga":"Transporte de Carga","Mensajería Express":"Mensajería Express","Bicicletas Compartidas":"Bicicletas Compartidas","Patinetas Eléctricas":"Patinetas Eléctricas","Cuenta de Ahorros":"Cuenta de Ahorros","Tarjeta de Crédito":"Tarjeta de Crédito","Crédito de Consumo":"Crédito de Consumo","Crédito Hipotecario":"Crédito Hipotecario","Comisión Transferencia":"Comisión Transferencia","CDT / Depósito a Plazo":"CDT / Depósito a Plazo","Nómina Empresarial":"Nómina Empresarial","Billetera Digital":"Billetera Digital","Smartphone Gama Media":"Smartphone Gama Media","Smartphone Gama Alta":"Smartphone Gama Alta","Laptop 14 pulgadas":"Laptop 14 pulgadas","Tablet 10 pulgadas":"Tablet 10 pulgadas","Smart TV 55 pulgadas":"Smart TV 55 pulgadas","Auriculares Bluetooth":"Auriculares Bluetooth","Licencia Software Ofimática":"Licencia Software Ofimática","Servicio Cloud Básico":"Servicio Cloud Básico","Consulta Médica General":"Consulta Médica General","Consulta Médica Especialista":"Consulta Médica Especialista","Examen de Laboratorio":"Examen de Laboratorio","Radiografía":"Radiografía","Resonancia Magnética":"Resonancia Magnética","Cirugía Ambulatoria":"Cirugía Ambulatoria","Fisioterapia Sesión":"Fisioterapia Sesión","Plan de Salud Prepagada":"Plan de Salud Prepagada"},
  },
  en:{
    appSubtitle:"ANTITRUST MONITOR",live:"LIVE",alerts:"ALERT",alertsPlural:"ALERTS",
    tabs:["📊 Dashboard","📉 Comparison","🔔 Alerts","⚖️ AI Legal Opinion"],
    filterTitle:"Query Filters",worldRegion:"World Region",country:"Country",
    territory:"Territory / City",market:"Market",product:"Product / Service",
    company:"Company",dateFrom:"Date from",dateTo:"Date to",
    hourFrom:"Hour from",hourTo:"Hour to",authority:"COMPETENT AUTHORITY",
    legalFrame:"LEGAL FRAMEWORK",allCompanies:"All",allCompaniesLabel:"All companies",
    riskLevel:"Risk level",marketDispersion:"Market dispersion",
    avgVariation:"Average variation",maxPrice:"Maximum price",minPrice:"Minimum price",
    avgPrice:"Average price",betweenCompetitors:"between competitors",
    vsPrevPeriod:"vs previous period",mostExpensive:"most expensive in market",
    cheapest:"cheapest in market",marketAvg:"market average",score:"Score",
    activeAlerts:"Active Alerts",detection:"detection",detections:"detections",
    critical:"CRITICAL",high:"HIGH",medium:"MEDIUM",jurisdiction:"JURISDICTION",
    noAlerts:"No restrictive practices detected in the selected market.",
    notifChannels:"Notification Channels",emailAlerts:"Email",
    active:"Active",alwaysActive:"Always active",inAppNotif:"In-app notification",
    inAppDesc:"Alerts update automatically when filters change.",
    noConfigRequired:"No configuration required",comingSoon:"Coming soon",
    inDevelopment:"In development",detectionThresholds:"Detection Thresholds",
    activateEmail:"Activate email alerts",configured:"✓ Configured",
    comparison:"Competitor Comparison",
    rankingTitle:"PRICE RANKING — lowest to highest",average:"Average",
    currentVsPrev:"CURRENT vs PREVIOUS PRICE",
    deviationVsAvg:"DEVIATION VS MARKET AVERAGE",
    historicalEvolution:"HISTORICAL COMPARISON (7 MONTHS)",
    riskStats:"Antitrust Risk Statistics",seeDetail:"See detail →",
    aiAnalysis:"AI Legal Opinion",
    aiDesc:"The AI generates a technical-legal opinion with exact legal basis, probability of infringement and investigation recommendations.",
    generateDictum:"⚖️ Generate Legal Opinion",analyzing:"Analyzing",dictum:"LEGAL OPINION",
    legalBase:"LEGAL BASIS",recommendedAction:"RECOMMENDED ACTION",
    applicableSanctions:"APPLICABLE SANCTIONS",severity:"SEVERITY",probability:"PROBABILITY",
    period:"Period",schedule:"Schedule",currentPrice:"Current price",
    prevPrice:"Previous price",variation:"Variation",vsAverage:"vs Average",
    marketShare:"Market share",changes30:"Changes 30 days",priceAdjustments:"price adjustments",
    individualProfile:"Individual Profile",historicalPrice:"HISTORICAL PRICE EVOLUTION",
    competitiveScore:"COMPETITIVE SCORECARD",higherBetter:"Higher value = better relative performance",
    per:"per",prevPeriod:"previous period",marketDeviation:"market deviation",estimated:"estimated",
    prev:"Previous",current:"Current",devFromAvg:"Dev. from avg",complaints:"Complaints",selected:"selected",
    sevLabels:{"CRÍTICA":"CRITICAL","ALTA":"HIGH","MEDIA":"MEDIUM"},
    riskLabels:{critical:"CRITICAL",high:"HIGH",medium:"MEDIUM",low:"LOW"},
    regions:{"América Latina":"Latin America","Europa":"Europe","América del Norte":"North America","Asia":"Asia"},
    markets:{"Energía":"Energy","Telecomunicaciones":"Telecommunications","Alimentos":"Food","Seguros":"Insurance","Farmacéutico":"Pharmaceutical","Transporte":"Transport","Banca y Finanzas":"Banking & Finance","Tecnología":"Technology","Salud":"Healthcare"},
    patternTypes:{"FIJACIÓN DE PRECIOS":"PRICE FIXING","ALZA SIMULTÁNEA":"SIMULTANEOUS PRICE HIKE","PARALELISMO DE PRECIOS":"PRICE PARALLELISM","POSICIÓN DOMINANTE":"DOMINANT POSITION","PRECIOS PREDATORIOS":"PREDATORY PRICING","CONCENTRACIÓN":"MARKET CONCENTRATION"},
    patternDescs:{"FIJACIÓN DE PRECIOS":(v,n)=>`Dispersion of only ${v}% among ${n} competitors. Horizontal coordination highly probable.`,"ALZA SIMULTÁNEA":(v)=>`All actors increased prices ${v}% simultaneously.`,"PARALELISMO DE PRECIOS":(v)=>`Maximum difference between actors: ${v}%. Suspicious parallel behavior.`,"POSICIÓN DOMINANTE":(c,v)=>`${c} holds ${v}% of the market.`,"PRECIOS PREDATORIOS":(c,v)=>`${c} sells ${v}% below average.`,"CONCENTRACIÓN":(v)=>`Top 2 companies hold ${v}% of the market.`},
    patternActions:{"FIJACIÓN DE PRECIOS":"Initiate formal investigation. Request information on communications between companies.","ALZA SIMULTÁNEA":"Check if there were press releases or meetings prior to the price increase.","PARALELISMO DE PRECIOS":"Analyze whether uniformity stems from legitimate structural factors.","POSICIÓN DOMINANTE":"Investigate whether the company imposes excessive prices or conditions sales.","PRECIOS PREDATORIOS":"Request cost structure. Verify average variable cost.","CONCENTRACIÓN":"Review acquisition history. Assess entry barriers."},
    probLabels:{high80:"Very High (>80%)",high60:"High (60-80%)",med40:"Medium (40-60%)",med30:"Medium-High (50-70%)",med35:"Medium (35-55%)",med30b:"Medium (30-50%)",med30c:"Medium (30-45%)"},
    thresholds:["🔴 Price fixing — dispersion below 0.5%","🟠 Simultaneous hike — all actors raise over 10%","🟡 Parallelism — dispersion between 0.5% and 2%","🔵 Dominant position — market share above 60%","⚡ Predatory pricing — price below 75% of average","🔶 High concentration — top 2 companies exceed 80%"],
    tableHeaders:["#","COMPANY","PRICE","PREVIOUS","VARIATION","vs AVERAGE","SHARE","COMPLAINTS"],
    searchBtn:"🔍 Search",freeSearches:"Free searches remaining",
    loginTitle:"Sign in to continue",loginDesc:"You've used your 2 free searches. Sign in to continue using Fair Compes.",
    emailPlaceholder:"your@email.com",loginBtn:"Continue with email",
    paywallTitle:"Subscribe for unlimited access",
    paywallDesc:"Access all markets, countries and legal opinions without limits.",
    paywallFeatures:["✅ Unlimited access to 23 countries","✅ 9 markets and +80 products","✅ Automatic antitrust alerts","✅ Unlimited legal opinions","✅ Spanish and English"],
    paywallPrice:"$49 USD / month",boldBtn:"💳 Pay with Bold",paypalBtn:"🅿️ Pay with PayPal",gumroadBtn:"🛒 Pay with Gumroad",
    backBtn:"Back to app",alreadyHave:"Already have access? Email us at",
    tutorialTitle:"Welcome to Fair Compes!",tutorialSubtitle:"Quick tutorial — 4 steps",
    tutorialSteps:[{icon:"🔍",title:"Select filters",desc:"Choose the country, market, product and territory you want to analyze."},{icon:"📊",title:"Analyze the Dashboard",desc:"See the risk level, price dispersion and automatically detected antitrust alerts."},{icon:"🔔",title:"Review Alerts",desc:"Each alert shows the exact legal basis, recommended action and applicable sanctions."},{icon:"⚖️",title:"Generate Legal Opinion",desc:"Get a complete legal opinion based on the selected market data."}],
    tutorialBtn:"Start using Fair Compes!",
    disclaimer:"⚠️ IMPORTANT NOTICE: The generated opinion is a preliminary informational guidance only. Under no circumstances does it constitute formal legal advice or produce legal effects in any ongoing administrative, judicial or other proceedings. For legal purposes, consult a lawyer specialized in competition law.",
    products:{"Gasolina Regular":"Regular Gasoline","Gasolina Premium":"Premium Gasoline","ACPM / Diésel":"Diesel Fuel","Gas Natural":"Natural Gas","Energía Eléctrica":"Electric Power","Gas Licuado (GLP)":"LPG Gas","Carbón":"Coal","Energía Solar":"Solar Energy","Internet Hogar 100Mbps":"Home Internet 100Mbps","Internet Hogar 300Mbps":"Home Internet 300Mbps","Internet Hogar 1Gbps":"Home Internet 1Gbps","Telefonía Móvil Postpago":"Postpaid Mobile","Telefonía Móvil Prepago":"Prepaid Mobile","TV por Suscripción":"Subscription TV","Telefonía Fija":"Landline Phone","Roaming Internacional":"International Roaming","Streaming Música":"Music Streaming","Streaming Video":"Video Streaming","Pollo Entero":"Whole Chicken","Carne de Res (kg)":"Beef (kg)","Aceite Vegetal 1L":"Vegetable Oil 1L","Leche 1L":"Milk 1L","Arroz 1kg":"Rice 1kg","Pan Tajado":"Sliced Bread","Huevos (docena)":"Eggs (dozen)","Azúcar 1kg":"Sugar 1kg","Harina de Trigo 1kg":"Wheat Flour 1kg","Café Molido 500g":"Ground Coffee 500g","Agua Embotellada 1.5L":"Bottled Water 1.5L","Atún en lata":"Canned Tuna","Seguro Auto Básico":"Basic Auto Insurance","Seguro Auto Todo Riesgo":"Full Coverage Insurance","Seguro de Vida":"Life Insurance","SOAT / Seguro Obligatorio":"Mandatory Insurance","Seguro de Hogar":"Home Insurance","Seguro de Salud":"Health Insurance","Seguro Empresarial":"Business Insurance","Seguro de Viaje":"Travel Insurance","Acetaminofén 500mg":"Acetaminophen 500mg","Ibuprofeno 400mg":"Ibuprofen 400mg","Amoxicilina 500mg":"Amoxicillin 500mg","Omeprazol 20mg":"Omeprazole 20mg","Metformina 850mg":"Metformin 850mg","Atorvastatina 20mg":"Atorvastatin 20mg","Losartán 50mg":"Losartan 50mg","Vitamina C 1000mg":"Vitamin C 1000mg","Vitamina D 1000UI":"Vitamin D 1000IU","Anticonceptivos orales":"Oral Contraceptives","Taxi / Rideshare km":"Taxi / Rideshare km","Servicio de Bus":"Bus Service","Vuelo Doméstico":"Domestic Flight","Vuelo Internacional":"International Flight","Peaje Autopista":"Highway Toll","Servicio de Metro":"Metro Service","Transporte de Carga":"Freight Transport","Mensajería Express":"Express Delivery","Bicicletas Compartidas":"Bike Sharing","Patinetas Eléctricas":"Electric Scooters","Cuenta de Ahorros":"Savings Account","Tarjeta de Crédito":"Credit Card","Crédito de Consumo":"Consumer Loan","Crédito Hipotecario":"Mortgage Loan","Comisión Transferencia":"Transfer Fee","CDT / Depósito a Plazo":"Time Deposit","Nómina Empresarial":"Corporate Payroll","Billetera Digital":"Digital Wallet","Smartphone Gama Media":"Mid-Range Smartphone","Smartphone Gama Alta":"High-End Smartphone","Laptop 14 pulgadas":"14-inch Laptop","Tablet 10 pulgadas":"10-inch Tablet","Smart TV 55 pulgadas":"55-inch Smart TV","Auriculares Bluetooth":"Bluetooth Headphones","Licencia Software Ofimática":"Office Software License","Servicio Cloud Básico":"Basic Cloud Service","Consulta Médica General":"General Medical Consultation","Consulta Médica Especialista":"Specialist Consultation","Examen de Laboratorio":"Laboratory Test","Radiografía":"X-Ray","Resonancia Magnética":"MRI Scan","Cirugía Ambulatoria":"Outpatient Surgery","Fisioterapia Sesión":"Physiotherapy Session","Plan de Salud Prepagada":"Prepaid Health Plan"},
  },
};

// ─── DATA GENERATION ─────────────────────────────────────────────────────────
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
  if(score>=55){level=t.riskLabels.critical;color=C.red;}
  else if(score>=35){level=t.riskLabels.high;color=C.amber;}
  else if(score>=15){level=t.riskLabels.medium;color="#d97706";}
  else{level=t.riskLabels.low;color=C.green;}
  return{alerts,risk:{level,score,color},variancePct,changePct,avg,max,min};
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Badge=({label,color})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:.8,fontFamily:"monospace",whiteSpace:"nowrap"}}>{label}</span>;
const SectionTitle=({children})=><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><div style={{height:1,flex:1,background:`linear-gradient(90deg,${C.gold}55,transparent)`}}/><span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span><div style={{height:1,flex:1,background:`linear-gradient(270deg,${C.gold}55,transparent)`}}/></div>;
function StatCard({icon,label,value,sub,color,delay=0}){return<div style={{background:C.card,border:`1px solid ${color}33`,borderRadius:12,padding:"16px 18px",boxShadow:"0 1px 4px #0001",animation:`fadeUp .5s ease ${delay}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><span style={{fontSize:10,color:C.t3,letterSpacing:.8,textTransform:"uppercase"}}>{label}</span><span style={{fontSize:18}}>{icon}</span></div><div style={{fontSize:22,fontWeight:800,color,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{value}</div>{sub&&<div style={{fontSize:11,color:C.t3}}>{sub}</div>}</div>;}
function CTip({children,color}){const col=color||C.gold;return<div style={{background:col+"11",border:`1px solid ${col}33`,borderRadius:8,padding:"10px 14px",fontSize:12,color:col,lineHeight:1.6,marginBottom:12}}>{children}</div>;}
function CTooltip({active,payload,label,unit}){if(!active||!payload?.length)return null;return<div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 14px",fontSize:12,boxShadow:"0 4px 12px #0002"}}><div style={{color:C.t2,marginBottom:6,fontWeight:600}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||C.gold,marginBottom:2}}>{p.name}: <b>{p.value?.toLocaleString()}</b>{unit&&` / ${unit}`}</div>)}</div>;}

// ─── TUTORIAL ─────────────────────────────────────────────────────────────────
function Tutorial({t,onClose}){
  const [step,setStep]=useState(0);
  const steps=t.tutorialSteps;
  return<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(6,9,16,0.9)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:C.surface,border:`2px solid ${C.gold}`,borderRadius:16,padding:32,maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 20px 60px #0006"}}>
      <div style={{fontSize:48,marginBottom:8}}>{steps[step].icon}</div>
      <div style={{fontSize:10,color:C.t4,letterSpacing:1,marginBottom:4}}>{t.tutorialSubtitle} · {step+1}/{steps.length}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:C.gold,marginBottom:12}}>{steps[step].title}</div>
      <p style={{color:C.t2,fontSize:14,lineHeight:1.7,marginBottom:24}}>{steps[step].desc}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:24}}>
        {steps.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?C.gold:C.border,transition:"all .3s"}}/>)}
      </div>
      {step<steps.length-1
        ?<button onClick={()=>setStep(s=>s+1)} style={{width:"100%",background:C.gold,border:"none",borderRadius:10,padding:"14px",color:"#fff",fontSize:14,fontWeight:800,fontFamily:"inherit",cursor:"pointer"}}>
          {t.tutorialSteps[step+1].title} →
        </button>
        :<button onClick={onClose} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"14px",color:"#fff",fontSize:14,fontWeight:800,fontFamily:"inherit",cursor:"pointer"}}>
          {t.tutorialBtn}
        </button>
      }
      {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{marginTop:10,background:"transparent",border:"none",color:C.t3,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Anterior</button>}
    </div>
  </div>;
}

// ─── LOGIN GATE ───────────────────────────────────────────────────────────────
function LoginGate({t,onLogin}){
  const [email,setEmail]=useState("");
  const [error,setError]=useState("");
  const validate=(e)=>{
    if(!e.includes("@")||!e.includes(".")){setError("Por favor ingresa un correo válido");return;}
    onLogin(e);
  };
  return<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(6,9,16,0.9)",zIndex:1500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:C.surface,border:`2px solid ${C.gold}`,borderRadius:16,padding:32,maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 20px 60px #0006"}}>
      <div style={{fontSize:40,marginBottom:12}}>⚖️</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:C.gold,marginBottom:8}}>{t.loginTitle}</div>
      <p style={{color:C.t2,fontSize:13,lineHeight:1.7,marginBottom:24}}>{t.loginDesc}</p>
      <input value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
        placeholder={t.emailPlaceholder} type="email"
        style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${error?C.red:C.borderHi}`,borderRadius:8,padding:"12px 16px",color:C.t1,fontSize:14,fontFamily:"inherit",outline:"none",marginBottom:8}}/>
      {error&&<div style={{color:C.red,fontSize:12,marginBottom:8}}>{error}</div>}
      <button onClick={()=>validate(email)} style={{width:"100%",background:C.gold,border:"none",borderRadius:10,padding:"14px",color:"#fff",fontSize:14,fontWeight:800,fontFamily:"inherit",cursor:"pointer",marginBottom:16}}>
        {t.loginBtn}
      </button>
      <p style={{color:C.t4,fontSize:11}}>
        {t.alreadyHave} <span style={{color:C.gold}}>andrea9522@gmail.com</span>
      </p>
    </div>
  </div>;
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function Paywall({t,lang,onClose}){
  return<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(6,9,16,0.9)",zIndex:1800,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:C.surface,border:`2px solid ${C.gold}`,borderRadius:16,padding:28,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 20px 60px #0006",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{fontSize:40,marginBottom:8}}>🔐</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:C.gold,marginBottom:6}}>{t.paywallTitle}</div>
      <p style={{color:C.t2,fontSize:13,lineHeight:1.7,marginBottom:16}}>{t.paywallDesc}</p>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:16,textAlign:"left"}}>
        {t.paywallFeatures.map((f,i)=><div key={i} style={{fontSize:13,color:C.t1,marginBottom:6}}>{f}</div>)}
        <div style={{fontSize:18,fontWeight:800,color:C.gold,marginTop:10,textAlign:"center"}}>{t.paywallPrice}</div>
      </div>
      <a href="https://checkout.bold.co/payment/LNK_1IOUQ6TUL7" target="_blank" rel="noreferrer"
        style={{display:"block",background:C.gold,borderRadius:10,padding:"13px",color:"#fff",fontSize:14,fontWeight:800,textDecoration:"none",marginBottom:8}}>
        {t.boldBtn}
      </a>
      <a href="https://www.paypal.com/paypalme/AndreaBorda/49" target="_blank" rel="noreferrer"
        style={{display:"block",background:"#003087",borderRadius:10,padding:"13px",color:"#fff",fontSize:14,fontWeight:800,textDecoration:"none",marginBottom:8}}>
        {t.paypalBtn}
      </a>
      <a href="https://andreamuse555.gumroad.com/l/mwipyd" target="_blank" rel="noreferrer"
        style={{display:"block",background:"#ff90e8",borderRadius:10,padding:"13px",color:"#000",fontSize:14,fontWeight:800,textDecoration:"none",marginBottom:14}}>
        {t.gumroadBtn}
      </a>
      <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 20px",color:C.t3,fontSize:13,fontFamily:"inherit",cursor:"pointer",width:"100%",marginBottom:10}}>
        {t.backBtn}
      </button>
      <p style={{color:C.t4,fontSize:11}}>{t.alreadyHave} <span style={{color:C.gold}}>andrea9522@gmail.com</span></p>
    </div>
  </div>;
}

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
  const Toggle=({label,k,color})=><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{fontSize:12,color:C.t2}}>{label}</span><div onClick={()=>setThresholds(p=>({...p,[k]:!p[k]}))} style={{width:40,height:22,borderRadius:11,cursor:"pointer",transition:"all .2s",background:thresholds[k]?color+"44":C.border,border:`1px solid ${thresholds[k]?color:C.borderHi}`,position:"relative"}}><div style={{width:16,height:16,borderRadius:"50%",position:"absolute",top:2,left:thresholds[k]?20:2,transition:"left .2s",background:thresholds[k]?color:C.t4}}/></div></div>;
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
  const DI=({label,val,k})=><div style={{flex:1}}><L c={label}/><input type="date" value={val} onChange={e=>sel(k,e.target.value)} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none"}}/></div>;
  const hours=Array.from({length:24},(_,i)=>String(i).padStart(2,"0"));
  const mins=["00","15","30","45"];
  const TI=({label,val,k})=>{const[h,m]=(val||"00:00").split(":");return<div style={{flex:1}}><L c={label}/><div style={{display:"flex",gap:4}}><select value={h} onChange={e=>sel(k,`${e.target.value}:${m||"00"}`)} style={{flex:1,background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 8px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{hours.map(hh=><option key={hh} value={hh}>{hh}h</option>)}</select><select value={m||"00"} onChange={e=>sel(k,`${h||"00"}:${e.target.value}`)} style={{flex:1,background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 8px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{mins.map(mm=><option key={mm} value={mm}>{mm}m</option>)}</select></div></div>;};
  return<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:26,boxShadow:"0 1px 4px #0001"}}>
    <SectionTitle>{t.filterTitle}</SectionTitle>
    <div style={{marginBottom:16}}>
      <L c={t.worldRegion}/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {Object.entries(GEO).map(([rg,v])=><button key={rg} onClick={()=>sel("region_group",rg)} style={{background:region_group===rg?C.gold+"22":"transparent",border:`1px solid ${region_group===rg?C.gold:C.borderHi}`,borderRadius:8,padding:"7px 14px",color:region_group===rg?C.gold:C.t3,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all .2s",fontWeight:region_group===rg?700:400}}>{v.flag} {t.regions[rg]||rg}</button>)}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:16}}>
      <div><L c={t.country}/><select value={country} onChange={e=>sel("country",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{Object.keys(GEO[region_group]?.countries||{}).map(c=><option key={c} value={c}>{GEO[region_group].countries[c].flag} {c}</option>)}</select></div>
      <div><L c={t.territory}/><select value={region} onChange={e=>sel("region",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{regions.map(r=><option key={r}>{r}</option>)}</select></div>
      <div><L c={t.market}/><select value={market} onChange={e=>sel("market",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{Object.keys(MARKETS).map(m=><option key={m} value={m}>{t.markets[m]||m}</option>)}</select></div>
      <div><L c={t.product}/><select value={product} onChange={e=>sel("product",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{products.map(p=><option key={p} value={p}>{t.products?.[p]||p}</option>)}</select></div>
      <div><L c={t.company}/><select value={company} onChange={e=>sel("company",e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"9px 12px",color:C.t1,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}><option value={t.allCompanies}>{t.allCompaniesLabel}</option>{companies.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
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
        <tbody>{sorted.map((row,i)=>{const chg=((row.price-row.prevPrice)/row.prevPrice)*100,dAvg=((row.price-avg)/avg)*100,isSel=row.company===selectedCompany;return<tr key={row.company} style={{borderBottom:`1px solid ${C.border}22`,background:isSel?C.goldGlow:"transparent"}}><td style={{padding:"10px 14px",fontSize:13,color:C.t3,fontWeight:700}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</td><td style={{padding:"10px 14px",fontSize:13,fontWeight:700,color:isSel?C.gold:C.t1}}>{row.company}{isSel&&<span style={{fontSize:9,color:C.gold}}> ◀</span>}</td><td style={{padding:"10px 14px",fontSize:13,color:C.teal,fontWeight:700}}>{row.price.toLocaleString()}</td><td style={{padding:"10px 14px",fontSize:12,color:C.t3}}>{row.prevPrice.toLocaleString()}</td><td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(chg)>15?C.red:Math.abs(chg)>5?C.amber:C.green}}>{chg>0?"+":""}{chg.toFixed(1)}%</td><td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:Math.abs(dAvg)>5?C.amber:C.green}}>{dAvg>0?"+":""}{dAvg.toFixed(1)}%</td><td style={{padding:"10px 14px"}}><Badge label={`${row.marketShare}%`} color={C.blue}/></td><td style={{padding:"10px 14px"}}><Badge label={row.complaints} color={row.complaints>25?C.red:row.complaints>10?C.amber:C.green}/></td></tr>;})}</tbody>
      </table>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:"0 1px 4px #0001"}}><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.currentVsPrev}</div><ResponsiveContainer width="100%" height={190}><BarChart data={barData} barGap={3}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/><Tooltip content={<CTooltip unit={unit}/>}/><Bar dataKey="prevPrice" fill={C.border} name={t.prev} radius={[3,3,0,0]}/><Bar dataKey="price" fill={C.gold} name={t.current} radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:"0 1px 4px #0001"}}><div style={{fontSize:10,color:C.t3,letterSpacing:.8,marginBottom:12}}>{t.deviationVsAvg}</div><ResponsiveContainer width="100%" height={190}><BarChart data={barData}><CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/><Tooltip formatter={v=>[`${v}%`,t.devFromAvg]}/><ReferenceLine y={0} stroke={C.t3} strokeDasharray="4 4"/><Bar dataKey="diff" fill={C.teal} name={t.devFromAvg} radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
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
    {alerts.length>0?<div>{alerts.map((a,i)=><div key={i} style={{background:a.color+"0d",border:`1px solid ${a.color}44`,borderLeft:`3px solid ${a.color}`,borderRadius:10,padding:"13px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>{a.icon}</span><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{color:a.color,fontWeight:700,fontSize:13}}>{a.type}</span><Badge label={a.sev} color={a.color}/><Badge label={a.probability} color={a.color}/></div><p style={{color:C.t2,fontSize:12,margin:0,lineHeight:1.5}}>{a.desc}</p></div><button onClick={onGoToAlerts} style={{background:"transparent",border:`1px solid ${a.color}44`,borderRadius:7,padding:"6px 12px",color:a.color,fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>{t.seeDetail}</button></div>)}</div>:<CTip color={C.green}>✅ {t.noAlerts}</CTip>}
  </div>;
}

function AIAnalysis({data,analysis,product,country,region,unit,t}){
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  const lf=LEGAL[country]||LEGAL["Colombia"];
  const displayProduct=t.products?.[product]||product;
  const Dot=({delay})=><span style={{width:7,height:7,borderRadius:"50%",background:C.gold,display:"inline-block",animation:`pulse 1.2s ease-in-out ${delay}s infinite`}}/>;

  const generateLocalOpinion=()=>{
    const {alerts,risk,variancePct,changePct,avg,max,min}=analysis;
    const isES=t.appSubtitle==="MONITOR ANTIMONOPOLIO";
    const sorted=[...data].sort((a,b)=>a.price-b.price);
    const cheapest=sorted[0];
    const mostExp=sorted[sorted.length-1];
    const allUp=data.every(d=>d.price>d.prevPrice);
    if(isES){
      let o=`DICTAMEN TÉCNICO-JURÍDICO\n`;
      o+=`Producto: ${product} | Territorio: ${region} | Jurisdicción: ${country}\n`;
      o+=`Autoridad competente: ${lf.authority}\n`;
      o+=`Marco legal: ${lf.law}\n\n`;
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      o+=`1. DIAGNÓSTICO ECONÓMICO DEL MERCADO\n`;
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      o+=`El mercado de ${product} en ${region} presenta un precio promedio de ${Math.round(avg).toLocaleString()} por ${unit}, con una dispersión entre competidores del ${variancePct.toFixed(2)}%. `;
      o+=variancePct<1?`Esta convergencia extrema (inferior al 1%) entre ${data.length} actores constituye una anomalía estadística que no puede explicarse por factores estructurales homogéneos.\n\n`:`La variación entre competidores es ${variancePct<5?"baja":"moderada"}, ${variancePct<3?"lo que podría indicar comportamiento coordinado":"consistente con competencia normal"}.\n\n`;
      o+=`El actor más económico es ${cheapest?.company} (${cheapest?.price.toLocaleString()} / ${unit}) y el de mayor precio es ${mostExp?.company} (${mostExp?.price.toLocaleString()} / ${unit}). `;
      o+=allUp?`Todos los actores incrementaron precios un ${changePct.toFixed(1)}% simultáneamente.\n\n`:`Los precios presentaron variaciones diferenciadas entre competidores.\n\n`;
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      o+=`2. PRÁCTICAS RESTRICTIVAS IDENTIFICADAS\n`;
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      if(alerts.length===0){o+=`No se identificaron patrones de conducta anticompetitiva en el período analizado.\n\n`;}
      else{alerts.forEach((a,i)=>{o+=`${i+1}. ${a.type}\n   Base legal: ${lf.rules?.[Object.keys(lf.rules).find(k=>t.patternTypes[k]===a.type)]||a.legal}\n   Descripción: ${a.desc}\n   Probabilidad: ${a.probability}\n\n`;});}
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      o+=`3. RECOMENDACIONES DE INVESTIGACIÓN\n`;
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      if(alerts.length===0){o+=`Se recomienda mantener monitoreo periódico y ampliar el análisis a un período más extenso.\n\n`;}
      else{o+=`Se recomienda a ${lf.authority}:\n\na) Iniciar investigación preliminar para verificar comunicaciones entre actores del mercado.\nb) Solicitar a (${data.map(d=>d.company).join(", ")}) información sobre estructura de costos y política comercial.\nc) Revisar actas de asociaciones gremiales del sector durante el período analizado.\nd) Ampliar el análisis con datos históricos de al menos 24 meses.\n\n`;}
      o+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      o+=`4. NIVEL DE RIESGO Y SANCIONES APLICABLES\n`;
