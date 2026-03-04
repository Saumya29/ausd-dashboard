"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolling } from "@/hooks/use-polling";
import { formatUSD, truncateAddress } from "@/lib/format";
import { ExternalLink, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import type { EventsResponse, EventType } from "@/lib/types";

const EVENT_CONFIG: Record<EventType, { label: string; icon: React.ReactNode; color: string }> = {
  mint: {
    label: "Mint",
    icon: <ArrowUpRight className="h-3.5 w-3.5" />,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
  },
  burn: {
    label: "Burn",
    icon: <ArrowDownRight className="h-3.5 w-3.5" />,
    color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50",
  },
  transfer: {
    label: "Transfer",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
  },
};

export function RecentActivity() {
  const { data, isLoading } = usePolling<EventsResponse>({
    url: "/api/events",
    intervalMs: 15_000,
  });

  if (isLoading || !data) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (data.events.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent mint, burn, or transfer events found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.events.map((event) => {
            const config = EVENT_CONFIG[event.type];
            const sign = event.type === "mint" ? "+" : event.type === "burn" ? "-" : "";

            return (
              <div
                key={`${event.txHash}-${event.type}`}
                className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
                    {config.icon}
                    {config.label}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground tabular-nums">
                      {sign}{formatUSD(event.valueFormatted)}
                      <span className="ml-1 text-muted-foreground font-normal">AUSD</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.chainName}
                      <span className="mx-1 text-border">·</span>
                      <span className="font-mono">{truncateAddress(event.txHash)}</span>
                    </p>
                  </div>
                </div>
                <a
                  href={event.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/40 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
