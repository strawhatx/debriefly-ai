
export const MARKETS = ['STOCKS', 'OPTIONS', 'CRYPTO', 'FOREX', 'FUTURES'] as const;

export interface TradingAccount {
  id: string;
  account_name: string;
  broker_id: string;
  market: typeof MARKETS[number];
  account_balance: number;
  created_at: string;
  broker?: {
    id: string;
    name: string;
    description?: string;
    asset_types?: string[];
  };
}

export interface EditingAccount extends Partial<TradingAccount> {
  isNew?: boolean;
}
