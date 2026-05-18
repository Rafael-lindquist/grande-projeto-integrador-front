"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hortaStats, irrigationHistory } from "@/lib/mock-data";
import {
  Leaf,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function StatsOverview() {
  const chartData = irrigationHistory.map((item) => ({
    day: format(new Date(item.date), "EEE", { locale: ptBR }),
    litros: item.liters,
  }));

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Canteiros</p>
                <p className="text-2xl font-bold">{hortaStats.totalCanteiros}</p>
              </div>
              <Leaf className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Temp. Média</p>
                <p className="text-2xl font-bold">{hortaStats.avgTemperature}°C</p>
              </div>
              <Thermometer className="h-8 w-8 text-chart-4 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Umidade Média</p>
                <p className="text-2xl font-bold">{hortaStats.avgHumidity}%</p>
              </div>
              <Droplets className="h-8 w-8 text-chart-2 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Água Hoje</p>
                <p className="text-2xl font-bold">{hortaStats.totalWaterUsedToday}L</p>
              </div>
              <div className="flex items-center text-primary text-xs">
                <TrendingDown className="h-4 w-4 mr-1" />
                -{hortaStats.waterSavings}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Status dos Canteiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <span className="font-bold">{hortaStats.canteirosHealthy}</span> Saudáveis
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-3" />
              <span className="text-sm">
                <span className="font-bold">{hortaStats.canteirosWarning}</span> Atenção
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-chart-4" />
              <span className="text-sm">
                <span className="font-bold">{hortaStats.canteirosCritical}</span> Críticos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Usage Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Consumo de Água (7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}L`, "Consumo"]}
                />
                <Bar
                  dataKey="litros"
                  fill="var(--color-chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
