"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Canteiro } from "@/lib/mock-data";
import {
  Thermometer,
  Droplets,
  Sun,
  Leaf,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CanteiroDetailProps {
  canteiro: Canteiro;
}

export function CanteiroDetail({ canteiro }: CanteiroDetailProps) {
  const chartData = canteiro.readings.map((r) => ({
    time: format(new Date(r.timestamp), "HH:mm"),
    fullTime: format(new Date(r.timestamp), "dd/MM HH:mm", { locale: ptBR }),
    temperatura: r.temperature,
    umidade: r.humidity,
    soloUmidade: r.soilMoisture,
    luz: r.lightLevel,
  }));

  const statusColors = {
    healthy: "text-primary",
    warning: "text-chart-3",
    critical: "text-chart-4",
  };

  const statusLabels = {
    healthy: "Saudável",
    warning: "Atenção",
    critical: "Crítico",
  };

  // Calcula estatísticas
  const avgTemp = (canteiro.readings.reduce((acc, r) => acc + r.temperature, 0) / canteiro.readings.length).toFixed(1);
  const maxTemp = Math.max(...canteiro.readings.map((r) => r.temperature)).toFixed(1);
  const minTemp = Math.min(...canteiro.readings.map((r) => r.temperature)).toFixed(1);
  const avgHumidity = Math.round(canteiro.readings.reduce((acc, r) => acc + r.humidity, 0) / canteiro.readings.length);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{canteiro.plantEmoji}</span>
          <div>
            <h2 className="text-xl font-semibold">{canteiro.name}</h2>
            <p className="text-muted-foreground">{canteiro.plant}</p>
          </div>
        </div>
        <span className={`text-lg font-medium ${statusColors[canteiro.status]}`}>
          {statusLabels[canteiro.status]}
        </span>
      </div>

      {/* Current Values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Thermometer className="h-4 w-4 text-chart-4" />
              <span className="text-xs">Temperatura</span>
            </div>
            <p className="text-2xl font-bold">{canteiro.currentTemp}°C</p>
            <p className="text-xs text-muted-foreground">
              Min {minTemp}° / Max {maxTemp}°
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Droplets className="h-4 w-4 text-chart-2" />
              <span className="text-xs">Umidade Ar</span>
            </div>
            <p className="text-2xl font-bold">{canteiro.currentHumidity}%</p>
            <p className="text-xs text-muted-foreground">Média {avgHumidity}%</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-xs">Umidade Solo</span>
            </div>
            <p className="text-2xl font-bold">{canteiro.currentSoilMoisture}%</p>
            <p className="text-xs text-muted-foreground">
              {canteiro.currentSoilMoisture < 40 ? "Irrigar!" : "Adequado"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Sun className="h-4 w-4 text-chart-3" />
              <span className="text-xs">Luminosidade</span>
            </div>
            <p className="text-2xl font-bold">{canteiro.currentLight}</p>
            <p className="text-xs text-muted-foreground">lux</p>
          </CardContent>
        </Card>
      </div>

      {/* Temperature & Humidity Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Temperatura e Umidade (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="temp"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  domain={["dataMin - 2", "dataMax + 2"]}
                />
                <YAxis
                  yAxisId="humidity"
                  orientation="right"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperatura"
                  stroke="var(--color-chart-4)"
                  strokeWidth={2}
                  dot={false}
                  name="Temperatura (°C)"
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="umidade"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                  name="Umidade (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Soil Moisture Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Umidade do Solo (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="soloUmidade"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#soilGradient)"
                  name="Umidade do Solo (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Plantio</span>
            </div>
            <p className="text-sm font-medium">
              {format(new Date(canteiro.plantedDate), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Colheita Estimada</span>
            </div>
            <p className="text-sm font-medium">
              {canteiro.estimatedHarvest === "Contínuo"
                ? "Contínuo"
                : format(new Date(canteiro.estimatedHarvest), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
