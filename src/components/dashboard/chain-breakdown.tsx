"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolling } from "@/hooks/use-polling";
import { formatUSD } from "@/lib/format";
import type { SupplyResponse } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function ChainBreakdown() {
  const { data, isLoading } = usePolling<SupplyResponse>({
    url: "/api/supply",
    intervalMs: 30_000,
  });

  if (isLoading || !data) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Per-Chain Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Per-Chain Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Donut chart */}
          <div className="shrink-0 h-36 w-36 sm:h-44 sm:w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chains}
                  dataKey="supplyFormatted"
                  nameKey="chainName"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {data.chains.map((chain) => (
                    <Cell key={chain.chainId} fill={chain.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatUSD(value as number), "Supply"]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--card-foreground)",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar breakdown */}
          <div className="flex-1 w-full space-y-3.5">
            {data.chains.map((chain) => (
              <div key={chain.chainId}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: chain.color }}
                    />
                    <span className="text-sm font-medium text-foreground">{chain.chainName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {chain.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(chain.percentage, 0.5)}%`,
                      backgroundColor: chain.color,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {formatUSD(chain.supplyFormatted)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
