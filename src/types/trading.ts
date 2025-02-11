
export const BROKERS = [
  'Coinbase',
  'Webull',
  'Robinhood',
  'Tradovate',
  'Charles Schwab',
  'Oanda',
  'Forex.com',
  'TradeStation'
] as const;

export const PROFIT_CALC_METHODS = ['FIFO', 'LIFO'] as const;

export interface TradingAccount {
  id: string;
  account_name: string;
  broker_id: string;
  profit_calculation_method: typeof PROFIT_CALC_METHODS[number];
  account_balance: number;
  created_at: string;
  broker?: {
    id: string;
    name: string;
  };
}

export interface EditingAccount extends Partial<TradingAccount> {
  isNew?: boolean;
}
