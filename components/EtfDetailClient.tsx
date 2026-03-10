"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AddTradeSection } from "@/components/AddTradeSection";
import { PositionCard } from "@/components/PositionCard";
import { TodaySummaryCard } from "@/components/TodaySummaryCard";
import { TStatsCard } from "@/components/TStatsCard";
import { TradeCard } from "@/components/TradeCard";
import { ETF, Trade } from "@/lib/types";
import { deleteTrade, getETFs, getTradesByEtfId, updateTrade } from "@/lib/storage";
import { calculateTradeSequence } from "@/lib/trade-calculations";
import { calculateEtfSummary } from "@/lib/etf-summary";
import { calculateTodaySummary } from "@/lib/daily-summary";

interface Props {
  etfId: string;
}

export function EtfDetailClient({ etfId }: Props) {
  const [etf, setEtf] = useState<ETF | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const found = getETFs().find((e) => e.id === etfId) ?? null;
    setEtf(found);
    setTrades(getTradesByEtfId(etfId));
  }, [etfId]);

  const calculated = useMemo(() => {
    if (!etf) return null;
    const seq = calculateTradeSequence(etf, trades);
    const summary = calculateEtfSummary(etf, trades);
    const todaySummary = calculateTodaySummary(seq);
    return { summary, seq, todaySummary };
  }, [etf, trades]);

  function handleDeleteTrade(tradeId: string) {
    if (!etf) return;
    if (!confirm("确定要删除这条交易记录吗？此操作会影响持仓与盈亏计算。")) return;
    const all = deleteTrade(tradeId);
    setTrades(all.filter((t) => t.etfId === etf.id));
  }

  function handleEditTrade(updated: Trade) {
    if (!etf) return;
    const all = updateTrade(updated);
    setTrades(all.filter((t) => t.etfId === etf.id));
  }

  if (!etf) {
    return (
      <div className="section-scroll">
        <div className="empty-hint">未找到该 ETF（可能已被清空本地数据）。</div>
        <div style={{ marginTop: 10 }}>
          <Link href="/" className="btn-ghost btn-ghost-pill">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!calculated) {
    return null;
  }

  return (
    <>
      <header className="app-header">
        <div className="detail-header">
          <div className="detail-header-top">
            <div>
              <div className="detail-title">{etf.name}</div>
              <div className="detail-meta-row">
                <span>代码 {etf.code}</span>
                <span>建仓 {etf.startDate}</span>
                <span>初始持仓 {etf.initialPosition}</span>
              </div>
            </div>
          </div>
          <div className="chip-row">
            <span className="chip chip-strong">ETF/个股明细页</span>
            <span className="chip">数据来自 localStorage</span>
          </div>
        </div>
        <Link href="/" className="btn-icon-circle" aria-label="返回首页">
          ←
        </Link>
      </header>

      <div className="section-scroll">
        <div className="detail-section-stack">
          <PositionCard
            currentPosition={calculated.summary.currentPosition}
            currentAvgCost={calculated.summary.currentAvgCost}
            realizedPnl={calculated.summary.realizedPnl}
          />

          <TodaySummaryCard
            sellTrades={calculated.todaySummary.sellTrades}
            realizedPnl={calculated.todaySummary.realizedPnL}
          />

          <TStatsCard
            todayTBuyQty={calculated.summary.todayTBuyQty}
            todayTBuyAvgPrice={calculated.summary.todayTBuyAvgPrice}
            todayTRealizedPnl={calculated.summary.todayTRealizedPnl}
          />

          <AddTradeSection
            etfId={etf.id}
            minTradeUnit={etf.minTradeUnit}
            currentPosition={calculated.summary.currentPosition}
            onSaved={() => setTrades(getTradesByEtfId(etf.id))}
          />

          <section>
            <div className="section-title-row">
              <div className="section-title">交易记录</div>
            </div>
            {calculated.seq.length === 0 ? (
              <div className="empty-hint">当前 ETF/个股 暂无交易记录。你可以先新增一笔交易。</div>
            ) : (
              <div className="detail-section-stack">
                {calculated.seq.map((t) => (
                  <TradeCard
                    key={t.id}
                    trade={t}
                    minTradeUnit={etf.minTradeUnit}
                    currentPosition={calculated.summary.currentPosition}
                    onDelete={() => handleDeleteTrade(t.id)}
                    onEdit={handleEditTrade}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

