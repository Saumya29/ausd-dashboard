import { createPublicClient, http, parseAbiItem } from "viem";
import { CHAINS } from "./chains";
import { AUSD_ADDRESS, ZERO_ADDRESS, LARGE_TRANSFER_THRESHOLD } from "./ausd";
import { formatSupply } from "./format";
import { explorerTxUrl } from "./chains";
import { getCached, setCache } from "./cache";
import type { AUSDEvent, EventType, EventsResponse } from "./types";

const RPC_TIMEOUT = 15_000;

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Approximate blocks to look back (~24 hours per chain)
const BLOCK_LOOKBACK: Record<number, bigint> = {
  1: 7200n,       // Ethereum: ~12s blocks → 7200 blocks ≈ 24h
  42161: 300000n,  // Arbitrum: ~0.25s blocks
  43114: 43200n,   // Avalanche: ~2s blocks
  137: 40000n,     // Polygon: ~2s blocks
  5000: 43200n,    // Mantle: ~2s blocks
  8453: 43200n,    // Base: ~2s blocks
  56: 28800n,      // BSC: ~3s blocks
  747474: 43200n,  // Katana: ~2s blocks
};

async function fetchChainEvents(chain: (typeof CHAINS)[number]): Promise<AUSDEvent[]> {
  const client = createPublicClient({
    transport: http(chain.publicRpcUrl, { timeout: RPC_TIMEOUT }),
  });

  const blockNumber = await withTimeout(client.getBlockNumber(), RPC_TIMEOUT);
  const lookback = BLOCK_LOOKBACK[chain.id] ?? 5000n;
  const fromBlock = blockNumber > lookback ? blockNumber - lookback : 0n;

  const logs = await withTimeout(
    client.getLogs({
      address: AUSD_ADDRESS,
      event: TRANSFER_EVENT,
      fromBlock,
      toBlock: blockNumber,
    }),
    RPC_TIMEOUT
  );

  const events: AUSDEvent[] = [];

  for (const log of logs) {
    const from = log.args.from as string;
    const to = log.args.to as string;
    const value = log.args.value as bigint;

    let type: EventType;
    if (from.toLowerCase() === ZERO_ADDRESS) {
      type = "mint";
    } else if (to.toLowerCase() === ZERO_ADDRESS) {
      type = "burn";
    } else if (value >= LARGE_TRANSFER_THRESHOLD) {
      type = "transfer";
    } else {
      continue;
    }

    events.push({
      type,
      chainId: chain.id,
      chainName: chain.name,
      from,
      to,
      value: value.toString(),
      valueFormatted: formatSupply(value),
      txHash: log.transactionHash!,
      blockNumber: Number(log.blockNumber),
      explorerUrl: explorerTxUrl(chain, log.transactionHash!),
    });
  }

  return events;
}

export async function fetchRecentEvents(): Promise<EventsResponse> {
  const cached = getCached<EventsResponse>("events");
  if (cached) return cached;

  const results = await Promise.allSettled(
    CHAINS.map((chain) => fetchChainEvents(chain))
  );

  const allEvents: AUSDEvent[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      allEvents.push(...result.value);
    } else {
      console.error(`Failed to fetch events for ${CHAINS[i].name}:`, result.reason);
    }
  }

  allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

  const response: EventsResponse = {
    events: allEvents.slice(0, 20),
    updatedAt: new Date().toISOString(),
  };

  setCache("events", response, 15_000);
  return response;
}
