import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const C = {
  bg:"#f0f4f8", surface:"#ffffff", card:"#ffffff",
  border:"#dde3ed", borderHi:"#c2cfe0",
  gold:"#b45309", goldDim:"#92400e", goldGlow:"#b4530922",
  teal:"#0d9488", red:"#dc2626", amber:"#d97706",
  green:"#059669", blue:"#2563eb", purple:"#7c3aed",
  t1:"#0f172a", t2:"#1e3a5f", t3:"#475569", t4:"#94a3b8",
};

// ─── GEOGRAPHIC DATA ──────────────────────────────────────────────────────────
const GEO = {
  "América Latina":{ flag:"🌎", countries:{
    "Colombia":{ flag:"🇨🇴", currency:"COP", regions:["Nacional","Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Cartagena","Pereira"] },
    "México":{ flag:"🇲🇽", currency:"MXN", regions:["Nacional","Ciudad de México","Guadalajara","Monterrey","Puebla","Tijuana","Mérida"] },
    "Brasil":{ flag:"🇧🇷", currency:"BRL", regions:["Nacional","São Paulo","Rio de Janeiro","Brasília","Salvador","Fortaleza","Manaus"] },
    "Argentina":{ flag:"🇦🇷", currency:"ARS", regions:["Nacional","Buenos Aires","Córdoba","Rosario","Mendoza","Tucumán","La Plata"] },
    "Chile":{ flag:"🇨🇱", currency:"CLP", regions:["Nacional","Santiago","Valparaíso","Concepción","Antofagasta","La Serena"] },
    "Perú":{ flag:"🇵🇪", currency:"PEN", regions:["Nacional","Lima","Arequipa","Trujillo","Chiclayo","Piura"] },
    "Ecuador":{ flag:"🇪🇨", currency:"USD", regions:["Nacional","Quito","Guayaquil","Cuenca","Ambato","Manta"] },
  }},
  "Europa":{ flag:"🌍", countries:{
    "España":{ flag:"🇪🇸", currency:"EUR", regions:["Nacional","Madrid","Barcelona","Valencia","Sevilla","Bilbao"] },
    "Francia":{ flag:"🇫🇷", currency:"EUR", regions:["Nacional","París","Lyon","Marsella","Toulouse","Burdeos"] },
    "Alemania":{ flag:"🇩🇪", currency:"EUR", regions:["Nacional","Berlín","Múnich","Hamburgo","Fráncfort","Colonia"] },
  }},
  "América del Norte":{ flag:"🌎", countries:{
    "Estados Unidos":{ flag:"🇺🇸", currency:"USD", regions:["Nacional","Nueva York","Los Ángeles","Chicago","Houston","Miami"] },
    "Canadá":{ flag:"🇨🇦", currency:"CAD", regions:["Nacional","Toronto","Montreal","Vancouver","Calgary","Ottawa"] },
  }},
  "Asia":{ flag:"🌏", countries:{
    "China":{ flag:"🇨🇳", currency:"CNY", regions:["Nacional","Pekín","Shanghái","Shenzhen","Guangzhou","Chengdu"] },
    "Japón":{ flag:"🇯🇵", currency:"JPY", regions:["Nacional","Tokio","Osaka","Kioto","Yokohama","Nagoya"] },
  }},
};

// ─── LEGAL FRAMEWORK ──────────────────────────────────────────────────────────
const LEGAL = {
  "Colombia":{ authority:"Superintendencia de Industria y Comercio (SIC)", law:"Decreto 2153/1992 y Ley 1340/2009", sanction:"Multas hasta 100.000 SMMLV" },
  "México":{ authority:"COFECE", law:"Ley Federal de Competencia Económica", sanction:"Multas hasta 10% de ingresos" },
  "Brasil":{ authority:"CADE", law:"Lei 12.529/2011", sanction:"Multa de 0,1% a 20% del faturamento" },
  "Argentina":{ authority:"CNDC", law:"Ley 27.442/2018", sanction:"Multas hasta 30% de facturación" },
  "Chile":{ authority:"FNE y TDLC", law:"Decreto Ley 211/1973", sanction:"Multas hasta 30.000 UTA" },
  "Perú":{ authority:"INDECOPI", law:"Decreto Legislativo 1034/2008", sanction:"Multas hasta 1.000 UIT" },
  "Ecuador":{ authority:"SCPM", law:"LORCPM", sanction:"Multas hasta 12% de ingresos" },
  "España":{ authority:"CNMC", law:"Ley 15/2007 + Art. 101-102 TFUE", sanction:"Multas hasta 10% de volumen" },
  "Francia":{ authority:"Autorité de la Concurrence", law:"Code de commerce", sanction:"Multas hasta 10% de facturación" },
  "Alemania":{ authority:"Bundeskartellamt", law:"GWB + Art. 101-102 TFUE", sanction:"Multas hasta 10% del volumen" },
  "Estados Unidos":{ authority:"FTC / DOJ", law:"Sherman Act + Clayton Act", sanction:"Multas hasta $100M" },
  "Canadá":{ authority:"Competition Bureau", law:"Competition Act", sanction:"Multas hasta $25M" },
  "China":{ authority:"SAMR", law:"Ley Antimonopolio", sanction:"Multas 1% a 10% de ventas" },
  "Japón":{ authority:"JFTC", law:"Antimonopoly Act", sanction:"Surcharges hasta 10%" },
};

