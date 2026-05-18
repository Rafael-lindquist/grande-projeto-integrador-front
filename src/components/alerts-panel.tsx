"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentAlerts } from "@/lib/mock-data";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-chart-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-3" />;
      default:
        return <Info className="h-4 w-4 text-chart-2" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-chart-4/10 border-chart-4/30";
      case "warning":
        return "bg-chart-3/10 border-chart-3/30";
      default:
        return "bg-chart-2/10 border-chart-2/30";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">Alertas Recentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertBg(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(alert.timestamp), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
