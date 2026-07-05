import React, { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ReferenceLine, ScatterChart, Scatter, ZAxis,
} from "recharts";

const D = {"meta":{"periodo":"ago/25 – jul/26","ref":"04/07/2026","atualizado_em":"04/07/2026 05:54","flags":{"fornecedor_nome":false,"estoque_saldo":false,"dividas":false,"impostos":false,"lucro_liquido":false}},"kpi":{"receita":3786672.38,"custo":2173616.23,"lucro_bruto":1613056.15,"margem_pct":42.6,"nvendas":15526,"ticket":243.89,"var":{"receita":-1.8,"margem_pct":-1.5,"ticket":-10.9,"nvendas":10.2},"ref_mes":"jun/26","ant_mes":"mai/26"},"serie":[{"k":"ago/25","y":2025,"m":8,"rec":346.81,"cus":184.0,"margem":162.81,"margem_pct":46.9,"n":2,"ticket":173.41},{"k":"set/25","y":2025,"m":9,"rec":295124.18,"cus":167722.26,"margem":127401.92,"margem_pct":43.2,"n":811,"ticket":363.9},{"k":"out/25","y":2025,"m":10,"rec":343767.55,"cus":196564.35,"margem":147203.2,"margem_pct":42.8,"n":1193,"ticket":288.15},{"k":"nov/25","y":2025,"m":11,"rec":459458.85,"cus":254855.0,"margem":204603.85,"margem_pct":44.5,"n":1404,"ticket":327.25},{"k":"dez/25","y":2025,"m":12,"rec":302612.99,"cus":174154.58,"margem":128458.41,"margem_pct":42.4,"n":1447,"ticket":209.13},{"k":"jan/26","y":2026,"m":1,"rec":351568.04,"cus":196695.76,"margem":154872.28,"margem_pct":44.1,"n":1454,"ticket":241.79},{"k":"fev/26","y":2026,"m":2,"rec":260196.01,"cus":150587.31,"margem":109608.7,"margem_pct":42.1,"n":1380,"ticket":188.55},{"k":"mar/26","y":2026,"m":3,"rec":467459.21,"cus":269512.21,"margem":197947.0,"margem_pct":42.3,"n":1843,"ticket":253.64},{"k":"abr/26","y":2026,"m":4,"rec":326471.12,"cus":192200.23,"margem":134270.89,"margem_pct":41.1,"n":1694,"ticket":192.72},{"k":"mai/26","y":2026,"m":5,"rec":470739.29,"cus":271230.61,"margem":199508.68,"margem_pct":42.4,"n":1921,"ticket":245.05},{"k":"jun/26","y":2026,"m":6,"rec":462239.15,"cus":273108.99,"margem":189130.16,"margem_pct":40.9,"n":2116,"ticket":218.45},{"k":"jul/26","y":2026,"m":7,"rec":46689.18,"cus":26800.93,"margem":19888.25,"margem_pct":42.6,"n":261,"ticket":178.89}],"cheios":["set/25","out/25","nov/25","dez/25","jan/26","fev/26","mar/26","abr/26","mai/26","jun/26"],"vendedores":[{"nome":"THIAGO","rec":1458405.56,"margem":625996.85,"margem_pct":42.9,"n":4391,"ticket":332.14,"pct":38.5},{"nome":"ARTHUR","rec":1079368.29,"margem":461452.75,"margem_pct":42.8,"n":4812,"ticket":224.31,"pct":28.5},{"nome":"ALEXANDRE","rec":703053.12,"margem":296470.63,"margem_pct":42.2,"n":3239,"ticket":217.06,"pct":18.6},{"nome":"FABIO","rec":257267.05,"margem":101342.16,"margem_pct":39.4,"n":1282,"ticket":200.68,"pct":6.8},{"nome":"PEDRO","rec":169165.18,"margem":77545.58,"margem_pct":45.8,"n":872,"ticket":194.0,"pct":4.5},{"nome":"BRUNA","rec":81832.85,"margem":34636.1,"margem_pct":42.3,"n":759,"ticket":107.82,"pct":2.2},{"nome":"SOLUGY","rec":37339.84,"margem":15499.22,"margem_pct":41.5,"n":167,"ticket":223.59,"pct":1.0},{"nome":"Sem vendedor","rec":240.49,"margem":112.86,"margem_pct":46.9,"n":4,"ticket":60.12,"pct":0.0}],"clientes":{"lista":[{"nome":"CONSUMIDOR FINAL","rec":939617.8,"margem":299063.04,"margem_pct":31.8,"n":8109,"ticket":115.87,"recencia":1,"acum":24.8,"classe":"A"},{"nome":"PRIVATE CONSTRUTORA LTDA","rec":235438.07,"margem":115342.93,"margem_pct":49.0,"n":329,"ticket":715.62,"recencia":1,"acum":31.0,"classe":"A"},{"nome":"SOLUGY ENGENHARIA E SERVICOS LTDA","rec":133596.73,"margem":74325.74,"margem_pct":55.6,"n":240,"ticket":556.65,"recencia":2,"acum":34.6,"classe":"A"},{"nome":"IRMANDADE DE SANTO ANTONIO DO CURVELO","rec":105489.78,"margem":51435.17,"margem_pct":48.8,"n":40,"ticket":2637.24,"recencia":1,"acum":37.3,"classe":"A"},{"nome":"CENTRAL FIT LTDA","rec":96021.69,"margem":44820.08,"margem_pct":46.7,"n":167,"ticket":574.98,"recencia":3,"acum":39.9,"classe":"A"},{"nome":"SOLAR SOLUCOES EM ENERGIA LIMPA LTDA","rec":84210.4,"margem":38660.03,"margem_pct":45.9,"n":264,"ticket":318.98,"recencia":3,"acum":42.1,"classe":"A"},{"nome":"THIAGO APARECIDO SILVEIRA SOUZA","rec":71825.05,"margem":33154.83,"margem_pct":46.2,"n":188,"ticket":382.05,"recencia":1,"acum":44.0,"classe":"A"},{"nome":"R. S. CONSTRUCOES E ADMINISTRACAO DE OBR","rec":71439.5,"margem":30804.74,"margem_pct":43.1,"n":69,"ticket":1035.36,"recencia":3,"acum":45.9,"classe":"A"},{"nome":"GUILHERME HENRIQUE MARTINS DUAN","rec":68803.76,"margem":31555.28,"margem_pct":45.9,"n":214,"ticket":321.51,"recencia":3,"acum":47.7,"classe":"A"},{"nome":"COPYCENTRO LTDA","rec":61840.21,"margem":26160.11,"margem_pct":42.3,"n":49,"ticket":1262.05,"recencia":9,"acum":49.3,"classe":"A"},{"nome":"VANUCE MALAQUIAS","rec":58973.53,"margem":26063.02,"margem_pct":44.2,"n":114,"ticket":517.31,"recencia":2,"acum":50.9,"classe":"A"},{"nome":"CORREA & ALVARES LTDA","rec":48724.04,"margem":20574.53,"margem_pct":42.2,"n":11,"ticket":4429.46,"recencia":90,"acum":52.2,"classe":"A"},{"nome":"PAMELA BATISTA RODRIGUES","rec":47282.73,"margem":21811.88,"margem_pct":46.1,"n":102,"ticket":463.56,"recencia":1,"acum":53.4,"classe":"A"},{"nome":"COMERCIAL GALA LTDA","rec":45379.06,"margem":21086.15,"margem_pct":46.5,"n":70,"ticket":648.27,"recencia":8,"acum":54.6,"classe":"A"},{"nome":"SOLUGY MATERIAIS ELETRICOS LTDA","rec":44359.55,"margem":21745.65,"margem_pct":49.0,"n":128,"ticket":346.56,"recencia":3,"acum":55.8,"classe":"A"},{"nome":"MAURICIO AZEVEDO DE SOUZA(COCAO)","rec":38061.07,"margem":16620.12,"margem_pct":43.7,"n":141,"ticket":269.94,"recencia":2,"acum":56.8,"classe":"A"},{"nome":"RGE SOLUCOES EM ENERGIA LTDA","rec":32551.78,"margem":15063.75,"margem_pct":46.3,"n":81,"ticket":401.87,"recencia":3,"acum":57.7,"classe":"A"},{"nome":"SR. LIGORIO LTDA","rec":31891.01,"margem":14895.69,"margem_pct":46.7,"n":235,"ticket":135.71,"recencia":1,"acum":58.5,"classe":"A"},{"nome":"PAULO HENRIQUE ALVES BATISTA","rec":31503.44,"margem":14060.37,"margem_pct":44.6,"n":163,"ticket":193.27,"recencia":1,"acum":59.3,"classe":"A"},{"nome":"HELBERT GABRIEL SOARES SANTOS","rec":30851.99,"margem":14027.82,"margem_pct":45.5,"n":201,"ticket":153.49,"recencia":1,"acum":60.2,"classe":"A"},{"nome":"RICARDO LOURENCO","rec":29475.9,"margem":13354.36,"margem_pct":45.3,"n":186,"ticket":158.47,"recencia":1,"acum":60.9,"classe":"A"},{"nome":"ALMIR DOS REIS SILVA(COMISSIONADO)","rec":27006.91,"margem":11458.22,"margem_pct":42.4,"n":125,"ticket":216.06,"recencia":1,"acum":61.6,"classe":"A"},{"nome":"PLANTAR EMPREENDIMENTOS E PRODUTOS FLORE","rec":26196.03,"margem":12043.63,"margem_pct":46.0,"n":33,"ticket":793.82,"recencia":1,"acum":62.3,"classe":"A"},{"nome":"RONALDO PEREIRA DA COSTA","rec":25800.85,"margem":11815.16,"margem_pct":45.8,"n":55,"ticket":469.11,"recencia":11,"acum":63.0,"classe":"A"},{"nome":"MARLON DARLAN FERNANDES DOS SANTOS(COMIS","rec":25369.65,"margem":11061.29,"margem_pct":43.6,"n":61,"ticket":415.9,"recencia":47,"acum":63.7,"classe":"A"},{"nome":"OLIVEIRA GONCALVES LIMA JUNIOR","rec":24888.13,"margem":11161.99,"margem_pct":44.8,"n":96,"ticket":259.25,"recencia":4,"acum":64.3,"classe":"A"},{"nome":"RODINEY EDUARDO CARDOSO","rec":24569.87,"margem":10764.75,"margem_pct":43.8,"n":155,"ticket":158.52,"recencia":2,"acum":65.0,"classe":"A"},{"nome":"GERALDO LESSA GUIMARAES","rec":24524.47,"margem":11057.76,"margem_pct":45.1,"n":19,"ticket":1290.76,"recencia":17,"acum":65.6,"classe":"A"},{"nome":"FRIGOCORT COMERCIO DE CARNES LTDA","rec":24303.84,"margem":11942.63,"margem_pct":49.1,"n":12,"ticket":2025.32,"recencia":23,"acum":66.3,"classe":"A"},{"nome":"ANDRE RICARDO MAGALHAES","rec":22975.72,"margem":10528.32,"margem_pct":45.8,"n":9,"ticket":2552.86,"recencia":29,"acum":66.9,"classe":"A"},{"nome":"FAZENDA OURO VERDE","rec":20148.76,"margem":9534.55,"margem_pct":47.3,"n":14,"ticket":1439.2,"recencia":11,"acum":67.4,"classe":"A"},{"nome":"HOSPITAL IMACULADA CONCEICAO","rec":19648.72,"margem":7608.24,"margem_pct":38.7,"n":10,"ticket":1964.87,"recencia":37,"acum":67.9,"classe":"A"},{"nome":"ZANINI FLORESTAL LIMITADA","rec":19338.05,"margem":9799.41,"margem_pct":50.7,"n":8,"ticket":2417.26,"recencia":12,"acum":68.5,"classe":"A"},{"nome":"TIM MOLEIRO LTDA.","rec":18372.16,"margem":7817.01,"margem_pct":42.5,"n":28,"ticket":656.15,"recencia":8,"acum":68.9,"classe":"A"},{"nome":"MARCOS GERALDO GALUPO","rec":17813.18,"margem":6181.9,"margem_pct":34.7,"n":16,"ticket":1113.32,"recencia":10,"acum":69.4,"classe":"A"},{"nome":"LEANDRO FRANCISCO DE SOUZA","rec":17655.71,"margem":8352.67,"margem_pct":47.3,"n":29,"ticket":608.82,"recencia":9,"acum":69.9,"classe":"A"},{"nome":"MONVEP CAMINHOES E ONIBUS LTDA","rec":17474.98,"margem":7524.2,"margem_pct":43.1,"n":17,"ticket":1027.94,"recencia":18,"acum":70.3,"classe":"A"},{"nome":"OBRAS CIVIS & MONTAGENS INDUSTRIAIS LTDA","rec":17205.67,"margem":7793.52,"margem_pct":45.3,"n":9,"ticket":1911.74,"recencia":172,"acum":70.8,"classe":"A"},{"nome":"ADRIANO MARCELINO GOMES MATOSO 042343526","rec":16285.98,"margem":7376.86,"margem_pct":45.3,"n":114,"ticket":142.86,"recencia":1,"acum":71.2,"classe":"A"},{"nome":"VITORIA COMERCIO DE CARNES E PRODUTOS AL","rec":16038.91,"margem":7461.05,"margem_pct":46.5,"n":25,"ticket":641.56,"recencia":156,"acum":71.6,"classe":"A"},{"nome":"OTICA OLIWER","rec":15843.64,"margem":6918.93,"margem_pct":43.7,"n":14,"ticket":1131.69,"recencia":3,"acum":72.1,"classe":"A"},{"nome":"ELIZETE DE FATIMA ROCHA","rec":15789.08,"margem":7441.07,"margem_pct":47.1,"n":34,"ticket":464.38,"recencia":16,"acum":72.5,"classe":"A"},{"nome":"JOSE GERALDO DA COSTA","rec":14595.47,"margem":6392.28,"margem_pct":43.8,"n":76,"ticket":192.05,"recencia":8,"acum":72.9,"classe":"A"},{"nome":"GERALDO JORGE DE ARAUJO","rec":14216.75,"margem":6041.74,"margem_pct":42.5,"n":102,"ticket":139.38,"recencia":7,"acum":73.2,"classe":"A"},{"nome":"LEONARDO JOSE DE SOUZA","rec":13048.56,"margem":5646.71,"margem_pct":43.3,"n":34,"ticket":383.78,"recencia":2,"acum":73.6,"classe":"A"},{"nome":"MARCO AURELIO DAYREL MAGALHAES","rec":12931.91,"margem":5633.17,"margem_pct":43.6,"n":37,"ticket":349.51,"recencia":9,"acum":73.9,"classe":"A"},{"nome":"GERALDO MAGELA GOMES","rec":12436.93,"margem":5442.05,"margem_pct":43.8,"n":16,"ticket":777.31,"recencia":75,"acum":74.3,"classe":"A"},{"nome":"FABIO SANTOS SILVA","rec":12380.08,"margem":5582.75,"margem_pct":45.1,"n":36,"ticket":343.89,"recencia":6,"acum":74.6,"classe":"A"},{"nome":"FLAVIO PARENTE","rec":12202.2,"margem":5390.76,"margem_pct":44.2,"n":20,"ticket":610.11,"recencia":1,"acum":74.9,"classe":"A"},{"nome":"JAILTON ALVES LIMA","rec":12167.56,"margem":5392.08,"margem_pct":44.3,"n":114,"ticket":106.73,"recencia":3,"acum":75.2,"classe":"A"},{"nome":"JOSE CARLOS PEREIRA","rec":12120.95,"margem":5141.9,"margem_pct":42.4,"n":8,"ticket":1515.12,"recencia":4,"acum":75.5,"classe":"A"},{"nome":"JULIO CESAR DE OLIVEIRA ARAUJO","rec":11779.62,"margem":4963.56,"margem_pct":42.1,"n":14,"ticket":841.4,"recencia":10,"acum":75.9,"classe":"A"},{"nome":"VITOR FERNANDES BARBOSA","rec":11472.91,"margem":4973.16,"margem_pct":43.3,"n":29,"ticket":395.62,"recencia":23,"acum":76.2,"classe":"A"},{"nome":"BIAGIO ANUZZO","rec":11393.32,"margem":4980.24,"margem_pct":43.7,"n":17,"ticket":670.2,"recencia":26,"acum":76.5,"classe":"A"},{"nome":"EDUARDO GONCALVES PIO","rec":11122.85,"margem":5245.3,"margem_pct":47.2,"n":53,"ticket":209.87,"recencia":1,"acum":76.8,"classe":"A"},{"nome":"JULIO CESAR SANTOS SILVEIRA","rec":10986.35,"margem":5198.82,"margem_pct":47.3,"n":33,"ticket":332.92,"recencia":8,"acum":77.0,"classe":"A"},{"nome":"DESTILARIA E ENGARRAFADORA PORTO FARIA L","rec":9804.85,"margem":5187.5,"margem_pct":52.9,"n":13,"ticket":754.22,"recencia":110,"acum":77.3,"classe":"A"},{"nome":"MARCOS ANTONIO ALVES BARBOZA FILHO","rec":9489.87,"margem":4468.62,"margem_pct":47.1,"n":25,"ticket":379.59,"recencia":35,"acum":77.6,"classe":"A"},{"nome":"RODRIGO PEREIRA CORREA","rec":9220.42,"margem":4076.46,"margem_pct":44.2,"n":17,"ticket":542.38,"recencia":2,"acum":77.8,"classe":"A"},{"nome":"HELDER ALVES DE OLIVEIRA","rec":9214.35,"margem":5160.0,"margem_pct":56.0,"n":83,"ticket":111.02,"recencia":3,"acum":78.0,"classe":"A"},{"nome":"ROMULO AZEVEDO SOARES RIBEIRO","rec":8965.68,"margem":3937.53,"margem_pct":43.9,"n":8,"ticket":1120.71,"recencia":156,"acum":78.3,"classe":"A"},{"nome":"KELIANE SOUZA SILVERIO","rec":8907.04,"margem":3964.97,"margem_pct":44.5,"n":16,"ticket":556.69,"recencia":58,"acum":78.5,"classe":"A"},{"nome":"RICARDO PEREIRA CARDOSO","rec":8876.98,"margem":4409.53,"margem_pct":49.7,"n":16,"ticket":554.81,"recencia":15,"acum":78.7,"classe":"A"},{"nome":"ISABELLE CRISTINA DUQUE NOGUEIRA","rec":8864.89,"margem":3741.49,"margem_pct":42.2,"n":13,"ticket":681.91,"recencia":45,"acum":79.0,"classe":"A"},{"nome":"VALLOUREC TUBOS DO BRASIL LTDA.","rec":8864.6,"margem":4616.42,"margem_pct":52.1,"n":12,"ticket":738.72,"recencia":1,"acum":79.2,"classe":"A"},{"nome":"CAMARA DE DIRIGENTES LOJISTAS DE CURVELO","rec":8622.58,"margem":3833.89,"margem_pct":44.5,"n":31,"ticket":278.15,"recencia":1,"acum":79.4,"classe":"A"},{"nome":"B & E - COMERCIO E SERVICOS LTDA","rec":8512.74,"margem":4687.79,"margem_pct":55.1,"n":35,"ticket":243.22,"recencia":3,"acum":79.7,"classe":"A"},{"nome":"CARLOS MAURICIO VASCONCELOS GONZAGA","rec":8441.84,"margem":3725.06,"margem_pct":44.1,"n":7,"ticket":1205.98,"recencia":4,"acum":79.9,"classe":"A"},{"nome":"DOUGLAS SOARES PEREIRA","rec":8385.15,"margem":4017.04,"margem_pct":47.9,"n":59,"ticket":142.12,"recencia":1,"acum":80.1,"classe":"B"},{"nome":"REDE HG COMBUSTIVEIS LTDA.","rec":8210.58,"margem":4126.78,"margem_pct":50.3,"n":22,"ticket":373.21,"recencia":25,"acum":80.3,"classe":"B"},{"nome":"ASSOCIACAO COMUNITARIA DOS MORADORES DO ","rec":8111.04,"margem":3576.34,"margem_pct":44.1,"n":21,"ticket":386.24,"recencia":24,"acum":80.5,"classe":"B"},{"nome":"MARCIA CRISTINA GONCALVES CARDOSO","rec":7963.29,"margem":3539.25,"margem_pct":44.4,"n":10,"ticket":796.33,"recencia":25,"acum":80.8,"classe":"B"},{"nome":"HAILTON FERNANDES DOS SANTOS","rec":7953.42,"margem":3570.99,"margem_pct":44.9,"n":13,"ticket":611.8,"recencia":121,"acum":81.0,"classe":"B"},{"nome":"ALLMAX SOLUCOES INDUSTRIAIS LTDA","rec":7891.81,"margem":3460.94,"margem_pct":43.9,"n":8,"ticket":986.48,"recencia":65,"acum":81.2,"classe":"B"},{"nome":"ALBERT GUIDO CELESTINO","rec":7579.13,"margem":3430.99,"margem_pct":45.3,"n":8,"ticket":947.39,"recencia":250,"acum":81.4,"classe":"B"},{"nome":"MATHEUS FELIPE DIAS MONTEIRO","rec":7556.64,"margem":3433.05,"margem_pct":45.4,"n":51,"ticket":148.17,"recencia":2,"acum":81.6,"classe":"B"},{"nome":"ASSEMBLEIA DE DEUS MINISTERIO DE CURVELO","rec":7505.82,"margem":3362.95,"margem_pct":44.8,"n":11,"ticket":682.35,"recencia":26,"acum":81.8,"classe":"B"},{"nome":"JULIO MARQUES MAGALHAES","rec":7464.98,"margem":3347.4,"margem_pct":44.8,"n":41,"ticket":182.07,"recencia":2,"acum":82.0,"classe":"B"},{"nome":"DIOVANE RODRIGUES DOS SANTOS","rec":7354.17,"margem":2668.28,"margem_pct":36.3,"n":1,"ticket":7354.17,"recencia":11,"acum":82.2,"classe":"B"},{"nome":"RICARDO PINTO MACHADO","rec":7284.66,"margem":3511.77,"margem_pct":48.2,"n":42,"ticket":173.44,"recencia":5,"acum":82.4,"classe":"B"}],"abc":null,"top5_pct":39.9,"top1":{"nome":"CONSUMIDOR FINAL","rec":939617.8,"margem":299063.04,"margem_pct":31.8,"n":8109,"ticket":115.87,"recencia":1,"acum":24.8,"classe":"A"},"top1_nom":{"nome":"PRIVATE CONSTRUTORA LTDA","rec":235438.07,"margem":115342.93,"margem_pct":49.0,"n":329,"ticket":715.62,"recencia":1,"acum":31.0,"classe":"A"},"churn":[{"nome":"OBRAS CIVIS & MONTAGENS INDUSTRIAIS LTDA","rec":17205.67,"margem":7793.52,"margem_pct":45.3,"n":9,"ticket":1911.74,"recencia":172,"acum":70.8,"classe":"A"},{"nome":"VITORIA COMERCIO DE CARNES E PRODUTOS AL","rec":16038.91,"margem":7461.05,"margem_pct":46.5,"n":25,"ticket":641.56,"recencia":156,"acum":71.6,"classe":"A"},{"nome":"DESTILARIA E ENGARRAFADORA PORTO FARIA L","rec":9804.85,"margem":5187.5,"margem_pct":52.9,"n":13,"ticket":754.22,"recencia":110,"acum":77.3,"classe":"A"},{"nome":"ROMULO AZEVEDO SOARES RIBEIRO","rec":8965.68,"margem":3937.53,"margem_pct":43.9,"n":8,"ticket":1120.71,"recencia":156,"acum":78.3,"classe":"A"},{"nome":"HAILTON FERNANDES DOS SANTOS","rec":7953.42,"margem":3570.99,"margem_pct":44.9,"n":13,"ticket":611.8,"recencia":121,"acum":81.0,"classe":"B"},{"nome":"ALBERT GUIDO CELESTINO","rec":7579.13,"margem":3430.99,"margem_pct":45.3,"n":8,"ticket":947.39,"recencia":250,"acum":81.4,"classe":"B"},{"nome":"CAMPO ALEGRE INDUSTRIA E COMERCIO DE PRE","rec":6783.46,"margem":3115.73,"margem_pct":45.9,"n":4,"ticket":1695.87,"recencia":153,"acum":82.9,"classe":"B"},{"nome":"LOJA COSTANCE","rec":6299.37,"margem":2831.96,"margem_pct":45.0,"n":14,"ticket":449.95,"recencia":239,"acum":84.1,"classe":"B"},{"nome":"ALINE","rec":5311.8,"margem":2216.27,"margem_pct":41.7,"n":7,"ticket":758.83,"recencia":103,"acum":86.4,"classe":"B"},{"nome":"LIONAN SOARES","rec":5305.16,"margem":2429.1,"margem_pct":45.8,"n":4,"ticket":1326.29,"recencia":228,"acum":86.5,"classe":"B"},{"nome":"CONSTRUTORA M.H.M.LTDA","rec":4865.0,"margem":2002.0,"margem_pct":41.2,"n":1,"ticket":4865.0,"recencia":290,"acum":88.0,"classe":"B"},{"nome":"PEDRO HENRIQUE FARIAS MATOSO","rec":4806.42,"margem":2164.59,"margem_pct":45.0,"n":8,"ticket":600.8,"recencia":94,"acum":88.1,"classe":"B"},{"nome":"CRISTAIS PARQUES CONSULTORIA EMPRESARIAL","rec":4625.59,"margem":2065.23,"margem_pct":44.6,"n":3,"ticket":1541.86,"recencia":260,"acum":88.4,"classe":"B"},{"nome":"COMERCIAL FELIX E SANTOS LTDA","rec":4531.66,"margem":2291.92,"margem_pct":50.6,"n":9,"ticket":503.52,"recencia":110,"acum":88.6,"classe":"B"},{"nome":"GERALDO MOISES BARBOSA COSTA","rec":4346.6,"margem":1915.94,"margem_pct":44.1,"n":4,"ticket":1086.65,"recencia":205,"acum":89.0,"classe":"B"}],"churn_val":215723.96,"churn_n":124,"recbk":{"0-30":2320428.37,"31-60":163994.59,"61-90":146907.66,"90+":215723.96,"s/data":0.0},"total":3786672.38,"total_nom":2847054.58,"n_nomeados":450},"produtos":{"lista":[{"cod":"000259","nome":"CABO FLEXIVEL 02,50 MM PRETO","cat":"Cabos flexíveis","rec":50402.78,"qtd":14988.0,"margem":21496.76,"margem_pct":42.6,"acum":2.3,"classe":"A"},{"cod":"000261","nome":"CABO FLEXIVEL 02,50 MM AZUL","cat":"Cabos flexíveis","rec":48683.4,"qtd":14377.5,"margem":20357.33,"margem_pct":41.8,"acum":4.6,"classe":"A"},{"cod":"001412","nome":"CABO FLEXIVEL NAX 120,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":37384.33,"qtd":267.5,"margem":16553.03,"margem_pct":44.3,"acum":6.3,"classe":"A"},{"cod":"000275","nome":"CABO FLEXIVEL 16,00 MM 750V PRETO","cat":"Cabos flexíveis","rec":31224.31,"qtd":1524.5,"margem":14726.12,"margem_pct":47.2,"acum":7.7,"classe":"A"},{"cod":"000260","nome":"CABO FLEXIVEL 02,50 MM VERDE","cat":"Cabos flexíveis","rec":31171.64,"qtd":9589.5,"margem":13118.81,"margem_pct":42.1,"acum":9.1,"classe":"A"},{"cod":"000267","nome":"CABO FLEXIVEL 06,00 MM PRETO","cat":"Cabos flexíveis","rec":28067.0,"qtd":3534.0,"margem":11789.49,"margem_pct":42.0,"acum":10.4,"classe":"A"},{"cod":"000269","nome":"CABO FLEXIVEL 06,00 MM AZUL","cat":"Cabos flexíveis","rec":26599.6,"qtd":3439.5,"margem":11904.66,"margem_pct":44.8,"acum":11.7,"classe":"A"},{"cod":"000263","nome":"CABO FLEXIVEL 02,50 MM VERMELHO","cat":"Cabos flexíveis","rec":23704.61,"qtd":6929.0,"margem":9950.73,"margem_pct":42.0,"acum":12.8,"classe":"A"},{"cod":"000264","nome":"CABO FLEXIVEL 04,00 MM AZUL","cat":"Cabos flexíveis","rec":22380.73,"qtd":4134.0,"margem":8939.82,"margem_pct":39.9,"acum":13.8,"classe":"A"},{"cod":"000477","nome":"PADRAO PRE- FABRICADO BIFASICO CONTRA 63A 7M","cat":"Padrão de entrada","rec":22301.04,"qtd":12.0,"margem":9183.69,"margem_pct":41.2,"acum":14.8,"classe":"A"},{"cod":"000266","nome":"CABO FLEXIVEL 04,00 MM PRETO","cat":"Cabos flexíveis","rec":21528.07,"qtd":4124.0,"margem":9172.1,"margem_pct":42.6,"acum":15.8,"classe":"A"},{"cod":"000476","nome":"PADRAO PRE- FABRICADO BIFASICO FAVOR 63A 5MT","cat":"Padrão de entrada","rec":21113.22,"qtd":16.0,"margem":8699.72,"margem_pct":41.2,"acum":16.8,"classe":"A"},{"cod":"000277","nome":"CABO FLEXIVEL 16,00 MM 750V AZUL","cat":"Cabos flexíveis","rec":19509.59,"qtd":934.0,"margem":9242.37,"margem_pct":47.4,"acum":17.7,"classe":"A"},{"cod":"001152","nome":"CABO FLEXIVEL 06,00 MM VERMELHO","cat":"Cabos flexíveis","rec":19282.7,"qtd":2496.3,"margem":8645.87,"margem_pct":44.8,"acum":18.6,"classe":"A"},{"cod":"001158","nome":"CABO FLEXIVEL 35,00 MM 750V PRETO","cat":"Cabos flexíveis","rec":18050.83,"qtd":413.5,"margem":7648.7,"margem_pct":42.4,"acum":19.4,"classe":"A"},{"cod":"000271","nome":"CABO FLEXIVEL 10,00 MM 750V PRETO","cat":"Cabos flexíveis","rec":15879.23,"qtd":1220.9,"margem":7039.87,"margem_pct":44.3,"acum":20.1,"classe":"A"},{"cod":"000268","nome":"CABO FLEXIVEL 06,00 MM VERDE","cat":"Cabos flexíveis","rec":15760.8,"qtd":2047.0,"margem":7018.94,"margem_pct":44.5,"acum":20.8,"classe":"A"},{"cod":"000692","nome":"CONECTOR PERFURANTE 16-120X4-35MM","cat":"Conectores","rec":15706.8,"qtd":968.0,"margem":6947.96,"margem_pct":44.2,"acum":21.6,"classe":"A"},{"cod":"001139","nome":"FIO PARALELO 2X1,50MM MARRON","cat":"Fios","rec":14900.37,"qtd":3239.5,"margem":6140.04,"margem_pct":41.2,"acum":22.2,"classe":"A"},{"cod":"001208","nome":"MODULO TOMADA 2P+T 10A TRAMONTINA LIZ","cat":"Tomadas/Interruptores","rec":14446.24,"qtd":1989.0,"margem":5967.7,"margem_pct":41.3,"acum":22.9,"classe":"A"},{"cod":"001391","nome":"CABO FLEXIVEL 04,00 MM VERMELHO","cat":"Cabos flexíveis","rec":13243.85,"qtd":2531.0,"margem":5714.83,"margem_pct":43.2,"acum":23.5,"classe":"A"},{"cod":"000270","nome":"CABO FLEXIVEL 10,00 MM 750V VERDE","cat":"Cabos flexíveis","rec":12776.38,"qtd":952.6,"margem":6012.56,"margem_pct":47.1,"acum":24.1,"classe":"A"},{"cod":"001198","nome":"CONDULETE MULTIPLO X 3/4","cat":"Eletrocalhas/Condutos","rec":12183.93,"qtd":957.0,"margem":5792.82,"margem_pct":47.5,"acum":24.7,"classe":"A"},{"cod":"000272","nome":"CABO FLEXIVEL 10,00 MM 750V AZUL","cat":"Cabos flexíveis","rec":11948.59,"qtd":915.5,"margem":5225.51,"margem_pct":43.7,"acum":25.2,"classe":"A"},{"cod":"000262","nome":"CABO FLEXIVEL 02,50 MM AMARELO","cat":"Cabos flexíveis","rec":11923.14,"qtd":3653.5,"margem":5004.53,"margem_pct":42.0,"acum":25.8,"classe":"A"},{"cod":"001661","nome":"ELETROCALHA PERFURADA 100X100 3MT","cat":"Eletrocalhas/Condutos","rec":11449.4,"qtd":103.0,"margem":4714.44,"margem_pct":41.2,"acum":26.3,"classe":"A"},{"cod":"001169","nome":"CABO FLEXIVEL NAX 16,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":11139.14,"qtd":481.0,"margem":4588.05,"margem_pct":41.2,"acum":26.8,"classe":"A"},{"cod":"001602","nome":"CABO SOLAR 6MM VERMELHO","cat":"Cabos","rec":10689.75,"qtd":1015.0,"margem":5068.91,"margem_pct":47.4,"acum":27.3,"classe":"A"},{"cod":"001140","nome":"FIO PARALELO 2X1,50MM BRANCO","cat":"Fios","rec":10673.32,"qtd":2267.5,"margem":4402.18,"margem_pct":41.2,"acum":27.8,"classe":"A"},{"cod":"000274","nome":"CABO FLEXIVEL 16,00 MM 750V VERDE","cat":"Cabos flexíveis","rec":10669.69,"qtd":478.5,"margem":5783.53,"margem_pct":54.2,"acum":28.3,"classe":"A"},{"cod":"001775","nome":"CABO FLEXIVEL NAX 10,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":10339.78,"qtd":658.0,"margem":4256.8,"margem_pct":41.2,"acum":28.8,"classe":"A"},{"cod":"001150","nome":"CABO FLEXIVEL 06,00 MM AMARELO","cat":"Cabos flexíveis","rec":10313.25,"qtd":1358.0,"margem":4314.53,"margem_pct":41.8,"acum":29.2,"classe":"A"},{"cod":"000603","nome":"FITA ISOLANTE 18MMX20MT IMPERIAL 3M","cat":"Materiais diversos","rec":10258.51,"qtd":902.0,"margem":4592.35,"margem_pct":44.8,"acum":29.7,"classe":"A"},{"cod":"002931","nome":"CABO QUADRUPLEX 3X1X120+70 MM2","cat":"Cabos","rec":10177.84,"qtd":97.0,"margem":4339.41,"margem_pct":42.6,"acum":30.2,"classe":"A"},{"cod":"001477","nome":"MODULO TOMADA 2P+T 20A BRANCA TRAMONTINA LIZ","cat":"Tomadas/Interruptores","rec":9741.72,"qtd":1227.0,"margem":4075.09,"margem_pct":41.8,"acum":30.6,"classe":"A"},{"cod":"000256","nome":"CABO FLEXIVEL 01,50 MM VERMELHO","cat":"Cabos flexíveis","rec":9659.22,"qtd":4475.0,"margem":4111.63,"margem_pct":42.6,"acum":31.1,"classe":"A"},{"cod":"001172","nome":"CABO FLEXIVEL NAX 25,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":9403.2,"qtd":240.0,"margem":5334.9,"margem_pct":56.7,"acum":31.5,"classe":"A"},{"cod":"001147","nome":"CABO FLEXIVEL 02,50 MM BRANCO","cat":"Cabos flexíveis","rec":9309.02,"qtd":2744.1,"margem":4025.89,"margem_pct":43.2,"acum":31.9,"classe":"A"},{"cod":"001179","nome":"CABO PP 2X1,50MM 1KV","cat":"Cabos","rec":9271.7,"qtd":1608.0,"margem":3855.68,"margem_pct":41.6,"acum":32.3,"classe":"A"},{"cod":"001174","nome":"CABO FLEXIVEL NAX 35,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":9185.43,"qtd":179.0,"margem":3944.27,"margem_pct":42.9,"acum":32.8,"classe":"A"},{"cod":"000265","nome":"CABO FLEXIVEL 04,00 MM VERDE","cat":"Cabos flexíveis","rec":9161.1,"qtd":1793.3,"margem":4422.03,"margem_pct":48.3,"acum":33.2,"classe":"A"},{"cod":"001190","nome":"CABO PP 3X4,0MM 1KV","cat":"Cabos","rec":9030.48,"qtd":460.0,"margem":3757.91,"margem_pct":41.6,"acum":33.6,"classe":"A"},{"cod":"000253","nome":"CABO FLEXIVEL 01,50 MM PRETO","cat":"Cabos flexíveis","rec":9009.83,"qtd":4257.5,"margem":3906.05,"margem_pct":43.4,"acum":34.0,"classe":"A"},{"cod":"001413","nome":"CABO FLEXIVEL NAX 120,00 MM 1KV AZUL","cat":"Cabos flexíveis","rec":8947.88,"qtd":64.0,"margem":3958.67,"margem_pct":44.2,"acum":34.4,"classe":"A"},{"cod":"000255","nome":"CABO FLEXIVEL 01,50 MM AZUL","cat":"Cabos flexíveis","rec":8887.09,"qtd":4115.5,"margem":3856.71,"margem_pct":43.4,"acum":34.8,"classe":"A"},{"cod":"001782","nome":"CABO TRIPLEX 2X1X16+16 MM2","cat":"Cabos","rec":8884.19,"qtd":963.0,"margem":3349.92,"margem_pct":37.7,"acum":35.3,"classe":"A"},{"cod":"001528","nome":"TRANSFORMADOR BI.5000VA110X220X110","cat":"Transformadores","rec":8749.44,"qtd":32.0,"margem":3611.77,"margem_pct":41.3,"acum":35.7,"classe":"A"},{"cod":"001170","nome":"CABO FLEXIVEL NAX 16,00 MM 1KV AZUL","cat":"Cabos flexíveis","rec":8705.04,"qtd":403.1,"margem":3592.69,"margem_pct":41.3,"acum":36.1,"classe":"A"},{"cod":"000276","nome":"CABO FLEXIVEL 16,00 MM 750V VERMELHO","cat":"Cabos flexíveis","rec":8607.51,"qtd":364.0,"margem":3950.52,"margem_pct":45.9,"acum":36.5,"classe":"A"},{"cod":"002526","nome":"CABO REDE CAT6E AZUL SOHO PLUS","cat":"Cabos","rec":8509.26,"qtd":994.0,"margem":5143.33,"margem_pct":60.4,"acum":36.8,"classe":"A"},{"cod":"001594","nome":"TAMPAO CEMIG ARTICULADO 57X48 ZB","cat":"Materiais diversos","rec":8429.53,"qtd":10.0,"margem":6433.11,"margem_pct":76.3,"acum":37.2,"classe":"A"},{"cod":"001148","nome":"CABO FLEXIVEL 04,00 MM AMARELO","cat":"Cabos flexíveis","rec":8152.5,"qtd":1640.0,"margem":3652.02,"margem_pct":44.8,"acum":37.6,"classe":"A"},{"cod":"001386","nome":"TUBO CIRCULAR 127X4,00X7000MM GALV PA6","cat":"Materiais diversos","rec":8124.94,"qtd":4.0,"margem":3222.62,"margem_pct":39.7,"acum":38.0,"classe":"A"},{"cod":"001146","nome":"CABO FLEXIVEL 01,50 MM AMARELO","cat":"Cabos flexíveis","rec":7983.37,"qtd":3818.5,"margem":3543.38,"margem_pct":44.4,"acum":38.3,"classe":"A"},{"cod":"001151","nome":"CABO FLEXIVEL 06,00 MM BRANCO","cat":"Cabos flexíveis","rec":7717.98,"qtd":993.0,"margem":3220.46,"margem_pct":41.7,"acum":38.7,"classe":"A"},{"cod":"001162","nome":"CABO FLEXIVEL NAX 95,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":7438.08,"qtd":65.4,"margem":3175.78,"margem_pct":42.7,"acum":39.0,"classe":"A"},{"cod":"001663","nome":"PERFILADO PERFURADO 38X38 6METROS #22","cat":"Eletrocalhas/Condutos","rec":7416.46,"qtd":90.0,"margem":3845.76,"margem_pct":51.9,"acum":39.4,"classe":"A"},{"cod":"001177","nome":"CABO FLEXIVEL NAX 50,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":7300.24,"qtd":111.5,"margem":3006.16,"margem_pct":41.2,"acum":39.7,"classe":"A"},{"cod":"001211","nome":"TOMADA 2X4 2P+T 20A TRAMONTINA LIZ","cat":"Tomadas/Interruptores","rec":7267.17,"qtd":613.0,"margem":2995.88,"margem_pct":41.2,"acum":40.1,"classe":"A"},{"cod":"001614","nome":"CHAVE SECCIONADORA ROTATIVA C/ B. FUSÍVEL 63","cat":"Proteção","rec":7250.0,"qtd":1.0,"margem":7250.0,"margem_pct":100.0,"acum":40.4,"classe":"A"}],"top_margem":[{"cod":"000259","nome":"CABO FLEXIVEL 02,50 MM PRETO","cat":"Cabos flexíveis","rec":50402.78,"qtd":14988.0,"margem":21496.76,"margem_pct":42.6,"acum":2.3,"classe":"A"},{"cod":"000261","nome":"CABO FLEXIVEL 02,50 MM AZUL","cat":"Cabos flexíveis","rec":48683.4,"qtd":14377.5,"margem":20357.33,"margem_pct":41.8,"acum":4.6,"classe":"A"},{"cod":"001412","nome":"CABO FLEXIVEL NAX 120,00 MM 1KV PRETO","cat":"Cabos flexíveis","rec":37384.33,"qtd":267.5,"margem":16553.03,"margem_pct":44.3,"acum":6.3,"classe":"A"},{"cod":"000275","nome":"CABO FLEXIVEL 16,00 MM 750V PRETO","cat":"Cabos flexíveis","rec":31224.31,"qtd":1524.5,"margem":14726.12,"margem_pct":47.2,"acum":7.7,"classe":"A"},{"cod":"000260","nome":"CABO FLEXIVEL 02,50 MM VERDE","cat":"Cabos flexíveis","rec":31171.64,"qtd":9589.5,"margem":13118.81,"margem_pct":42.1,"acum":9.1,"classe":"A"},{"cod":"000269","nome":"CABO FLEXIVEL 06,00 MM AZUL","cat":"Cabos flexíveis","rec":26599.6,"qtd":3439.5,"margem":11904.66,"margem_pct":44.8,"acum":11.7,"classe":"A"},{"cod":"000267","nome":"CABO FLEXIVEL 06,00 MM PRETO","cat":"Cabos flexíveis","rec":28067.0,"qtd":3534.0,"margem":11789.49,"margem_pct":42.0,"acum":10.4,"classe":"A"},{"cod":"000263","nome":"CABO FLEXIVEL 02,50 MM VERMELHO","cat":"Cabos flexíveis","rec":23704.61,"qtd":6929.0,"margem":9950.73,"margem_pct":42.0,"acum":12.8,"classe":"A"},{"cod":"000277","nome":"CABO FLEXIVEL 16,00 MM 750V AZUL","cat":"Cabos flexíveis","rec":19509.59,"qtd":934.0,"margem":9242.37,"margem_pct":47.4,"acum":17.7,"classe":"A"},{"cod":"000477","nome":"PADRAO PRE- FABRICADO BIFASICO CONTRA 63A 7M","cat":"Padrão de entrada","rec":22301.04,"qtd":12.0,"margem":9183.69,"margem_pct":41.2,"acum":14.8,"classe":"A"},{"cod":"000266","nome":"CABO FLEXIVEL 04,00 MM PRETO","cat":"Cabos flexíveis","rec":21528.07,"qtd":4124.0,"margem":9172.1,"margem_pct":42.6,"acum":15.8,"classe":"A"},{"cod":"000264","nome":"CABO FLEXIVEL 04,00 MM AZUL","cat":"Cabos flexíveis","rec":22380.73,"qtd":4134.0,"margem":8939.82,"margem_pct":39.9,"acum":13.8,"classe":"A"},{"cod":"000476","nome":"PADRAO PRE- FABRICADO BIFASICO FAVOR 63A 5MT","cat":"Padrão de entrada","rec":21113.22,"qtd":16.0,"margem":8699.72,"margem_pct":41.2,"acum":16.8,"classe":"A"},{"cod":"001152","nome":"CABO FLEXIVEL 06,00 MM VERMELHO","cat":"Cabos flexíveis","rec":19282.7,"qtd":2496.3,"margem":8645.87,"margem_pct":44.8,"acum":18.6,"classe":"A"},{"cod":"001158","nome":"CABO FLEXIVEL 35,00 MM 750V PRETO","cat":"Cabos flexíveis","rec":18050.83,"qtd":413.5,"margem":7648.7,"margem_pct":42.4,"acum":19.4,"classe":"A"}],"abc":[{"classe":"A","nprod":400,"rec":1738250.44,"pct":80.0},{"classe":"B","nprod":635,"rec":326937.84,"pct":15.0},{"classe":"C","nprod":1232,"rec":108815.02,"pct":5.0}],"categorias":[{"cat":"Cabos flexíveis","rec":735364.43,"margem":322193.7,"margem_pct":43.8,"nprod":73,"pct":33.8},{"cat":"Outros","rec":404238.07,"margem":196301.66,"margem_pct":48.6,"nprod":1163,"pct":18.6},{"cat":"Iluminação","rec":171802.04,"margem":81625.01,"margem_pct":47.5,"nprod":201,"pct":7.9},{"cat":"Eletrocalhas/Condutos","rec":160952.61,"margem":76465.99,"margem_pct":47.5,"nprod":171,"pct":7.4},{"cat":"Cabos","rec":147295.46,"margem":66966.13,"margem_pct":45.5,"nprod":106,"pct":6.8},{"cat":"Disjuntores","rec":111435.48,"margem":55644.26,"margem_pct":49.9,"nprod":168,"pct":5.1},{"cat":"Tomadas/Interruptores","rec":108442.01,"margem":46231.59,"margem_pct":42.6,"nprod":120,"pct":5.0},{"cat":"Conectores","rec":72742.93,"margem":34028.9,"margem_pct":46.8,"nprod":71,"pct":3.3},{"cat":"Materiais diversos","rec":69575.78,"margem":34715.76,"margem_pct":49.9,"nprod":47,"pct":3.2},{"cat":"Padrão de entrada","rec":65519.97,"margem":27053.32,"margem_pct":41.3,"nprod":18,"pct":3.0},{"cat":"Fios","rec":48524.88,"margem":21255.69,"margem_pct":43.8,"nprod":44,"pct":2.2},{"cat":"Proteção","rec":35088.22,"margem":20852.45,"margem_pct":59.4,"nprod":67,"pct":1.6},{"cat":"Aterramento","rec":13562.48,"margem":5986.67,"margem_pct":44.1,"nprod":9,"pct":0.6},{"cat":"CFTV/Segurança","rec":13468.93,"margem":6624.45,"margem_pct":49.2,"nprod":4,"pct":0.6},{"cat":"Transformadores","rec":10302.03,"margem":4360.4,"margem_pct":42.3,"nprod":4,"pct":0.5},{"cat":"Automação","rec":5687.98,"margem":5687.98,"margem_pct":100.0,"nprod":1,"pct":0.3}],"total":2174003.3},"sazonalidade":{"heat":[{"d":0,"dia":"seg","h":7,"n":406},{"d":0,"dia":"seg","h":8,"n":261},{"d":0,"dia":"seg","h":9,"n":320},{"d":0,"dia":"seg","h":10,"n":295},{"d":0,"dia":"seg","h":11,"n":111},{"d":0,"dia":"seg","h":12,"n":287},{"d":0,"dia":"seg","h":13,"n":184},{"d":0,"dia":"seg","h":14,"n":254},{"d":0,"dia":"seg","h":15,"n":236},{"d":0,"dia":"seg","h":16,"n":267},{"d":0,"dia":"seg","h":17,"n":28},{"d":0,"dia":"seg","h":18,"n":4},{"d":1,"dia":"ter","h":7,"n":356},{"d":1,"dia":"ter","h":8,"n":258},{"d":1,"dia":"ter","h":9,"n":305},{"d":1,"dia":"ter","h":10,"n":253},{"d":1,"dia":"ter","h":11,"n":121},{"d":1,"dia":"ter","h":12,"n":242},{"d":1,"dia":"ter","h":13,"n":208},{"d":1,"dia":"ter","h":14,"n":230},{"d":1,"dia":"ter","h":15,"n":242},{"d":1,"dia":"ter","h":16,"n":277},{"d":1,"dia":"ter","h":17,"n":51},{"d":1,"dia":"ter","h":18,"n":3},{"d":2,"dia":"qua","h":7,"n":388},{"d":2,"dia":"qua","h":8,"n":258},{"d":2,"dia":"qua","h":9,"n":324},{"d":2,"dia":"qua","h":10,"n":262},{"d":2,"dia":"qua","h":11,"n":193},{"d":2,"dia":"qua","h":12,"n":246},{"d":2,"dia":"qua","h":13,"n":199},{"d":2,"dia":"qua","h":14,"n":231},{"d":2,"dia":"qua","h":15,"n":310},{"d":2,"dia":"qua","h":16,"n":266},{"d":2,"dia":"qua","h":17,"n":42},{"d":2,"dia":"qua","h":18,"n":6},{"d":3,"dia":"qui","h":7,"n":320},{"d":3,"dia":"qui","h":8,"n":295},{"d":3,"dia":"qui","h":9,"n":279},{"d":3,"dia":"qui","h":10,"n":230},{"d":3,"dia":"qui","h":11,"n":162},{"d":3,"dia":"qui","h":12,"n":205},{"d":3,"dia":"qui","h":13,"n":189},{"d":3,"dia":"qui","h":14,"n":236},{"d":3,"dia":"qui","h":15,"n":222},{"d":3,"dia":"qui","h":16,"n":256},{"d":3,"dia":"qui","h":17,"n":42},{"d":3,"dia":"qui","h":18,"n":0},{"d":4,"dia":"sex","h":7,"n":551},{"d":4,"dia":"sex","h":8,"n":290},{"d":4,"dia":"sex","h":9,"n":280},{"d":4,"dia":"sex","h":10,"n":337},{"d":4,"dia":"sex","h":11,"n":86},{"d":4,"dia":"sex","h":12,"n":289},{"d":4,"dia":"sex","h":13,"n":251},{"d":4,"dia":"sex","h":14,"n":216},{"d":4,"dia":"sex","h":15,"n":258},{"d":4,"dia":"sex","h":16,"n":85},{"d":4,"dia":"sex","h":17,"n":16},{"d":4,"dia":"sex","h":18,"n":4},{"d":5,"dia":"sáb","h":7,"n":231},{"d":5,"dia":"sáb","h":8,"n":265},{"d":5,"dia":"sáb","h":9,"n":298},{"d":5,"dia":"sáb","h":10,"n":361},{"d":5,"dia":"sáb","h":11,"n":306},{"d":5,"dia":"sáb","h":12,"n":177},{"d":5,"dia":"sáb","h":13,"n":3},{"d":5,"dia":"sáb","h":14,"n":1},{"d":5,"dia":"sáb","h":15,"n":1},{"d":5,"dia":"sáb","h":16,"n":1},{"d":5,"dia":"sáb","h":17,"n":0},{"d":5,"dia":"sáb","h":18,"n":0},{"d":6,"dia":"dom","h":7,"n":630},{"d":6,"dia":"dom","h":8,"n":27},{"d":6,"dia":"dom","h":9,"n":19},{"d":6,"dia":"dom","h":10,"n":16},{"d":6,"dia":"dom","h":11,"n":31},{"d":6,"dia":"dom","h":12,"n":6},{"d":6,"dia":"dom","h":13,"n":0},{"d":6,"dia":"dom","h":14,"n":0},{"d":6,"dia":"dom","h":15,"n":0},{"d":6,"dia":"dom","h":16,"n":0},{"d":6,"dia":"dom","h":17,"n":0},{"d":6,"dia":"dom","h":18,"n":0}],"maxh":630,"semana":[{"dia":"seg","n":2686,"rec":838572.34},{"dia":"ter","n":2569,"rec":682513.33},{"dia":"qua","n":2742,"rec":684258.33},{"dia":"qui","n":2468,"rec":592719.75},{"dia":"sex","n":2676,"rec":646989.01},{"dia":"sáb","n":1646,"rec":279380.37},{"dia":"dom","n":739,"rec":62239.25}],"diames":[{"dia":1,"n":477,"rec":128032.55},{"dia":2,"n":576,"rec":116512.34},{"dia":3,"n":503,"rec":113166.82},{"dia":4,"n":391,"rec":106578.88},{"dia":5,"n":501,"rec":161005.07},{"dia":6,"n":518,"rec":131342.37},{"dia":7,"n":431,"rec":97493.42},{"dia":8,"n":474,"rec":107517.55},{"dia":9,"n":564,"rec":145895.28},{"dia":10,"n":503,"rec":166528.26},{"dia":11,"n":507,"rec":136430.28},{"dia":12,"n":553,"rec":142314.28},{"dia":13,"n":570,"rec":114822.72},{"dia":14,"n":434,"rec":102446.36},{"dia":15,"n":517,"rec":106232.31},{"dia":16,"n":518,"rec":133578.24},{"dia":17,"n":488,"rec":151974.62},{"dia":18,"n":550,"rec":135357.9},{"dia":19,"n":556,"rec":123105.83},{"dia":20,"n":562,"rec":145335.49},{"dia":21,"n":416,"rec":93039.71},{"dia":22,"n":513,"rec":125087.03},{"dia":23,"n":574,"rec":151915.06},{"dia":24,"n":539,"rec":120493.28},{"dia":25,"n":481,"rec":92647.52},{"dia":26,"n":569,"rec":138064.28},{"dia":27,"n":558,"rec":139897.11},{"dia":28,"n":487,"rec":99382.21},{"dia":29,"n":478,"rec":101283.2},{"dia":30,"n":502,"rec":116873.37},{"dia":31,"n":216,"rec":42319.04}]},"caixa":{"aging":{"vencido":343820.78,"d0_30":486945.54,"d31_60":135986.52,"d61_90":85953.8,"d90":110440.63},"proj":[{"dias":30,"entra":486945.54,"sai":966630.42,"saldo":-479684.88},{"dias":60,"entra":622932.06,"sai":1652624.42,"saldo":-1029692.36},{"dias":90,"entra":708885.86,"sai":1952220.5,"saldo":-1243334.64}],"rec_aberto":1163147.27,"pag_aberto":2034645.5,"dso":22.7,"dpo":42.8,"ciclo":-20.1},"indicadores":{"top5_clientes_pct":39.9,"tend_mensal_pct":3.5,"guidance_trim":1373744.04,"guidance_meses":[444999.14,457914.68,470830.22],"score":59,"dso":22.7,"dpo":42.8,"ciclo":-20.1,"ebitda_proxy":1613056.15,"ebitda_margem":42.6,"score_comp":{"margem":90,"tendencia":57,"conc_vend":54,"conc_cli":83,"inadimplencia":1}}};

