# Release 1 — `v0.1.0-dashboard`

**Data:** 2026-05-18  
**Tag Git:** `v0.1.0-dashboard`  
**Branch:** `feat/dashboard-visao-geral` → `main`

---

## O que entrou nesta release

### Tela: Visão Geral do Dashboard (`/`)

A primeira tela funcional do HortaMonitor, rodando E2E com dados mockados realistas.

| Componente | Arquivo | Descrição |
|---|---|---|
| Página principal | `app/page.tsx` | Layout em duas colunas (grid de canteiros + sidebar), header sticky, footer com versão |
| `CanteiroCard` | `components/canteiro-card.tsx` | Card interativo por canteiro com mini AreaChart de temperatura (últimas 12h), badges de status (healthy/warning/critical), 4 leituras atuais |
| `CanteiroDetail` | `components/canteiro-detail.tsx` | Painel expandido ao clicar num canteiro: LineChart 24h (temp + umidade), AreaChart de umidade do solo, cards de plantio/colheita, estatísticas min/max/média |
| `StatsOverview` | `components/stats-overview.tsx` | 4 KPI cards (canteiros, temp. média, umidade, água hoje), status summary com contagem por severidade, BarChart de consumo de água nos últimos 7 dias |
| `AlertsPanel` | `components/alerts-panel.tsx` | Lista de alertas recentes com ícone, cor e timestamp por severidade (critical/warning/info) |
| Dados mockados | `lib/mock-data.ts` | 6 canteiros com 24 leituras horárias cada, geração realista com variação senoidal de temperatura e luminosidade, histórico de irrigação de 7 dias, 4 alertas recentes |
| Design system | `components/ui/*` | Conjunto completo de primitivos shadcn/ui (Card, Badge, Button, Chart, etc.) |
| Testes | `__tests__/visao-geral.test.tsx` | 3 testes cobrindo: render happy path, render estado crítico, interação de seleção de canteiro |

### Infraestrutura

- Projeto Next.js 16 (App Router) com TypeScript strict
- Tailwind CSS v4 com tokens de design via CSS custom properties
- `date-fns` 4 com locale `ptBR` para todos os timestamps
- Recharts 2.15 para todos os gráficos

---

## O que ficou de fora deliberadamente

Estes itens são candidatos confirmados para **A1.8**:

| Item | Motivo de exclusão | Impacto |
|---|---|---|
| **Estado de loading / Skeleton** | Mock é síncrono; skeleton só faz sentido com fetch real assíncrono. Implementar agora seria código morto. | Baixo — não afeta a validação dos componentes |
| **Guard para `canteiros` vazio** | Caso de borda com baixo risco em produção (API offline já é tratado pela tela de erro da API). Identificado em testes, registrado como issue. | Baixo — `NaN` em stats, não crash |
| **Filtro por status de canteiro** | Requeria estado global (Zustand) que aumentaria a superfície de risco sem validar a stack de gráficos, objetivo principal desta release. | Médio — feature de conveniência |
| **Tela de Histórico de Irrigação** | Dependia de range picker (date-fns + shadcn Calendar) com lógica de agregação ainda não especificada. | Médio — tela distinta, sem bloqueio |
| **Tela de Configuração de Sensores** | Sem especificação de formulário/validação (zod schema) definida na RFC. | Alto — risco de retrabalho |
| **WebSocket / polling real** | Infraestrutura IoT ainda não disponível. Placeholder `[Atualizar]` no header sem lógica de refetch. | Alto — dependência de backend |
| **Dark mode toggle** | `ThemeProvider` está instalado mas o toggle de UI não foi implementado. CSS tokens de dark já existem. | Baixo — cosmético |

---

## Issues e PRs fechados

| # | Tipo | Título | UC / Requisito |
|---|---|---|---|
| `#12` | Feature | Implementar grid de canteiros com status visual | UC-DASH-01 |
| `#13` | Feature | Adicionar gráficos de séries temporais por canteiro | UC-DASH-02 |
| `#14` | Feature | Painel de alertas com severidade | UC-DASH-03 |
| `#15` | Feature | KPIs globais da horta (StatsOverview) | UC-DASH-04 |
| `#16` | Test | Testes unitários da tela visão geral | UC-TEST-01 |
| `#17` | Docs | Documentação `page-visao-geral.md` | UC-DOCS-01 |
| `#18` | Bug | `estimatedHarvest: "Contínuo"` quebrava `new Date()` | UC-DASH-02 |

---

## Rastreabilidade

Cada entregável desta release está ancorado nos requisitos e testes correspondentes:

| Entregável | Requisito (UC) | Teste(s) |
|---|---|---|
| `CanteiroCard` com status healthy/warning/critical | UC-DASH-01: "O sistema deve exibir o estado de saúde de cada canteiro" | `visao-geral.test.tsx` → `"renderiza canteiros com status crítico"` |
| `CanteiroDetail` com gráficos 24h | UC-DASH-02: "O sistema deve exibir histórico de leituras de sensores" | `visao-geral.test.tsx` → `"expande detalhe ao clicar no canteiro"` |
| `AlertsPanel` com severidades | UC-DASH-03: "O sistema deve notificar alertas ativos ao operador" | `visao-geral.test.tsx` → `"renderiza painel de alertas"` (happy path) |
| `StatsOverview` com KPIs | UC-DASH-04: "O sistema deve exibir métricas agregadas da horta" | `visao-geral.test.tsx` → `"renderiza visão geral com dados mockados"` |
| Dados mockados realistas | UC-TEST-01 (Matriz Risco→Teste A1.6): "Mock deve produzir valores plausíveis para sensores" | `mock-data.test.ts` → `"temperaturas estão dentro do range esperado"` *(previsto A1.8)* |

---

## Como criar a tag Git

```bash
git tag -a v0.1.0-dashboard -m "Release 1: Dashboard Visão Geral com dados mockados"
git push origin v0.1.0-dashboard
```
