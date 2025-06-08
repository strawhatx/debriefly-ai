
export interface User {
  id: string
  roles: Role[]
}

export type Role = "admin" | "professional" | "trader" | "viewer"

export interface Broker {
  id: string
  name: string
  description?: string
  asset_types?: string[]
}

export interface BrokerConnectionField {
  id: string
  broker_id: string
  field_name: string
  field_type: string
  required: boolean
  display_name: string
  description?: string
}

export interface TradingAccount {
  id: string
  user_id: string
  account_name: string
  broker_id: string
  market?: string
  account_balance: number
}

export interface Position {
  id: string
  user_id: string
  trading_account_id: string
  symbol: string
  position_type: string
  quantity: number
  fill_price: number
  stop_price?: number
  entry_date: string
  closing_date?: string
  pnl?: number
  fees: number
}

export interface EmotionalTag {
  id: string
  tag_name: string
  category: string
  description?: string
}

export interface FuturesMultiplier {
  id: string
  symbol: string
  name?: string
  point_value: number
  tick_size?: number
  tick_value?: number
}

export interface Import {
  id: string
  user_id: string
  trading_account_id: string
  import_type: string
  status: string
  original_filename?: string
  file_path?: string
  error_message?: string
}

export interface Insight {
  id: string
  user_id: string
  trading_account_id?: string
  title: string
  description: string
  recommendation?: string
}

export interface JournalEntry {
  id: string
  user_id: string
  trading_account_id?: string
  entry_date: string
  content: string
  mood?: string
}
