# page-visao-geral — Dashboard Principal da Horta

> `app/page.tsx` · Release 1 · `v0.1.0-dashboard`

---

## 1. Tela escolhida e justificativa

**Tela:** Visão Geral (`/`) — grid de canteiros com painel lateral de stats e alertas.

**Por que esta e não outra:**

O projeto possui ao menos três telas candidatas identificadas no backlog (visão geral, histórico de irrigação, configuração de sensores). A visão geral foi escolhida por três razões, em ordem de peso:

| Critério | Análise |
|---|---|
| **Risco técnico maior** | Integra quatro componentes com dados diferentes ao mesmo tempo (`CanteiroCard`, `CanteiroDetail`, `StatsOverview`, `AlertsPanel`). Erros de contrato de dados aparecem cedo, antes que a integração com API real exponha problemas mais caros de corrigir. |
| **Complexidade de estado real** | O estado de seleção de canteiro (`selectedCanteiroId`) envolve toggle, renderização condicional de detalhe expandido e re-renderização de gráficos Recharts — complexidade não trivial que vale validar já na primeira release. |
| **Aprendizado de stack** | É a única tela que exercita simultaneamente Recharts (AreaChart, LineChart, BarChart), `date-fns` com locale `ptBR`, e o sistema de design tokens CSS da shadcn/ui. Telas subsequentes reutilizarão esses padrões estabelecidos aqui. |

A tela de histórico foi descartada para R1 por depender de filtros de data (range picker) que aumentariam a superfície de bugs sem validar nada novo na stack. A tela de configuração foi descartada por não ter dados de sensor para exibir ainda.

---

## 2. Wireframe da versão implementada

```
┌─────────────────────────────────────────────────────────────┐
│ 🌱 HortaMonitor          [● Atualizado: HH:mm:ss] [Atualizar]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⊞ Canteiros (6 total)          │  📊 Stats Overview        │
│                                 │  ┌────┬────┬────┬────┐   │
│  ┌────────┐ ┌────────┐ ┌──────┐ │  │ 6  │25.2│64% │47L │   │
│  │🍅 A1   │ │🥬 A2   │ │🥕 B1 │ │  │cant│°C  │    │    │   │
│  │Saudável│ │Saudável│ │Atenção│ │  └────┴────┴────┴────┘   │
│  │24.5°C  │ │22.8°C  │ │26.2°C│ │                          │
│  │[chart] │ │[chart] │ │[chart]│ │  Status dos Canteiros    │
│  └────────┘ └────────┘ └──────┘ │  ✓4 Saudáveis ⚠1 ⛔1     │
│                                 │                          │
│  ┌────────┐ ┌────────┐ ┌──────┐ │  Consumo de Água (7d)    │
│  │🫑 B2   │ │🍓 C1   │ │🌿 C2 │ │  [BarChart]              │
│  │Saudável│ │Crítico │ │Saudável│ │                          │
│  └────────┘ └────────┘ └──────┘ │  🔔 Alertas Recentes      │
│                                 │  ⛔ Umidade baixa C1      │
│  ▼ [Canteiro selecionado]       │  ⚠ Temp. elevada B1      │
│  ┌─────────────────────────┐    │  ℹ Irrigação A1 OK        │
│  │ CanteiroDetail          │    │  ℹ Previsão chuva         │
│  │ LineChart 24h + stats   │    │                          │
│  └─────────────────────────┘    │                          │
└─────────────────────────────────────────────────────────────┘
```

**Mobile** (`< sm`): colunas colapsam em stack único — cards em 1 coluna, stats/alertas abaixo do grid de canteiros. Header oculta timestamp e mostra só o ícone de refresh.

---

## 3. Estados cobertos

