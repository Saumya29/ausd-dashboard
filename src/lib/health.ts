import { createPublicClient, http } from "viem";
import { CHAINS } from "./chains";
import { getCached, setCache } from "./cache";
import type { ChainHealth, HealthResponse } from "./types";

const RPC_TIMEOUT = 8_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function checkChainHealth(chain: (typeof CHAINS)[number]): Promise<ChainHealth> {
  const client = createPublicClient({
    transport: http(chain.rpcUrl, { timeout: RPC_TIMEOUT }),
  });

  const start = Date.now();
  const blockNumber = await withTimeout(client.getBlockNumber(), RPC_TIMEOUT);
  const latencyMs = Date.now() - start;

  return {
    chainId: chain.id,
    chainName: chain.name,
    status: latencyMs < 2000 ? "healthy" : latencyMs < 5000 ? "degraded" : "down",
    latencyMs,
    blockNumber: Number(blockNumber),
    color: chain.color,
  };
}

export async function checkHealth(): Promise<HealthResponse> {
  const cached = getCached<HealthResponse>("health");
  if (cached) return cached;

  const results = await Promise.allSettled(
    CHAINS.map((chain) => checkChainHealth(chain))
  );

  const chains: ChainHealth[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      chains.push(result.value);
    } else {
      chains.push({
        chainId: CHAINS[i].id,
        chainName: CHAINS[i].name,
        status: "down",
        latencyMs: -1,
        blockNumber: 0,
        color: CHAINS[i].color,
      });
      console.error(`Health check failed for ${CHAINS[i].name}:`, result.reason);
    }
  }

  const response: HealthResponse = {
    chains,
    updatedAt: new Date().toISOString(),
  };

  setCache("health", response, 60_000);
  return response;
}