// ─── MARKETS & PRODUCTS ───────────────────────────────────────────────────────
const MARKETS = {
  "Energía":{ 
    products:["Gasolina Regular","Gasolina Premium","ACPM / Diésel","Gas Natural","Energía Eléctrica","Gas Licuado (GLP)","Carbón"],
    companies:{ "Colombia":["Terpel","Biomax","Texaco","Primax","Zeuss"], "default":["Company A","Company B","Company C","Company D","Company E"] }
  },
  "Alimentos":{ 
    products:["Pollo Entero","Carne de Res (kg)","Aceite Vegetal 1L","Leche 1L","Arroz 1kg","Pan Tajado","Huevos (docena)","Azúcar 1kg","Café Molido 500g","Agua Embotellada 1.5L"],
    companies:{ "Colombia":["Éxito","Jumbo","Carulla","D1","Ara","Alkosto"], "default":["Chain A","Chain B","Chain C","Chain D","Chain E"] }
  },
  "Telecomunicaciones":{ 
    products:["Internet Hogar 100Mbps","Internet Hogar 300Mbps","Internet Hogar 1Gbps","Telefonía Móvil Postpago","TV por Suscripción"],
    companies:{ "Colombia":["Claro","Movistar","ETB","Tigo","WOM"], "default":["Operator A","Operator B","Operator C","Operator D"] }
  },
  "Seguros":{ 
    products:["Seguro Auto Básico","Seguro Auto Todo Riesgo","Seguro de Vida","Seguro de Hogar","Seguro de Salud"],
    companies:{ "Colombia":["Sura","Bolívar","Allianz","Mapfre","Axa"], "default":["Insurer A","Insurer B","Insurer C"] }
  },
};

// ─── BASE PRICES ──────────────────────────────────────────────────────────────
const BASE_PRICES = {
  "Gasolina Regular":9600,"Gasolina Premium":11200,"ACPM / Diésel":9100,"Gas Natural":3200,"Energía Eléctrica":450,"Gas Licuado (GLP)":2800,"Carbón":85000,
  "Pollo Entero":9200,"Carne de Res (kg)":28000,"Aceite Vegetal 1L":8900,"Leche 1L":3400,"Arroz 1kg":4100,"Pan Tajado":5200,"Huevos (docena)":14500,"Azúcar 1kg":3800,"Café Molido 500g":18000,"Agua Embotellada 1.5L":2800,
  "Internet Hogar 100Mbps":87000,"Internet Hogar 300Mbps":115000,"Internet Hogar 1Gbps":160000,"Telefonía Móvil Postpago":65000,"TV por Suscripción":72000,
  "Seguro Auto Básico":1820000,"Seguro Auto Todo Riesgo":3400000,"Seguro de Vida":980000,"Seguro de Hogar":720000,"Seguro de Salud":250000,
};

const UNITS = {
  "Gasolina Regular":"litro","Gasolina Premium":"litro","ACPM / Diésel":"litro","Gas Natural":"m³","Energía Eléctrica":"kWh","Gas Licuado (GLP)":"kg","Carbón":"tonelada",
  "Pollo Entero":"kg","Carne de Res (kg)":"kg","Aceite Vegetal 1L":"und","Leche 1L":"und","Arroz 1kg":"kg","Pan Tajado":"und","Huevos (docena)":"docena","Azúcar 1kg":"kg","Café Molido 500g":"und","Agua Embotellada 1.5L":"und",
  "Internet Hogar 100Mbps":"mes","Internet Hogar 300Mbps":"mes","Internet Hogar 1Gbps":"mes","Telefonía Móvil Postpago":"mes","TV por Suscripción":"mes",
  "Seguro Auto Básico":"año","Seguro Auto Todo Riesgo":"año","Seguro de Vida":"año","Seguro de Hogar":"año","Seguro de Salud":"mes",
};