/* ============ helpers ============ */
const brl = (v) => "R$ " + (v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const brl0 = (v) => "R$ " + Math.round(v||0).toLocaleString("pt-BR");
const kbrl = (v) => {
  const a = Math.abs(v||0);
  if (a>=1e6) return "R$ "+(v/1e6).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"M";
  if (a>=1e3) return "R$ "+(v/1e3).toLocaleString("pt-BR",{maximumFractionDigits:0})+"k";
  return "R$ "+Math.round(v||0).toLocaleString("pt-BR");
};
const pct = (v) => (v>0?"+":"")+(v||0).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"%";
const intf = (v) => (v||0).toLocaleString("pt-BR");

const C = {
  bg:"#0A0A0B", panel:"#141416", panel2:"#1A1A1D", line:"#2A2A2E", border:"#26262A",
  orange:"#F65D00", orangeD:"#8A3200", green:"#22C55E", red:"#EF4444", amber:"#F59E0B",
  blue:"#38BDF8", txt:"#E8E8EA", txt2:"#9A9AA2", txt3:"#5E5E66",
};
const LOGO_SOLUGY = "data:image/png;base64,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";
const SEV = { "crit":{c:C.red,i:"●",l:"CRÍTICO"}, "warn":{c:C.amber,i:"●",l:"ATENÇÃO"}, "ok":{c:C.green,i:"●",l:"POSITIVO"} };

/* ============ MOTOR DE INSIGHTS ============ */
function motor() {
  const out = [];
  const k = D.kpi, cx = D.caixa, cl = D.clientes, pr = D.produtos, vd = D.vendedores, ind = D.indicadores;
  // CAIXA 30d
  const p30 = cx.proj.find(p=>p.dias===30);
  if (p30 && p30.saldo < 0)
    out.push({sev:"crit",cat:"Caixa",t:`Próximos 30 dias: ${kbrl(p30.entra)} a receber vs ${kbrl(p30.sai)} a pagar. Saldo projetado NEGATIVO de ${kbrl(p30.saldo)} — providencie capital de giro ou renegocie vencimentos com fornecedores agora.`});
  // CICLO
  if (cx.ciclo!==null && cx.ciclo < 0)
    out.push({sev:"ok",cat:"Caixa",t:`Ciclo de caixa de ${cx.ciclo} dias: você paga fornecedores em ${cx.dpo}d e recebe dos clientes em ${cx.dso}d. O fornecedor financia sua operação — vantagem real de capital de giro. Preserve esses prazos ao negociar.`});
  else if (cx.ciclo!==null && cx.ciclo > 0)
    out.push({sev:"warn",cat:"Caixa",t:`Ciclo de caixa de ${cx.ciclo} dias entre pagar o fornecedor e receber do cliente. Cada venda a prazo imobiliza capital de giro por ${cx.ciclo} dias.`});
  // INADIMPLÊNCIA
  const venc = cx.aging.vencido, inadPct = cx.rec_aberto? venc/cx.rec_aberto*100:0;
  if (inadPct > 20)
    out.push({sev:"warn",cat:"Caixa",t:`${kbrl(venc)} já estão vencidos — ${inadPct.toFixed(0)}% de tudo que você tem a receber. Dinheiro seu parado na mão de clientes. Acione cobrança dos maiores atrasos.`});
  // CHURN
  if (cl.churn_n > 0)
    out.push({sev:"warn",cat:"Clientes",t:`${cl.churn_n} clientes não compram há 90+ dias — ${kbrl(cl.churn_val)} de receita histórica em risco de churn. Ligue para os 3 maiores esta semana antes que migrem para o concorrente.`});
  // CONCENTRAÇÃO VENDEDOR
  const v0 = vd[0];
  if (v0 && v0.pct >= 35)
    out.push({sev:"warn",cat:"Vendedores",t:`${v0.nome} concentra ${v0.pct.toFixed(0)}% das vendas (${kbrl(v0.rec)}/ano). Se sair, leva a carteira junto. Documente os relacionamentos e distribua contas estratégicas.`});
  // TICKET vs VOLUME
  if (k.var.nvendas > 3 && k.var.ticket < -5)
    out.push({sev:"warn",cat:"Lucro",t:`No último mês você vendeu ${pct(k.var.nvendas)} em número de vendas, mas o ticket médio caiu ${pct(k.var.ticket)}. Está vendendo mais itens pequenos ou dando mais desconto — verifique o mix e a política de preço.`});
  // MARGEM + TENDÊNCIA
  if (k.margem_pct >= 40 && ind.tend_mensal_pct > 0)
    out.push({sev:"ok",cat:"Lucro",t:`Margem bruta de ${k.margem_pct}% com tendência de ${pct(ind.tend_mensal_pct)} ao mês. Cada R$100 vendidos viram R$${(k.margem_pct).toFixed(0)} de lucro bruto e o faturamento cresce. Mantenha o mix atual.`});
  // CATEGORIA CONCENTRADA
  const c0 = pr.categorias[0];
  if (c0 && c0.pct >= 25)
    out.push({sev:"warn",cat:"Produtos",t:`${c0.cat} = ${c0.pct.toFixed(0)}% da receita de produtos. Concentração alta: oscilação no preço do cobre/insumo dessa linha bate direto na sua margem. Acompanhe o custo de perto.`});
  // GUIDANCE
  if (ind.guidance_trim > 0)
    out.push({sev:"ok",cat:"Projeção",t:`Mantendo o ritmo, o próximo trimestre projeta ${kbrl(ind.guidance_trim)} de receita (média móvel + tendência). Use isso para planejar compras e capital de giro.`});
  const rank = {crit:0,warn:1,ok:2};
  out.sort((a,b)=>rank[a.sev]-rank[b.sev]);
  return out;
}

/* ============ UI ============ */
function KpiCard({label, value, sub, delta, deltaGood, big}) {
  const up = delta>0, col = deltaGood===undefined ? (up?C.green:C.red) : (deltaGood?C.green:C.red);
  return (
    <div className="ex-kpi">
      <div className="ex-kpi-lab">{label}</div>
      <div className="ex-kpi-val" style={{fontSize: big?26:20}}>{value}</div>
      <div className="ex-kpi-foot">
        {sub && <span className="ex-kpi-sub">{sub}</span>}
        {delta!==undefined && delta!==null && (
          <span className="ex-kpi-delta" style={{color:col}}>{up?"▲":"▼"} {pct(delta).replace("+","")}</span>
        )}
      </div>
    </div>
  );
}
function Panel({title, sub, right, children, flag}) {
  return (
    <div className="ex-panel">
      {(title||right) && <div className="ex-panel-head">
        <div><div className="ex-panel-title">{title}</div>{sub && <div className="ex-panel-sub">{sub}</div>}</div>
        {right}
      </div>}
      {flag ? <div className="ex-flag">{flag}</div> : children}
    </div>
  );
}
function Insight({sev, cat, t, compact}) {
  const s = SEV[sev];
  return (
    <div className="ex-ins" style={{borderLeftColor:s.c, background:compact?"transparent":undefined}}>
      <div className="ex-ins-top">
        <span style={{color:s.c,fontSize:9}}>{s.i}</span>
        <span className="ex-ins-cat">{cat}</span>
        <span className="ex-ins-sev" style={{color:s.c}}>{s.l}</span>
      </div>
      <div className="ex-ins-txt">{t}</div>
    </div>
  );
}
const CTip = ({active,payload,label,fmt}) => {
  if(!active||!payload||!payload.length) return null;
  return (<div className="ex-tip"><div className="ex-tip-lab">{label}</div>
    {payload.map((p,i)=>(<div key={i} className="ex-tip-row"><span style={{color:p.color||p.fill}}>{p.name}</span><b>{fmt?fmt(p.value):p.value}</b></div>))}
  </div>);
};

/* ============ ABAS ============ */

/* ---- 1. EXECUTIVA ---- */
function TabExec({win}) {
  const k = D.kpi;
  const serie = D.serie.filter(s=>win.includes(s.k));
  const rec = serie.reduce((a,s)=>a+s.rec,0);
  const cus = serie.reduce((a,s)=>a+s.cus,0);
  const nv = serie.reduce((a,s)=>a+s.n,0);
  const mg = rec-cus, mpct = rec? mg/rec*100:0, ticket = nv? rec/nv:0;
  const ins = motor().slice(0,5);
  const wf = [
    {n:"Receita Bruta", v:rec, t:rec, base:0, fill:C.orange},
    {n:"(-) CMV", v:-cus, t:rec, base:mg, fill:C.red},
    {n:"Lucro Bruto", v:mg, t:mg, base:0, fill:C.green},
  ];
  return (
    <>
      <Panel title="Análises Estratégicas" sub="leituras automáticas sobre os seus números — priorizadas por severidade">
        <div className="ex-ins-wrap">{ins.map((x,i)=><Insight key={i} {...x}/>)}</div>
      </Panel>
      <div className="ex-kpi-grid">
        <KpiCard label="RECEITA BRUTA" value={kbrl(rec)} sub={intf(nv)+" vendas"} delta={k.var.receita} big/>
        <KpiCard label="LUCRO BRUTO" value={kbrl(mg)} sub={mpct.toFixed(1)+"% margem"} delta={k.var.margem_pct} deltaGood={k.var.margem_pct>=0} big/>
        <KpiCard label="MARGEM BRUTA" value={mpct.toFixed(1)+"%"} sub="receita − CMV" delta={k.var.margem_pct} deltaGood={k.var.margem_pct>=0}/>
        <KpiCard label="TICKET MÉDIO" value={brl0(ticket)} sub="por venda" delta={k.var.ticket}/>
        <KpiCard label="Nº DE VENDAS" value={intf(nv)} sub="no período" delta={k.var.nvendas}/>
        <KpiCard label="CMV" value={kbrl(cus)} sub={(100-mpct).toFixed(1)+"% da receita"}/>
        <KpiCard label="EBITDA (aprox.)" value={kbrl(D.indicadores.ebitda_proxy)} sub="≈ lucro bruto*"/>
        <KpiCard label="SCORE DE SAÚDE" value={D.indicadores.score+"/100"} sub="ver aba Indicadores"/>
      </div>
      <div className="ex-row2">
        <Panel title="Receita & margem por mês" sub="barras: receita · linha: margem %">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={serie} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false}/>
              <XAxis dataKey="k" tick={{fill:C.txt3,fontSize:10}} axisLine={{stroke:C.line}} tickLine={false}/>
              <YAxis yAxisId="l" tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={kbrl} width={54}/>
              <YAxis yAxisId="r" orientation="right" domain={[0,60]} tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} width={34}/>
              <Tooltip content={<CTip fmt={kbrl}/>}/>
              <Bar yAxisId="l" dataKey="rec" name="Receita" fill={C.orange} radius={[3,3,0,0]} maxBarSize={30}/>
              <Line yAxisId="r" dataKey="margem_pct" name="Margem %" stroke={C.green} strokeWidth={2} dot={{r:2,fill:C.green}}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Composição do resultado" sub="de onde vem o lucro bruto (sem impostos/opex*)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={wf} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false}/>
              <XAxis dataKey="n" tick={{fill:C.txt2,fontSize:10}} axisLine={{stroke:C.line}} tickLine={false}/>
              <YAxis tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={kbrl} width={54}/>
              <Tooltip content={<CTip fmt={kbrl}/>}/>
              <Bar dataKey="base" stackId="a" fill="transparent"/>
              <Bar dataKey="v" stackId="a" radius={[3,3,0,0]} maxBarSize={70}>
                {wf.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div className="ex-note">* O LJ não separa impostos nem despesas operacionais; trabalhamos com receita e margem bruta (lucro bruto). "Lucro líquido", ROE e ROIC exigem dados de despesas, patrimônio e dívida — não disponíveis na base atual.</div>
    </>
  );
}