| Estado | O que aparece para o usuário |
|---|---|
| **Carregando (inicial)** | Não aplicável na R1 — dados são síncronos (mock estático). Skeleton previsto para R2 quando fetch assíncrono for plugado. |
| **Sucesso (happy path)** | Grid completo com 6 canteiros, stats populadas, gráfico de barras de irrigação, 4 alertas listados. |
| **Canteiro selecionado** | `CanteiroDetail` expande abaixo do grid com gráficos de linha 24h, mini-stats de temp/umidade/solo/luz e datas de plantio/colheita. Clicar no mesmo canteiro fecha o detalhe (toggle). |
| **Status warning** | Card do canteiro recebe fundo amarelo (`bg-chart-3/20`), badge "Atenção". Canteiro B1 (Cenouras) demonstra esse estado. |
| **Status critical** | Card com fundo vermelho (`bg-chart-4/20`), badge "Crítico". Canteiro C1 (Morangos) demonstra: umidade do solo 32%, temperatura 28.5°C. Detalhe mostra aviso "Irrigar!" no card de umidade do solo. |
| **Lista de alertas vazia** | `AlertsPanel` renderiza o container vazio sem quebrar — `recentAlerts.map()` sobre array vazio produz fragmento vazio, sem crash. |
| **Array de canteiros vazio** | Grid renderiza sem cards; a contagem exibe `(0 total)`; `StatsOverview` calcula médias sobre array vazio → resultados são `NaN` (limitação conhecida — mitigação prevista em A1.8 com guard `canteiros.length > 0`). |
| **Canteiro sem leituras** | `readings.slice(-12)` retorna array vazio → Recharts renderiza gráfico em branco sem crash. `avgTemp` seria `NaN` — idem limitação acima. |

---

## 4. Estrutura de mock

### Localização e formato

```
lib/
└── mock-data.ts          ← única fonte de dados mockados
```

O arquivo exporta:

```typescript
export const canteiros: Canteiro[]         // 6 canteiros com sensor readings (24 leituras cada)
export const hortaStats: HortaStats        // agregados calculados em tempo de importação
export const irrigationHistory: {...}[]    // 7 dias de consumo de água em litros
export const recentAlerts: Alert[]         // 4 alertas com type, message, timestamp, canteiroId
```

### Realismo dos dados

- Temperaturas variam com seno ao longo do dia (`Math.sin(((hour - 6) * Math.PI) / 12) * 5`) — reproduz o ciclo diário real.
- Luz: zero fora do intervalo 6h–18h, pico ao meio-dia.
- Solo: decai gradualmente ao longo das 24h (`- index * 0.5`) — simula consumo hídrico real.
- Timestamps: gerados retroativamente a partir de `new Date()` em intervalos de 1h.

### Plano de migração para API real

A camada de dados está **completamente isolada** em `lib/mock-data.ts`. Para plugar a API real:

1. Criar `lib/api.ts` com as mesmas assinaturas exportadas (`getCanteiros()`, `getHortaStats()`, etc.) fazendo fetch ao endpoint real.
2. Nos componentes, substituir o import direto:
   ```diff
   - import { canteiros } from "@/lib/mock-data"
   + import { canteiros } from "@/lib/api"   // ou via React Query / SWR
   ```
3. Adicionar estado de loading/error nos componentes que hoje consomem síncronos — já previsto com Skeleton em A1.8.

**Troca mínima de código:** todos os consumidores dependem das interfaces `Canteiro`, `SensorReading`, `Alert` (tipadas em `mock-data.ts`) — os tipos permanecem; só a fonte dos dados muda.

---

## 5. Decisão de stack

> Esta seção complementa o ADR da RFC original onde a stack de gráficos não havia sido finalizada.

| Decisão | Escolha | Justificativa |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Já definido na RFC. SSR permite hidratação rápida; App Router coexiste com componentes client (`"use client"`) necessários para interatividade dos gráficos. |
| **Biblioteca de gráficos** | Recharts 2.15 | Bundle razoável (~150 KB gzip), API declarativa compatível com React 19, suporte nativo a ResponsiveContainer sem wrapper extra. Alternativa Chart.js descartada por requerer ref imperativo incompatível com RSC. |
| **Gerenciador de estado** | `useState` local (sem Zustand/Redux) | Único estado cross-component é `selectedCanteiroId` em `page.tsx`, passado como prop. Escala linear até ~10 canteiros sem problemas de performance. Zustand entra se A1.8 adicionar filtros globais ou sincronização com WebSocket. |
| **UI / Design System** | shadcn/ui + Tailwind CSS v4 | Componentes sem runtime CSS-in-JS; tokens via CSS custom properties permitem theming sem re-render. |
| **Datas** | date-fns 4 com locale `ptBR` | Sem efeitos colaterais globais (vs. moment.js); tree-shakeable; formatação localizada consistente para timestamps de sensores. |
