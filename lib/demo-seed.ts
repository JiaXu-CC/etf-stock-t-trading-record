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
    id: "etf-semi",
    name: "中韩半导体ETF",
    code: "513310",
    startDate: "2026-02-20",
    initialPosition: 0,
    initialAvgCost: 0,
    commissionRate: 0.00025,
    exchangeFeeRate: 0.00002,
    minCommission: 5,
    slippagePerUnit: 0,
    minTradeUnit: 100,
  },
  {
    id: "etf-500",
    name: "中证500ETF",
    code: "510500",
    startDate: "2026-02-10",
    initialPosition: 0,
    initialAvgCost: 0,
    commissionRate: 0.00025,
    exchangeFeeRate: 0.00002,
    minCommission: 5,
    slippagePerUnit: 0,
    minTradeUnit: 100,
  },
  {
    id: "stock-zjxc",
    name: "中际旭创",
    code: "300308",
    startDate: "2026-02-25",
    initialPosition: 0,
    initialAvgCost: 0,
    commissionRate: 0.0003,
    exchangeFeeRate: 0.00002,
    minCommission: 5,
    slippagePerUnit: 0,
    minTradeUnit: 100,
  },
];

const DEMO_TRADES: Trade[] = [
  {
    id: "t1",
    etfId: "etf-semi",
    date: "2026-02-21",
    time: "10:15",
    side: "Buy",
    price: 3.72,
    quantity: 3000,
    isT: false,
    noteType: "建仓",
    selfEvaluation: "趋势启动",
    comment: "半导体板块回调后开始建仓",
  },
  {
    id: "t2",
    etfId: "etf-semi",
    date: "2026-02-28",
    time: "14:20",
    side: "Buy",
    price: 3.80,
    quantity: 2000,
    isT: false,
    noteType: "加仓",
    selfEvaluation: "趋势确认",
    comment: "指数突破前高继续加仓",
  },
  {
    id: "t3",
    etfId: "etf-semi",
    date: "2026-03-10",
    time: "10:05",
    side: "Buy",
    price: 3.88,
    quantity: 1000,
    isT: true,
    noteType: "做T买入",
    selfEvaluation: "日内低吸",
    comment: "早盘回落接回做T",
  },
  {
    id: "t4",
    etfId: "etf-semi",
    date: "2026-03-10",
    time: "13:40",
    side: "Sell",
    price: 3.96,
    quantity: 1000,
    isT: true,
    noteType: "做T卖出",
    selfEvaluation: "T成功",
    comment: "午后拉升卖出",
  },

  {
    id: "t5",
    etfId: "etf-500",
    date: "2026-02-12",
    time: "10:30",
    side: "Buy",
    price: 8.05,
    quantity: 2000,
    isT: false,
    noteType: "建仓",
    selfEvaluation: "指数配置",
    comment: "指数回调配置仓位",
  },
  {
    id: "t6",
    etfId: "etf-500",
    date: "2026-02-26",
    time: "14:10",
    side: "Buy",
    price: 8.18,
    quantity: 1000,
    isT: false,
    noteType: "加仓",
    selfEvaluation: "趋势延续",
    comment: "突破后继续加仓",
  },
  {
    id: "t7",
    etfId: "etf-500",
    date: "2026-03-07",
    time: "13:55",
    side: "Sell",
    price: 8.42,
    quantity: 1000,
    isT: false,
    noteType: "减仓",
    selfEvaluation: "兑现利润",
    comment: "反弹到压力位减仓",
  },

  {
    id: "t8",
    etfId: "stock-zjxc",
    date: "2026-02-26",
    time: "10:20",
    side: "Buy",
    price: 472.5,
    quantity: 200,
    isT: false,
    noteType: "建仓",
    selfEvaluation: "趋势股试仓",
    comment: "AI光模块龙头试仓",
  },
  {
    id: "t9",
    etfId: "stock-zjxc",
    date: "2026-03-05",
    time: "14:30",
    side: "Buy",
    price: 488.2,
    quantity: 100,
    isT: false,
    noteType: "加仓",
    selfEvaluation: "趋势确认",
    comment: "突破后小幅加仓",
  },
  {
    id: "t10",
    etfId: "stock-zjxc",
    date: "2026-03-10",
    time: "10:02",
    side: "Buy",
    price: 498.6,
    quantity: 100,
    isT: true,
    noteType: "做T买入",
    selfEvaluation: "日内低吸",
    comment: "高开回落接回",
  },
  {
    id: "t11",
    etfId: "stock-zjxc",
    date: "2026-03-10",
    time: "13:48",
    side: "Sell",
    price: 509.3,
    quantity: 100,
    isT: true,
    noteType: "做T卖出",
    selfEvaluation: "T成功",
    comment: "午后冲高卖出",
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