const PRICE_MULT = {
  "Colombia":1,"México":1.2,"Brasil":1.3,"Argentina":0.9,"Chile":1.1,"Perú":0.85,"Ecuador":0.95,
  "España":1.8,"Francia":1.9,"Alemania":1.85,"Italia":1.75,"Reino Unido":2.1,"Portugal":1.6,
  "Estados Unidos":2.2,"Canadá":2.0,"China":0.8,"Japón":2.5,"Corea del Sur":1.7,"India":0.4
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es:{
    appSubtitle:"MONITOR ANTIMONOPOLIO",live:"EN VIVO",
    tabs:["📊 Dashboard","📉 Comparativa","🔔 Alertas","⚖️ Dictamen IA"],
    filterTitle:"Filtros de Consulta",worldRegion:"Región del mundo",country:"País",
    territory:"Territorio / Ciudad",market:"Mercado",product:"Producto",company:"Empresa",
    dateFrom:"Fecha desde",dateTo:"Fecha hasta",authority:"AUTORIDAD COMPETENTE",
    legalFrame:"MARCO LEGAL",allCompanies:"Todas las empresas",riskLevel:"Nivel de riesgo",
    searchBtn:"🔍 Consultar",freeSearches:"Consultas gratuitas",markets:{"Energía":"Energía","Alimentos":"Alimentos","Telecomunicaciones":"Telecomunicaciones","Seguros":"Seguros"},
    comparison:"Comparativa entre Competidores",rankingTitle:"RANKING DE PRECIOS",
    tableHeaders:["#","EMPRESA","PRECIO","ANTERIOR","VARIACIÓN","vs PROMEDIO","CUOTA","QUEJAS"],
    activeAlerts:"Alertas Activas",noAlerts:"No se detectaron prácticas restrictivas.",
    paywallTitle:"Suscríbete para acceso ilimitado",paywallDesc:"Accede a todos los mercados sin límite.",
    paywallPrice:"$49 USD / mes",boldBtn:"💳 Pagar con Bold",currentPrice:"Precio actual",
    prevPrice:"Precio anterior",variation:"Variación",vsAverage:"vs Promedio",marketShare:"Cuota mercado",
    complaints:"Quejas",historicalEvolution:"EVOLUCIÓN HISTÓRICA",
  },
  en:{
    appSubtitle:"ANTITRUST MONITOR",live:"LIVE",
    tabs:["📊 Dashboard","📉 Comparison","🔔 Alerts","⚖️ AI Opinion"],
    filterTitle:"Query Filters",worldRegion:"World Region",country:"Country",
    territory:"Territory / City",market:"Market",product:"Product",company:"Company",
    dateFrom:"Date from",dateTo:"Date to",authority:"COMPETENT AUTHORITY",
    legalFrame:"LEGAL FRAMEWORK",allCompanies:"All companies",riskLevel:"Risk level",
    searchBtn:"🔍 Search",freeSearches:"Free searches",markets:{"Energía":"Energy","Alimentos":"Food","Telecomunicaciones":"Telecom","Seguros":"Insurance"},
    comparison:"Competitor Comparison",rankingTitle:"PRICE RANKING",
    tableHeaders:["#","COMPANY","PRICE","PREVIOUS","VARIATION","vs AVERAGE","SHARE","COMPLAINTS"],
    activeAlerts:"Active Alerts",noAlerts:"No restrictive practices detected.",
    paywallTitle:"Subscribe for unlimited access",paywallDesc:"Access all markets without limits.",
    paywallPrice:"$49 USD / month",boldBtn:"💳 Pay with Bold",currentPrice:"Current price",
    prevPrice:"Previous price",variation:"Variation",vsAverage:"vs Average",marketShare:"Market share",
    complaints:"Complaints",historicalEvolution:"HISTORICAL EVOLUTION",
  },
};

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────
function seeded(seed){
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0x7fffffff;
  };
}

function getCompanies(market, country) {
  return MARKETS[market]?.companies?.[country] || MARKETS[market]?.companies?.["default"] || ["Company A","Company B","Company C"];
}

function generateData(product, companies, country) {
  const base = (BASE_PRICES[product] || 10000) * (PRICE_MULT[country] || 1);
  const seed = product.length * 31 + (country || "X").length * 17 + companies.length * 7;
  const rng = seeded(seed);
  
  return companies.map((company, i) => {
    const r = seeded(seed + i * 100 + company.charCodeAt(0));
    const price = base * (0.9 + r() * 0.2);
    const prevPrice = base * (0.82 + r() * 0.1);
    const history = ["Nov","Dec","Jan","Feb","Mar","Apr","May"].map((_,mi) => {
      const hr = seeded(seed + i * 100 + mi * 13);
      return { month:_, price: Math.round(base * (0.82 + mi * 0.02 + (hr() - 0.5) * 0.05)) };
    });
    return {
      company, price: Math.round(price), prevPrice: Math.round(prevPrice),
      history, marketShare: Math.round(8 + r() * 25), complaints: Math.round(r() * 40), changeFreq: Math.round(1 + r() * 8)
    };
  });
}

