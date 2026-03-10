"use client";
interface Props {
  todayTBuyQty: number;
  todayTBuyAvgPrice: number;
  todayTRealizedPnl: number;
}

export function TStatsCard({
  todayTBuyQty,
  todayTBuyAvgPrice,
  todayTRealizedPnl,
}: Props) {
  const isPnlPositive = todayTRealizedPnl >= 0;

  return (
    <section className="card">
      <div className="section-title">今日 T 统计</div>
      <div className="position-grid">
        <div className="stat-block">
          <div className="stat-label">T 买入数量</div>
          <div className="stat-main">{todayTBuyQty.toLocaleString()}</div>
          <div className="stat-sub">仅统计标记为 T 的买入</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">T 买入均价</div>
          <div className="stat-main">
            {todayTBuyAvgPrice ? todayTBuyAvgPrice.toFixed(3) : "-"}
          </div>
          <div className="stat-sub">按今日 T 买入加权均价</div>
        </div>
      </div>

      <div className="divider-soft" />

      <div className="chip-row">
        <div
          className={
            "chip chip-strong " +
            (isPnlPositive ? "stat-pnl-positive" : "stat-pnl-negative")
          }
        >
          今日 T 已实现盈亏{" "}
          {isPnlPositive ? "+" : "-"}
          {Math.abs(todayTRealizedPnl).toFixed(2)}
        </div>
        <div className="chip">后续可按日汇总</div>
      </div>
    </section>
  );
}

