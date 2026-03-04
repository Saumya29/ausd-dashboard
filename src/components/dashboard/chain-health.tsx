"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolling } from "@/hooks/use-polling";
import type { HealthResponse } from "@/lib/types";

const STATUS_DOT: Record<string, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
};

export function ChainHealth() {
  const { data, isLoading } = usePolling<HealthResponse>({
    url: "/api/health",
    intervalMs: 60_000,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chain Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chain Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.chains.map((chain) => (
            <div
              key={chain.chainId}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[chain.status]}`} />
                <span className="text-sm font-medium">{chain.chainName}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {chain.latencyMs >= 0 ? `${chain.latencyMs}ms` : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Block #{chain.blockNumber.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
