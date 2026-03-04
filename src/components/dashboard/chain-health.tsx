"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolling } from "@/hooks/use-polling";
import type { HealthResponse } from "@/lib/types";

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  healthy: { dot: "bg-emerald-500", label: "Healthy" },
  degraded: { dot: "bg-amber-400", label: "Degraded" },
  down: { dot: "bg-red-500", label: "Down" },
};

export function ChainHealth() {
  const { data, isLoading } = usePolling<HealthResponse>({
    url: "/api/health",
    intervalMs: 60_000,
  });

  if (isLoading || !data) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Chain Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Chain Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.chains.map((chain) => {
            const style = STATUS_STYLES[chain.status] ?? STATUS_STYLES.down;
            return (
              <div
                key={chain.chainId}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
                  <span className="text-sm font-medium text-foreground">{chain.chainName}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs tabular-nums text-muted-foreground leading-tight">
                    {chain.latencyMs >= 0 ? `${chain.latencyMs}ms` : "N/A"}
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground leading-tight">
                    #{chain.blockNumber.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
