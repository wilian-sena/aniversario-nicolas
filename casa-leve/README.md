# Casa Leve

Aplicação familiar para a rotina doméstica de três pessoas (Wilian, Ana e Nicolas), baseada numa
adaptação prática do método FlyLady.

> Constância é mais importante que perfeição.

A aplicação responde a quatro perguntas em menos de cinco segundos:

1. O que temos de fazer hoje?
2. Quem é responsável por cada coisa?
3. Qual é a zona da casa desta semana?
4. O que falta fazer para fechar o dia?

Funciona offline, instala-se como PWA e guarda tudo no telemóvel (IndexedDB). Não precisa de
servidor nem de conta.

---

## Executar localmente

```bash
cd casa-leve
npm install
npm run dev          # http://localhost:3000
```

Outros comandos:

```bash
npm run typecheck    # TypeScript sem emitir
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm test             # Vitest — lógica de domínio e persistência
npm run check        # lint + typecheck + testes
npm run build        # exportação estática para ./out
npm run icons        # regenera os ícones PNG da PWA
```

O service worker só é registado em produção (`npm run build`), para não interferir com o
hot reload durante o desenvolvimento.

### Ver a versão de produção

```bash
npm run build
npx serve out        # ou: cd out && python3 -m http.server 4321
```

---

## Publicar

O `next.config.mjs` usa `output: 'export'`: o `npm run build` gera `out/`, um site estático que
pode ser servido por qualquer alojamento.

**Netlify**
Já existe `casa-leve/netlify.toml` com `base = "casa-leve"`, `command = "npm run build"` e
`publish = "out"`. Basta ligar o repositório ao projeto Netlify — ou, a partir desta pasta:

```bash
npx netlify deploy --build --prod
```

**Vercel / Cloudflare Pages**
Build command `npm run build`, publish directory `out` (root directory `casa-leve`).

**GitHub Pages (subdiretório)**

```bash
NEXT_PUBLIC_BASE_PATH=/aniversario-nicolas/casa-leve npm run build
```

O `basePath` é aplicado às rotas, ao manifest e ao registo do service worker. Publique o conteúdo
de `out/` no caminho correspondente.

**Instalar no telemóvel**
Abrir o site em HTTPS → menu do browser → «Adicionar ao ecrã principal». A aplicação abre em modo
standalone e continua a funcionar sem rede.

---

## Estrutura

```
casa-leve/
├── public/
│   ├── manifest.webmanifest      # PWA: nome, ícones, standalone, atalhos
│   ├── sw.js                     # cache do shell + network-first nas navegações
│   └── icons/                    # 192, 512, maskable e apple-touch
├── scripts/generate-icons.mjs    # gera os PNG sem dependências externas
└── src/
    ├── app/                      # rotas (App Router, tudo client-side)
    │   ├── page.tsx              # Hoje — dashboard principal
    │   ├── semana/               # calendário semanal
    │   ├── zonas/                # zona da semana, missões e 15 minutos
    │   ├── tarefas/              # o dia inteiro numa lista, com filtros
    │   ├── familia/              # perfis + [id] para cada pessoa
    │   ├── reset/                # reset da noite (10 min)
    │   ├── bencao/               # bênção semanal (25 min, semana A/B)
    │   ├── roupa/ refeicoes/ hotspots/
    │   └── configuracoes/
    ├── components/               # UI reutilizável (ver lista abaixo)
    ├── domain/                   # lógica pura, testável, sem React
    │   ├── types.ts              # FamilyMember, Task, Zone, Activity, …
    │   ├── seed/                 # dados reais da família (family, zones, tasks, home, settings)
    │   ├── schedule.ts           # recorrência, cozinha, essencial, progresso
    │   ├── dayPlan.ts            # tema de cada dia e atividades
    │   ├── zones.ts              # ciclo de 5 zonas e escolha de missões
    │   ├── blessing.ts           # alternância A/B da bênção
    │   ├── focus.ts              # o que mostrar em cada momento do dia
    │   ├── laundry.ts stars.ts timer.ts
    │   └── __tests__/            # Vitest
    ├── store/                    # IndexedDB + estado React
    │   ├── db.ts                 # camada fina sobre IndexedDB (+ fallback memória)
    │   ├── repository.ts         # snapshot e escritas por store
    │   ├── AppState.tsx          # provider e ações
    │   └── selectors.ts          # useDay / useToday
    └── lib/                      # datas, cores dos membros, feedback, cn
```

