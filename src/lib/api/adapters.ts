import { DashboardData } from "./types";

export function normalizeDashboardData(data: DashboardData): DashboardData {
  return {
    ...data,
    canteiros: data.canteiros.map((canteiro) => ({
      ...canteiro,
      readings: canteiro.readings.map((reading) => ({
        ...reading,
        humidity: Number.isFinite(reading.humidity ?? NaN) ? reading.humidity : null,
        soilMoisture: Number.isFinite(reading.soilMoisture ?? NaN) ? reading.soilMoisture : null,
        lightLevel: Number.isFinite(reading.lightLevel ?? NaN) ? reading.lightLevel : null,
      })),
    })),
  };
}
