
export const MARKETS = ['STOCKS', 'OPTIONS', 'CRYPTO', 'FOREX', 'FUTURES'] as const;

export type TradingAccount = {
  id: string;
  account_name: string;
  broker_id: string;
  market: string | null;
  account_balance: number;
  broker_connected?: boolean;
  created_at: string;
  user_id?: string;
};

export interface Trade {
  id: string;
  symbol: string;
  entry_date: string;
  closing_date: string | null;
  fill_price: number;
  stop_price: number;
  quantity: number;
  side: string;
  pnl: number | null;
  fees: number;
  emotional_tags: string[]
}

export interface EditingAccount extends Partial<TradingAccount> {
  isNew?: boolean;
}