Componentes: `AppShell`, `BottomNavigation`, `TodayHeader`, `FamilyMemberCard`, `TaskCard`,
`TaskChecklist`, `MicroActions`, `ZoneCard`, `ZoneMissionCard`, `Timer`, `EssentialMode`,
`WeeklyCalendar`, `LaundryTracker`, `MealPlanner`, `HotspotStatus`, `HouseNow`, `NicolasStars`,
`MemberDetail`, `NotificationSettings`, `Onboarding`, `ProgressRing`, `EmptyState`,
`ConfirmDialog`, `Card`, `Button`, `Pill`.

---

## Como funcionam as regras

| Regra | Onde vive |
|---|---|
| 1 — noites de atividade são de manutenção mínima | `dayPlan.isMinimalNight` + `schedule.templatesForDate` (não gera zona nem bênção) |
| 2 — quem cozinha não fecha a cozinha | `schedule.getKitchenDuty` |
| 3 — quem acompanha a atividade fica dispensado | `getKitchenDuty` + filtro das tarefas pesadas |
| 4 — todos participam no reset | modelos `r-*` para os três, mais o fecho da cozinha |
| 5 — home office não é disponibilidade | microações `priority: 'optional'`, em bloco discreto e só à tarde |
| 6 — Modo Essencial | `isEssential` nos modelos + `essentialTasks`; nada transita para o dia seguinte |

**Recorrência sem cópias.** Não existem tarefas duplicadas na base de dados. `templatesForDate`
calcula as tarefas de um dia a partir dos modelos, e cada conclusão é guardada com a chave
`templateId@AAAA-MM-DD`. Marcar a terça não marca a quarta.

**Zonas.** `getZoneForDate` conta as semanas desde a âncora (`settings.zoneAnchor`, uma
segunda-feira) e roda 1 → 2 → 3 → 4 → 5 → 1. Funciona também para datas anteriores à âncora.

**Bênção A/B.** `getBlessingWeek` alterna a cada semana a partir da mesma âncora. Na semana B os
adultos trocam as tarefas entre si; as do Nicolas mantêm-se.

**Progresso.** Sem percentagens: `✓ Feito`, `• Por fazer`, `○ Opcional`, `⚠ Essencial`, e para as
zonas «2 de 3 missões escolhidas concluídas». As microações opcionais não entram nas contas.

---

## Testes

```bash
npm test
```

74 testes sobre a lógica crítica: identificação do dia e da semana, tarefas recorrentes e conclusão
por data, rotação das zonas, escolha de 1 a 3 missões, alternância A/B da bênção, atribuição da
cozinha, Modo Essencial e fecho do dia, foco por momento do dia, estrelas, fluxo da roupa,
temporizador e persistência (IndexedDB, via `fake-indexeddb`).

---

## Dados e privacidade

Tudo fica no dispositivo, em IndexedDB (`casa-leve`), nas stores `completions`, `settings`,
`hotspots`, `zonePicks`, `laundry`, `meals` e `dayFlags`. Nada é enviado para lado nenhum.
«Configurações → Recomeçar do zero» apaga tudo.

A arquitetura está preparada para sincronização futura: o acesso a dados passa todo por
`store/repository.ts`, pelo que basta acrescentar um adaptador remoto (Supabase) sem tocar na UI
nem no domínio.

---

## Limitações conhecidas

- **Notificações** só disparam com a aplicação aberta. Notificações agendadas em segundo plano
  exigem Web Push com servidor — fica para a versão com backend.
- **Sem sincronização entre telemóveis.** Cada dispositivo tem o seu histórico.
- **Nomes, horários e atividades** são configuráveis no código (`src/domain/seed/`), não no ecrã de
  configurações. Editáveis na aplicação: durações dos temporizadores, tarefas do Nicolas que dão
  estrelas, lembretes e horas, som, âncora das zonas e semana A/B da bênção.
- **Estrelas** não têm conversão automática em dinheiro — é uma decisão dos pais, fora da app.
- **iOS**: a vibração no fim do temporizador não é suportada; o som e a mensagem funcionam.

## Próximos passos recomendados

1. Supabase para autenticação, sincronização e histórico familiar (adaptador em `repository.ts`).
2. Web Push para os lembretes funcionarem com a aplicação fechada.
3. Edição de membros, horários e atividades diretamente nas configurações.
4. Histórico simples: «há quantas semanas não mexemos na Zona 4».
5. Categorias de aprendizagem do Nicolas (piano, leitura, xadrez) como tarefas com estrelas.
