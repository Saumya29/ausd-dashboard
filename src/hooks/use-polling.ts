"use client";

import { useState, useEffect, useCallback } from "react";

interface UsePollingOptions<T> {
  url: string;
  intervalMs: number;
  enabled?: boolean;
}

interface UsePollingResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function usePolling<T>({
  url,
  intervalMs,
  enabled = true,
}: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;

    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [fetchData, intervalMs, enabled]);

  return { data, error, isLoading, refresh: fetchData };
}
