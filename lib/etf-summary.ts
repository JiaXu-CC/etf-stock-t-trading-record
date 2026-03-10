import { ETF, EtfSnapshot, Trade } from "./types";
import { calculateTradeSequence, sortTrades } from "./trade-calculations";

function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calculateEtfSummary(etf: ETF, trades: Trade[]): EtfSnapshot {
  const seq = calculateTradeSequence(etf, trades);
  const hasTrades = seq.length > 0;
  const last = hasTrades ? seq[seq.length - 1] : null;

  const currentPosition = hasTrades ? last!.positionAfter : etf.initialPosition;
  const currentAvgCost = hasTrades ? last!.avgCostAfter : etf.initialAvgCost;
  const realizedPnl = hasTrades ? last!.cumPnl : 0;
  const totalPositionValue = currentPosition * currentAvgCost;

  const today = todayStr();
  const tTradesToday = seq.filter((t) => t.isT && t.date === today);

  const tBuy = tTradesToday.filter((t) => t.side === "BUY");
  const todayTBuyQty = tBuy.reduce((sum, t) => sum + t.quantity, 0);
  const todayTBuyAvgPrice =
    todayTBuyQty === 0
      ? 0
      : tBuy.reduce((sum, t) => sum + t.price * t.quantity, 0) / todayTBuyQty;

  const tSell = tTradesToday.filter((t) => t.side === "SELL");
  const todayTRealizedPnl = tSell.reduce((sum, t) => sum + t.singlePnl, 0);

  return {
    etf,
    currentPosition,
    currentAvgCost,
    totalPositionValue,
    realizedPnl,
    todayTBuyQty,
    todayTBuyAvgPrice,
    todayTRealizedPnl,
  };
}

export function calculateTodayTStats(trades: Trade[]) {
  const sorted = sortTrades(trades);
  const today = todayStr();
  const todayT = sorted.filter((t) => t.isT && t.date === today);
  return todayT;
}

