"use client";

import { useEffect, useMemo, useState } from "react";
import { EtfCard } from "@/components/EtfCard";
import { ETF, EtfSnapshot, Trade } from "@/lib/types";
import { createId, getETFs, getTrades, saveETFs, saveTrades } from "@/lib/storage";
import { calculateEtfSummary } from "@/lib/etf-summary";

type NewEtfDraft = Omit<ETF, "id">;

function toNumber(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function buildSnapshots(etfs: ETF[], trades: Trade[]): EtfSnapshot[] {
  return etfs.map((etf) => calculateEtfSummary(etf, trades.filter((t) => t.etfId === etf.id)));
}

export function HomeClient() {
  const [etfs, setEtfs] = useState<ETF[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [importing, setImporting] = useState(false);

  const [draft, setDraft] = useState<NewEtfDraft>({
    name: "",
    code: "",
    startDate: "",
    initialPosition: 0,
    initialAvgCost: 0,
    commissionRate: 0.0003,
    exchangeFeeRate: 0,
    minCommission: 5,
    slippagePerUnit: 0,
    minTradeUnit: 100,
  });

  const [draftErrors, setDraftErrors] = useState<Partial<Record<keyof NewEtfDraft, string>>>(
    {}
  );

  function validateDraft(d: NewEtfDraft) {
    const errs: Partial<Record<keyof NewEtfDraft, string>> = {};
    if (!d.name.trim()) errs.name = "名称不能为空";
    if (!d.code.trim()) errs.code = "代码不能为空";
    if (d.initialPosition < 0) errs.initialPosition = "初始持仓不能为负数";
    if (d.initialAvgCost < 0) errs.initialAvgCost = "初始均价不能为负数";
    if (d.commissionRate < 0) errs.commissionRate = "佣金率不能为负数";
    if (d.exchangeFeeRate < 0) errs.exchangeFeeRate = "交易所费率不能为负数";
    if (d.minCommission < 0) errs.minCommission = "最低佣金不能为负数";
    if (d.slippagePerUnit < 0) errs.slippagePerUnit = "滑点不能为负数";
    if (!(d.minTradeUnit > 0)) errs.minTradeUnit = "最小交易单位必须大于 0";
    return errs;
  }

  const isDraftValid = Object.keys(validateDraft(draft)).length === 0;

  useEffect(() => {
    setEtfs(getETFs());
    setTrades(getTrades());
  }, []);

  const snapshots = useMemo(() => buildSnapshots(etfs, trades), [etfs, trades]);

  function onCreateEtf() {
    const errs = validateDraft(draft);
    setDraftErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    const next: ETF = {
      id: createId("etf"),
      ...draft,
      name: draft.name.trim(),
      code: draft.code.trim(),
      startDate: draft.startDate || new Date().toISOString().slice(0, 10),
    };

    const nextEtfs = [next, ...etfs];
    saveETFs(nextEtfs);
    setEtfs(nextEtfs);

    // Stage 2A：交易仍为空；无需动 trades
    setShowCreate(false);
    setDraft((prev) => ({
      ...prev,
      name: "",
      code: "",
      startDate: "",
      initialPosition: 0,
      initialAvgCost: 0,
    }));
  }

  function onResetAll() {
    if (!confirm("确定要清空本地所有 ETF 和交易记录吗？（仅本机 localStorage）")) return;
    saveETFs([]);
    saveTrades([]);
    setEtfs([]);
    setTrades([]);
  }

  function onExport() {
    const payload = {
      etfs,
      trades,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const filename = `etf-trading-backup-${yyyy}-${mm}-${dd}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function onImportFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        if (typeof text !== "string") {
          alert("无法读取文件内容。");
          return;
        }
        const parsed = JSON.parse(text);
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !Array.isArray(parsed.etfs) ||
          !Array.isArray(parsed.trades)
        ) {
          alert("备份文件结构不正确，无法导入。");
          return;
        }
        if (
          !confirm(
            "导入将覆盖当前所有本地 ETF 和交易记录，且不可撤销。确定继续吗？"
          )
        ) {
          return;
        }
        saveETFs(parsed.etfs);
        saveTrades(parsed.trades);
        setEtfs(parsed.etfs);
        setTrades(parsed.trades);
        alert("导入成功，数据已更新。");
      } catch (err) {
        console.error(err);
        alert("导入失败：JSON 解析错误或文件不合法。");
      } finally {
        setImporting(false);
        e.target.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
  }

  return (
    <>
      <div className="section-scroll">
        <div className="section-title-row">
          <div className="section-title">ETF 列表</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn-ghost btn-ghost-pill"
              onClick={() => setShowCreate((v) => !v)}
            >
              {showCreate ? "收起新建" : "新建 ETF"}
            </button>
            <button
              type="button"
              className="btn-ghost btn-ghost-pill"
              onClick={onExport}
            >
              导出数据
            </button>
            <button
              type="button"
              className="btn-ghost btn-ghost-pill"
              onClick={() => setImporting(true)}
            >
              导入数据
            </button>
            <button
              type="button"
              className="btn-ghost btn-ghost-pill"
              onClick={onResetAll}
            >
              清空本地
            </button>
          </div>
        </div>

        {importing && (
          <div className="form-card" style={{ marginBottom: 8 }}>
            <div className="section-title">导入备份</div>
            <div className="form-field">
              <label className="form-label">
                选择 JSON 备份文件（结构需包含 etfs 与 trades 字段）
              </label>
              <input
                className="form-input"
                type="file"
                accept="application/json"
                onChange={onImportFileChange}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setImporting(false)}
              >
                取消
              </button>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="form-card">
            <div className="section-title">创建 ETF</div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">名称</label>
                <input
                  className={`form-input ${
                    draftErrors.name ? "form-input-error" : ""
                  }`}
                  value={draft.name}
                  onChange={(e) => {
                    setDraft((p) => ({ ...p, name: e.target.value }));
                    if (draftErrors.name) {
                      setDraftErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="例如：上证50ETF"
                />
                {draftErrors.name && (
                  <div className="form-error-text">{draftErrors.name}</div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">代码</label>
                <input
                  className={`form-input ${
                    draftErrors.code ? "form-input-error" : ""
                  }`}
                  value={draft.code}
                  onChange={(e) => {
                    setDraft((p) => ({ ...p, code: e.target.value }));
                    if (draftErrors.code) {
                      setDraftErrors((prev) => ({ ...prev, code: undefined }));
                    }
                  }}
                  placeholder="例如：510050"
                />
                {draftErrors.code && (
                  <div className="form-error-text">{draftErrors.code}</div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">开始日期</label>
                <input
                  className="form-input"
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft((p) => ({ ...p, startDate: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label className="form-label">初始持仓</label>
                <input
                  className={`form-input ${
                    draftErrors.initialPosition ? "form-input-error" : ""
                  }`}
                  type="number"
                  value={draft.initialPosition}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, initialPosition: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.initialPosition && (
                  <div className="form-error-text">
                    {draftErrors.initialPosition}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">初始均价</label>
                <input
                  className={`form-input ${
                    draftErrors.initialAvgCost ? "form-input-error" : ""
                  }`}
                  type="number"
                  step="0.001"
                  value={draft.initialAvgCost}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, initialAvgCost: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.initialAvgCost && (
                  <div className="form-error-text">
                    {draftErrors.initialAvgCost}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">佣金率</label>
                <input
                  className={`form-input ${
                    draftErrors.commissionRate ? "form-input-error" : ""
                  }`}
                  type="number"
                  step="0.0001"
                  value={draft.commissionRate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, commissionRate: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.commissionRate && (
                  <div className="form-error-text">
                    {draftErrors.commissionRate}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">交易所费率</label>
                <input
                  className={`form-input ${
                    draftErrors.exchangeFeeRate ? "form-input-error" : ""
                  }`}
                  type="number"
                  step="0.0001"
                  value={draft.exchangeFeeRate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, exchangeFeeRate: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.exchangeFeeRate && (
                  <div className="form-error-text">
                    {draftErrors.exchangeFeeRate}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">最低佣金</label>
                <input
                  className={`form-input ${
                    draftErrors.minCommission ? "form-input-error" : ""
                  }`}
                  type="number"
                  step="0.01"
                  value={draft.minCommission}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, minCommission: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.minCommission && (
                  <div className="form-error-text">
                    {draftErrors.minCommission}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">滑点/份额</label>
                <input
                  className={`form-input ${
                    draftErrors.slippagePerUnit ? "form-input-error" : ""
                  }`}
                  type="number"
                  step="0.0001"
                  value={draft.slippagePerUnit}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, slippagePerUnit: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.slippagePerUnit && (
                  <div className="form-error-text">
                    {draftErrors.slippagePerUnit}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">最小交易单位</label>
                <input
                  className={`form-input ${
                    draftErrors.minTradeUnit ? "form-input-error" : ""
                  }`}
                  type="number"
                  step="1"
                  value={draft.minTradeUnit}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, minTradeUnit: toNumber(e.target.value) }))
                  }
                />
                {draftErrors.minTradeUnit && (
                  <div className="form-error-text">
                    {draftErrors.minTradeUnit}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>
                取消
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={onCreateEtf}
                disabled={!isDraftValid}
              >
                保存 ETF
              </button>
            </div>
          </div>
        )}

        {snapshots.length === 0 ? (
          <div className="empty-hint">
            本地还没有任何 ETF。点击右上角「新建 ETF」创建一条记录。
          </div>
        ) : (
          <div className="etf-list">
            {snapshots.map((snapshot) => (
              <EtfCard key={snapshot.etf.id} snapshot={snapshot} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

