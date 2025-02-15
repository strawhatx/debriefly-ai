
import { FIELD_MAPPING, ImportRow, TradeData } from './types.ts';
import { normalizeSide, normalizeSymbol, normalizeLeverage } from './trade-utils.ts';
export const mapTradeData = (row: {}, rawHeaders: {}, userId: string, accountId: string, importId: string): TradeData => {

  const mappedHeaders = mapHeaders(rawHeaders);

  return {
    user_id: userId,
    trading_account_id: accountId,
    import_id: importId,
    symbol: normalizeSymbol(row[mappedHeaders.symbol]?.trim()),
    side: normalizeSide(row[mappedHeaders.side]?.trim()),
    order_type: row[mappedHeaders.order_type]?.trim(),
    quantity: parseInt(row[mappedHeaders.quantity] || '0', 10),
    fill_price: parseFloat(row[mappedHeaders.fill_price] || 0),
    stop_price: parseFloat(row[mappedHeaders.stop_price] || 0),
    entry_date: row[mappedHeaders.entry_date]?.trim(),
    close_date: row[mappedHeaders.close_date]?.trim(),
    status: row[mappedHeaders.status]?.trim(),
    fees: row[mappedHeaders.fees]?.trim(),
    external_id: row[mappedHeaders.external_id]?.trim(),
    leverage: normalizeLeverage(row[mappedHeaders.leverage]?.trim(),)

  };
};

const mapHeaders = (rawHeaders) => {
  const mappedHeaders: ImportRow = null;
  Object.entries(FIELD_MAPPING).forEach(([key, variations]) => {
    const match = rawHeaders.find((h) => variations.includes(h.trim()));
    if (match) mappedHeaders[key] = match;
  });
  return mappedHeaders;
};