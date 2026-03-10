export interface ETF {
  id: string;
  name: string;
  code: string;
  startDate: string;
  initialPosition: number;
  initialAvgCost: number;
  commissionRate: number;
  exchangeFeeRate: number;
  minCommission: number;
  slippagePerUnit: number;
  minTradeUnit: number;
}

export type TradeSide = "BUY" | "SELL" | "Buy" | "Sell";

// localStorage 只保存原始 Trade 字段（不保存任何派生字段）
export interface Trade {
  id: string;
  etfId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  side: TradeSide;
  price: number;
  quantity: number;
  isT: boolean;
  noteType: string;
  selfEvaluation: string;
  comment: string;
}

export interface CalculatedTrade extends Trade {
  notional: number;
  fee: number;
  netCash: number;
  positionBefore: number;
  positionAfter: number;
  avgCostBefore: number;
  avgCostAfter: number;
  singlePnl: number;
  cumPnl: number;
}

export interface EtfSnapshot {
  etf: ETF;
  currentPosition: number;
  currentAvgCost: number;
  realizedPnl: number;
  todayTBuyQty: number;
  todayTBuyAvgPrice: number;
  todayTRealizedPnl: number;
  totalPositionValue: number;
}

