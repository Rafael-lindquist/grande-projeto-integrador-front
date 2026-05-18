// Dados mockados realistas para sensores de horta

export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
}

export interface Canteiro {
  id: string;
  name: string;
  plant: string;
  plantEmoji: string;
  status: "healthy" | "warning" | "critical";
  currentTemp: number;
  currentHumidity: number;
  currentSoilMoisture: number;
  currentLight: number;
  lastWatered: string;
  plantedDate: string;
  estimatedHarvest: string;
  readings: SensorReading[];
}

// Gera timestamps das últimas 24 horas
function generateTimestamps(count: number): string[] {
  const now = new Date();
  const timestamps: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    timestamps.push(date.toISOString());
  }
  return timestamps;
}

// Gera leituras realistas de sensores
function generateReadings(
  baseTemp: number,
  baseHumidity: number,
  baseSoilMoisture: number,
  baseLight: number
): SensorReading[] {
  const timestamps = generateTimestamps(24);
  return timestamps.map((timestamp, index) => {
    const hour = new Date(timestamp).getHours();
    // Variação de temperatura ao longo do dia
    const tempVariation = Math.sin(((hour - 6) * Math.PI) / 12) * 5;
    // Luz varia muito com o horário
    const lightVariation = hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) * Math.PI) / 12) * 600 : 0;
    
    return {
      timestamp,
      temperature: Math.round((baseTemp + tempVariation + (Math.random() - 0.5) * 2) * 10) / 10,
      humidity: Math.round(Math.min(100, Math.max(30, baseHumidity + (Math.random() - 0.5) * 10))),
      soilMoisture: Math.round(Math.min(100, Math.max(20, baseSoilMoisture - index * 0.5 + (Math.random() - 0.5) * 5))),
      lightLevel: Math.round(Math.max(0, baseLight + lightVariation + (Math.random() - 0.5) * 100)),
    };
  });
}

export const canteiros: Canteiro[] = [
  {
    id: "canteiro-1",
    name: "Canteiro A1",
    plant: "Tomates",
    plantEmoji: "🍅",
    status: "healthy",
    currentTemp: 24.5,
    currentHumidity: 68,
    currentSoilMoisture: 72,
    currentLight: 850,
    lastWatered: "2026-05-18T06:30:00Z",
    plantedDate: "2026-03-15",
    estimatedHarvest: "2026-06-20",
    readings: generateReadings(24, 65, 75, 400),
  },
  {
    id: "canteiro-2",
    name: "Canteiro A2",
    plant: "Alface",
    plantEmoji: "🥬",
    status: "healthy",
    currentTemp: 22.8,
    currentHumidity: 75,
    currentSoilMoisture: 68,
    currentLight: 620,
    lastWatered: "2026-05-18T07:00:00Z",
    plantedDate: "2026-04-20",
    estimatedHarvest: "2026-05-25",
    readings: generateReadings(22, 72, 70, 350),
  },
  {
    id: "canteiro-3",
    name: "Canteiro B1",
    plant: "Cenouras",
    plantEmoji: "🥕",
    status: "warning",
    currentTemp: 26.2,
    currentHumidity: 58,
    currentSoilMoisture: 45,
    currentLight: 920,
    lastWatered: "2026-05-17T18:00:00Z",
    plantedDate: "2026-02-10",
    estimatedHarvest: "2026-05-30",
    readings: generateReadings(25, 55, 50, 450),
  },
  {
    id: "canteiro-4",
    name: "Canteiro B2",
    plant: "Pimentões",
    plantEmoji: "🫑",
    status: "healthy",
    currentTemp: 25.1,
    currentHumidity: 62,
    currentSoilMoisture: 65,
    currentLight: 780,
    lastWatered: "2026-05-18T05:45:00Z",
    plantedDate: "2026-03-01",
    estimatedHarvest: "2026-06-15",
    readings: generateReadings(25, 60, 68, 420),
  },
  {
    id: "canteiro-5",
    name: "Canteiro C1",
    plant: "Morangos",
    plantEmoji: "🍓",
    status: "critical",
    currentTemp: 28.5,
    currentHumidity: 48,
    currentSoilMoisture: 32,
    currentLight: 1050,
    lastWatered: "2026-05-16T14:00:00Z",
    plantedDate: "2026-01-20",
    estimatedHarvest: "2026-05-22",
    readings: generateReadings(27, 45, 35, 500),
  },
  {
    id: "canteiro-6",
    name: "Canteiro C2",
    plant: "Manjericão",
    plantEmoji: "🌿",
    status: "healthy",
    currentTemp: 23.8,
    currentHumidity: 70,
    currentSoilMoisture: 78,
    currentLight: 580,
    lastWatered: "2026-05-18T08:15:00Z",
    plantedDate: "2026-04-05",
    estimatedHarvest: "Contínuo",
    readings: generateReadings(23, 68, 80, 320),
  },
];

// Estatísticas gerais da horta
export const hortaStats = {
  totalCanteiros: canteiros.length,
  canteirosHealthy: canteiros.filter((c) => c.status === "healthy").length,
  canteirosWarning: canteiros.filter((c) => c.status === "warning").length,
  canteirosCritical: canteiros.filter((c) => c.status === "critical").length,
  avgTemperature: Math.round((canteiros.reduce((acc, c) => acc + c.currentTemp, 0) / canteiros.length) * 10) / 10,
  avgHumidity: Math.round(canteiros.reduce((acc, c) => acc + c.currentHumidity, 0) / canteiros.length),
  avgSoilMoisture: Math.round(canteiros.reduce((acc, c) => acc + c.currentSoilMoisture, 0) / canteiros.length),
  totalWaterUsedToday: 47.5, // litros
  waterSavings: 23, // % comparado ao mês anterior
};

// Histórico de irrigação
export const irrigationHistory = [
  { date: "2026-05-12", liters: 52.3 },
  { date: "2026-05-13", liters: 48.7 },
  { date: "2026-05-14", liters: 55.2 },
  { date: "2026-05-15", liters: 41.8 },
  { date: "2026-05-16", liters: 49.5 },
  { date: "2026-05-17", liters: 44.2 },
  { date: "2026-05-18", liters: 47.5 },
];

// Alertas recentes
export const recentAlerts = [
  {
    id: 1,
    type: "critical",
    message: "Umidade do solo baixa no Canteiro C1 (Morangos)",
    timestamp: "2026-05-18T10:30:00Z",
    canteiroId: "canteiro-5",
  },
  {
    id: 2,
    type: "warning",
    message: "Temperatura elevada no Canteiro B1 (Cenouras)",
    timestamp: "2026-05-18T09:15:00Z",
    canteiroId: "canteiro-3",
  },
  {
    id: 3,
    type: "info",
    message: "Irrigação automática concluída no Canteiro A1",
    timestamp: "2026-05-18T06:30:00Z",
    canteiroId: "canteiro-1",
  },
  {
    id: 4,
    type: "info",
    message: "Previsão de chuva para amanhã - irrigação será reduzida",
    timestamp: "2026-05-18T05:00:00Z",
    canteiroId: null,
  },
];
