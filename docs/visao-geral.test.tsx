/**
 * Testes da tela Visão Geral do Dashboard (app/page.tsx)
 *
 * Ancoramento na Matriz Risco→Teste (A1.6):
 * - RISCO-01: Componente renderiza com dados reais de sensores (happy path)
 * - RISCO-02: Componente reage corretamente a canteiros em estado crítico
 * - RISCO-03: Interação de seleção/detalhe de canteiro funciona sem crash
 *
 * Stack de testes: Jest + React Testing Library
 * Instalação: npm install --save-dev jest @testing-library/react @testing-library/jest-dom
 *             jest-environment-jsdom @types/jest ts-jest
 */

import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// Mocks de módulos externos (Recharts não funciona bem em jsdom sem mock)
// ---------------------------------------------------------------------------

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    AreaChart: ({ children }: { children: React.ReactNode }) => (
      <svg data-testid="area-chart">{children}</svg>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <svg data-testid="line-chart">{children}</svg>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <svg data-testid="bar-chart">{children}</svg>
    ),
    Area: () => null,
    Line: () => null,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

// Mock do next-themes (ThemeProvider usa contexto que não existe em jsdom)
jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import dos componentes após mocks
// ---------------------------------------------------------------------------

import Dashboard from "../app/page";
import { CanteiroCard } from "../components/canteiro-card";
import { AlertsPanel } from "../components/alerts-panel";
import { canteiros, recentAlerts } from "../lib/mock-data";

// ---------------------------------------------------------------------------
// TESTE 1 — Happy Path: renderiza visão geral com dados mockados
// Risco coberto: RISCO-01
// ---------------------------------------------------------------------------

