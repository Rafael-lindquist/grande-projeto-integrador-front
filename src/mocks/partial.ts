import { DashboardData } from "@/lib/api/types";

export const partialMock: DashboardData = {
  generatedAt: "2026-05-29T16:00:00Z",
  overview: {
    totalCanteiros: 1,
    avgTemperature: 25,
    avgHumidity: 0,
    totalWaterUsedToday: 18,
    waterSavings: 9,
    canteirosHealthy: 0,
    canteirosWarning: 1,
    canteirosCritical: 0,
  },
  canteiros: [
    {
      id: "canteiro-01",
      name: "Couve",
      plant: "Brassica oleracea",
      emoji: "🥦",
      status: "warning",
      currentTemp: 25.0,
      currentHumidity: null,
      currentSoilMoisture: 39,
      currentLight: 11200,
      lastWateredAt: "2026-05-29T14:10:00Z",
      readings: [
        { timestamp: "2026-05-29T13:00:00Z", temperature: 24.8, humidity: 68, soilMoisture: 44, lightLevel: 10500, irrigationOn: false, sensorStatus: "online" },
        { timestamp: "2026-05-29T14:00:00Z", temperature: 25.0, humidity: null, soilMoisture: 41, lightLevel: 11000, irrigationOn: false, sensorStatus: "offline" },
        { timestamp: "2026-05-29T15:00:00Z", temperature: 25.0, humidity: null, soilMoisture: 39, lightLevel: 11200, irrigationOn: false, sensorStatus: "offline" },
      ],
      alerts: [
        { id: "p1", kind: "critical", message: "Sensor de umidade offline no canteiro 01.", timestamp: "2026-05-29T15:00:00Z" },
      ],
    },
  ],
  recentAlerts: [
    { id: "p1", kind: "critical", message: "Sensor de umidade offline no canteiro 01.", timestamp: "2026-05-29T15:00:00Z" },
  ],
};
