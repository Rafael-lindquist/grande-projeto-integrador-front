"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Canteiro } from "@/lib/mock-data";
import { Thermometer, Droplets, Sun, Leaf } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CanteiroCardProps {
  canteiro: Canteiro;
  onClick: () => void;
  isSelected: boolean;
}

export function CanteiroCard({ canteiro, onClick, isSelected }: CanteiroCardProps) {
  const statusColors = {
    healthy: "bg-primary/20 border-primary/50",
    warning: "bg-chart-3/20 border-chart-3/50",
    critical: "bg-chart-4/20 border-chart-4/50",
  };

  const statusBadgeColors = {
    healthy: "bg-primary text-primary-foreground",
    warning: "bg-chart-3 text-background",
    critical: "bg-chart-4 text-foreground",
  };

  const statusLabels = {
    healthy: "Saudável",
    warning: "Atenção",
    critical: "Crítico",
  };

  // Prepara dados para o mini gráfico
  const chartData = canteiro.readings.slice(-12).map((r) => ({
    time: format(new Date(r.timestamp), "HH:mm"),
    temp: r.temperature,
    humidity: r.humidity,
  }));

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
        isSelected ? "ring-2 ring-primary" : ""
      } ${statusColors[canteiro.status]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{canteiro.plantEmoji}</span>
            <div>
              <CardTitle className="text-sm font-medium">{canteiro.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{canteiro.plant}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeColors[canteiro.status]}`}>
            {statusLabels[canteiro.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Thermometer className="h-3.5 w-3.5 text-chart-4" />
            <span className="text-sm font-medium">{canteiro.currentTemp}°C</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-chart-2" />
            <span className="text-sm font-medium">{canteiro.currentHumidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-medium">{canteiro.currentSoilMoisture}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-chart-3" />
            <span className="text-sm font-medium">{canteiro.currentLight} lux</span>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${canteiro.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="temp"
                stroke="var(--color-primary)"
                strokeWidth={1.5}
                fill={`url(#gradient-${canteiro.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Irrigado: {format(new Date(canteiro.lastWatered), "dd/MM HH:mm", { locale: ptBR })}
        </p>
      </CardContent>
    </Card>
  );
}
