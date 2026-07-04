#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrator Painel Solugy  ·  LJ Sistemas (Firebird)  ->  dash_data.json
=====================================================================
Lê o banco do LJ em MODO SOMENTE LEITURA e gera um único arquivo
dash_data.json com todas as métricas e composições que o painel usa.

Requisitos na máquina do LJ:
  - Python 3.9+                (py --version)
  - pip install fdb            (driver Firebird)
  - O servidor Firebird do LJ rodando (normalmente já roda como serviço)

Como configurar: ajuste o bloco CONFIG abaixo (caminho do banco, usuário,
senha e a PASTA DE SAÍDA que fica dentro do OneDrive/SharePoint sincronizado).

Segurança: este script só executa SELECT. Não altera nada no banco.
"""

import os, sys, json, datetime, decimal, traceback

# ─────────────────────────── CONFIG ───────────────────────────
CONFIG = {
    # Caminho do banco. Se o Firebird estiver na MESMA máquina, use localhost:
    "dsn": r"localhost:C:\ADMsolugy\Data\ESTOQUE.FDB",
    "user": "SYSDBA",
    "password": "masterkey",
    "charset": "WIN1252",   # LJ costuma usar WIN1252; se vier acento errado troque p/ ISO8859_1

    # Pasta de saída: DENTRO da pasta do OneDrive/SharePoint sincronizada,
    # para o arquivo subir sozinho para a nuvem assim que for gravado.
    # Ex.: "C:\\Users\\SEU_USUARIO\\OneDrive - Solugy\\PainelSolugy"
    "saida_dir": r"C:\PainelSolugy\dados",

    # Quantos meses para trás considerar
    "meses": 12,
}
# ───────────────────────────────────────────────────────────────

MAPA_VEND = {"1": "SOLUGY", "2": "THIAGO", "3": "BRUNA", "4": "PEDRO",
             "5": "ARTHUR", "6": "ALEXANDRE", "7": "FABIO"}
MES_PT = {"01": "jan", "02": "fev", "03": "mar", "04": "abr", "05": "mai", "06": "jun",
          "07": "jul", "08": "ago", "09": "set", "10": "out", "11": "nov", "12": "dez"}


def log(msg):
    print(f"[{datetime.datetime.now():%Y-%m-%d %H:%M:%S}] {msg}", flush=True)


def f(v):
    if v is None:
        return 0.0
    if isinstance(v, decimal.Decimal):
        return float(v)
    try:
        return float(v)
    except Exception:
        return 0.0


def fmes(chave):  # "2026-06" -> "jun/26"
    y, m = chave.split("-")
    return MES_PT[m] + "/" + y[2:]


def conectar():
    try:
        import fdb
    except ImportError:
        log("ERRO: driver 'fdb' não instalado. Rode:  pip install fdb")
        sys.exit(1)
    con = fdb.connect(
        dsn=CONFIG["dsn"], user=CONFIG["user"], password=CONFIG["password"],
        charset=CONFIG["charset"],
    )
    return con


def q(cur, sql):
    cur.execute(sql)
    cols = [d[0] for d in cur.description]
    return [dict(zip(cols, row)) for row in cur.fetchall()]


def extrair():
    hoje = datetime.date.today()
    ini = (hoje.replace(day=1) - datetime.timedelta(days=31 * CONFIG["meses"])).replace(day=1)
    ini_str = ini.strftime("%Y-%m-%d")
    log(f"Período: {ini_str} a {hoje}")

    con = conectar()
    cur = con.cursor()
    log("Conectado ao Firebird (somente leitura).")

    # ── VENDAS (cabeçalho) não canceladas ──
    vendas = q(cur, f"""
        SELECT VENDACONTADOR, DTEMISSAO, VENDEDOR, TOTGERAL, TOTCUSTO,
               TOTDESCONTO, TIPOPAGTO, CANCELADO
        FROM EST007
        WHERE CANCELADO <> 'S' AND DTEMISSAO >= '{ini_str}'
    """)
    log(f"  EST007 (vendas): {len(vendas)} linhas")

    # ── ITENS de venda ──
    itens = q(cur, f"""
        SELECT i.PRODUTO, i.DESCPRODUTO, i.QTDE, i.TOTPROD, i.TOTCUSTO, i.CANCELADO
        FROM EST008 i
        JOIN EST007 v ON v.VENDACONTADOR = i.VENDACONTA
        WHERE i.CANCELADO <> 'S' AND v.CANCELADO <> 'S' AND v.DTEMISSAO >= '{ini_str}'
    """)
    log(f"  EST008 (itens): {len(itens)} linhas")

    # ── CONTAS A RECEBER + nome do cliente ──
    receber = q(cur, """
        SELECT c.STATUS, c.DTVENC, c.VALORVENDA, c.VLRPAGO, cli.NOME AS NOMECLI
        FROM CR001 c
        LEFT JOIN CR002 cli ON cli.CLICONTADOR = c.CLICONTADOR
    """)
    log(f"  CR001 (a receber): {len(receber)} linhas")

    # ── CONTAS A PAGAR (para posição futura) ──
    pagar = q(cur, "SELECT STATUS, DTVENC, VALORCOMPRA, VLRPAGO FROM CP001")
    log(f"  CP001 (a pagar): {len(pagar)} linhas")

    con.close()
    log("Conexão encerrada. Agregando…")
    return vendas, itens, receber, pagar, hoje


def agregar(vendas, itens, receber, pagar, hoje):
    from collections import defaultdict

    # ===== KPIs e mensal =====
    fat = cus = 0.0
    n = 0
    mes = defaultdict(lambda: [0.0, 0.0, 0])       # receita, custo, nvendas
    pag = defaultdict(lambda: [0.0, 0])            # valor, n  (AP/AV)
    vend = defaultdict(lambda: [0.0, 0.0, 0])      # receita, custo, n

    for v in vendas:
        tg, tc = f(v["TOTGERAL"]), f(v["TOTCUSTO"])
        fat += tg; cus += tc; n += 1
        dt = v["DTEMISSAO"]
        if dt:
            k = f"{dt.year}-{dt.month:02d}"
            mes[k][0] += tg; mes[k][1] += tc; mes[k][2] += 1
        tp = (v["TIPOPAGTO"] or "").strip()
        pag[tp][0] += tg; pag[tp][1] += 1
        cod = str(v["VENDEDOR"] or "").strip()
        vend[cod][0] += tg; vend[cod][1] += tc; vend[cod][2] += 1

    margem = fat - cus
    kpi = {
        "faturamento": round(fat, 2), "custo": round(cus, 2), "margem": round(margem, 2),
        "margem_pct": round(100 * margem / fat, 1) if fat else 0,
        "num_vendas": n, "ticket_medio": round(fat / n, 2) if n else 0,
    }

    mensal = [{"mes": k, "fat": round(a[0], 2),
               "margem_pct": round(100 * (a[0] - a[1]) / a[0], 1) if a[0] else 0}
              for k, a in sorted(mes.items())]

    det_fat = sorted([
        {"label": fmes(k), "receita": round(a[0], 2), "custo": round(a[1], 2),
         "margem": round(a[0] - a[1], 2),
         "margem_pct": round(100 * (a[0] - a[1]) / a[0], 1) if a[0] else 0,
         "n": a[2], "ticket": round(a[0] / a[2], 2) if a[2] else 0}
        for k, a in mes.items()], key=lambda x: -x["receita"])

    # ===== Pagamento (recebimento) =====
    mp = {"AP": "A Prazo", "AV": "À Vista"}
    totpag = sum(a[0] for a in pag.values())
    pagamento = [{"tipo": mp.get(k, k or "—"), "n": a[1], "valor": round(a[0], 2)}
                 for k, a in pag.items()]
    pagamento.sort(key=lambda x: -x["valor"])
    det_receb = [{"label": mp.get(k, k or "—"), "valor": round(a[0], 2), "n": a[1],
                  "ticket": round(a[0] / a[1], 2) if a[1] else 0,
                  "pct": round(100 * a[0] / totpag, 1) if totpag else 0}
                 for k, a in pag.items()]
    det_receb.sort(key=lambda x: -x["valor"])

    # ===== Produtos: ABC + margem =====
    prod = defaultdict(lambda: [0.0, 0.0, 0.0, ""])   # receita, qtd, custo, nome
    for it in itens:
        k = str(it["PRODUTO"])
        prod[k][0] += f(it["TOTPROD"]); prod[k][1] += f(it["QTDE"])
        prod[k][2] += f(it["TOTCUSTO"]); prod[k][3] = it["DESCPRODUTO"] or ""

    plist = [(k, a) for k, a in prod.items() if a[0] > 0]
    total_rec = sum(a[0] for _, a in plist)

    por_rec = sorted(plist, key=lambda x: -x[1][0])
    acc = 0.0; abc_full = []
    for i, (k, a) in enumerate(por_rec):
        acc += a[0]; pacum = 100 * acc / total_rec if total_rec else 0
        cls = "A" if pacum <= 80 else ("B" if pacum <= 95 else "C")
        abc_full.append({"pos": i + 1, "cod": k, "nome": a[3][:48],
                         "receita": round(a[0], 2),
                         "pct": round(100 * a[0] / total_rec, 2) if total_rec else 0,
                         "acum": round(pacum, 1), "classe": cls})
    # resumo ABC (contagem/receita por classe)
    abc_resumo = {}
    for r in abc_full:
        c = r["classe"]; abc_resumo.setdefault(c, [0, 0.0])
        abc_resumo[c][0] += 1; abc_resumo[c][1] += r["receita"]
    abc = [{"classe": c, "produtos": abc_resumo[c][0], "receita": round(abc_resumo[c][1], 2)}
           for c in ("A", "B", "C") if c in abc_resumo]

    top_prod = [{"cod": r["cod"], "nome": prod[r["cod"]][3][:48],
                 "receita": r["receita"], "qtd": round(prod[r["cod"]][1], 1),
                 "margem": round(prod[r["cod"]][0] - prod[r["cod"]][2], 2),
                 "margem_pct": round(100 * (prod[r["cod"]][0] - prod[r["cod"]][2]) / prod[r["cod"]][0], 1) if prod[r["cod"]][0] else 0}
                for r in abc_full[:20]]

    det_margem = sorted([
        {"cod": k, "nome": a[3][:48], "receita": round(a[0], 2), "qtd": round(a[1], 1),
         "custo": round(a[2], 2), "margem": round(a[0] - a[2], 2),
         "margem_pct": round(100 * (a[0] - a[2]) / a[0], 1) if a[0] else 0}
        for k, a in plist], key=lambda x: -x["margem"])[:80]

    # ===== Vendedores =====
    totv = sum(a[0] for a in vend.values())
    top_vend = sorted([
        {"cod": k, "nome": MAPA_VEND.get(k, k or "—"), "receita": round(a[0], 2)}
        for k, a in vend.items()], key=lambda x: -x["receita"])
    det_vend = sorted([
        {"label": MAPA_VEND.get(k, "Sem vendedor" if not k else k),
         "receita": round(a[0], 2), "margem": round(a[0] - a[1], 2),
         "margem_pct": round(100 * (a[0] - a[1]) / a[0], 1) if a[0] else 0,
         "n": a[2], "ticket": round(a[0] / a[2], 2) if a[2] else 0,
         "pct": round(100 * a[0] / totv, 1) if totv else 0}
        for k, a in vend.items()], key=lambda x: -x["receita"])

    # ===== Financeiro: a receber (aging + por cliente) =====
    def saldo(r):
        s = f(r["VALORVENDA"]) - f(r["VLRPAGO"])
        return s if s > 0 else f(r["VALORVENDA"])

    ab = [r for r in receber if (r["STATUS"] or "").strip() == "AB"]
    faixas = {"Vencido": [0.0, 0], "0–30 dias": [0.0, 0], "31–60 dias": [0.0, 0],
              "61–90 dias": [0.0, 0], "> 90 dias": [0.0, 0]}
    cli = defaultdict(lambda: {"aberto": 0.0, "vencido": 0.0, "avencer": 0.0,
                               "ntit": 0, "nvenc": 0, "venc_antigo": None})
    rec_aberto = 0.0
    for r in ab:
        val = saldo(r); dv = r["DTVENC"]; rec_aberto += val
        nome = (r["NOMECLI"] or "SEM NOME").strip()
        c = cli[nome]; c["aberto"] += val; c["ntit"] += 1
        if dv:
            dif = (dv - hoje).days
            fx = ("Vencido" if dif < 0 else "0–30 dias" if dif <= 30 else
                  "31–60 dias" if dif <= 60 else "61–90 dias" if dif <= 90 else "> 90 dias")
            faixas[fx][0] += val; faixas[fx][1] += 1
            if dif < 0:
                c["vencido"] += val; c["nvenc"] += 1
                if c["venc_antigo"] is None or dv < c["venc_antigo"]:
                    c["venc_antigo"] = dv
            else:
                c["avencer"] += val
        else:
            c["avencer"] += val

    tot_faixa = sum(a[0] for a in faixas.values())
    aging = {"vencido": round(faixas["Vencido"][0], 2), "ate30": round(faixas["0–30 dias"][0], 2),
             "d31_60": round(faixas["31–60 dias"][0], 2), "d61_90": round(faixas["61–90 dias"][0], 2),
             "mais90": round(faixas["> 90 dias"][0], 2)}
    det_receber_faixa = sorted([
        {"label": fx, "valor": round(a[0], 2), "titulos": a[1],
         "pct": round(100 * a[0] / tot_faixa, 1) if tot_faixa else 0}
        for fx, a in faixas.items()], key=lambda x: -x["valor"])

    clientes = []
    for nome, c in cli.items():
        atraso = (hoje - c["venc_antigo"]).days if c["venc_antigo"] else 0
        clientes.append({"nome": nome[:42], "aberto": round(c["aberto"], 2),
                         "vencido": round(c["vencido"], 2), "avencer": round(c["avencer"], 2),
                         "ntit": c["ntit"], "nvenc": c["nvenc"], "atraso": atraso})
    por_vencido = sorted([x for x in clientes if x["vencido"] > 0], key=lambda x: -x["vencido"])[:60]
    por_aberto = sorted(clientes, key=lambda x: -x["aberto"])[:60]

    # ===== A pagar (posição futura) =====
    ap = [r for r in pagar if (r["STATUS"] or "").strip() == "AB"]
    pagar_aberto = sum(f(r["VALORCOMPRA"]) - f(r["VLRPAGO"]) for r in ap)

    # ===== Monta o objeto final =====
    return {
        "meta": {
            "periodo": f"{fmes(mensal[0]['mes'])} – {fmes(mensal[-1]['mes'])}" if mensal else "",
            "ref": hoje.strftime("%d/%m/%Y"),
            "atualizado_em": datetime.datetime.now().strftime("%d/%m/%Y %H:%M"),
            "n_produtos_ativos": len(plist),
        },
        "kpi": kpi,
        "mensal": mensal,
        "pagamento": pagamento,
        "abc": abc,
        "top_prod": top_prod,
        "top_vend": top_vend,
        "fin": {
            "receber_aberto": round(rec_aberto, 2),
            "pagar_aberto": round(pagar_aberto, 2),
            "saldo_projetado": round(rec_aberto - pagar_aberto, 2),
            "aging": aging,
        },
        "det": {
            "faturamento": det_fat, "margem": det_margem, "recebimento": det_receb,
            "abc": abc_full[:100], "receber": det_receber_faixa, "vendedor": det_vend,
        },
        "reccli": {
            "por_vencido": por_vencido, "por_aberto": por_aberto,
            "resumo": {"clientes": len(clientes),
                       "clientes_venc": len([x for x in clientes if x["vencido"] > 0]),
                       "total_aberto": round(rec_aberto, 2),
                       "total_vencido": round(faixas["Vencido"][0], 2)},
        },
    }


def main():
    try:
        vendas, itens, receber, pagar, hoje = extrair()
        dados = agregar(vendas, itens, receber, pagar, hoje)

        os.makedirs(CONFIG["saida_dir"], exist_ok=True)
        destino = os.path.join(CONFIG["saida_dir"], "dash_data.json")
        # grava em arquivo temporário e renomeia (evita o app ler um JSON pela metade)
        tmp = destino + ".tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(dados, fh, ensure_ascii=False, separators=(",", ":"))
        os.replace(tmp, destino)

        log(f"OK  ->  {destino}")
        log(f"    Faturamento: R$ {dados['kpi']['faturamento']:,.2f} | "
            f"Margem: {dados['kpi']['margem_pct']}% | "
            f"A receber: R$ {dados['fin']['receber_aberto']:,.2f} | "
            f"Vencido: R$ {dados['fin']['aging']['vencido']:,.2f}")
    except Exception as e:
        log("FALHA na extração:")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