function detectPatterns(data, country, t) {
  if (!data || data.length < 2) return { alerts:[], risk:{ level:"N/A", score:0, color:C.t4 }, variancePct:0, changePct:0, avg:0, max:0, min:0 };
  
  const prices = data.map(d => d.price);
  const prevs = data.map(d => d.prevPrice);
  const avg = prices.reduce((a,b) => a+b, 0) / prices.length;
  const avgPrev = prevs.reduce((a,b) => a+b, 0) / prevs.length;
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const variancePct = ((max - min) / avg) * 100;
  const changePct = ((avg - avgPrev) / avgPrev) * 100;
  
  let alerts = [];
  let score = 0;
  let level = "BAJO", color = C.green;
  
  if (variancePct < 0.5) {
    score += 45;
    level = "CRÍTICO";
    color = C.red;
    alerts.push({ type: "FIJACIÓN DE PRECIOS", icon: "🔴", color: C.red, desc: `Dispersión de solo ${variancePct.toFixed(2)}% entre ${data.length} competidores.`, sev: "CRÍTICA" });
  } else if (variancePct < 2) {
    score += 20;
    level = "ALTO";
    color = C.amber;
    alerts.push({ type: "PARALELISMO", icon: "🟡", color: C.amber, desc: `Diferencia máxima: ${variancePct.toFixed(2)}%.`, sev: "MEDIA" });
  }
  
  if (changePct > 10) {
    score += changePct > 20 ? 35 : 20;
    if (score > 35) { level = "ALTO"; color = C.amber; }
    alerts.push({ type: "ALZA SIMULTÁNEA", icon: "🟠", color: C.amber, desc: `Variación promedio: ${changePct.toFixed(1)}%.`, sev: "ALTA" });
  }
  
  const maxShare = Math.max(...data.map(d => d.marketShare));
  if (maxShare > 60) {
    score += 18;
    const dom = data.find(d => d.marketShare === maxShare);
    alerts.push({ type: "POSICIÓN DOMINANTE", icon: "🔵", color: C.blue, desc: `${dom.company} concentra ${maxShare}% del mercado.`, sev: "ALTA" });
  }
  
  if (score >= 55) { level = "CRÍTICO"; color = C.red; }
  else if (score >= 35) { level = "ALTO"; color = C.amber; }
  else if (score >= 15) { level = "MEDIO"; color = "#d97706"; }
  
  return { alerts, risk:{ level, score, color }, variancePct, changePct, avg, max, min };
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Badge = ({label, color}) => <span style={{background: color+"22", color, border: `1px solid ${color}44`, borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700}}>{label}</span>;

const SectionTitle = ({children}) => <div style={{fontSize:10, color:C.gold, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:18}}>{children}</div>;

const StatCard = ({icon, label, value, sub, color, delay=0}) => (
  <div style={{background:C.card, border:`1px solid ${color}33`, borderRadius:12, padding:"16px 18px", boxShadow:"0 1px 4px #0001", animation:`fadeUp .5s ease ${delay}s both`}}>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8}}>
      <span style={{fontSize:10, color:C.t3, letterSpacing:.8, textTransform:"uppercase"}}>{label}</span>
      <span style={{fontSize:18}}>{icon}</span>
    </div>
    <div style={{fontSize:22, fontWeight:800, color, fontFamily:"'Syne',sans-serif", marginBottom:3}}>{value}</div>
    {sub && <div style={{fontSize:11, color:C.t3}}>{sub}</div>}
  </div>
);

