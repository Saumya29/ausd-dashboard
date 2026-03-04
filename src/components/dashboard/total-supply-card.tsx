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
      <Card className="border-border">
        <CardContent className="py-12 text-center">
          <Skeleton className="mx-auto mb-3 h-3 w-28" />
          <Skeleton className="mx-auto mb-4 h-14 w-72" />
          <Skeleton className="mx-auto h-3 w-44" />
        </CardContent>
      </Card>
    );
  }

  const updatedAt = new Date(data.updatedAt);
  const secondsAgo = Math.floor((Date.now() - updatedAt.getTime()) / 1000);

  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="py-12 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Total AUSD Supply
        </p>
        <p className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl font-sans">
          ${formatNumber(data.totalSupply)}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span>{data.chains.filter((c) => c.supplyFormatted > 0).length} active chains</span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" />
            {secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
