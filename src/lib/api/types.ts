export type DashboardScenario = "loading" | "success" | "empty" | "error" | "partial";

export type SensorStatus = "online" | "offline";

export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number | null;
  soilMoisture: number | null;
  lightLevel: number | null;
  irrigationOn: boolean;
  sensorStatus: SensorStatus;
}

export interface AlertItem {
  id: string;
  kind: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
}

export interface CanteiroSnapshot {
  id: string;
  name: string;
  plant: string;
  emoji: string;
  status: "healthy" | "warning" | "critical";
  currentTemp: number;
  currentHumidity: number | null;
  currentSoilMoisture: number | null;
  currentLight: number | null;
  lastWateredAt: string;
  readings: SensorReading[];
  alerts: AlertItem[];
}

export interface DashboardData {
  generatedAt: string;
  overview: {
    totalCanteiros: number;
    avgTemperature: number;
    avgHumidity: number;
    totalWaterUsedToday: number;
    waterSavings: number;
    canteirosHealthy: number;
    canteirosWarning: number;
    canteirosCritical: number;
  };
  canteiros: CanteiroSnapshot[];
  recentAlerts: AlertItem[];
}
