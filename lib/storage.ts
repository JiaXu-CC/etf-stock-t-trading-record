import { ETF, Trade } from "./types";

const STORAGE_KEYS = {
  etfs: "etf-tool.etfs.v1",
  trades: "etf-tool.trades.v1",
} as const;

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function ensureBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getETFs(): ETF[] {
  if (!ensureBrowser()) return [];
  return safeJsonParse<ETF[]>(localStorage.getItem(STORAGE_KEYS.etfs), []);
}

export function saveETFs(etfs: ETF[]): void {
  if (!ensureBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.etfs, JSON.stringify(etfs));
}

export function getTrades(): Trade[] {
  if (!ensureBrowser()) return [];
  const raw = safeJsonParse<any[]>(localStorage.getItem(STORAGE_KEYS.trades), []);

  // 迁移旧数据：selfSF -> selfEvaluation
  const migrated: Trade[] = raw.map((t) => {
    if (t && typeof t === "object") {
      if ("selfEvaluation" in t) {
        return t as Trade;
      }
      if ("selfSF" in t) {
        return {
          ...t,
          selfEvaluation: t.selfSF ?? "",
        } as Trade;
      }
    }
    return {
      ...t,
      selfEvaluation: "",
    } as Trade;
  });

  // 写回一次，确保后续都用新字段
  saveTrades(migrated);
  return migrated;
}

export function saveTrades(trades: Trade[]): void {
  if (!ensureBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.trades, JSON.stringify(trades));
}

export function getTradesByEtfId(etfId: string): Trade[] {
  return getTrades().filter((t) => t.etfId === etfId);
}

export function upsertETF(next: ETF): ETF[] {
  const current = getETFs();
  const idx = current.findIndex((e) => e.id === next.id);
  const updated = [...current];
  if (idx >= 0) updated[idx] = next;
  else updated.unshift(next);
  saveETFs(updated);
  return updated;
}

export function addTrade(next: Trade): Trade[] {
  const current = getTrades();
  const updated = [next, ...current];
  saveTrades(updated);
  return updated;
}

export function updateTrade(updatedTrade: Trade): Trade[] {
  const current = getTrades();
  const next = current.map((t) => (t.id === updatedTrade.id ? updatedTrade : t));
  saveTrades(next);
  return next;
}

export function deleteTrade(tradeId: string): Trade[] {
  const current = getTrades();
  const next = current.filter((t) => t.id !== tradeId);
  saveTrades(next);
  return next;
}

export function createId(prefix: string): string {
  const g = globalThis as unknown as { crypto?: Crypto };
  const uuid =
    g.crypto && "randomUUID" in g.crypto ? g.crypto.randomUUID() : undefined;
  return uuid ? `${prefix}_${uuid}` : `${prefix}_${Date.now()}_${Math.random()}`;
}

