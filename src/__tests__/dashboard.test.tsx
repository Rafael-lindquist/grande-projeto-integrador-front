import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/page";
import { getDashboardData } from "@/lib/api/dashboard";

jest.mock("@/lib/api/dashboard", () => ({
  getDashboardData: jest.fn(),
}));

const mockedGetDashboardData = getDashboardData as jest.MockedFunction<typeof getDashboardData>;

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o estado de loading inicialmente", async () => {
    mockedGetDashboardData.mockImplementation(
      () => new Promise(() => {})
    );

    render(<DashboardPage />);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza o estado feliz com métricas reais", async () => {
    mockedGetDashboardData.mockResolvedValueOnce((await import("@/mocks/success")).successMock);

    render(<DashboardPage />);

    expect(await screen.findByText(/Visão Geral do Dashboard/i)).toBeInTheDocument();
    expect(await screen.findByText(/23\.4°C/)).toBeInTheDocument();
    expect(await screen.findByText(/Umidade média/i)).toBeInTheDocument();
  });

  it("renderiza estado vazio", async () => {
    mockedGetDashboardData.mockResolvedValueOnce((await import("@/mocks/empty")).emptyMock);

    render(<DashboardPage />);

    expect(await screen.findByText(/Nenhum dado disponível/i)).toBeInTheDocument();
  });

  it("renderiza estado de erro e permite tentar novamente", async () => {
    mockedGetDashboardData
      .mockRejectedValueOnce(new Error("Não foi possível carregar os dados do dashboard."))
      .mockResolvedValueOnce((await import("@/mocks/success")).successMock);

    render(<DashboardPage />);

    expect(await screen.findByText(/Erro ao carregar o dashboard/i)).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /tentar novamente/i });
    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.queryByText(/Erro ao carregar o dashboard/i)).not.toBeInTheDocument();
    });
  });

  it("permite alternar para cenário parcial", async () => {
    mockedGetDashboardData.mockResolvedValue((await import("@/mocks/success")).successMock);

    render(<DashboardPage />);

    const partialButton = await screen.findByRole("button", { name: /Parcial/i });
    await userEvent.click(partialButton);

    expect(await screen.findByText(/Sensor de umidade offline/i)).toBeInTheDocument();
  });
});
