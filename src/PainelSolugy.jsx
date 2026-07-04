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
  amber: "#F26522", amber2: "#FF8A4C", green: "#37D08A", red: "#FF5D5D",
  blue: "#5BA9F2", violet: "#9B7DF2",
};

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

function PainelRender({ d, DET, RECCLI }) {
  const COLS = montarCOLS(DET, RECCLI);
  const [drill, setDrill] = useState(null);
  const [ordProd, setOrdProd] = useState("receita");
  const prodOrd = useMemo(
    () => [...d.top_prod].sort((a, b) => b[ordProd] - a[ordProd]),
    [ordProd, d.top_prod]
  );
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

      {/* HEADER */}
      <header className="ps-head">
        <div className="ps-brand">
          <svg className="ps-logo" viewBox="0 0 250 64" role="img" aria-label="Solugy">
            {/* símbolo do raio — duas peças deslocadas */}
            <path d="M34 4 L14 36 L27 36 L21 60 L44 26 L30 26 L37 4 Z" fill={C.amber} />
            <path d="M46 4 L30 30 L39 30 L34 52 L52 24 L42 24 L48 4 Z" fill={C.amber} opacity="0.55" />
            {/* wordmark SOLUGY — itálico bold */}
            <text x="66" y="42" className="ps-wordmark" fill="#FFFFFF">SOLUGY</text>
          </svg>
          <div className="ps-brand-div" />
          <div>
            <h1>Materiais Elétricos</h1>
            <div className="ps-sub">Painel Gerencial · <span>{d.meta.periodo}</span></div>
          </div>
        </div>
        <div className="ps-ref">
          <div className="ps-ref-lab">atualizado</div>
          <div className="ps-ref-val">{d.meta.ref}</div>
          <div className="ps-ref-lab">{int(d.meta.n_produtos_ativos)} produtos ativos</div>
          {d.meta.atualizado_em && <div className="ps-ref-lab" style={{marginTop:2}}>sinc. {d.meta.atualizado_em}</div>}
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
.ps-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
.ps-brand{display:flex;gap:14px;align-items:center;}
.ps-logo{height:38px;width:auto;display:block;}
.ps-wordmark{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:34px;font-style:italic;letter-spacing:1px;}
.ps-brand-div{width:1px;height:34px;background:var(--line);}
.ps-head h1{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:600;margin:0;letter-spacing:-0.01em;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}
.ps-sub{font-size:12.5px;color:var(--muted);margin-top:2px;}
.ps-sub span{color:var(--amber);font-family:'JetBrains Mono',monospace;}
.ps-ref{text-align:right;font-family:'JetBrains Mono',monospace;}
.ps-ref-lab{font-size:10px;color:var(--faint,#5A6373);text-transform:uppercase;letter-spacing:.14em;}
.ps-ref-val{font-size:15px;color:var(--ink);font-weight:600;margin:1px 0 4px;}

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

.ps-spin{display:inline-block;width:14px;height:14px;border:2px solid #F26522;border-top-color:transparent;border-radius:50%;margin-right:8px;vertical-align:middle;animation:psspin .7s linear infinite;}
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
  .ps-head h1{font-size:17px;}
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
    fin: payload.fin, meta: payload.meta,
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
        <svg className="ps-logo" viewBox="0 0 250 64" style={{ height: 40, margin: "0 auto 18px" }} aria-label="Solugy">
          <path d="M34 4 L14 36 L27 36 L21 60 L44 26 L30 26 L37 4 Z" fill="#F26522" />
          <path d="M46 4 L30 30 L39 30 L34 52 L52 24 L42 24 L48 4 Z" fill="#F26522" opacity="0.55" />
          <text x="66" y="42" className="ps-wordmark" fill="#FFFFFF">SOLUGY</text>
        </svg>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
          {spin ? <span className="ps-spin" /> : null}{titulo}
        </div>
        <div style={{ fontSize: 13, color: "#868F9E", lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}
