
import { FIELD_MAPPING, ImportRow } from './types.ts';

export const mapTradeData = (row: {}, rawHeaders: {}, userId: string, accountId: string, importId: string): ImportRow => {

  const mappedHeaders = mapHeaders(rawHeaders);

  return {
    user_id: userId,
    trading_account_id: accountId,
    import_id: importId,
    symbol: normalizeSymbol(row[mappedHeaders.symbol]?.trim()),
    side: normalizeSide(row[mappedHeaders.side]?.trim()),
    order_type: row[mappedHeaders.order_type]?.trim(),
    quantity: parseInt(row[mappedHeaders.quantity], 10) || 0,
    fill_price: parseFloat(row[mappedHeaders.fill_price]) || 0,
    stop_price: parseFloat(row[mappedHeaders.stop_price]) || null,
    entry_date: row[mappedHeaders.entry_date]?.trim(),
    closing_date: row[mappedHeaders.closing_date]?.trim(),
    status: row[mappedHeaders.status]?.trim(),
    fees: parseFloat(row[mappedHeaders.fees]?.trim()) || 0,
    external_id: row[mappedHeaders.external_id]?.trim(),
    leverage: normalizeLeverage(row[mappedHeaders.leverage]?.trim())
  };
}

const mapHeaders = (rawHeaders) => {
  const mappedHeaders:any = {};
  Object.entries(FIELD_MAPPING).forEach(([key, variations]) => {
    const match = rawHeaders.find((h) => variations.includes(h.toUpperCase().trim()));
    if (match) mappedHeaders[key] = match;
  });
  return mappedHeaders;
};

export const normalizeSide = (side: string): string => {
  if (!side) throw new Error('Side is required')
  const normalized = side.toUpperCase().trim()
  if (normalized.includes('BUY') || normalized === 'B') return 'BUY'
  if (normalized.includes('SELL') || normalized === 'S') return 'SELL'
  throw new Error(`Invalid trade side: ${side}`)
}

export const normalizeSymbol = (rawSymbol: string): string => {
  // Handle TradingView format [MARKET]:[Symbol]
  const symbol = rawSymbol.includes(':') ? rawSymbol.split(':')[1] : rawSymbol;
  return symbol.trim().toUpperCase();
};

export const normalizeLeverage = (leverageStr: string | number): number => {
  if (typeof leverageStr === 'number') return leverageStr;

  if (isNullOrEmpty(leverageStr)) return 50;
  
  // Handle "X:1" format
  const result = leverageStr.split(':')[0]
  if (result) {
    return parseInt(result, 10);
  }
  
  // Try to parse as number
  const num = parseFloat(leverageStr);
  if (!isNaN(num)) {
    return num;
  }
  
  // Default leverage
  return 50;
};

const isNullOrEmpty = (str: string): boolean => {
  return str === null || str.length === 0;
}