
export interface ImportRow {
  Symbol?: string;
  SYMBOL?: string;
  symbol?: string;
  Side?: string;
  SIDE?: string;
  side?: string;
  Type?: string;
  TYPE?: string;
  Qty?: string;
  QTY?: string;
  Quantity?: string;
  QUANTITY?: string;
  Size?: string;
  SIZE?: string;
  'Fill Price'?: string;
  'FILL PRICE'?: string;
  Price?: string;
  PRICE?: string;
  'Entry Price'?: string;
  'Placing Time'?: string;
  'PLACING TIME'?: string;
  'Entry Time'?: string;
  Time?: string;
  DATE?: string;
  'Closing Time'?: string;
  'CLOSING TIME'?: string;
  'Exit Time'?: string;
  'Order Type'?: string;
  'ORDER TYPE'?: string;
  'Stop Price'?: string;
  'STOP PRICE'?: string;
  Stop?: string;
  Status?: string;
  STATUS?: string;
  Commission?: string;
  COMMISSION?: string;
  Fee?: string;
  FEE?: string;
  'Order ID'?: string;
  'ORDER ID'?: string;
  'Trade ID'?: string;
  ID?: string;
}

export interface TradeData {
  user_id: string;
  trading_account_id: string;
  import_id: string;
  symbol: string;
  side: string;
  quantity: number;
  entry_price: number | null;
  exit_price: number | null;
  entry_date: string;
  exit_date: string | null;
  order_type: string | null;
  stop_price: number | null;
  status: string | null;
  fees: number;
  external_id: string | null;
}

export interface ImportSummary {
  processedCount: number;
  skippedCount: number;
  duplicateCount: number;
}
