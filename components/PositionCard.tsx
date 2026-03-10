"use client";
interface Props {
  currentPosition: number;
  currentAvgCost: number;
  realizedPnl: number;
}

export function PositionCard({
  currentPosition,
  currentAvgCost,
  realizedPnl,
}: Props) {
  const totalValue = currentPosition * currentAvgCost;
  const isPnlPositive = realizedPnl >= 0;

  return (
    <section className="card">
      <div className="section-title">持仓概览</div>
      <div className="position-grid">
        <div className="stat-block">
          <div className="stat-label">当前持仓</div>
          <div className="stat-main">{currentPosition.toLocaleString()}</div>
          <div className="stat-sub">
            均价 {currentAvgCost.toFixed(3)}
          </div>
        </div>
        <div className="stat-block">
          <div className="stat-label">持仓市值</div>
          <div className="stat-main">{totalValue.toFixed(2)}</div>
          <div className="stat-sub">
            {currentAvgCost.toFixed(3)} × {currentPosition.toLocaleString()}
          </div>
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
          已实现盈亏{" "}
          {isPnlPositive ? "+" : "-"}
          {Math.abs(realizedPnl).toFixed(2)}
        </div>
        <div className="chip">由交易序列动态计算</div>
      </div>
    </section>
  );
}

