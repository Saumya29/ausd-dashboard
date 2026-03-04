import { createPublicClient, http } from "viem";
import { CHAINS } from "./chains";
import { AUSD_ADDRESS, AUSD_ABI } from "./ausd";
import { formatSupply } from "./format";
import { getCached, setCache } from "./cache";
import type { ChainSupply, SupplyResponse } from "./types";

const RPC_TIMEOUT = 8_000; // 8 seconds max per chain

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function fetchChainSupply(chain: (typeof CHAINS)[number]): Promise<ChainSupply> {
  const client = createPublicClient({
    transport: http(chain.rpcUrl, { timeout: RPC_TIMEOUT }),
  });

  const rawSupply = await withTimeout(
    client.readContract({
      address: AUSD_ADDRESS,
      abi: AUSD_ABI,
      functionName: "totalSupply",
    }) as Promise<bigint>,
    RPC_TIMEOUT
  );

  return {
    chainId: chain.id,
    chainName: chain.name,
    supply: rawSupply.toString(),
    supplyFormatted: formatSupply(rawSupply),
    percentage: 0,
    color: chain.color,
  };
}

export async function fetchAllSupply(): Promise<SupplyResponse> {
  const cached = getCached<SupplyResponse>("supply");
  if (cached) return cached;

  const results = await Promise.allSettled(
    CHAINS.map((chain) => fetchChainSupply(chain))
  );

  const chains: ChainSupply[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      chains.push(result.value);
    } else {
      const chain = CHAINS[i];
      chains.push({
        chainId: chain.id,
        chainName: chain.name,
        supply: "0",
        supplyFormatted: 0,
        percentage: 0,
        color: chain.color,
      });
      console.error(`Failed to fetch supply for ${chain.name}:`, result.reason);
    }
  }

  const totalSupply = chains.reduce((sum, c) => sum + c.supplyFormatted, 0);

  for (const chain of chains) {
    chain.percentage = totalSupply > 0 ? (chain.supplyFormatted / totalSupply) * 100 : 0;
  }

  chains.sort((a, b) => b.supplyFormatted - a.supplyFormatted);

  const response: SupplyResponse = {
    totalSupply,
    chains,
    updatedAt: new Date().toISOString(),
  };

  setCache("supply", response, 30_000); // cache for 30s
  return response;
}
