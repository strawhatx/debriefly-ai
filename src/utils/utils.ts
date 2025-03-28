import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FIELD_MAPPING, ImportRow } from "./types.ts";

export const mapTradeData = (
  row: Record<string, any>,
  rawHeaders: string[],
  userId: string,
  accountId: string,
  importId: string
): ImportRow => {
  const mappedHeaders = mapHeaders(rawHeaders);

  return {
    user_id: userId,
    trading_account_id: accountId,
    import_id: importId,
    symbol: normalizeSymbol(row[mappedHeaders.symbol]?.trim() || ""),
    side: normalizeSide(row[mappedHeaders.side]?.trim() || ""),
    order_type: row[mappedHeaders.order_type]?.trim() || "",
    quantity: parseInt(row[mappedHeaders.quantity] || 0, 10),
    fill_price: parseFloat(row[mappedHeaders.entry_price]) || 0,
    stop_price: parseFloat(row[mappedHeaders.exit_price]) || null,
    entry_date: row[mappedHeaders.entry_date]?.trim() || null,
    closing_date: row[mappedHeaders.exit_date]?.trim() || row[mappedHeaders.entry_date]?.trim() || null,
    status: row[mappedHeaders.status]?.trim() || "",
    fees: parseFloat(row[mappedHeaders.fees]?.trim()) || 0,
    external_id: row[mappedHeaders.external_id]?.trim() || "",
    leverage: normalizeLeverage(row[mappedHeaders.leverage]?.trim() || 0),
  };
};

const mapHeaders = (rawHeaders: string[]): Record<string, string> => {
  const mappedHeaders: Record<string, string> = {};
  Object.entries(FIELD_MAPPING).forEach(([key, variations]) => {
    const match = rawHeaders.find((h) => variations.includes(h.toUpperCase().trim()));
    if (match) mappedHeaders[key] = match;
  });
  return mappedHeaders;
};

export const normalizeSide = (side: string): string => {
  if (isNullOrEmpty(side)) throw new Error("Side is required");
  const normalized = side.toUpperCase().trim();
  if (normalized.includes("BUY") || normalized === "B") return "BUY";
  if (normalized.includes("SELL") || normalized === "S") return "SELL";
  throw new Error(`Invalid trade side: ${side}`);
};

export const normalizeSymbol = (rawSymbol: string): string => {
  if (isNullOrEmpty(rawSymbol)) throw new Error("Symbol is required");
  return rawSymbol.includes(":") ? rawSymbol.split(":")[1].trim().toUpperCase() : rawSymbol.trim().toUpperCase();
};

export const normalizeLeverage = (leverageStr: string | number): number => {
  if (typeof leverageStr === "number") return leverageStr;
  if (isNullOrEmpty(leverageStr)) return 50;

  const parts = leverageStr.split(":");
  if (parts.length > 1) {
    const parsed = parseInt(parts[0], 10);
    if (!isNaN(parsed)) return parsed;
  }

  const num = parseFloat(leverageStr);
  return isNaN(num) ? 50 : num;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const isNullOrEmpty = (str?: string): boolean => {
  return !str || str.trim().length === 0;
};
