'use client';

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, RefreshCw, Sprout, LayoutGrid, ArrowLeftRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/states/DashboardSkeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { PartialState } from "@/components/states/PartialState";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { DashboardScenario, SensorReading } from "@/lib/api/types";

const scenarioLabels: Record<DashboardScenario, string> = {
  loading: "Carregando",
  success: "Sucesso",
  empty: "Vazio",
  error: "Erro",
  partial: "Parcial",
};

function metricCard(title: string, value: string, subtitle?: string) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}

function readingToChartPoint(reading: SensorReading) {
  return {
    time: format(new Date(reading.timestamp), "HH:mm"),
    temperatura: reading.temperature,
    umidade: reading.humidity ?? 0,
    solo: reading.soilMoisture ?? 0,
  };
}

export default function DashboardPage() {
  const [scenario, setScenario] = useState<DashboardScenario>("success");
  const { data, loading, error, retry, selectedCanteiro } = useDashboard({ scenario });
  const [selectedCanteiroId, setSelectedCanteiroId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCanteiroId && data?.canteiros?.length) {
      setSelectedCanteiroId(data.canteiros[0].id);
    }
  }, [data, selectedCanteiroId]);

  const canteiroSelecionado = useMemo(() => {
    if (!data?.canteiros?.length) return null;
    return data.canteiros.find((item) => item.id === selectedCanteiroId) ?? data.canteiros[0];
  }, [data, selectedCanteiroId]);

  const showPartialBanner = !!canteiroSelecionado?.readings.some((r) => r.sensorStatus === "offline" || r.humidity === null);

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sprout className="h-4 w-4" />
                HortaMonitor
              </div>
              <h1 className="text-2xl font-semibold md:text-3xl">Visão Geral do Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitoramento em tempo quase real de temperatura, umidade, irrigação e alertas.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(scenarioLabels) as DashboardScenario[]).map((item) => (
                <Button
                  key={item}
                  variant={scenario === item ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScenario(item)}
                  className="rounded-full"
                >
                  {scenarioLabels[item]}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="rounded-full" onClick={retry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
              <LayoutGrid className="h-3.5 w-3.5" />
              {data?.canteiros?.length ?? 0} canteiros
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
              <Activity className="h-3.5 w-3.5" />
              Atualizado em {data ? format(new Date(data.generatedAt), "dd/MM HH:mm", { locale: ptBR }) : "--"}
            </span>
          </div>
        </header>

        {loading ? <DashboardSkeleton /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={retry} /> : null}
        {!loading && !error && data && data.canteiros.length === 0 ? <EmptyState /> : null}

        {!loading && !error && data && data.canteiros.length > 0 ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricCard("Temperatura média", `${data.overview.avgTemperature.toFixed(1)}°C`, "Média geral dos canteiros")}
              {metricCard("Umidade média", `${data.overview.avgHumidity}%`, "Condição média do ambiente")}
              {metricCard("Água usada hoje", `${data.overview.totalWaterUsedToday}L`, "Irrigação registrada no dia")}
              {metricCard("Economia", `${data.overview.waterSavings}%`, "Redução estimada de consumo")}
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Histórico de medições</CardTitle>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={canteiroSelecionado?.readings.map(readingToChartPoint) ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="temperatura" strokeWidth={2} />
                      <Area type="monotone" dataKey="umidade" strokeWidth={2} />
                      <Area type="monotone" dataKey="solo" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Alertas recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.recentAlerts.map((alert) => (
                    <div key={alert.id} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium capitalize">{alert.kind}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(alert.timestamp), "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Seleção de canteiro</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {data.canteiros.map((canteiro) => (
                    <button
                      key={canteiro.id}
                      onClick={() => setSelectedCanteiroId(canteiro.id)}
                      className={[
                        "rounded-2xl border p-4 text-left transition hover:border-primary",
                        selectedCanteiroId === canteiro.id ? "border-primary bg-primary/5" : "border-border",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-2xl">{canteiro.emoji}</div>
                          <h3 className="mt-1 font-semibold">{canteiro.name}</h3>
                          <p className="text-sm text-muted-foreground">{canteiro.plant}</p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs">
                          {canteiro.status === "healthy" ? "Saudável" : canteiro.status === "warning" ? "Atenção" : "Crítico"}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <span>{canteiro.currentTemp}°C</span>
                        <span>{canteiro.currentHumidity ?? "--"}%</span>
                        <span>{canteiro.currentSoilMoisture ?? "--"}%</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Detalhes do canteiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {canteiroSelecionado ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{canteiroSelecionado.emoji}</div>
                        <div>
                          <h3 className="text-lg font-semibold">{canteiroSelecionado.name}</h3>
                          <p className="text-sm text-muted-foreground">{canteiroSelecionado.plant}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-muted/50 p-3">
                          <p className="text-muted-foreground">Temperatura</p>
                          <p className="mt-1 text-lg font-semibold">{canteiroSelecionado.currentTemp}°C</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3">
                          <p className="text-muted-foreground">Umidade do ar</p>
                          <p className="mt-1 text-lg font-semibold">{canteiroSelecionado.currentHumidity ?? "--"}%</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3">
                          <p className="text-muted-foreground">Umidade do solo</p>
                          <p className="mt-1 text-lg font-semibold">{canteiroSelecionado.currentSoilMoisture ?? "--"}%</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3">
                          <p className="text-muted-foreground">Luz</p>
                          <p className="mt-1 text-lg font-semibold">{canteiroSelecionado.currentLight ?? "--"} lux</p>
                        </div>
                      </div>

                      <div className="rounded-xl border p-3 text-sm">
                        Última irrigação em{" "}
                        {format(new Date(canteiroSelecionado.lastWateredAt), "dd/MM HH:mm", { locale: ptBR })}
                      </div>

                      {showPartialBanner ? (
                        <PartialState message="Sensor de umidade offline em parte da leitura; o restante do painel continua ativo." />
                      ) : null}
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </section>
          </>
        ) : null}

        <footer className="pb-2 pt-4 text-center text-xs text-muted-foreground">
          HortaMonitor v0.1.0-dashboard · Dados simulados para validação E2E
        </footer>
      </div>
    </main>
  );
}
