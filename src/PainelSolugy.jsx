import React, { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, ReferenceLine, Area,
} from "recharts";

/* ────────────────────────────────────────────────────────────────
   DADOS  ·  extraídos do LJ Sistemas (Firebird EST007/EST008/EST004/CR001/CP001)
   período 2025-08 a 2026-07  ·  ref. 04/07/2026
   Para atualizar: basta trocar este objeto pelo novo dash_data.json.
──────────────────────────────────────────────────────────────── */
const FLUXO = {
  proj: [
    { sem: "29/06", rec: 369642.56, pag: 0.0, liq: 369642.56, acc: 369642.56 },
    { sem: "06/07", rec: 121782.65, pag: 239800.2, liq: -118017.55, acc: 251625.01 },
    { sem: "13/07", rec: 115808.58, pag: 224041.0, liq: -108232.42, acc: 143392.59 },
    { sem: "20/07", rec: 97765.87, pag: 242622.7, liq: -144856.83, acc: -1464.24 },
    { sem: "27/07", rec: 124704.14, pag: 229441.24, liq: -104737.1, acc: -106201.34 },
    { sem: "03/08", rec: 26458.06, pag: 167755.64, liq: -141297.58, acc: -247498.92 },
    { sem: "10/08", rec: 30815.98, pag: 236216.84, liq: -205400.86, acc: -452899.78 },
    { sem: "17/08", rec: 35000.0, pag: 102080.0, liq: -67080.0, acc: -519979.78 },
    { sem: "24/08", rec: 35006.0, pag: 169298.0, liq: -134292.0, acc: -654271.78 },
    { sem: "31/08", rec: 19546.0, pag: 87472.0, liq: -67926.0, acc: -722197.78 },
    { sem: "07/09", rec: 23771.0, pag: 114320.0, liq: -90549.0, acc: -812746.78 },
    { sem: "14/09", rec: 16805.0, pag: 10893.0, liq: 5912.0, acc: -806834.78 },
    { sem: "21/09", rec: 146040.0, pag: 210703.0, liq: -64663.0, acc: -871497.78 },
  ],
  resumo: {
    receber_aberto: 1163147.27, pagar_aberto: 2034645.5, saldo_titulos: -871498.23,
    atras_rec: 302389.0, atras_pag: 0.0, pior_sem: "21/09", pior_acc: -871497.78,
  },
};

