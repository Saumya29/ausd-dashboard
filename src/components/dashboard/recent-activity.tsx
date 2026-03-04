"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolling } from "@/hooks/use-polling";
import { formatUSD, truncateAddress } from "@/lib/format";
import { ExternalLink } from "lucide-react";
import type { EventsResponse, EventType } from "@/lib/types";

const EVENT_CONFIG: Record<EventType, { label: string; className: string }> = {
  mint: {
    label: "MINT",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  burn: {
    label: "BURN",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  transfer: {
    label: "TRANSFER",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
};

export function RecentActivity() {
  const { data, isLoading } = usePolling<EventsResponse>({
    url: "/api/events",
    intervalMs: 15_000,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (data.events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent mint, burn, or large transfer events found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.events.map((event) => {
            const config = EVENT_CONFIG[event.type];
            const sign = event.type === "mint" ? "+" : event.type === "burn" ? "-" : "";

            return (
              <div
                key={`${event.txHash}-${event.type}`}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={config.className}>
                    {config.label}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">
                      {sign}{formatUSD(event.valueFormatted)} AUSD
                    </p>
                    <p className="text-xs text-muted-foreground">
                      on {event.chainName} · {truncateAddress(event.txHash)}
                    </p>
                  </div>
                </div>
                <a
                  href={event.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
