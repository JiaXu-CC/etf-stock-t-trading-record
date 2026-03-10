// Demo seed data for portfolio / online demo.
// This file is only used to pre-populate localStorage when it is empty.

import { ETF, Trade } from "./types";
import { getETFs, getTrades, saveETFs, saveTrades } from "./storage";

function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DEMO_ETFS: ETF[] = [
  {
    id: "demo-etf-513310",
    name: "中韩半导体ETF",
    code: "513310",
    startDate: "2024-02-21",
    initialPosition: 2000,
    initialAvgCost: 1.95,
    commissionRate: 0.00025,
    exchangeFeeRate: 0.00002,
    minCommission: 5,
    slippagePerUnit: 0.0001,
    minTradeUnit: 100,
  },
  {
    id: "demo-etf-510500",
    name: "中证500ETF",
    code: "510500",
    startDate: "2023-11-15",
    initialPosition: 4000,
    initialAvgCost: 6.85,
    commissionRate: 0.00025,
    exchangeFeeRate: 0.00002,
    minCommission: 5,
    slippagePerUnit: 0.0001,
    minTradeUnit: 100,
  },
  {
    id: "demo-stock-300308",
    name: "中际旭创",
    code: "300308",
    startDate: "2024-04-08",
    initialPosition: 0,
    initialAvgCost: 0,
    commissionRate: 0.0003,
    exchangeFeeRate: 0.00002,
    minCommission: 5,
    slippagePerUnit: 0.01,
    minTradeUnit: 100,
  },
];

const today = todayStr();

const DEMO_TRADES: Trade[] = [
  // 中韩半导体ETF（513310）：历史建仓 + 部分卖出 + 今日 T
  {
    id: "demo-trd-1",
    etfId: "demo-etf-513310",
    date: "2024-06-10",
    time: "10:12",
    side: "BUY",
    price: 1.92,
    quantity: 2000,
    isT: false,
    noteType: "建仓",
    selfEvaluation: "S",
    comment: "半导体情绪回暖，低位先建底仓",
  },
  {
    id: "demo-trd-2",
    etfId: "demo-etf-513310",
    date: "2024-07-01",
    time: "14:03",
    side: "BUY",
    price: 2.02,
    quantity: 2000,
    isT: false,
    noteType: "加仓",
    selfEvaluation: "N",
    comment: "盘中突破箱体上沿，顺势加仓",
  },
  {
    id: "demo-trd-3",
    etfId: "demo-etf-513310",
    date: "2024-08-05",
    time: "13:30",
    side: "SELL",
    price: 2.18,
    quantity: 1000,
    isT: false,
    noteType: "减仓",
    selfEvaluation: "S",
    comment: "短线涨幅可观，先兑现部分利润",
  },
  // 今日 T：买入 + 卖出（盈利）
  {
    id: "demo-trd-4",
    etfId: "demo-etf-513310",
    date: today,
    time: "10:25",
    side: "BUY",
    price: 2.15,
    quantity: 2000,
    isT: true,
    noteType: "日内加仓",
    selfEvaluation: "S",
    comment: "早盘回踩五日线，挂单 T 买",
  },
  {
    id: "demo-trd-5",
    etfId: "demo-etf-513310",
    date: today,
    time: "14:19",
    side: "SELL",
    price: 2.22,
    quantity: 2000,
    isT: true,
    noteType: "T 回",
    selfEvaluation: "S",
    comment: "午后放量冲高，回吐早盘 T 仓，锁定日内盈利",
  },

  // 中证500ETF（510500）：长线持有 + 部分卖出 + 今日 T
  {
    id: "demo-trd-6",
    etfId: "demo-etf-510500",
    date: "2023-12-01",
    time: "10:05",
    side: "BUY",
    price: 6.70,
    quantity: 3000,
    isT: false,
    noteType: "建仓",
    selfEvaluation: "N",
    comment: "指数估值偏低，做长期底仓配置",
  },
  {
    id: "demo-trd-7",
    etfId: "demo-etf-510500",
    date: "2024-03-18",
    time: "09:45",
    side: "BUY",
    price: 6.95,
    quantity: 2000,
    isT: false,
    noteType: "加仓",
    selfEvaluation: "S",
    comment: "回踩趋势线附近再加一笔，摊薄成本",
  },
  {
    id: "demo-trd-8",
    etfId: "demo-etf-510500",
    date: "2024-06-20",
    time: "14:10",
    side: "SELL",
    price: 7.35,
    quantity: 1500,
    isT: false,
    noteType: "部分止盈",
    selfEvaluation: "S",
    comment: "涨到箱体上沿，锁定部分浮盈",
  },
  // 今日做 T：买入 + 卖出（小盈利）
  {
    id: "demo-trd-9",
    etfId: "demo-etf-510500",
    date: today,
    time: "10:18",
    side: "BUY",
    price: 7.10,
    quantity: 1000,
    isT: true,
    noteType: "日内回补",
    selfEvaluation: "N",
    comment: "早盘回落，用仓位做小级别 T",
  },
  {
    id: "demo-trd-10",
    etfId: "demo-etf-510500",
    date: today,
    time: "13:55",
    side: "SELL",
    price: 7.18,
    quantity: 1000,
    isT: true,
    noteType: "T 回",
    selfEvaluation: "S",
    comment: "下午反弹到早盘高点一带，平掉日内 T 仓",
  },

  // 中际旭创（300308）：高价股波段 + 今日 T
  {
    id: "demo-trd-11",
    etfId: "demo-stock-300308",
    date: "2024-05-10",
    time: "09:55",
    side: "BUY",
    price: 145.3,
    quantity: 300,
    isT: false,
    noteType: "建仓",
    selfEvaluation: "N",
    comment: "估值消化后，基本面预期良好，先少量建仓",
  },
  {
    id: "demo-trd-12",
    etfId: "demo-stock-300308",
    date: "2024-06-28",
    time: "14:30",
    side: "SELL",
    price: 158.6,
    quantity: 200,
    isT: false,
    noteType: "波段减仓",
    selfEvaluation: "S",
    comment: "放量上涨，先兑现一部分盈利",
  },
  // 今日 T：高价股 T 一笔，确保 Today Summary 有明显数值
  {
    id: "demo-trd-13",
    etfId: "demo-stock-300308",
    date: today,
    time: "10:08",
    side: "BUY",
    price: 152.0,
    quantity: 200,
    isT: true,
    noteType: "T 买",
    selfEvaluation: "N",
    comment: "盘中急跌，低位接回一部分筹码",
  },
  {
    id: "demo-trd-14",
    etfId: "demo-stock-300308",
    date: today,
    time: "14:42",
    side: "SELL",
    price: 156.5,
    quantity: 200,
    isT: true,
    noteType: "T 卖",
    selfEvaluation: "S",
    comment: "午后快速拉升，T 掉早盘买入部分，日内盈利可观",
  },
];

export function seedDemoDataIfEmpty(): void {
  if (typeof window === "undefined") return;
  const existingEtfs = getETFs();
  const existingTrades = getTrades();

  if (existingEtfs.length === 0 && existingTrades.length === 0) {
    saveETFs(DEMO_ETFS);
    saveTrades(DEMO_TRADES);
  }
}

