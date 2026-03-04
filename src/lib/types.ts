export interface ChainSupply {
  chainId: number;
  chainName: string;
  supply: string; // BigInt as string for JSON serialization
  supplyFormatted: number; // Human-readable number (no decimals of wei)
  percentage: number;
  color: string;
}

export interface SupplyResponse {
  totalSupply: number;
  chains: ChainSupply[];
  updatedAt: string; // ISO timestamp
}

export type EventType = "mint" | "burn" | "transfer";

export interface AUSDEvent {
  type: EventType;
  chainId: number;
  chainName: string;
  from: string;
  to: string;
  value: string;
  valueFormatted: number;
  txHash: string;
  blockNumber: number;
  explorerUrl: string;
}

export interface EventsResponse {
  events: AUSDEvent[];
  updatedAt: string;
}

export interface ChainHealth {
  chainId: number;
  chainName: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  blockNumber: number;
  color: string;
}

export interface HealthResponse {
  chains: ChainHealth[];
  updatedAt: string;
}