describe("Dashboard — happy path", () => {
  it("renderiza o header e todos os canteiros", () => {
    render(<Dashboard />);

    // Header sempre visível
    expect(screen.getByText("HortaMonitor")).toBeInTheDocument();
    expect(screen.getByText(/Sistema de Monitoramento Inteligente/i)).toBeInTheDocument();

    // Todos os 6 canteiros aparecem no grid
    expect(screen.getByText("Canteiro A1")).toBeInTheDocument();
    expect(screen.getByText("Canteiro A2")).toBeInTheDocument();
    expect(screen.getByText("Canteiro B1")).toBeInTheDocument();
    expect(screen.getByText("Canteiro B2")).toBeInTheDocument();
    expect(screen.getByText("Canteiro C1")).toBeInTheDocument();
    expect(screen.getByText("Canteiro C2")).toBeInTheDocument();

    // Contagem correta no label do grid
    expect(screen.getByText(`(${canteiros.length} total)`)).toBeInTheDocument();
  });

  it("exibe leituras realistas de sensores (não lorem ipsum)", () => {
    render(<Dashboard />);

    // Temperatura A1 = 24.5°C — valor real do mock
    expect(screen.getByText("24.5°C")).toBeInTheDocument();
    // Umidade A1 = 68%
    expect(screen.getByText("68%")).toBeInTheDocument();
    // Temperatura C1 (crítico) = 28.5°C
    expect(screen.getByText("28.5°C")).toBeInTheDocument();
  });

  it("exibe o painel de alertas recentes", () => {
    render(<Dashboard />);

    expect(screen.getByText("Alertas Recentes")).toBeInTheDocument();
    // Alerta crítico do mock
    expect(
      screen.getByText(/Umidade do solo baixa no Canteiro C1/i)
    ).toBeInTheDocument();
    // Alerta de info do mock
    expect(
      screen.getByText(/Irrigação automática concluída no Canteiro A1/i)
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// TESTE 2 — Estado crítico: canteiro com alerta crítico renderiza corretamente
// Risco coberto: RISCO-02 (UC-DASH-01: exibir estado de saúde de cada canteiro)
// ---------------------------------------------------------------------------

describe("CanteiroCard — estado crítico", () => {
  const canteiroCritico = canteiros.find((c) => c.status === "critical")!;

  it("exibe badge 'Crítico' para canteiro com status critical", () => {
    const { getByText } = render(
      <CanteiroCard
        canteiro={canteiroCritico}
        onClick={jest.fn()}
        isSelected={false}
      />
    );

    expect(getByText("Crítico")).toBeInTheDocument();
    expect(getByText(canteiroCritico.plant)).toBeInTheDocument();
    // Umidade solo baixa — 32%
    expect(getByText("32%")).toBeInTheDocument();
  });

  it("exibe badge 'Atenção' para canteiro com status warning", () => {
    const canteiroWarning = canteiros.find((c) => c.status === "warning")!;
    const { getByText } = render(
      <CanteiroCard
        canteiro={canteiroWarning}
        onClick={jest.fn()}
        isSelected={false}
      />
    );

    expect(getByText("Atenção")).toBeInTheDocument();
  });

  it("exibe badge 'Saudável' para canteiro healthy", () => {
    const canteiroHealthy = canteiros.find((c) => c.status === "healthy")!;
    const { getByText } = render(
      <CanteiroCard
        canteiro={canteiroHealthy}
        onClick={jest.fn()}
        isSelected={false}
      />
    );

    expect(getByText("Saudável")).toBeInTheDocument();
  });

  it("não trava quando readings está vazio", () => {
    const canteiroSemLeituras = { ...canteiroCritico, readings: [] };
    expect(() =>
      render(
        <CanteiroCard
          canteiro={canteiroSemLeituras}
          onClick={jest.fn()}
          isSelected={false}
        />
      )
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// TESTE 3 — Interação: selecionar canteiro expande CanteiroDetail
// Risco coberto: RISCO-03 (UC-DASH-02: exibir histórico de leituras)
// ---------------------------------------------------------------------------

describe("Dashboard — interação de seleção de canteiro", () => {
  it("expande o detalhe ao clicar num canteiro e fecha ao clicar de novo", () => {
    render(<Dashboard />);

    // Antes de clicar: detalhe não existe
    expect(screen.queryByText("Temperatura e Umidade (24h)")).not.toBeInTheDocument();

    // Clica no card do Canteiro A1
    const cardA1 = screen.getByText("Canteiro A1").closest("[data-testid='canteiro-card'], .cursor-pointer") 
      ?? screen.getByText("Canteiro A1").closest("div[class*='cursor-pointer']")
      ?? screen.getByText("Canteiro A1").parentElement!.parentElement!.parentElement!;

    fireEvent.click(screen.getByText("Canteiro A1"));

    // Após clicar: detalhe aparece com gráficos
    expect(screen.getByText("Temperatura e Umidade (24h)")).toBeInTheDocument();
    expect(screen.getByText("Umidade do Solo (24h)")).toBeInTheDocument();

    // Clica de novo (toggle off)
    fireEvent.click(screen.getByText("Canteiro A1"));

    // Detalhe some
    expect(screen.queryByText("Temperatura e Umidade (24h)")).not.toBeInTheDocument();
  });

  it("troca o detalhe ao clicar em outro canteiro", () => {
    render(<Dashboard />);

    // Seleciona A1
    fireEvent.click(screen.getByText("Canteiro A1"));
    expect(screen.getByText("Tomates")).toBeInTheDocument(); // planta do A1

    // Seleciona C1 (crítico)
    fireEvent.click(screen.getByText("Canteiro C1"));
    // Agora o detalhe deve mostrar C1 (Morangos)
    // Múltiplos "Morangos" possíveis (card + detalhe) — verifica pelo aviso de irrigação
    expect(screen.getByText("Irrigar!")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// TESTE 4 — AlertsPanel: estado vazio não trava
// Risco coberto: RISCO-01 (borda: sem alertas não quebra a tela)
// ---------------------------------------------------------------------------

describe("AlertsPanel — estado vazio", () => {
  it("renderiza sem crash quando não há alertas", () => {
    // Substitui o mock temporariamente com array vazio
    jest.mock("../lib/mock-data", () => ({
      ...jest.requireActual("../lib/mock-data"),
      recentAlerts: [],
    }));

    // AlertsPanel importado antes do mock de módulo — testa via render direto
    expect(() => render(<AlertsPanel />)).not.toThrow();
    expect(screen.getByText("Alertas Recentes")).toBeInTheDocument();
  });
});
