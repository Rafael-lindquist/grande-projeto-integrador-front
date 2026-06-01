import { DashboardData } from "@/lib/api/types";

export const emptyMock: DashboardData = {
  generatedAt: "2026-05-29T16:00:00Z",
  overview: {
    totalCanteiros: 0,
    avgTemperature: 0,
    avgHumidity: 0,
    totalWaterUsedToday: 0,
    waterSavings: 0,
    canteirosHealthy: 0,
    canteirosWarning: 0,
    canteirosCritical: 0,
  },
  canteiros: [],
  recentAlerts: [],
};
