"use client";
import Link from "next/link";
import { EtfSnapshot } from "@/lib/types";

interface Props {
  snapshot: EtfSnapshot;
}

export function EtfCard({ snapshot }: Props) {
  const { etf, currentAvgCost, currentPosition, realizedPnl } = snapshot;
  const totalValue = snapshot.totalPositionValue;
  const isPnlPositive = realizedPnl >= 0;

  return (
    <Link href={`/etf/${etf.id}`} className="card card-tappable">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="etf-name">{etf.name}</div>
          <div className="etf-code">{etf.code}</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-block">
          <div className="stat-label">当前持仓</div>
          <div className="stat-main">{currentPosition.toLocaleString()}</div>
          <div className="stat-sub">
            {currentAvgCost.toFixed(3)} × {currentPosition.toLocaleString()} ={" "}
            {totalValue.toFixed(2)}
          </div>
        </div>

        <div className="stat-block">
          <div className="stat-label">已实现盈亏</div>
          <div
            className={
              "stat-main " +
              (isPnlPositive ? "stat-pnl-positive" : "stat-pnl-negative")
            }
          >
            {isPnlPositive ? "+" : "-"}
            {Math.abs(realizedPnl).toFixed(2)}
          </div>
          <div className="stat-sub">仅统计已实现部分</div>
        </div>
      </div>

      <div className="divider-soft" />

      <div className="stat-pill-row">
        <div className="stat-pill stat-pill-accent">
          今日 T 买入 {snapshot.todayTBuyQty.toLocaleString()}
        </div>
        <div className="stat-pill">
          均价 {snapshot.todayTBuyAvgPrice.toFixed(3)}
        </div>
        <div className="stat-pill">
          今日 T 盈亏{" "}
          {snapshot.todayTRealizedPnl >= 0 ? "+" : "-"}
          {Math.abs(snapshot.todayTRealizedPnl).toFixed(2)}
        </div>
      </div>
    </Link>
  );
}

