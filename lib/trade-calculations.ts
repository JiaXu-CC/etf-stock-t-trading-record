import { ETF, CalculatedTrade, Trade, TradeSide } from "./types";

function normalizeSide(side: TradeSide): "BUY" | "SELL" {
  if (side === "SELL" || side === "Sell") return "SELL";
  return "BUY";
}

export function sortTrades(trades: Trade[]): Trade[] {
  return [...trades].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;

    const byTime = a.time.localeCompare(b.time);
    if (byTime !== 0) return byTime;

    return a.id.localeCompare(b.id);
  });
}

export function calculateFees(etf: ETF, notional: number, quantity: number): number {
  const commission = Math.max(etf.minCommission, notional * etf.commissionRate);
  const exchangeFee = notional * etf.exchangeFeeRate;
  const slippage = quantity * etf.slippagePerUnit;
  return commission + exchangeFee + slippage;
}

export function calculateTradeSequence(etf: ETF, trades: Trade[]): CalculatedTrade[] {
  const sorted = sortTrades(trades);

  let positionAfterPrev = etf.initialPosition;
  let avgCostAfterPrev = etf.initialAvgCost;
  let cumPnlPrev = 0;

  const result: CalculatedTrade[] = [];

  for (const t of sorted) {
    const side = normalizeSide(t.side);
    const positionBefore = positionAfterPrev;
    const avgCostBefore = avgCostAfterPrev;

    const notional = t.price * t.quantity;
    const fee = calculateFees(etf, notional, t.quantity);
    const netCash =
      side === "BUY" ? -(notional + fee) : notional - fee;

    const positionAfter =
      side === "BUY" ? positionBefore + t.quantity : positionBefore - t.quantity;

    const avgCostAfter =
      side === "SELL"
        ? avgCostBefore
        : positionAfter === 0
          ? 0
          : (positionBefore * avgCostBefore + notional + fee) / positionAfter;

    const singlePnl =
      side === "SELL" ? (t.price - avgCostBefore) * t.quantity - fee : 0;

    const cumPnl = cumPnlPrev + singlePnl;

    const calc: CalculatedTrade = {
      ...t,
      side,
      notional,
      fee,
      netCash,
      positionBefore,
      positionAfter,
      avgCostBefore,
      avgCostAfter,
      singlePnl,
      cumPnl,
    };

    result.push(calc);

    positionAfterPrev = positionAfter;
    avgCostAfterPrev = avgCostAfter;
    cumPnlPrev = cumPnl;
  }

  return result;
}

