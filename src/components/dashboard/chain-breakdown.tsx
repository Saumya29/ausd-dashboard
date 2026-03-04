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
      <Card>
        <CardHeader>
          <CardTitle>Per-Chain Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        <CardTitle>Per-Chain Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Donut chart */}
        <div className="mx-auto mb-6 h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.chains}
                dataKey="supplyFormatted"
                nameKey="chainName"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
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
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar breakdown */}
        <div className="space-y-3">
          {data.chains.map((chain) => (
            <div key={chain.chainId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{chain.chainName}</span>
                <span className="text-muted-foreground">
                  {formatUSD(chain.supplyFormatted)} ({chain.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(chain.percentage, 0.5)}%`,
                    backgroundColor: chain.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
