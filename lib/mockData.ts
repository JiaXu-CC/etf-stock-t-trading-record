import { ETF, EtfSnapshot, Trade } from "./types";

export const etfs: ETF[] = [
  {
    id: "1",
    name: "上证50ETF",
    code: "510050",
    startDate: "2024-01-02",
    initialPosition: 3000,
    initialAvgCost: 2.135,
  },
  {
    id: "2",
    name: "沪深300ETF",
    code: "510300",
    startDate: "2024-03-11",
    initialPosition: 5000,
    initialAvgCost: 3.218,
  },
];

export const etfSnapshots: EtfSnapshot[] = [
  {
    etf: etfs[0],
    currentPosition: 6000,
    currentAvgCost: 2.148,
    realizedPnl: 628.34,
    todayTBuyQty: 3000,
    todayTBuyAvgPrice: 2.145,
    todayTRealizedPnl: 132.57,
  },
  {
    etf: etfs[1],
    currentPosition: 2000,
    currentAvgCost: 3.205,
    realizedPnl: -215.8,
    todayTBuyQty: 0,
    todayTBuyAvgPrice: 0,
    todayTRealizedPnl: 0,
  },
];

export const tradesByEtfId: Record<string, Trade[]> = {
  "1": [
    {
      id: "T1",
      etfId: "1",
      date: "2026-03-09",
      time: "10:32",
      side: "BUY",
      price: 2.145,
      quantity: 3000,
      isT: true,
      noteType: "日内加仓",
      selfEvaluation: "S",
      comment: "盘中回调分批买入",
    },
    {
      id: "T2",
      etfId: "1",
      date: "2026-03-09",
      time: "14:48",
      side: "SELL",
      price: 2.168,
      quantity: 3000,
      isT: true,
      noteType: "T回",
      selfEvaluation: "F",
      comment: "下午冲高减回早盘 T 仓",
    },
  ],
  "2": [
    {
      id: "T3",
      etfId: "2",
      date: "2026-03-08",
      time: "10:05",
      side: "BUY",
      price: 3.205,
      quantity: 2000,
      isT: false,
      noteType: "波段建仓",
      selfEvaluation: "S",
      comment: "弱反弹先建底仓",
    },
  ],
};

export function getEtfSnapshotById(id: string): EtfSnapshot | undefined {
  return etfSnapshots.find((s) => s.etf.id === id);
}

export function getTradesByEtfId(id: string): Trade[] {
  return tradesByEtfId[id] ?? [];
}

