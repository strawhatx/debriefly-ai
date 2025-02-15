
export const FIELD_MAPPING = {
  symbol: ['SYMBOL', 'INSTRUMENT', 'TICKER', 'PRODUCT'],
  side: ['SIDE','ACTION'],
  order_type: ['TYPE', 'ORDER TYPE', 'ORDER'],
  entry_price: ['PRICE',  'EXECUTION PRICE', 'FILL PRICE', 'ENTRY PRICE'],
  exit_price: ['STOP PRICESTOP PRICE',  'EXIT PRICE', 'STOP'],
  quantity: ['QTY', 'QUANTITY', 'LOT SIZE', 'CONTRACTS', 'SIZE', 'TRADE SIZE' ],
  fees: ['COMMISSION', 'FEE'],
  entry_date:['PLACING TIME', 'ENTRY TIME', 'TIME', 'DATE'],
  exit_date:['CLOSING TIME', 'EXIT TIME', 'EXIT DATE'],
  status: ['STATUS', 'ORDER STATUS'],
  external_id: ['ORDER ID', 'TRADE ID', 'ID'],
  leverage: ['Leverage', 'LEVERAGE']
}

export interface ImportRow {
  user_id: string;
  trading_account_id: string;
  import_id: string;
  symbol: string;
  side: string;
  quantity: number;
  fill_price: number;
  stop_price: number | null;
  entry_date: string;
  closing_date: string | null;
  order_type: string | null;
  status: string | null;
  fees: number;
  external_id: string | null;
  leverage: number;
}

export interface Position {
  user_id: string;
  trading_account_id: string;
  symbol: string;
  position_type: string;
  quantity: number;
  fill_price: number | null;
  stop_price: number | null;
  entry_date: string;
  closing_date: string | null;
  order_type: string | null;
  status: string | null;
  fees: number;
  external_id: string | null;
  leverage: number;
  multiplier: number;
  entry_trade_id: number;
  close_trade_id: number;
}

export interface ImportSummary {
  processedCount: number;
  skippedCount: number;
  duplicateCount: number;
}

