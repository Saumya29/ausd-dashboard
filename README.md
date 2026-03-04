# AUSD Multi-Chain Dashboard

Real-time dashboard tracking [Agora's](https://agora.finance) AUSD stablecoin supply and activity across 8 EVM chains.

## Chains Tracked

| Chain | Supply | Explorer |
|-------|--------|----------|
| Ethereum | ~$68M | etherscan.io |
| Avalanche | ~$11M | snowscan.xyz |
| Katana | ~$9M | katanascan.com |
| Mantle | ~$5M | mantlescan.xyz |
| Polygon | ~$5M | polygonscan.com |
| Base | ~$134K | basescan.org |
| BSC | ~$5.5K | bscscan.com |
| Arbitrum | ~$500 | arbiscan.io |

**Total: ~$98.8M AUSD** (live data via on-chain RPC calls)

## Features

- **Total supply hero card** with auto-refresh (30s polling)
- **Per-chain breakdown** with donut chart (Recharts) and progress bars
- **Recent activity feed** — mint, burn, and large transfer events with explorer links
- **Chain health monitor** — RPC latency and block heights
- **Dark/light mode** toggle
- **Responsive** — works on mobile
- **Loading skeletons** while data fetches

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS** + **shadcn/ui**
- **viem** for multi-chain RPC calls
- **Recharts** for supply distribution chart
- **next-themes** for dark/light mode

## Architecture

```
Client (polling) → API Routes → RPC Calls (parallel via Promise.allSettled)
                                  ├── Alchemy (Ethereum, Arbitrum)
                                  └── Public RPCs (all other chains)
```

- API routes make RPC calls server-side (RPCs never exposed to client)
- `Promise.allSettled` for resilience — one chain failing doesn't break others
- In-memory cache (30s supply, 15s events, 60s health)
- 8s timeout per chain with `withTimeout()` wrapper

## Getting Started

```bash
# Install dependencies
pnpm install

# (Optional) Add Alchemy API key for faster Ethereum/Arbitrum RPCs
cp .env.example .env.local
# Edit .env.local with your key from https://dashboard.alchemy.com/

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

| Route | Description | Cache |
|-------|-------------|-------|
| `GET /api/supply` | Per-chain AUSD totalSupply | 30s |
| `GET /api/events` | Recent mint/burn/transfer events | 15s |
| `GET /api/health` | RPC latency + block numbers | 60s |

## Key Insight

AUSD uses the same contract address on all chains via CREATE2:
`0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a` (6 decimals)

## Deploy

Deploy to Vercel — no configuration needed. Set `ALCHEMY_API_KEY` in Vercel environment variables for best performance.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Saumya29/ausd-dashboard)

## Author

Built by **Saumya Tiwari** as a portfolio piece for Agora.
