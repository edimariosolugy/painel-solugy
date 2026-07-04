# Painel Solugy · guia de publicação e operação

Dashboard gerencial da **Solugy Materiais Elétricos**, alimentado pelos dados do
LJ Sistemas (Firebird), hospedado no **Azure Static Web Apps** com login pela
conta Microsoft 365 dos sócios.

```
LJ / Firebird (PC da loja)
   └─ extrator (Python, só leitura, roda de hora em hora)
        └─ gera dash_data.json  →  pasta do OneDrive/SharePoint (sincroniza sozinho)
             └─ (você copia/publica esse JSON no app)
                  └─ Azure Static Web Apps  →  sócios acessam por login M365
```

Este pacote tem duas partes independentes:

- **`extrator/`** — roda no PC da loja e gera o `dash_data.json`.
- **raiz do projeto** — o app web (React/Vite) que exibe o painel.

---

## PARTE 1 — Extrator (no PC da loja, onde está o LJ)

### 1.1 Instalar o necessário (uma vez)
1. Instale o **Python 3.9+** — <https://www.python.org/downloads/> (marque *Add Python to PATH*).
2. Abra o **Prompt de Comando** e instale o driver do Firebird:
   ```
   pip install fdb
   ```

### 1.2 Configurar
Abra `extrator/extrator_solugy.py` e ajuste o bloco **CONFIG** no topo:
- `dsn` → caminho do banco. Se o Firebird está nesta máquina:
  `localhost:C:\ADMsolugy\Data\ESTOQUE.FDB`
- `user` / `password` → `SYSDBA` / `masterkey` (ou os seus).
- `charset` → deixe `WIN1252`; se aparecer acento errado no painel, troque para `ISO8859_1`.
- `saida_dir` → **importante**: aponte para uma pasta DENTRO do seu
  OneDrive/SharePoint sincronizado, por ex.:
  `C:\Users\SEU_USUARIO\OneDrive - Solugy\PainelSolugy`
  Assim o `dash_data.json` sobe sozinho para a nuvem quando é gerado.

### 1.3 Testar
No Prompt de Comando, dentro da pasta `extrator`:
```
py extrator_solugy.py
```
Deve terminar com uma linha `OK  ->  ...\dash_data.json` e um resumo
(faturamento, margem, a receber). Se der erro de conexão, confira o caminho do
banco e se o serviço do Firebird está rodando.

> O extrator só executa **SELECT** — não altera nada no banco.

### 1.4 Agendar de hora em hora (Windows)
1. Abra o **Agendador de Tarefas** (Task Scheduler).
2. **Criar Tarefa** (não a básica):
   - **Geral**: nome `Painel Solugy - Extrator`. Marque *Executar estando o
     usuário conectado ou não* e *Executar com privilégios mais altos*.
   - **Disparadores** → Novo → *Diariamente*, repetir a tarefa a cada **1 hora**
     durante **12 horas** (ex.: 07:00 às 19:00, horário comercial).
   - **Ações** → Novo → *Iniciar um programa* → selecione o arquivo
     `extrator\rodar_extrator.bat`.
   - **Condições**: desmarque *Iniciar a tarefa somente se o computador estiver
     ligado na energia* se for um desktop.
3. Salve (vai pedir a senha do Windows).

Cada execução grava um log em `extrator\extrator.log` — útil pra conferir.

> **Atenção:** enquanto este PC estiver **desligado**, o dado não atualiza. Por
> isso agendamos só o horário comercial. Fora dele, o painel mostra o último
> fechamento (a data/hora aparece no topo do painel: "sinc. ...").

---

## PARTE 2 — Publicar o app no Azure (uma vez)

