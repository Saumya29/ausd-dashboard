// AUSD contract — same address on all chains via CREATE2
export const AUSD_ADDRESS = "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a" as const;

export const AUSD_DECIMALS = 6;

// Minimal ERC-20 ABI for the calls we need
export const AUSD_ABI = [
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

// Zero address — used to detect mint (from) and burn (to)
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Threshold for "large transfer" events (1,000 AUSD)
export const LARGE_TRANSFER_THRESHOLD = 1_000n * 10n ** 6n;