// ─── LOGIN GATE ───────────────────────────────────────────────────────────────
function LoginGate({t, onLogin}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  const validate = (e) => {
    if (!e.includes("@") || !e.includes(".")) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    onLogin(e);
  };
  
  return (
    <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(6,9,16,0.9)", zIndex:1500, display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
      <div style={{background:C.surface, border:`2px solid ${C.gold}`, borderRadius:16, padding:32, maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 20px 60px #0006"}}>
        <div style={{fontSize:40, marginBottom:12}}>⚖️</div>
        <div style={{fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.gold, marginBottom:8}}>Inicia sesión</div>
        <p style={{color:C.t2, fontSize:13, lineHeight:1.7, marginBottom:24}}>Has usado tus consultas gratuitas. Inicia sesión para continuar.</p>
        <input value={email} onChange={e=>{setEmail(e.target.value);setError("");}} placeholder="tu@correo.com" type="email"
          style={{width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${error?C.red:C.borderHi}`, borderRadius:8, padding:"12px 16px", color:C.t1, fontSize:14, fontFamily:"inherit", outline:"none", marginBottom:8}}/>
        {error && <div style={{color:C.red, fontSize:12, marginBottom:8}}>{error}</div>}
        <button onClick={()=>validate(email)} style={{width:"100%", background:C.gold, border:"none", borderRadius:10, padding:"14px", color:"#fff", fontSize:14, fontWeight:800, fontFamily:"inherit", cursor:"pointer", marginBottom:16}}>
          Continuar con correo
        </button>
        <p style={{color:C.t4, fontSize:11}}>¿Ya tienes acceso? Escribe a <span style={{color:C.gold}}>andrea9522@gmail.com</span></p>
      </div>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function Paywall({t, onClose}) {
  return (
    <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(6,9,16,0.9)", zIndex:1800, display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
      <div style={{background:C.surface, border:`2px solid ${C.gold}`, borderRadius:16, padding:28, maxWidth:420, width:"100%", textAlign:"center", boxShadow:"0 20px 60px #0006", maxHeight:"90vh", overflowY:"auto"}}>
        <div style={{fontSize:40, marginBottom:8}}>🔐</div>
        <div style={{fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.gold, marginBottom:6}}>{t.paywallTitle}</div>
        <p style={{color:C.t2, fontSize:13, lineHeight:1.7, marginBottom:16}}>{t.paywallDesc}</p>
        <div style={{background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16, textAlign:"left"}}>
          <div style={{fontSize:13, color:C.t1, marginBottom:6}}>✅ Acceso ilimitado a 23 países</div>
          <div style={{fontSize:13, color:C.t1, marginBottom:6}}>✅ 9 mercados y +80 productos</div>
          <div style={{fontSize:13, color:C.t1, marginBottom:6}}>✅ Alertas antimonopolio automáticas</div>
          <div style={{fontSize:13, color:C.t1, marginBottom:6}}>✅ Dictamen jurídico ilimitado</div>
          <div style={{fontSize:18, fontWeight:800, color:C.gold, marginTop:10, textAlign:"center"}}>{t.paywallPrice}</div>
        </div>
        <a href="https://checkout.bold.co/payment/LNK_1IOUQ6TUL7" target="_blank" rel="noreferrer"
          style={{display:"block", background:C.gold, borderRadius:10, padding:"13px", color:"#fff", fontSize:14, fontWeight:800, textDecoration:"none", marginBottom:8}}>
          {t.boldBtn}
        </a>
        <a href="https://www.paypal.com/paypalme/AndreaBorda/49" target="_blank" rel="noreferrer"
          style={{display:"block", background:"#003087", borderRadius:10, padding:"13px", color:"#fff", fontSize:14, fontWeight:800, textDecoration:"none", marginBottom:8}}>
          🅿️ Pagar con PayPal
        </a>
        <button onClick={onClose} style={{background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 20px", color:C.t3, fontSize:13, fontFamily:"inherit", cursor:"pointer", width:"100%", marginBottom:10}}>
          Volver a la app
        </button>
        <p style={{color:C.t4, fontSize:11}}>¿Ya tienes acceso? Escribe a <span style={{color:C.gold}}>andrea9522@gmail.com</span></p>
      </div>
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
function FilterPanel({filters, onChange, t, lang}) {
  const {region_group, country, market, product} = filters;
  const products = MARKETS[market]?.products || [];
  
  const sel = (key, val) => {
    const n = {...filters, [key]: val};
    if (key === "region_group") {
      const firstC = Object.keys(GEO[val]?.countries || {})[0];
      n.country = firstC || "";
      n.market = Object.keys(MARKETS)[0];
      n.product = MARKETS[Object.keys(MARKETS)[0]]?.products[0] || "";
    }
    if (key === "country") {
      n.market = market;
      n.product = product;
    }
    if (key === "market") {
      n.product = MARKETS[val]?.products[0] || "";
    }
    onChange(n);
  };
  
  return (
    <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22, marginBottom:26, boxShadow:"0 1px 4px #0001"}}>
      <SectionTitle>{t.filterTitle}</SectionTitle>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:5, textTransform:"uppercase"}}>{t.worldRegion}</div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          {Object.keys(GEO).map(rg => (
            <button key={rg} onClick={() => sel("region_group", rg)}
              style={{background: region_group===rg ? C.gold+"22" : "transparent", border:`1px solid ${region_group===rg ? C.gold : C.borderHi}`, borderRadius:8, padding:"7px 14px", color: region_group===rg ? C.gold : C.t3, fontSize:12, fontFamily:"inherit", cursor:"pointer", fontWeight: region_group===rg ? 700 : 400}}>
              {GEO[rg].flag} {rg}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:14}}>
        <div>
          <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:5, textTransform:"uppercase"}}>{t.country}</div>
          <select value={country} onChange={e => sel("country", e.target.value)}
            style={{width:"100%", background:C.bg, border:`1px solid ${C.borderHi}`, borderRadius:8, padding:"9px 12px", color:C.t1, fontSize:12, fontFamily:"inherit", outline:"none", cursor:"pointer"}}>
            {Object.keys(GEO[region_group]?.countries || {}).map(c => (
              <option key={c} value={c}>{GEO[region_group].countries[c].flag} {c}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:5, textTransform:"uppercase"}}>{t.market}</div>
          <select value={market} onChange={e => sel("market", e.target.value)}
            style={{width:"100%", background:C.bg, border:`1px solid ${C.borderHi}`, borderRadius:8, padding:"9px 12px", color:C.t1, fontSize:12, fontFamily:"inherit", outline:"none", cursor:"pointer"}}>
            {Object.keys(MARKETS).map(m => (
              <option key={m} value={m}>{t.markets?.[m] || m}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:5, textTransform:"uppercase"}}>{t.product}</div>
          <select value={product} onChange={e => sel("product", e.target.value)}
            style={{width:"100%", background:C.bg, border:`1px solid ${C.borderHi}`, borderRadius:8, padding:"9px 12px", color:C.t1, fontSize:12, fontFamily:"inherit", outline:"none", cursor:"pointer"}}>
            {products.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      {LEGAL[country] && (
        <div style={{marginTop:14, background:C.bg, border:`1px solid ${C.borderHi}`, borderRadius:8, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap"}}>
          <span style={{fontSize:16}}>{GEO[region_group]?.countries[country].flag}</span>
          <div><span style={{fontSize:10, color:C.t3, letterSpacing:.8}}>{t.authority}: </span><span style={{fontSize:11, color:C.teal, fontWeight:700}}>{LEGAL[country].authority}</span></div>
          <div style={{marginLeft:"auto"}}><span style={{fontSize:10, color:C.t3, letterSpacing:.8}}>{t.legalFrame}: </span><span style={{fontSize:11, color:C.gold, fontWeight:600}}>{LEGAL[country].law}</span></div>
        </div>
      )}
    </div>
  );
}

// ─── COMPARISON STATS ─────────────────────────────────────────────────────────
function ComparisonStats({data, analysis, unit, t}) {
  if (!data.length) return null;
  const avg = analysis.avg || 0;
  const sorted = [...data].sort((a, b) => a.price - b.price);
  const PALETTE = [C.gold, C.teal, C.red, C.blue, C.purple, "#f97316"];
  
  const barData = data.map(d => ({
    name: d.company,
    price: d.price,
    prevPrice: d.prevPrice,
    diff: +(((d.price - avg) / avg) * 100).toFixed(1)
  }));
  
  const histData = (data[0]?.history || []).map((h, i) => ({
    month: h.month,
    ...Object.fromEntries(data.map(d => [d.company, d.history[i]?.price]))
  }));
  
  return (
    <div style={{animation:"fadeUp .5s ease .15s both"}}>
      <SectionTitle>{t.comparison}</SectionTitle>
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:20, boxShadow:"0 1px 4px #0001"}}>
        <div style={{padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", background:C.bg}}>
          <span style={{fontSize:10, color:C.t3, letterSpacing:.8}}>{t.rankingTitle}</span>
          <span style={{fontSize:10, color:C.t4}}>{t.currentPrice}: {Math.round(avg).toLocaleString()} / {unit}</span>
        </div>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`, background:C.bg}}>
              {t.tableHeaders.map(h => (
                <th key={h} style={{padding:"9px 14px", textAlign:"left", fontSize:9, color:C.t3, fontWeight:700, letterSpacing:.8}}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const chg = ((row.price - row.prevPrice) / row.prevPrice) * 100;
              const dAvg = ((row.price - avg) / avg) * 100;
              return (
                <tr key={row.company} style={{borderBottom:`1px solid ${C.border}22`}}>
                  <td style={{padding:"10px 14px", fontSize:13, color:C.t3, fontWeight:700}}>{i + 1}</td>
                  <td style={{padding:"10px 14px", fontSize:13, fontWeight:700, color:C.t1}}>{row.company}</td>
                  <td style={{padding:"10px 14px", fontSize:13, color:C.teal, fontWeight:700}}>{row.price.toLocaleString()}</td>
                  <td style={{padding:"10px 14px", fontSize:12, color:C.t3}}>{row.prevPrice.toLocaleString()}</td>
                  <td style={{padding:"10px 14px", fontSize:12, fontWeight:700, color: chg > 0 ? C.red : C.green}}>
                    {chg > 0 ? "+" : ""}{chg.toFixed(1)}%
                  </td>
                  <td style={{padding:"10px 14px", fontSize:12, fontWeight:700, color: Math.abs(dAvg) > 5 ? C.amber : C.green}}>
                    {dAvg > 0 ? "+" : ""}{dAvg.toFixed(1)}%
                  </td>
                  <td style={{padding:"10px 14px"}}>
                    <Badge label={`${row.marketShare}%`} color={C.blue}/>
                  </td>
                  <td style={{padding:"10px 14px"}}>
                    <Badge label={row.complaints} color={row.complaints > 25 ? C.red : row.complaints > 10 ? C.amber : C.green}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18}}>
        <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:"0 1px 4px #0001"}}>
          <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:12}}>Precio Actual vs Anterior</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={barData} barGap={3}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:C.t3, fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.t3, fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v => v.toLocaleString()}/>
              <Tooltip />
              <Bar dataKey="prevPrice" fill={C.border} name="Anterior" radius={[3, 3, 0, 0]}/>
              <Bar dataKey="price" fill={C.gold} name="Actual" radius={[3, 3, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:"0 1px 4px #0001"}}>
          <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:12}}>Desviación vs Promedio</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={barData}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:C.t3, fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.t3, fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`}/>
              <Tooltip />
              <ReferenceLine y={0} stroke={C.t3} strokeDasharray="4 4"/>
              <Bar dataKey="diff" fill={C.teal} name="Desviación" radius={[3, 3, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18, marginBottom:18, boxShadow:"0 1px 4px #0001"}}>
        <div style={{fontSize:10, color:C.t3, letterSpacing:.8, marginBottom:12}}>Evolución Histórica (7 meses)</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={histData}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
            <XAxis dataKey="month" tick={{fill:C.t3, fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.t3, fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v => v.toLocaleString()}/>
            <Tooltip />
            {data.map((d, i) => (
              <Line key={d.company} type="monotone" dataKey={d.company} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false}/>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── RISK PANEL ───────────────────────────────────────────────────────────────
function RiskPanel({analysis, country, t}) {
  if (!analysis) return null;
  const {alerts, risk, variancePct, avg, max, min} = analysis;
  
  return (
    <div style={{animation:"fadeUp .5s ease both"}}>
      <SectionTitle>Estadísticas de Riesgo</SectionTitle>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14, marginBottom:22}}>
        <StatCard icon="🎯" label="Nivel de Riesgo" value={risk.level} sub={`Score: ${risk.score}/100`} color={risk.color}/>
        <StatCard icon="📐" label="Dispersión" value={`${variancePct?.toFixed(2)||"—"}%`} sub="Entre competidores" color={variancePct < 1 ? C.red : C.green} delay={.05}/>
        <StatCard icon="⬆️" label="Precio Máximo" value={max?.toLocaleString()||"—"} sub="Más caro" color={C.red} delay={.1}/>
        <StatCard icon="⬇️" label="Precio Mínimo" value={min?.toLocaleString()||"—"} sub="Más barato" color={C.green} delay={.15}/>
        <StatCard icon="➗" label="Promedio" value={Math.round(avg||0).toLocaleString()} sub="Media del mercado" color={C.blue} delay={.2}/>
      </div>
      <div style={{background:C.bg, border:`1px solid ${C.borderHi}`, borderRadius:10, padding:"12px 16px", marginBottom:18}}>
        <span style={{fontSize:9, color:C.t3, letterSpacing:.8}}>Autoridad: </span>
        <span style={{fontSize:11, color:C.teal, fontWeight:700}}>{LEGAL[country]?.authority || "—"}</span>
      </div>
      {alerts.length > 0 ? (
        <div>
          {alerts.map((a, i) => (
            <div key={i} style={{background: a.color+"0d", border:`1px solid ${a.color}44`, borderLeft:`3px solid ${a.color}`, borderRadius:10, padding:"13px 18px", marginBottom:10}}>
              <div style={{display:"flex", alignItems:"center", gap:12}}>
                <span style={{fontSize:20}}>{a.icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}}>
                    <span style={{color: a.color, fontWeight:700, fontSize:13}}>{a.type}</span>
                    <Badge label={`Severidad: ${a.sev}`} color={a.color}/>
                  </div>
                  <p style={{color:C.t2, fontSize:12, margin:0, lineHeight:1.5}}>{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{background:C.green+"11", border:`1px solid ${C.green}44`, borderRadius:10, padding:"16px"}}>
          ✅ {t.noAlerts}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("es");
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState({
    region_group: "América Latina",
    country: "Colombia",
    region: "Nacional",
    market: "Energía",
    product: "Gasolina Regular",
    company: "Todas las empresas",
    dateFrom: "",
    dateTo: "",
    hourFrom: "00:00",
    hourTo: "23:59"
  });
  const [searches, setSearches] = useState(5);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [emailConfig, setEmailConfig] = useState({email: ""});
  
  const t = T[lang];
  
  const handleSearch = () => {
    if (searches > 0) {
      setSearches(s => s - 1);
    } else if (!loggedIn) {
      setShowPaywall(true);
    }
  };
  
  const companies = getCompanies(filters.market, filters.country);
  const data = useMemo(() => generateData(filters.product, companies, filters.country), [filters.product, filters.country, companies]);
  const analysis = useMemo(() => detectPatterns(data, filters.country, t), [data, filters.country, t]);
  const unit = UNITS[filters.product] || "unidad";
  
  return (
    <div style={{background: C.bg, minHeight: "100vh", padding: 20, fontFamily: "'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@400;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
      
      <div style={{maxWidth: 1400, margin: "0 auto"}}>
        {/* HEADER */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32}}>
          <div>
            <h1 style={{fontSize: 28, fontWeight: 800, color: C.t1, fontFamily: "'Syne'", marginBottom: 4}}>Fair Compes</h1>
            <p style={{fontSize: 10, color: C.t3, letterSpacing: 2, textTransform: "uppercase"}}>{t.appSubtitle}</p>
          </div>
          <div style={{display: "flex", gap: 10, alignItems: "center"}}>
            <button onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{background: C.gold+"22", border: `1px solid ${C.gold}`, borderRadius: 8, padding: "8px 16px", color: C.gold, fontSize: 12, fontWeight: 700, cursor: "pointer"}}>
              {lang === "es" ? "EN" : "ES"}
            </button>
            <div style={{background: C.gold+"11", border: `1px solid ${C.gold}44`, borderRadius: 8, padding: "8px 14px", fontSize: 11, color: C.gold}}>
              {t.freeSearches}: <b>{searches}</b>
            </div>
          </div>
        </div>
        
        {/* TABS */}
        <div style={{display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${C.border}`}}>
          {t.tabs.map((tab_name, i) => (
            <button key={i} onClick={() => setTab(i)}
              style={{background: "transparent", border: "none", padding: "12px 18px", borderBottom: tab === i ? `3px solid ${C.gold}` : "none", color: tab === i ? C.gold : C.t3, fontSize: 13, fontWeight: tab === i ? 700 : 500, cursor: "pointer"}}>
              {tab_name}
            </button>
          ))}
        </div>
        
        {/* CONTENT */}
        {tab === 0 && (
          <>
            <FilterPanel filters={filters} onChange={setFilters} t={t} lang={lang}/>
            <div style={{display: "flex", gap: 14, marginBottom: 24}}>
              <button onClick={handleSearch}
                style={{background: C.gold, border: "none", borderRadius: 10, padding: "14px 28px", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", flex: 1}}>
                {t.searchBtn}
              </button>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, marginBottom: 24}}>
              <StatCard icon="🎯" label="Nivel de Riesgo" value={analysis.risk.level} sub={`Score: ${analysis.risk.score}`} color={analysis.risk.color}/>
              <StatCard icon="📐" label="Dispersión" value={`${analysis.variancePct?.toFixed(2)||"—"}%`} sub="Competidores" color={C.blue}/>
              <StatCard icon="📊" label="Precio Promedio" value={Math.round(analysis.avg||0).toLocaleString()} sub={`/ ${unit}`} color={C.teal}/>
              <StatCard icon="⬆️" label="Máximo" value={analysis.max?.toLocaleString()||"—"} sub="Más caro" color={C.red}/>
              <StatCard icon="⬇️" label="Mínimo" value={analysis.min?.toLocaleString()||"—"} sub="Más barato" color={C.green}/>
              <StatCard icon="🏆" label="Empresas" value={companies.length} sub="Analizadas" color={C.purple}/>
            </div>
          </>
        )}
        
        {tab === 1 && <ComparisonStats data={data} analysis={analysis} unit={unit} t={t}/>}
        
        {tab === 2 && (
          <div>
            <SectionTitle>{t.activeAlerts}</SectionTitle>
            {analysis.alerts.length === 0 ? (
              <div style={{background: C.green+"11", border: `1px solid ${C.green}44`, borderRadius: 10, padding: "16px"}}>
                ✅ {t.noAlerts}
              </div>
            ) : (
              <div>
                {analysis.alerts.map((a, i) => (
                  <div key={i} style={{background: a.color+"0d", border: `1px solid ${a.color}44`, borderRadius: 10, padding: "14px", marginBottom: 10}}>
                    <div style={{color: a.color, fontWeight: 700}}>{a.type}</div>
                    <p style={{color: C.t2, fontSize: 12}}>{a.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {tab === 3 && <RiskPanel analysis={analysis} country={filters.country} t={t}/>}
      </div>
      
      {!loggedIn && searches === 0 && <LoginGate t={t} onLogin={(email) => {setLoggedIn(true);setEmailConfig({email});}}/>}
      {showPaywall && <Paywall t={t} onClose={() => setShowPaywall(false)}/>}
    </div>
  );
          }