/* ── formatação ── */
const brl0 = (v) => "R$ " + (v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const brl2 = (v) => "R$ " + (v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pctf = (v) => (v ?? 0) + "%";
const intf = (v) => (v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const int = (v) => (v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const kbrl = (v) => {
  const a = Math.abs(v);
  if (a >= 1e6) return "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "M";
  if (a >= 1e3) return "R$ " + Math.round(v / 1e3) + "k";
  return "R$ " + Math.round(v);
};
const MES = { "01": "jan", "02": "fev", "03": "mar", "04": "abr", "05": "mai", "06": "jun", "07": "jul", "08": "ago", "09": "set", "10": "out", "11": "nov", "12": "dez" };
const fmtMes = (m) => { const [y, mm] = m.split("-"); return MES[mm] + "/" + y.slice(2); };

const C = {
  bg: "#141414", panel: "#1E1E1E", panel2: "#262626", line: "#333333",
  ink: "#EAEDF2", muted: "#868F9E", faint: "#5A6373",
  amber: "#F65D00", amber2: "#FF7A45", green: "#37D08A", red: "#FF5D5D",
  blue: "#5BA9F2", violet: "#9B7DF2",
};

const LOGO_SOLUGY = "data:image/png;base64,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";

function Tip({ active, payload, label, fmt = brl0 }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#111111", border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 11px", fontSize: 12 }}>
      {label != null && <div style={{ color: C.muted, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.ink, display: "flex", gap: 10, justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace" }}>
          <span>{p.name}</span><b>{p.name && p.name.includes("%") ? p.value + "%" : fmt(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

const G = C.green;
function montarCOLS(DET, RECCLI) { return {
  faturamento: { titulo: "Faturamento por mês", sub: "composição do faturamento de 12 meses", data: DET.faturamento, sort: "receita",
    cols: [ { k:"label",h:"Mês",a:"l" },{ k:"receita",h:"Faturamento",a:"r",f:brl2,sum:1,b:1 },{ k:"custo",h:"Custo",a:"r",f:brl2,sum:1 },{ k:"margem",h:"Margem R$",a:"r",f:brl2,sum:1,col:G },{ k:"margem_pct",h:"Margem %",a:"r",f:pctf },{ k:"n",h:"Vendas",a:"r",f:intf,sum:1 },{ k:"ticket",h:"Ticket",a:"r",f:brl2 } ] },
  margem: { titulo: "Margem bruta por produto", sub: "top 40 produtos que mais geram margem em R$", data: DET.margem, sort: "margem",
    cols: [ { k:"cod",h:"Código",a:"l",mono:1,mut:1 },{ k:"nome",h:"Produto",a:"l",nome:1 },{ k:"receita",h:"Receita",a:"r",f:brl2,sum:1 },{ k:"custo",h:"Custo",a:"r",f:brl2,sum:1 },{ k:"margem",h:"Margem R$",a:"r",f:brl2,sum:1,col:G,b:1 },{ k:"margem_pct",h:"Margem %",a:"r",f:pctf } ] },
  recebimento: { titulo: "Recebimento por forma de pagamento", sub: "quanto entra à vista vs a prazo", data: DET.recebimento, sort: "valor",
    cols: [ { k:"label",h:"Forma",a:"l",b:1 },{ k:"valor",h:"Valor",a:"r",f:brl2,sum:1,col:C.amber },{ k:"pct",h:"% do total",a:"r",f:pctf },{ k:"n",h:"Vendas",a:"r",f:intf,sum:1 },{ k:"ticket",h:"Ticket médio",a:"r",f:brl2 } ] },
  abc: { titulo: "Curva ABC de produtos", sub: "top 80 por receita · % acumulado e classe", data: DET.abc, sort: "receita",
    cols: [ { k:"pos",h:"#",a:"r",mono:1,mut:1 },{ k:"cod",h:"Código",a:"l",mono:1,mut:1 },{ k:"nome",h:"Produto",a:"l",nome:1 },{ k:"receita",h:"Receita",a:"r",f:brl2,sum:1,b:1 },{ k:"pct",h:"% receita",a:"r",f:pctf },{ k:"acum",h:"% acum.",a:"r",f:pctf,col:C.amber },{ k:"classe",h:"Classe",a:"c",classe:1 } ] },
  receber: { titulo: "Contas a receber", sub: "composição do saldo em aberto",
    views: [
      { nome: "Vencidos por cliente", sub: "quem deve, quanto está vencido e há quantos dias — sua fila de cobrança", data: RECCLI.por_vencido, sort: "vencido",
        cols: [ { k:"nome",h:"Cliente",a:"l",b:1,nome:1 },{ k:"vencido",h:"Vencido",a:"r",f:brl2,sum:1,col:C.red,b:1 },{ k:"aberto",h:"Total aberto",a:"r",f:brl2,sum:1 },{ k:"atraso",h:"Atraso",a:"r",f:(v)=>v+"d" },{ k:"nvenc",h:"Títulos venc.",a:"r",f:intf,sum:1 } ] },
      { nome: "Aberto por cliente", sub: "saldo total em aberto por cliente (vencido + a vencer)", data: RECCLI.por_aberto, sort: "aberto",
        cols: [ { k:"nome",h:"Cliente",a:"l",b:1,nome:1 },{ k:"aberto",h:"Total aberto",a:"r",f:brl2,sum:1,col:C.amber,b:1 },{ k:"vencido",h:"Vencido",a:"r",f:brl2,sum:1,col:C.red },{ k:"avencer",h:"A vencer",a:"r",f:brl2,sum:1 },{ k:"ntit",h:"Títulos",a:"r",f:intf,sum:1 } ] },
      { nome: "Por faixa de vencimento", sub: "composição do saldo em aberto por prazo", data: DET.receber, sort: "valor",
        cols: [ { k:"label",h:"Faixa",a:"l",b:1 },{ k:"valor",h:"Valor",a:"r",f:brl2,sum:1 },{ k:"pct",h:"% do total",a:"r",f:pctf },{ k:"titulos",h:"Títulos",a:"r",f:intf,sum:1 } ] },
    ] },
  vendedor: { titulo: "Vendas por vendedor", sub: "receita, margem e ticket por vendedor", data: DET.vendedor, sort: "receita",
    cols: [ { k:"label",h:"Vendedor",a:"l",b:1 },{ k:"receita",h:"Receita",a:"r",f:brl2,sum:1,col:C.amber },{ k:"pct",h:"% do total",a:"r",f:pctf },{ k:"margem",h:"Margem R$",a:"r",f:brl2,sum:1,col:G },{ k:"margem_pct",h:"Margem %",a:"r",f:pctf },{ k:"n",h:"Vendas",a:"r",f:intf,sum:1 },{ k:"ticket",h:"Ticket",a:"r",f:brl2 } ] },
}; }

function Drill({ onClick }) {
  return (
    <button className="ps-drill" onClick={onClick} title="Ver composição detalhada">
      <svg viewBox="0 0 16 16" width="12" height="12"><path d="M2 3h12M2 8h12M2 13h7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
      detalhar
    </button>
  );
}

function DetailModal({ cfg, onClose }) {
  // normaliza: sempre trabalhar com uma lista de "views"
  const views = cfg.views || [{ nome: null, sub: cfg.sub, data: cfg.data, cols: cfg.cols, sort: cfg.sort }];
  const [tab, setTab] = useState(0);
  const view = views[tab];
  const [sortKey, setSortKey] = useState(view.sort);
  const [asc, setAsc] = useState(false);

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  // ao trocar de aba, volta a ordenar pela coluna padrão da aba
  useEffect(() => { setSortKey(views[tab].sort); setAsc(false); }, [tab]);

  const rows = useMemo(() => {
    const r = [...view.data];
    r.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "number" && typeof vb === "number") return asc ? va - vb : vb - va;
      return asc ? String(va ?? "").localeCompare(String(vb ?? "")) : String(vb ?? "").localeCompare(String(va ?? ""));
    });
    return r;
  }, [view, sortKey, asc]);

  const totals = {};
  view.cols.forEach((c) => { if (c.sum) totals[c.k] = view.data.reduce((s, r) => s + (r[c.k] || 0), 0); });

  const clickSort = (c) => {
    if (c.classe || c.nome) { setSortKey(c.k); setAsc(false); return; }
    if (sortKey === c.k) setAsc(!asc); else { setSortKey(c.k); setAsc(false); }
  };

  return (
    <div className="ps-modal-bg" onClick={onClose}>
      <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ps-modal-h">
          <div><h3>{cfg.titulo}</h3><p>{view.sub} · {rows.length} linhas</p></div>
          <button className="ps-x" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        {views.length > 1 && (
          <div className="ps-tabs">
            {views.map((v, i) => (
              <button key={i} className={"ps-tab" + (i === tab ? " on" : "")} onClick={() => setTab(i)}>{v.nome}</button>
            ))}
          </div>
        )}
        <div className="ps-modal-body">
          <table className="ps-dt">
            <thead><tr>
              {view.cols.map((c) => (
                <th key={c.k} className={"a-" + c.a + (sortKey === c.k ? " on" : "")} onClick={() => clickSort(c)}>
                  {c.h}{sortKey === c.k ? <i>{asc ? " ▲" : " ▼"}</i> : null}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {view.cols.map((c) => (
                    <td key={c.k} className={"a-" + c.a + (c.mono ? " mono" : "") + (c.mut ? " mut" : "") + (c.b ? " b" : "") + (c.nome ? " nome" : "")} style={c.col ? { color: c.col } : undefined}>
                      {c.classe ? <span className="ps-badge" style={{ background: r[c.k] === "A" ? C.amber : r[c.k] === "B" ? C.blue : C.faint }}>{r[c.k]}</span> : c.f ? c.f(r[c.k]) : r[c.k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot><tr>
              {view.cols.map((c, idx) => (
                <td key={c.k} className={"a-" + c.a + " tot"}>{idx === 0 ? "Total" : c.sum ? c.f(totals[c.k]) : ""}</td>
              ))}
            </tr></tfoot>
          </table>
        </div>
        <div className="ps-modal-f">Clique num cabeçalho para reordenar · ESC ou clique fora para fechar</div>
      </div>
    </div>
  );
}

/* ── Barra de cotações do dia (dólar, euro, cobre, ouro) ──
   Fonte ao vivo: AwesomeAPI (grátis, sem chave, CORS liberado).
   Se o extrator gravar `cotacoes` no dash_data.json, usa como semente. */
const COT_DEFS = [
  { key: "USD", label: "Dólar", pair: "USD-BRL", dec: 2 },
  { key: "EUR", label: "Euro", pair: "EUR-BRL", dec: 2 },
  { key: "XCU", label: "Cobre", pair: "XCU-BRL", dec: 2, un: "/oz" },
  { key: "XAU", label: "Ouro", pair: "XAU-BRL", dec: 0, un: "/oz" },
];
function Cotacoes({ seed }) {
  const [cot, setCot] = useState(seed || null);
  useEffect(() => {
    let vivo = true;
    async function carrega() {
      try {
        const pares = COT_DEFS.map((c) => c.pair).join(",");
        const r = await fetch("https://economia.awesomeapi.com.br/json/last/" + pares, { cache: "no-store" });
        if (!r.ok) throw new Error("http");
        const j = await r.json();
        const out = {};
        COT_DEFS.forEach((c) => {
          const k = c.pair.replace("-", "");
          if (j[k] && j[k].bid) out[c.key] = { v: parseFloat(j[k].bid), pct: parseFloat(j[k].pctChange) };
        });
        if (vivo && Object.keys(out).length) setCot((prev) => ({ ...(prev || {}), ...out }));
      } catch (e) { /* mantém a semente/estado anterior */ }
    }
    carrega();
    const id = setInterval(carrega, 300000); // atualiza a cada 5 min
    return () => { vivo = false; clearInterval(id); };
  }, []);
  return (
    <div className="ps-cot" title="Cotações do dia — atualizam sozinhas a cada 5 min">
      {COT_DEFS.map((c) => {
        const x = cot && cot[c.key];
        const up = x && x.pct >= 0;
        return (
          <div className="ps-cot-item" key={c.key}>
            <span className="ps-cot-lab">{c.label}{c.un ? <em>{c.un}</em> : null}</span>
            <span className="ps-cot-val">{x ? "R$ " + x.v.toLocaleString("pt-BR", { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec }) : "—"}</span>
            {x ? <span className="ps-cot-var" style={{ color: up ? C.green : C.red }}>{up ? "▲" : "▼"} {Math.abs(x.pct).toFixed(2)}%</span> : <span className="ps-cot-var" style={{ color: C.faint }}>—</span>}
          </div>
        );
      })}
    </div>
  );
}

function PainelRender({ d, DET, RECCLI }) {
  const COLS = montarCOLS(DET, RECCLI);
  const [usuario, setUsuario] = useState("");
  useEffect(() => {
    let vivo = true;
    // Azure Static Web Apps expõe o usuário logado (Entra ID) em /.auth/me
    fetch("/.auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!vivo || !j || !j.clientPrincipal) return;
        const cp = j.clientPrincipal;
        const claims = cp.claims || [];
        const get = (t) => {
          const c = claims.find((x) => (x.typ || "").toLowerCase().endsWith(t));
          return c ? c.val : "";
        };
        let nome = get("givenname") || get("/name") || get("name") || cp.userDetails || "";
        if (nome.includes("@")) nome = nome.split("@")[0].replace(/[._]/g, " ");
        const primeiro = (nome.trim().split(/\s+/)[0] || "").replace(/^./, (c) => c.toUpperCase());
        if (vivo) setUsuario(primeiro);
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);
  const [drill, setDrill] = useState(null);
  const [ordProd, setOrdProd] = useState("receita");
  const prodOrd = useMemo(
    () => [...d.top_prod].sort((a, b) => b[ordProd] - a[ordProd]),
    [ordProd, d.top_prod]
  );
  const [estAba, setEstAba] = useState("valor");
  const est = d.estoque || null;
  const estLista = est ? (estAba === "valor" ? est.top_valor : est.encalhados) : [];
  const abcColors = { A: C.amber, B: C.blue, C: C.faint };
  const aging = [
    { k: "Vencido", v: d.fin.aging.vencido, c: C.red },
    { k: "0–30d", v: d.fin.aging.ate30, c: C.amber },
    { k: "31–60d", v: d.fin.aging.d31_60, c: C.amber2 },
    { k: "61–90d", v: d.fin.aging.d61_90, c: C.blue },
    { k: ">90d", v: d.fin.aging.mais90, c: C.violet },
  ];
  const vend = d.top_vend.map((v) => ({ ...v, nome: v.nome || ("Vend. " + (v.cod || "—")) }));

  return (
    <div className="ps-root">
      <style>{css}</style>

      {/* TOPBAR FIXA */}
      <header className="ps-topbar">
        <div className="ps-brand">
          <img className="ps-logo" src={LOGO_SOLUGY} alt="Solugy" />
          <div className="ps-brand-div" />
          <div>
            <div className="ps-welcome">Bem-vindo{usuario ? <>, <b>{usuario}</b></> : ""} 👋</div>
            <h1>Materiais Elétricos</h1>
            <div className="ps-sub">Painel Gerencial · <span>{d.meta.periodo}</span></div>
          </div>
        </div>
        <div className="ps-topright">
          <Cotacoes seed={d.cotacoes} />
          <div className="ps-ref">
            <span>atualizado <b>{d.meta.ref}</b></span>
            <span>{int(d.meta.n_produtos_ativos)} produtos ativos</span>
            {d.meta.atualizado_em && <span>sinc. {d.meta.atualizado_em}</span>}
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="ps-kpis">
        <div className="ps-kpi hero">
          <div className="ps-kpi-top"><span className="ps-eb">Faturamento · 12 meses</span><Drill onClick={() => setDrill("faturamento")} /></div>
          <span className="ps-big">{brl0(d.kpi.faturamento)}</span>
          <span className="ps-foot">{int(d.kpi.num_vendas)} vendas · ticket médio {brl0(d.kpi.ticket_medio)}</span>
          <i className="ps-baseline" />
        </div>
        <div className="ps-kpi">
          <div className="ps-kpi-top"><span className="ps-eb">Margem bruta</span><Drill onClick={() => setDrill("margem")} /></div>
          <span className="ps-num" style={{ color: C.green }}>{brl0(d.kpi.margem)}</span>
          <span className="ps-foot">{d.kpi.margem_pct}% sobre a venda</span>
        </div>
        <div className="ps-kpi">
          <div className="ps-kpi-top"><span className="ps-eb">A receber · em aberto</span><Drill onClick={() => setDrill("receber")} /></div>
          <span className="ps-num">{brl0(d.fin.receber_aberto)}</span>
          <span className="ps-foot" style={{ color: C.red }}>{brl0(d.fin.aging.vencido)} vencido</span>
        </div>
        <div className="ps-kpi">
          <span className="ps-eb">A pagar · em aberto</span>
          <span className="ps-num">{brl0(d.fin.pagar_aberto)}</span>
          <span className="ps-foot">posição futura {kbrl(d.fin.saldo_projetado)}</span>
        </div>
      </section>

      {/* GRID PRINCIPAL */}
      <section className="ps-grid">
        {/* Faturamento mensal */}
        <div className="ps-card span2">
          <div className="ps-card-h"><h2>Faturamento &amp; margem por mês</h2><div className="ps-hactions"><span className="ps-tag">barras: receita · linha: margem&nbsp;%</span><Drill onClick={() => setDrill("faturamento")} /></div></div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <ComposedChart data={d.mensal} margin={{ top: 8, right: 6, left: -6, bottom: 0 }}>
                <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="mes" tickFormatter={fmtMes} tick={{ fill: C.muted, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={{ stroke: C.line }} tickLine={false} />
                <YAxis yAxisId="l" tickFormatter={kbrl} tick={{ fill: C.muted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} width={54} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 60]} tickFormatter={(v) => v + "%"} tick={{ fill: C.faint, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} width={34} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(242,101,34,0.06)" }} labelFormatter={fmtMes} />
                <Bar yAxisId="l" dataKey="fat" name="Receita" fill={C.amber} radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Line yAxisId="r" dataKey="margem_pct" name="Margem %" stroke={C.green} strokeWidth={2} dot={{ r: 2.5, fill: C.green }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mix pagamento */}
        <div className="ps-card">
          <div className="ps-card-h"><h2>Recebimento</h2><Drill onClick={() => setDrill("recebimento")} /></div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={d.pagamento} dataKey="valor" nameKey="tipo" innerRadius={44} outerRadius={64} paddingAngle={2} stroke="none">
                  <Cell fill={C.amber} /><Cell fill={C.blue} />
                </Pie>
                <Tooltip content={<Tip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ps-legend">
            {d.pagamento.map((p, i) => (
              <div key={i} className="ps-leg-row">
                <span><i style={{ background: i === 0 ? C.amber : C.blue }} />{p.tipo}</span>
                <b>{brl0(p.valor)}</b>
                <em>{int(p.n)}</em>
              </div>
            ))}
          </div>
        </div>

        {/* Curva ABC */}
        <div className="ps-card">
          <div className="ps-card-h"><h2>Curva ABC de produtos</h2><Drill onClick={() => setDrill("abc")} /></div>
          <div className="ps-abc">
            {d.abc.map((a) => {
              const totalRec = d.abc.reduce((s, x) => s + x.receita, 0);
              const pct = (a.receita / totalRec) * 100;
              return (
                <div key={a.classe} className="ps-abc-row">
                  <span className="ps-abc-cls" style={{ color: abcColors[a.classe] }}>{a.classe}</span>
                  <div className="ps-abc-bar">
                    <i style={{ width: pct + "%", background: abcColors[a.classe] }} />
                  </div>
                  <div className="ps-abc-meta">
                    <b>{brl0(a.receita)}</b>
                    <em>{int(a.produtos)} itens · {pct.toFixed(0)}%</em>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="ps-note">400 itens (classe A) concentram 80% da receita — foco de compra e estoque.</p>
        </div>

        {/* Aging a receber */}
        <div className="ps-card">
          <div className="ps-card-h"><h2>A receber por vencimento</h2><Drill onClick={() => setDrill("receber")} /></div>
          <div style={{ height: 172 }}>
            <ResponsiveContainer>
              <BarChart data={aging} margin={{ top: 6, right: 6, left: -12, bottom: 0 }}>
                <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="k" tick={{ fill: C.muted, fontSize: 10.5 }} axisLine={{ stroke: C.line }} tickLine={false} />
                <YAxis tickFormatter={kbrl} tick={{ fill: C.muted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(242,101,34,0.06)" }} />
                <Bar dataKey="v" name="A receber" radius={[3, 3, 0, 0]} maxBarSize={40}>
                  {aging.map((a, i) => <Cell key={i} fill={a.c} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendedores */}
        <div className="ps-card">
          <div className="ps-card-h"><h2>Vendas por vendedor</h2><Drill onClick={() => setDrill("vendedor")} /></div>
          <div style={{ height: 172 }}>
            <ResponsiveContainer>
              <BarChart data={vend} layout="vertical" margin={{ top: 2, right: 10, left: 6, bottom: 2 }}>
                <XAxis type="number" tickFormatter={kbrl} tick={{ fill: C.muted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={78} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(242,101,34,0.06)" }} />
                <Bar dataKey="receita" name="Receita" fill={C.amber} radius={[0, 3, 3, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* PROJEÇÃO DE FLUXO DE CAIXA */}
      <section className="ps-card ps-flux">
        <div className="ps-card-h">
          <h2>Projeção de fluxo de caixa · próximas 13 semanas</h2>
          <span className="ps-tag">apenas títulos já lançados em aberto</span>
        </div>

        <div className="ps-flux-cards">
          <div className="ps-fc">
            <span className="ps-eb">Ponto mais baixo</span>
            <span className="ps-fc-num" style={{ color: C.red }}>{kbrl(FLUXO.resumo.pior_acc)}</span>
            <span className="ps-foot">acumulado na semana de {FLUXO.resumo.pior_sem}</span>
          </div>
          <div className="ps-fc">
            <span className="ps-eb">A receber vencido</span>
            <span className="ps-fc-num" style={{ color: C.amber2 }}>{brl0(FLUXO.resumo.atras_rec)}</span>
            <span className="ps-foot">cobrança prioritária — já no caixa da 1ª semana</span>
          </div>
          <div className="ps-fc">
            <span className="ps-eb">Descasamento de prazo</span>
            <span className="ps-fc-num">{kbrl(FLUXO.resumo.saldo_titulos)}</span>
            <span className="ps-foot">pagar concentrado jul–set · receber espalhado até jun/27</span>
          </div>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <ComposedChart data={FLUXO.proj} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="accFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.amber} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="sem" tick={{ fill: C.muted, fontSize: 10.5, fontFamily: "'JetBrains Mono',monospace" }} axisLine={{ stroke: C.line }} tickLine={false} />
              <YAxis tickFormatter={kbrl} tick={{ fill: C.muted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} width={54} />
              <Tooltip content={<Tip />} cursor={{ fill: "rgba(242,101,34,0.05)" }} />
              <ReferenceLine y={0} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.55} />
              <Bar dataKey="rec" name="Recebimentos" fill={C.green} radius={[2, 2, 0, 0]} maxBarSize={17} />
              <Bar dataKey="pag" name="Pagamentos" fill={C.red} radius={[2, 2, 0, 0]} maxBarSize={17} />
              <Area dataKey="acc" name="Saldo acumulado" stroke={C.amber} strokeWidth={2.5} fill="url(#accFill)" dot={{ r: 2.5, fill: C.amber }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="ps-note ps-flux-note">
          A linha âmbar é o saldo acumulado só dos títulos já lançados — cruza o zero na semana de <b>20/07</b> e chega a <b>−R$ 872k</b> em 21/09.
          <b> Não é previsão de saldo bancário:</b> não inclui as vendas novas (~R$ 400k/mês, 42% de margem) que vão gerar recebimentos, nem seu saldo atual em conta.
          O sinal real aqui é de <b>descasamento de prazo</b> — os pagamentos estão concentrados em jul–set enquanto os recebimentos se espalham. Ações: priorizar a cobrança dos R$ 344k vencidos, negociar alongamento com fornecedores nos meses de pico, e vigiar as semanas de 10/08 e 21/09 (maiores saídas).
        </p>
      </section>

      {/* ESTOQUE (aparece quando o extrator já traz o bloco) */}
      {est && (
        <section className="ps-card ps-table-card">
          <div className="ps-card-h">
            <h2>Estoque · saldo real e capital imobilizado</h2>
            <div className="ps-ord">
              <button className={estAba === "valor" ? "on" : ""} onClick={() => setEstAba("valor")}>maior valor parado</button>
              <button className={estAba === "encalhado" ? "on" : ""} onClick={() => setEstAba("encalhado")}>encalhados (0 vendas)</button>
            </div>
          </div>
          <div className="ps-estkpis">
            <div className="ps-estkpi">
              <span className="ps-eb">Valor imobilizado</span>
              <span className="ps-estnum">{brl0(est.resumo.valor_total)}</span>
              <span className="ps-foot">{int(est.resumo.n_produtos)} produtos com saldo</span>
            </div>
            <div className="ps-estkpi">
              <span className="ps-eb">Capital encalhado</span>
              <span className="ps-estnum" style={{ color: C.red }}>{brl0(est.resumo.valor_encalhado)}</span>
              <span className="ps-foot">{int(est.resumo.n_encalhados)} itens · {est.resumo.pct_encalhado}% do estoque · 0 vendas em 12m</span>
            </div>
            <div className="ps-estkpi">
              <span className="ps-eb">Sem custo cadastrado</span>
              <span className="ps-estnum" style={{ color: est.resumo.n_sem_custo > 0 ? C.amber2 : C.ink }}>{int(est.resumo.n_sem_custo)}</span>
              <span className="ps-foot">produtos com custo zerado (valor subestimado)</span>
            </div>
          </div>
          <div className="ps-table-wrap">
            <table className="ps-table">
              <thead>
                <tr>
                  <th className="r">#</th><th>Código</th><th>Produto</th><th>Grupo</th>
                  <th className="r">Saldo</th><th className="r">Custo un.</th>
                  <th className="r">Valor parado</th><th className="r">Vendas 12m</th><th className="r">Parado há</th>
                </tr>
              </thead>
              <tbody>
                {estLista.map((p, i) => (
                  <tr key={p.cod}>
                    <td className="r idx">{i + 1}</td>
                    <td className="mono muted">{p.cod}</td>
                    <td className="nome">{p.desc}</td>
                    <td className="muted" style={{ fontSize: 11 }}>{p.grupo}</td>
                    <td className="r mono">{int(p.saldo)} {p.un}</td>
                    <td className="r mono">{p.custo ? brl2(p.custo) : <span style={{ color: C.amber2 }}>—</span>}</td>
                    <td className="r mono b">{brl2(p.valor)}</td>
                    <td className="r mono" style={{ color: p.vend12m === 0 ? C.red : C.ink }}>{int(p.vend12m)}</td>
                    <td className="r mono muted">{p.dias_parado === null ? <span style={{ color: C.red }}>nunca</span> : p.dias_parado + "d"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ps-note">
            Saldo real por peça direto do LJ (tabela consolidada do sistema — bate com o Inventário de Estoque). Custo unitário pelo preço de compra.
            <b> "Parado há"</b> é o tempo desde a última venda; <b>"nunca"</b> = sem vendas nos últimos 12 meses (capital travado que vale liquidar ou usar em obra própria).
          </p>
        </section>
      )}

      {/* TOP PRODUTOS */}
      <section className="ps-card ps-table-card">
        <div className="ps-card-h">
          <h2>Produtos que mais faturam</h2>
          <div className="ps-ord">
            <button className={ordProd === "receita" ? "on" : ""} onClick={() => setOrdProd("receita")}>por receita</button>
            <button className={ordProd === "margem" ? "on" : ""} onClick={() => setOrdProd("margem")}>por margem R$</button>
            <button className={ordProd === "qtd" ? "on" : ""} onClick={() => setOrdProd("qtd")}>por quantidade</button>
          </div>
        </div>
        <div className="ps-table-wrap">
          <table className="ps-table">
            <thead>
              <tr>
                <th className="r">#</th><th>Código</th><th>Produto</th>
                <th className="r">Qtd</th><th className="r">Receita</th>
                <th className="r">Margem R$</th><th className="r">Margem %</th>
              </tr>
            </thead>
            <tbody>
              {prodOrd.map((p, i) => (
                <tr key={p.cod}>
                  <td className="r idx">{i + 1}</td>
                  <td className="mono muted">{p.cod}</td>
                  <td className="nome">{p.nome}</td>
                  <td className="r mono">{int(p.qtd)}</td>
                  <td className="r mono b">{brl2(p.receita)}</td>
                  <td className="r mono" style={{ color: C.green }}>{brl2(p.margem)}</td>
                  <td className="r mono">
                    <span className="ps-pct" style={{ color: p.margem_pct >= 44 ? C.green : p.margem_pct < 41 ? C.amber2 : C.ink }}>{p.margem_pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="ps-foot-bar">
        <span>Fonte: LJ Sistemas (Firebird) · vendas EST007/EST008 · financeiro CR001/CP001 · valores dos últimos 12 meses, vendas canceladas excluídas.</span>
        <span className="ps-foot-note">Grupos/marcas e nomes de cliente/vendedor aparecem por código — resolvíveis com as tabelas de cadastro.</span>
      </footer>

      {drill && <DetailModal cfg={COLS[drill]} onClose={() => setDrill(null)} />}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
.ps-root{--bg:${C.bg};--panel:${C.panel};--panel2:${C.panel2};--line:${C.line};--ink:${C.ink};--muted:${C.muted};--amber:${C.amber};
  background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;padding:22px;min-height:100%;
  background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px);background-size:100% 40px;}
.ps-root *{box-sizing:border-box;}
.ps-topbar{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:14px 22px;flex-wrap:wrap;background:var(--bg);margin:-22px -22px 20px;padding:12px 22px;border-bottom:1px solid var(--line);box-shadow:0 6px 18px -12px rgba(0,0,0,0.85);}
.ps-brand{display:flex;gap:14px;align-items:center;}
.ps-logo{height:38px;width:auto;display:block;}
.ps-wordmark{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:34px;font-style:italic;letter-spacing:1px;}
.ps-brand-div{width:1px;height:34px;background:var(--line);}
.ps-topbar h1{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:600;margin:0;letter-spacing:-0.01em;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}
.ps-welcome{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;color:var(--ink);margin-bottom:3px;letter-spacing:-.01em;}
.ps-welcome b{color:var(--amber);font-weight:700;}
.ps-sub{font-size:12.5px;color:var(--muted);margin-top:2px;}
.ps-sub span{color:var(--amber);font-family:'JetBrains Mono',monospace;}
.ps-topright{display:flex;flex-direction:column;align-items:flex-end;gap:7px;}
.ps-cot{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end;}
.ps-cot-item{display:flex;flex-direction:column;gap:1px;background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:5px 11px;min-width:82px;}
.ps-cot-lab{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:600;}
.ps-cot-lab em{font-style:normal;color:var(--faint);margin-left:3px;font-size:8.5px;}
.ps-cot-val{font-size:13px;font-weight:600;font-family:'JetBrains Mono',monospace;color:var(--ink);line-height:1.2;}
.ps-cot-var{font-size:9.5px;font-family:'JetBrains Mono',monospace;font-weight:500;}
.ps-ref{display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);text-transform:uppercase;letter-spacing:.08em;}
.ps-ref b{color:var(--ink);font-weight:600;}

.ps-kpis{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:12px;margin-bottom:14px;}
.ps-kpi{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:15px 17px;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:5px;}
.ps-kpi.hero{background:linear-gradient(150deg,#242424,#191919);}
.ps-eb{font-size:10.5px;text-transform:uppercase;letter-spacing:.13em;color:var(--muted);}
.ps-big{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:600;line-height:1.05;letter-spacing:-0.02em;color:#fff;}
.ps-num{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;letter-spacing:-0.01em;}
.ps-foot{font-size:11.5px;color:var(--muted);}
.ps-baseline{position:absolute;left:0;bottom:0;height:3px;width:100%;background:linear-gradient(90deg,var(--amber),transparent);}

.ps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px;}
.ps-card{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:15px 16px;}
.ps-card.span2{grid-column:span 2;}
.ps-card-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:12px;}
.ps-card-h h2{font-family:'Space Grotesk',sans-serif;font-size:13.5px;font-weight:600;margin:0;}
.ps-tag{font-size:10px;color:var(--faint,#5A6373);font-family:'JetBrains Mono',monospace;}

.ps-legend{margin-top:8px;display:flex;flex-direction:column;gap:6px;}
.ps-leg-row{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;font-size:12px;}
.ps-leg-row span{display:flex;align-items:center;gap:7px;color:var(--muted);}
.ps-leg-row i{width:9px;height:9px;border-radius:2px;display:inline-block;}
.ps-leg-row b{font-family:'JetBrains Mono',monospace;color:var(--ink);}
.ps-leg-row em{font-family:'JetBrains Mono',monospace;font-style:normal;color:var(--faint,#5A6373);font-size:11px;min-width:44px;text-align:right;}

.ps-abc{display:flex;flex-direction:column;gap:11px;margin-top:2px;}
.ps-abc-row{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;}
.ps-abc-cls{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:17px;}
.ps-abc-bar{height:9px;background:#111111;border-radius:5px;overflow:hidden;}
.ps-abc-bar i{display:block;height:100%;border-radius:5px;}
.ps-abc-meta{text-align:right;}
.ps-abc-meta b{font-family:'JetBrains Mono',monospace;font-size:12.5px;display:block;}
.ps-abc-meta em{font-style:normal;font-size:10.5px;color:var(--faint,#5A6373);font-family:'JetBrains Mono',monospace;}
.ps-note{font-size:11px;color:var(--muted);margin:12px 0 0;line-height:1.4;border-top:1px solid var(--line);padding-top:9px;}

.ps-table-card{padding-bottom:6px;}
.ps-ord{display:flex;gap:5px;}
.ps-ord button{background:transparent;border:1px solid var(--line);color:var(--muted);font-size:11px;padding:4px 10px;border-radius:7px;cursor:pointer;font-family:inherit;transition:.15s;}
.ps-ord button:hover{color:var(--ink);border-color:#3a424e;}
.ps-ord button.on{background:var(--amber);color:#1a1205;border-color:var(--amber);font-weight:600;}
.ps-table-wrap{overflow-x:auto;}
.ps-table{width:100%;border-collapse:collapse;font-size:12.5px;}
.ps-table th{text-align:left;font-weight:500;color:var(--muted);font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;padding:7px 10px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--panel);}
.ps-table td{padding:7px 10px;border-bottom:1px solid #2A2A2A;}
.ps-table tr:last-child td{border-bottom:none;}
.ps-table tr:hover td{background:rgba(242,101,34,0.04);}
.ps-table .r{text-align:right;}
.ps-table .mono{font-family:'JetBrains Mono',monospace;}
.ps-table .muted{color:var(--muted);}
.ps-table .b{font-weight:600;color:#fff;}
.ps-table .idx{color:var(--faint,#5A6373);font-family:'JetBrains Mono',monospace;width:30px;}
.ps-table .nome{max-width:340px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ps-pct{font-weight:600;}

.ps-flux{margin-bottom:14px;}
.ps-flux-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;}
.ps-fc{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;}
.ps-fc-num{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:600;letter-spacing:-0.01em;}
.ps-flux-note{margin-top:14px;}
.ps-flux-note b{color:var(--ink);font-weight:600;}

.ps-spin{display:inline-block;width:14px;height:14px;border:2px solid #F65D00;border-top-color:transparent;border-radius:50%;margin-right:8px;vertical-align:middle;animation:psspin .7s linear infinite;}
@keyframes psspin{to{transform:rotate(360deg)}}
.ps-drill{display:inline-flex;align-items:center;gap:4px;background:transparent;border:1px solid var(--line);color:var(--muted);font-family:inherit;font-size:10.5px;padding:3px 8px;border-radius:7px;cursor:pointer;transition:.15s;white-space:nowrap;}
.ps-drill:hover{color:var(--amber);border-color:var(--amber);}
.ps-drill svg{opacity:.8;}
.ps-kpi-top{display:flex;justify-content:space-between;align-items:center;gap:8px;}
.ps-hactions{display:flex;align-items:center;gap:8px;}

.ps-modal-bg{position:fixed;inset:0;background:rgba(6,8,11,0.72);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:50;animation:psfade .15s ease;}
@keyframes psfade{from{opacity:0}to{opacity:1}}
.ps-modal{background:var(--panel);border:1px solid var(--line);border-radius:15px;width:min(1000px,96vw);max-height:88vh;display:flex;flex-direction:column;box-shadow:0 24px 70px rgba(0,0,0,0.6);overflow:hidden;}
.ps-modal-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:17px 20px 14px;border-bottom:1px solid var(--line);}
.ps-modal-h h3{font-family:'Space Grotesk',sans-serif;font-size:16px;margin:0;font-weight:600;}
.ps-modal-h p{margin:3px 0 0;font-size:11.5px;color:var(--muted);}
.ps-x{background:var(--panel2);border:1px solid var(--line);color:var(--muted);width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:13px;flex-shrink:0;transition:.15s;}
.ps-x:hover{color:var(--ink);border-color:var(--amber);}
.ps-tabs{display:flex;gap:4px;padding:10px 20px 0;border-bottom:1px solid var(--line);flex-wrap:wrap;}
.ps-tab{background:transparent;border:1px solid var(--line);border-bottom:none;color:var(--muted);font-family:inherit;font-size:11.5px;padding:7px 13px;border-radius:8px 8px 0 0;cursor:pointer;transition:.15s;margin-bottom:-1px;}
.ps-tab:hover{color:var(--ink);}
.ps-estkpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:4px 4px 14px;}
.ps-estkpi{background:var(--panel2,#1a1a1a);border:1px solid var(--line);border-radius:11px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;}
.ps-estnum{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;letter-spacing:-.01em;}
@media(max-width:720px){.ps-estkpis{grid-template-columns:1fr;}}
.ps-tab.on{background:var(--panel2);color:var(--amber);border-color:var(--line);font-weight:600;}
.ps-modal-body{overflow:auto;flex:1;}
.ps-dt{width:100%;border-collapse:collapse;font-size:12.5px;}
.ps-dt th{position:sticky;top:0;background:#1A1A1A;text-align:left;font-weight:500;color:var(--muted);font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;padding:9px 12px;border-bottom:1px solid var(--line);cursor:pointer;user-select:none;white-space:nowrap;}
.ps-dt th:hover{color:var(--ink);}
.ps-dt th.on{color:var(--amber);}
.ps-dt th i{font-style:normal;font-size:9px;}
.ps-dt td{padding:8px 12px;border-bottom:1px solid #2A2A2A;}
.ps-dt tbody tr:hover td{background:rgba(242,101,34,0.045);}
.ps-dt .a-r{text-align:right;}.ps-dt .a-c{text-align:center;}.ps-dt .a-l{text-align:left;}
.ps-dt .mono,.ps-dt td.a-r{font-family:'JetBrains Mono',monospace;}
.ps-dt .mut{color:var(--muted);}
.ps-dt .b{font-weight:600;color:#fff;}
.ps-dt .nome{max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ps-badge{display:inline-block;min-width:20px;padding:1px 7px;border-radius:5px;color:#1A1A1A;font-weight:700;font-size:11px;font-family:'Space Grotesk',sans-serif;}
.ps-dt tfoot td{position:sticky;bottom:0;background:#1A1A1A;border-top:1px solid var(--line);border-bottom:none;font-weight:600;color:var(--ink);padding:9px 12px;}
.ps-dt tfoot td.a-r{font-family:'JetBrains Mono',monospace;}
.ps-modal-f{padding:9px 20px;border-top:1px solid var(--line);font-size:10.5px;color:var(--faint,#5A6373);}

.ps-foot-bar{margin-top:16px;padding-top:12px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:3px;}.ps-foot-bar span{font-size:10.5px;color:var(--faint,#5A6373);line-height:1.4;}
.ps-foot-note{color:var(--muted)!important;}

@media(max-width:900px){
  .ps-kpis{grid-template-columns:1fr 1fr;}
  .ps-grid{grid-template-columns:1fr 1fr;}
  .ps-card.span2{grid-column:span 2;}
  .ps-flux-cards{grid-template-columns:1fr;}
}
@media(max-width:560px){
  .ps-root{padding:14px;}
  .ps-kpis,.ps-grid{grid-template-columns:1fr;}
  .ps-card.span2{grid-column:span 1;}
  .ps-big{font-size:26px;}
  .ps-topbar h1{font-size:15px;}
  .ps-topbar{gap:10px;}
  .ps-topright{align-items:flex-start;width:100%;}
  .ps-cot{justify-content:flex-start;}
}
`;


export default function PainelSolugy() {
  const [estado, setEstado] = useState("carregando"); // carregando | ok | erro
  const [payload, setPayload] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let vivo = true;
    // dash_data.json fica ao lado do index.html (mesma pasta publicada)
    fetch("dash_data.json?t=" + Date.now(), { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((j) => { if (vivo) { setPayload(j); setEstado("ok"); } })
      .catch((e) => { if (vivo) { setErro(String(e.message || e)); setEstado("erro"); } });
    return () => { vivo = false; };
  }, []);

  if (estado === "carregando")
    return <TelaMsg titulo="Carregando dados…" sub="buscando o último fechamento do painel" spin />;
  if (estado === "erro")
    return <TelaMsg titulo="Não foi possível carregar os dados" sub={"Detalhe: " + erro + " — verifique se o arquivo dash_data.json está publicado e se o extrator rodou."} />;

  // adapta o payload do extrator (chaves minúsculas) para o que o render espera
  const d = {
    kpi: payload.kpi, mensal: payload.mensal, top_prod: payload.top_prod,
    abc: payload.abc, pagamento: payload.pagamento, top_vend: payload.top_vend,
    fin: payload.fin, meta: payload.meta, cotacoes: payload.cotacoes,
    estoque: payload.estoque,
  };
  const DET = payload.det;
  const RECCLI = payload.reccli;
  return <PainelRender d={d} DET={DET} RECCLI={RECCLI} />;
}

function TelaMsg({ titulo, sub, spin }) {
  return (
    <div className="ps-root" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <style>{css}</style>
      <div style={{ textAlign: "center", maxWidth: 460, padding: 24 }}>
        <img src={LOGO_SOLUGY} alt="Solugy" style={{ height: 46, margin: "0 auto 18px", display: "block" }} />
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
          {spin ? <span className="ps-spin" /> : null}{titulo}
        </div>
        <div style={{ fontSize: 13, color: "#868F9E", lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}
