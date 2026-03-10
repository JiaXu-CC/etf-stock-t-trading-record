import { CalculatedTrade } from "./types";

function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calculateTodaySummary(trades: CalculatedTrade[]) {
  const today = todayStr();
  const sellsToday = trades.filter((t) => t.date === today && t.side === "SELL");
  const sellTrades = sellsToday.length;
  const realizedPnL = sellsToday.reduce((sum, t) => sum + t.singlePnl, 0);
  return { sellTrades, realizedPnL };
}