Pré-requisitos: uma conta **GitHub** (grátis) e acesso ao **portal Azure**
(<https://portal.azure.com>) com a conta Microsoft da Solugy.

### 2.1 Subir este projeto para o GitHub
1. Crie um repositório novo no GitHub (pode ser **privado**), ex.: `painel-solugy`.
2. Suba **todo o conteúdo desta pasta** para o repositório (incluindo `src/`,
   `public/`, `package.json`, `.github/`). Pelo site do GitHub dá pra arrastar os
   arquivos, ou use o GitHub Desktop.

### 2.2 Criar o Static Web App
1. No portal Azure → **Criar recurso** → procure **Static Web App** → Criar.
2. Preencha:
   - **Assinatura** e **Grupo de recursos** (crie um, ex.: `rg-painel-solugy`).
   - **Nome**: `painel-solugy`.
   - **Plano**: **Free**.
   - **Origem**: **GitHub** → autorize → escolha sua conta, o repositório
     `painel-solugy` e a branch `main`.
   - **Detalhes da compilação**:
     - *Predefinição de build*: **React** (ou *Custom*).
     - *Local do aplicativo*: `/`
     - *Local da API*: (deixe vazio)
     - *Local de saída*: `dist`
3. **Revisar e criar** → **Criar**.

O Azure adiciona sozinho um segredo no seu GitHub e dispara o **GitHub Actions**,
que faz o build (`vite build`) e publica. Acompanhe em **Actions** no GitHub;
em ~2 min fica no ar. A URL aparece na tela do recurso (algo como
`https://painel-solugy.azurestaticapps.net`).

> Se você já tiver o workflow deste pacote (`.github/workflows/azure-static-web-apps.yml`),
> o Azure pode criar um segundo. Tudo bem manter só o que o Azure gerar; ou
> substitua pelo deste pacote e confira que o nome do segredo bate
> (`AZURE_STATIC_WEB_APPS_API_TOKEN`).

### 2.3 Restringir o acesso aos sócios (login M365)
O arquivo `public/staticwebapp.config.json` já **exige login** e só libera quem
tiver o papel **`socio`**. Falta convidar cada sócio:

1. No portal Azure, abra o recurso **painel-solugy** → menu **Gerenciamento de
   funções** (*Role Management*) → **Convidar**.
2. Preencha:
   - *Provedor de autorização*: **Microsoft Entra ID (aad)**
   - *Detalhes do convidado*: o **e-mail** do sócio (a conta M365 dele).
   - *Domínio*: a URL do app.
   - *Função*: escreva **`socio`** (exatamente assim).
   - Validade: até 168 horas.
3. **Gerar** → copie o link e envie ao sócio. Ao abrir e logar com a conta
   Microsoft, ele passa a ter acesso permanente.

Repita para cada sócio (Gabriel, etc.). Dá para convidar até 25 pessoas.

> **Nota de segurança (plano Free):** o login Entra ID pré-configurado aceita
> qualquer conta Microsoft, mas como travamos por papel `socio`, **só quem você
> convidou entra** — os demais recebem tela de acesso negado. É suficiente para
> uso interno. (Restringir automaticamente ao domínio @solugy exigiria o plano
> Standard, pago.)

### 2.4 Ligar o dado à nuvem
O app lê o arquivo **`dash_data.json`** que fica publicado junto dele. Há duas
formas de mantê-lo atualizado a partir do que o extrator gera no OneDrive:

- **Simples (recomendada pra começar):** o `public/dash_data.json` deste pacote
  já vem com os dados atuais. Para atualizar, substitua esse arquivo pelo novo
  gerado pelo extrator e dê um *commit* no GitHub — o Actions republica sozinho.
  Prática 1x/dia ou quando quiser um número fresco.
- **Automática (passo seguinte):** um pequeno robô (Power Automate ou um script
  agendado) copia o `dash_data.json` do OneDrive para o repositório/host a cada
  hora. Posso montar isso com você depois que o básico estiver no ar.

---

## Rodar o app no seu PC (opcional, para testar)
Com Node.js instalado:
```
npm install
npm run dev
```
Abre em `http://localhost:5173`. Ele lê o `public/dash_data.json` local.

---

## Manutenção — quem cuida do quê
- **Extrator parou de atualizar?** Veja `extrator\extrator.log` no PC da loja e
  confira se a Tarefa Agendada está ativa e o PC ligado.
- **Painel no ar mas com dado velho?** O `dash_data.json` publicado não foi
  atualizado — rode/committe o novo (passo 2.4).
- **Novo sócio?** Convide pelo *Role Management* (passo 2.3).
- **Mudou algo no painel (visual)?** Edite `src/PainelSolugy.jsx`, commit → o
  Actions rebuilda sozinho.

---

## Estrutura do pacote
```
painel-solugy/
├─ index.html
├─ package.json
├─ vite.config.js
├─ .github/workflows/azure-static-web-apps.yml   (build + deploy)
├─ public/
│  ├─ staticwebapp.config.json                   (login + acesso restrito)
│  └─ dash_data.json                             (dados que o app lê)
├─ src/
│  ├─ main.jsx
│  └─ PainelSolugy.jsx                           (o painel)
└─ extrator/
   ├─ extrator_solugy.py                         (lê o Firebird, gera o JSON)
   ├─ rodar_extrator.bat                         (chamado pela Tarefa Agendada)
   └─ requirements.txt
```
