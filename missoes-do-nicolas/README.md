# Missões do Nicolas ⭐

Aplicação web (PWA) para uma família ensinar responsabilidades, autonomia, hábitos,
aprendizagem e educação financeira a uma criança de 7 anos.

Funciona **totalmente no dispositivo**: sem contas, sem servidor, sem ligação à internet
depois da primeira abertura. Os dados ficam guardados no navegador e podem ser exportados
para JSON.

## O princípio central

Quatro sistemas que **nunca** se misturam:

| Sistema | Dá | Não dá |
| --- | --- | --- |
| Responsabilidades diárias | ⭐ estrelas | 💶 dinheiro |
| Atividades de aprendizagem | ⭐ estrelas | 💶 dinheiro |
| Trabalhos extra | 💶 dinheiro | ⭐ estrelas |
| Semanada | 💶 dinheiro (fixo) | — |

As estrelas dão **privilégios e experiências em família**, nunca euros. A semanada não
depende do número de estrelas. A mensagem que a app transmite não é "faço se me pagarem".

### Matemática das estrelas

- 6 responsabilidades × 7 dias = **42 estrelas**
- máximo 2 estrelas de aprendizagem × 7 dias = **14 estrelas**
- total possível: **56 estrelas por semana** (segunda a domingo)

## Como executar localmente

```bash
cd missoes-do-nicolas
npm install
npm run dev          # http://localhost:5173
```

Outros comandos:

```bash
npm run build        # verificação de tipos + build de produção (dist/)
npm run preview      # serve o build de produção
npm run lint         # ESLint
npm test             # testes funcionais (Vitest)
node scripts/generate-icons.mjs   # regenera os ícones PNG da PWA
```

Para publicar numa subpasta (ex.: GitHub Pages em `/missoes-do-nicolas/`):

```bash
BASE_PATH=/missoes-do-nicolas/ npm run build
```

## Como instalar como aplicação (PWA)

A app só é instalável quando servida por **HTTPS** (ou em `localhost`).

- **Android / Chrome:** abrir o site → menu ⋮ → *Instalar aplicação* / *Adicionar ao ecrã principal*.
- **iPhone / iPad (Safari):** abrir o site → botão *Partilhar* → *Adicionar ao ecrã principal*.
- **Desktop (Chrome/Edge):** ícone de instalação na barra de endereço → *Instalar*.

Depois de instalada abre em ecrã inteiro, com ícone próprio, e funciona offline (o service
worker guarda a aplicação em cache e atualiza-se sozinho quando há uma versão nova).

## Modos

**Modo Nicolas** (predefinido) — 🏠 Hoje · ⭐ Semana · 💰 Cofrinhos · 🎯 Objetivo · 🧹 Extras

**Modo Pais** (protegido por PIN de 4 dígitos, definido no primeiro acesso) —
📊 Resumo · ✅ Aprovações · 🧹 Trabalhos · 💰 Dinheiro · 📅 Histórico · ⚙️ Configurações

O PIN é guardado apenas em forma cifrada (SHA-256), nunca em texto aberto.

## Estrutura

```
src/
  components/
    ui/          Card, Button, ProgressBar, StatusBadge, Modal, NavBar, PinPad, …
    child/       ResponsibilityCard, LearningCard, StarMeter, ExtraJobCard, WalletCard, GoalCard
    parent/      CloseWeekModal, ParentGate, e os blocos das configurações
  pages/
    child/       TodayPage, WeekPage, WalletsPage, GoalPage, ExtrasPage
    parent/      SummaryPage, ApprovalsPage, JobsPage, MoneyPage, HistoryPage, SettingsPage
  hooks/         useApp, useToday
  services/      storageService (persistência isolada), migrations, weekService
  state/         AppProvider, appReducer, actions, appContext
  types/         modelo de dados completo
  utils/         date, money, scoring, pin, id, cn
  data/          defaults (dados iniciais)
  tests/         testes funcionais
```

### Persistência e migrações

Toda a aplicação fala apenas com `storageService`, que recebe um `StorageBackend`
(`localStorage` por omissão, memória nos testes). Trocar por Supabase no futuro significa
escrever outro backend — nada mais muda. Os dados guardados têm `schemaVersion`, e
`services/migrations.ts` aplica as migrações necessárias ao carregar.

## Testes funcionais

`npm test` cobre os 19 cenários pedidos: marcar/desmarcar responsabilidades, escovagem
manhã+noite, limite de 2 estrelas de aprendizagem por dia, cálculo das 56 estrelas, níveis
de recompensa e estrelas em falta, fluxo completo dos trabalhos extra, soma do dinheiro,
divisão 50/40/10 sem perder cêntimos, fecho de semana, histórico, nova semana, saldos e
objetivo mantidos, recarregamento sem perda de dados, exportação e importação.
