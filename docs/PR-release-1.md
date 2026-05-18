# feat: Dashboard Visão Geral — Release 1 (v0.1.0-dashboard)

## O que entrou nesta release

- **Tela Visão Geral** (`app/page.tsx`): grid de 6 canteiros com painel lateral de stats e alertas
- **`CanteiroCard`**: card interativo por canteiro com mini AreaChart de temperatura (12h), badges de status (Saudável / Atenção / Crítico), 4 leituras atuais de sensores
- **`CanteiroDetail`**: painel expandido (on-click toggle) com LineChart 24h (temperatura + umidade), AreaChart de umidade do solo, KPI cards com min/max/média, datas de plantio e colheita estimada
- **`StatsOverview`**: 4 KPI cards, resumo de status por severidade, BarChart de consumo de água (7 dias)
- **`AlertsPanel`**: lista de alertas recentes com ícone e cor por severidade
- **`lib/mock-data.ts`**: dados mockados realistas — 6 canteiros × 24 leituras horárias com variação senoidal de temperatura e luminosidade, histórico de irrigação de 7 dias
- **Testes**: `__tests__/visao-geral.test.tsx` — 7 casos cobrindo happy path, estados crítico/warning/vazio, interação de seleção

## Tela escolhida e justificativa

**Visão Geral** foi escolhida porque é a tela de maior risco técnico desta release:

1. **Integração de 4 componentes com dados distintos simultaneamente** — erros de contrato de tipos aparecem cedo, antes que a API real os exponha.
2. **Estado de seleção com toggle + render condicional** — valida o fluxo de estado local que as demais telas reutilizarão.
3. **Exercita toda a stack de gráficos** (AreaChart, LineChart, BarChart via Recharts) — padrões estabelecidos aqui são reaproveitados na tela de Histórico (A1.8).

A tela de Configuração foi descartada por ausência de spec de formulários; a de Histórico por depender de range picker ainda não especificado.

## Como rodar localmente

**Pré-requisitos:** Node.js ≥ 18, pnpm (ou npm)

```bash
# 1. Instalar dependências
npm install
# ou: pnpm install

# 2. Rodar em desenvolvimento
npm run dev
# Acesse http://localhost:3000

# 3. Rodar os testes
npm test
# ou em watch mode: npm test -- --watch
```

## Decisão de stack (complemento ao ADR da RFC)

A RFC original não havia especificado a biblioteca de gráficos. Decisão tomada nesta release:

| Decisão | Escolha | Motivo |
|---|---|---|
| Gráficos | **Recharts 2.15** | API declarativa React-first, ResponsiveContainer nativo, bundle aceitável (~150 KB gzip). Chart.js descartado por requerer refs imperativos. |
| Estado | **`useState` local** | Único estado cross-component é `selectedCanteiroId`. Zustand entra em A1.8 se filtros globais forem adicionados. |
| Datas | **date-fns 4 + ptBR** | Tree-shakeable, sem side-effects globais, formatação localizada de timestamps de sensores. |

Demais decisões (Next.js 16, Tailwind v4, shadcn/ui, TypeScript strict) conforme ADR da RFC.

## Issues fechadas

Closes #12, #13, #14, #15, #16, #17, #18

## Checklist

- [x] Tela roda com `npm run dev` sem erros no console
- [x] Layout não quebra em mobile (testado em 375px)
- [x] Dados mockados usam valores realistas (temperatura, umidade, timestamps coerentes)
- [x] Estados cobertos: healthy, warning, critical, lista vazia de alertas
- [x] Camada de dados isolada em `lib/mock-data.ts` (plugável à API real)
- [x] Testes passando: `npm test`
- [x] Documentação em `docs/dashboard/page-visao-geral.md`
- [x] Release notes em `docs/releases/release-1.md`
- [x] Tag `v0.1.0-dashboard` criada