/* ---- 2. INDICADORES ---- */
function TabInd() {
  const ind = D.indicadores, k = D.kpi, cx = D.caixa;
  const comp = ind.score_comp;
  const compData = [
    {n:"Margem", v:comp.margem}, {n:"Crescimento", v:comp.tendencia},
    {n:"Conc. vendedor", v:comp.conc_vend}, {n:"Conc. cliente", v:comp.conc_cli},
    {n:"Inadimplência", v:comp.inadimplencia},
  ];
  const scoreCol = ind.score>=70?C.green:ind.score>=45?C.amber:C.red;
  const gd = ind.guidance_meses.map((v,i)=>({n:"M+"+(i+1), v}));
  return (
    <>
      <div className="ex-ind-top">
        <Panel title="Score de saúde do negócio" sub="0–100 · combina margem, crescimento, concentração e inadimplência">
          <div className="ex-score">
            <div className="ex-score-num" style={{color:scoreCol}}>{ind.score}<span>/100</span></div>
            <div className="ex-score-bar-wrap">
              {compData.map((c,i)=>(
                <div key={i} className="ex-score-comp">
                  <span className="ex-score-comp-lab">{c.n}</span>
                  <div className="ex-score-track"><div className="ex-score-fill" style={{width:c.v+"%",background:c.v>=70?C.green:c.v>=45?C.amber:C.red}}/></div>
                  <span className="ex-score-comp-v">{c.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Projeção de receita" sub="guidance próximo trimestre · média móvel + tendência">
          <div className="ex-guide-big">{kbrl(ind.guidance_trim)}</div>
          <div className="ex-guide-sub">próximos 3 meses · tendência {pct(ind.tend_mensal_pct)}/mês</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={gd} margin={{top:6,right:6,left:0,bottom:0}}>
              <XAxis dataKey="n" tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTip fmt={kbrl}/>}/>
              <Bar dataKey="v" name="Projeção" fill={C.orangeD} radius={[3,3,0,0]} maxBarSize={40}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div className="ex-ind-grid">
        <IndCard t="Margem bruta" v={k.margem_pct+"%"} d="Quanto sobra de cada venda após o custo da mercadoria. Acima de 35% é saudável no varejo elétrico." good/>
        <IndCard t="EBITDA (aprox.)" v={kbrl(ind.ebitda_proxy)} d="Aproximação = lucro bruto. Real exigiria descontar despesas operacionais e depreciação, que a base não tem."/>
        <IndCard t="Margem EBITDA" v={ind.ebitda_margem+"%"} d="EBITDA aproximado sobre a receita. Interprete como teto — o valor real é menor após opex."/>
        <IndCard t="Tendência mensal" v={pct(ind.tend_mensal_pct)} d="Crescimento médio da receita por mês (regressão sobre meses cheios). Substitui o CAGR com 12 meses de base." good={ind.tend_mensal_pct>0}/>
        <IndCard t="Concentração top 5 clientes" v={ind.top5_clientes_pct+"%"} d="Quanto os 5 maiores representam da receita. Inclui o balcão (consumidor final); a base é bem pulverizada."/>
        <IndCard t="Prazo de recebimento (DSO)" v={(cx.dso||0)+" dias"} d="Tempo médio entre emitir e receber. Quanto menor, mais rápido o dinheiro entra."/>
        <IndCard t="Prazo de pagamento (DPO)" v={(cx.dpo||0)+" dias"} d="Tempo médio que você leva para pagar fornecedores. Maior que o DSO é bom: eles financiam você." good={cx.dpo>cx.dso}/>
        <IndCard t="Ciclo de caixa" v={(cx.ciclo)+" dias"} d="DSO − DPO. Negativo significa que você recebe antes de pagar — capital de giro a seu favor." good={cx.ciclo<0}/>
      </div>
      <div className="ex-disabled-grid">
        <Disabled t="ROE / ROIC" why="Exigem patrimônio líquido e capital investido — não registrados no LJ."/>
        <Disabled t="Dívida / EBITDA" why="Não há cadastro de dívidas/empréstimos na base atual."/>
        <Disabled t="Giro de estoque / DIO" why="O snapshot de produtos veio com saldo zerado — sem estoque não há giro."/>
      </div>
    </>
  );
}
function IndCard({t,v,d,good}) {
  return (<div className="ex-indcard">
    <div className="ex-indcard-t">{t}<span className="ex-tipdot" title={d}>?</span></div>
    <div className="ex-indcard-v" style={{color: good===undefined?C.txt:(good?C.green:C.amber)}}>{v}</div>
    <div className="ex-indcard-d">{d}</div>
  </div>);
}
function Disabled({t,why}) {
  return (<div className="ex-disabled"><div className="ex-disabled-t">{t}</div><div className="ex-disabled-tag">dados não carregados</div><div className="ex-disabled-why">{why}</div></div>);
}

/* ---- 3. CLIENTES ---- */
function TabCli() {
  const cl = D.clientes;
  const ins = motor().filter(x=>x.cat==="Clientes");
  const porRec = cl.lista.slice(0,12);
  const porMg = [...cl.lista].sort((a,b)=>b.margem-a.margem).slice(0,12);
  const recData = [
    {n:"0–30d", v:cl.recbk["0-30"], c:C.green}, {n:"31–60d", v:cl.recbk["31-60"], c:C.amber},
    {n:"61–90d", v:cl.recbk["61-90"], c:C.orange}, {n:"90+ d", v:cl.recbk["90+"], c:C.red},
  ];
  return (
    <>
      {ins.length>0 && <Panel title="Leitura de clientes"><div className="ex-ins-wrap">{ins.map((x,i)=><Insight key={i} {...x}/>)}</div></Panel>}
      <div className="ex-note2">Receita por cliente vem das vendas identificadas (inclui balcão como "Consumidor Final", {kbrl(cl.total - cl.total_nom)}). {cl.n_nomeados} clientes nomeados somam {kbrl(cl.total_nom)}.</div>
      <div className="ex-row2">
        <Panel title="Top clientes por RECEITA" sub="quem mais fatura">
          <RankTable rows={porRec} val="rec" val2="margem_pct" cols={["Cliente","Receita","Margem"]}/>
        </Panel>
        <Panel title="Top clientes por MARGEM R$" sub="quem mais dá lucro — nem sempre é o mesmo">
          <RankTable rows={porMg} val="margem" val2="margem_pct" cols={["Cliente","Margem R$","Margem"]}/>
        </Panel>
      </div>
      <div className="ex-row2">
        <Panel title="Recência — risco de churn" sub="receita por tempo desde a última compra (clientes nomeados)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={recData} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false}/>
              <XAxis dataKey="n" tick={{fill:C.txt2,fontSize:10}} axisLine={{stroke:C.line}} tickLine={false}/>
              <YAxis tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={kbrl} width={50}/>
              <Tooltip content={<CTip fmt={kbrl}/>}/>
              <Bar dataKey="v" name="Receita" radius={[3,3,0,0]} maxBarSize={54}>{recData.map((e,i)=><Cell key={i} fill={e.c}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title={"Sumidos há 90+ dias · "+kbrl(cl.churn_val)} sub={cl.churn_n+" clientes em risco — priorize os maiores"}>
          <div className="ex-scroll">
            <table className="ex-table"><thead><tr><th>Cliente</th><th className="r">Receita hist.</th><th className="r">Dias</th></tr></thead>
            <tbody>{cl.churn.map((c,i)=>(<tr key={i}><td>{c.nome}</td><td className="r">{kbrl(c.rec)}</td><td className="r" style={{color:C.red}}>{c.recencia}</td></tr>))}</tbody></table>
          </div>
        </Panel>
      </div>
    </>
  );
}
function RankTable({rows, val, val2, cols}) {
  const max = Math.max(...rows.map(r=>Math.abs(r[val])||0),1);
  return (<div className="ex-scroll"><table className="ex-table">
    <thead><tr><th>{cols[0]}</th><th className="r">{cols[1]}</th><th className="r">{cols[2]}</th></tr></thead>
    <tbody>{rows.map((r,i)=>(<tr key={i}>
      <td><div className="ex-bar-cell"><div className="ex-bar-bg" style={{width:(Math.abs(r[val])/max*100)+"%"}}/><span>{r.nome}</span></div></td>
      <td className="r">{kbrl(r[val])}</td>
      <td className="r" style={{color:r[val2]>=40?C.green:r[val2]>=25?C.amber:C.red}}>{(r[val2]||0).toFixed(0)}%</td>
    </tr>))}</tbody></table></div>);
}

/* ---- 4. PRODUTOS ---- */
function TabProd() {
  const pr = D.produtos;
  const ins = motor().filter(x=>x.cat==="Produtos");
  const topRec = pr.lista.slice(0,12);
  const bcg = pr.lista.slice(0,40).map(p=>({x:p.rec, y:p.margem_pct, z:p.qtd, nome:p.nome}));
  return (
    <>
      {ins.length>0 && <Panel title="Leitura de produtos"><div className="ex-ins-wrap">{ins.map((x,i)=><Insight key={i} {...x}/>)}</div></Panel>}
      <div className="ex-row2">
        <Panel title="Top produtos por RECEITA">
          <RankTable rows={topRec} val="rec" val2="margem_pct" cols={["Produto","Receita","Margem"]}/>
        </Panel>
        <Panel title="Top produtos por MARGEM R$" sub="maior lucro absoluto">
          <RankTable rows={pr.top_margem} val="margem" val2="margem_pct" cols={["Produto","Margem R$","Margem"]}/>
        </Panel>
      </div>
      <div className="ex-row2">
        <Panel title="Curva ABC de produtos" sub={pr.abc.map(a=>`${a.classe}: ${a.nprod} itens = ${a.pct.toFixed(0)}%`).join(" · ")}>
          <div className="ex-abc">{pr.abc.map((a,i)=>(
            <div key={i} className="ex-abc-row">
              <span className="ex-abc-cls" style={{background:a.classe==="A"?C.orange:a.classe==="B"?C.amber:C.txt3}}>{a.classe}</span>
              <div className="ex-abc-track"><div className="ex-abc-fill" style={{width:a.pct+"%",background:a.classe==="A"?C.orange:a.classe==="B"?C.amber:C.txt3}}/></div>
              <span className="ex-abc-v">{a.nprod} itens · {kbrl(a.rec)}</span>
            </div>))}</div>
          <div className="ex-cat">
            <div className="ex-cat-h">Receita por categoria</div>
            {pr.categorias.slice(0,7).map((c,i)=>(<div key={i} className="ex-cat-row">
              <span className="ex-cat-n">{c.cat}</span>
              <div className="ex-cat-track"><div className="ex-cat-fill" style={{width:c.pct+"%"}}/></div>
              <span className="ex-cat-v">{c.pct.toFixed(0)}% · {c.margem_pct.toFixed(0)}% mg</span>
            </div>))}
          </div>
        </Panel>
        <Panel title="Matriz volume × margem" sub="cada ponto é um produto · alto e à direita = ideal (gira e dá lucro)">
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{top:10,right:12,left:0,bottom:4}}>
              <CartesianGrid stroke={C.line} strokeDasharray="2 4"/>
              <XAxis type="number" dataKey="x" name="Receita" tick={{fill:C.txt3,fontSize:9}} axisLine={{stroke:C.line}} tickLine={false} tickFormatter={kbrl}/>
              <YAxis type="number" dataKey="y" name="Margem %" tick={{fill:C.txt3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} width={34}/>
              <ZAxis type="number" dataKey="z" range={[30,300]}/>
              <ReferenceLine y={42.6} stroke={C.txt3} strokeDasharray="3 3"/>
              <Tooltip content={({active,payload})=>{ if(!active||!payload||!payload.length)return null; const p=payload[0].payload; return (<div className="ex-tip"><div className="ex-tip-lab">{p.nome}</div><div className="ex-tip-row"><span>Receita</span><b>{kbrl(p.x)}</b></div><div className="ex-tip-row"><span>Margem</span><b>{p.y}%</b></div></div>);}}/>
              <Scatter data={bcg} fill={C.orange} fillOpacity={0.55}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div className="ex-disabled-grid">
        <Disabled t="Estoque crítico / encalhado" why="Saldo de estoque veio zerado no snapshot do LJ — sem saldo não dá para calcular cobertura nem capital parado."/>
        <Disabled t="Giro de estoque por categoria" why="Depende do saldo físico, indisponível na base atual."/>
      </div>
    </>
  );
}

/* ---- 5. VENDEDORES & SAZONALIDADE ---- */
function TabVend() {
  const vd = D.vendedores, sz = D.sazonalidade;
  const ins = motor().filter(x=>x.cat==="Vendedores");
  const maxRec = Math.max(...vd.map(v=>v.rec),1);
  const maxH = sz.maxh||1;
  const horas = [...new Set(sz.heat.map(h=>h.h))].sort((a,b)=>a-b);
  const dias = ["seg","ter","qua","qui","sex","sáb","dom"];
  const cell = (d,h) => sz.heat.find(x=>x.d===d && x.h===h);
  const heatCol = (n) => { if(!n) return C.panel2; const t=n/maxH; return `rgba(249,115,22,${0.12+t*0.85})`; };
  return (
    <>
      {ins.length>0 && <Panel title="Leitura de vendedores"><div className="ex-ins-wrap">{ins.map((x,i)=><Insight key={i} {...x}/>)}</div></Panel>}
      <Panel title="Ranking de vendedores" sub="receita, margem gerada, ticket e nº de vendas">
        <div className="ex-scroll"><table className="ex-table">
          <thead><tr><th>Vendedor</th><th className="r">Receita</th><th className="r">% total</th><th className="r">Margem R$</th><th className="r">Margem %</th><th className="r">Ticket</th><th className="r">Vendas</th></tr></thead>
          <tbody>{vd.map((v,i)=>(<tr key={i}>
            <td><div className="ex-bar-cell"><div className="ex-bar-bg" style={{width:(v.rec/maxRec*100)+"%"}}/><span>{v.nome}</span></div></td>
            <td className="r">{kbrl(v.rec)}</td><td className="r">{v.pct.toFixed(1)}%</td>
            <td className="r">{kbrl(v.margem)}</td>
            <td className="r" style={{color:v.margem_pct>=40?C.green:C.amber}}>{v.margem_pct.toFixed(0)}%</td>
            <td className="r">{brl0(v.ticket)}</td><td className="r">{intf(v.n)}</td>
          </tr>))}</tbody></table></div>
      </Panel>
      <div className="ex-row2">
        <Panel title="Mapa de calor — dia × hora" sub="quando as vendas acontecem · mais laranja = mais vendas">
          <div className="ex-heat">
            <div className="ex-heat-hrow"><div className="ex-heat-corner"/>{horas.map(h=><div key={h} className="ex-heat-hh">{h}</div>)}</div>
            {dias.map((dn,d)=>(<div key={d} className="ex-heat-row">
              <div className="ex-heat-dl">{dn}</div>
              {horas.map(h=>{const c=cell(d,h); return <div key={h} className="ex-heat-cell" style={{background:heatCol(c?c.n:0)}} title={`${dn} ${h}h: ${c?c.n:0} vendas`}/>;})}
            </div>))}
          </div>
        </Panel>
        <Panel title="Vendas por dia do mês" sub="padrão de movimento ao longo do mês">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sz.diames} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false}/>
              <XAxis dataKey="dia" tick={{fill:C.txt3,fontSize:8}} axisLine={{stroke:C.line}} tickLine={false} interval={2}/>
              <YAxis tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false} width={30}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="n" name="Vendas" fill={C.orange} radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}

/* ---- 6. FORNECEDORES ---- */
function TabForn() {
  const cx = D.caixa;
  return (
    <>
      <Panel title="Prazo de pagamento a fornecedores" sub="o que dá para medir com a base atual">
        <div className="ex-dpo">
          <div className="ex-dpo-item"><div className="ex-dpo-v" style={{color:C.blue}}>{cx.dpo} dias</div><div className="ex-dpo-l">você paga fornecedores em (DPO)</div></div>
          <div className="ex-dpo-vs">vs</div>
          <div className="ex-dpo-item"><div className="ex-dpo-v" style={{color:C.orange}}>{cx.dso} dias</div><div className="ex-dpo-l">recebe dos clientes em (DSO)</div></div>
        </div>
        <div className="ex-dpo-note" style={{color: cx.dpo>cx.dso?C.green:C.amber}}>
          {cx.dpo>cx.dso ? `Você paga ${cx.dpo-cx.dso} dias depois de receber — o fornecedor financia sua operação. Vantagem de capital de giro; segure esses prazos ao negociar.` : `Você paga antes de receber — está financiando a operação com capital próprio.`}
        </div>
      </Panel>
      <div className="ex-disabled-grid">
        <Disabled t="Concentração por fornecedor" why="O contas a pagar do LJ não traz o nome do fornecedor mapeado — só valores e vencimentos."/>
        <Disabled t="Evolução de custo por produto" why="Não há histórico de compras por produto na base extraída."/>
        <Disabled t="Contas a pagar por vencimento" why="Disponível de forma agregada na aba Caixa; o detalhe por fornecedor exige o cadastro."/>
      </div>
      <div className="ex-note2">Para ligar esta aba: puxar do Firebird a tabela de fornecedores (cadastro) e vincular ao CP001. Dá para fazer numa próxima rodada do extrator.</div>
    </>
  );
}

/* ---- 7. CAIXA / DÍVIDAS / IMPOSTOS ---- */
function TabCaixa() {
  const cx = D.caixa;
  const ins = motor().filter(x=>x.cat==="Caixa");
  const proj = cx.proj.map(p=>({n:p.dias+" dias", Entradas:p.entra, Saídas:-p.sai, Saldo:p.saldo}));
  const aging = [
    {n:"Vencido", v:cx.aging.vencido, c:C.red},{n:"0–30d", v:cx.aging.d0_30, c:C.green},
    {n:"31–60d", v:cx.aging.d31_60, c:C.amber},{n:"61–90d", v:cx.aging.d61_90, c:C.orange},{n:"90+ d", v:cx.aging.d90, c:C.red},
  ];
  return (
    <>
      {ins.length>0 && <Panel title="Leitura de caixa"><div className="ex-ins-wrap">{ins.map((x,i)=><Insight key={i} {...x}/>)}</div></Panel>}
      <div className="ex-kpi-grid3">
        <KpiCard label="A RECEBER (aberto)" value={kbrl(cx.rec_aberto)} sub="total em contas a receber"/>
        <KpiCard label="A PAGAR (aberto)" value={kbrl(cx.pag_aberto)} sub="total em contas a pagar"/>
        <KpiCard label="POSIÇÃO LÍQUIDA" value={kbrl(cx.rec_aberto-cx.pag_aberto)} sub="receber − pagar"/>
      </div>
      <div className="ex-row2">
        <Panel title="Projeção de caixa" sub="entradas vs saídas acumuladas por janela — saldo é o que sobra">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={proj} margin={{top:8,right:8,left:0,bottom:0}} stackOffset="sign">
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" vertical={false}/>
              <XAxis dataKey="n" tick={{fill:C.txt2,fontSize:10}} axisLine={{stroke:C.line}} tickLine={false}/>
              <YAxis tick={{fill:C.txt3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={kbrl} width={54}/>
              <Tooltip content={<CTip fmt={kbrl}/>}/>
              <ReferenceLine y={0} stroke={C.txt3}/>
              <Bar dataKey="Entradas" fill={C.green} radius={[3,3,0,0]} maxBarSize={26}/>
              <Bar dataKey="Saídas" fill={C.red} radius={[0,0,3,3]} maxBarSize={26}/>
              <Line dataKey="Saldo" stroke={C.orange} strokeWidth={2}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="ex-proj-note">
            {cx.proj.map((p,i)=>(<div key={i} className="ex-proj-item"><span>{p.dias}d</span><b style={{color:p.saldo<0?C.red:C.green}}>{kbrl(p.saldo)}</b></div>))}
          </div>
        </Panel>
        <Panel title="Aging de contas a receber" sub="quanto está vencido e quanto vence quando">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={aging} margin={{top:8,right:8,left:0,bottom:0}} layout="vertical">
              <CartesianGrid stroke={C.line} strokeDasharray="2 4" horizontal={false}/>
              <XAxis type="number" tick={{fill:C.txt3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={kbrl}/>
              <YAxis type="category" dataKey="n" tick={{fill:C.txt2,fontSize:10}} axisLine={false} tickLine={false} width={60}/>
              <Tooltip content={<CTip fmt={kbrl}/>}/>
              <Bar dataKey="v" name="Valor" radius={[0,3,3,0]} maxBarSize={22}>{aging.map((e,i)=><Cell key={i} fill={e.c}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div className="ex-disabled-grid">
        <Disabled t="Painel de dívidas" why="O LJ não registra empréstimos/financiamentos. Cobertura pelo lucro e Dívida/EBITDA ficam indisponíveis."/>
        <Disabled t="Carga tributária" why="Os impostos não vêm separados nas vendas (o custo registrado é cheio). Sem a alíquota efetiva não dá para isolar o tributo."/>
        <Disabled t="Simulador de regime tributário" why="Depende da carga tributária real, indisponível na base atual."/>
      </div>
    </>
  );
}

/* ============ APP ============ */
const ABAS = [
  {id:"exec", n:"Visão Executiva"},{id:"ind", n:"Indicadores"},{id:"cli", n:"Clientes"},
  {id:"prod", n:"Produtos"},{id:"estoque", n:"Estoque"},{id:"vend", n:"Vendedores & Sazonalidade"},{id:"forn", n:"Fornecedores"},{id:"caixa", n:"Caixa & Dívidas"},
];

function TabEstoque({live}){
  const est = live || D.estoque || null;
  const [modo, setModo] = useState("valor");
  if(!est){
    return (
      <Panel title="Estoque">
        <div style={{padding:"18px 4px",color:C.txt3,fontSize:13,lineHeight:1.6}}>
          A aba de estoque aparece com os números reais assim que o extrator novo rodar na loja e gerar o
          <b style={{color:C.txt2}}> dash_data.json</b> com o bloco de estoque (saldo real da tabela consolidada do LJ + custo de compra).
          Enquanto isso, o restante do painel funciona normalmente.
        </div>
      </Panel>
    );
  }
  const r = est.resumo;
  const lista = modo==="valor" ? est.top_valor : est.encalhados;
  return (
    <>
      <div className="ex-kpi-grid">
        <KpiCard label="VALOR IMOBILIZADO" value={brl0(r.valor_total)} sub={intf(r.n_produtos)+" produtos com saldo"} big/>
        <KpiCard label="CAPITAL ENCALHADO" value={brl0(r.valor_encalhado)} sub={intf(r.n_encalhados)+" itens · "+r.pct_encalhado+"% · 0 vendas 12m"}/>
        <KpiCard label="TICKET DE ESTOQUE" value={r.n_produtos?brl0(r.valor_total/r.n_produtos):"R$ 0"} sub="valor médio parado por produto"/>
        <KpiCard label="SEM CUSTO CADASTRADO" value={intf(r.n_sem_custo)} sub="produtos com custo zerado"/>
      </div>
      <Panel
        title="Estoque · saldo real e capital imobilizado"
        sub="saldo direto da tabela consolidada do LJ (bate com o Inventário de Estoque) · custo pelo preço de compra"
        right={
          <div className="ex-win">
            <button className={"ex-win-btn"+(modo==="valor"?" on":"")} onClick={()=>setModo("valor")}>maior valor parado</button>
            <button className={"ex-win-btn"+(modo==="encalhado"?" on":"")} onClick={()=>setModo("encalhado")}>encalhados</button>
          </div>
        }>
        <div className="ex-scroll">
          <table className="ex-table">
            <thead>
              <tr>
                <th className="r">#</th><th>Código</th><th>Produto</th><th>Grupo</th>
                <th className="r">Saldo</th><th className="r">Custo un.</th>
                <th className="r">Valor parado</th><th className="r">Vendas 12m</th><th className="r">Parado há</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p,i)=>(
                <tr key={p.cod}>
                  <td className="r" style={{color:C.txt3}}>{i+1}</td>
                  <td style={{fontFamily:"monospace",color:C.txt3}}>{p.cod}</td>
                  <td>{p.desc}</td>
                  <td style={{color:C.txt3,fontSize:11}}>{p.grupo}</td>
                  <td className="r" style={{fontFamily:"monospace"}}>{intf(p.saldo)} {p.un}</td>
                  <td className="r" style={{fontFamily:"monospace"}}>{p.custo?brl(p.custo):<span style={{color:C.amber}}>—</span>}</td>
                  <td className="r" style={{fontFamily:"monospace",fontWeight:600,color:C.txt}}>{brl(p.valor)}</td>
                  <td className="r" style={{fontFamily:"monospace",color:p.vend12m===0?C.red:C.txt2}}>{intf(p.vend12m)}</td>
                  <td className="r" style={{fontFamily:"monospace",color:C.txt3}}>{p.dias_parado===null?<span style={{color:C.red}}>nunca</span>:p.dias_parado+"d"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 2px 2px",color:C.txt3,fontSize:11,lineHeight:1.5}}>
          <b style={{color:C.txt2}}>"Parado há"</b> = tempo desde a última venda; <b style={{color:C.red}}>"nunca"</b> = sem vendas em 12 meses —
          capital travado que vale liquidar, usar em obra própria da Solugy Engenharia, ou parar de comprar.
        </div>
      </Panel>
    </>
  );
}


const JANELAS = [{id:12,n:"12 meses"},{id:6,n:"6 meses"},{id:3,n:"3 meses"}];

export default function DashboardExec() {
  const [aba, setAba] = useState("exec");
  const [jan, setJan] = useState(12);
  const [usuario, setUsuario] = useState("");
  const [liveEstoque, setLiveEstoque] = useState(null);
  const [liveSync, setLiveSync] = useState(null);
  useEffect(()=>{
    let vivo=true;
    fetch("dash_data.json?t="+Date.now(),{cache:"no-store"})
      .then(r=>r.ok?r.json():null)
      .then(j=>{
        if(!vivo||!j) return;
        if(j.estoque) setLiveEstoque(j.estoque);
        // pega a data de atualização do JSON novo p/ o carimbo "sinc."
        const s = (j.meta && j.meta.atualizado_em) || j.atualizado_em;
        if(s) setLiveSync(s);
      })
      .catch(()=>{});
    return ()=>{vivo=false;};
  },[]);
  useEffect(()=>{
    let vivo=true;
    fetch("/.auth/me",{cache:"no-store"})
      .then(r=>r.ok?r.json():null)
      .then(j=>{
        if(!vivo||!j||!j.clientPrincipal) return;
        const cp=j.clientPrincipal, cl=cp.claims||[];
        const get=t=>{const c=cl.find(x=>(x.typ||"").toLowerCase().endsWith(t));return c?c.val:"";};
        let nome=get("givenname")||get("/name")||get("name")||cp.userDetails||"";
        if(nome.includes("@")) nome=nome.split("@")[0].replace(/[._]/g," ");
        const primeiro=(nome.trim().split(/\s+/)[0]||"").replace(/^./,c=>c.toUpperCase());
        if(vivo&&primeiro) setUsuario(primeiro);
      }).catch(()=>{});
    return ()=>{vivo=false;};
  },[]);
  const win = useMemo(()=> D.serie.slice(-jan).map(s=>s.k), [jan]);
  return (
    <div className="ex-root">
      <style>{css}</style>
      <div className="ex-topbar">
        <div className="ex-brand">
          <img src={LOGO_SOLUGY} alt="Solugy" className="ex-logo" />
          <div className="ex-brand-div" />
          <div>
            <div className="ex-welcome">Bem-vindo{usuario ? <>, <b>{usuario}</b></> : ""} 👋</div>
            <div className="ex-brand-sub">Painel Executivo · Materiais Elétricos · {D.meta.periodo}</div></div>
        </div>
        <div className="ex-topright">
          <div className="ex-win">{JANELAS.map(j=>(<button key={j.id} className={"ex-win-btn"+(jan===j.id?" on":"")} onClick={()=>setJan(j.id)}>{j.n}</button>))}</div>
          <div className="ex-sync">sinc. {liveSync || D.meta.atualizado_em}</div>
        </div>
      </div>
      <div className="ex-tabs">
        {ABAS.map(a=>(<button key={a.id} className={"ex-tab"+(aba===a.id?" on":"")} onClick={()=>setAba(a.id)}>{a.n}</button>))}
      </div>
      <div className="ex-body">
        {aba==="exec" && <TabExec win={win}/>}
        {aba==="ind" && <TabInd/>}
        {aba==="cli" && <TabCli/>}
        {aba==="prod" && <TabProd/>}
        {aba==="estoque" && <TabEstoque live={liveEstoque}/>}
        {aba==="vend" && <TabVend/>}
        {aba==="forn" && <TabForn/>}
        {aba==="caixa" && <TabCaixa/>}
      </div>
      <div className="ex-foot">Dados reais do LJ Sistemas · {D.meta.periodo} · janela: {jan} meses (afeta a Visão Executiva). Abas de detalhe usam o período completo. Seções marcadas "dados não carregados" dependem de campos que o LJ não fornece hoje.</div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
.ex-root{background:${C.bg};color:${C.txt};font-family:'Space Grotesk',system-ui,sans-serif;min-height:100vh;padding:0;}
.ex-root *{box-sizing:border-box;}
.ex-topbar{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid ${C.border};position:sticky;top:0;background:${C.bg};z-index:20;}
.ex-brand{display:flex;align-items:center;gap:12px;}
.ex-logo{height:30px;width:auto;display:block;}
.ex-brand-div{width:1px;height:28px;background:${C.border};}
.ex-welcome{font-weight:600;font-size:14px;color:${C.txt};letter-spacing:-.01em;}
.ex-welcome b{color:${C.orange};font-weight:700;}
.ex-brand-name{font-weight:700;font-size:16px;letter-spacing:.5px;font-style:italic;}
.ex-brand-name span{color:${C.orange};font-style:normal;font-weight:500;font-size:12px;letter-spacing:0;}
.ex-brand-sub{font-size:11px;color:${C.txt2};margin-top:1px;}
.ex-topright{display:flex;align-items:center;gap:14px;}
.ex-win{display:flex;gap:2px;background:${C.panel};border:1px solid ${C.border};border-radius:7px;padding:2px;}
.ex-win-btn{background:transparent;border:none;color:${C.txt2};font-family:inherit;font-size:11px;padding:5px 10px;border-radius:5px;cursor:pointer;}
.ex-win-btn.on{background:${C.orange};color:#fff;font-weight:600;}
.ex-sync{font-size:10px;color:${C.txt3};font-family:'JetBrains Mono',monospace;}
.ex-tabs{display:flex;gap:2px;padding:0 16px;border-bottom:1px solid ${C.border};overflow-x:auto;background:${C.bg};position:sticky;top:57px;z-index:19;}
.ex-tab{background:transparent;border:none;border-bottom:2px solid transparent;color:${C.txt2};font-family:inherit;font-size:12.5px;padding:11px 14px;cursor:pointer;white-space:nowrap;}
.ex-tab:hover{color:${C.txt};}
.ex-tab.on{color:${C.orange};border-bottom-color:${C.orange};font-weight:600;}
.ex-body{padding:16px 20px;display:flex;flex-direction:column;gap:14px;}
.ex-panel{background:${C.panel};border:1px solid ${C.border};border-radius:12px;padding:14px 16px;}
.ex-panel-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:10px;}
.ex-panel-title{font-size:13px;font-weight:600;letter-spacing:.2px;}
.ex-panel-sub{font-size:10.5px;color:${C.txt2};margin-top:2px;}
.ex-ins-wrap{display:flex;flex-direction:column;gap:8px;}
.ex-ins{border-left:3px solid;background:${C.panel2};border-radius:0 8px 8px 0;padding:9px 12px;}
.ex-ins-top{display:flex;align-items:center;gap:7px;margin-bottom:3px;}
.ex-ins-cat{font-size:10px;color:${C.txt2};font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
.ex-ins-sev{font-size:8.5px;font-weight:700;letter-spacing:.5px;margin-left:auto;}
.ex-ins-txt{font-size:12.5px;line-height:1.5;color:${C.txt};}
.ex-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.ex-kpi-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.ex-kpi{background:${C.panel};border:1px solid ${C.border};border-radius:11px;padding:12px 14px;}
.ex-kpi-lab{font-size:10px;color:${C.txt2};font-weight:600;letter-spacing:.6px;}
.ex-kpi-val{font-weight:700;margin:5px 0 3px;font-family:'JetBrains Mono',monospace;letter-spacing:-.5px;}
.ex-kpi-foot{display:flex;justify-content:space-between;align-items:center;}
.ex-kpi-sub{font-size:10.5px;color:${C.txt3};}
.ex-kpi-delta{font-size:11px;font-weight:600;font-family:'JetBrains Mono',monospace;}
.ex-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.ex-note{font-size:10.5px;color:${C.txt3};line-height:1.5;padding:2px 2px;font-style:italic;}
.ex-note2{font-size:11px;color:${C.txt2};line-height:1.5;padding:0 2px;}
.ex-tip{background:${C.panel2};border:1px solid ${C.border};border-radius:8px;padding:8px 10px;font-size:11px;}
.ex-tip-lab{color:${C.txt2};margin-bottom:4px;font-weight:600;}
.ex-tip-row{display:flex;justify-content:space-between;gap:16px;margin-top:2px;}
.ex-tip-row b{font-family:'JetBrains Mono',monospace;}
.ex-ind-top{display:grid;grid-template-columns:1.1fr 1fr;gap:14px;}
.ex-score{display:flex;align-items:center;gap:20px;}
.ex-score-num{font-size:52px;font-weight:700;font-family:'JetBrains Mono',monospace;line-height:1;}
.ex-score-num span{font-size:18px;color:${C.txt3};}
.ex-score-bar-wrap{flex:1;display:flex;flex-direction:column;gap:6px;}
.ex-score-comp{display:flex;align-items:center;gap:8px;}
.ex-score-comp-lab{font-size:10.5px;color:${C.txt2};width:92px;}
.ex-score-track{flex:1;height:6px;background:${C.panel2};border-radius:3px;overflow:hidden;}
.ex-score-fill{height:100%;border-radius:3px;}
.ex-score-comp-v{font-size:10.5px;color:${C.txt2};width:22px;text-align:right;font-family:'JetBrains Mono',monospace;}
.ex-guide-big{font-size:30px;font-weight:700;color:${C.orange};font-family:'JetBrains Mono',monospace;letter-spacing:-1px;}
.ex-guide-sub{font-size:11px;color:${C.txt2};margin:2px 0 8px;}
.ex-ind-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.ex-indcard{background:${C.panel};border:1px solid ${C.border};border-radius:11px;padding:12px 14px;}
.ex-indcard-t{font-size:11px;color:${C.txt2};font-weight:600;display:flex;align-items:center;gap:5px;}
.ex-indcard-v{font-size:21px;font-weight:700;margin:6px 0;font-family:'JetBrains Mono',monospace;}
.ex-indcard-d{font-size:10px;color:${C.txt3};line-height:1.45;}
.ex-tipdot{width:13px;height:13px;border-radius:50%;background:${C.panel2};color:${C.txt2};font-size:9px;display:inline-flex;align-items:center;justify-content:center;cursor:help;border:1px solid ${C.border};}
.ex-disabled-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.ex-disabled{background:repeating-linear-gradient(45deg,${C.panel},${C.panel} 10px,${C.panel2} 10px,${C.panel2} 20px);border:1px dashed ${C.border};border-radius:11px;padding:12px 14px;opacity:.8;}
.ex-disabled-t{font-size:12px;font-weight:600;color:${C.txt2};}
.ex-disabled-tag{display:inline-block;font-size:9px;color:${C.amber};border:1px solid ${C.amber};border-radius:4px;padding:1px 6px;margin:6px 0;text-transform:uppercase;letter-spacing:.5px;}
.ex-disabled-why{font-size:10px;color:${C.txt3};line-height:1.45;}
.ex-scroll{max-height:340px;overflow-y:auto;}
.ex-table{width:100%;border-collapse:collapse;font-size:11.5px;}
.ex-table th{text-align:left;color:${C.txt3};font-weight:500;font-size:10px;text-transform:uppercase;letter-spacing:.4px;padding:5px 6px;border-bottom:1px solid ${C.border};position:sticky;top:0;background:${C.panel};}
.ex-table th.r,.ex-table td.r{text-align:right;}
.ex-table td{padding:6px;border-bottom:1px solid ${C.line};font-family:'JetBrains Mono',monospace;}
.ex-table td:first-child{font-family:'Space Grotesk',sans-serif;}
.ex-bar-cell{position:relative;display:flex;align-items:center;min-height:16px;}
.ex-bar-bg{position:absolute;left:0;top:0;bottom:0;background:${C.orange};opacity:.13;border-radius:3px;}
.ex-bar-cell span{position:relative;z-index:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
.ex-abc{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.ex-abc-row{display:flex;align-items:center;gap:8px;}
.ex-abc-cls{width:20px;height:20px;border-radius:5px;color:#fff;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;}
.ex-abc-track{flex:1;height:8px;background:${C.panel2};border-radius:4px;overflow:hidden;}
.ex-abc-fill{height:100%;border-radius:4px;}
.ex-abc-v{font-size:10.5px;color:${C.txt2};font-family:'JetBrains Mono',monospace;white-space:nowrap;}
.ex-cat-h{font-size:11px;color:${C.txt2};font-weight:600;margin-bottom:8px;}
.ex-cat-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.ex-cat-n{font-size:11px;width:130px;color:${C.txt};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ex-cat-track{flex:1;height:6px;background:${C.panel2};border-radius:3px;overflow:hidden;}
.ex-cat-fill{height:100%;background:${C.orange};border-radius:3px;}
.ex-cat-v{font-size:10px;color:${C.txt2};font-family:'JetBrains Mono',monospace;white-space:nowrap;width:96px;text-align:right;}
.ex-heat{overflow-x:auto;}
.ex-heat-hrow,.ex-heat-row{display:flex;align-items:center;gap:2px;margin-bottom:2px;}
.ex-heat-corner,.ex-heat-dl{width:32px;flex-shrink:0;font-size:10px;color:${C.txt2};}
.ex-heat-hh{flex:1;min-width:20px;text-align:center;font-size:8.5px;color:${C.txt3};font-family:'JetBrains Mono',monospace;}
.ex-heat-cell{flex:1;min-width:20px;height:22px;border-radius:3px;}
.ex-dpo{display:flex;align-items:center;justify-content:center;gap:28px;padding:14px 0;}
.ex-dpo-item{text-align:center;}
.ex-dpo-v{font-size:30px;font-weight:700;font-family:'JetBrains Mono',monospace;}
.ex-dpo-l{font-size:11px;color:${C.txt2};margin-top:4px;}
.ex-dpo-vs{color:${C.txt3};font-size:13px;}
.ex-dpo-note{font-size:12px;line-height:1.5;text-align:center;padding:6px 12px 2px;}
.ex-proj-note{display:flex;justify-content:space-around;margin-top:8px;padding-top:8px;border-top:1px solid ${C.line};}
.ex-proj-item{display:flex;flex-direction:column;align-items:center;font-size:11px;color:${C.txt2};}
.ex-proj-item b{font-family:'JetBrains Mono',monospace;font-size:13px;margin-top:2px;}
.ex-foot{font-size:10px;color:${C.txt3};line-height:1.5;padding:14px 20px;border-top:1px solid ${C.border};text-align:center;}
@media(max-width:820px){
  .ex-kpi-grid,.ex-ind-grid{grid-template-columns:repeat(2,1fr);}
  .ex-row2,.ex-ind-top,.ex-disabled-grid,.ex-kpi-grid3{grid-template-columns:1fr;}
}
`;
