'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDashboardData } from "@/lib/api/dashboard";
import { DashboardData, DashboardScenario } from "@/lib/api/types";

interface UseDashboardOptions {
  scenario?: DashboardScenario;
}

export function useDashboard({ scenario = "success" }: UseDashboardOptions = {}) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardData(scenario);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha inesperada ao carregar o dashboard.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [scenario]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const selectedCanteiro = useMemo(() => {
    return data?.canteiros?.[0] ?? null;
  }, [data]);

  return {
    data,
    loading,
    error,
    retry: fetchData,
    selectedCanteiro,
  };
}
