"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolling } from "@/hooks/use-polling";
import { formatNumber } from "@/lib/format";
import { RefreshCw } from "lucide-react";
import type { SupplyResponse } from "@/lib/types";

export function TotalSupplyCard() {
  const { data, isLoading } = usePolling<SupplyResponse>({
    url: "/api/supply",
    intervalMs: 30_000,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Skeleton className="mx-auto mb-2 h-4 w-32" />
          <Skeleton className="mx-auto mb-4 h-10 w-64" />
          <Skeleton className="mx-auto h-3 w-48" />
        </CardContent>
      </Card>
    );
  }

  const updatedAt = new Date(data.updatedAt);
  const secondsAgo = Math.floor((Date.now() - updatedAt.getTime()) / 1000);

  return (
    <Card className="overflow-hidden">
      <CardContent className="py-8 text-center">
        <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Total AUSD Supply
        </p>
        <p className="text-4xl font-bold tracking-tight sm:text-5xl">
          ${formatNumber(data.totalSupply)}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>
            Across {data.chains.filter((c) => c.supplyFormatted > 0).length} chains
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Updated {secondsAgo < 60 ? `${secondsAgo}s` : `${Math.floor(secondsAgo / 60)}m`} ago
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
