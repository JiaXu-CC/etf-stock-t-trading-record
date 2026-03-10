"use client";
import { useMemo, useState } from "react";
import { Trade, TradeSide } from "@/lib/types";
import { addTrade, createId } from "@/lib/storage";

interface Props {
  etfId: string;
  minTradeUnit: number;
  currentPosition: number;
  onSaved?: () => void;
}

function toNumber(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

type TradeFormErrors = {
  date?: string;
  time?: string;
  price?: string;
  quantity?: string;
};

export function AddTradeSection({
  etfId,
  minTradeUnit,
  currentPosition,
  onSaved,
}: Props) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [side, setSide] = useState<TradeSide>("BUY");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(minTradeUnit || 100);
  const [isT, setIsT] = useState<boolean>(true);
  const [noteType, setNoteType] = useState<string>("");
  const [selfEvaluation, setSelfEvaluation] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const [errors, setErrors] = useState<TradeFormErrors>({});

  function validate(): TradeFormErrors {
    const next: TradeFormErrors = {};

    if (!date) {
      next.date = "日期不能为空";
    }
    if (!time) {
      next.time = "时间不能为空";
    }
    if (!(price > 0)) {
      next.price = "价格必须大于 0";
    }
    if (!(quantity > 0)) {
      next.quantity = "数量必须大于 0";
    } else {
      if (minTradeUnit > 0 && quantity % minTradeUnit !== 0) {
        next.quantity = `数量必须是最小交易单位 ${minTradeUnit} 的整数倍`;
      }
      const sellSide = side === "SELL" || side === "Sell";
      if (sellSide && quantity > currentPosition) {
        next.quantity = "卖出数量不能超过当前持仓";
      }
    }

    return next;
  }

  const hasErrors =
    !!errors.date || !!errors.time || !!errors.price || !!errors.quantity;

  return (
    <section>
      <div className="section-title-row">
        <div className="section-title">新增交易</div>
        <button
          type="button"
          className="btn-ghost btn-ghost-pill"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "收起表单" : "展开表单"}
        </button>
      </div>

      {open && (
        <div className="form-card">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">日期</label>
              <input
                className={`form-input ${errors.date ? "form-input-error" : ""}`}
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
              />
              {errors.date && <div className="form-error-text">{errors.date}</div>}
            </div>
            <div className="form-field">
              <label className="form-label">时间</label>
              <input
                className={`form-input ${errors.time ? "form-input-error" : ""}`}
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (errors.time) {
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }
                }}
              />
              {errors.time && <div className="form-error-text">{errors.time}</div>}
            </div>
            <div className="form-field">
              <label className="form-label">方向</label>
              <select
                className="form-select"
                value={side}
                onChange={(e) => setSide(e.target.value as TradeSide)}
              >
                <option value="BUY">买入</option>
                <option value="SELL">卖出</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">价格</label>
              <input
                className={`form-input ${errors.price ? "form-input-error" : ""}`}
                type="number"
                step="0.001"
                value={price}
                min={0}
                onChange={(e) => {
                  setPrice(toNumber(e.target.value));
                  if (errors.price) {
                    setErrors((prev) => ({ ...prev, price: undefined }));
                  }
                }}
              />
              {errors.price && <div className="form-error-text">{errors.price}</div>}
            </div>
            <div className="form-field">
              <label className="form-label">数量</label>
              <input
                className={`form-input ${errors.quantity ? "form-input-error" : ""}`}
                type="number"
                step="1"
                value={quantity}
                min={0}
                onChange={(e) => {
                  setQuantity(toNumber(e.target.value));
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
                value={isT ? "yes" : "no"}
                onChange={(e) => setIsT(e.target.value === "yes")}
              >
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">备注类型</label>
              <input
                className="form-input"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                placeholder="例如：加仓 / 减仓 / T 回"
              />
            </div>
            <div className="form-field">
              <label className="form-label">自评</label>
              <input
                className="form-input"
                value={selfEvaluation}
                onChange={(e) => setSelfEvaluation(e.target.value)}
                placeholder="例如：S / F / N"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">备注</label>
            <textarea
              className="form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="本阶段将保存到 localStorage"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setOpen(false)}
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

                const next: Trade = {
                  id: createId("trd"),
                  etfId,
                  date,
                  time,
                  side,
                  price,
                  quantity,
                  isT,
                  noteType: noteType.trim(),
                  selfEvaluation: selfEvaluation.trim(),
                  comment: comment.trim(),
                };

                addTrade(next);
                onSaved?.();

                // 清空部分输入，方便连续录入
                setTime("");
                setPrice(0);
                setQuantity(minTradeUnit || 100);
                setNoteType("");
                setSelfEvaluation("");
                setComment("");
                setErrors({});
                setOpen(false);
              }}
            >
              保存交易
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

