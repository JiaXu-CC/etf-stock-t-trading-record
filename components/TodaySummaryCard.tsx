interface Props {
  sellTrades: number;
  realizedPnl: number;
}

export function TodaySummaryCard({ sellTrades, realizedPnl }: Props) {
  const isPnlPositive = realizedPnl >= 0;

  return (
    <section className="card">
      <div className="section-title">今日汇总</div>
      <div className="position-grid">
        <div className="stat-block">
          <div className="stat-label">卖出笔数</div>
          <div className="stat-main">{sellTrades}</div>
          <div className="stat-sub">仅统计今日所有卖出（不区分是否 T）</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">今日已实现盈亏</div>
          <div
            className={
              "stat-main " +
              (isPnlPositive ? "stat-pnl-positive" : "stat-pnl-negative")
            }
          >
            {isPnlPositive ? "+" : "-"}
            {Math.abs(realizedPnl).toFixed(2)}
          </div>
          <div className="stat-sub">Σ 单笔盈亏（仅卖出）</div>
        </div>
      </div>
    </section>
  );
}

