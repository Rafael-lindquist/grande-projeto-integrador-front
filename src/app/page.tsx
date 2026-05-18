"use client";

import { useState } from "react";
import { canteiros } from "@/lib/mock-data";
import { CanteiroCard } from "@/components/canteiro-card";
import { CanteiroDetail } from "@/components/canteiro-detail";
import { StatsOverview } from "@/components/stats-overview";
import { AlertsPanel } from "@/components/alerts-panel";
import { Sprout, LayoutGrid, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [selectedCanteiroId, setSelectedCanteiroId] = useState<string | null>(null);
  const [lastUpdate] = useState(new Date());

  const selectedCanteiro = canteiros.find((c) => c.id === selectedCanteiroId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">HortaMonitor</h1>
                <p className="text-xs text-muted-foreground">
                  Sistema de Monitoramento Inteligente
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>
                  Atualizado: {format(lastUpdate, "HH:mm:ss", { locale: ptBR })}
                </span>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Canteiros Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Canteiros</h2>
              <span className="text-xs text-muted-foreground">
                ({canteiros.length} total)
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {canteiros.map((canteiro) => (
                <CanteiroCard
                  key={canteiro.id}
                  canteiro={canteiro}
                  onClick={() => setSelectedCanteiroId(
                    selectedCanteiroId === canteiro.id ? null : canteiro.id
                  )}
                  isSelected={selectedCanteiroId === canteiro.id}
                />
              ))}
            </div>

            {/* Selected Canteiro Detail */}
            {selectedCanteiro && (
              <div className="mt-6 p-4 rounded-xl bg-card border border-border">
                <CanteiroDetail canteiro={selectedCanteiro} />
              </div>
            )}
          </div>

          {/* Right Column - Stats & Alerts */}
          <div className="space-y-6">
            <StatsOverview />
            <AlertsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>HortaMonitor v1.0 - Sistema IoT para Agricultura Inteligente</p>
            <p>
              Dados atualizados a cada 5 minutos • {" "}
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
