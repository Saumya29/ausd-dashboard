export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;      // Primary RPC (Alchemy where supported)
  publicRpcUrl: string; // Public fallback (for log queries on Alchemy free tier)
  explorerUrl: string;
  color: string;
  logo: string;
}

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY ?? "";

const ALCHEMY_NETWORKS: Record<number, string> = {
  1: "eth-mainnet",
  42161: "arb-mainnet",
};

function rpc(chainId: number, fallback: string): string {
  const network = ALCHEMY_NETWORKS[chainId];
  if (ALCHEMY_KEY && network) {
    return `https://${network}.g.alchemy.com/v2/${ALCHEMY_KEY}`;
  }
  return fallback;
}

export const CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: "Ethereum",
    rpcUrl: rpc(1, "https://eth.drpc.org"),
    publicRpcUrl: "https://eth.drpc.org",
    explorerUrl: "https://etherscan.io",
    color: "#627EEA",
    logo: "/chains/ethereum.svg",
  },
  {
    id: 42161,
    name: "Arbitrum",
    rpcUrl: rpc(42161, "https://arb1.arbitrum.io/rpc"),
    publicRpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    color: "#28A0F0",
    logo: "/chains/arbitrum.svg",
  },
  {
    id: 43114,
    name: "Avalanche",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    publicRpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowscan.xyz",
    color: "#E84142",
    logo: "/chains/avalanche.svg",
  },
  {
    id: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-bor-rpc.publicnode.com",
    publicRpcUrl: "https://polygon-bor-rpc.publicnode.com",
    explorerUrl: "https://polygonscan.com",
    color: "#8247E5",
    logo: "/chains/polygon.svg",
  },
  {
    id: 5000,
    name: "Mantle",
    rpcUrl: "https://rpc.mantle.xyz",
    publicRpcUrl: "https://rpc.mantle.xyz",
    explorerUrl: "https://mantlescan.xyz",
    color: "#65B3AE",
    logo: "/chains/mantle.svg",
  },
  {
    id: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    publicRpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    color: "#0052FF",
    logo: "/chains/base.svg",
  },
  {
    id: 56,
    name: "BSC",
    rpcUrl: "https://bsc-dataseed.binance.org",
    publicRpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    color: "#F0B90B",
    logo: "/chains/bsc.svg",
  },
  {
    id: 747474,
    name: "Katana",
    rpcUrl: "https://rpc.katana.network",
    publicRpcUrl: "https://rpc.katana.network",
    explorerUrl: "https://katanascan.com",
    color: "#FF6B35",
    logo: "/chains/katana.svg",
  },
];

export function getChain(chainId: number): ChainConfig | undefined {
  return CHAINS.find((c) => c.id === chainId);
}

export function explorerTxUrl(chain: ChainConfig, txHash: string): string {
  return `${chain.explorerUrl}/tx/${txHash}`;
}

export function explorerAddressUrl(chain: ChainConfig, address: string): string {
  return `${chain.explorerUrl}/address/${address}`;
}
