import { normalizeDashboardData } from "./adapters";
import { DashboardData, DashboardScenario } from "./types";
import { emptyMock } from "@/mocks/empty";
import { errorMessage } from "@/mocks/error";
import { partialMock } from "@/mocks/partial";
import { successMock } from "@/mocks/success";

const DELAY_MS = 700;

export async function getDashboardData(
  scenario: DashboardScenario = "partial",
): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  switch (scenario) {
    case "loading":
      await new Promise((resolve) => setTimeout(resolve, 3000));
  return normalizeDashboardData(successMock);
    case "success":
      return normalizeDashboardData({
      ...successMock,

      generatedAt: new Date().toISOString(),

      overview: {
        ...successMock.overview,

        avgTemperature: Number(
          (24 + Math.random() * 3).toFixed(1)
        ),

        avgHumidity: Math.floor(
          60 + Math.random() * 10
        ),

        totalWaterUsedToday: Math.floor(
          35 + Math.random() * 15
        ),
      },
    });
    case "empty":
      return normalizeDashboardData(emptyMock);
    case "partial":
      return normalizeDashboardData(partialMock);
    case "error":
      throw new Error(errorMessage);
    default:
      return normalizeDashboardData(successMock);
  }
}
