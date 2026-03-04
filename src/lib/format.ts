import { AUSD_DECIMALS } from "./ausd";

/** Convert raw BigInt wei value to a human-readable number */
export function formatSupply(raw: bigint): number {
  // Divide by 10^18, keeping 2 decimal places
  const divisor = 10n ** BigInt(AUSD_DECIMALS);
  const whole = raw / divisor;
  const remainder = raw % divisor;
  const decimal = Number(remainder) / Number(divisor);
  return Number(whole) + decimal;
}

/** Format a number as compact USD (e.g. $1.2M) */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a number with commas and 2 decimal places */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Truncate an address to 0x1234...5678 */
export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Relative time string (e.g. "2m ago") */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
