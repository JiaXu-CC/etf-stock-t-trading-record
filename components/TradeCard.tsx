"use client";
import { useState } from "react";
import { CalculatedTrade, Trade, TradeSide } from "@/lib/types";

interface Props {
  trade: CalculatedTrade;
  minTradeUnit: number;
  currentPosition: number;
  onDelete?: () => void;
  onEdit?: (updated: Trade) => void;
}

type TradeFormErrors = {
  date?: string;
  time?: string;
  price?: string;
  quantity?: string;
};

function toNumber(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function TradeCard({
  trade,
  minTradeUnit,
  currentPosition,
  onDelete,
  onEdit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    date: trade.date,
    time: trade.time,
    side: trade.side as TradeSide,
    price: trade.price,
    quantity: trade.quantity,
    isT: trade.isT,
    noteType: trade.noteType,
    selfEvaluation: trade.selfEvaluation,
    comment: trade.comment,
  });
  const [errors, setErrors] = useState<TradeFormErrors>({});

  const isSell = form.side === "SELL" || form.side === "Sell";
  const pnl = trade.singlePnl;
  const isPnlPositive = pnl >= 0;

  function validate(): TradeFormErrors {
    const next: TradeFormErrors = {};
    if (!form.date) next.date = "日期不能为空";
    if (!form.time) next.time = "时间不能为空";
    if (!(form.price > 0)) next.price = "价格必须大于 0";
    if (!(form.quantity > 0)) {
      next.quantity = "数量必须大于 0";
    } else {
      if (minTradeUnit > 0 && form.quantity % minTradeUnit !== 0) {
        next.quantity = `数量必须是最小交易单位 ${minTradeUnit} 的整数倍`;
      }
      if (isSell && form.quantity > currentPosition) {
        next.quantity = "卖出数量不能超过当前持仓";
      }
    }
    return next;
  }

  const hasErrors =
    !!errors.date || !!errors.time || !!errors.price || !!errors.quantity;

  return (
    <article className="trade-card">
      <div className="trade-main-row">
        <div>
          <div className="trade-meta">
            {trade.date} {trade.time}
          </div>
          <div className="trade-meta">
            <span
              className={
                "trade-side " +
                (isSell ? "trade-side-sell" : "trade-side-buy")
              }
            >
              {isSell ? "卖出" : "买入"}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="trade-amount">
            {trade.price.toFixed(3)} × {trade.quantity.toLocaleString()} ={" "}
            {trade.notional.toFixed(2)}
          </div>
          <div className="trade-meta">
            手续费 {trade.fee.toFixed(2)}{" "}
            <span style={{ marginLeft: 6 }}>T: {trade.isT ? "是" : "否"}</span>
          </div>
        </div>
      </div>

      <div className="trade-secondary-row">
        <div className="trade-extra">
          {isSell && (
            <div>
              单笔盈亏{" "}
              <span
                className={
                  isPnlPositive ? "stat-pnl-positive" : "stat-pnl-negative"
                }
              >
                {isPnlPositive ? "+" : "-"}
                {Math.abs(pnl).toFixed(2)}
              </span>
            </div>
          )}
          {trade.noteType && <div>备注类型：{trade.noteType}</div>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="collapse-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "收起详情" : "展开详情"}
            <span>{open ? "▲" : "▼"}</span>
          </button>
          <button
            type="button"
            className="collapse-toggle"
            onClick={() => {
              setForm({
                date: trade.date,
                time: trade.time,
                side: trade.side as TradeSide,
                price: trade.price,
                quantity: trade.quantity,
                isT: trade.isT,
                noteType: trade.noteType,
                selfEvaluation: trade.selfEvaluation,
                comment: trade.comment,
              });
              setErrors({});
              setEditing(true);
              setOpen(true);
            }}
          >
            编辑
          </button>
          {onDelete && (
            <button
              type="button"
              className="collapse-toggle"
              onClick={onDelete}
            >
              删除
            </button>
          )}
        </div>
      </div>

      {open && (
        <>
          <div className="collapse-extra">
            <div>
              <div className="collapse-item-label">交易编号</div>
              <div className="collapse-item-value">{trade.id}</div>
            </div>
            <div>
              <div className="collapse-item-label">方向</div>
              <div className="collapse-item-value">
                {isSell ? "卖出" : "买入"}
              </div>
            </div>
            <div>
              <div className="collapse-item-label">成交金额</div>
              <div className="collapse-item-value">
                {trade.notional.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="collapse-item-label">净现金流</div>
              <div className="collapse-item-value">
                {trade.netCash.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="collapse-item-label">持仓前后</div>
              <div className="collapse-item-value">
                {trade.positionBefore} → {trade.positionAfter}
              </div>
            </div>
            <div>
              <div className="collapse-item-label">均价前后</div>
              <div className="collapse-item-value">
                {trade.avgCostBefore.toFixed(3)} → {trade.avgCostAfter.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="collapse-item-label">自评</div>
              <div className="collapse-item-value">
                {trade.selfEvaluation || "-"}
              </div>
            </div>
            <div>
              <div className="collapse-item-label">备注</div>
              <div className="collapse-item-value">{trade.comment || "-"}</div>
            </div>
          </div>

          {editing && (
            <div className="form-card" style={{ marginTop: 6 }}>
              <div className="section-title">编辑交易</div>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">日期</label>
                  <input
                    className={`form-input ${
                      errors.date ? "form-input-error" : ""
                    }`}
                    type="date"
                    value={form.date}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, date: e.target.value }));
                      if (errors.date) {
                        setErrors((prev) => ({ ...prev, date: undefined }));
                      }
                    }}
                  />
                  {errors.date && (
                    <div className="form-error-text">{errors.date}</div>
                  )}
                </div>
                <div className="form-field">
                  <label className="form-label">时间</label>
                  <input
                    className={`form-input ${
                      errors.time ? "form-input-error" : ""
                    }`}
                    type="time"
                    value={form.time}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, time: e.target.value }));
                      if (errors.time) {
                        setErrors((prev) => ({ ...prev, time: undefined }));
                      }
                    }}
                  />
                  {errors.time && (
                    <div className="form-error-text">{errors.time}</div>
                  )}
                </div>
                <div className="form-field">
                  <label className="form-label">方向</label>
                  <select
                    className="form-select"
                    value={form.side}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        side: e.target.value as TradeSide,
                      }))
                    }
                  >
                    <option value="BUY">买入</option>
                    <option value="SELL">卖出</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">价格</label>
                  <input
                    className={`form-input ${
                      errors.price ? "form-input-error" : ""
                    }`}
                    type="number"
                    step="0.001"
                    min={0}
                    value={form.price}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, price: toNumber(e.target.value) }));
                      if (errors.price) {
                        setErrors((prev) => ({ ...prev, price: undefined }));
                      }
                    }}
                  />
                  {errors.price && (
                    <div className="form-error-text">{errors.price}</div>
                  )}
                </div>
                <div className="form-field">
                  <label className="form-label">数量</label>
                  <input
                    className={`form-input ${
                      errors.quantity ? "form-input-error" : ""
                    }`}
                    type="number"
                    step="1"
                    min={0}
                    value={form.quantity}
                    onChange={(e) => {
                      setForm((p) => ({
                        ...p,
                        quantity: toNumber(e.target.value),
                      }));
                      if (errors.quantity) {
                        setErrors((prev) => ({ ...prev, quantity: undefined }));
                      }
                    }}
                  />
                  {errors.quantity && (
                    <div className="form-error-text">{errors.quantity}</div>
                  )}
                </div>
                <div className="form-field">
                  <label className="form-label">是否 T</label>
                  <select
                    className="form-select"
                    value={form.isT ? "yes" : "no"}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isT: e.target.value === "yes" }))
                    }
                  >
                    <option value="yes">是</option>
                    <option value="no">否</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">备注类型</label>
                  <input
                    className="form-input"
                    value={form.noteType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, noteType: e.target.value }))
                    }
                    placeholder="例如：加仓 / 减仓 / T 回"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">自评</label>
                  <input
                    className="form-input"
                    value={form.selfEvaluation}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, selfEvaluation: e.target.value }))
                    }
                    placeholder="例如：S / F / N"
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">备注</label>
                <textarea
                  className="form-textarea"
                  value={form.comment}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, comment: e.target.value }))
                  }
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setEditing(false);
                    setErrors({});
                  }}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={hasErrors}
                  onClick={() => {
                    const nextErrors = validate();
                    setErrors(nextErrors);
                    if (
                      nextErrors.date ||
                      nextErrors.time ||
                      nextErrors.price ||
                      nextErrors.quantity
                    ) {
                      return;
                    }
                    if (!onEdit) {
                      setEditing(false);
                      return;
                    }
                    const raw: Trade = {
                      id: trade.id,
                      etfId: trade.etfId,
                      date: form.date,
                      time: form.time,
                      side: form.side,
                      price: form.price,
                      quantity: form.quantity,
                      isT: form.isT,
                      noteType: form.noteType.trim(),
                      selfEvaluation: form.selfEvaluation.trim(),
                      comment: form.comment.trim(),
                    };
                    onEdit(raw);
                    setEditing(false);
                  }}
                >
                  保存
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}

